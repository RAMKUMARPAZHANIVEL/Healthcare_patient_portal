import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import { Container } from "components";
import RenderFormContols from "./child/formcontrols";
import { useNavigate } from "react-router-dom";
import Support from "shared/support";
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";


const Component = (props) => {

    const [form, setForm] = useState(null);
    const [row, setRow] = useState({});
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const [childCollections, setChildCollections] = useState([]);
    const NavigateTo = useNavigate();
    const [showUpdate, setShowUpdate] = useState(false);
    const { title } = props;

    const OnSubmit = async () => {
        let rslt, data, prodImages, appointmentId, numfields;
        const mapItems = MapItems;

        // Attach inline objects
        let appointment = row['appointment'];

        numfields = Helper.GetAllNumberFields(appointment);
        if (numfields.length > 0) Helper.UpdateNumberFields(appointment, numfields);

        let inlineObjs = childCollections.filter(x => !x.child);
        inlineObjs.forEach(x => {
            let vObj = {};
            let obj = row[x.name];

            numfields = Helper.GetAllNumberFields(obj);
            if (numfields.length > 0) Helper.UpdateNumberFields(obj, numfields);

            const tmp = Object.values(obj);
            tmp.filter((x) => x.value).map((x) => {
                if (x.type === 'dropdown' && !Helper.IsNullValue(x.value)) {
                    vObj[x.key] = dropDownOptions.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                } 
                
                else {
                    vObj[x.key] = x.value;
                }
            });
            appointment.push({ key: x.property, value: vObj, type: "inline" });
        });


        inlineObjs = childCollections.filter(x => x.child);
        inlineObjs.forEach(x => {
            let obj = row[x.name];
            let _values = obj.find(z => z.type === 'keyid')?.values;
            let valueList = [];
            _values.forEach(m => {
                ['action', , 'id'].forEach(z => delete m[z]);
                let oValues = Object.keys(m);
                let newFldList = [];
                oValues.forEach(z => {
                    let fld = obj.find(k => k.key === z);
                    fld.value = m[z];
                    if (fld.type === 'dropdown' && !Helper.IsNullValue(fld.value)) {
                        fld.value = dropDownOptions.find((zz) => zz.Name === fld.source).Values.find((kk) => kk[fld.nameId] === fld.value)[fld.valueId];
                        if (fld.enum) {
                            fld.value = fld.value?.toString();
                        }
                    }

                    newFldList.push(fld);
                });

                numfields = Helper.GetAllNumberFields(newFldList);
                if (numfields.length > 0) Helper.UpdateNumberFields(newFldList, numfields);

                let tmp2 = {};

                newFldList.forEach(j => {
                    tmp2 = { ...tmp2, [j.key]: j.value };
                });

                valueList.push(tmp2);
            });
            appointment.push({ key: x.property, value: valueList, type: "collections" });
        });


        // Add Or Update Appointment
        rslt = await Support.AddOrUpdateAppointment(appointment, []);
        if (rslt.status) {
            appointmentId = rslt.id;
        } else { return; }

        for (let i = 0; i < mapItems.length; i++) {
            // Add or Update the Appointment and navigation entity if it is deos not exist
            let navItem = appointment.find(x => x.uicomponent === mapItems[i].uicomponent);
            if (!Helper.IsJSONEmpty(navItem) && Helper.IsNullValue(navItem.value)) {
                let childItem = row[navItem.uicomponent];
                numfields = Helper.GetAllNumberFields(childItem);
                if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

                rslt = await mapItems[i].func(childItem, dropDownOptions);
                if (rslt.status) {
                    data = [
                        { key: "AppointmentId", value: parseInt(appointmentId) },
                        { key: navItem.key, value: parseInt(rslt.id) }
                    ];
                    rslt = await Support.AddOrUpdateAppointment(data);
                    if (!rslt.status) return;

                } else { return; }
            }
        }

                    
        

        global.AlertPopup("success", "Appointment is created successfully!");
        setShowUpdate(false);
        NavigateTo("/");
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = tValue;
            setRow(_row);
            setShowUpdate(true);
            if (!Helper.IsNullValue(item['uicomponent'])) {
                UpdateMappingPannel(_row, item, tValue);
            }
        }
    }

    const UpdateMappingPannel = (_row, item, value) => {

        const { uicomponent, source, valueId } = item;
        const { Values } = dropDownOptions.find(x => x.Name === source);
        const obj = value ? Values.find(x => x[valueId] === value) : null;
        let _rowMap = _row[uicomponent] || [];

        for (let i = 0; i < _rowMap.length; i++) {

            let tmpField = _rowMap[i];
            let bEditable = true;
            let _cValue = null;

            if (!Helper.IsNullValue(obj)) {
                _cValue = obj[tmpField.key];
                if (tmpField.type === 'dropdown') {
                    const _dValues = dropDownOptions.find(x => x.Name === _rowMap[i].source).Values;
                    _cValue = _dValues.find(x => x.Name === _cValue)[_rowMap[i].valueId];
                } else if (tmpField.type === 'date') {
                    _cValue = Helper.ToDate(_cValue, "YYYY-MM-DD");
                }
                bEditable = false;
            }

            tmpField.editable = bEditable;
            tmpField.value = _cValue;

            _rowMap[i] = tmpField;

        }
        if (_row[uicomponent]) _row[uicomponent] = _rowMap;
        setRow(_row);
        setState(!state);
    };

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const fetchData = async () => {
        await Extract().then(rslt => {
            const { row, options, collections } = rslt;
            setRow(row);
            setChildCollections(collections);
            setDropDownOptions(options);
            setState(!state);
        })
    };

    const OnTableRowUpdated = (e) => {
        const { location, items } = e;
        let _row = { ...row };
        _row[location].find(x => x.type === 'keyid').values = items;
        setRow(_row);
        setShowUpdate(true);
    }

    useEffect(() => { setShowButton(true); }, []);
    if (initialized) { setInitialized(false); fetchData(); }
    useEffect(() => { setInitialized(true); }, []);

    return (

        <>
            <Container {...props}>
                <Box style={{ width: '100%' }}>
                    <Box sx={{ width: '100%', mb: 2.5 }}>
                        <Typography noWrap variant="subheader" component="div">
                            {title}
                        </Typography>
                    </Box>
                    <Divider />
                    <Stack direction="row" sx={{ width: "100%", justifyContent: 'flex-end', alignItems: "center", my: '16px', gap: 3 }}>                          
                        <Button variant="contained" startIcon={<ArrowLeftIcon />}
                          onClick={() => NavigateTo(-1)}
                        > Back </Button>
                    </Stack>
                </Box>
                <RenderFormContols shadow={true} {...props} setForm={setForm} onInputChange={OnInputChange} onTableRowUpdated={OnTableRowUpdated}
                    controls={row} onSubmit={OnSubmit} options={dropDownOptions} />
                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, pt: 1, pb: 1 }}>
                                {showButton && <Button variant="contained" onClick={(e) => OnSubmitForm(e)} >Save</Button>}
                                <Button variant="outlined" onClick={() => NavigateTo("/")}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container >
        </>

    );

};

export default Component;
