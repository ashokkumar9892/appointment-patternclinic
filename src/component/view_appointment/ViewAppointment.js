import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import "./appointment.css";
import api from "../../api";
import TopHeader from "../common/topHeader";
import PatientContext from "../../context/patientDetails/patientContext";
import { useHistory } from "react-router-dom";
import Confetti from 'react-dom-confetti';
import ResponsivePlayer from "../videoplayer";
import typeImg from "../../assets/confirm/type.png";
import personImg from "../../assets/confirm/person.png";
import calenderImg from "../../assets/confirm/calender.png";
import questionImg from "../../assets/confirm/question.png"



const ViewAppointment = () => {
  const history = useHistory();
  const [showConfetti, setShowConfetti] = useState(false)
  const [show, setShow] = useState(false);
  const [insuranceError, setInsuranceError] = useState("");
  const [insurance, setInsurance] = useState({ departmentid: 1 });
  const [insuranceBtnLoading, setInsuranceBtnLoading] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const patientContext = useContext(PatientContext);
  const { id } = useParams();
  const [appointment, setAppointment] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [checkinRequirements, setCheckinRequirements] = useState([]);
  const [videoComplete, setVideoComplete] = useState(false);
  const config = {
    angle: 90,
    spread: 360,
    startVelocity: "74",
    elementCount: "165",
    dragFriction: "0.11",
    duration: "8480",
    stagger: "15",
    width: "21px",
    height: "20px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  const appointmentStatus = {
    x: "Cancelled",
    f: "Future",
    o: "Open",
    2: "Checked in",
    3: "Checked out",
    4: "Charge entered",
  };
  useEffect(() => {
    loadData();
    setShowConfetti(true)
    window.gtag('event', 'conversion', { 'send_to': 'AW-774469977/9IDQCMrBpoEYENnypfEC' });
  }, []);

  useEffect(() => {
    const element = document.getElementById("ViewComplete");
    if (element !== null) {
      element.scrollIntoView();
    }
  }, [videoComplete])
  const checkInsurance = () => {
    //history.push("/checkin/")
    let request = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/patients/${patientContext.patientDetails.patientid}/insurances`,
    };
    api.checkInsurances(request).then((res) => {
      console.log(res)
      if (res.data.insurances.length > 0) {
        let copays = res.data.insurances[0].copays;
        history.push({ pathname: "/checkin/", state: { copay: copays } })
      } else {
        history.push("/checkin/")
      }
    })
  }

  const loadData = () => {
    let request = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/${id}`,
    };
    api.getAuth(request).then((res) => {
      let data = res.data[0];
      if (data) {
        data["appointmentstatusName"] =
          appointmentStatus[data.appointmentstatus] || data.appointmentstatus;
        setAppointment(data);
      }
    });
    let request2 = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/${id}/checkin`,
    };
    api.getAuth(request2).then((res) => {
      const data = (res.data || []).filter((el) => !el.complete && el.required);
      setCheckinRequirements(data);
    });
  };

  const onSelfCheckout = () => {
    if (appointment) {
      setBtnLoading(true);
      let request = {
        url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/${appointment.appointmentid}/checkin`,
      };
      api
        .postAuth(request)
        .then((res) => {
          loadData();
        })
        .finally(() => setBtnLoading(false));
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <TopHeader />
      <main>
        {videoComplete !== true ?
          <div className="text-center">
            <div className="confetti-wrapper">
              <img className="left" src="/confetti2.gif" alt="" />
              <img className="right" src="/confetti1.gif" alt="" />
            </div>
            {/* <Confetti active={showConfetti} config={config} /> */}
            <h2 className="appointment-title">Congratulations!</h2>
            <div className="appointment-subtitle">You appointment has been booked</div>
            <div className="watchtext">Please watch this video</div>
            <div className="py-3 video-wrapper">
              <video style={{ width: '100%' }} src="/promo.mp4" onEnded={() => setVideoComplete(true)} controls autoPlay></video>
              {/* <ResponsivePlayer afterComplete={setVideoComplete} /> */}
            </div>
          </div>
          :
          <div id="ViewComplete" className="row mt-50 text-center">
            <div style={{ maxWidth: '600px', margin: 'auto' }}>
              <div className="nameDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={typeImg} />
                </div>
                <div className="labelList">
                  <p className="labelName">Appointment No.: </p>
                  <p>{appointment?.appointmentid}</p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={personImg} />
                </div>
                <div className="labelList">
                  <p className="labelName">Patient Name :  </p>
                  <p>{patientContext.patientDetails.firstname}  {patientContext.patientDetails.lastname}</p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={calenderImg} />
                </div>
                <div className="labelList">
                  <p className="labelName">Appointment Date & Time  </p>
                  <p><span>{appointment?.date} {appointment?.starttime}</span></p>
                </div>
              </div>
              <div className="nameDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={questionImg}/>
                </div>
                <div className="labelList">
                  <p className="labelName">Type  </p>
                  <p>{appointment?.appointmenttype}</p>
                </div>
              </div>
            </div>
            <div className="col-12 mb-3 py-5">
              <label className="mb-3">
                <p style={{ fontSize: "26px", fontWeight: "bold" }}>Would you like to proceed with check in process?</p>
              </label>
              <br />
             
              <button
                type="button"
                className="buttonDiv"
                onClick={checkInsurance}
              >
                Yes
              </button>
              <button type="button"className="buttonDiv nextButton">
                Later
              </button>
            </div>
          </div>}
      </main>
    </div>
  );
};

export default ViewAppointment;
