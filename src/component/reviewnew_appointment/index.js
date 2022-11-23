import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/Appointment/logo.svg";
import leftQuote from "../../assets/Appointment/left-quote.svg";
import dateLogo from "../../assets/schedule/datelogo.png";
import location from "../../assets/schedule/location.png"
import rightQuote from "../../assets/Appointment/right-quote.svg";
import person from "../../assets/schedule/person.png";
import msg from "../../assets/schedule/msg.png";
import call from "../../assets/schedule/call.png";
import question from "../../assets/schedule/question.png";
import insurence from "../../assets/schedule/insurence.png";
import "./reviewnew.css"
import reCAPTCHA from "react-google-recaptcha";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TopHeader from "../common/topHeader";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import swal from "sweetalert";
import moment from "moment";
import { useHistory } from "react-router-dom";

const ReviewAppoinmentNew = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [show, setShow] = useState(false);
  const [insuranceError, setInsuranceError] = useState("");
  const [insuranceBtnLoading, setInsuranceBtnLoading] = useState(false);
  const [checkterm, setCheckterm] = useState(false);
  const [insurance, setInsurance] = useState({ departmentid: 1 });
  const [loading, setLoading] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function getAge(dateString) {
    var now = new Date();
    var today = new Date(now.getYear(), now.getMonth(), now.getDate());

    var yearNow = now.getYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    var dob = new Date(dateString);

    var yearDob = dob.getYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    var age = {};
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";

    var yearAge = yearNow - yearDob;

    if (monthNow >= monthDob) var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob) var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge,
    };

    if (age.years > 1) yearString = " years";
    else yearString = " year";
    if (age.months > 1) monthString = " months";
    else monthString = " month";
    if (age.days > 1) dayString = " days";
    else dayString = " day";

    if (age.years > 0 && age.months > 0 && age.days > 0)
      ageString =
        age.years +
        yearString +
        ", " +
        age.months +
        monthString +
        ", and " +
        age.days +
        dayString +
        " old.";
    else if (age.years == 0 && age.months == 0 && age.days > 0)
      ageString = "Only " + age.days + dayString + " old!";
    else if (age.years > 0 && age.months == 0 && age.days == 0)
      ageString = age.years + yearString + " old. Happy Birthday!!";
    else if (age.years > 0 && age.months > 0 && age.days == 0)
      ageString =
        age.years + yearString + " and " + age.months + monthString + " old.";
    else if (age.years == 0 && age.months > 0 && age.days > 0)
      ageString =
        age.months + monthString + " and " + age.days + dayString + " old.";
    else if (age.years > 0 && age.months == 0 && age.days > 0)
      ageString =
        age.years + yearString + " and " + age.days + dayString + " old.";
    else if (age.years == 0 && age.months > 0 && age.days == 0)
      ageString = age.months + monthString + " old.";
    else ageString = "Oops! Could not calculate age!";

    return ageString;
  }

  var details = {
    patientid: patientContext.patientDetails.patientid,
    appointmenttypeid: patientContext.patientDetails.appointmenttypeid,
    appointmentid: patientContext.patientDetails.appointmentid,
    departmentid: 9325,
    ignoreschedulablepermission: true,
  };

  const Preview = () => {
    setTimeout(() => {
      history.push("/schedule/");
    }, 500);
  };
  const ShaduleAppointment = () => {
    setLoading(true)
    const formData = new FormData();
    buildFormData(formData, details);
    let request = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/${patientContext.patientDetails.appointmentid}`,
      data: new URLSearchParams(formData),
    };
    api
      .putAuth(request)
      .then((data) => {
        setLoading(false)
        if (data.status === 200) {
          history.push("/appointment/" + data.data[0].appointmentid);
        } else {
          swal("Appointment not Booked!", "error");
        }
      })
      .catch((error) => { setLoading(false) });
  };
  const patientInsurance = () => {
    setInsuranceError("");
    const formData = new FormData();
    const data = {
      ...insurance,
      expirationdate: moment(insurance.expirationdate).format("MM/DD/YYYY"),
      issuedate: moment(insurance.issuedate).format("MM/DD/YYYY"),
    };
    setInsuranceBtnLoading(true);
    buildFormData(formData, data);
    let request = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/patients/${patientContext.patientDetails.patientid}/insurances`,
      data: new URLSearchParams(formData),
    };
    api
      .postAuth(request)
      .then((data) => {
        if (data.status === 200) {
          handleClose();
        }
        console.log("data", data);
      })
      .catch((error) => {
        setInsuranceError(error.response.data);
      })
      .finally(() => {
        setInsuranceBtnLoading(false);
      });
  };
  const buildFormData = (formData, data, parentKey) => {
    if (
      data &&
      typeof data === "object" &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      Object.keys(data).forEach((key) => {
        buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    } else {
      const value = data == null ? "" : data;

      formData.append(parentKey, value);
    }
  };
  const onInputChange = (e) => {
    setInsurance({ ...insurance, [e.name]: e.value });
  };

  return (
    <section className="appointmentrow mx-0">
      <div className="left-sidebar">
        <img src={logo} alt="The Patient App" className="logo" />
        <div className="quote">
          <img src={leftQuote} className="quote-icon left" />
          <img src={rightQuote} className="quote-icon right" />
          <h2>Healthcare You Can Afford</h2>
          <p >Here at A Pattern Medical Clinic, our top priority is patient care. In order to make sure that we can see you, we choose rates that are well below the Emergency Room prices.</p>
        </div>
      </div>
      <div className="right-content">
        <div className="rigthDiv">
        <div>
          <p> <span className="patientText"> Review </span> <span className="informationText">Information </span> </p>

        </div>
        <div className="nameDiv">
          <div className="imageDiv">
            <img height={20} width={20} src={person} />
          </div>
          <div className="textLocationDiv">
            <strong>
              {patientContext.patientDetails.firstname +
                " " +
                patientContext.patientDetails.lastname}
            </strong>

            <div className="">
              {getAge(patientContext.patientDetails.dob)} |{" "}
              {patientContext.patientDetails.dob} |
              {patientContext.patientDetails.sex}
            </div>

          </div>
        </div>
        <div className="nameDiv">
          <div className="imageDiv">
            <img height={20} width={20} src={call} />
          </div>
          <div className="textLocationDiv">
            <p className="labelName">Phone </p>
            <p>{patientContext.patientDetails.phone}</p>
          </div>
        </div>
        <div className="nameDiv">
          <div className="imageDiv">
            <img height={20} width={20} src={msg} />
          </div>
          <div className="textLocationDiv">
            <p className="labelName">Email</p>
            <p>{patientContext.patientDetails.email}</p>
          </div>
        </div>
        <div className="nameRow" style={{ marginTop: "24px" }}>
          <div className="dateTimeDiv">
            <div className="imageDiv">
              <img height={20} width={20} src={dateLogo} />
            </div>
            <div className="textLocationDiv">
              <p className="labelName">Day and Time</p>
              <p> {patientContext.patientDetails.value} <br />
                {patientContext.patientDetails.timeData}(EDT)</p>
            </div>
          </div>
          <div className="dateTimeDiv">
            <div className="imageDiv">
              <img height={20} width={20} src={location} />
            </div>
            <div className="textLocationDiv">
              <p className="labelName">Location</p>

              <p>{patientContext.patientDetails.location}</p>
            </div>
          </div>
        </div>
        <div className="nameRow" style={{ marginTop: "24px" }}>
          <div className="dateTimeDiv">
            <div className="imageDiv">
              <img height={20} width={20} src={question} />
            </div>
            <div className="textLocationDiv">
              <p className="labelName">Reason for Visit</p>
              <p>  {patientContext.patientDetails.reason}</p>
            </div>
          </div>

          <div className="dateTimeDiv">
            <div className="imageDiv">
              <img height={20} width={20} src={insurence} />
            </div>
            <div className="textLocationDiv">
              <p className="labelName">Insurance</p>
              <p> {patientContext.patientDetails.insurance}</p>
            </div>
          </div>
        </div>
        <div>

          <div className="row" style={{ marginTop: "24px" }}>
            <div className="col-md-12">
              <p className="mb-0">
                <strong>Additional Notes</strong>
              </p>
              <p>{patientContext.patientDetails.additional}</p>
            </div>
          </div>
          <div className="col-md-12">
            <input
              type="checkbox"
              checked={checkterm}
              className=""
              onClick={() => {
                setCheckterm(!checkterm);
              }}

            />{" "}
            I agree to the{" "}
            <span className="text-primary">
              Terms and Conditions{" "}
            </span>
            and{" "}
            <span className="text-primary">
              Privacy policy.
            </span>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>

          <button className="buttonDiv"
            onClick={() => {
              Preview();
            }}
          >

            Previous
          </button>


          {loading == false && (
            <button className="buttonDiv nextButton"
              style={{ width: '170px' }}
              type="button"
              disabled={!checkterm}
              onClick={() => {
                ShaduleAppointment();
              }}

            >
              Shedule Appointment
            </button>)}
          {loading == true && (
            <button
              type="button"
              disabled={true}
              className=" buttonDiv nextButton btn-primary"
            >
              Loading...
            </button>
          )}


        </div>
      </div>
      </div>

    </section>
  )
}
export default ReviewAppoinmentNew;