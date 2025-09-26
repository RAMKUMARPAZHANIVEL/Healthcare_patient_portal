import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

const Component = React.forwardRef((props, ref) => {
    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({ submit: () => form.current.submit() }));

    const AddOrUpdateMedicalInformation = async () => {

        return new Promise(async (resolve) => {

            let rslt, data, patientId, complex;

            patientId = props.row['patient'].find((x) => x.key === 'PatientId').value || 0;

            let childItem = props.row['MedicalInformation'];
            let numfields = Helper.GetAllNumberFields(childItem);
            if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

            // Add Patient Other Details
                data = [
                    { key: "PatientId", value: parseInt(patientId) },
                ];
                complex = { "MedicalInformation": childItem };
                rslt = await Support.AddOrUpdatePatient(data, enums, [], complex);
                if (!rslt.status) return resolve(false);

            return resolve(true);
        });
    }

    const OnSubmit = async (e) => {
        if (e) e.preventDefault();
        await AddOrUpdateMedicalInformation().then((status) => {
            if (status) {
                global.AlertPopup("success", "Medical Information are updated successfully!");
                setIsSubmitted(true);
            }
        })
    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let values = props.row[tag];
        let _index = values.findIndex((x) => x.key === name);
        if (_index > -1) {
            values[_index].value = value;
            props.row[tag] = values;
        }
    }

    return (
        <>
            <RenderFormContols {...props} setForm={setForm} type="MedicalInformation" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;