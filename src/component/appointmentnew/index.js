import React, { useEffect, useState } from "react";
import axios from "axios";
import "./appointmentnew.css";
import logo from "../../assets/Appointment/logo.svg";
import leftQuote from "../../assets/Appointment/left-quote.svg";
import rightQuote from "../../assets/Appointment/right-quote.svg";
import DatePicker from "react-horizontal-datepicker";
import PatientContext from "../../context/patientDetails/patientContext";
import api from "../../api";
import { useContext } from "react";
import Loader from "react-js-loader";
import { useHistory } from "react-router-dom";
import Icons from "../../assets/favicon.jpg";
const AppointmentNew = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [value, onChange] = useState(new Date());
  const [information, setData] = useState([]);
  //   const [rawInformation, setRawData] = useState([]);
  const [sheduleobj, setSheduleObj] = useState({});
  const [patientType, setPatientType] = useState("");
  const [reason, setReason] = useState("");
  const [reasonLabel, setReasonLabel] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [provider, setProvider] = useState("");
  const [providerList, setProviderList] = useState([]);
  const [location, setLoction] = useState("OOLTEWAH CLINIC (EDT)");
  const [timeData, setTimeData] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL
    ? process.env.REACT_APP_BASE_URL
    : "http://localhost:3001";
  const selectedDay = (val) => {
    onChange(val);
  };

  const keydata = 9;
  const removeDuplicatedata = (arr) => {
    const res = {};
    const data = [];
    const originalArr = [];
    arr.forEach((obj) => {
      const key = `${obj.starttime}`;
      if (!res[key]) {
        res[key] = { ...obj, count: 1 };
        data.push(key);
      } else {
        res[key].count = res[key].count + 1;
      }
    });
    data.forEach((item, index) => {
      originalArr[index] = res[item];
    });
    return originalArr;
  };
  function formatAMPM(date) {
    let dat = new Date(date);
    var hours = dat.getHours();
    var minutes = dat.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? (hours < 10 ? "0" + hours : hours) : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

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
  }, []);
  useEffect(() => {
    let obj = {};
    providerList.map((item, index) => {
      setLoading(true);
      let request = {
        url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/open?practiceid=24451&departmentid=1&reasonid=${reason}&providerid=${item.providerid}`,
      };
      api.getAuth(request).then((data) => {
        setLoading(false);
        obj[item.providerid] = data.data.appointments;
      });
    });
    setTimeout(() => {
      setSheduleObj(obj);
    }, [10000]);
  }, [reason]);

  //   useEffect(() => {
  //     if (rawInformation.length > 0) {
  //       const yyyy = value.getFullYear();
  //       let mm = value.getMonth() + 1; // Months start at 0!
  //       let dd = value.getDate();
  //       if (dd < 10) dd = "0" + dd;
  //       if (mm < 10) mm = "0" + mm;
  //       const date = mm + "/" + dd + "/" + yyyy;
  //       const data = rawInformation.filter((el) => el.date === date);
  //       setData(removeDuplicatedata([...data]));
  //     }
  //   }, [value, rawInformation]);

  const getdateData = (rawInformation) => {
    const yyyy = value.getFullYear();
    let mm = value.getMonth() + 1; // Months start at 0!
    let dd = value.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const date = mm + "/" + dd + "/" + yyyy;
    const data = rawInformation.filter((el) => el.date === date);

    return data;
  };

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

  const isFound = (arr, num1, num2) => {
    if (arr?.length > 0) {
      arr.some((element) => {
        if (
          Number(element.starttime.split(":")[0]) > num1 &&
          Number(element.starttime.split(":")[0]) < num2
        ) {
          return false;
        }
        return true;
      });
    } else {
      return true;
    }
  };

  return (
    <>
      {console.log(sheduleobj, "sheduleobj")}
      <section className="appointmentrow mx-0">
        <div className="left-sidebar">
          <img src={logo} alt="The Patient App" className="logo" />
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
        </div>

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
            <div className="appointmentcard border-bottom">
              <div className="appointmentrow">
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <div style={{ width: "20%" }}>
                    <img
                      src={Icons}
                      style={{
                        borderRadius: "4px",
                        marginRight: "16px",
                        objectFit: "contain",
                        height: "auto",
                      }}
                      width="100%"
                    />
                  </div>
                  <div className="appointmentcolshedule">
                    <h4 className="card-heading-small">{item.displayname}</h4>
                    {Object.keys(sheduleobj).length > 0 && (
                      <div className="timing-cards-wrap">
                        {sheduleobj[Number(item.providerid)]?.length > 0 &&
                          removeDuplicatedata(
                            getdateData(sheduleobj[Number(item.providerid)])
                          )?.map((item, index) => (
                            <>
                              {
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
                                      <p style={{ marginBottom: "0px" }}>
                                        {formatAMPM(
                                          item.date + " " + item.starttime
                                        )}
                                      </p>
                                      <span>{item.count}</span>
                                    </div>
                                  </a>
                                </div>
                              }
                            </>
                          ))}
                        {
                          // isFound
                          isFound(
                            sheduleobj[Number(item.providerid)],
                            12,
                            16
                          ) && <p>No Schedule Found</p>
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
export default AppointmentNew;
