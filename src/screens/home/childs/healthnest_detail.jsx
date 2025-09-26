import { Grid2 as Grid, Box, Typography } from '@mui/material'
import React from 'react'
import ClinicImg from "../../../assets/clinic_img.png";
import { Image } from 'components';

const Component = () => {
  return (
    <Box sx={{ width: "100%" }}>
        <Typography noWrap variant="subheader" component="div">
            About HealthNest
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid  size={{ xs: 2, sm: 4, md: 8 }}>
                <Typography variant='caption' component="div" sx={{ pb: 3 }}>
                    At HealthNest, we are committed to providing compassionate, high-quality healthcare tailored to every patient’s unique needs. With a strong focus on personalized care, clinical excellence, and modern medical practices, our mission is to ensure every individual receives the attention and treatment they deserve — with empathy and trust at the core.
                </Typography>
                <Typography variant='caption' component="div" sx={{ pb: 3 }}>
                    Founded in 2020, our clinic offers a full range of diagnostic, preventive, and treatment services across specialties including [e.g., General Medicine, Pediatrics, Dermatology, etc.]. Whether you're visiting for a routine consultation or specialized care, our team of experienced doctors and support staff is here to guide you every step of the way.
                </Typography>
                <Typography variant='caption' component="div" sx={{ pb: 3 }}>
                    At HealthNest, your health is our priority — and your comfort, our responsibility.
                </Typography>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <Image alt="Image" src={ClinicImg} />
            </Grid>
        </Grid>
    </Box>
  )
}

export default Component