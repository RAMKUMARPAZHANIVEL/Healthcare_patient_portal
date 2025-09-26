import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";
import Session from "shared/session";

const Component = React.forwardRef((props, ref) => {
    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const OnSubmit = async (e) => {
        let rslt, data, patientImage, patientId, numfields;
        let patient = props.row['patient'];

        numfields = Helper.GetAllNumberFields(patient);
        if (numfields.length > 0) Helper.UpdateNumberFields(patient, numfields);

        // Add Or Update patient
        const username = Session.Retrieve("Username");
        patient.push({ key: "UserKey", value: username });

        rslt = await Support.AddOrUpdatePatient(patient, enums, ['ProfilePicture']);
        if (rslt.status) {
            patientId = rslt.id;
            patient.find((x) => x.key === 'PatientId').value = rslt.id;
            props.row['patient'].find((x) => x.key === 'PatientId').value = rslt.id;
            Session.Store("PatientId", patientId);
        } else { return; }

        // Add patient Main Image
        patientImage = patient.find((x) => x.key === 'ProfilePicture');
        if(patientImage.value) {
            rslt = await Support.AddOrUpdateDocument(patientImage);
            if (rslt.status) {
                patient.find((x) => x.key === 'ProfilePicture')['value'] = rslt.id;
                // Add Or Update patient
                data = [
                    { key: "PatientId", value: parseInt(patientId) },
                    { key: "PatientProfilePicture", value: parseInt(rslt.id) }
                ];
                rslt = await Support.AddOrUpdatePatient(data);
                if (!rslt.status) return;
    
            } else { return; }
        }

        global.AlertPopup("success", "Patient is created successfully!");
        setIsSubmitted(true);
    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let rows = props.row[tag];
        rows.find((x) => x.key == name).value = value;
        props.row[tag] = rows;
    }

    return (
        <>
            <RenderFormContols {...props}
                setForm={setForm} type="patient" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;