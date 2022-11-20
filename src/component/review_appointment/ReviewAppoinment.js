import reCAPTCHA from "react-google-recaptcha";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TopHeader from "../common/topHeader";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import swal from "sweetalert";
import moment from "moment";
import { useHistory } from "react-router-dom";
const ReviewAppoinment = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [show, setShow] = useState(false);
  const [insuranceError, setInsuranceError] = useState("");
  const [insuranceBtnLoading, setInsuranceBtnLoading] = useState(false);
  const [checkterm, setCheckterm] = useState(false);
  const [insurance, setInsurance] = useState({ departmentid: 1 });

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
    const formData = new FormData();
    buildFormData(formData, details);
    let request = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/${patientContext.patientDetails.appointmentid}`,
      data: new URLSearchParams(formData),
    };
    api
      .putAuth(request)
      .then((data) => {
        if (data.status === 200) {
          history.push("/appointment/" + data.data[0].appointmentid);
        } else {
          swal("Appointment not Booked!", "error");
        }
      })
      .catch((error) => {});
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
    <>
      <TopHeader />
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-6  mx-auto">
              <div className="card mb-1">
                <div className="card-header bg-primary text-white text-large">
                  Review Appointment
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card mb-5 ">
                    <div className="card-header text-medium bg-danger">
                      <strong>Patient Information</strong>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <div className="row g-3">
                            <div className="col-auto">
                              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                <i className="text-primary icon-20 bi-person-fill"></i>
                              </div>
                            </div>
                            <div className="col">
                              <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                <div className="d-flex flex-column">
                                  <div className="mb-0">
                                    <strong>
                                      {patientContext.patientDetails.firstname +
                                        " " +
                                        patientContext.patientDetails.lastname}
                                    </strong>
                                  </div>
                                  <div className="">
                                    {getAge(patientContext.patientDetails.dob)} |{" "}
                                    {patientContext.patientDetails.dob} |
                                    {patientContext.patientDetails.sex}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <div className="row g-3">
                            <div className="col-auto">
                              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                <i className="text-primary icon-20 bi-telephone-fill"></i>
                              </div>
                            </div>
                            <div className="col">
                              <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                <div className="d-flex flex-column">
                                  <div className="mb-0">
                                    <strong>Phone</strong>
                                  </div>
                                  <div className="">
                                    {patientContext.patientDetails.phone}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr />
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <div className="row g-3">
                            <div className="col-auto">
                              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                <i className="text-primary icon-20 bi-envelope-fill"></i>
                              </div>
                            </div>
                            <div className="col">
                              <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                <div className="d-flex flex-column">
                                  <div className="mb-0">
                                    <strong>Email</strong>
                                  </div>
                                  <div className="">
                                    {patientContext.patientDetails.email}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row g-2 my-3">
                            <div className="col-xl-6 col-12">
                              <div className="card border border-primary">
                                <div className="card-body">
                                  <div className="row g-3">
                                    <div className="col-auto">
                                      <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                        <i className="text-primary icon-20 bi-calendar-week"></i>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                        <div className="d-flex flex-column">
                                          <div className="mb-0">
                                            <strong>Day and Time</strong>
                                          </div>
                                          <div className="">
                                            {patientContext.patientDetails.value} <br />
                                            {patientContext.patientDetails.timeData}(EDT)
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-12">
                              <div className="card border border-primary">
                                <div className="card-body">
                                  <div className="row g-3">
                                    <div className="col-auto">
                                      <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                        <i className="text-primary icon-20 bi-map-fill"></i>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                        <div className="d-flex flex-column">
                                          <div className="mb-0">
                                            <strong>Location</strong>
                                          </div>
                                          <div className="">
                                            {patientContext.patientDetails.location}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row g-2 mb-3">
                            <div className="col-xl-6 col-12">
                              <div className="card border border-primary">
                                <div className="card-body">
                                  <div className="row g-3">
                                    <div className="col-auto">
                                      <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                        <i className="text-primary icon-20 bi-patch-question-fill"></i>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                        <div className="d-flex flex-column">
                                          <div className="mb-0">
                                            <strong>Reason for Visit</strong>
                                          </div>
                                          <div className="">
                                            {patientContext.patientDetails.reason}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6 col-12">
                              <div className="card border border-primary">
                                <div className="card-body">
                                  <div className="row g-3">
                                    <div className="col-auto">
                                      <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                        <i className="text-primary icon-20 bi-shield-fill-check"></i>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <div className="card-body d-flex flex-column ps-0 pt-0 pb-0 h-100 justify-content-center">
                                        <div className="d-flex flex-column">
                                          <div className="mb-0">
                                            <strong>Insurance</strong>
                                          </div>
                                          <div className="">
                                            {patientContext.patientDetails.insurance}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <p className="mb-0">
                                <strong>Additional Notes</strong>
                              </p>
                              <p>{patientContext.patientDetails.additional}</p>
                            </div>
                          </div>

                          {/* <div className="row mb-3">
						<div className="col-md-12">
							Robot Capcha
						
							</div>
						</div> */}
                          <div className="row mb-3">
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
                          <div className="row">
                            <div className="col-12">
                              <button
                                type="button"
                                className="btn btn-light mb-1 me-3"
                                onClick={() => {
                                  Preview();
                                }}
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                disabled={!checkterm}
                                className="btn btn-primary mb-1"
                                onClick={() => {
                                  ShaduleAppointment();
                                }}
                              >
                                Schedule Appointment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <div className="card mb-5 vh-80">
                    <div className="card-header text-medium bg-danger">
                      <strong>Appointment Details</strong>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="card h-100 hover-scale-up bg-light">
                            <a
                              className="card-body text-center d-flex flex-row align-items-center"
                              href="#"
                            >
                              <div className="sw-8 sh-8 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                                <img src="img/provider-black.png" alt="" />{" "}
                              </div>
                              <p className="heading ps-3 text-body mb-0">
                                <strong>Covid-19 Testing</strong>
                              </p>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <Modal size="lg" show={show} onHide={handleClose}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              patientInsurance();
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Insurance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                {insuranceError && (
                  <div className="col-12">
                    <div className="alert alert-danger">{insuranceError}</div>
                  </div>
                )}
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Insurance ID Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="insuranceidnumber"
                      value={insurance.insuranceidnumber}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Insurance Package ID</label>
                    <input
                      type="number"
                      className="form-control"
                      name="insurancepackageid"
                      value={insurance.insurancepackageid}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Issue Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="issuedate"
                      value={insurance.issuedate}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Expiration Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="expirationdate"
                      value={insurance.expirationdate}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Policyholder First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="insurancepolicyholderfirstname"
                      value={insurance.insurancepolicyholderfirstname}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Policyholder Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="insurancepolicyholderlastname"
                      value={insurance.insurancepolicyholderlastname}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Policy Holder Sex</label>
                    <select
                      className="form-control"
                      name="insurancepolicyholdersex"
                      value={insurance.insurancepolicyholdersex}
                      onChange={(e) => onInputChange(e.target)}
                      required
                    >
                      <option value=""></option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Insured Entity type Id</label>
                    <select
                      className="form-control"
                      name="insuredentitytypeid"
                      value={insurance.insuredentitytypeid}
                      onChange={(e) => onInputChange(e.target)}
                      required
                    >
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Relationship to Insured id
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="relationshiptoinsuredid"
                      value={insurance.relationshiptoinsuredid}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Sequence Number</label>
                    <input
                      type="number"
                      className="form-control"
                      name="sequencenumber"
                      value={insurance.sequencenumber}
                      onInput={(e) => onInputChange(e.target)}
                      required
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={insuranceBtnLoading}
              >
                {insuranceBtnLoading ? "Saving" : "Save"}
              </button>
            </Modal.Footer>
          </form>
        </Modal> */}
      </main>
    </>
  );
};

export default ReviewAppoinment;
