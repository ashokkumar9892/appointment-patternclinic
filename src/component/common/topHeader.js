import React from "react";
import { useHistory } from "react-router-dom";
export const TopHeader = () => {
  const history = useHistory();
  return (
    <div className="top-header" onClick={() => history.push("/")}>
      <img src="/logo.png" alt="" />
      <h2 style={{color:'white',fontSize:'27px',alignSelf:'end',marginTop:'5px',marginLeft:'15px',fontWeight:'500'}}> A PATTERN MEDICAL CLINIC</h2>
    </div>
  );
};

export default TopHeader;
