import React, { useState } from 'react';
import { Box, Stack, Typography, Button, Grid2 as Grid } from '@mui/material'
import * as Api from "shared/services";
import { Card, CardContent, Avatar, CardActions, Chip } from '@mui/material';
import { ImageNotSupported as ImageNotSupportedIcon, Check as CheckIcon, Star as StarIcon } from '@mui/icons-material';
import Helper from "shared/helper";
import { useNavigate, useParams } from 'react-router-dom';
import { Container, CustomDialog } from 'components';

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

  const OnActionClicked = (id, type) => {
    if(onActionClicked) onActionClicked(id, type);
  }

  return (
    <Card 
        sx={{ 
            width: 'calc(90% - 16px)', 
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
                            {row.prop3}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            {row.prop4}
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 4 }}  sx={{ textAlign: 'right' }}>      
                    {!Helper.IsNullValue(row.prop6) && (
                        <Chip
                            label={row.prop6}
                            sx={{ 
                                ...GetChipStyle(row.prop6) 
                            }}
                            icon={
                                <StarIcon style={{ color: GetChipStyle(row.prop6).color }} />
                            }
                        />
                    )}
                    <Typography variant="body2" fontWeight={500} mt={2}>
                        {row.prop7} 
                    </Typography>
                </Grid>

                <Grid  size={{ xs: 2, sm: 4, md: 8 }}>
                    <Typography variant="subtitle2" fontWeight={600} mt={2}>
                        {row.prop5}
                    </Typography>
                </Grid>
                
                {row.childId ? (
                    <Grid  size={{ xs: 2, sm: 4, md: 10 }}>
                        <CardActions sx={{ px: 0 }}>
                            <Button variant="outlined" color="error"
                                sx={{ width: "100%", borderRadius : 2, fontSize: 12, fontWeight: 700, height: 42, textTransform: "unset" }}
                                onClick={() => OnActionClicked(row.id, 'delete')}
                            >
                                Cancel Appointment
                            </Button>
                            {row.status !== "Rescheduled" && (
                                <Button variant="contained" startIcon={<CheckIcon />}
                                    sx={{ width: "100%", borderRadius : 2, fontSize: 12, fontWeight: 700, height: 42, textTransform: "unset", bgcolor: "primary.main" }}
                                    onClick={() => OnActionClicked(row.id, 'edit')}
                                >
                                    Reshedule Appointment
                                </Button>
                            )}
                        </CardActions>
                    </Grid>
                ) : (
                     <Typography variant="body2" fontWeight={500} mt={2} color='red'>
                        Appointment Cancelled
                    </Typography>
                )}
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

const Component = (props) => {

    // const { onActionClicked } = props;

    const [initialized, setInitialized] = React.useState(false);
    const [row, setRow] = useState({});
    const [deletedId, setDeletedId] = useState(0);
    const [slotId, setSlotId] = useState(0);

    const { id } = useParams();
    const NavigateTo = useNavigate();

    const fetchDoctorData = async () => {
        return new Promise(async (resolve) => {
            let expands = "ConsultedDoctor";
            
            setRow({});

            global.Busy(true);
            await Api.GetAppointmentSingle(id, null, expands).then(async (res) => {

                if (res.status) {
                    let _Appointment = res.values;
                    const res1 = await Api.GetDoctorSingle(_Appointment.AppointmentConsultedDoctor, "$expand=Qualifications,Speciality")
                    const ConsultedDoctor = res1.values;    
                    const degrees = _Appointment?.Qualifications
                            ?.map(q => q.Degree)
                            ?.filter(Boolean)
                            ?.join(', ') || '';

                            let _row = {
                                id: _Appointment.AppointmentId,
                                childId: _Appointment.AppointmentAllotedSlot,
                                prop1: ConsultedDoctor.FullName,
                                prop2: degrees,
                                prop3: `Consultant - ${ConsultedDoctor.Speciality?.Name}`,
                                prop4: `Experience - ${ConsultedDoctor.Experience}`,
                                prop5: `${Helper.ToDate(_Appointment.Date, "MMM Do")}, ${_Appointment.StartTime}`,
                                prop6: ConsultedDoctor.OverallRating,
                                prop7: `Reviewed by ${ConsultedDoctor.ReviewCount || 0} Patients`,
                                Qualifications: ConsultedDoctor?.Qualifications,
                                About: _Appointment.ConsultedDoctor?.About,
                                status: _Appointment.Status
                            };
                        
    
                        ConsultedDoctor.DoctorDoctorImage &&
                            await Api.GetDocumentSingleMedia(ConsultedDoctor.DoctorDoctorImage, true, null).then((resI) => {
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

    
    const onActionClicked = async (id, type) => {
        let _route;

        await Api.GetAppointmentSingle(id).then(res => {
            if(res.status) {
                const { AppointmentConsultedDoctor, AppointmentAllotedSlot  } = res.values;
                
                if (type === 'delete') { setDeletedId(id); setSlotId(AppointmentAllotedSlot); return; }
                if (type === 'edit') {
                    _route = `/book-appointment/?appointment=${id}&doctor=${AppointmentConsultedDoctor}&slot=${AppointmentAllotedSlot}`;
                }

                if (_route) NavigateTo(_route);
            }
        });
    }

    const onCancelAppointment = async (id) => {
        const slot = [
                    { key: "SlotId", value: parseInt(id) }, 
                    { key: "SlotBookedAppointment", value: null }
                ];
        await Support.AddOrUpdateSlot(slot, [])       
    }

    const onResheduleAppointment = () => {

    }

    const OnCloseClicked = async (e) => {
        if (e) {
            global.Busy(true);
            await Api.SetSlotSingle({ SlotId: slotId, SlotBookedAppointment: null }).then(async res => {
                if(res.status) {
                    const res1 = await Api.SetAppointmentSingle({ AppointmentId:  id, Status: 'Cancelled', AppointmentAllotedSlot: null });
                    if (res1.status) {
                        NavigateTo("/Appointments");
                        global.AlertPopup("success", "Record is deleted successful.!");
                    } else {
                        const msg = res1.statusText || defaultError;
                        global.AlertPopup("error", msg);
                    }
                }
            })
            global.Busy(true);
        } else {
            setDeletedId(0);
        }
    }

    return (
        <>
            <Container {...props}>
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

                <CustomDialog open={deletedId} action={'delete'} title={"Confirmation"} onCloseClicked={OnCloseClicked}>
                    <Typography gutterBottom>
                        Are you sure? You want to delete?
                    </Typography>
                </CustomDialog>
            </Container>
        </>
    );
}

export default Component;