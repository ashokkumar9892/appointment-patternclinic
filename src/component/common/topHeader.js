import React from "react";
import { useHistory } from "react-router-dom";
import homeIcon from "../../assets/Appointment/home-icon.png";
import "./topHeader.css";
export const TopHeader = () => {
  const history = useHistory();
  return (
    <div className="top-header" onClick={() => history.push("/")}>
	  <img src={homeIcon} alt="" style={{height: "35px", position: 'absolute', left: '5px', top: '15px', paddingLeft: '10px', cursor: 'pointer'}} className="home-screen-icon" />
      <div className="d-flex align-items-baseline">
		<img src="/logo.png" alt=""  style={{height: "40px"}} />
      <h2 className="logo-section" style={{color:'#ffffff',fontSize:'27px',alignSelf:'end',marginTop:'5px',marginLeft:'15px',fontWeight:'500'}}>A Pattern Medical Clinic</h2>
	  </div>
      </div>
  );
};

export default TopHeader;
