import React, { useState } from "react";

import PatientContext from "./patientContext"

const PatientState =(props)=>{
  const [patientDetails, setPatientDetails] = useState({})
    const update =(data) => {
        setPatientDetails(data)
    }
return(
    <PatientContext.Provider value={{patientDetails,update}}>
        {props.children}
    </PatientContext.Provider>
)
}

export default PatientState;