import React, { useState, useContext, useEffect } from "react";
import logo from "../../assets/Appointment/logo.svg";
import leftQuote from "../../assets/Appointment/left-quote.svg";
import dateLogo from "../../assets/schedule/datelogo.png";
import location from "../../assets/schedule/location.png";
import rightQuote from "../../assets/Appointment/right-quote.svg";
import "./shedule_appointmentnew.css";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import TopHeader from "../common/topHeader";
import { useHistory } from "react-router-dom";
import moment from "moment";
const ScheduleAppointmentNew = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dob, setDob] = useState("");
  const [viewDob, setViewDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phonetype, setPhonetype] = useState("HOMEPHONE");
  const [insurance, setInsurance] = useState("");
  const [additional, setAdditional] = useState("");
  const [sex, setSex] = useState("M");
  const [buttonloading, setButtonloading] = useState(false);

  var details = {
    firstname: firstname,
    lastname: lastname,
    departmentid: 1,
    dob: dob,
    email: email,
    mobilephone: phone,
    sex: sex,
    contactpreference: phonetype,
  };
  if (phonetype === "WORKPHONE") {
    details.workphone = phone;
  } else {
    details.homephone = phone;
  }

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
      return true;
    }
  };

  const validation = () => {
    console.log(phone.length, "phone ");
    if (firstname.length == 0) {
      alert("please enter first name.");
    } else if (lastname.length == 0) {
      alert("please enter last name  ");
    } else if (dob.length == 0) {
      alert(" please select date of birth ");
    } else if (email.length == 0) {
      alert("please enter valid email id");
    } else if (emailValidation()) {
      alert("please enter valid email id");
    } else if (phonenumber()) {
      alert(" please enter valid mobile  number  ");
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

  function phonenumber() {
    var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!re.test(phone)) {
      return true;
    }
  }

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
        url: `https://appointmentapi.apatternclinic.com/v1/24451/patients/enhancedbestmatch?firstname=${firstname}&lastname=${lastname}&departmentid=1&dob=${dob}&sex=${sex}&returnbestmatches=true`,
      };
      api
        .getAuth(requestbestmatch)
        .then((response1) => {
          if (response1?.data?.length > 0) {
            for (let i = 0; i < response1?.data?.length; i++) {
              console.log(dob, "dob");
              if (
                response1.data[i].firstname.toLowerCase() ===
                  firstname.toLowerCase() &&
                response1.data[i].lastname.toLowerCase() ===
                  lastname.toLowerCase() &&
                response1.data[i].dob === dob &&
                response1.data[i].sex === sex
              ) {
                let putrequest = {
                  url: `https://appointmentapi.apatternclinic.com/v1/24451/patients/${response1.data[i].patientid}`,
                  data: formBodydata,
                };
                api
                  .putAuth(putrequest)
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
                break;
              } else {
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
                    return;
                  })
                  .catch((error) => {});
                break;
              }
            }
          } else {
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
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <>
      <section className="appointmentrow mx-0">
        {/* <div className="left-sidebar">
                <img src={logo} alt="The Patient App" className="logo" />
                <div className="quote">
                    <img src={leftQuote} className="quote-icon left" />
                    <img src={rightQuote} className="quote-icon right" />
                    <h2>Healthcare You Can Afford</h2>
                    <p >Here at A Pattern Medical Clinic, our top priority is patient care. In order to make sure that we can see you, we choose rates that are well below the Emergency Room prices.</p>
                </div>
            </div> */}
        {/* <div> */}
        <div className="right-content">
          <div className="rigthDiv">
            <div>
              <p>
                {" "}
                <span className="patientText"> Patient </span>{" "}
                <span className="informationText">Information </span>{" "}
              </p>
            </div>
            <div className="nameRow">
              <div className="width45">
                <p className="labelName">
                  First Name <span style={{ color: "red" }}>*</span>
                </p>
                <input
                  className="inputBox"
                  type="text"
                  name="name"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                />
              </div>
              <div className="width45">
                <p className="labelName">
                  Last Name <span style={{ color: "red" }}>*</span>
                </p>
                <input
                  className="inputBox"
                  type="text"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  name="name"
                />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <p className="labelName">
                {" "}
                Date of Birth <span style={{ color: "red" }}>*</span>
              </p>
              <input
                className="inputBox"
                type="date"
                name="name"
                value={viewDob}
                max={dobMax}
                onChange={createDob}
              />
            </div>
            <div style={{ marginTop: "12px" }}>
              <p className="labelName">
                {" "}
                Legal Sex <span style={{ color: "red" }}>*</span>
              </p>
              <select
                className="inputBox"
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className="nameRow" style={{ marginTop: "12px" }}>
              <div className="width45">
                <p className="labelName">
                  Primary Phone <span style={{ color: "red" }}>*</span>
                </p>
                <input
                  className="inputBox"
                  type="number"
                  name="name"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
              <div className="width45">
                <p className="labelName">Phone Type</p>
                <select
                  className="inputBox"
                  onChange={(e) => setPhonetype(e.target.value)}
                >
                  <option selected="selected">Choose...</option>
                  <option value="HOMEPHONE">Home</option>
                  <option value="WORKPHONE">Office</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <p className="labelName">
                Email <span style={{ color: "red" }}>*</span>
              </p>
              <input
                className="inputBox"
                type="email"
                name="name"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="nameRow">
              <div className="dateTimeDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={dateLogo} />
                </div>
                <div className="textLocationDiv">
                  <p className="labelName">Day and Time</p>
                  <p>
                    {" "}
                    {patientContext?.patientDetails?.value}
                    <br /> {patientContext?.patientDetails?.timeData}
                    {patientContext?.patientDetails?.timeData?.split(":")[0] >
                    12
                      ? "pm"
                      : "am"}{" "}
                    (EDT)
                  </p>
                </div>
              </div>
              <div className="dateTimeDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={location} />
                </div>
                <div className="textLocationDiv">
                  <p className="labelName">Location</p>
                  <p>{patientContext?.patientDetails?.location}</p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <p className="labelName">Additional Notes</p>
              <input
                className="inputBox"
                value={additional}
                onChange={(e) => {
                  setAdditional(e.target.value);
                }}
              />
            </div>

            <div style={{ marginTop: "24px" }}>
              <button
                className="buttonDiv"
                onClick={() => {
                  Preview();
                }}
              >
                Previous
              </button>

              {buttonloading == false && (
                <button
                  className="buttonDiv nextButton"
                  onClick={() => {
                    ScheduleApi();
                  }}
                >
                  Next
                </button>
              )}
              {buttonloading == true && (
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
    </>
  );
};

export default ScheduleAppointmentNew;
