import React, { useState, useEffect } from "react";
import { Typography, Grid, Stack, Box, Divider, IconButton, useTheme, Button, MenuItem } from '@mui/material';
import { Add as AddBoxIcon } from '@mui/icons-material';
import { Container } from "components";
import { SearchInput, CustomDialog, TextInput } from "components";
import { GetPaymentsMulti, GetPaymentsCount, SetPaymentSingle } from "shared/services";
import Support from "shared/support";
import Helper from "shared/helper";
import { DataTable } from '../childs';
import { ValidatorForm } from 'react-material-ui-form-validator';
import dayjs from "dayjs";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const columns = [
    { headerName: "PaidBy", field: "PaidBy", flex: 1, editable: false },
    { headerName: "Date", field: "Date", flex: 1, editable: false },
    { headerName: "Time", field: "Time", flex: 1, editable: false },
    { headerName: "Amount", field: "Amount", flex: 1, editable: false },
    { headerName: "Method", field: "Method", flex: 1, editable: false },
    { headerName: "Status", field: "Status", flex: 1, editable: false },
];

const dataColumns = [
    { key: "PaymentId", type: "keyid" },
    { key: "PaidBy", label: "Type", type: "text", value: null },
    { key: "Date", label: "Type", type: "text", value: null },
    { key: "Time", label: "Type", type: "text", value: null },
    { key: "Amount", label: "Type", type: "text", value: null },
    { key: "Method", label: "Type", type: "text", value: null },
    { key: "Status", label: "Type", type: "text", value: null }
];

const httpMethods = { add: 'POST', edit: 'PATCH', delete: 'DELETE' };
const httpMethodResponse = {
    POST: { success: 'created', failed: 'creating' },
    PATCH: { success: 'updated', failed: 'updating' },
    DELETE: { success: 'deleted', failed: 'deleting' }
};

const filtermap = {
    1 : { title: "Appointments Today", label: 'This week', filter: `` },
    2 : { title: "Upcoming Appointments", label: 'Thin month', filter: "$filter=Status eq healthNestBe.AppointmentStatus'Pending'" },
    3 : { title: "Appointments This Month", label: 'Past', filter: "$filter=Status eq healthNestBe.AppointmentStatus'Completed'" }
}

 const sumFloat = (list) => {
    return list.reduce((sum, x) => sum + parseFloat(x['Amount'] || 0), 0);
 };

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [sortBy, setSortBy] = useState(null);
    const [actions, setActions] = useState({ id: 0, action: null });
    const [payment, setPayment] = useState({ 
	PaymentId: null,
    PaidBy: null,
    Date: null,
    Time: null,
    Amount: null,
    Method: null,
    Status: null
    });
    const [filterIndex, setFilterIndex] = useState(1);
    const [total, setTotal] = useState(0);

    const form = React.useRef(null);

    const LoadData = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(Time, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await GetPaymentsCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                } else {
                    console.log(res.statusText);
                }
            });

        if (!Helper.IsJSONEmpty(sortBy)) {
            filters.push(`$orderby=${sortBy.field} ${sortBy.sort}`);
        }

        if(filterIndex) {
            filters.push(filtermap[filterIndex].filter);
        }

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [], _total = 0;
        await GetPaymentsMulti(query)
            .then(async (res) => {
                if (res.status) {
                    _rows = Helper.GroupBy(res.values, "Date");
                    _total = sumFloat(res.values);
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        setTotal(_total)
        global.Busy(false);
    }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }
    const OnSortClicked = (e) => { setSortBy(e); }
    const OnSearchChanged = (e) => { setSearchStr(e); }
    const OnInputChange = (e) => { setPayment((prev) => ({ ...prev, [e.name]: e.value })); }

    const OnActionClicked = (id, type) => {
        ClearSettings();
        setActions({ id, action: type });
        if (type === 'edit' || type === 'delete') {
            const { 
			PaymentId,
            PaidBy,
            Date,
            Time,
            Amount,
            Method,
            Status
            } = rows.find((x) => x.PaymentId === id);
            setPayment({ 
			PaymentId,
            PaidBy,
            Date,
            Time,
            Amount,
            Method,
            Status
            });
        }
    }

    const ClearSettings = () => {
        setActions({ id: 0, action: null });
        setPayment({ 
		PaymentId: null,
        PaidBy: null,
        Date: null,
        Time: null,
        Amount: null,
        Method: null,
        Status: null
        });
    }

    const OnCloseClicked = (e) => {
        if (!e) {
            ClearSettings();
            return;
        }
        if (actions.action === 'add' || actions.action === 'edit') {
            if (form) form.current.submit();
        } else if (actions.action === 'delete') {
            handleSubmit();
        }
    }

    const handleSubmit = async () => {
        const httpMethod = httpMethods[actions.action] || null;
        await DoAction({ httpMethod, ...payment })
            .then((status) => {
                if (status) {
                    setInitialize(true);
                    ClearSettings();
                    setPageInfo({ page: 0, pageSize: 5 });
                }
            });
    }

    const DoAction = async (params) => {
        return new Promise(async (resolve) => {
            const { success, failed } = httpMethodResponse[params.httpMethod];
            global.Busy(true);
            let data = { ...params, Deleted: params.httpMethod === 'DELETE' };
            delete data["httpMethod"];
            
            let dataItems = Helper.CloneObject(dataColumns);
            dataItems.forEach(e => {
                e.value = data[e.key];
            });

            let numfields = Helper.GetAllNumberFields(dataItems);
            if (numfields.length > 0) Helper.UpdateNumberFields(dataItems, numfields);

            const { status } = await Support.AddOrUpdatePayment(dataItems);
            if (status) {
                global.AlertPopup("success", `Record is ${success} successful!`);
            } else {
                global.AlertPopup("error", `Something went wroing while ${failed} record!`);
            }
            global.Busy(false);
            return resolve(status);
        });
    }

    if (initialize) { setInitialize(false); LoadData(); }
    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr, filterIndex]);
    useEffect(() => { setInitialize(true); }, []);

    const handleChange = (event) => {
        setFilterIndex(event.target.value);
    };

    return (
        <>
            <Container {...props}>
                <Stack direction="column" gap={3} style={{ width: '100%' }}>
                    <Stack direction="row" justifyContent={'space-between'} sx={{ width: "100%", my: 1 }}>
                        <Typography noWrap variant="subheader" component="div">
                            {title}
                        </Typography>
                        <Box>
                            <Typography noWrap variant="subheader" component="div">
                                <span style={{ color: '#606060'}}>{filtermap[filterIndex].label}’s Revenue:</span>&nbsp; ₹{total}
                            </Typography>
                            <Stack direction="row" alignItems={'center'} sx={{ mt: 3, gap: 2 }}>
                                <FormControl sx={{ width: 120 }}>
                                    <Select
                                        value={filterIndex}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{ width: '120px' }}
                                    >
                                    {Object.entries(filtermap).map(([key, { label }]) => (
                                        <MenuItem key={key} value={Number(key)}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                            </Stack>
                        </Box>                          
                    </Stack>

                    {Object.keys(rows).map(key => (
                        <Box sx={{ border: '1px solid #E7E7E7', borderRadius: 2 }}>
                            <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold", fontSize: "24px", py: 2, px: 4, borderBottom: '1px solid #E7E7E7' }}>
                                {dayjs(key).format("dddd Do")}
                            </Typography>
                            <DataTable keyId={'PaymentId'} columns={columns} rowsCount={rowsCount} rows={rows[key]} noView={true}
                                sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                                onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} />
                        </Box>
                    ))}
                </Stack>


                <CustomDialog open={actions.action == 'delete'} action={actions.action} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>

                <CustomDialog width="auto" open={actions.action == 'add'} action={actions.action} title={"Add Payments"} onCloseClicked={OnCloseClicked}>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter PaidBy</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"PaidBy"} name={"PaidBy"} value={payment.PaidBy} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Date</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Date"} name={"Date"} value={payment.Date} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Time</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Time"} name={"Time"} value={payment.Time} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Amount</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Amount"} name={"Amount"} value={payment.Amount} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Method</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Method"} name={"Method"} value={payment.Method} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Status</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Status"} name={"Status"} value={payment.Status} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </CustomDialog>

                <CustomDialog width="auto" open={actions.action == 'edit'} action={actions.action} title={"Edit Product Type"} onCloseClicked={OnCloseClicked}>
                    <ValidatorForm ref={form} onSubmit={handleSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter PaidBy</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"PaidBy"} name={"PaidBy"} value={payment.PaidBy} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Date</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Date"} name={"Date"} value={payment.Date} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Time</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Time"} name={"Time"} value={payment.Time} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Amount</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Amount"} name={"Amount"} value={payment.Amount} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Method</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Method"} name={"Method"} value={payment.Method} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography noWrap gutterBottom>Enter Status</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput editable={true} id={"Status"} name={"Status"} value={payment.Status} validators={[]}
                                    validationMessages={[]} OnInputChange={OnInputChange} />
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </CustomDialog>

            </Container>
        </>
    )

}

export default Component;
