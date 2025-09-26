import React from 'react';
import RenderFormContols from "./formcontrols";
import PatientJsonConfig from "config/patient_product_details_detail_config.json";
import * as Api from "shared/services";
import { GetMetaDataInfo } from "shared/common";
import Helper from "shared/helper";
import { useNavigate } from 'react-router-dom';

const screenItems = ['patient', 'Address', 'MedicalInformation'];

const Component = React.forwardRef((props, ref) => {

    const { setIsSubmitted, onEditClicked } = props;
    const [form, setForm] = React.useState(null);
    const [dropDownOptions, setDropDownOptions] = React.useState([]);
    const [row, setRow] = React.useState({});

    const navigate = useNavigate();
    React.useImperativeHandle(ref, () => ({
        submit: () => form.current.submit()
    }));

    const OnSubmit = async (e) => {
        // setIsSubmitted(true);
        navigate("/home");
    }

    const OnEditClicked = (e) => {
        if (onEditClicked) OnEditClicked(e);
    }

    const patientid = props.row['patient'].find((x) => x.key === 'PatientId').value || 0;

    const FetchPatientDetails = async (enums) => {

        let item = {}, tmp;

        screenItems.forEach(elm => {
            let items = [];
            for (let prop of PatientJsonConfig[elm]) {
                items.push({ ...prop, value: null });
            }
            item[elm] = items;
        });

        global.Busy(true);
        // Get Patient Details
        let rslt = await Api.GetPatientSingle(patientid, "$expand=ProfilePicture");
        if (rslt.status) {

            const patient = rslt.values;

            for (let prop in patient) {
                const tItem = item['patient'].find((x) => x.key === prop);
                if (tItem) {
                    if (prop === 'Gender') {
                        const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                        const _value = dpItems.find((m) => m.Name === patient[prop]).Value;
                        item['patient'].find((x) => x.key === prop).value = parseInt(_value);
                    } else {
                        item['patient'].find((x) => x.key === prop).value = patient[prop];
                    }
                }
            }

            // Address
            if (patient.Address) {
                Object.keys(patient.Address).forEach(x => {
                    if(item['Address'].some(z => z.key === x)) item['Address'].find(z => z.key === x).value = patient.Address[x];
                })
            }

            // Get Medical information
            if (patient.MedicalInformation) {
                Object.keys(patient.MedicalInformation).forEach(prop => {
                    const tItem = item['MedicalInformation'].find((x) => x.key === prop);
                    if (tItem) {
                        if (prop === 'UnitOfMeasurement') {
                            const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                            const _value = dpItems.find((m) => m.Name === patient.MedicalInformation[prop]).Value;
                            item['MedicalInformation'].find((x) => x.key === prop).value = parseInt(_value);
                        } else if (prop === 'AvailabilityStatus') {
                            const dpItems = enums.find((z) => z.Name === tItem.source).Values;
                            const _value = dpItems.find((m) => m.Name === patient.MedicalInformation[prop]).Value;
                            item['MedicalInformation'].find((x) => x.key === prop).value = parseInt(_value);
                        } else if (prop === 'ManufacturingDate') {
                            let tmpDate = patient.MedicalInformation[prop].split('T');
                            item['MedicalInformation'].find((x) => x.key === prop).value = tmpDate[0];
                        } else {
                            item['MedicalInformation'].find((x) => x.key === prop).value = patient.MedicalInformation[prop];
                        }
                    }
                })
            }

            // Main Image
            if (patient.PatientProfilePicture) {
                tmp = {};
                ['DocData', 'DocId', 'FileName', 'FileType', 'Date'].forEach((x) => {
                    tmp[x] = patient.ProfilePicture[x]
                });

                if (tmp.DocId > 0) {
                    rslt = await Api.GetDocumentSingleMedia(tmp.DocId, true);
                    if (rslt.status) tmp['DocData'] = rslt.values;
                }
                item['patient'].find((x) => x.key === "ProfilePicture").value = tmp;
            }
        }

        setRow(item);
        global.Busy(false);
    }

    const FetchEnumTypes = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            const rlst = await GetMetaDataInfo();
            const enums = rlst.filter((x) => x.Type === 'Enum') || [];
            setDropDownOptions(enums);
            global.Busy(false);
            return resolve(enums);
        });
    }

    React.useEffect(() => {
        const fetchData = async () => {
            if (patientid) {
                await FetchEnumTypes().then(async (enums) => {
                    await FetchPatientDetails(enums);
                });
            }
        };
        fetchData();
    }, [patientid]);

    return (
        <>
            <RenderFormContols {...props} row={row} excludestepper={true} shadow={true} review={true}
                onEditClicked={OnEditClicked} setForm={setForm} onSubmit={OnSubmit} />
        </>
    )
});

export default Component;