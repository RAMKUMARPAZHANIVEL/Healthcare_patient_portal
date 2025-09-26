import React from 'react';
import RenderFormContols from "./formcontrols";
import Support from "shared/support";
import Helper from "shared/helper";

const Component = React.forwardRef((props, ref) => {

    const { enums, setIsSubmitted, tag } = props;
    const [form, setForm] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const AddOrUpdateAddress = async () => {

        return new Promise(async (resolve) => {

            let rslt, data, patientId, complex;

            patientId = props.row['patient'].find((x) => x.key === 'PatientId').value || 0;

            let childItem = props.row['Address'];
            let numfields = Helper.GetAllNumberFields(childItem);
            if (numfields.length > 0) Helper.UpdateNumberFields(childItem, numfields);

            // Add Or Update patient address
                data = [
                    { key: "PatientId", value: parseInt(patientId) },
                ];
                complex = { "Address" : childItem };
                rslt = await Support.AddOrUpdatePatient(data, enums, [], complex);
                if (!rslt.status) return resolve(false);

            return resolve(true);

        });
    }

    const OnSubmit = async (e) => {

        if (e) e.preventDefault();

        await AddOrUpdateAddress().then((status) => {
            if (status) {
                global.AlertPopup("success", "Address is updated successfully!");
                setIsSubmitted(true);
            }
        });

    }

    const OnInputChange = async (e) => {
        const { name, value } = e;
        let patients = props.row[tag];
        patients.find((x) => x.key == name).value = value;
        props.row[tag] = patients;
    }

    return (
        <>
            <RenderFormContols {...props} setForm={setForm} type="Address" onInputChange={OnInputChange} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;