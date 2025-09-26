import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia, Grid2 as Grid, Chip } from '@mui/material';
import { Typography } from '@mui/material';

const Component = (props) => {

    const { title, description, imgsrc, children, width, sx, chipLabel, chipStyle } = props;

    return (
        <>
            <Grid item >
                <Card sx={{
                    width: width || 345,
                    height: '100%',
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "none",
                    borderRadius: "8px",
                    ...sx
                }}>
                    {imgsrc ? (
                        <CardMedia
                            component="img"
                            sx={{ height: 250, borderRadius: "8px" }}
                            src={imgsrc}
                        />
                    ) : (
                        <CardMedia sx={{
                            height: 250,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#F6F6F6",
                            textAlign: "center",
                            borderRadius: "8px",
                            fontSize: "12px"
                        }}>
                            Preview <br /> Not Available
                        </CardMedia>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                        {chipLabel && <Chip label={chipLabel} sx={chipStyle} />}
                        <Typography variant="body2" component="p" sx={{ fontWeight: 600, ":hover" : {color : "primary.main"} }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="p" sx={{ fontWeight: 500, my: 0.5 }}>
                            {description}
                        </Typography>
                        {children}
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}

export default Component;
