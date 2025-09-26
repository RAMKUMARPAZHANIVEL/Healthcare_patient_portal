import React from 'react';
import { Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import { AddLink, HomeOutlined , Dashboard, Badge, PersonOutlineOutlined, ContactPage, People, ViewList, ViewModule, TableRows, GridOn, Settings, Notifications, Info, ShoppingBasket, Toc, EditNote, Checklist, Tab, GridView, PaymentOutlined, ArticleOutlined, DoneOutlined } from '@mui/icons-material';
import { DRAWER_WIDTH } from "config";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Session from "shared/session";

const menuItems = [
    { title: "Home", path: "/home", icon: <HomeOutlined color="primary" />},
    { title: "Appointments", path: "/appointments", icon: <ArticleOutlined color="primary" />}, 
    { title: "Payments", path: "/payments", icon: <PaymentOutlined color="primary" />},
    { title: "Profile", path: `/Patients/view/${Session.Retrieve('PatientId')}`, icon: <PersonOutlineOutlined color="primary" />},
    { title: "Book an Appointment", path: "/book-appointment", icon: <DoneOutlined color="primary" />},
]

const openedMixin = (theme) => ({
    width: DRAWER_WIDTH,
    border: 0,
    borderRight: `solid rgba(0, 0, 0, .12) 1px`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    border: 0,
    borderRight: `solid rgba(0, 0, 0, .12) 1px`,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const CustomDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

const Component = (props) => {
    const { open } = props;
    const [expand, setExpand] = React.useState(false);
    const NavigateTo = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        setExpand(!expand);
    };

    const theme = useTheme();

    return (
        <CustomDrawer variant="permanent" open={open} anchor="left">
            <Toolbar />
            <List>
                <ListItem disablePadding sx={{ display: 'block', py: 1 }}>
                    <List component="div" disablePadding>
                        {menuItems.map(({ title, icon, path }) => (
                            <ListItemButton onClick={() => NavigateTo(path)} key={path}
                                sx={{
                                    height: 40, borderRadius: 1.5, mx: 3, mb: 0.5,
                                    bgcolor: location.pathname === path ? "primary.main" : "transparent",
                                    ":hover": { bgcolor : location.pathname === path ? "primary.main" : "background.surface" }
                                }}
                                data-testid={`drawer-${title}`}
                            >
                                <ListItemIcon sx={{ minWidth: 16 }}>
                                    <Tooltip title={title} sx={{ width: 22, fill: location.pathname === path ? "#ffff" : "" }}>
                                        {icon}
                                    </Tooltip>
                                </ListItemIcon>
                                {open && <ListItemText primary={title}
                                            sx={{ pl: 2, color : location.pathname === path ? "#ffff" : ""}} 
                                            slotProps={{ primary: {sx: { fontSize: '14px', fontWeight: '500' }} }} />}
                            </ListItemButton>
                        ))}
                    </List>
                </ListItem>
            </List>
        </CustomDrawer>
    );
}

export default Component;
