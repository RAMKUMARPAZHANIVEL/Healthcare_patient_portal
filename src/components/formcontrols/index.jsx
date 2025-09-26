import * as React from "react";
import { Typography, IconButton, Box, Grid2 as Grid, Stack } from '@mui/material';
import { TextInput, ColorPicker, FileInput, CheckInput, DropDown, DateTimePicker, TimePicker, TextArea } from "components";
import { Edit as EditIcon } from "@mui/icons-material";

const Initial_Count = 5;
const RenderUploadDocument = (props) => {

    const { mode, name, type, acceptTypes, value, validators, validationMessages, width, onInputChange } = props;

    const [values, setValues] = React.useState([]);
    const [state, setState] = React.useState(false);
    const [docCount, setDocCount] = React.useState(Initial_Count);

    const OnInputChange = (e) => {
        const nvalue = e.value;
        let tmp = values || [];
        tmp[nvalue.index] = nvalue;
        setValues(tmp);
        if (onInputChange) onInputChange({ name, value: tmp });
        setState(!state);
    }

    const OnAddMoreClicked = (e) => {
        e.preventDefault();
        let tmp = values || [];
        tmp.push({ index: tmp.length });
        setValues(tmp);
        setState(!state);
    }

    const OnDeleteClicked = (e, index) => {
        e.preventDefault();
        let tmp = values || [];
        if (tmp.length > 0) {
            tmp = tmp.filter((x) => x.index !== index);
            tmp.forEach((x, index) => x.index = index);
            setValues(tmp);
            if (onInputChange) onInputChange({ name, value: tmp });
            setState(!state);
        }
    }

    const onViewMoreClicked = () => {
        setDocCount(values.length);
    }

    React.useEffect(() => {
        let tmp = value || [{ index: 0 }];
        setValues(tmp);
    }, [value]);

    const _values = mode === "view" ? values.slice(0, docCount) : values;
    return (
        <>  
            <Stack direction={"row"} gap={5} sx={{ width: "100%", flexWrap: "wrap" }}>
                {values && values.length > 0 && _values.map((x, i) => {
                      const isLastVisible = values.length > docCount && i === Initial_Count-1;
                      return (
                          <FileInput key={x.index} mode={mode} id={name} name={name} type={type} value={x} index={x.index} count={values.length}
                             validators={validators} validationMessages={validationMessages} sx={{ width: width }} addmore={true} onDeleteClicked={OnDeleteClicked}
                             acceptTypes={acceptTypes} OnInputChange={OnInputChange} onAddMoreClicked={OnAddMoreClicked} isLastVisible={isLastVisible} onViewMoreClicked={onViewMoreClicked} Initial_Count={Initial_Count} />
                      )
                })}
                 {mode === "view" && values.length === docCount && (
                    <Box
                        sx={{display: "flex", width: 150, height: 150, bgcolor: "rgba(0,0,0,0.6)", borderRadius: 2, cursor: "pointer", mt: 2 }}
                        onClick={() => setDocCount(Initial_Count)}
                    >
                        <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold", m: "auto"}}>
                          See Less
                        </Typography>
                    </Box>
                )}
            </Stack>
        </>
    );
}

const Component = (props) => {

    const { mode, step, title, review, controls, options, onInputChange,
        location, onEditClicked, shadow, excludes, excludestepper } = props;

    const paddingTop = mode && mode === 'view' ? undefined : 3;
    const headerVariant = shadow ? "subheadercenter" : "subheader";

    const OnInputChange = (e) => {
        if (onInputChange) onInputChange({ ...e, location });
    }

    const OnEditClicked = (e) => {
        e.preventDefault();
        if (onEditClicked) onEditClicked(step);
    }

    const IsMandatory = (e) => {
        if (!e) return false;
        return e.findIndex((x) => x && x.toLowerCase() === 'required') > -1;
    }

    const GetDropDownOptions = (e) => {
        return options.find((x) => x.Name === e)?.Values;
    }

    const GetFilters = (e) => {
        let tmp = controls && controls.filter((z) => !z.nocreate && z.type !== "keyid") || [];
        if (excludestepper) {
            tmp = tmp.filter((x) => !x.nostepper);
        }

        if (excludes) {
            tmp = tmp.filter((x) => excludes.indexOf(x.key) === -1);
        }
        return tmp;
    }

    const columnSize = (type) => {
        let size;
        switch(type){
            case"doc": size = 12; break;
            default: size = 6; break;
        }
        return size;
    }

    return (
        <>
            <Typography variant={headerVariant}>
                {review && (
                    <>
                        <IconButton
                            size="small"
                            color="inherit"
                            aria-label="Edit"
                            sx={{ width: 18, height: 18, margin: 0, padding: 0 }}
                            onClick={(e) => OnEditClicked(e)}
                        >
                            <EditIcon color="primary" sx={{ width: 18, height: 18 }} />
                        </IconButton>
                        &nbsp;
                    </>
                )}
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, mt: 3 }}>
                <Grid container spacing={3} columns={12} alignItems="flex-end"> 
                    {GetFilters().map((x, i) => {
                        return (
                            <Grid size={columnSize(x.type)} key={i}>
                                {x.type === 'check' || x.type === 'textarea' && (' ')}
                                {x.type !== 'check' && x.type !== 'textarea' && (
                                    <Typography nowrap="true" variant="labelheader">
                                        {x.label}{IsMandatory(x.validators) && (mode !== 'view' && <Typography variant="mandatory">*</Typography>)}
                                    </Typography>
                                )}

                                {x.type === 'text' && (
                                    <TextInput mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators} editable={x.editable}
                                        validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} label={x.label} />
                                )}
                                {x.type === 'check' && (
                                    <CheckInput mode={mode} label={x.label} id={x.key} name={x.key} value={x.value || x.default}
                                        validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} />
                                )}

                                {x.type === 'color' && (
                                    <ColorPicker mode={mode} id={x.key} name={x.key} value={x.value} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} />
                                )}
                                {!x.multiple && x.type === 'doc' && (
                                    <FileInput mode={mode} id={x.key} name={x.key} type={x.type} value={x.value}
                                        validators={x.validators} validationMessages={x.validationMessages} sx={{ width: x.width }}
                                        acceptTypes={x.accept} OnInputChange={OnInputChange} dataTestId={x.key} />
                                )}
                                {x.multiple && x.type === 'doc' && (
                                    <RenderUploadDocument mode={mode} name={x.key} type={x.type} value={x.value}
                                        validators={x.validators} validationMessages={x.validationMessages} width={x.width}
                                        acceptTypes={x.accept} onInputChange={OnInputChange} dataTestId={x.key} />
                                )}
                                {x.type === 'date' && (
                                    <TextInput type="date" mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators} editable={x.editable}
                                        validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} />
                                )}
                                {x.type === 'datetime' && (
                                    <DateTimePicker mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                        validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} />
                                )}
                                {x.type === 'time' && (
                                    <TimePicker mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators}
                                        validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} />
                                )}
                                {x.type === 'dropdown' && (
                                    <DropDown mode={mode} id={x.key} name={x.key} value={x.value} options={GetDropDownOptions(x.source)} valueId={x.valueId} size="small"
                                        nameId={x.nameId} contentId={x.contentId} defaultLabel={`Select ${x.label}`} sx={{ width: x.width }}
                                        validators={x.validators} validationMessages={x.validationMessages} onDropDownChange={OnInputChange} dataTestId={x.key} />
                                )}
                                {x.type === 'textarea' && (
                                    <TextArea mode={mode} id={x.key} name={x.key} value={x.value} validators={x.validators} editable={x.editable} label={x.label} description={x.description}
                                        validationMessages={x.validationMessages} OnInputChange={OnInputChange} sx={{ width: x.width }} dataTestId={x.key} outline={x.outline} />
                                        //  ref={(el) => registerRef && registerRef(x.label || x.key, el)} />
                                )}
                            </Grid>
                        );
                    })}
                </Grid>               
            </Box>
        </>
    );

}

export default Component;