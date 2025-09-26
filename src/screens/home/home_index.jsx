import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Stack, Grid2 as Grid} from '@mui/material';
import { Container, SearchInput } from 'components';
import { ArrowRightAlt as ArrowRightAltIcon } from '@mui/icons-material';
import * as Api from "shared/services";
import Helper from "shared/helper";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { DoctorList, HealthNestDetail, SpecialtyFilter } from './childs';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Card, CardContent, Avatar, CardActions, Chip } from '@mui/material';
import { ImageNotSupported as ImageNotSupportedIcon, Star as StarIcon } from '@mui/icons-material';
import Session from "shared/session";

dayjs.extend(isSameOrAfter);
const specialties = [ {name: "General Physician", description: ""}, {name: "Pediatrics", description: ""},  {name: "Dermatology", description: ""},  {name: "Psychiatry", description: ""},  {name: "Psychology", description: ""},  {name: "Gastroenterology", description: ""},  {name: "Cardiology", description: ""},  {name: "Neurology", description: ""}];
const filters = [ {name: "Specialty", value: "General"} ];

const appointmentFilter = `$filter==AppointmentBookedBy eq 'Nimit Sharma' and Status eq healthNestBe.AppointmentStatus'Pending' `

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
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
    backgroundColor: '#1A2027',
  }),
}));

const GetChipStyle = (type) => {
    const colorMap = (rating) => {
        if (rating >= 4.5) return '#1F9254';      // Green
        if (rating >= 3) return '#ff9800';        // Orange
        if (rating > 0) return '#A30D11';         // Red
        return '#A30D11';                         // Gray for "Unknown" or 0
    };
    return {
        backgroundColor: "#FBE7E8",
        color: colorMap(type) || "#A30D11", 
        borderRadius: "22px",
        fontSize:"12px",
        fontWeight:500,
        padding:"0px",
    };
}

const InfoCard = (props) => {
  const { row, onActionClicked, sx } = props;

  const OnActionClicked = (id, type) => {
    if(onActionClicked) onActionClicked(id, type);
  }

  return (
    <Card 
        sx={{ 
            width: 'calc(80% - 16px)', 
            borderRadius: 2, 
            p: 2, 
            display: 'flex', 
            gap: 2, 
            mt: 2,
            ...sx
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
                <Grid  size={{ xs: 2, sm: 4, md: 4 }}>
                   <CardActions sx={{ px: 0 }}>
                        <Button variant="contained" 
                            sx={{ width: "100%", borderRadius : 2, fontSize: 12, fontWeight: 700, height: 42, textTransform: "unset", bgcolor: "primary.main" }}
                            onClick={() => OnActionClicked(row.id, 'view')}
                        >
                            View Details
                        </Button>
                   </CardActions>
                </Grid>
            </Grid>
        </Box>
    </Card>
  )
}

const HomeIntro = () => {
    const [row, setRow] = useState({});
    const [initialize, setInitialize] = useState(false);
    const NavigateTo = useNavigate();

    const getLatestAppointment = (slots) => {
       const now = dayjs();

       return slots
        .filter(slot => {
            const slotTime = dayjs(`${slot.Date}T${slot.StartTime}`);
            return slot.Status === 'Pending' && slotTime.isSameOrAfter(now);
        })
        .sort((a, b) =>
            dayjs(`${b.Date}T${b.StartTime}`).diff(dayjs(`${a.Date}T${a.StartTime}`))
        )[0];
    };

    const fetchPatient = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            let query = null, Id;

            const username = Session.Retrieve("Username");
            query = `$filter=Email eq '${username}'`

            await Api.GetPatientsMulti(query)
                .then(async (res) => {
                    if(res.status) {
                        const { PatientId } = res.values?.at(0);
                        Session.Store("PatientId", PatientId);
                        Id = PatientId;
                    }
                });
                global.Busy(false);
                resolve(Id);
            });
    }

    const fetchData = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const PatientId = await fetchPatient();
            const defaultFilter = `$filter=AppointmentBookedBy eq ${PatientId} and Status eq healthNestBe.AppointmentStatus'Pending'`
            let query = null, filters = [];
            setRow({});

            filters.push(defaultFilter);

            if (!Helper.IsJSONEmpty(filters)) {
                query = filters.join("&");
            }

            global.Busy(true);
            await Api.GetAppointmentsMulti(query)
                .then(async (res) => {
                    if(res.status) {
                        const _Appointment = getLatestAppointment(res.values);
                        if(!Helper.IsJSONEmpty(_Appointment)) {
                            const expands = "Qualifications,Speciality"
                            const res1 = await Api.GetDoctorSingle(_Appointment.AppointmentConsultedDoctor, "", expands);
                            const ConsultedDoctor = res1.values;
                            
                            const degrees = ConsultedDoctor?.Qualifications
                                ?.map(q => q.Degree)
                                ?.filter(Boolean)
                                ?.join(', ') || '';
    
                            let _row = {
                                id: _Appointment.AppointmentId,
                                prop1: ConsultedDoctor.FullName,
                                prop2: degrees,
                                prop3: `Consultant - ${ConsultedDoctor.Speciality.Name}`,
                                prop4: `Experience - ${ConsultedDoctor.Experience}`,
                                prop5: `${Helper.ToDate(_Appointment.Date, "MMM Do")}, ${_Appointment.StartTime}`,
                                prop6: _Appointment.OverallRating,
                                prop7: ConsultedDoctor.ReviewCount && `Reviewed by ${ConsultedDoctor.ReviewCount} Patients`
                            };
        
                            ConsultedDoctor?.DoctorDoctorImage &&
                                await Api.GetDocumentSingleMedia(ConsultedDoctor?.DoctorDoctorImage, true, null).then((resI) => {
                                    _row = { ..._row, logo: resI.values };
                                })
        
                            setRow(_row);
                        }
                    }
                });
            });
    }

    const onActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/Appointment/edit/${id}`;
        if (type === 'view') _route = `/Appointments/view/${id}`;
        if (_route) NavigateTo(_route);
    }

    if (initialize) { setInitialize(false); fetchData(); }

    useEffect(() => { setInitialize(true); }, []);

    return(
          <Box sx={{ width: '100%', mt: 2 }}>
                <Typography noWrap variant="subheader" component="div">
                    Hello, Akash Singh!
                </Typography>

                {!Helper.IsJSONEmpty(row) ? (
                   <>
                        <Typography variant='caption' component="div" sx={{ my: 1}}>
                            You have an upcoming appointment with {row.prop1} on {row.prop5}. Tap below to view details.
                        </Typography>

                        <InfoCard row={row || {}}  onActionClicked={onActionClicked} />
                   </>
                ) : (
                    <>
                        <Typography variant='caption' component="div" sx={{ my: 1}}>
                            Looks like you don’t have any upcoming appointments.  
                            Need to speak to a doctor? We're here for you.
                        </Typography>

                        <Button variant="contained" sx={{ my: 2, py: 1 }} startIcon={<ArrowRightAltIcon  sx={{ width : 16 }}/>}
                            onClick={() => NavigateTo("/book-appointment")}
                        >
                            Book an appointment
                        </Button>
                    </>
                )}
          </Box>
    )
}

const Component = (props) => {
    const [filterBy, setFilterBy] = useState({});

    const onFilterChange = (e) => { setFilterBy(e) }
    
    return (
        <Container {...props}>
            <Stack direction="column" gap={4} sx={{ width: '100%' }}>

                <HomeIntro />

                <SpecialtyFilter newRow={filterBy.value} onFilterChange={onFilterChange} />

                <DoctorList title="Our Doctors" filterBy={filterBy} onFilterChange={onFilterChange} />

                <HealthNestDetail />
                
            </Stack>
        </Container>
    )
}

export default Component