import React from "react";
import "./appointmentnew.css";
import { useState } from "react";

const SheduleData = (props) => {
  const [showMore, setShowMore] = useState(false);

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
  return (
    <>
      <div
        className="catappointment action"
        data-toggle="tooltip"
        title={props.item.patientappointmenttypename + " " + props.item.date}
        onClick={() => {
          props.UpdateData(
            props.item.starttime,

            props.item.appointmentid,
            props.item.appointmenttypeid
          );
        }}
      >
        <a href="javascript:;">
          <div className="timing-cards">
            <p style={{ marginBottom: "0px" }}>
              {formatAMPM(props.item.date + " " + props.item.starttime)}
            </p>
            <span>{props.item?.count}</span>
          </div>
        </a>
      </div>
    </>
  );
};
export default SheduleData;
