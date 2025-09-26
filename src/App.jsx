import React, { useEffect } from 'react';
import Routes from "./Routes";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Header, Wrapper, Drawer, AlertMessage } from 'components';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DefaultTheme } from "./theme";
import TimerSession from "shared/useTimerSession";
import Helper from "shared/helper";
import * as Api from "shared/services";
import Session from "shared/session";

global.Busy = (bBool) => {
  var x = document.getElementById("busyloader");
  if (x) x.className = bBool ? "loader display-block" : "loader display-none";
};

global.AlertPopup = (type, msg) => {
  sessionStorage.setItem('alert', JSON.stringify({ msg, type }));
};

const fullScreenRoutes  = ['/patient/stepper', '/login', '/signup'];

const shouldShowLayout = (pathname) => {
  const isFullScreen = fullScreenRoutes.some(path => pathname.startsWith(path));
  return !isFullScreen;
}

function App() {
  const [open, setOpen] = React.useState(true);
  const [customTheme, setCustomTheme] = React.useState(DefaultTheme);
  const [row, setRow] = React.useState({});
  const [isAuthenticated] = TimerSession('isAuthenticated', true);

  const location = useLocation();
  const showLayout = shouldShowLayout(location.pathname);

    const fetchPatient = async () => {
        return new Promise(async (resolve) => {
            global.Busy(true);
            let query = null, _row = {};

            const username = Session.Retrieve("Username");
            query = `$filter=Email eq '${username}'`

            await Api.GetPatientsMulti(query)
                .then(async (res) => {
                    if(res.status) {
                        const rslt = res.values?.at(0);
                        _row = rslt;
                        Session.Store("PatientId", rslt.PatientId);
                    }
                });
                 _row?.PatientProfilePicture &&
                    await Api.GetDocumentSingleMedia(_row?.PatientProfilePicture, true, null).then((resI) => {
                        _row = { ..._row, logo: resI.values };
                    })

                setRow(_row);
                global.Busy(false);
            });
    }

    useEffect(() => {
      console.log(isAuthenticated, "auth");
      if(isAuthenticated) fetchPatient();
    }, [isAuthenticated])


  const OnDrawerClicked = () => { setOpen(!open); }
  return (
      <ThemeProvider theme={customTheme}>
          <CssBaseline />
              <Box sx={{ flexGrow: 1 }}>
                  {showLayout ? (
                      <>
                          <Header open={open} onDrawerClicked={OnDrawerClicked} Id={row.PatientId} row={row} />
                          <Drawer open={open} />
                          <Wrapper open={open}>
                          <Routes />
                          </Wrapper>
                      </>
                  ) : (
                      <Routes />
                  )}
                <AlertMessage />
              </Box>
      </ThemeProvider>
  );
}

export default App;