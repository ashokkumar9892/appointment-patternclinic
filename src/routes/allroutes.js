import ViewAppointment from "../component/view_appointment/ViewAppointment";
import FamilyForm from "../component/common/FamilyForm";
import NewAppointment from "../component/appointmentnew";
import ScheduleAppointmentNew from "../component/scheduleAppointmentnew/ScheduleAppointmentnew";
import ReviewAppoinmentNew from "../component/reviewnew_appointment";
import CheckInNew from "../component/checkinprocessnew";

const routes = [
  { path: "/", exact: true, strict: true, component: NewAppointment },
  { path: "/schedulenew", strict: true, component: ScheduleAppointmentNew },
  {
    path: "/reviewnew",
    exact: true,
    strict: true,
    component: ReviewAppoinmentNew,
  },
  {
    path: "/appointment/:id",
    exact: true,
    strict: true,
    component: ViewAppointment,
  },
  { path: "/checkin/:id", exact: true, strict: true, component: CheckInNew },
  { path: "/familyForm", exact: true, strict: true, component: FamilyForm },
];

export default routes;
