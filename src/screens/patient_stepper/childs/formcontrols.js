import * as React from "react";
import { Box, Grid } from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';
import RenderFormContols from "components/formcontrols";

const Component = (props) => {
    const { onInputChange, onSubmit, type, review, shadow, onStepClicked } = props;
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

    const OnEditClicked = (e) => {
        if (onStepClicked) onStepClicked(e);
    }

    React.useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', value => value);
    }, []);

    return (
        <Box sx={{ width: '100%', mb: 5 }}>
            <ValidatorForm ref={form} onSubmit={handleSubmit}>
                {review ? (
                    <>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "32px" }}>
                            <Box sx={{ width: "100%", border, borderRadius, p: 2 }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludes={[]} excludestepper={props.excludestepper}
                                    title={"Account Information"} shadow={shadow} step={0} options={props.enums} controls={props.row['patient']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "32px" }}>
                            <Box sx={{ width: "100%", border, borderRadius, p: 2 }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludestepper={props.excludestepper}
                                    title={"Address"} shadow={shadow} step={1}
                                    options={props.enums} controls={props.row['Address']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex', width: '100%', marginTop: "32px" }}>
                            <Box sx={{ width: "100%", border, borderRadius, p: 2 }}>
                                <RenderFormContols mode={'view'} review={true} onEditClicked={OnEditClicked} excludestepper={props.excludestepper}
                                    title={"Medical Information"} shadow={shadow} step={2}
                                    options={props.enums} controls={props.row['MedicalInformation']} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box style={{ display: 'flex', width: '100%' }}>
                            <Box sx={{ width: `100%`, margin: 2 }}>
                                <RenderFormContols mode={props.mode} excludestepper={props.excludestepper} options={props.enums} controls={props.row[type]} onInputChange={OnInputChange} />
                            </Box>
                        </Box>
                    </>
                )}
            </ValidatorForm>
        </Box>
    );

};

export default Component;