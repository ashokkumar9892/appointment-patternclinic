import React from "react";
import { useHistory } from "react-router-dom";
export const TopHeader = () => {
  const history = useHistory();
  return (
    <div className="top-header" onClick={() => history.push("/")}>
      <img className="top-image" src="/logo.png" alt="" />
      <h2 className="top-head" style={{color:'#ffffff'/*,fontSize:'30px',alignSelf:'end',marginTop:'5px',marginLeft:'15px',fontWeight:'bold', paddingBottom:'1px'*/}} > A Pattern Medical Clinic</h2>
    </div>
  );
};

export default TopHeader;
