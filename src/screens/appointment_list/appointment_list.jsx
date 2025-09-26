
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid2 as Grid, Typography, IconButton, useTheme, Button, Tabs, Tab } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Container, Pagination } from "components";
import { DataList, DataTable } from '../childs';
import * as Api from "shared/services";
import { SearchInput, ToggleButtons } from "components";
import { Add as AddBoxIcon } from '@mui/icons-material';
import Helper from "shared/helper";
import dayjs from "dayjs";
import { Card, CardContent, Avatar, CardActions, Chip } from '@mui/material';
import { ImageNotSupported as ImageNotSupportedIcon, Check as CheckIcon, Star as StarIcon } from '@mui/icons-material';
import Session from "shared/session";
import styled from "@emotion/styled";

const tableActions = [{ name: "View Details", type: "view" }];

const columns = [
  {
    headerName: "FullName",
    field: "ConsultedDoctor.FullName",
    flex: 1,
    editable: false,
    valueGetter: (value, row) => Helper.getNestedValue(row, "ConsultedDoctor.FullName") || ''
  },
  {
    headerName: "Phone Number",
    field: "ConsultedDoctor.PhoneNumber",
    flex: 1,
    editable: false,
    valueGetter: (value, row) => Helper.getNestedValue(row, "ConsultedDoctor.PhoneNumber") || ''
  },
  {
    headerName: "ConsultationFee",
    field: "ConsultedDoctor.ConsultationFee",
    flex: 1,
    editable: false,
    valueGetter: (value, row) => Helper.getNestedValue(row, "ConsultedDoctor.ConsultationFee") || ''
  },
  { headerName: "StartTime", field: "StartTime", flex: 1, editable: false },
  { headerName: "Status", field: "Status", flex: 1, editable: false },
];

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(0, 0, 0, 0.7)',
    '&.Mui-selected': {
      color: 'rgba(98, 77, 227, 1)',
      fontWeight: '700'
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);

const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
const today = dayjs().format("YYYY-MM-DD");

const filtermap = [
    { title: "Appointments Today", label: 'Today', filter: `Date eq ${today}` },
    { title: "Upcoming Appointments", label: 'Upcoming', filter: `Date ge ${today}` },
    { title: "Appointments This Month", label: 'Past', filter: `Date ge ${startOfMonth} and Date le ${today}` }
]

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 1 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState({});
    const [searchStr, setSearchStr] = useState("");
    const [filterIndex, setFilterIndex] = useState(0);

    const NavigateTo = useNavigate();

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }
    const OnPageClicked = (newPage) => {
        setPageInfo({ page: 0, pageSize: pageInfo.pageSize }); if (newPage) setPageInfo({ page: newPage, pageSize: pageInfo.pageSize }); 
    };

    const FetchResults = async () => {
        let query = null, filters = [], expand = "ConsultedDoctor";
        setRows([]);
        setRowsCount(0);   
        global.Busy(true);

        const Id = Session.Retrieve("PatientId");
        const dQery = `$filter=AppointmentBookedBy eq ${parseInt(Id)}`;

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(Complaints, '${searchStr}')`);
        }

         if(!Helper.IsNullValue(filterIndex)) {
            filters.push(`${dQery} and ${filtermap[filterIndex].filter}`);
        }     

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetAppointmentsCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                    console.log(res.values);
                } else {
                    console.log(res.statusText);
                }
            });

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }
        
        let _rows = [];
        await Api.GetAppointmentsMulti(query, expand).then(async (res) => {
            if (res.status) {
                _rows = Helper.GroupBy(res.values, "Date");
            }
        });

        setRows(_rows);
        global.Busy(false);
    }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [pageInfo, searchStr, filterIndex]);

    useEffect(() => { setInitialize(true); }, []);

    const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'create') _route = `/book-appointment`;
        if (type === 'view') _route = `/Appointments/view/${id}`;
        if (_route) NavigateTo(_route);
    }

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%' }}>
                    <Box sx={{ width: '100%'  }}>
                        <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold", fontSize: "24px", my: 3 }}>
                            {title}
                        </Typography>
                    </Box>
                    <Stack direction="row" sx={{ width: "100%", justifyContent: 'flex-end', alignItems: "center" }}>
                        {/* <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} /> */}
    
                        <Button variant="contained" startIcon={<AddBoxIcon sx={{ width : 16 }}/>}
                            sx={{ borderRadius : 2, fontSize: 12, fontWeight: 700, height: 32, textTransform: "unset", bgcolor: "primary.main" }}
                            onClick={() => NavigateTo("/book-appointment")}
                        >
                            Book Appointment
                        </Button>
                    </Stack>
                </Box>

                <Box sx={{ width: '100%', my: 2, borderBottom: 1, borderColor: 'divider'  }}>
                    <Tabs value={filterIndex} onChange={(e, v) => setFilterIndex(v)}>
                        {filtermap.map((tab, key) => (
                            <StyledTab
                                key={key+1}
                                label={tab.title}
                                sx={{ fontSize: '14px', fontWeight: '500' }}
                            />
                        ))}
                    </Tabs>
                </Box>

                <Stack direction="column" sx={{ width: '100%', gap: 3, mt: 2 }}>
                    {!Helper.IsJSONEmpty(rows) ? (
                          Object.keys(rows).map(key => (
                            <Box sx={{ border: '1px solid #E7E7E7', borderRadius: 2 }}>
                                <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold", fontSize: "24px", py: 2, px: 4, borderBottom: '1px solid #E7E7E7' }}>
                                    {dayjs(key).format("MMMM DD YYYY")}
                                </Typography>
                                <DataTable keyId={'AppointmentId'} columns={columns} rowsCount={rowsCount} rows={rows[key]}
                                    sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                                    onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} childId={'AppointmentBookedBy'} Actions={tableActions} hideFooter={true}
                                />
                            </Box>
                          ))
                        ) : (
                            <Box component={"div"} sx={{
                                mt: 2,
                                display: "flex", width: '100%',
                                height: 150, backgroundColor: "background.surface",
                                justifyContent: "center", alignItems: "center",
                                border: "1px solid lightgray"
                            }}>
                                <Typography noWrap variant="colorcaption" component="div" sx={{ fontSize: "0.95rem" }}>
                                    No appointments found
                                </Typography>
                            </Box>
                        )
                    }

                    {!Helper.IsJSONEmpty(rows) && rowsCount/pageInfo.pageSize > 1 && 
                        <Pagination
                            page={pageInfo.page}
                            pageSize={pageInfo.pageSize}
                            rowCount={rowsCount}
                            onPageChange={OnPageClicked}
                        />
                    }
                </Stack>
            </Container>
        </>
    );
};

export default Component;
