import logo from './logo.svg';
import './App.css';
import Routes from './routes';
import PatientState from './context/patientDetails/patientState';
import { useEffect } from 'react';
import faviconIcon from "./assets/favicon.jpg"
import NewAppointment from "../src/component/appointmentnew"

function App() {
useEffect(()=>{
  const favicon = document.getElementById("favicon");
  favicon.href = faviconIcon
},[])
  return (

     <PatientState>
     
      <Routes />
    
    </PatientState>
    
  );
}

export default App;
