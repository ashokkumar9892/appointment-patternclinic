import React, {useContext, useEffect, useState} from "react";
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useHistory} from "react-router-dom";
import mergeImages from 'merge-base64';
import moment from "moment";
import api from "../../api";
import swal from "sweetalert";
import "./insurance.css";
import PatientContext from "../../context/patientDetails/patientContext";
import TopHeader from "../common/topHeader";
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Select from "react-select";
import Loader from "react-js-loader";

const Insurance = () =>{
	const history = useHistory();
	const [insurance, setInsurance] = useState({ departmentid: 1 });
	const patientContext = useContext(PatientContext);
	const [insuranceImg, setInsuranceImg] = useState("");
	const [loading, setLoading] = useState(false);
	const [showLoadingText, setLoadingText] = useState(false);
	const [insuranceList, setInsuranceList] = useState([]);
	const [relationshipList, setRelationshipList] = useState([
		{value: 1, text: "Self"},
		{value: 2, text: "Spouse"},
		{value: 3, text: "Child"},
		{value: 4, text: "Other"},
		{value: 5, text: "Grandparent"},
		{value: 6, text: "Grandchild"},
		{value: 7, text: "Nephew or Niece"},
		{value: 9, text: "Foster Child"},
		{value: 10, text: "Ward"},
		{value: 11, text: "Stepson or Stepdaughter"},
		{value: 12, text: "Employee"},
		{value: 13, text: "Unknown"},
		{value: 14, text: "Handicapped Dependent"},
		{value: 15, text: "Sponsored Dependent"},
		{value: 16, text: "Dependent of a Minor Dependent"},
		{value: 17, text: "Significant Other"},
		{value: 18, text: "Mother"},
		{value: 19, text: "Father"},
		{value: 21, text: "Emancipated Minor"},
		{value: 22, text: "Organ Donor"},
		{value: 23, text: "Cadaver Donor"},
		{value: 24, text: "Injured Plaintiff"},
		{value: 25, text: "Child (Ins. not Financially Respons.)"},
		{value: 26, text: "Life Partner"},
		{value: 27, text: "Child (Mother's Insurance)"},
		{value: 28, text: "Child (Father's Insurance)"},
		{value: 29, text: "Child (of Mother's, Ins. not Financially Respons.)"},
		{value: 30, text: "Child (of Father's, Ins. not Financially Respons.)"},
		{value: 31, text: "Stepson or Stepdaughter (Stepmothers Insurance)"},
		{value: 32, text: "Stepson or Stepdaughter (Stepfathers Insurance)"}
	]);
	const [insuranceError, setInsuranceError] = useState("");
	const [showWarningModal, setWarningShow] = useState(false);
	const [showMobileInsurance, setMobileInsurancepage] = useState(false);
	const [docImage, setDocImage] = useState({});
	const onInputChange = (e, name) => {
		setInsurance({ ...insurance, [name || e.name]: e.value });
	};

	const BASE_URL = process.env.REACT_APP_BASE_URL
		? process.env.REACT_APP_BASE_URL
		: "http://localhost:3001";
	const [show, setShow] = useState(false);
	const checkInsurance = () =>{
		const request={
			url: `${BASE_URL}/v1/24451/misc/topinsurancepackages`
		}
		api.getAuth(request).then((res)=>{
			let insuranceOptions = res.data.insurancepackages.sort((a, b) => a.name.localeCompare(b.name));
			setInsuranceList(insuranceOptions);
		})

	}
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
	const [policyNumber, setPolicyNumber] = useState(628);
	const [insuranceData, setInsuranceData] = useState();
	const [showInsuranceSection, setInsuranceSection] = useState(false);
	const [showInsuranceForm, setInsuranceForm] = useState(false);
	const [insuranceBtnLoading, setInsuranceBtnLoading] = useState(false);
	const handleClose = () => setShow(false);
	const minExpireDate = moment().add(1, "days").format("YYYY-MM-DD");
	const maxExpireDate = moment().format("YYYY-MM-DD");
	const selectInsuranceImage = (event) => {
		let reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = function () {
			switch (event.target.name)
			{
				case 'insuranceFrontimage':
					setDocImage({...docImage, [event.target.name]: reader.result});
					break;
				case 'insuranceBackimage':
					setDocImage({...docImage, [event.target.name]: reader.result});
					break;
			}
		};
		reader.onerror = function (error) {
			console.log("Error: ", error);
		};
	};

	const searchList = insuranceList.map(
		(cur, index) => {
			return{
				value: cur.insurancepackageid,
				label: cur.name
			}
		}
	);
	function showUploadInsuranceForm(confirmation)
	{
		if(confirmation)
		{
			setInsuranceSection(true);
		}
		else {
			setInsuranceSection(false);
			history.push("/reviewnew");
		}
	}
	function showInsuranceFormToUser(confirmation)
	{
		if(confirmation)
		{
			console.log("Yes")
			checkInsurance();
			setInsuranceForm(true);
		}
		else {
			setInsuranceForm(false);
			history.push("/reviewnew");
		}
	}
	const mergeBase64Img = async () =>
	{
		setLoading(true);
		try
		{
			const base64ImageFront = docImage?.insuranceFrontimage;
			const base64ImageBack = docImage?.insuranceBackimage;
			await mergeImages([base64ImageFront.split("base64,")[1], base64ImageBack.split("base64,")[1]]).then(b64 =>
			{
				setInsuranceImg(b64);
				setLoading(false);
			});
		}
		catch (error)
		{
			setLoading(false);
			console.log(error);
		}
	}
	const options = [
		'one', 'two', 'three'
	];
	const patientInsurance = () => {
		setInsuranceError("");
		const formData = new FormData();
		const data = {
			...insurance,
			expirationdate: moment(insurance.expirationdate).format("MM/DD/YYYY"),
			issuedate: moment(insurance.issuedate).format("MM/DD/YYYY"),
			sequencenumber: 1
		};
		data.insurancepolicyholderdob = moment(patientContext.patientDetails.dob).format("MM/DD/YYYY");
		setInsuranceBtnLoading(true);
		buildFormData(formData, data);
		let request = {
			url: `${BASE_URL}/v1/24451/patients/${patientContext.patientDetails.patientid}/insurances`,
			data: new URLSearchParams(formData),
		};
		api
			.postAuth(request)
			.then((res) => {
				if (res.status === 200) {
					let patientId = patientContext.patientDetails.patientid;
					console.log(insurance.insuranceidnumber);
					let request = {
						url: `${BASE_URL}/v1/24451/patients/${patientContext.patientDetails.patientid}/insurances`,
						data: new URLSearchParams(formData),
					};
					api.getAuth(request).then((res) => {
						if (res.status === 200) {
							console.log(res.data.insurances);
							setPolicyNumber(res.data.insurances[0].insuranceid);
							setInsuranceData(res.data);
							console.log(insuranceImg);

							let getInsuranceRes = res.data;
							//console.log("insuranceImageasbase64", insuranceImageasbase64);
							callInsuranceSection(true);
						}
					});
				}
			})
			.catch((error) => {
				swal("Something went wrong", "error");
				setInsuranceBtnLoading(false);
				setInsuranceError(error.response.data);
			})
			.finally(() => { });
	};
	const callInsuranceSection = (show)=>{
		setMobileInsurancepage(show);
	}

	const setInsurancePictures =()=>
	{
		setLoadingText(true);
		let patientId = patientContext.patientDetails.patientid;
		const insuranceImageasbase64 = {
			image: insuranceImg.split("base64,")[1],
		};
		const formData = new FormData();
		buildFormData(formData, insuranceImageasbase64);
		let request = {
			url: `${BASE_URL}/v1/24451/patients/${patientId}/insurances/${insuranceData.insurances[0].insuranceid}/image`,
			data: new URLSearchParams(formData),
		};
		api
			.postAuth(request)
			.then((res) => {
				console.log(res);
				// setInsuranceImg("");
				setInsuranceBtnLoading(false);
				setLoadingText(true);
				handleClose();
				swal("Insurance has been added successfully", "success");
				showInsuranceFormToUser(false);
			})
			.catch((err) => {
				setLoadingText(true);
				swal("Something went wrong", "error");
				setInsuranceBtnLoading(false);
				console.log(err);
			});
	}

	useEffect(() =>
	{
		(docImage?.insuranceBackimage && docImage?.insuranceFrontimage) && mergeBase64Img();
	}, [docImage]);
	return (
		<>
			<TopHeader />
			<Modal show={showWarningModal} onHide={handleClose}
				   aria-labelledby="contained-modal-title-vcenter"
				   centered>
				<Modal.Dialog className="m-0 border-0 insurance-warning" show={showWarningModal} onHide={handleClose}>
					<Modal.Body>
						<h4>You will be responsible for paying a portion of the clinic fee.</h4>
					</Modal.Body>

					<Modal.Footer className="p-3">
						<Button variant="secondary" className="modal-btn-white" onClick={() => setWarningShow(false)}>Cancel</Button>
						<Button variant="primary" className="modal-btn-white" onClick={()=> showInsuranceFormToUser(false)}>Okay</Button>
					</Modal.Footer>
				</Modal.Dialog>
			</Modal>
			{(showMobileInsurance) ? ((!showInsuranceSection) ? (<div>
				<div className="main-buttons btn-align-center">
					<h1 className="confirmation-heading-sec text-start">If you are accessing this via phone, please upload your insurance pictures otherwise, bring your insurance card along with you to the clinic.</h1>
					<button className="outline width-small px-3" onClick={() => showUploadInsuranceForm(false)}>Proceed without image</button>
					<button style={{marginLeft: "20px"}} className="outline width-small" onClick={() => showUploadInsuranceForm(true)}>Upload image</button>
				</div>
			    </div>) :
				(<div className="form insurance-form padding-80">
				<div className="options">
					<div className="field">
						<label>Add Insurance Front Image</label>
						<input style={{lineHeight: "20px", padding: "8px"}}
							   type="file"
							   name="insuranceFrontimage"
							   onChange={selectInsuranceImage}
							   required
						/>
					</div>
					<div className="field">
						<label>Add Insurance Back Image</label>
						<input style={{lineHeight: "20px", padding: "8px"}}
							   type="file"
							   name="insuranceBackimage"
							   onChange={selectInsuranceImage}
							   required
						/>
					</div>
				</div>
					{loading ? (
						<div className="appointmentcard border-bottom mb-4 col-lg-8 col-md-8">
							<Loader
								type="bubble-scale"
								bgColor={"#0c71c3"}
								title={"bubble-scale"}
								color={"#FFFFFF"}
								size={100}
							/>
						</div>
					):<div className="d-flex align-items-center justify-content-between mb-4">
						{insuranceImg && <div className="field p-0"><label>Insurance Image Preview</label>
							<div><img src={insuranceImg} className="w-100" /></div>
						</div>}
					</div>}
				<div className="main-buttons col-8 d-flex justify-content-md-end">
					<button className="outline width-small" onClick={() => history.push("/reviewnew")}>Close</button>
					<button style={{marginLeft: "20px"}} className="outline width-small" onClick={() => setInsurancePictures()}> {showLoadingText ? "Saving..." : "Save"}</button>
				</div>
			</div>)) : (<>
				{(showInsuranceForm) ? (
					<div className="form insurance-form padding-80">
						<div className="question">
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
									<label>Insurance Name</label>
									<Select
										value={insurance.label}
										options={searchList}
										onChange={(e) => onInputChange(e, "insurancepackageid")}
										placeholder=""
										className={"insuranceDataSelect"}
										classNamePrefix={"insuranceDataSelectInner"}
										openMenuOnClick={true}
									/>
								</div>
								<div className="field width45">
									<label>Issue Date</label>
									<input
										type="date"
										className="inputBox"
										name="issuedate"
										max={maxExpireDate}
										value={insurance.issuedate}
										onfocus="(this.type='date')"
										// onInput={(e) => onInputChange(e.target)}
										required
									/>
								</div>
								<div className="field width45">
									<label>Expiration Date</label>
									<input
										type="date"
										className="inputBox"
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
											<option value=""></option>
											<option value="M">Male</option>
											<option value="F">Female</option>
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
											<option value=""></option>
											<option value="1">Primary</option>
											<option value="2">Secondary</option>
										</select>
									</div>
								</div>
								<div className="field">
									<label>Patient's relationship to policy holder</label>
									<div className="custom-dropdown">
										<select className="select"
												name="relationshiptoinsuredid"
												value={insurance.relationshiptoinsuredid}
												onChange={(e) => onInputChange(e.target)}
												required
										>
											{relationshipList && relationshipList.map((res, index)=>{
												return (<option value={res.value}>{res.text}</option>)
											})}
										</select>
									</div>
								</div>
							</div>
						</div>
						<div className="main-buttons d-flex justify-content-md-end justify-content-lg-end justify-content-center">
							<button className="outline width-small" onClick={() => history.push("/reviewnew")}>Close</button>
							<button style={{marginLeft: "20px"}} className="outline width-small" disabled={insuranceBtnLoading} onClick={() => patientInsurance()}> {insuranceBtnLoading ? "Saving" : "Save"}</button>
						</div>
					</div>
				) : (<div>
					<div className="main-buttons btn-align-center">
						<h1 className="confirmation-heading-sec">Would You like to add your Insurance?</h1>
						<button className="outline width-small" onClick={() => setWarningShow(true)}>No</button>
						<button style={{marginLeft: "20px"}} className="outline width-small" onClick={() => showInsuranceFormToUser(true)}> Yes</button>
					</div>
				</div>)}
			</>)}
		</>
	)
}

export default Insurance;