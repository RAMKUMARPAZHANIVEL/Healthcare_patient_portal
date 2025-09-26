import { useEffect, useState } from "react";
import { Typography, Grid2 as Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Container } from "components";
import { useNavigate, useParams } from "react-router-dom";
import RenderFormContols from "./child/formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

import { Extract, MapItems } from "./child/extract";

const Component = (props) => {
    const { title } = props;
    const [form, setForm] = useState(null);
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [state, setState] = useState(false);
    const [row, setRow] = useState({});
    const [backRow, setBackupRow] = useState({});
    const [showUpdate, setShowUpdate] = useState(false);
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const TrackChanges = (name) => {
        const source = JSON.parse(JSON.stringify(backRow[name]));
        const target = JSON.parse(JSON.stringify(row[name]));

        let changes = [];
        for (let prop of source) {
            let value1 = source.find((x) => x.key === prop.key).value ?? "";
            let value2 = target.find((x) => x.key === prop.key).value ?? "";

            if (prop.key === 'ProfilePicture') {
                value1 = value1.DocName ?? "";
                value2 = value2.DocName ?? "";
            }
            if (value1.toString() !== value2.toString()) {
                changes.push(prop.key);
            }
        }

        return changes;
    }

    const UpdateBackUp = (name) => {
        if (name) {
            let obj = Helper.CloneObject(row[name]);
            let bItems = [];
            for (let prop of obj) {
                bItems.push({ key: prop.key, value: prop.value });
            }
            setBackupRow((prev) => ({ ...prev, [name]: bItems }));
            setState(!state);
        }
    }

    const OnSubmit = async () => {
        let rslt, data, changes = [], patientId, patient, numfields, mapItem;

        patient = row['patient'];
        patientId = row['patient'].find((x) => x.type === 'keyid').value;

        const nestedObj = extractComplexUpdates();                                                                                                                                                

        for (let i = 0; i < MapItems.length; i++) {
            // Check is there any changes
            mapItem = MapItems[i];

            if (!Helper.IsJSONEmpty(mapItem.navpropname)) {
                changes = TrackChanges(mapItem.uicomponent);
                if (changes.length > 0) {
                    // Check any excluded items are configured
                    let tmp = changes.filter((x) => mapItem.exclude.indexOf(x) === -1);
                    if (tmp.length > 0) {
                        let newObject = row[mapItem.uicomponent];
                        numfields = Helper.GetAllNumberFields(newObject);
                        if (numfields.length > 0) Helper.UpdateNumberFields(newObject, numfields);
                        rslt = await mapItem.func(newObject, dropDownOptions, mapItem.exclude);
                        if (rslt.status) {
                            newObject.find((x) => x.type === 'keyid').value = rslt.id;
                            if (Helper.IsNullValue(mapItem.navpropname)) patientId = rslt.id;
                            
                            const mapPropKey = patient.find(x => x.uicomponent === mapItem.uicomponent).key;
                            data = [
                                { key: "PatientId", value: parseInt(patientId) },
                                { key: mapPropKey, value: parseInt(rslt.id) }
                            ];
                            rslt = await Support.AddOrUpdatePatient(data, dropDownOptions);
                            if (!rslt.status) return;                            

                            // Update Back for next tracking purpose
                            UpdateBackUp(mapItem.target);
                        } else { return; }
                    }
                }
            }

        }
        
        // Add or Update Patient ProfilePicture
        changes = TrackChanges('patient');
        if (changes.length > 0 && changes.indexOf('ProfilePicture') > -1) {
            data = patient.find((x) => x.key === 'ProfilePicture');
            rslt = await Support.AddOrUpdateDocument(data);
            if (rslt.status) {
                let newImageId = parseInt(rslt.id);
                data = [
                    { key: "PatientId", value: parseInt(patientId) },
                    { key: "PatientProfilePicture", value: newImageId }
                ];
                rslt = await Support.AddOrUpdatePatient(data, dropDownOptions);
                if (!rslt.status) return;

                let newValues = patient.find((x) => x.key === 'ProfilePicture').value;
                newValues = { ...newValues, DocId: newImageId };
                row['patient'].find((x) => x.key === 'ProfilePicture').value = newValues;
                                // Update Back for next tracking purpose
                UpdateBackUp('patient');

            } else { return; }
        }

                                                                                                                                                        
                                                
                                                
		                
        // Update root entity
        mapItem = MapItems.find(x => x.uicomponent === 'patient');
        changes = TrackChanges(mapItem.uicomponent);
        if (changes.length > 0 || !Helper.IsJSONEmpty(nestedObj)) {
            let tmp = changes.filter((x) => mapItem.exclude.indexOf(x) === -1);
            if (tmp.length > 0 || !Helper.IsJSONEmpty(nestedObj)) {
                let newObject = row[mapItem.uicomponent];
                numfields = Helper.GetAllNumberFields(newObject);
                if (numfields.length > 0) Helper.UpdateNumberFields(newObject, numfields);
		rslt = await mapItem.func(newObject, dropDownOptions, mapItem.exclude, nestedObj);
                if (!rslt.status) {
                    return;
                }
            }
        }
        
		
        global.AlertPopup("success", "Patient is updated successfully!");
        setShowUpdate(false);
        NavigateTo(-1);
    }

    const extractComplexUpdates = () => {
        let nestedObj = {}, numfields = {};
        for (const mapItem of MapItems) {
            if(mapItem.type === 'complex') {
                const key = mapItem.uicomponent;
                let changes = TrackChanges(key);
                if (changes.length > 0) {
                    let tmp = changes.filter((x) => (mapItem.exclude || []).indexOf(x) === -1);
                    if (tmp.length > 0) {
                        let newObject = row[mapItem.uicomponent];
                        numfields = Helper.GetAllNumberFields(newObject);
                        if (numfields.length > 0) Helper.UpdateNumberFields(newObject, numfields);
                        nestedObj = { ...nestedObj, [key] : newObject }
                    }
                }
            }   
        }
        return nestedObj;
    }

    const OnSubmitForm = (e) => {
        e.preventDefault();
        form.current.submit();
    }

    const OnInputChange = (e) => {
        const { name, value, location, ...others } = e;
        let _row = row;
        let _index = row[location].findIndex((x) => x.key === name && x.type !== "keyid");
        if (_index > -1) {
            const item = _row[location][_index];
            let tValue = Helper.IsNullValue(value) ? null : value;
            if (tValue === 'CNONE') tValue = null;
            _row[location][_index].value = value;
            setRow(_row);
            setShowUpdate(true);
            if (!Helper.IsNullValue(item['mapitem'])) {
                UpdateMappingPannel(_row, item, tValue);
            }
        }
    }

    const UpdateMappingPannel = (_row, item, value) => {

        const { mapitem, source, valueId } = item;
        const { Values } = dropDownOptions.find(x => x.Name === source);
        const obj = value ? Values.find(x => x[valueId] === value) : null;
        let _rowMap = _row[mapitem] || [];

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
        if (_row[mapitem]) _row[mapitem] = _rowMap;
        setRow(_row);
        setState(!state);
    };

    const fetchData = async () => {

        await Extract(id).then(rslt => {
            const { row, options, backRow } = rslt;
            setRow(row);
            setDropDownOptions(options);
            setBackupRow(backRow);
            setState(!state);
        })

    };

    if (initialized) { setInitialized(false); fetchData(); }

    useEffect(() => { setInitialized(true); }, [id]);

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
                <RenderFormContols {...props} shadow={true} setForm={setForm} mode={"edit"} controls={row} options={dropDownOptions}
                    onInputChange={OnInputChange} onSubmit={OnSubmit} />

                {showUpdate && (
                    <>
                        <Divider />
                        <Box sx={{ width: '100%' }}>
                            <Grid container sx={{ flex: 1, alignItems: "center", justifyContent: 'flex-start', gap: 1, py: 2 }}>
                                <Button variant="contained" onClick={(e) => OnSubmitForm(e)}>Update</Button>
                                <Button variant="outlined" onClick={() => NavigateTo(-1)}>Cancel</Button>
                            </Grid>
                        </Box>
                    </>
                )}
            </Container>
        </>

    );

};

export default Component;
