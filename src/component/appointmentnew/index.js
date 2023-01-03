import React, { useEffect, useState } from "react";
import axios from "axios";
import "./appointmentnew.css";
import Logo from "../../assets/Appointment/logo.svg";
import leftQuote from "../../assets/Appointment/left-quote.svg";
import rightQuote from "../../assets/Appointment/right-quote.svg";
import DatePicker from "react-horizontal-datepicker";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import { getToken } from "../../api";
import { useContext } from "react";
import Loader from "react-js-loader";
import { useHistory } from "react-router-dom";
import SheduleData from "./shedule";
import ProviderListComp from "./prviderlist";
const AppointmentNew = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [value, onChange] = useState(new Date());
  const [sheduleobj, setSheduleObj] = useState({});
  const [patientType, setPatientType] = useState("");
  const [reason, setReason] = useState("");
  const [reasonLabel, setReasonLabel] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [provider, setProvider] = useState("");
  const [providerList, setProviderList] = useState([]);
  const [location, setLoction] = useState("OOLTEWAH CLINIC (EDT)");
  const [timeData, setTimeData] = useState("");
  const [openApiCall, setOPenAPiCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL
    ? process.env.REACT_APP_BASE_URL
    : "http://localhost:3001";
  const selectedDay = (val) => {
    onChange(val);
  };

  const ReasonApiCall = () => {
    axios
      .request({ url: `${BASE_URL}/appointmentreasons` })
      .then((data) => {
        setLoading(false);
        setReasonList(data.data?.patientappointmentreasons);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .request({ url: `${BASE_URL}/providers` })
      .then((data) => {
        setLoading(false);
        setProviderList(data.data.providers);
      })
      .catch((err) => {
        console.log(err);
      });

    ReasonApiCall();
    getToken();
  }, []);
  useEffect(() => {
    let obj = {};
    providerList.map((item, index) => {
      setLoading(true);
      let request = {
        url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/open?practiceid=24451&departmentid=1&reasonid=${reason}&providerid=${item.providerid}`,
      };
      api.getShedule(request).then((data) => {
        setLoading(false);
        setOPenAPiCall(true);
        obj[item.providerid] = data.data.appointments;
      });
    });
    setTimeout(() => {
      setSheduleObj(obj);
    }, [10000]);
  }, [reason]);

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

  useEffect(() => {
    console.log("check shedule");
  }, [sheduleobj]);

  return (
    <>
      <section className="appointmentrow mx-0">
        {/* <div className="left-sidebar">
          <img src={Logo} alt="The Patient App" className="logo" />
          <div className="quote">
            <img src={leftQuote} className="quote-icon left" />
            <img src={rightQuote} className="quote-icon right" />
            <h2>Healthcare You Can Afford</h2>
            <p>
              Here at A Pattern Medical Clinic, our top priority is patient
              care. In order to make sure that we can see you, we choose rates
              that are well below the Emergency Room prices.
            </p>
          </div>
        </div> */}

        <div className="right-content">
          <div className="card-wrap">
            <div className="appointmentcard">
              <h2 className="card-heading mb-30px">Make a Appointment</h2>
              <div className="appointmentrow mb-30px">
                <div className="col-6">
                  <label>Patient Type</label>
                  <div style={{ marginTop: "8px" }}>
                    <select
                      className="formselectdiv"
                      onChange={(event) => {
                        setPatientType(event.target.value);
                      }}
                    >
                      <option value="" hidden>
                        -Select-
                      </option>
                      <option value="new">New Patient</option>
                      <option value="existing">Existing Patient</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label>Reason for visit</label>
                  <div style={{ marginTop: "8px" }}>
                    <select
                      disabled={!patientType}
                      className="formselectdiv"
                      onChange={(event) => {
                        setReason(event.target.value);
                      }}
                    >
                      <option value="" hidden>
                        -Select-
                      </option>
                      {reasonList.map((el) => {
                        return (
                          <>
                            {(el.reasontype == patientType ||
                              el.reasontype == "all") && (
                              <option value={el.reasonid} key={el.reasonid}>
                                {el.reason}
                              </option>
                            )}
                          </>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="appointmentrow">
                <div className="appointmentcol-12">
                  <label>{value.toDateString()}</label>
                  <div
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.1rem",
                      marginTop: "8px",
                    }}
                  >
                    <DatePicker
                      getSelectedDay={selectedDay}
                      endDate={100}
                      selectDate={new Date(value)}
                      labelFormat={"MMMM"}
                      color={"#374e8c"}
                      className="datapicker"
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

          {providerList?.map((item, index) => (
            <ProviderListComp
              item={item}
              sheduleobj={sheduleobj}
              patientType={patientType}
              reason={reason}
              openApiCall={openApiCall}
              value={value}
              UpdateData={UpdateData}
            />
          ))}
        </div>
      </section>
    </>
  );
};
export default AppointmentNew;
