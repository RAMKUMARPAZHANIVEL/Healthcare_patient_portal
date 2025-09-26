import React from 'react';
import Container from "components/container";
import { GetMetaDataInfo } from "shared/common";
import { Box, Grid, Stack, Button, Typography } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import AppointmentJsonConfig from "config/appointment_stepper.json";
import { PatientForm, AddressForm, MedicalInformationForm, PatientReviewForm, Doctor, Availability, Specialty } from "./childs";
import * as Api from "shared/services";
import { useNavigate, useSearchParams } from "react-router-dom";
import Stepper from "components/stepper";

const steps = ['Select a Specialization', 'Add a Doctor', 'Select a Date & Time '];

const Component = (props) => {
    const { title } = props;
    const [initialize, setInitialize] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [jumpStep, setJumpStep] = React.useState(0);
    const [stepperComponents, setStepperComponents] = React.useState([]);
    const inputRefs = React.useRef({ addressForm: null });
    const [state, setState] = React.useState(false);

    const NavigateTo = useNavigate();
    const [searchParams] = useSearchParams();

    const doctor = searchParams.get('doctor');
    const speciality = searchParams.get('speciality');
    const slot = searchParams.get('slot');

    const OnStepClicked = (e) => { setJumpStep(e); }

    const PrepareStepperComponents = async (item, enums) => {
        return new Promise(async (resolve) => {

            const _items = [];

            _items.push(<Specialty
                name="specialty" tag="specialty" ref={r => inputRefs.current['specialty'] = r} setIsSubmitted={bool => setIsSubmitted(bool)} row={item} enums={enums} 
            />)

            _items.push(<Doctor 
                name="doctor" tag="doctor" ref={r => inputRefs.current['doctor'] = r} setIsSubmitted={bool => setIsSubmitted(bool)} row={item} enums={enums}
            />)

            _items.push(<Availability
                name="availability" tag="availability" ref={r => inputRefs.current['availability'] = r} setIsSubmitted={bool => setIsSubmitted(bool)} row={item} enums={enums} 
            />)

            setStepperComponents(_items);

            return resolve(true);
        });

    }

    const FetchEnumTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            await GetMetaDataInfo()
                .then(async (res2) => {
                    const enums = res2.filter((x) => x.Type === 'Enum') || [];
                    global.Busy(false);
                    return resolve(enums);
                });
        });
    }

    const FetchPatientDetails = async () => {
        return new Promise(async (resolve) => {
            let item = {};
            ['Specialty', 'Doctor', 'Availability'].forEach(elm => {
                let items = [];
                for (let prop of AppointmentJsonConfig[elm]) {
                    items.push({ ...prop, value: null });
                }
                item[elm] = items;
            });
            // setRow(item);
            setState(!state);
            return resolve(item);
        });
    }

    const fetchData = async () => {
        // await FetchEnumTypes().then(async (enums) => {
            await FetchPatientDetails().then(async (item) => {
                const row = {...item};
                row['Specialty'].find((x) => x.key === 'DocSpeId').value = speciality;
                row['Doctor'].find((x) => x.key === 'DoctorId').value = doctor;
                await PrepareStepperComponents(row, {});
            });
        // });
      
        if(doctor) OnStepClicked(2);
    };

    const handleReset = () => {
        setJumpStep(0);
        setInitialize(true);
    }

    if (initialize) { setInitialize(false); fetchData(); }
    React.useEffect(() => { setInitialize(true); }, []);  

    return (
        <>
            <Container {...props}>
                <Box sx={{ width: '100%' }}>
                    <Stack direction="row" sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: "100%", pb: 3 }}>
                            <Typography noWrap variant="subheader" component="div">
                                {title}
                            </Typography>
                            <Typography variant='caption'>
                                Follow the given steps to quickly book an appointment with you desired doctor.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Stepper requiredSubmit={true} inputRefs={inputRefs.current} isSubmitted={isSubmitted} setIsSubmitted={bool => setIsSubmitted(bool)}
                    steps={steps} step={jumpStep} stepComponents={stepperComponents} handleReset={handleReset} skipAction={false} />
            </Container>
        </>
    )
}

export default Component;
