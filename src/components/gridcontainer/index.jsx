import * as React from 'react';
import { Grid } from '@mui/material';

const Component = ({ children, sx }) => {

    return (
        <>
            <Grid container sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                padding: 1,
                ...sx
            }}>
                {children}
            </Grid>
        </>
    )
}

export default Component;