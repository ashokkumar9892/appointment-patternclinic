import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/Appointment/logo.svg";
import leftQuote from "../../assets/Appointment/left-quote.svg";
import dateLogo from "../../assets/schedule/datelogo.png";
import location from "../../assets/schedule/location.png";
import rightQuote from "../../assets/Appointment/right-quote.svg";
import person from "../../assets/schedule/person.png";
import msg from "../../assets/schedule/msg.png";
import call from "../../assets/schedule/call.png";
import question from "../../assets/schedule/question.png";
import insurence from "../../assets/schedule/insurence.png";
import "./reviewnew.css";
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
  const [insuranceImg, setInsuranceImg] = useState("");
  const [show, setShow] = useState(false);
  const [insuranceError, setInsuranceError] = useState("");
  const [insuranceBtnLoading, setInsuranceBtnLoading] = useState(false);
  const [checkterm, setCheckterm] = useState(false);
  const [insurance, setInsurance] = useState({ departmentid: 1 });
  const [loading, setLoading] = useState(false);
  const [insuranceList, setInsuranceList] = useState([]);  
	const [policyNumber, setPolicyNumber] = useState(628);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const selectInsuranceImage = (event) => {
		let reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = function () {
			setInsuranceImg(reader.result);
			console.log(reader.result);
		};
		reader.onerror = function (error) {
			console.log("Error: ", error);
		};
	};
  const checkInsurance = () =>{
    const request={
      url: 'https://appointmentdemoapi.apatternclinic.com/v1/24451/misc/topinsurancepackages'
    }
    api.getAuth(request).then((res)=>{
      setInsuranceList(res.data.insurancepackages)

    })
    
  }

	const minExpireDate = moment().add(1, "days").format("YYYY-MM-DD");
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
    departmentid: 1,
    ignoreschedulablepermission: true,
  };

  const Preview = () => {
    setTimeout(() => {
      history.push("/schedule");
    }, 500);
  };
  const ShaduleAppointment = () => {
    setLoading(true);
    const formData = new FormData();
    buildFormData(formData, details);
    let request = {
      url: `https://appointmentdemoapi.apatternclinic.com/v1/24451/appointments/${patientContext.patientDetails.appointmentid}`,
      data: new URLSearchParams(formData),
    };
    api
      .putAuth(request)
      .then((data) => {
        console.log("data", data);
        setLoading(false);
        if (data.status === 200) {
          // history.push("/appointment/" + data.data[0].appointmentid);
          sendSms(data.data[0].appointmentid);
        } else {
          swal("Appointment not Booked!", "error");
        }
      })
      .catch((error) => {
        setLoading(false);

        swal("Appointment not Booked!", "error").then((value) => {
          history.push("/appointment/");
        });
      });
  };
  const sendSms = (appointmentid) => {
    try {
      let request = {
        url: `https://appointmentdemoapi.apatternclinic.com/sms`,
        params: {
          name:
            patientContext.patientDetails.firstname +
            " " +
            patientContext.patientDetails.lastname,
          to: patientContext.patientDetails.phone,
          time:
            patientContext.patientDetails.value +
            " " +
            patientContext.patientDetails.timeData,
          location: patientContext.patientDetails.location,
        },
      };
      api.get(request);
    } catch (error) {
    } finally {
      history.push("/appointment/" + appointmentid);
    }
  };
  const patientInsurance = () => {
		setInsuranceError("");

		const formData = new FormData();
		const data = {
			...insurance,
			expirationdate: moment(insurance.expirationdate).format("MM/DD/YYYY"),
			issuedate: moment(insurance.issuedate).format("MM/DD/YYYY"),
      relationshiptoinsuredid:1,
      sequencenumber: 1
		};
		setInsuranceBtnLoading(true);
		buildFormData(formData, data);
		let request = {
			url: `https://appointmentdemoapi.apatternclinic.com/v1/24451/patients/${patientContext.patientDetails.patientid}/insurances`,
			data: new URLSearchParams(formData),
		};
		api
			.postAuth(request)
			.then((res) => {
				if (res.status === 200) {
					let patientId = patientContext.patientDetails.patientid;
					console.log(insurance.insuranceidnumber);
					let request = {
						url: `https://appointmentdemoapi.apatternclinic.com/v1/24451/patients/${patientContext.patientDetails.patientid}/insurances`,
						data: new URLSearchParams(formData),
					};
					api.getAuth(request).then((res) => {
						if (res.status === 200) {
							console.log(res.data.insurances);
							setPolicyNumber(res.data.insurances[0].insuranceid);
							const insuranceImageasbase64 = {
								image: insuranceImg.split("base64,")[1],
							};
              
							let getInsuranceRes = res.data;
							//console.log("insuranceImageasbase64", insuranceImageasbase64);
							const formData = new FormData();
							buildFormData(formData, insuranceImageasbase64);
							let request = {
								url: `https://appointmentdemoapi.apatternclinic.com/v1/24451/patients/${patientId}/insurances/${res.data.insurances[0].insuranceid}/image`,
								data: new URLSearchParams(formData),
							};
							api
								.postAuth(request)
								.then((res) => {
									console.log(res);
									setInsuranceImg("");
									setInsuranceBtnLoading(false);
									handleClose();
								
									swal("Insurance has been added successfully", "success");
								})
								.catch((err) => {
									setInsuranceBtnLoading(false);
									console.log(err);
								});
						}
					});
				}
			})
			.catch((error) => {
				setInsuranceBtnLoading(false);
				setInsuranceError(error.response.data);
			})
			.finally(() => { });
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
      <section className="appointmentrow mx-0">
        <div className="right-content">
          <div className="rigthDiv">
            <div>
              <p>
                {" "}
                <span className="patientText"> Review </span>{" "}
                <span className="informationText">Information </span>{" "}
              </p>
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
            <div className="nameRow">
              <div className="dateTimeDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={dateLogo} />
                </div>
                <div className="textLocationDiv">
                  <p className="labelName">Day and Time</p>
                  <p>
                    {" "}
                    {patientContext.patientDetails.value} <br />
                    {patientContext.patientDetails.timeData}(EDT)
                  </p>
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
            <div className="nameRow">
              <div className="dateTimeDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={question} />
                </div>
                <div className="textLocationDiv">
                  <p className="labelName">Reason for Visit</p>
                  <p> {patientContext.patientDetails.reason}</p>
                </div>
              </div>

              <div className="dateTimeDiv">
                <div className="imageDiv">
                  <img height={20} width={20} src={insurence} />
                </div>
                <div className="textLocationDiv" style={{display:'flex',flexDirection:'column'}}>
                  <div><p className="labelName">Would You like to add your Insurance?</p></div>
                  
                  <div  style={{display:'flex'}}>
                  <div>
                    <button
                    style={{border:'1px solid #0052CC',width:'40px',color:'#0052CC'}}
                      onClick={() => {
                        handleShow();checkInsurance();
                      }}
                    >
                      Yes
                    </button>
                  </div>
                  <div>
                    <button
                    style={{marginLeft:'5px',width:'40px',border:'1px solid #0052CC',color:'#0052CC'}}
                      onClick={() => {
                        Preview();
                      }}
                    >
                      No
                    </button>
                
                  </div>
                </div>
                  </div>
                  
              </div>
            </div>
            <div>
              {/* <div className="row" style={{ marginTop: "12px" }}>
                <div className="col-md-12">
                  <p className="mb-0">
                    <strong>Additional Notes</strong>
                  </p>
                  <p>{patientContext.patientDetails.additional}</p>
                </div>
              </div> */}
              
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
                <span className="text-primary">Terms and Conditions </span>
                and <span className="text-primary">Privacy policy.</span>
              </div>
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

              {loading == false && (
                <button
                  className="nextButton"
                  type="button"
                  disabled={!checkterm}
                  onClick={() => {
                    ShaduleAppointment();
                  }}
                >
                  Schedule Appointment
                </button>
              )}
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
        <Modal size="lg" show={show} onHide={handleClose}>
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
                  <label className="form-label">Insurance Name</label>
                  <select
                    type="number"
                    className="form-select"
                    name="insurancepackageid"
                    value={insurance.insurancepackageid}
                    onInput={(e) => onInputChange(e.target)}
                    required
                  >
                    <option value=""></option>
                    {insuranceList.map((curr)=>{
                      return(
                      <option value={curr.insurancepackageid}>{curr.name}</option>)
                    })}
                  </select>
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
                    min={minExpireDate}
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
                  <label className="form-label">Policyholder First Name</label>
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
                    className="form-select"
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
                    className="form-select"
                    name="insuredentitytypeid"
                    value={insurance.insuredentitytypeid}
                    onChange={(e) => onInputChange(e.target)}
                    required
                  >
                    <option value=""></option>
                    <option value="1">Primary</option>
                    <option value="2">Secondary</option>
                  </select>
                </div>
              </div>
              {/* <div className="col-6">
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
              </div> */}
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Insurance Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="sequencenumber"
                    onChange={selectInsuranceImage}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Preview</label>
                  <div>
                    <img src={insuranceImg} className="w-100" />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="buttonDiv" variant="secondary" onClick={handleClose}>
              Close
            </button>
            <button
              className="nextButton"
              type="submit"
              disabled={insuranceBtnLoading}
            >
              {insuranceBtnLoading ? "Saving" : "Save"}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      </section>
    </>
  );
};
export default ReviewAppoinmentNew;
