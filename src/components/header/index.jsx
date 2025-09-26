import * as React from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, Stack, Badge } from '@mui/material';
import { Avatar, Menu, MenuItem, Divider, IconButton, Tooltip, ListItemIcon } from "@mui/material";
import LogoIcon from "../../assets/Logo.png";
import { Image } from 'components';
import { Chat } from 'components';
import ChatIcon from "../../assets/ChatIcon.svg";
import BellIcon from "../../assets/BellIcon.svg";
import LocateIcon from "../../assets/LocateIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import TimerSession from "shared/useTimerSession";
import Session from "shared/session";
import { Logout, Person } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const AccountMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const NavigateTo = useNavigate();
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onActionClicked = (type) => {
    if(type === 'profile') NavigateTo(`/Patients/view/${row.PatientId}`);

    if(type === 'signout') { 
        Session.Store("isAuthenticated", false);
        Session.Store("jwtToken", null);
        Session.Store("Username", null);
        global.AlertPopup("success", "Signed out successfully.");
    }
  }

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
            alt={row.FullName}
            src={row.logo}
          >
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
            paper: {
            elevation: 4,
            sx: {
                mt: 1.5,
                overflow: "visible",
                borderRadius: 2,
                minWidth: 180,
                "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
                },
            },
            }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => onActionClicked('profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onActionClicked('signout')}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}

const Component = ({ row, Id }) => {
    const [showItem, setShowItem] = React.useState('');
    const [badgeCounts, setBadgeCounts] = React.useState({
        chat: 0,
        notification: 0,
    });

    const [isAuthenticated] = TimerSession('isAuthenticated', true);

    const onActionClicked = (e) => {
        if(showItem === e) { setShowItem(""); return; }
        setShowItem(e);
    }

    const updateBatchCounts = (name, value) => {
        setBadgeCounts(prev => ({...prev, [name] : value}));
    }


    return (
        <>
            <CssBaseline />
            <AppBar elevation={1} position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 , height:"58px", justifyContent:"center", display:"flex"}}>
                <Toolbar sx={{ height : 58, position: 'relative', gap: 2 }}>
                    <Image sx={{ width: 40, height: 40, mr: 4 }} alt="logo" src={LogoIcon} />

                    <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700, color: "secondary.main" }}>
                        HealthNest
                    </Typography>

                    <Image alt="Locate us" sx={{ mr: 2, cursor: 'pointer' }} src={LocateIcon}  />

                    <Badge badgeContent={badgeCounts.chat} color="error" overlap="circular" invisible={!badgeCounts.chat}>
                         <Image alt="Chat" sx={{ cursor: 'pointer' }} src={ChatIcon}  onClick={() => onActionClicked("Chat")} />
                    </Badge>

                    <Image alt="Search" sx={{ cursor: 'pointer' }} src={SearchIcon}  />
                    <Image alt="Notification" sx={{ cursor: 'pointer' }} src={BellIcon} />
                    <AccountMenu row={row} />

                    {isAuthenticated && Id ? <Chat Id={Id} showItem={showItem}  updateBatchCounts={updateBatchCounts} onActionClicked={onActionClicked} /> : null}
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Component;
