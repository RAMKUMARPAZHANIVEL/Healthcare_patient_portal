import * as React from "react";
import { Box, Stack } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formcontrols";

const Component = (props) => {

    const { onInputChange, onSubmit, shadow } = props;
    const form = React.useRef(null);

    const border = shadow ? "1px solid #9E9E9E !important" : null;
    const borderRadius = shadow ? "8px !important" : null;

    const handleSubmit = () => {
        if (onSubmit) onSubmit();
    }

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange(e);
    }

    React.useEffect(() => {
        if (props.setForm) props.setForm(form);
    }, [props, form]);

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <ValidatorForm ref={form} onSubmit={handleSubmit}>
                <Stack sx={{ width: '100%', mb: 5 }}>
                    <Box sx={{ float: "left", minWidth: "95%", mt: 4, border, borderRadius, p: 5 }}>
                        <RenderFormContols shadow={true} location="patient" mode={props.mode} title={"Patient"}
                            controls={props.controls.patient} options={props.options} onInputChange={OnInputChange} />
                    </Box>

                    <Box sx={{ float: "left", minWidth: "95%", mt: 4, border, borderRadius, p: 5 }}>
                        <RenderFormContols shadow={true} location="MedicalInformation" mode={props.mode} title={"Medical Records"}
                            controls={props.controls.MedicalInformation} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                    
                    <Box sx={{ float: "left", minWidth: "95%", mt: 4, border, borderRadius, p: 5 }}>
                        <RenderFormContols shadow={true} location="Address" mode={props.mode} title={"Address"}
                            controls={props.controls.Address} options={props.options} onInputChange={OnInputChange} />
                    </Box>
                </Stack >
            </ValidatorForm>
        </Box>
    );

}

export default Component;