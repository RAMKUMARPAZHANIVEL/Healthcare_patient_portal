
import { useEffect, useState } from "react";
import { Typography, Grid, Stack, Button, Box, Divider } from '@mui/material';
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';
import { Container } from "components";
import { useNavigate, useParams } from "react-router-dom";
import RenderFormContols from "./child/formcontrols";

import { Extract } from "./child/extract";

const Component = (props) => {
    const { title } = props;
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [dropDownOptions, setDropDownOptions] = useState([]);

    const fetchData = async () => {

        await Extract(id).then(rslt => {
            const { row, options } = rslt;
            setRow(row);
            setDropDownOptions(options);
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
                    <Stack direction="row" sx={{ justifyContent: 'flex-end', alignItems: "center", my: '16px', gap: 2 }}>                          
                        <Button variant="outlined" startIcon={<ArrowLeftIcon />}
                         onClick={() => NavigateTo(-1)}
                        > Back </Button>

                        <Button variant="contained" startIcon={<EditIcon sx={{ width : 16 }}/>}
                          onClick={() => NavigateTo(`/Patients/edit/${id}`)}
                        > Edit Profile </Button>
                    </Stack>
                </Box>
                <RenderFormContols shadow={true} {...props} mode={"view"} options={dropDownOptions} controls={row} />
            </Container>
        </>

    );

};

export default Component;