import LandingPage from "./landing_page/index.jsx";
import Signup from "./auth/signup.js";
import Login from "./auth/login.js";
import NotFound from "./NotFound.jsx";
import Appointments from "./appointment_table/appointment_index.jsx";
import PatientTiles from "./patient_tiles/patient_tiles.jsx";
import PatientCreate from "./patient_details/patient_createForm.jsx";
import PatientEdit from "./patient_details/patient_editForm.jsx";
import PatientView from "./patient_details/patient_view.jsx";
import AppointmentCreate from "./appointment_oneToMany/appointment_create.jsx";
import AppointmentEdit from "./appointment_oneToMany/appointment_edit.jsx";
// import AppointmentView from "./appointment_oneToMany/appointment_view.jsx";
import PatientStepper from "./patient_stepper/patient_stepper_index.js";
import Home from "./home/home_index.jsx";
import BookingStepper from "./booking_stepper/booking_stepper.jsx";
import AppointmentList from "./appointment_list/appointment_list.jsx";
import Payments from "./payment_singlePageTable/payment_index.jsx"
import AppointmentView from "./appointment_detail/appointment_view.jsx";

export {
LandingPage,
Signup, Login,
NotFound,
Appointments, 
PatientTiles, 
PatientCreate, PatientEdit, PatientView, 
AppointmentCreate, AppointmentEdit, AppointmentView,
PatientStepper,
Home,
BookingStepper,
AppointmentList,
Payments,
};