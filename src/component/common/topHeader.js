import React from "react";
import { useHistory } from "react-router-dom";
export const TopHeader = () => {
  const history = useHistory();
  return (
    <div className="top-header" onClick={() => history.push("/")}>
      <img src="/logo.png" alt="" />
    </div>
  );
};

export default TopHeader;
