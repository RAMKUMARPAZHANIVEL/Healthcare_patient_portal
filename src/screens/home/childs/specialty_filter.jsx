import React from 'react'
import  { useState, useEffect } from 'react';
import { Typography, Button, Box, Stack, Grid2 as Grid} from '@mui/material';
import { Container, SearchInput } from 'components';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Helper from "shared/helper";
import * as Api from "shared/services";

const Pagination = (props) => {

    const { page, pageSize, rowCount, onPageChange } = props;
 
    const handlePageChange = (newPage) => {
        onPageChange(newPage);
    };
    
    return (
        <Box
        sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, my: 2, alignItems: 'center', width: "100%" }}
        >
        <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                sx={{ 
                textTransform: 'none', fontSize: '12px', color: page === 0 ? '#aaa' : 'primary.main', bgcolor: 'transparent', minWidth: 'auto', borderRadius: "8px",         
                '&:hover': {
                    color: '#fff',
                    bgcolor: 'primary.main'
                },
                }}
            >
            Previous
        </Button>
    
        {Array.from({ length: Math.ceil(rowCount/pageSize) })
        .slice(0, 5)
        .map((_, i) => (
            <Button
            key={i}
            onClick={() => handlePageChange(i)}
            sx={{ 
                width: 32, height: 32, minWidth: 0, padding: 0, fontSize: '12', borderRadius: '8px', fontWeight: 500,
                backgroundColor: page === i ? 'primary.main' : '#e0e0e0',
                color: page === i ? '#fff' : '#333',
                '&:hover': {
                backgroundColor: page === i ? 'primary.main' : '#d5d5d5',
                },
            }}
            >
            {i + 1}
            </Button>
        ))}
    
        <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= Math.ceil(rowCount/pageSize) - 1}
                sx={{ 
                textTransform: 'none', fontSize: '12px', color: page >= pageSize - 1 ? '#aaa' : 'primary.main', bgcolor: 'transparent', minWidth: 'auto', borderRadius: "8px",
                '&:hover': {
                    color: 'secondary.main',
                    bgcolor: 'primary.main'
                },
                }}
            >
            Next
        </Button>
        </Box>
    );
}

const Item = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'selected',
    })(({ theme, selected  }) => ({
        backgroundColor: selected ? "#edede9" : "#fff",
        ...theme.typography.body1,
        padding: "26px 0",
        textAlign: 'center',
        color: (theme.vars ?? theme).palette.text.primary,
        boxShadow: "none",
        border: "1px solid #624DE3",
        fontWeight: "bold",
        borderRadius: "8px",
        cursor: 'pointer',
        ':hover': {
            backgroundColor: "#edede9"
        },
        ...theme.applyStyles('dark', {
            backgroundColor: selected ? '#edede9' : '#1A2027',
        }),
}));

const Component = (props) => {

    const { newRow, onFilterChange } = props;

    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 8 });
    const [sortBy, setSortBy] = useState(null);
    const [rowsCount, setRowsCount] = useState(8);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    
    const FetchResults = async () => {

        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(Name, '${searchStr}')`);
        }

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        await Api.GetSpecialtiesCount(query)
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

        await Api.GetSpecialtiesMulti(query)
            .then(async (res) => {
                if (res.status) {
                   setRows(res.values);
                }
            });
      
        global.Busy(false);
    }
    
    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    const OnFilterChange = (e) => {
        if(onFilterChange) onFilterChange({ name: "DoctorSpeciality", value: e.DocSpeId })
    }

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const handleChangePage = (newPage) => {
        setPageInfo({ page: 0, pageSize: 5 }); if (newPage) setPageInfo({ page: newPage, pageSize: pageInfo.pageSize }); 
    };

    return(
        <>
            <Box style={{ width: '100%' }}>
                <Stack direction="row" sx={{ width: "100%", justifyContent: 'space-between', alignItems: "center", mb: '16px' }}>
                    <Typography noWrap variant="subheader" component="div">
                        Browse By Specialty
                    </Typography>
                    
                    <Stack direction="row">
                        <SearchInput searchStr={searchStr}  onSearchChanged={OnSearchChanged} isOneToMany={true} />
                        {/* <Button
                            onClick={() => setInitialize(true) }
                        >
                            View All
                        </Button> */}
                    </Stack>
                </Stack>
                {rows.length ? (
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {rows.map(row => (
                            <Grid  size={{ xs: 2, sm: 4, md: 3 }}>
                                <Item onClick={() => OnFilterChange(row)}
                                    selected={newRow === row.DocSpeId}
                                >
                                    {row.Name}
                                </Item>
                            </Grid>
                        ))}
                    </Grid>
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
            </Box>
            {rows && rowsCount/pageInfo.pageSize > 1 && <Pagination
                page={pageInfo.page}
                pageSize={pageInfo.pageSize}
                rowCount={rowsCount}
                onPageChange={handleChangePage}
            />}
        </>
    )
}

export default Component