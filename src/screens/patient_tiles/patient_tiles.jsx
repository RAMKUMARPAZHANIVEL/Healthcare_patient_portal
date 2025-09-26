
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Container } from "components";
import DataGrid from "./childs/datagrid";
import * as Api from "shared/services";

import { SearchInput, ToggleButtons, CustomDialog } from "components";
import Helper from "shared/helper";
import { Add as AddBoxIcon } from '@mui/icons-material';

const defaultError = "Something went wroing while creating record!";

const Component = (props) => {
    const { title } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [deletedId, setDeletedId] = useState(0);

    const NavigateTo = useNavigate();

    const FetchResults = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);
        setDeletedId(0);
        setShowConfirm(false);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(FullName, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetPatientsCount(query)
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

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        
        let _rows = [];
        await Api.GetPatientsMulti(
            query, 
            "ProfilePicture"
            )
            .then(async (res) => {
                if (res.status) {
                    _rows = res.values || [];
                    for (let i = 0; i < _rows.length; i++) {
                        _rows[i].id = Helper.GetGUID();
                                                                                                
                        _rows[i].ProfilePicture &&
                            await Api.GetDocumentSingleMedia(_rows[i].ProfilePicture.DocId, true, "image/jpeg").then((rslt) => {
                                _rows[i].PatientProfilePictureData = rslt.values;
                            })
                                            }
                } else {
                    console.log(res.statusText);
                }
            });

        setRows(_rows);
        global.Busy(false);
        return _rows;
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnSortClicked = (e) => { setSortBy(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const OnDeleteClicked = (e) => { setDeletedId(e); }

    const OnCloseClicked = async (e) => {
        if (e) {
            const rslt = await Api.SetPatientSingle({ PatientId: deletedId, Deleted: true });
            if (rslt.status) {
                setInitialize(true);
                global.AlertPopup("success", "Record is deleted successful.!");
            } else {
                const msg = rslt.statusText || defaultError;
                global.AlertPopup("error", msg);
            }
        } else {
            setDeletedId(0);
            setShowConfirm(false);
        }
    }

    const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/Patients/edit/${id}`;
        if (type === 'view') _route = `/Patients/view/${id}`;
        if (type === 'delete') setDeletedId(id);;
        if (_route) NavigateTo(_route);
    }

    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [sortBy, pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    useEffect(() => { if (deletedId > 0) setShowConfirm(true); }, [deletedId]);

    return (

        <>
            <Container {...props}>
               <Box style={{ width: '100%' }}>
                    <Box sx={{ width: '100%', borderBottom: "1px solid #E4E4E4"  }}>
                        <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold", fontSize: "24px", mb: 2.5 }}>
                            {title}
                        </Typography>
                    </Box>
                    <Stack direction="row" sx={{ width: "100%", justifyContent: 'space-between', alignItems: "center", my: '16px' }}>
                        <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                        <Button variant="contained" startIcon={<AddBoxIcon sx={{ width : 16 }}/>}
                            sx={{ borderRadius : 2, fontSize: 12, fontWeight: 700, height: 32, textTransform: "unset" }}
                            onClick={() => NavigateTo("/Patients/create")}
                            data-testid="add-button"
                        >Add Sales Patient</Button>
                    </Stack>
                </Box>
                {rowsCount > 0 ? (
                    <Box style={{ width: '100%' }}>
                        <DataGrid keyId={'Product_id'} rowsCount={rowsCount} rows={rows} sortBy={sortBy} pageInfo={pageInfo} onActionClicked={OnActionClicked}
                            footerItems={[{ name: "Size", value: "Size" }, { name: "Weight", value: "Weight" }]}
                            onSortClicked={OnSortClicked} onPageClicked={OnPageClicked} onDeleteClicked={OnDeleteClicked} />
                    </Box>
                ) : (
                    <Box component={"div"} sx={{
                        mt: 5,
                        display: "flex", width: '100%',
                        height: 150, backgroundColor: "background.surface",
                        justifyContent: "center", alignItems: "center",
                        border: "1px solid lightgray"
                    }}>
                        <Typography noWrap variant="colorcaption" component="div" sx={{ fontSize: "0.95rem" }}>
                            No Records found
                        </Typography>
                    </Box>

                )}
                <CustomDialog open={showConfirm} action={'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>

    );

};

export default Component;