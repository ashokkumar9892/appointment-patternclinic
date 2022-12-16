import React, { useContext, useEffect, useState } from "react";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import TopHeader from "../common/topHeader";
import { useHistory } from "react-router-dom";
import moment from "moment";

const ScheduleAppointment = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [dateData, setDateData] = useState(1111);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dob, setDob] = useState("");
  const [viewDob, setViewDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [insurance, setInsurance] = useState("");
  const [additional, setAdditional] = useState("");
  const [sex, setSex] = useState("male");
  const [buttonloading, setButtonloading] = useState(false);
  const [insuranceImage, setInsuranceImage] = useState("");

  var details = {
    firstname: firstname,
    lastname: lastname,
    departmentid: 1,
    dob: dob,
    email: email,
    guarantoremail: email,
    ssn: 178988977,
    homephone: phone
  };

  const dobMax = moment().subtract(2, "days").format("YYYY-MM-DD");

  const createDob = (event) => {
    setViewDob(event.target.value);
    let filter = moment(event.target.value).format("MM/DD/YYYY");
    setDob(String(filter));
  };
  const emailValidation = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email || regex.test(email) === false) {
      alert("please enter valid email id");
      return false;
    } else {
      return true;
    }
  };

  const validation = () => {
    console.log("in validatinnnn");
    if (firstname.length == 0) {
      alert("please enter first name.");
    } else if (lastname.length == 0) {
      alert("please enter last name  ");
    } else if (dob.length == 0) {
      alert(" please select date of birth ");
    } else if (email.length == 0) {
      alert("please enter valid email id");
    } else if (email.length > 0) {
      return emailValidation();
    } else if (additional.length == 0) {
      alert(" please enter requrired field  ");
    } else if (insurance.length == 0) {
      alert(" please enter requrired field  ");
    } else {
      console.log("check validatin");
      return true;
    }
  };

  const Preview = () => {
    setTimeout(() => {
      history.push("/");
    }, 500);
  };

  useEffect(() => {
    console.log(patientContext.patientDetails, "hhh");
    if (patientContext.patientDetails.firstname) {
      setFirstname(patientContext.patientDetails.firstname);
    }
    if (patientContext.patientDetails.dob) {
      createDob(patientContext.patientDetails.dob);
    }
    if (patientContext.patientDetails.lastname) {
      setLastname(patientContext.patientDetails.lastname);
    }
    if (patientContext.patientDetails.email) {
      setEmail(patientContext.patientDetails.email);
    }

    if (patientContext.patientDetails.phone) {
      setPhone(patientContext.patientDetails.phone);
    }
    if (patientContext.patientDetails.insurance) {
      setInsurance(patientContext.patientDetails.insurance);
    }
    if (patientContext.patientDetails.additional) {
      setAdditional(patientContext.patientDetails.additional);
    }
    if (patientContext.patientDetails.sex) {
      setSex(patientContext.patientDetails.sex);
    }
  }, []);

  const ScheduleApi = () => {
    if (validation()) {
      setButtonloading(true);
      var formBody = [];
      console.log("details", details);
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }

      let formBodydata = formBody.join("&");
      let request = {
        url: `https://appointmentapi.apatternclinic.com/v1/24451/patients`,
        data: formBodydata,
      };
      let requestbestmatch = {
        url: `https://appointmentapi.apatternclinic.com/v1/24451/patients/enhancedbestmatch`,
        data: formBodydata,
      };
      api
      .getAuth(requestbestmatch)
      .then((response1) => {
        api
        .postAuth(request)
        .then((response) => {
          patientContext.update({
            ...patientContext.patientDetails,
            dob: dob,
            sex: sex,
            email: email,
            phone: phone,
            firstname: firstname,
            lastname: lastname,
            insurance: insurance,
            additional: additional,
            patientid: response.data[0].patientid,
          });
          setTimeout(() => {
            history.push("/reviewnew");
            setButtonloading(false);
          }, 1000);
        })
        .catch((error) => {});
        
      })
      .catch((error) => {});
  
     
    }
  };

  function insuranceCaptured(file) {
    if (file[0]) {
      if (file[0].size > 5 * 1000000) {
        // fileSize > 5MB then show popup message
        alert(
          `Please upload image of size less than 5MB.\nSelected File Size: ${
            file[0].size / 1000000
          }MB only`
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
        setInsuranceImage(reader.result);
        localStorage.setItem("insuranceAttachment", reader.result);
      };
      reader.readAsDataURL(file[0]);
    }
  }

  return (
    <>
      <TopHeader />
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-6 col-12 mx-auto">
              <div className="card mb-1">
                <div className="card-header bg-primary text-white text-large">
                  Schedule Appointment
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card mb-5 ">
                    <div className="card-header text-medium bg-danger">
                      <strong>Patient Information</strong>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              First Name <span className="text-danger">*</span>
                            </label>
                            {/* <select className="form-select">
                        <option selected="selected">Choose...</option>
                        <option>...</option>
                        </select>		 */}
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={firstname}
                              onChange={(e) => {
                                setFirstname(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              First Name - used
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Last Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={lastname}
                              onChange={(e) => {
                                setLastname(e.target.value);
                              }}
                              name="name"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <label className="form-label">
                            Date of birth <span className="text-danger">*</span>
                          </label>
                          <div className="input-group mb-3">
                            <input
                              type="date"
                              name="name"
                              value={viewDob}
                              max={dobMax}
                              className="form-control"
                              onChange={createDob}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Legal sex <span className="text-danger">*</span>
                            </label>

                            <select
                              className="form-select"
                              onChange={(e) => setSex(e.target.value)}
                            >
                              <option>Male</option>
                              <option>Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Primary phone{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              name="name"
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Phone type 
                            </label>
                            <select className="form-select">
                              <option selected="selected">Choose...</option>
                              <option>Home</option>
                              <option>Office</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Email <span className="text-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="email"
                              name="name"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row g-2 mb-3">
                        <div className="col-xl-6 co-6">
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
                                        {patientContext.patientDetails.value}
                                        <br /> {patientContext.patientDetails.timeData}
                                        {patientContext.patientDetails.timeData.split(
                                          ":"
                                        )[0] > 12
                                          ? "pm"
                                          : "am"}{" "}
                                        (EDT)
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 co-6">
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

                      <div className="row">
                        <div className="col-12">
                          {/* <div className="mb-3">
												<label className="form-label">Insurance <span className="text-danger">*</span></label>
												<input className="form-control" value={insurance} onChange={(e) => { setInsurance(e.target.value) }} />
												<input className="form-control mt-2" type="file" accept="image/*" capture onChange={(e) => insuranceCaptured(e.target.files)} />
												<img src={insuranceImage} alt="" style={{ maxWidth: '100%' }} />
											</div> */}
                          <div className="mb-3">
                            <label className="form-label">
                              Additional Notes{" "}
                             
                            </label>
                            <input
                              value={additional}
                              className="form-control"
                              onChange={(e) => {
                                setAdditional(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-12">
                          <button
                            type="button"
                            onClick={() => {
                              Preview();
                            }}
                            className="btn btn-primary mb-1 me-3"
                          >
                            Previous
                          </button>
                          {buttonloading == false && (
                            <button
                              type="button"
                              onClick={() => {
                                ScheduleApi();
                              }}
                              className="btn btn-primary mb-1 me-3"
                            >
                              Next
                            </button>
                          )}
                          {buttonloading == true && (
                            <button
                              type="button"
                              disabled={true}
                              className="btn btn-primary mb-1 me-3"
                            >
                              Loading...
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <div className="card mb-5 ">
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
                                <strong>{patientContext.patientDetails.reasonLabel}</strong>
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
      </main>
    </>
  );
};

export default ScheduleAppointment;
