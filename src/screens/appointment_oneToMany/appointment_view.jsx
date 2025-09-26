
import { useEffect, useState } from "react";
import { Box, Typography, Grid, Stack, Button, Divider } from '@mui/material';
import { Container } from "components";
import RenderFormContols from "./child/formcontrols";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft as ArrowLeftIcon, Edit as EditIcon } from '@mui/icons-material';

import { Extract } from "./child/extract";

const Component = (props) => {

    const { title } = props;
    const NavigateTo = useNavigate();
    const { id } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [row, setRow] = useState({});
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const [childCollections, setChildCollections] = useState([]);

    const fetchData = async () => {
        await Extract(id).then(rslt => {
            console.log(rslt);
            const { row, options, collections } = rslt;
            setRow(row);
            setChildCollections(collections);
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
                    <Stack direction="row" sx={{ width: "100%", justifyContent: 'flex-end', alignItems: "center", my: '16px', gap: 3 }}>                          
                        <Button variant="outlined" startIcon={<ArrowLeftIcon />}
                            sx={{ borderRadius : 2, fontSize: 12, fontWeight: 700, height: 32, textTransform: "unset" }}
                            onClick={() => NavigateTo(-1)}
                        > Back </Button>
                        <Button variant="contained" startIcon={<EditIcon sx={{ width : 16 }}/>}
                            sx={{ borderRadius : 2, fontSize: 12, fontWeight: 700, height: 32, textTransform: "unset", bgcolor: "primary.main" }}
                            onClick={() => NavigateTo(`/Appointments/edit/${id}`)}
                        > Edit Appointments </Button>
                    </Stack>
                </Box>
                <RenderFormContols shadow={true} {...props} mode={"view"} options={dropDownOptions} controls={row} />
            </Container >
        </>
    );

};

export default Component;