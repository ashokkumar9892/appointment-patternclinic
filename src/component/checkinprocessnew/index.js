import React from "react"
import "./checkingprocess.css";
import logo from "../../assets/Appointment/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faThin, faPhone, faLocation, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const CheckInNew = () => {

    return (<>
        <section className="appointmentrow mx-0">
            <div className="left-sidebar">
                <img src={logo} alt="The Patient App" className="logo" />
                <div class="bullet-points">
                    <ul style={{ padding: "0px" }} >
                        <li className="bulletli"><a className="bulltetlist"> <FontAwesomeIcon icon={faPhone} /> <span className="bulletlisttext">(423) 455-2711 </span></a></li>
                        <li className="bulletli"><a className="bulltetlist"> <FontAwesomeIcon icon={faEnvelope} /><span className="bulletlisttext"> annex@gmail.com </span></a></li>
                        <li className="bulletli"><a className="bulltetlist"> <FontAwesomeIcon icon={faLocation} /><span className="bulletlisttext"> Ooltewah Clinic </span></a></li>
                    </ul>
                </div>
            </div>
            <div className="right-data">
                <div className="card no-shadow no-padding">
                    <div className="row steps">
                        <div class="col-12">
                            <ul class="border-bottom">
                                <li class="active">
                                    <a >
                                        <div>1</div>
                                        <span>Insurance</span>
                                    </a>
                                </li>
                                <li >
                                    <a >
                                        <div>2</div>
                                        <span>Payment</span>
                                    </a>
                                </li>
                                <li>
                                    <a >
                                        <div>3</div>
                                        <span>Covid Form</span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <div>4</div>
                                        <span>Intake Form</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div >
                        <form class="form insurance-form">
                            <div >
                                <div class="question">
                                    <p>Would you like to add your insurance?</p>
                                </div>
                                <div class="main-buttons">
                                    <button value="Yes" class="outline width-small">Yes</button>
                                    <button value="No" style={{marginLeft:"20px"}} class="outline width-small">No</button>
                                </div>
                            </div>
                            <div >
									<div class="question" >
										<div class="options">
											<div class="field">
												<label>Insurance ID Number</label>
												<input type="text"/>
											</div>
											<div class="field">
												<label>Insurance Package ID</label>
												<input type="number"/>
											</div>
											<div class="field">
												<label>Issue Date</label>
												<input type="date" />
											</div>
											<div class="field">
												<label>Expiration Date</label>
												<input type="date"/>
											</div>
											<div class="field">
												<label>Policyholder First Name</label>
												<input type="text"/>
											</div>
											<div class="field">
												<label>Policyholder last Name</label>
												<input type="text"/>
											</div>
											<div class="field">
												<label>Policyholder last Name</label>
												<div class="custom-dropdown">
												  <select className="select">
												    <option value="0">-Select-</option>
												    <option value="1">Male</option>
												    <option value="2">Female</option>
												  </select>
												</div>
											</div>
											<div class="field">
												<label>Insured Entity type Id</label>
												<div class="custom-dropdown">
												  <select className="select">
												    <option value="0">-Select-</option>
												    <option value="1">1</option>
												    <option value="2">2</option>
												  </select>
												</div>
											</div>
											<div class="field">
												<label>Relationship to Insured id</label>
												<input type="number"/>
											</div>
											<div class="field">
												<label>Sequence Number</label>
												<input type="number"/>
											</div>
											<div class="field">
												<label>Insurance Image</label>
												<input style={{lineHeight:"20px", padding:"8px"}} type="file"/>
											</div>
											<div class="field" ></div>
											
										</div>
									</div>
									<div class="main-buttons">
										<button value="close" class="outline width-small">Close</button>
										<button value="save" style={{marginLeft:"20px"}} class="outline width-small">Save</button>
									</div>
								</div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>)
}
export default CheckInNew;