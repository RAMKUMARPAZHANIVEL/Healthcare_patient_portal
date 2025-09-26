import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Stack, Typography, Button, Grid2 as Grid, Paper, Chip } from '@mui/material'
import { experimentalStyled as styled } from '@mui/material/styles';
import Helper from "shared/helper";
import * as Api from "shared/services";
import { DateCalender } from '.';
import Support from "shared/support";
import { Card, CardMedia, CardContent, Avatar, CardActions } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';
import Session from "shared/session";
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const { x, onActionClicked } = props;

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
        }}
        >
        <Box sx={{ position: 'relative' }}>
            <Avatar 
                variant="rounded" 
                src={x?.logo} 
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
                          {x.prop1}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} mb={1}>
                          {x.prop2}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} mb={1}>
                          Consultant - {x.prop3}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          Experience - {x.prop4}
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid size={{ xs: 2, sm: 4, md: 4 }}  sx={{ textAlign: 'right' }}>      
                    {x.prop5 && (
                        <Chip
                            label={x.prop5 || "Unknown"}
                            sx={{ 
                              ...GetChipStyle(x.prop5) 
                            }}
                            icon={
                              <StarIcon style={{ color: GetChipStyle(x.prop5).color }} />
                            }
                        />
                    )}
                    <Typography variant="body2" fontWeight={500} mt={2}>
                       Reviewed by {x.prop6 || 0} Patients
                    </Typography>
                </Grid>

                <Grid  size={{ xs: 2, sm: 4, md: 8 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                       Consultation Fee: {x.prop7} per session
                    </Typography>
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
            <Typography variant='body2' component="div" sx={{ fontWeight: "medium" }}>
                {prop1}
            </Typography>
            <Typography variant='body2' component="div">
                {prop2}
            </Typography>
            <Typography variant='body2' component="div">
                {prop3}
            </Typography>
        </Box>
    )
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    width: '182px',
    height: '50px',
    textAlign: 'center',
    color: theme.palette.text.primary,
    borderRadius: 8,
    border: "1px solid rgba(98, 77, 227, 1)",
    cursor: "pointer",
}));

const Component = React.forwardRef((props, ref) => {

    const { doctorInfo, enumList, setIsSubmitted } = props;

    const [initialized, setInitialized] = React.useState(false);
    const [rows, setRows] = useState([]);
    const [selectedDate, setSelectedDate] = React.useState({});
    const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
    const [allowedDates, setAllowedDates] = React.useState([]);
    const [row, setRow] = useState({});
    const requestAbortController = React.useRef(null);

    const [searchParams] = useSearchParams();
    const prev_slot = searchParams.get('slot');
    const prev_appointment = searchParams.get('appointment');

    const NavigateTo = useNavigate();
    const initialValue = dayjs();
    
     React.useImperativeHandle(ref, () => ({
            submit: () => onSubmit()
     }));

    const sortByTime = (slots) => {
         return slots.sort((a, b) => a.StartTime.localeCompare(b.StartTime));
    }

    const fetchAvailabilities = async (date) => {
        let doctorId, query;
        let expands = [], filters = [];

        setSelectedDate({});
        return new Promise(async (resolve, reject) => {
            doctorId  = props.row['Doctor'].find((x) => x.key === 'DoctorId').value;
            expands = "Slots"
            filters.push(`$filter=AvailabilityDoctor eq ${doctorId}`);

            if (!Helper.IsJSONEmpty(filters)) {
                query = filters.join("&");
            }
            
            const res = await Api.GetAvailabilitiesMulti(query, expands);
            if(res.status) {
                const _rows = res.values.map(x => ({ ...x, Slots: sortByTime(x.Slots) }));
                setRows(_rows);
                const _allowedDates = getAllowedDates(date, _rows);
                resolve({ _allowedDates });
            }
        });
    }

  const fetchAllowedDates = async (date) => {
    await fetchAvailabilities(date)
      .then(({ _allowedDates }) => {
        setAllowedDates(_allowedDates);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
      });

  };

    const OnTimeSlotSelected = (e, item) => {
        e.preventDefault();
        setSelectedTimeSlot(item);
    }

    const fetchDoctorData = async () => {
        return new Promise(async (resolve) => {
            let doctorId = null; let expands = "Qualifications,Speciality";
            
            doctorId  = props.row['Doctor'].find((x) => x.key === 'DoctorId').value;
            setRow({});

            global.Busy(true);
            await Api.GetDoctorSingle(doctorId, null, expands)
                .then(async (res) => {
                    if(res.status) {
                        let _Doctor = res.values;
                        const degrees = _Doctor?.Qualifications
                            ?.map(q => q.Degree)
                            ?.filter(Boolean)
                            ?.join(', ') || '';

                        let _row = {
                             id: _Doctor.DoctorId,
                            prop1: _Doctor.FullName,
                            prop2: degrees,
                            prop3: _Doctor.Speciality.Name,
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
        setSelectedDate(null);
        setSelectedTimeSlot(null);
        fetchAllowedDates(initialValue);
        fetchDoctorData();
    }

    React.useEffect(() => {
       setInitialized(true);
    }, []);

    const getAllowedDates = (date, rows) => {
        const daysInMonth = date.daysInMonth();
        return [
            ...new Set(
            rows.filter(e => {
                const dt = dayjs(e.SpecificDate);
                return dt.date() <= daysInMonth && dt.month() === date.month();
                })
                .map(e => e.SpecificDate)
            )
        ]
    }

    const onMonthChange = (date) => {
        let AvailabilitySingle = rows?.find(e => {
            const dt = dayjs(e.SpecificDate);
            return dt.month() === date.month()
        })
        setSelectedDate(AvailabilitySingle);

        const _allowedDates = getAllowedDates(date, rows);
        setAllowedDates(_allowedDates);
    }

    const onDateChange = (newDate) => {
        const avSingle = rows.find(x => x.SpecificDate === newDate.format("YYYY-MM-DD"))
        setSelectedDate(avSingle);
    }

    const onSubmit = async () => {
        let rslt, data, appointmentId, doctorId;
            const PatientId = Session.Retrieve("PatientId");
            if(prev_slot) {
                const data = { SlotId: parseInt(prev_slot), SlotBookedAppointment: null};

                await Api.SetSlotSingle(data).then(async (res) => {
                    if(res.status) {
                        const data1 = [
                             { key: "Date", value: selectedDate.SpecificDate },
                             { key: "StartTime", value: selectedTimeSlot.StartTime },
                             { key: "EndTime", value: selectedTimeSlot.EndTime },
                             { key: "AppointmentId", value: prev_appointment },
                             { key: "AppointmentAllotedSlot", value: parseInt(selectedTimeSlot.SlotId) },
                             { key: "Status", value: 'Rescheduled'}
                        ]

                        await Support.AddOrUpdateAppointment(data1, [], []).then(async (res1) => {
                            if(res1.status) {
                                // update slot
                                const slot = [
                                    { key: "SlotId", value: parseInt(selectedTimeSlot.SlotId) }, 
                                    { key: "SlotBookedAppointment", value: parseInt(prev_appointment) }
                                ]
                                await Support.AddOrUpdateSlot(slot, [])
                    
                                setIsSubmitted(true);
                                NavigateTo('/Appointments');
                                global.AlertPopup("success", "Appointment is updated successfully!");
                            }
                        })
                    }
                })
            } else {

                doctorId = props.row['Doctor'].find((x) => x.key === 'DoctorId').value;
                
                data = [
                        { key: "Date", value: selectedDate.SpecificDate },
                        { key: "StartTime", value: selectedTimeSlot.StartTime },
                        { key: "EndTime", value: selectedTimeSlot.EndTime },
                        { key: "AppointmentBookedBy", value: parseInt(PatientId) },
                        { key: "AppointmentConsultedDoctor", value: parseInt(doctorId) },
                        { key: "AppointmentAllotedSlot", value: parseInt(selectedTimeSlot.SlotId) },
                        { key: "Status", value: 'Pending'}
                    ];
                rslt = await Support.AddOrUpdateAppointment(data, [], []);
                if (rslt.status) {
                    appointmentId = rslt.id;
                } else { return; }
    
                // update slot
                const slot = [
                    { key: "SlotId", value: parseInt(selectedTimeSlot.SlotId) }, 
                    { key: "SlotBookedAppointment", value: appointmentId }
                ]
                await Support.AddOrUpdateSlot(slot, [])
    
                global.AlertPopup("success", "Appointment is booked successfully!");
                setIsSubmitted(true);
                NavigateTo('/Appointments');
            }
    }

    return (
        <>
          <Stack direction='column' gap={2} sx={{ my: 2 }}>
            <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold" }}>
                Selected Doctor:
            </Typography>
            <InfoCard x={row || {}} />

            <Typography noWrap variant="body1" component="div" sx={{ fontWeight: "bold", mt: 3 }}>
                Select Date and Time based on Doctors Availability:
            </Typography>
            <Stack direction="row" gap={7} sx={{ justifyContent: 'flex-start' }}>
                <DateCalender value={selectedDate?.SpecificDate} allowedDates={allowedDates || []} onMonthChange={onMonthChange} onDateChange={onDateChange} />
                {!Helper.IsJSONEmpty(selectedDate) ? (
                    <>
                        <Box sx={{ width: '60%', flexGrow: 1 }} >
                            <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                                {selectedDate?.Slots?.map((item, index) => (
                                    <Grid item size={{ xs: 2, sm: 4, md: 4 }} key={index}>
                                        {item.SlotBookedAppointment ? (
                                            <Item sx={{ opacity: '30%' }}>
                                                <Typography variant="body2" component="p" align='center' >
                                                    {item.StartTime}
                                                </Typography>
                                            </Item>
                                        ) : (
                                            <Item onClick={(e) => OnTimeSlotSelected(e, item)} sx={{
                                                backgroundColor: selectedTimeSlot === item ? "primary.main" : "transparent",
                                                color: selectedTimeSlot === item && "#ffffff"
                                            }}>
                                                <Typography variant="body2" component="p" align='center' >
                                                    {item.StartTime}
                                                </Typography>
                                            </Item>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </>
                ) : (
                    <Box component={"div"} sx={{
                        mt: 5,
                        display: "flex", width: '50%',
                        height: 150, backgroundColor: "background.surface",
                        justifyContent: "center", alignItems: "center",
                        border: "1px solid lightgray"
                    }}>
                        <Typography noWrap variant="colorcaption" component="div" sx={{ fontSize: "0.95rem" }}>
                            No Slots found
                        </Typography>
                    </Box>
                )}      
            </Stack>
            
            <Typography noWrap variant="h5" component="div" sx={{ mt: 3 }}>
                About Doctor:
            </Typography>

            <Box>
                <Typography variant='caption' component="div" sx={{ whiteSpace: "pre-line" }}>
                    {row.About}
                </Typography>
            </Box>
            
            {row.Qualifications && row.Qualifications.map(x => (
                <>
                    <Typography noWrap variant="h5" component="div" sx={{ mt: 3 }}>
                        Qualifications
                    </Typography>
                    <Qualification
                        prop1={x.Degree} 
                        prop2={x.University}
                        prop3={x.YearOfCompletion}
                    />
                </>
               
            ))}
          </Stack>
        </>
    );
})

export default Component;