import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./appointmentnew.css"
import logo from "../../assets/Appointment/logo.svg";
import leftQuote from "../../assets/Appointment/left-quote.svg";
import rightQuote from "../../assets/Appointment/right-quote.svg";
import DatePicker from "react-horizontal-datepicker";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import { useContext } from "react";
import Loader from "react-js-loader";
import { useHistory } from "react-router-dom";
const AppointmentNew = () => {
	const history = useHistory();
	const patientContext = useContext(PatientContext);
	const [value, onChange] = useState(new Date());
	const [information, setData] = useState([]);
	const [rawInformation, setRawData] = useState([]);
	const [patientType, setPatientType] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [specialtyList, setSpecialtyList] = useState([]);
	const [reason, setReason] = useState("");
	const [reasonLabel, setReasonLabel] = useState("");
	const [reasonList, setReasonList] = useState([]);
	const [provider, setProvider] = useState("");
	const [providerList, setProviderList] = useState([]);
	const [selectedProviderList, setSelectedProviderList] = useState([]);
	const [location, setLoction] = useState("OOLTEWAH CLINIC (EDT)");
	const [timeData, setTimeData] = useState("");
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const BASE_URL = process.env.BASE_URL?process.env.BASE_URL:'http://localhost:3001';
	const selectedDay = (val) => {
		console.log(val)
		onChange(val)
	};

	const removeDuplicatedata = (arr) => {
		const res = {};
		const data = [];
		const originalArr = []
		arr.forEach((obj) => {
			const key = `${obj.starttime}`;
			if (!res[key]) {
				res[key] = { ...obj, count: 1 };
				data.push(key)
			}
			else {
				res[key].count = res[key].count + 1
			}

		});
		data.forEach((item, index) => {
			originalArr[index] = res[item]
		})
		console.log("after remove ", originalArr)
		return originalArr;
	}
	function formatAMPM(date) {
		console.log(date, "check dattttt")
		let dat = new Date(date)
		var hours = dat.getHours();
		var minutes = dat.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? (hours < 10 ? '0' + hours : hours) : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	useEffect(() => {
		if (reason) {
			setLoading(true);
			let request = {
				url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/open?practiceid=24451&departmentid=1&reasonid=${reason}&providerid=${provider}`,
			};
			api.getAuth(request).then((data) => {
				setLoading(false);
				if (data.data.appointments.length > 0) {
					setRawData([...data.data.appointments]);
				}
			});
		}
	}, [provider]);
	useEffect(() => {
		// let request = {
		// 	url: `https://appointmentapi.apatternclinic.com/v1/24451/providers`,
		// };
		// api.getAuth(request).then((data) => {
		// 	setLoading(false);
		// 	console.log('providers '+data);
		// 	console.log(data);
		// 	setProviderList(data.data.providers);
		// 	setSpecialtyList(
		// 		[...new Set(data.data.providers.map((el) => el.specialty))].sort(
		// 			(a, b) => a.localeCompare(b)
		// 		)
		// 	);
		// });
		let reasonresponse=[];
		axios.request({url:`${BASE_URL}/providers`}).then(data=>{
			setLoading(false);
			setProviderList(data.data.providers);
			setSpecialtyList(
				[...new Set(data.data.providers.map((el) => el.specialty))].sort(
					(a, b) => a.localeCompare(b)
				)
			);
			let reasonPromise = [];
			for (const el of data.data.providers) {
				reasonPromise.push(
					new Promise((resolve, reject) => {
						let request = {
							url: `https://appointmentapi.apatternclinic.com/v1/24451/patientappointmentreasons?departmentid=1&providerid=${el.providerid}`,
						};
						api
							.getAuth(request)
							.then((data) => {
								for (const element of data.data.patientappointmentreasons){
									element.providerid = el.providerid;
									reasonresponse.push(element);
								}
								resolve(data.data.patientappointmentreasons);
							})
							.catch(reject);
					})
				);
			}
			Promise.all(reasonPromise).then((res) => {
				console.log('reason 144');
				console.log(res);
				//reasonresponse = res;
				// const databody = {'patientappointmentreasons':JSON.stringify({patientappointmentreasons:reasonresponse})}
				// for (const el of res){
				// 	for(const el2 of el){
				// 		reasonresponse.push(el2);
				// 	}
				// }
				axios.request({
					method: 'post',
					url: `${BASE_URL}/saveappointmentreasons`,
					contentType: "application/json",
					data: {
						'patientappointmentreasons':JSON.stringify({patientappointmentreasons:reasonresponse})
					}
				  }).then(data=>{
					console.log(data);
				}).catch(err=>{
					console.log(err);
				})
			});
			
		}).catch(err=>{
			console.log(err);
		})
		
	}, []);
	useEffect(() => {
		setReasonLabel(reasonList.find((el) => el.reasonid === +reason)?.reason);
	}, [reason]);
	useEffect(() => {
		if (specialty) {

			let reasonPromise = [];
			const filteredList = providerList.filter(
				(el) => el.specialty === specialty
			);
			console.log(filteredList);
			setSelectedProviderList(filteredList);
			axios.request({
				method: 'post',
				url: `${BASE_URL}/appointmentreasons`,
				contentType: "application/json",
				data: {
					'specialty':specialty
				}
			  }).then(data=>{
				setLoading(false);
				console.log('reason ');
				console.log(data);
				reasonPromise = data.data.patientappointmentreasons;
				console.log('reasonlist');
				console.log(data.data.patientappointmentreasons);
				let rList = [];
				let rIdList = [];
				console.log(rList);
				console.log(rIdList);
				//for (const el of reasonPromise) {
					for (const item of reasonPromise) {
						if (
							!rIdList.includes(item.reasonid) &&
							(item.reasontype === patientType.toLowerCase() ||
								item.reasontype === "all")
						) {
							rList.push(item);
							rIdList.push(item.reasonid);
						}
					}
				//}
				setReasonList(rList.sort((a, b) => a.reason.localeCompare(b.reason)));
			}).catch(err=>{
				console.log(err);
			})
			// for (const el of filteredList) {
			// 	reasonPromise.push(
			// 		new Promise((resolve, reject) => {
			// 			let request = {
			// 				url: `https://appointmentapi.apatternclinic.com/v1/24451/patientappointmentreasons?departmentid=1&providerid=${el.providerid}`,
			// 			};
			// 			api
			// 				.getAuth(request)
			// 				.then((data) => {
			// 					resolve(data.data.patientappointmentreasons);
			// 				})
			// 				.catch(reject);
			// 		})
			// 	);
			// }
			// Promise.all(reasonPromise).then((res) => {
			// 	console.log('reason 144');
			// 	console.log(res);
			// 	let rList = [];
			// 	let rIdList = [];
			// 	for (const el of res) {
			// 		for (const item of el) {
			// 			if (
			// 				!rIdList.includes(item.reasonid) &&
			// 				(item.reasontype === patientType.toLowerCase() ||
			// 					item.reasontype === "all")
			// 			) {
			// 				rList.push(item);
			// 				rIdList.push(item.reasonid);
			// 			}
			// 		}
			// 	}
			// 	setReasonList(rList.sort((a, b) => a.reason.localeCompare(b.reason)));
			// });
		}
	}, [specialty]);
	useEffect(() => {
		if (rawInformation.length > 0) {
			const yyyy = value.getFullYear();
			let mm = value.getMonth() + 1; // Months start at 0!
			let dd = value.getDate();

			if (dd < 10) dd = "0" + dd;
			if (mm < 10) mm = "0" + mm;

			const date = mm + "/" + dd + "/" + yyyy;
			const data = rawInformation.filter((el) => el.date === date);
			console.log(data, "check data")
			setData(removeDuplicatedata([...data]))

		}
	}, [value, rawInformation]);

	const UpdateData = (starttime, appointmentid, appointmenttypeid) => {
		setTimeData(starttime);
		patientContext.update({
			location: location,
			timeData: starttime,
			reason: reason,
			reasonLabel: reasonLabel,
			appointmenttypeid: appointmenttypeid,
			appointmentid: appointmentid,
			value: value.toDateString(),
			providerid: provider,
		});
		setTimeout(() => {
			history.push("/schedulenew/");
		}, 500);
	};

	const isFound = (arr, num1, num2) => {
		console.log("check in ", arr, num1, num2)
		if(arr?.length >0){
		arr.some(element => {
			console.log(Number((element.starttime).split(":")[0]),num1, num2,"jshjdjkdfjk")
			if (Number((element.starttime).split(":")[0]) > num1 && Number((element.starttime).split(":")[0]) < num2) {
				return false;
			}
			return true;
		})
	}
	else{
		return true
	}
	}


	return (<>
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
				<div className="card-wrap main-buttonstab">
					<div className="appointmentcard">
						<div className="appointmentrow">
							<div className="col-6 paddingleftright" >
								<button className={patientType === 'New' ? 'active' : ''} onClick={() => { setPatientType("New") }}>New Patient</button>
							</div>
							<div className="col-6 paddingleftright">
								<button className={patientType === 'Existing' ? 'active' : ''} onClick={() => { setPatientType("Existing") }}>Existing Patient</button>
							</div>
						</div>
					</div>
				</div>
				<div className="card-wrap">
					<div className="appointmentcard">
						<h2 className="card-heading mb-30px">Make a Appointment</h2>
						<div className="appointmentrow mb-30px">
							<div className="col-4 ">
								<label>Speciality</label>
								<div style={{marginTop:"8px"}}>
									<select
										disabled={!patientType}
										className="form-select"
										onChange={(event) => {
											setSpecialty(event.target.value);
										}}
									>
										<option value="" hidden>
											-Select-
										</option>
										{specialtyList.map((el, i) => (
											<option value={el} key={i}>
												{el}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="col-4" >
								<label>Reason for visit</label>
								<div style={{marginTop:"8px"}}>
									<select
										disabled={!specialty}
										className="form-select"
										onChange={(event) => {
											setReason(event.target.value);
										}}
									>
										<option value="" hidden>
											-Select-
										</option>
										{reasonList.map((el) => (
											<option value={el.reasonid} key={el.reasonid}>
												{el.reason}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="col-4">
								<label>Provider</label>
								<div style={{marginTop:"8px"}}>
									<select
										className="form-select"
										disabled={!specialty}
										onChange={(event) => {
											setProvider(event.target.value);
										}}
									>
										<option value="" hidden>
											-Select-
										</option>
										{selectedProviderList.map((el) => (
											<option value={el.providerid} key={el.providerid}>
												{el.displayname || el.firstname}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>
						<div className="appointmentrow">
							<div className="appointmentcol-12">
								<label>{value.toDateString()}</label>
								<div style={{ fontSize: "14px", lineHeight: "1.1rem", marginTop: "8px" }}>
									<DatePicker getSelectedDay={selectedDay}
										endDate={100}
										selectDate={new Date(value)}
										labelFormat={"MMMM"}
										color={"#374e8c"}

									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="card-wrap">
					{loading && (
						<div className="appointmentcard border-bottom">
							<Loader
								type="bubble-scale"
								bgColor={"#0c71c3"}
								title={"bubble-scale"}
								color={"#FFFFFF"}
								size={100}
							/>
						</div>
					)}
				</div>

				<div className="appointmentcard border-bottom">
					<div className="appointmentrow">
						<div className="appointmentcol-12">
							<h4 className="card-heading-small">Morning</h4>
							<label className="mb-30px">9:00 AM to 12:00 PM</label>


							<div className="timing-cards-wrap">
								{information && information.length > 0
									&& information.map((item, index) => {

										return (
											<>{Number(item.starttime.split(":")[0]) < 12 &&
												<div
													className="catappointment action"
													data-toggle="tooltip"
													title={
														item.patientappointmenttypename +
														" " +
														item.date
													}
													onClick={() => {
														UpdateData(
															item.starttime,
															item.appointmentid,
															item.appointmenttypeid
														);
													}}
												>
													<a href="javascript:;">
														<div className="timing-cards">
															<p style={{ marginBottom: "0px" }}>{formatAMPM(item.date + " " + item.starttime)}</p>
															<span>{item.count}</span>
														</div>
													</a>

												</div>}

											</>
										);
									})
								}
								{
									isFound(information, 0, 12) && <p>No Schedule Found</p>}


							</div>
						</div>
					</div>
				</div>
				<div className="appointmentcard">
					<div className="appointmentrow">
						<div className="appointmentcol-12">
							<h4 className="card-heading-small">Afternoon</h4>
							<label className="mb-30px">12:00 PM to 4:00 PM</label>
							<div className="timing-cards-wrap">
								{information && information.length > 0
									&& information.map((item, index) => {
										return (
											<>
												{(Number(item.starttime.split(":")[0]) > 12 && Number(item.starttime.split(":")[0]) < 16) &&
													<div
														className="catappointment action"
														data-toggle="tooltip"
														title={
															item.patientappointmenttypename +
															" " +
															item.date
														}
														onClick={() => {
															UpdateData(
																item.starttime,
																item.appointmentid,
																item.appointmenttypeid
															);
														}}
													>
														<a href="javascript:;">
															<div className="timing-cards">
																<p style={{ marginBottom: "0px" }}>{formatAMPM(item.date + " " + item.starttime)}</p>
																<span>{item.count}</span>
															</div>
														</a>

													</div>
												}
											</>
										);
									})}
								{
									// isFound
									isFound(information, 12, 16) && <p>No Schedule Found</p>}
							</div>
						</div>
					</div>
				</div>
				<div className="appointmentcard">
					<div className="appointmentrow">
						<div className="appointmentcol-12">
							<h4 className="card-heading-small">Evening</h4>
							<label className="mb-30px">05:00 PM to 10:00 PM</label>
							<div className="timing-cards-wrap">
								{information && information.length > 0
									&& information.map((item, index) => {
										return (
											<>
												{Number(item.starttime.split(":")[0]) > 16 &&
													<div
														className="catappointment action"
														data-toggle="tooltip"
														title={
															item.patientappointmenttypename +
															" " +
															item.date
														}
														onClick={() => {
															UpdateData(
																item.starttime,
																item.appointmentid,
																item.appointmenttypeid
															);
														}}
													>
														<a href="javascript:;">
															<div className="timing-cards">
																<p style={{ marginBottom: "0px" }}>{formatAMPM(item.date + " " + item.starttime)}</p>
																<span>{item.count}</span>
															</div>
														</a>

													</div>
												}
											</>
										);
									})}
								{
									isFound(information, 16, 23) && <p>No Schedule Found</p>}
							</div>
						</div>
					</div>
				</div>

			</div>
		</section>

	</>)

}
export default AppointmentNew