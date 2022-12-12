
import ScheduleAppointment from "../component/schedule_appointment/ScheduleAppointment";
import Appointment from "../component/appointment/Appointment";
import ViewAppointment from "../component/view_appointment/ViewAppointment";
import CheckIn from "../component/checkin_process/CheckIn";
import ReviewAppoinment from "../component/review_appointment/ReviewAppoinment";
import FamilyForm from "../component/common/FamilyForm";
import NewAppointment from "../component/appointmentnew";
import ScheduleAppointmentNew from "../component/scheduleAppointmentnew";
import ReviewAppoinmentNew from "../component/reviewnew_appointment";
import CheckInNew from "../component/checkinprocessnew"



const routes  = [
    {path:'/',exact: true, strict:true, component:NewAppointment},
    { path: '/schedule/',strict:true, component: ScheduleAppointment},
    { path: '/schedulenew',strict:true, component: ScheduleAppointmentNew},
    {path:'/review',exact: true, strict:true, component:ReviewAppoinment},
    {path:'/reviewnew',exact: true, strict:true, component:ReviewAppoinmentNew},
    {path:'/appointment/:id',exact: true, strict:true, component:ViewAppointment},
    {path:'/checkin/:id',exact: true, strict:true, component:CheckIn},
    {path:'/checkinnew/:id',exact: true, strict:true, component:CheckInNew},
    {path:'/familyForm',exact:true, strict:true, component:FamilyForm},
    {path:'/newappointment' ,exact: true, strict:true, component: Appointment}
]

export  default routes;