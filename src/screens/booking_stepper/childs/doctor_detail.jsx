import React, { useState } from 'react';
import { Box, Stack, Typography, Button, Grid2 as Grid } from '@mui/material'
import * as Api from "shared/services";
import { Card, CardContent, Avatar, CardActions, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';
import Helper from "shared/helper";

const GetChipStyle = (type) => {
    const colorMap = (rating) => {
        if (rating >= 4.5) return '#1F9254';      // Green
        if (rating >= 3) return '#ff9800';        // Orange
        if (rating > 0) return '#A30D11';         // Red
        return '#4CAF50';                         // Gray for "Unknown" or 0
    };
    return {
        backgroundColor: "#FBE7E8",
        color: colorMap(type) || "#4CAF50", 
        borderRadius: "22px",
        fontSize:"12px",
        fontWeight:500,
        padding:"0px",
    };
}

const InfoCard = (props) => {
  const { row, onActionClicked } = props;

  const OnActionClicked = () => {
    if(onActionClicked) onActionClicked();
  }

  return (
    <Card 
        sx={{ 
            width: 'calc(80% - 16px)', 
            border: "1px solid #624DE3", 
            borderRadius: 2, 
            p: 2, 
            display: 'flex', 
            gap: 2, 
            mb: 3
        }}
        >
        <Box sx={{ position: 'relative' }}>
            <Avatar 
                variant="rounded" 
                src={row?.logo} 
                alt="Travis Howard" 
                sx={{ width: 200, height: 200, borderRadius: 2 }}
            >
            <ImageNotSupportedIcon />
            </Avatar>
        </Box>
        <Box>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid size={{ xs: 2, sm: 4, md: 8 }}>
                    <CardContent sx={{ p: 0, flex: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {row.prop1}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} mb={1}>
                          {row.prop2}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} mb={1}>
                          Consultant - {row.prop3}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          Experience - {row.prop4}
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 4 }}  sx={{ textAlign: 'right' }}>      
                    {row.prop5 && (
                        <Chip
                            label={row.prop5 || "Unknown"}
                            sx={{ 
                              ...GetChipStyle(row.prop5) 
                            }}
                            icon={
                              <StarIcon style={{ color: GetChipStyle(row.prop5).color }} />
                            }
                        />
                    )}
                    <Typography variant="body2" fontWeight={500} mt={2}>
                       Reviewed by {row.prop6 || 0} Patients
                    </Typography>
                </Grid>

                <Grid  size={{ xs: 2, sm: 4, md: 8 }}>
                    <Typography variant="subtitle2" fontWeight={600} mt={2}>
                       Consultation Fee: {row.prop7} per session
                    </Typography>
                </Grid>
                <Grid  size={{ xs: 2, sm: 4, md: 4 }}>
                   <CardActions sx={{ px: 0 }}>
                        <Button variant="contained" 
                            sx={{ width: "100%", borderRadius : 2, fontSize: 12, fontWeight: 700, height: 32, textTransform: "unset", bgcolor: "primary.main" }}
                            onClick={() => OnActionClicked(row.id, 'view')}
                        >
                            Book Appointment
                        </Button>
                   </CardActions>
                </Grid>
            </Grid>
        </Box>
    </Card>
  )
}

const Qualification = (props) => {
   const { prop1, prop2, prop3 } = props;
    return(
        <Box>
            <Typography variant='body1' component="div" sx={{ fontWeight: "medium" }}>
                {prop1}
            </Typography>
            <Typography variant='body1' component="div">
                {prop2}
            </Typography>
            <Typography variant='body1' component="div">
                {prop3}
            </Typography>
        </Box>
    )
}

const Component = React.forwardRef((props, ref) => {

    const { id, onActionClicked } = props;

    const [initialized, setInitialized] = React.useState(false);
    const [row, setRow] = useState({});

    //  React.useImperativeHandle(ref, () => ({
    //         submit: () => onSubmit()
    //  }));

    const fetchDoctorData = async () => {
        return new Promise(async (resolve) => {
            let expands = "Qualifications,Speciality";
            
            setRow({});

            global.Busy(true);
            await Api.GetDoctorSingle(id, null, expands).then(async (res) => {
                if (res.status) {
                        let _Doctor = res.values;
                        const degrees = _Doctor?.Qualifications
                            ?.map(q => q.Degree)
                            ?.filter(Boolean)
                            ?.join(', ') || '';

                        let _row = {
                            id: _Doctor.DoctorId,
                            prop1: _Doctor.FullName,
                            prop2: degrees,
                            prop3: _Doctor.Speciality?.Name,
                            prop4: _Doctor.Experience,
                            prop5: _Doctor.OverallRating,
                            prop6: _Doctor.ReviewCount,
                            prop7: _Doctor.ConsultationFee,
                            Qualifications: _Doctor?.Qualifications,
                            About: _Doctor?.About
                        };
    
                        _Doctor.DoctorDoctorImage &&
                            await Api.GetDocumentSingleMedia(_Doctor.DoctorDoctorImage, true, null).then((resI) => {
                                _row = { ..._row, logo: resI.values };
                            })

                    setRow(_row);
                    global.Busy(false);
                }
            });
        });
    }

    if (initialized) {
        setInitialized(false);
        fetchDoctorData();
    }

    React.useEffect(() => { setInitialized(true); }, []);

    return (
        <>
            {!Helper.IsJSONEmpty(row)  && (
                <Stack direction='column' gap={2} sx={{ my: 2 }}>
                    <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold" }}>
                        Selected Doctor:
                    </Typography>
                    <InfoCard row={row || {}} onActionClicked={onActionClicked} />
                    
                    <Typography noWrap variant="h5" component="div">
                        About Doctor:
                    </Typography>
        
                    <Box>
                        <Typography variant='caption' component="div" sx={{ pb: 3, whiteSpace: "pre-line" }}>
                            {row.About}
                        </Typography>
                    </Box>
                
                    <Typography noWrap variant="h5" component="div">
                        Qualifications
                    </Typography>
        
                    {row.Qualifications && row.Qualifications.map(x => (
                        <>
                            <Qualification
                                prop1={x.Degree} 
                                prop2={x.University}
                                prop3={x.YearOfCompletion}
                            />
                        </>
                    
                    ))}
                </Stack>
            )}    
        </>
    );
})

export default Component;