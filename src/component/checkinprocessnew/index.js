import React, { useEffect, useState, useContext, useRef } from "react";
import "./checkingprocess.css";
import logo from "../../assets/Appointment/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faThin, faPhone, faLocation, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import api from "../../api";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import Button from "react-bootstrap/Button";
import PatientContext from "../../context/patientDetails/patientContext";
import { useHistory, useLocation } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import CovidForm from "../common/CovidForm";
import Navbarcomponent from "../common/Navbar";
import IntakeForm from "../common/IntakeForm";
const BASE_URL = process.env.REACT_APP_BASE_URL
    ? process.env.REACT_APP_BASE_URL
    : "http://localhost:3001";

const CheckInNew = () => {
	const [deviceType, setDeviceType] = useState("");
	const { id } = useParams();
	const history = useHistory();
	const location = useLocation();
	const [show, setShow] = useState(false);
	const [policyNumber, setPolicyNumber] = useState(628);
	const [insuranceError, setInsuranceError] = useState("");
	const [insurance, setInsurance] = useState({ departmentid: 1 });
	const [progressBar, setProgressBar] = useState(0);
	const [insuranceImg, setInsuranceImg] = useState("");
	const [multiFormStep, setMultiFormStep] = useState(null);
	const [insuranceBtnLoading, setInsuranceBtnLoading] = useState(false);
	const [copayamount, setCopayAmount] = useState(0);
	const [showResponsibleToPay, setShowResponsibleToPay] = useState(false);
	const [appointmentData, setAppointmentData] = useState({});
	const [cardDetails, setCardDetails] = useState({});
	const [showCardDetails, setShowCardDetails] = useState(false);
	const BASE_URL = process.env.REACT_APP_BASE_URL
		? process.env.REACT_APP_BASE_URL
		: "http://localhost:3001";
	const patientContext = useContext(PatientContext);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const minExpireDate = moment().add(1, "days").format("YYYY-MM-DD");
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

	const {
		meta,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
		getCardImageProps,
	} = usePaymentInputs();

	const { erroredInputs, touchedInputs } = meta;
	const [accountNumber, setAccountNumber] = useState("");
	const [billingaddress, setBillingaddress] = useState("");
	const [billingzip, setBillingzip] = useState("");
	const [cardsecuritycode, setCardsecuritycode] = useState(null);
	const [expirationmonthmm, setExpirationmonthmm] = useState(null);
	const [expirationyearyyyy, setExpirationyearyyyy] = useState(null);
	const [nameoncard, setNameoncard] = useState("");
	const [otheramount, setOtheramount] = useState("");
	const [balance, setBalance] = useState("");

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		if (location.state && location.state.copay) {
			setMultiFormStep(2);
			setProgressBar(33);
			if (
				location.state.copay[0].copayamount &&
				location.state.copay[0].copayamount > 0
			) {
				setCopayAmount(location.state.copay[0].copayamount);
			} else {
				setCopayAmount(0);
			}
		} else {
			setMultiFormStep(1);
		}
	}, [location]);

	const loadData = () => {
		let request = {
			url: `${BASE_URL}/v1/24451/appointments/${id}`,
		};
		api.getAuth(request).then((res) => {
			if (res.data && res.data.length) {
				setAppointmentData(res.data[0])
			}
		});
	};

	const checkInsurance = () => {
		let request = {
			url: `${BASE_URL}/v1/24451/patients/${appointmentData.patientid}/insurances`,
		};
		api.checkInsurances(request).then((res) => {
			if (res.data.insurances.length > 0) {
				let copays = res.data.insurances[0].copays;
				history.pushState({ copay: copays }, '')
			}
		})
	}
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
			url: `${BASE_URL}/v1/24451/patients/${appointmentData.patientid}/insurances`,
			data: new URLSearchParams(formData),
		};
		api
			.postAuth(request)
			.then((res) => {
				if (res.status === 200) {
					let patientId = appointmentData.patientid;
					console.log(insurance.insuranceidnumber);
					let request = {
						url: `${BASE_URL}/v1/24451/patients/${appointmentData.patientid}/insurances`,
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
								url: `${BASE_URL}/v1/24451/patients/${patientId}/insurances/${res.data.insurances[0].insuranceid}/image`,
								data: new URLSearchParams(formData),
							};
							api
								.postAuth(request)
								.then((res) => {
									console.log(res);
									setInsuranceImg("");
									setProgressBar(33);
									setMultiFormStep(2);
									setInsuranceBtnLoading(false);
									handleClose();
									if (
										getInsuranceRes.totalcount &&
										getInsuranceRes.totalcount > 0
									) {
										if (
											getInsuranceRes.insurances[0].copays[0].copayamount &&
											getInsuranceRes.insurances[0].copays[0].copayamount > 0
										) {
											setCopayAmount(
												getInsuranceRes.insurances[0].copays[0].copayamount
											);
											console.log(
												getInsuranceRes.insurances[0].copays[0].copayamount
											);
										} else {
											setCopayAmount(0);
										}
									}
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
	const postCardDetails = () => {
		const formData = new FormData();
		const data = {
			...cardDetails,
			appointmentid: appointmentData.appointmentid,
			copayamount: copayamount || 0,
			departmentid: 1,
			ecommercemode: true,
			todayservice: true,
		};
		buildFormData(formData, data);
		let request = {
			url: `${BASE_URL}/v1/24451/patients/${appointmentData.patientid}/collectpayment`,
			data: new URLSearchParams(formData),
		};
		api
			.postAuth(request)
			.then((res) => {
				swal("Payment collect successfully", "success");
			})
			.catch(() => {
				swal("Payment collect failed", "error");
			});
	};

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

	const onInputChange = (e) => {
		setInsurance({ ...insurance, [e.name]: e.value });
	};
	const onCardInput = (e) => {
		const { name, value } = e.target;
		let data = {};
		if (name === "expiryDate") {
			const [month, year] = value.split("/");
			setExpirationmonthmm(parseInt(month.trim()));
			const d = new Date();
			const fy = d.getFullYear().toString();
			let expireyy = parseInt(fy.slice(0, 2) + year.trim());
			setExpirationyearyyyy(expireyy);
		} else {
			data = { [name]: value };
		}
		setCardDetails({ ...cardDetails, ...data });
	};
	const copayPayment = () => {
		const d = new Date();

		var details = {
			cardnumberlast4: accountNumber.slice(-4),
			appointmentid: appointmentData.appointmentid,
			departmentid: 1,
			otheramount: null,
			claimpayment: null,
			checknumber: null,
			// billingaddress: billingaddress.slice(0, 19),
			// billingzip: billingzip,
			copayamount: copayamount,
			// expirationmonthmm:expirationmonthmm,
			// expirationyearyyyy: expirationyearyyyy,
			// cardsecuritycode:cardsecuritycode,
			paymentmethod: "Amex",
			postdate: moment(d).format("M/D/YYYY"),
			// nameoncard: nameoncard,
			// otheramount:otheramount,
			todayservice: false,
		};
		const formData = new FormData();
		buildFormData(formData, details);
		console.log(details, "details");
		let request = {
			url: `${BASE_URL}/v1/24451/patients/${appointmentData.patientid}/recordpayment`,
			data: new URLSearchParams(formData),
		};
		api
			.postpayment(request)
			.then((res) => {
				if ((res.data = 200)) {
					swal("Payment paid successfully", "success");
					setMultiFormStep(3);
					setProgressBar(66);
				}
				console.log(res);
			})
			.catch((err) => {
				console.log(err.response);
				swal("There was a problem posting this payment", "Error");
			});
	};
	const [ispaymentForm, setIspaymentForm] = useState(true);
	const checkPaymentForm = () => {
		if (
			nameoncard !== "" &&
			billingaddress !== "" &&
			billingzip !== "" &&
			cardsecuritycode !== null &&
			expirationmonthmm !== null &&
			expirationyearyyyy !== null
		) {
			setIspaymentForm(false);
		} else {
			setIspaymentForm(true);
		}
	};
	const checkBalance = () => {
		let request = {
			url: `${BASE_URL}/v1/24451/patients/${appointmentData.patientid}?showbalancedetails=true&departmentid=1`,
		};
		api
			.getBalance(request)
			.then((res) => {
				let resp = res.data[0];
				if (resp && resp.balances.length > 0) {
					console.log(resp.balances[0].balance);
					setBalance(resp.balances[0].balance);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	let checkBalanceMounted = useRef(null);
	useEffect(() => {
		// if (!checkBalanceMounted.current) {
		if (appointmentData?.patientid) {
			checkBalance();
			checkInsurance();
			checkBalanceMounted.current = true;
		}
	}, [appointmentData]);
	const goPrevStep = (form, progress) => {
		setMultiFormStep(form);
		setProgressBar(progress);
	}
	useEffect(() => {
		checkPaymentForm();
	});

	return (<>
		<section className="appointmentrow mx-0">
			<div className="left-sidebar">
				<img src={logo} alt="The Patient App" className="logo" />
				<div className="bullet-points">
					<ul style={{ padding: "0px" }} >
						<li className="bulletli"><div className="bulltetlist"> <FontAwesomeIcon icon={faPhone} /> <span className="bulletlisttext">(423) 455-2711 </span></div></li>
						<li className="bulletli"><div className="bulltetlist"> <FontAwesomeIcon icon={faEnvelope} /><span className="bulletlisttext"> annex@gmail.com </span></div></li>
						<li className="bulletli"><div className="bulltetlist"> <FontAwesomeIcon icon={faLocation} /><span className="bulletlisttext"> Ooltewah Clinic </span></div></li>
					</ul>
				</div>
			</div>
			<div className="right-data">
				<div className="card no-shadow no-padding">
					<div className="row steps">
						<div className="col-12">
							<ul className="border-bottom">
								<li className="active"  >
									<a onClick={() => multiFormStep > 1 ? goPrevStep(1, 0) : null} >
										<div>1</div>
										<span>Insurance</span>
									</a>
								</li>
								<li className={multiFormStep > 1 ? "active" : ""}>
									<a  >
										<div>2</div>
										<span>Payment</span>
									</a>
								</li>
								<li className={multiFormStep > 2 || patientContext?.patientDetails?.covidData !== undefined ? "active" : ""}>
									<a onClick={() => multiFormStep > 2 || patientContext?.patientDetails?.covidData !== undefined ? goPrevStep(3, 66) : null}>
										<div>3</div>
										<span>Covid Form</span>
									</a>
								</li>
								<li className={multiFormStep > 3 || patientContext?.patientDetails?.intakeData !== undefined ? "active" : ""}>
									<a onClick={() => multiFormStep > 3 || patientContext?.patientDetails?.intakeData !== undefined ? goPrevStep(4, 99) : null}>
										<div>4</div>
										<span>Intake Form</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div >
						<div className="form insurance-form">
							{(multiFormStep == 1 && show == false) ? (<div >
								<div className="question">
									<p>Would you like to add your insurance?</p>
								</div>
								<div className="main-buttons">
									<button className="outline width-small" onClick={handleShow}>Yes</button>
									<button className="outline width-small" style={{ marginLeft: "20px" }} onClick={() => setShowResponsibleToPay(true)}>No</button>
								</div>
							</div>
							) : multiFormStep == 2 &&
								(copayamount > 0 || balance !== "" || balance !== "0") ? (
								<>
									<div className="py-4 card-body ">
										<div
											className={` ${!showCardDetails ? "d-flex" : "d-none"}`}
										>
											{copayamount > 0 ? (
												<div className="me-5">
													<div className="mb-3">
														<span className="fw-bold">Copay:</span> $
														{copayamount}
													</div>
													<button
														className="btn btn-primary"
														onClick={() => setShowCardDetails(true)}
													>
														Pay Now
													</button>
												</div>
											) : (
												""
											)}

											{balance && (balance !== "" || balance !== "0") ? (
												<div>
													<div className="mb-3">
														<span className="fw-bold">Balance:</span> ${balance}
													</div>
													<button
														className="btn btn-primary"
														onClick={() => setShowCardDetails(true)}
													>
														Pay Now
													</button>
												</div>
											) : (
												""
											)}
										</div>
										<div
											className={`py-4 card-body ${showCardDetails ? "d-block" : "d-none"
												}`}
										>
											<div class="row">
												<div class="col-sm-12">
													<div class="mb-3">
														<label for="name" className="label">
															Name on card
														</label>
														<input
															class="form-control"
															id="name"
															type="text"
															name="nameoncard"
															placeholder="Enter your name"
															onInput={(e) => setNameoncard(e.target.value)}
														/>
													</div>
												</div>

												<div class="col-sm-12">
													<div class="mb-3">
														<label for="ccnumber" className="label">
															Credit Card Number
														</label>

														<div class="input-group border rounded d-flex mb-3 align-items-center">
															<input
																class="form-control border-0 mb-0"
																{...getCardNumberProps()}
																isInvalid={
																	!!(
																		touchedInputs.cardNumber &&
																		!!erroredInputs.cardNumber
																	)
																}
																name="accountnumber"
																placeholder="0000 0000 0000 0000"
																onInput={(e) =>
																	setAccountNumber(e.target.value)
																}
															/>

															<span class="input-group-text py-3">
																<svg {...getCardImageProps({ images })} />
															</span>
														</div>
														<div class="text-danger">
															{touchedInputs.cardNumber
																? erroredInputs.cardNumber
																: ""}
														</div>
													</div>
												</div>
												<div class="mb-3 col-4">
													<label for="ccmonth" className="label">
														Expiry Date
													</label>
													<input
														class="form-control"
														{...getExpiryDateProps()}
														isInvalid={
															touchedInputs.expiryDate &&
															erroredInputs.expiryDate
														}
														onInput={onCardInput}
													></input>
													<div class="text-danger">
														{touchedInputs.expiryDate
															? erroredInputs.expiryDate
															: ""}
													</div>
												</div>
												<div class="col-4">
													<div class="mb-3">
														<label for="cvv" className="label">
															CVV/CVC
														</label>
														<input
															class="form-control"
															{...getCVCProps()}
															isInvalid={touchedInputs.cvc && erroredInputs.cvc}
															name="cardsecuritycode"
															onInput={(e) =>
																setCardsecuritycode(e.target.value)
															}
														/>
														<div class="text-danger">
															{touchedInputs.cvc ? erroredInputs.cvc : ""}
														</div>
													</div>
												</div>
												<div class="col-4">
													<div class="mb-3">
														<label for="cvv" className="label">
															Billing zip
														</label>
														<input
															class="form-control"
															name="billingzip"
															onInput={(e) => setBillingzip(e.target.value)}
														/>
													</div>
												</div>
												<div class="col-12">
													<div class="mb-3">
														<label for="cvv" className="label">
															Billing Address
														</label>
														<textarea
															class="form-control"
															name="billingaddress"
															onInput={(e) => setBillingaddress(e.target.value)}
														></textarea>
													</div>
												</div>
												<div className="col-12">
													<button
														className="btn btn-primary me-2"
														onClick={() => setShowCardDetails(false)}
													>
														Back
													</button>
													<button
														className="btn btn-primary"
														disabled={ispaymentForm}
														onClick={() => copayPayment()}
													>
														Pay outstandings
													</button>
												</div>
											</div>
										</div>
									</div>
								</>
							) : multiFormStep == 2 && copayamount == 0 ? (
								<>
									<div className="my-3 card-body">
										<div className="mb-3">
											{" "}
											You insurance has been added, you don't have to pay
											anything
										</div>
										<button
											className="btn btn-primary"
											onClick={() => {
												setProgressBar(66);
												setMultiFormStep(3);
											}}
										>
											Continue
										</button>
									</div>
									<div></div>
								</>
							) : multiFormStep == 3 ? (
								<>
									<div className="py-4 card-body">
										<CovidForm
											patientid={appointmentData.patientid}
											complete={() => {
												setMultiFormStep(4);
												setProgressBar(99);
											}}
										/>
									</div>
								</>
							) : multiFormStep == 4 ? (
								<>
									<div className="my-3 card-body">
										<IntakeForm patientid={appointmentData.patientid} complete={() => {
											setMultiFormStep(5);
											setProgressBar(100);
										}} />
									</div>
								</>
							) : ''
							}
							{show && <div >
								{insuranceError && (
									<div className="col-12">
										<div className="alert alert-danger">{insuranceError}</div>
									</div>
								)}
								<div className="question" >
									<div className="options">
										<div className="field">
											<label>Insurance ID Number</label>
											<input
												type="text"
												name="insuranceidnumber"
												value={insurance.insuranceidnumber}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Insurance Package ID</label>
											<input type="number"
												name="insurancepackageid"
												value={insurance.insurancepackageid}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Issue Date</label>
											<input
												type="date"
												name="issuedate"
												value={insurance.issuedate}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Expiration Date</label>
											<input
												type="date"
												min={minExpireDate}
												name="expirationdate"
												value={insurance.expirationdate}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Policyholder First Name</label>
											<input
												type="text"
												name="insurancepolicyholderfirstname"
												value={insurance.insurancepolicyholderfirstname}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Policyholder last Name</label>
											<input
												type="text"
												name="insurancepolicyholderlastname"
												value={insurance.insurancepolicyholderlastname}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Policy Holder Sex</label>
											<div className="custom-dropdown">
												<select className="select"
													name="insurancepolicyholdersex"
													value={insurance.insurancepolicyholdersex}
													onChange={(e) => onInputChange(e.target)}
													required
												>
													<option value="0">-Select-</option>
													<option value="1">Male</option>
													<option value="2">Female</option>
												</select>
											</div>
										</div>
										<div className="field">
											<label>Insured Entity type Id</label>
											<div className="custom-dropdown">
												<select className="select"
													name="insuredentitytypeid"
													value={insurance.insuredentitytypeid}
													onChange={(e) => onInputChange(e.target)}
													required
												>
													<option value="0">-Select-</option>
													<option value="1">1</option>
													<option value="2">2</option>
												</select>
											</div>
										</div>
										<div className="field">
											<label>Relationship to Insured id</label>
											<input
												type="number"
												name="relationshiptoinsuredid"
												value={insurance.relationshiptoinsuredid}
												onInput={(e) => onInputChange(e.target)}
												required

											/>
										</div>
										<div className="field">
											<label>Sequence Number</label>
											<input
												type="number"
												name="sequencenumber"
												value={insurance.sequencenumber}
												onInput={(e) => onInputChange(e.target)}
												required
											/>
										</div>
										<div className="field">
											<label>Insurance Image</label>
											<input style={{ lineHeight: "20px", padding: "8px" }}
												type="file"
												name="sequencenumber"
												onChange={selectInsuranceImage}
												required
											/>
										</div>
										{insuranceImg && <div className="field" >
											<label>Preview</label>
											<div>
												<img src={insuranceImg} className="w-100" />
											</div>
										</div>}

									</div>
								</div>
								<div className="main-buttons">
									<button className="outline width-small" onClick={() => setShowResponsibleToPay(true)}>Close</button>
									<button style={{ marginLeft: "20px" }} className="outline width-small" disabled={insuranceBtnLoading} onClick={() => patientInsurance()}> {insuranceBtnLoading ? "Saving" : "Save"}</button>
								</div>
							</div>}

						</div>
					</div>
				</div>
				<Modal
					size="md"
					show={showResponsibleToPay}
					centered
					onHide={() => setShowResponsibleToPay(false)}
				>
					<Modal.Header closeButton>
						<Modal.Title>Note</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4 className="text-danger">
							*You will be responsible to pay some amount at clinic*
						</h4>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="buttonDiv"
							onClick={() => {
								setShow(false)
								setMultiFormStep(3);
								setProgressBar(66);
								setShowResponsibleToPay(false);
							}}
						>
							Yes I Confirm
						</button>
					</Modal.Footer>
				</Modal>
			</div>
		</section>
	</>)
}
export default CheckInNew;