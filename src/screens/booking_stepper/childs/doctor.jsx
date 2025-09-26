
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { DataList } from '../../childs';
import * as Api from "shared/services";
import { SearchInput } from "components";
import Helper from "shared/helper";
import Session from "shared/session";
import { DoctorDetail } from ".";

const getChipStyle = (type) => {
    const colorMap = (rating) => {
        if (rating >= 4.5) return '#1F9254';      // Green
        if (rating >= 3) return '#ff9800';        // Orange
        if (rating >= 0) return '#A30D11';         // Red
        return '#4CAF50';                         // Gray for "Unknown" or 0
    };
    return {
        backgroundColor: "#FBE7E8",
        color: colorMap(type) || "#4CAF50", 
        borderRadius: "22px",
        fontSize:"12px",
        fontWeight:500,
        padding:"0px",
        position: "absolute",
        bottom: "8px",
        left: "8px"
    };
}

const Component = React.forwardRef((props, ref) => {
    const { setIsSubmitted } = props;
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");
    const [doctor, setDoctor] = useState(0);

    React.useImperativeHandle(ref, () => ({
        submit: () => OnSubmit()
    }));

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }

    const fetchDoctors = async (filterBy) => {
        let query = null, filters = [];
        setRows([]);
        setRowsCount(0);

        global.Busy(true);
        await Api.GetDoctorsCount(query)
            .then(async (res) => {
                if (res.status) {
                    setRowsCount(parseInt(res.values));
                    console.log(res.values);
                } else {
                    console.log(res.statusText);
                }
            });

        if(!Helper.IsJSONEmpty(filterBy)) {
            filters.push(`$filter=DoctorSpeciality eq ${filterBy.DocSpeId}`);
        }

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(About, '${searchStr}')`);
        }

        const _top = pageInfo.pageSize;
        const _skip = pageInfo.page * pageInfo.pageSize;
        filters.push(`$skip=${_skip}`);
        filters.push(`$top=${_top}`);

        if (!Helper.IsJSONEmpty(filters)) {
            query = filters.join("&");
        }

        let _rows = [];
        
        await Api.GetDoctorsMulti(query, "Speciality,Qualifications").then(async (res) => {
            if (res.status) {
                for (let i = 0; i < res.values.length; i++) {
                    let _Doctor = res.values[i];
                    const degrees = _Doctor.Qualifications
                        ?.map(q => q.Degree)
                        ?.filter(Boolean)
                        ?.join(', ') || '';

                    let _row = {
                        id: _Doctor.DoctorId,
                        prop1: _Doctor.FullName,
                        prop2: degrees,
                        prop3: `Consultant - ${_Doctor.Speciality.Name}`,
                        prop4: `Experience - ${_Doctor.Experience}`,
                        prop5: `Consultation Fee: ₹${_Doctor.ConsultationFee} per session`,
                        prop6: _Doctor.OverallRating
                    };

                    _Doctor.DoctorDoctorImage &&
                        await Api.GetDocumentSingleMedia(_Doctor.DoctorDoctorImage, true, null).then((resI) => {
                            _row = { ..._row, logo: resI.values };
                        })

                    _rows.push(_row);
                }
            }
        });

        setRows(_rows);
        global.Busy(false);
    }

    const fetchData = async () => {
        const specialityId = props.row['Specialty'].find((x) => x.key === 'DocSpeId').value;
        
        global.Busy(true);
        await Api.GetSpecialtySingle(specialityId).then(async (res) => {
            const speciality = res.values;
            if(res.status) await fetchDoctors(speciality);
        })
        global.Busy(false);
    }

    if (initialize) { setInitialize(false); fetchData(); }

    useEffect(() => { setInitialize(true); }, [pageInfo, searchStr]);

    useEffect(() => { setInitialize(true); }, []);

    const OnSubmit = () => {
        if(doctor) {
            setIsSubmitted(true);
        } else {
            global.AlertPopup("error","Please select the doctor");
        }
    }

    const onActionClicked = (id, type)=> {
        setDoctor(id);
        props.row['Doctor'].find((x) => x.key === 'DoctorId').value = id;
    }

    return (
        <Box sx={{ width: '100%', my: 3  }}> 
            {doctor ? <DoctorDetail id={doctor} onActionClicked={OnSubmit} /> : (
                <>
                    <Stack direction="row" sx={{ width: "100%", justifyContent: 'space-between', alignItems: "center", mb: '16px' }}>
                        <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold", fontSize: "24px" }}>
                           Doctors Available
                        </Typography>

                        <Stack direction="row">
                            <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} />
                        </Stack>
                    </Stack>
                    <DataList rowsCount={rowsCount} rows={rows} pageInfo={pageInfo} onPageClicked={OnPageClicked} getChipStyle={getChipStyle} onActionClicked={onActionClicked} />        
                </>
            )}        
     </Box>
    );
});

export default Component;