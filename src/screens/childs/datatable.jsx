import React from "react";
import { Tooltip, Box, Typography, Container } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { ROWSPERPAGE } from "config";
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import sort_icon from "../../assets/sort_alt.svg";

const EditIcon = ({ color = '#624DE3' }) => {
    const theme = useTheme();
    const resolvedColor = theme.palette?.[color.split('.')[0]]?.[color.split('.')[1]] || color;
  
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        fill="none"
        viewBox="0 0 25 24"
      >
        <path
          stroke={resolvedColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11.5 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        ></path>
        <path
          stroke={resolvedColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 2.5a2.121 2.121 0 1 1 3 3L12.5 15l-4 1 1-4z"
        ></path>
      </svg>
    );
};

const TrashIcon = (props) => (
  <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        fill="none"
        viewBox="0 0 25 24"
    >
        <path
        stroke="#A30D11"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3.5 6h18M8.5 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V6zM10.5 11v6M14.5 11v6"
        ></path>
    </svg>
);

const SortIcon = () => (
  <img
    src={sort_icon}
    alt="sort"
    style={{ width: 16, height: 16, opacity: 0.6 }}
  />
);

const CustomPagination = (props) => {

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
  
const Component = (props) => {

    const { columns, rowsCount, rows, pageInfo, onActionClicked, sortBy, keyId, pageMode,
        onSortClicked, onPageClicked, sx, noActions, hideFooter, title, childId, Actions=[] } = props;

    const paginationMode = pageMode || "server";

    const OnActionClicked = (id, type) => {
        if (onActionClicked) onActionClicked(id, type);
    };

    const RenderGridActions = (props) => {
        const noView = props.noView;

        return {
            headerName: "Actions", type: 'actions', field: "actions", width: 115,
            getActions: ({ row }) => {

                const actions = [];
                if(Actions.length) {
                    Actions.map(action => {
                      actions.push(<GridActionsCellItem
                          icon={ 
                          <span style={{ color: "blue", fontSize: "14px", fontWeight: '500', textDecoration: "underline" }}>
                            {action.name}
                          </span>}    
                          label={action.name}
                          showInMenu={false}                      
                          className="textPrimary"
                          color="inherit"
                          onClick={() => OnActionClicked(row[keyId], action.type, row[childId])}
                          sx={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": {
                              color: "darkblue",
                            },
                          }}
                      />)
                    })
                    return actions;
                }

                if (!noView) {
                    actions.push(<GridActionsCellItem
                        icon={
                            <Tooltip title="View" arrow>
                                <VisibilityIcon />
                            </Tooltip>
                        }
                        label="View"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => OnActionClicked(row[keyId], 'view')}
                    />)
                }

                actions.push(<GridActionsCellItem
                    icon={
                        <Tooltip title="Edit" arrow>
                            <EditIcon color="primary.main"/>
                        </Tooltip>
                    }
                    label="Edit"
                    className="textPrimary"
                    color="inherit"
                    onClick={() => OnActionClicked(row[keyId], 'edit')}
                />);

                actions.push(<GridActionsCellItem
                    icon={
                        <Tooltip title="Delete" arrow>
                            <TrashIcon />
                        </Tooltip>
                    }
                    label="Delete"
                    color="inherit"
                    onClick={() => OnActionClicked(row[keyId], 'delete')}
                />);

                return actions;
            }
        };

    }

    const handleSortModelChange = (e) => {
        if (onSortClicked) onSortClicked(e[0]);
    }

    const handlePaginationModel = (e) => {
        if (onPageClicked) onPageClicked(e);
    }

    const GetColumns = () => {
        if (noActions) return [...columns];
        return [...columns, RenderGridActions(props)];
    }

    return (
        <Container sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            px: "0 !important"
        }}> 
            <DataGrid
                autoHeight
                disableColumnMenu
                disableColumnResize
                columns={GetColumns()}
                rowCount={rowsCount}
                rows={rows}
                rowSelection={false}
                hideFooter={hideFooter || false}
                paginationModel={pageInfo}
                initialState={{
                    pagination: {
                        paginationModel: pageInfo,
                    },
                }}
                slots={{
                    pagination: CustomPagination, 
                    columnSortedAscendingIcon: SortIcon,
                    columnSortedDescendingIcon: SortIcon,
                }}
                slotProps={{
                    pagination: {
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                    rowCount: rowsCount,
                    onPageChange: (newPage) => handlePaginationModel({ ...pageInfo, page: newPage }),
                    },
                }}
                pageSizeOptions={ROWSPERPAGE}
                sortModel={sortBy && [sortBy] || [{ field: "", sort: "asc" }]}
                paginationMode={paginationMode}
                sortingMode={paginationMode}
                onSortModelChange={handleSortModelChange}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : ""
                }
                getRowId={(row) => row[keyId]} 
                sx={{
                    "& .MuiToolbar-root .MTableToolbar-title-31": {
                        width: "100%",
                    },
                    "& .MuiDataGrid-root": {
                        padding: "15px 20px",
                        border: "none !important",
                    },
                    "& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader": {
                        border: "0 !important",
                    },
                    "& .MuiDataGrid-container--top [role=row]": {
                        overflow: "hidden",
                        border: 0,
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "700 !important",
                    },
                    "& .MuiDataGrid-cell": {
                        border: "0 !important",
                    },
                      '& .MuiDataGrid-columnHeaderTitleContainer': {
                        flexDirection: 'row',
                        justifyContent: "space-between"
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    '& .MuiDataGrid-columnHeader:focus': {
                        outline: 'none !important',
                        boxShadow: 'none',
                        border: 'none',
                    },
                }}
            />
        </Container>
    );

};

export default Component;
