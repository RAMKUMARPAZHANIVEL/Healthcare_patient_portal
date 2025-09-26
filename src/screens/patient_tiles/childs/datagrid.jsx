import React from "react";
import { TablePagination, Typography, Grid2 as Grid, Box } from '@mui/material';
import { ROWSPERPAGE } from "config";

import { GridContainer, CardItem } from "components";


    const getGenderStyle = (gender) => {
    const colorMap = {
      Male: "#4CAF50",
      Female: "#2196F3",
      Others: "#FF9800",
    };
    return {
        backgroundColor: "#FBE7E8",
        color: colorMap[gender?.toUpperCase()] || "#607D8B", 
        borderRadius: "22px",
        fontSize:"12px",
        fontWeight:500,
        padding:"0px",
        marginBottom:"12px"
    };
}
    const getMedicalInformationStyle = (medicalInformation) => {
    const colorMap = {
    };
    return {
        backgroundColor: "#FBE7E8",
        color: colorMap[medicalInformation?.toUpperCase()] || "#607D8B", 
        borderRadius: "22px",
        fontSize:"12px",
        fontWeight:500,
        padding:"0px",
        marginBottom:"12px"
    };
}

const Component = (props) => {

    const { rowsCount, rows, pageInfo, onActionClicked, onPageClicked, footerItems } = props;

    const handleChangePage = (event, newPage) => {
        const _page = { page: newPage, pageSize: pageInfo.pageSize };
        if (onPageClicked) onPageClicked(_page);
    };

    const handleChangeRowsPerPage = (event) => {
        const _page = { page: 0, pageSize: parseInt(event.target.value) };
        if (onPageClicked) onPageClicked(_page);
    };

    const OnActionClicked = (id, type) => {
        if (onActionClicked) onActionClicked(id, type);
    };

    return (
        <>
            <GridContainer sx={{ gap: "32px" }}>
                {rows && rows.map((x, index) => (
                    <Box key={`${x.PatientId}_${index}`}
                        sx={{ 
                            borderRadius: "8px", border : "1px solid transparent", 
                            ":hover" : { borderColor : "#E4E4E4", cursor: "pointer" }
                           }}
                        onClick={() => OnActionClicked(x.PatientId, 'view')}
                        data-testid={`view-action-3`}
                     >
                        <CardItem keyid={x.PatientId} row={x} title={x.FullName}  imgsrc={x.PatientProfilePictureData}  width={250}
                            footerItems={[]} description={x.Email}  chipLabel={x.Email} chipStyle={getMedicalInformationStyle(x.Email)} >
                        <Grid container direction="column">
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {x.DateOfBirth && x.DateOfBirth}
                            </Typography>
                        </Grid>
                        </CardItem>
                    </Box>
                ))}
            </GridContainer>
            {rows && rows.length >  0 && rowsCount > 5 && <TablePagination
                component="div"
                count={rowsCount}
                page={pageInfo.page}
                rowsPerPageOptions={ROWSPERPAGE}
                onPageChange={handleChangePage}
                rowsPerPage={pageInfo.pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '50%',
                      color: 'white',
                      backgroundColor: 'pink',
                      '&.Mui-selected': {
                        backgroundColor: '#004ba0',
                      },
                    },
                  }}
            />}
        </>
    );

};

export default Component;
