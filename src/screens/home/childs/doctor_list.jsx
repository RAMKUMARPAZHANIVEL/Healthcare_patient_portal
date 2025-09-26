
import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, IconButton, useTheme, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { Container } from "components";
import { DataList } from '../../childs';
import * as Api from "shared/services";
import { SearchInput, ToggleButtons } from "components";
import { Add as AddBoxIcon } from '@mui/icons-material';
import Helper from "shared/helper";

const doctorList = [
        {
            "DoctorSpecialty": 1,
            "DateOfJoining": "2023-09-20",
            "OverallRating": 0,
            "DoctorDoctorImage": null,
            "DoctorId": "Dr. Rakesh Rao",
            "ReviewCount": 0,
            "RegistrationNumber": null,
            "IsWeekly": false,
            "About": "I am a hemato-oncologist with an intensive training from the esteemed Hematology Department at Christian Medical College, Vellore (CMC).",
            "IsApprovedByClinic": null,
            "Experience": "12 years",
            "ConsultationFee": 400.0,
            "Specialty": {
                "DocSpeId": 1,
                "Name": "General Physician",
                "Description": "For common illnesses, fever, infections, and general health advice."
            },
            "Qualifications": [
                {
                    "QualificationId": 1,
                    "Year": 2000,
                    "University": "contest",
                    "Degree": "MBBS"
                },
                {
                    "QualificationId": 2,
                    "Year": 2006,
                    "University": "contest",
                    "Degree": "DM Hematology"
                },
                {
                    "QualificationId": 3,
                    "Year": 2002,
                    "University": "contest",
                    "Degree": "MD General Medicine"
                }
            ]
        }
]


const getChipStyle = (type) => {
    const colorMap = (rating) => {
        if (rating >= 4.5) return '#1F9254';      // Green
        if (rating >= 3) return '#ff9800';        // Orange
        if (rating > 0) return '#A30D11';         // Red
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

const Component = (props) => {
    const { title, filterBy, onFilterChange } = props;
    const theme = useTheme();
    const [initialize, setInitialize] = useState(false);
    const [pageInfo, setPageInfo] = useState({ page: 0, pageSize: 5 });
    const [rowsCount, setRowsCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [searchStr, setSearchStr] = useState("");

    const NavigateTo = useNavigate();

    const OnSearchChanged = (e) => { setSearchStr(e); }

    const OnPageClicked = (e) => { setPageInfo({ page: 0, pageSize: 5 }); if (e) setPageInfo(e); }


    const FetchResults = async () => {
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
            filters.push(`$filter=${filterBy.name} eq ${filterBy.value}`);
        }

        if (!Helper.IsNullValue(searchStr)) {
            filters.push(`$filter=contains(About, '${searchStr}')`);
        }
        // /Doctors?$filter=contains("About",'oncologist')&$skip=0&$top=5&$expand=Specialty,Qualifications

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
                        prop3: `Consultant - ${_Doctor.Speciality?.Name}`,
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


    if (initialize) { setInitialize(false); FetchResults(); }

    useEffect(() => { setInitialize(true); }, [pageInfo, searchStr, filterBy]);

    useEffect(() => { setInitialize(true); }, []);

     const OnActionClicked = (id, type) => {
        let _route;
        if (type === 'edit') _route = `/Doctors/edit/${id}`;
        if (type === 'view') _route = `/book-appointment?speciality=${filterBy.value}&doctor=${id}`;
        if (_route) NavigateTo(_route);
    }

    const onViewAllClicked = () => {
        if(onFilterChange) onFilterChange({})
    }

    return (
        <Box sx={{ width: '100%'  }}>
            <Stack direction="row" sx={{ width: "100%", justifyContent: 'space-between', alignItems: "center", mb: '16px' }}>
                <Typography noWrap variant="subheader" component="div" sx={{ fontWeight: "bold", fontSize: "24px" }}>
                    {title}
                </Typography>

                <Stack direction="row">
                    <SearchInput searchStr={searchStr} onSearchChanged={OnSearchChanged} isOneToMany={true} />

                    <Button 
                        onClick={onViewAllClicked}
                    >
                        View All
                    </Button>
                </Stack>
            </Stack>
            <DataList rowsCount={rowsCount} rows={rows} pageInfo={pageInfo} onPageClicked={OnPageClicked} getChipStyle={getChipStyle} onActionClicked={OnActionClicked} />
        </Box>
    );

};

export default Component;
