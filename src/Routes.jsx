import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Session from "shared/session";
import {
LandingPage,
Signup, Login,
NotFound,
Appointments, 
PatientTiles, 
AppointmentCreate, AppointmentEdit, AppointmentView,
PatientCreate, PatientEdit, PatientView, 
PatientStepper,
Home, 
BookingStepper,
AppointmentList,
Payments
} from "screens";

function PrivateRoute({ children }) {
    const loggedin = Session.Retrieve("isAuthenticated", true);
    return loggedin ? children : (<Navigate to="/login" />);
}

const ProjectRoutes = (props) => {
    const loggedin = Session.Retrieve("isAuthenticated", true);

    let element = useRoutes([
        !loggedin && { path: "/login", element: (<Login />) },
        { path: "/signup", element: (<Signup />) },
        { path: "*", element: (<NotFound />) }, 
        { path: "/healthNestFe/html", element: (<PrivateRoute> <LandingPage {...props} title="LandingPage" nolistbar={true} /> </PrivateRoute>) },

                                        { path: "/", element: (<PrivateRoute> <Appointments {...props} title="Table Layout" nolistbar={true} /> </PrivateRoute>) },
                                                        { path: "Patients/view/:id", element: (<PrivateRoute> <PatientView {...props} title="View Profile" /> </PrivateRoute>) },
                    { path: "Patients/edit/:id", element: (<PrivateRoute> <PatientEdit {...props} title="Edit Profile" /> </PrivateRoute>) },
                    { path: "Patients/create", element: (<PrivateRoute> <PatientCreate {...props} title="Create Profile" /> </PrivateRoute>) },
                                    { path: "Appointments/view/:id", element: (<PrivateRoute> <AppointmentView {...props} title="View Appointment" /> </PrivateRoute>) },
                    { path: "Appointments/edit/:id", element: (<PrivateRoute> <AppointmentEdit {...props} title="Edit Appointment" /> </PrivateRoute>) },
                    { path: "Appointments/create", element: (<PrivateRoute> <AppointmentCreate {...props} title="Create Appointment" /> </PrivateRoute>) },

            // { path: "/appointments1", element: (<PrivateRoute> <Appointments {...props} title="Table Layout" /> </PrivateRoute>) },
            { path: "/patient1/tiles", element: (<PrivateRoute> <PatientTiles {...props} title="Tiles" /> </PrivateRoute>) },
            { path: "/patient/stepper", element: (<PrivateRoute> <PatientStepper {...props} title="Patient Registration" /> </PrivateRoute>)},
            { path: "/home", element: (<PrivateRoute> <Home {...props} /> </PrivateRoute>)},
            { path:"/book-appointment", element: (<PrivateRoute> <BookingStepper {...props} title="Book an Appointment" /> </PrivateRoute>) },
            { path: "/appointments", element: (<PrivateRoute> <AppointmentList {...props} title="Appointments" /> </PrivateRoute>) },
            { path: "/payments", element: (<PrivateRoute> <Payments {...props} title="Payments" /> </PrivateRoute>) },


    ]);

  return element;
};

export default ProjectRoutes;