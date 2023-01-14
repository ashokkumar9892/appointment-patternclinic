import React, {useContext, useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useHistory} from "react-router-dom";
import mergeImages from 'merge-base64';
import moment from "moment";
import api from "../../api";
import swal from "sweetalert";
import "./insurance.css";
import PatientContext from "../../context/patientDetails/patientContext";
import TopHeader from "../common/topHeader";

const Insurance = () =>{
	const history = useHistory();
	const [insurance, setInsurance] = useState({ departmentid: 1 });
	const patientContext = useContext(PatientContext);
	const [insuranceImg, setInsuranceImg] = useState("");
	const [insuranceList, setInsuranceList] = useState([]);
	const [insuranceError, setInsuranceError] = useState("");
	const [showWarningModal, setWarningShow] = useState(false);
	const [docImage, setDocImage] = useState({});
	const onInputChange = (e) => {
		setInsurance({ ...insurance, [e.name]: e.value });
	};
	const [show, setShow] = useState(false);
	const checkInsurance = () =>{
		const request={
			url: 'https://appointmentdemoapi.apatternclinic.com/v1/24451/misc/topinsurancepackages'
		}
		api.getAuth(request).then((res)=>{
			setInsuranceList(res.data.insurancepackages)
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
		try
		{
			const base64ImageFront = docImage?.insuranceFrontimage;
			const base64ImageBack = docImage?.insuranceBackimage;
			await mergeImages([base64ImageFront.split("base64,")[1], base64ImageBack.split("base64,")[1]]).then(b64 =>
			{
				setInsuranceImg(b64)
			});
		}
		catch (error)
		{
			console.log(error);
		}
	}
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
							console.log(insuranceImg);
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
									// setInsuranceImg("");
									setInsuranceBtnLoading(false);
									handleClose();

									swal("Insurance has been added successfully", "success");
									showInsuranceFormToUser(false);
								})
								.catch((err) => {
									swal("Something went wrong", "error");
									setInsuranceBtnLoading(false);
									console.log(err);
								});
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
			{(showInsuranceForm) ? (
				<div className="form insurance-form padding-80">
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
								<label>Insurance Name</label>
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
							<div className="field">
								<label>Issue Date</label>
								<input
									type="date"
									name="issuedate"
									max={maxExpireDate}
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
								<label>Add Insurance Front Image</label>
								<input style={{ lineHeight: "20px", padding: "8px" }}
									   type="file"
									   name="insuranceFrontimage"
									   onChange={selectInsuranceImage}
									   required
								/>
							</div>
							<div className="field">
								<label>Add Insurance Back Image</label>
								<input style={{ lineHeight: "20px", padding: "8px" }}
									   type="file"
									   name="insuranceBackimage"
									   onChange={selectInsuranceImage}
									   required
								/>
							</div>
						</div>
						<div className="d-flex align-items-center justify-content-between">
							{insuranceImg && <div className="field p-0"><label>Insurance Image Preview</label>
								<div><img  src={insuranceImg} className="w-100" /></div>
							</div>}
						</div>
					</div>
					<div className="main-buttons">
						<button className="outline width-small" onClick={() => history.push("/reviewnew")}>Close</button>
						<button style={{ marginLeft: "20px" }} className="outline width-small" disabled={insuranceBtnLoading} onClick={() => patientInsurance()}> {insuranceBtnLoading ? "Saving" : "Save"}</button>
					</div>
				</div>
			): (<div>
				<div className="main-buttons btn-align-center">
					<h1 className="confirmation-heading-sec">Would You like to add your Insurance?</h1>
					<button className="outline width-small" onClick={() => setWarningShow(true)}>No</button>
					<button style={{ marginLeft: "20px" }} className="outline width-small" onClick={() => showInsuranceFormToUser(true)}> Yes </button>
				</div>
			</div>)}
		</>
	)
}

export default Insurance;