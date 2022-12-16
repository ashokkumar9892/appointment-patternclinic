import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import moment from "moment";
import swal from "sweetalert";
import "./common.css"
import api from "../../api";
import { MultiSelect } from "react-multi-select-component";
import PatientContext from '../../context/patientDetails/patientContext';

const symptomsOptions = [
  { label: "None of the below", value: "none" },
  { label: "Fever(Chils or shaking)", value: "fever" },
  { label: "Cough, shortness of breath or difficulty breating", value: "coughShortnessBreathOrDifficultyBreating" },
  { label: "Fatigue", value: "fatigue" },
  { label: "Muscle aches and pain", value: "muscleAchesAndPain" },
  { label: "Headache", value: "headache" },
  { label: "Loss of taste or smell", value: "lossOfTasteOrSmell" },
  { label: "Sore throat", value: "soreThroat" },
  { label: "Congestion or runny nose", value: "congestionOrRunnyNose" },
  { label: "Nausea or vomiting", value: "nausiaOrVomiting" },
  { label: "Diarrhea", value: "diarrhea" },
];

const patientRaceOptions = [
  {label: "Decline to Answer", value: "declined"},
  {label: "Decline to Answer2", value: "declined2"},
  {label: "Decline to Answer", value: "declined3"},
]

const languages = [
  {label: "English", value: "english"},
  {label: "French", value: "french"},
  {label: "Russian", value: "russian"},
  {label: "Italian", value: "italian"}
]

const emergencyContactRelationShipOptions = [
  {label:"SPOUSE", value:'spouse'},
  {label:"CHILD", value:'child'},
  {label:"COUSIN", value:'cousin'},
  {label:"FRIEND", value:'friend'},
  {label:"SIBLING", value:'sibling'},
  {label:"GUARDIAN", value:'guardian'},
  {label:"OTHER", value:'other'}
]

const firstIndividualRelationShipOptions = [
  {label:"Spouse / Partner", value:'spouse'},
  {label:"Child", value:'child'},
  {label:"Parent", value:'parent'},
  {label:"Family Member", value:'familyMember'},
  {label:"Friend", value:'friend'},
  {label:"Other / Not Listed", value:'other'},
]


export default function CovidForm(props) {
  const patientContext = useContext(PatientContext);
  const [formStep, setFormStep] = useState(1);
  const [covidDetails, setCovidDetails] = useState(patientContext?.patientDetails?.covidData?.covidDetails)
  const [personalDetails, setPersonalDetails] = useState(patientContext?.patientDetails?.covidData?.personalDetails)
  const [emergencyContact, setEmergencyContact] = useState(patientContext?.patientDetails?.covidData?.emergencyContact);
  const [medicalContact, setMedicalContact] = useState(patientContext?.patientDetails?.covidData?.medicalContact);
  const [informationRelease, setInformationRelease] = useState(patientContext?.patientDetails?.covidData?.informationRelease);

  useEffect(() => {
    updateContext()
  }, [covidDetails, personalDetails, emergencyContact, medicalContact, informationRelease])

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [formStep])
  
  const [checkFormStep1, setCheckFormStep1] = useState(true);
  const [checkFormStep2, setCheckFormStep2] = useState(true);
  const [checkFormStep3, setCheckFormStep3] = useState(true);
  const [checkFormStep4, setCheckFormStep4] = useState(true);
  const [checkFormStep5, setCheckFormStep5] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [stepCanvas, setStepCanvas] = useState({});


  const covidData = {
    covidDetails:covidDetails,
    personalDetails:personalDetails,
    emergencyContact:emergencyContact,
    medicalContact:medicalContact,
    informationRelease:informationRelease,
  }

  const buildCovidDetails = (name, value) => {
    setCovidDetails(covidDetails => ({...covidDetails,[name]:value}));
    updateContext()
  }

  const buildPersonalDetails = (name, value) => {
    setPersonalDetails(personalDetails => ({...personalDetails, [name]:value}));
    updateContext()
  }


  const buildEmergencyContact = (name, value) => {
    setEmergencyContact(emergencyContact => ({...emergencyContact, [name]:value}));
    updateContext()
  }

  const buildMedicalContact = (name, value) => {
    setMedicalContact(medicalContact => ({...medicalContact, [name]:value}));
    updateContext()
  }

  const buildInformationRelease = (name, value) => {
    setInformationRelease(informationRelease => ({...informationRelease, [name]:value}));
    updateContext()
  }




  
  const isFormStep1 = () => {
    if(covidDetails?.closeContactWithCovidPatient !== '' && covidDetails?.covidTest !== '' && covidDetails?.pastSymptoms &&covidDetails?.pastSymptoms.length > 0) {
      setCheckFormStep1(false);
    } else {
      setCheckFormStep1(true)
    }
  }

  const isFormStep2 = () => {
    if(personalDetails?.spokenLanguage !== '' && personalDetails?.patientRace && personalDetails?.patientRace?.length > 0 && personalDetails?.ethnicity !== undefined && personalDetails?.martialStatus !== undefined) {
      setCheckFormStep2(false);
    } else {
      setCheckFormStep2(true)
    }
  }

 
  const isFormStep3 = () => {
    if(emergencyContact?.name !== '' && emergencyContact?.mobilePhone > 0 && emergencyContact?.phone > 0 && emergencyContact?.relationShip !== (undefined)) {
      setCheckFormStep3(false)
    } else {
      setCheckFormStep3(true)
    }
  }

  const isFormStep4 = () => {
    if(medicalContact?.medicalContactPermission !== (undefined) && medicalContact?.informationRelease !== (undefined || '') && medicalContact?.firstIndividualRelationShip !== undefined  && medicalContact?.informationReleaseAdditional !== undefined ) {
      setCheckFormStep4(false)
    } else {
      setCheckFormStep4(true)
    }
  }

  const isFormStep5 = () => {
    console.log(informationRelease,informationRelease?.termAndConditions, "informationRelease by utkarsh")
    if(informationRelease?.acceptance !== undefined && informationRelease?.fullname !==  undefined && informationRelease?.fullname !== '' && informationRelease.termAndConditions && informationRelease?.termAndConditions !== false) {
      setCheckFormStep5(false)
    } else {
      setCheckFormStep5(true)
    }
  }


  const updateContext = () => {
      patientContext.update({
        ...patientContext.patientDetails,
        covidData
      });
      console.log(patientContext.patientDetails.covidData)
  }

  const generateDocs = (step) => {
    html2canvas(document.getElementById(`pdf-ref-${step}`)).then(async res => {
      const canvasData = { ...stepCanvas, [step]: res };
      setStepCanvas(canvasData)
      if (step === 5) {
        setIsLoading(true)
        const pdf = new jsPDF({
          orientation: 'landscape',
        });
        for (const key in canvasData) {
          const imgProps = pdf.getImageProperties(canvasData[key]);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          if(key > 1) {
            pdf.addPage();
          }
          pdf.addImage(canvasData[key], 'CANVAS', 10, 10, pdfWidth - 20, pdfHeight - 20);
        }
        const pdfDataUri = pdf.output('datauristring');
        submitForm(pdfDataUri.split(',').pop());
      } else {
        setFormStep(step + 1)
      }
    })
  }

  const submitForm = (attachmentcontents) => {
    const formData = new URLSearchParams();
    formData.append('attachmenttype', 'PDF')
    formData.append('attachmentcontents', attachmentcontents)
    formData.append('autoclose', 'true')
    formData.append('departmentid', '1')
    formData.append('documentdate', moment().format("MM/DD/YYYY"))
    formData.append('documentsubclass', 'ADMIN')
    formData.append('documenttypeid', '186965')
    formData.append('entitytype', 'PATIENT')
    formData.append('originalfilename', 'Covid Form')
    formData.append('priority', '1')
    formData.append('providerid', '1')
    let request = {
      url: `https://appointmentapi.apatternclinic.com//v1/24451/patients/${props.patientid}/documents/admin`,
      data: formData,
    };
    api
      .postAuth(request)
      .then((res) => {
        swal("Covid form successfully submitted", "success");
        props.complete()
      })
      .catch((error) => {
      })
      .finally(() => {setIsLoading(false)});
  };
  
  useEffect(() => {
    isFormStep1();
    isFormStep2();
    isFormStep3();
    isFormStep4();
    isFormStep5();
  })
  return (
   <div className='px-3'>
    { formStep == 1 ?  
      <>
      <div className='mb-3' id='pdf-ref-1'>
        <label className="label d-block mb-3">In order to protect you and others, we are asking about symptoms and exposure to COVID-19. Your Health is our priority, please answer these questions so that we can direct you to the care that you need as quickly as possible.</label>

        <div className='form-group mb-3'>
          <label className="label d-block">In the past 10 days, did you have close(within 6 feet for at least 15 minutes) with someone woth symptoms of COVID-19 or who tested positive for COVID-19?</label>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="closeContactWithCovidPatient" id="closeContactWithCovidPatientNo" value="no" onChange={(e) => {buildCovidDetails('closeContactWithCovidPatient', e.target.value)}} checked={patientContext?.patientDetails?.covidData?.covidDetails?.closeContactWithCovidPatient == 'no'}/>
            <span className="optionListName" htmlFor="closeContactWithCovidPatientNo">No</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="closeContactWithCovidPatient" id="closeContactWithCovidPatientYes" value="yes" onChange={(e) => {buildCovidDetails('closeContactWithCovidPatient', e.target.value)}} checked={patientContext?.patientDetails?.covidData?.covidDetails?.closeContactWithCovidPatient == 'yes'}/>
            <span className="optionListName" htmlFor="closeContactWithCovidPatientYes" >Yes</span>
          </div>
        </div>

        <div className='form-group mb-3 row g-0 w-100'>
          <label className="label d-block col-12">In the past 10 days, have you been tested for COVID-19?</label>
          <div className='optionList'>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={(e) => {buildCovidDetails('covidTest', e.target.value)}} id="inlineRadio1" value="no" checked={patientContext?.patientDetails?.covidData?.covidDetails?.covidTest == 'no'}/>
            <span className="optionListName" htmlFor="inlineRadio1">No, I have not been tested</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={(e) => {buildCovidDetails('covidTest', e.target.value)}}  id="inlineRadio2" value="yesTestedAndWaitingForResults" checked={patientContext?.patientDetails?.covidData?.covidDetails?.covidTest == 'yesTestedAndWaitingForResults'}/>
            <span className="optionListName" htmlFor="inlineRadio2">Yes, I have been tested and i am waiting for my results</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={(e) => {buildCovidDetails('covidTest', e.target.value)}}  id="inlineRadio3" value="positive" checked={patientContext?.patientDetails?.covidData?.covidDetails?.covidTest == 'positive'}/>
            <span className="optionListName" htmlFor="inlineRadio3">Yes, I tested positive</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="inlineRadioOptions" onChange={(e) => {buildCovidDetails('covidTest', e.target.value)}}  id="inlineRadio4" value="negative" checked={patientContext?.patientDetails?.covidData?.covidDetails?.covidTest == 'negative'}/>
            <span className="optionListName" htmlFor="inlineRadio2">Yes, I tested negative</span>
          </div>
               
          </div>
        </div>

        <div className='form-group mb-3'>
          <label className="label d-block">In the past 10 days, areyou experiencing any NEW symptom(s) listed below that is not due to another health problem? Please select all that apply:*</label>
        <div> <MultiSelect
        
            options={symptomsOptions}
            value={patientContext?.patientDetails?.covidData?.covidDetails?.pastSymptoms || []}
            onChange={(e) =>  {buildCovidDetails('pastSymptoms', e)}}
            labelledBy="Select"
          /></div> 
        </div>
      </div>
      <div className='singleButtondiv'>
      <button className='buttonDiv' onClick={() => generateDocs(1)}  disabled={isLoading || checkFormStep1}>{isLoading ? (<span class="spinner-border spinner-border-sm"></span>) :'Continue'}</button>
      </div>
     
      </>
    : formStep == 2 ? 
      <>
      <div className='mb-3' id='pdf-ref-2'>
        <div className='form-group mb-3'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Primary Language Spoken *</label>
          <label className='label'>Select the Patient's primary language spoken</label>  
          <select className="form-select" style={{borderRadius:"3px", color:"#808080", height:"46px"}} onChange={(e) => {buildPersonalDetails('spokenLanguage', e.target.value)}} aria-label="Default select example">
            <option selected disabled>Select</option>
            {languages.map((item, index) => { return(
              <option key={index} value={item.value} selected={patientContext?.patientDetails?.covidData?.personalDetails?.spokenLanguage == item.value}>{item.label}</option>
            ) })}
          </select>
        </div>
        <div className='form-group mb-3'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Race *</label>
          <label className='label'>Select the Patient's race(More than one option may be selected)</label>  
          <MultiSelect
            options={patientRaceOptions}
            value={patientContext?.patientDetails?.covidData?.personalDetails?.patientRace || []}
            onChange={(e)=>{buildPersonalDetails('patientRace', e)}}
            labelledBy="Select"
          />
        </div>
        <div className='form-group mb-3 row g-0 w-100'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Ethnicity *</label>
          <label className="label d-block col-12">What's the patient's ethnicity?</label>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="ethnicityRadio" onChange={(e) => {buildPersonalDetails('ethnicity', e.target.value)}} id="ethnicityRadio1" checked={patientContext?.patientDetails?.covidData?.personalDetails?.ethnicity == 'hispanicOrLatino'} value="hispanicOrLatino" />
            <span className="optionListName" htmlFor="ethnicityRadio1">Hispanic or Latino</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="ethnicityRadio" onChange={(e) => {buildPersonalDetails('ethnicity', e.target.value)}}  id="ethnicityRadio2" checked={patientContext?.patientDetails?.covidData?.personalDetails?.ethnicity == 'notHispanicOrLatino'} value="notHispanicOrLatino" />
            <span className="optionListName" htmlFor="ethnicityRadio2">Hispanic or Latino</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="ethnicityRadio" onChange={(e) => {buildPersonalDetails('ethnicity', e.target.value)}} id="ethnicityRadio3" checked={patientContext?.patientDetails?.covidData?.personalDetails?.ethnicity == 'declineToAnswer'} value="declineToAnswer" />
            <span className="optionListName" htmlFor="ethnicityRadio3">Decline to Answer</span>
          </div>
        </div>

        <div className='form-group mb-3 row g-0 w-100'>
          <label className='fw-bold  fw-bold mb-1 d-block'>MaritalStatus *</label>
          <label className="label d-block col-12">Select the patient's martial status</label>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="maritalRadio" onChange={(e) => {buildPersonalDetails('martialStatus', e.target.value)}} id="maritalRadio1"  value="single" checked={patientContext?.patientDetails?.covidData?.personalDetails?.martialStatus == 'single'} />
            <span className="optionListName" htmlFor="maritalRadio1">Single</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="maritalRadio" onChange={(e) => {buildPersonalDetails('martialStatus', e.target.value)}} id="maritalRadio2" value="married" checked={patientContext?.patientDetails?.covidData?.personalDetails?.martialStatus == 'married'} />
            <span className="optionListName" htmlFor="maritalRadio2">Married</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="maritalRadio" onChange={(e) => {buildPersonalDetails('martialStatus', e.target.value)}}  id="maritalRadio3" value="partner" checked={patientContext?.patientDetails?.covidData?.personalDetails?.martialStatus == 'partner'}/>
            <span className="optionListName" htmlFor="maritalRadio3">Partner</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="maritalRadio" onChange={(e) => {buildPersonalDetails('martialStatus', e.target.value)}}id="maritalRadio4" value="divorced" checked={patientContext?.patientDetails?.covidData?.personalDetails?.martialStatus == 'divorced'}/>
            <span className="optionListName" htmlFor="maritalRadio4">Divorced</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="maritalRadio" onChange={(e) => {buildPersonalDetails('martialStatus', e.target.value)}}  id="maritalRadio5" value="seprate" checked={patientContext?.patientDetails?.covidData?.personalDetails?.martialStatus == 'seprate'}/>
            <span className="optionListName" htmlFor="maritalRadio5">Seprate</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="maritalRadio" onChange={(e) => {buildPersonalDetails('martialStatus', e.target.value)}} id="maritalRadio6" value="widowed" checked={patientContext?.patientDetails?.covidData?.personalDetails?.martialStatus == 'widowed'}/>
            <span className="optionListName" htmlFor="maritalRadio6">windowed</span>
          </div>
        </div>
        
      </div>
        <div className='text-end'>
          <button className='buttonDiv' onClick={() => setFormStep(1)}> Back </button>
          <button className='buttonDiv nextButton' onClick={() => generateDocs(2)} disabled={checkFormStep2}>Continue</button>
        </div>
      </>
    :  formStep == 3 ? 
      <>
      <div className='mb-3' id='pdf-ref-3'>
         <div>
            <label className="label fw-bold d-block">Emergency Contact Name*</label>
            <label className="label d-block">Enter the name of an emergency contact person*</label>
            <input className='form-control' placeholder='name' value={patientContext?.patientDetails?.covidData?.emergencyContact?.name} type='text' onInput={(e) => buildEmergencyContact('name', e.target.value)} />
          </div>
          <div className='form-group mb-3 col-12'>
            <label className="label fw-bold d-block">Emergency Contact Mobile Phone Number*</label>
            <label className="label d-block">Enter the emergency contact's mobile phone number*</label>
            <input className='form-control' placeholder='Mobile Phone' value={patientContext?.patientDetails?.covidData?.emergencyContact?.mobilePhone} type='number' onInput={(e) => buildEmergencyContact('mobilePhone', e.target.value)} />
          </div>
          <div className='form-group mb-3 col-12'>
            <label className="label fw-bold d-block">Emergency Contact Phone Number*</label>
            <label className="label d-block">Enter the emergency contact's main phone number*</label>
            <input className='form-control' placeholder='Phone' type='number' value={patientContext?.patientDetails?.covidData?.emergencyContact?.phone} onInput={(e) => buildEmergencyContact('phone', e.target.value)} />
          </div>
          <div className='form-group mb-3 col-12'>
            <label className="label fw-bold d-block">Emergency Contact Relationship*</label>
            <label className="label d-block">Enter the name of an emergency contact person*</label>
            <select class="form-select" onChange={(e) => buildEmergencyContact('relationShip', e.target.value)} aria-label="Default select example">
              <option selected disabled>Select</option>
              {emergencyContactRelationShipOptions.map((item, index) =>  { 
                return(<option value={item.value} selected={patientContext?.patientDetails?.covidData?.emergencyContact?.relationShip == item.value}>{item.label}</option>)
              })}
            </select>
          </div>
          
      </div>
          <div className='text-end'>
            <button className='buttonDiv' onClick={() => setFormStep(2)} disabled={checkFormStep3}>Back</button>
            <button className='buttonDiv nextButton' onClick={() => generateDocs(3)} disabled={checkFormStep3}>Continue</button>
          </div>
      </>
    : formStep == 4 ?
      <>
      <div className='mb-3' id='pdf-ref-4'>
        <div className='form-group mb-3 w-100'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Medical Content Permission *</label>
          <label className="label d-block col-12">Is there someone we hae permission to contact or share medcial information with on the patient's behalf?</label>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="medicalContactRadio" onClick={(e) => {buildMedicalContact('medicalContactPermission', e.target.value)}} id="medicalContactRadio1" checked={patientContext?.patientDetails?.covidData?.medicalContact?.medicalContactPermission == 'yes'} value="yes" />
            <span className="optionListName" htmlFor="medicalContactRadio">Yes</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="medicalContactRadio" onClick={(e) => {buildMedicalContact('medicalContactPermission', e.target.value)}}  id="medicalContactRadio2" checked={patientContext?.patientDetails?.covidData?.medicalContact?.medicalContactPermission == 'no'} value="no" />
            <span className="optionListName" htmlFor="medicalContactRadio2">No</span>
          </div>
        </div>
        <div className='form-group mb-3'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Release of Information *</label>
          <label className='label'>The patient gives permission to the doctor and staff to release information to (enter name):</label>  
          <input className='form-control' value={patientContext?.patientDetails?.covidData?.medicalContact?.informationRelease} placeholder='Jack' onInput={(e) => {buildMedicalContact('informationRelease', e.target.value)}}/>
        </div>

        <div className='form-group mb-3 row g-0 w-100'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Relationship to First Individual *</label>
          <label className="label d-block col-12">Select the patient's relationShip to the first Individual to whom the doctor and staff have permission to release information</label>
              {firstIndividualRelationShipOptions.map((item, index) =>  { 
                return (
                  <div className="optionListDiv">
                    <input className="form-check-input" type="radio" name="firstIndividualRelationShip" onChange={(e) => {buildMedicalContact('firstIndividualRelationShip', e.target.value)}}  id={`firstIndividualRelationShip${index}`} value={item.value} checked={patientContext?.patientDetails?.covidData?.medicalContact?.firstIndividualRelationShip == item.value}/>
                    <span className="optionListName" htmlFor={`firstIndividualRelationShip${index}`}>{item.label}</span>
                  </div>
                )
              })}
        </div>
        <div className='form-group mb-3 w-100'>
          <label className='fw-bold  fw-bold mb-1 d-block'>Release of Information - Addtional Individuals *</label>
          <label className="label d-block col-12">Are there any other individuals who the patient gives permission to the doctor and staff to release information to</label>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="informationReleaseAdditionaltRadio" onChange={(e) => {buildMedicalContact('informationReleaseAdditional', e.target.value)}} id="informationReleaseAdditionalRadio1" checked={patientContext?.patientDetails?.covidData?.medicalContact?.informationReleaseAdditional == 'yes'} value="yes" />
            <span className="optionListName" htmlFor="informationReleaseAdditionalRadio1">Yes</span>
          </div>
          <div className="optionListDiv">
            <input className="form-check-input" type="radio" name="informationReleaseAdditionalRadio" onChange={(e) =>  {buildMedicalContact('informationReleaseAdditional', e.target.value)}}  id="informationReleaseAdditionalRadio2" checked={patientContext?.patientDetails?.covidData?.medicalContact?.informationReleaseAdditional == 'no'} value="no" />
            <span className="optionListName" htmlFor="informationReleaseAdditionalRadio2">No</span>
          </div>
        </div>
      </div>
        <div className='text-end'>
          <button className='buttonDiv' onClick={() => setFormStep(3)} disabled={checkFormStep4}>Back</button>
          <button className='buttonDiv nextButton' onClick={() => generateDocs(4)} disabled={checkFormStep4}>Continue</button>
        </div>
      </>
    : formStep == 5 ? 
      <>
      <div className='mb-3' id='pdf-ref-5'>
        <label className='fw-bold  fw-bold mb-1 d-block'>Release of Information</label>
        <label className="label d-block col-12">Please Confirm the sign below</label>
        <div className='noticeDiv'>
          <span >
          AUTHORIZATION TO RELEASE INFORMATION Your signature on this form authorizes The Doc's Here LLC and your designee(s) specified below to communicate (disclose) health information related to your care at The Doc's Here LLC. Disclosures to Friends and/or Family Members DO YOU WANT TO DESIGNATE A FAMILY MEMBER OR OTHER INDIVIDUAL WITH WHOM THE PROVIDER MAY DISCUSS YOUR MEDICAL CONDITION? IF YES, WHOM? I give permission for my Protected Health Information to be disclosed for purposes of communicating results, findings and care decisions to the family members and others listed below: Privacy Options I want NO ONE to receive my personal health information [X] I want the following person(s) BE ALLOWED to access my Personal health information: Tester Spouse / Partner This information about you is protected under federal law, and may be revoked/changed as noted above Please be advised, however, that any revocation/change will be effective only to the extent we have not already token action in reliance on your authorization By signing below, you recognize that the protected health information used or disclosed pursuant to this authorization may be subject to re-disclosure by the recipient of this disclosure and may no longer be protected under federal law. We will not condition treatment based on your authorization. You may refuse to sign the authorization. Patient Name: TEST TEST Date of Birth: 01/01/1990 Date: 09/21/2022
          </span>
        </div>
        <div className='form-group mb-3 w-100'>
          <div className="form-check form-check-inline ">
            <input className="form-check-input" type="radio" name="releaseOfInformaionAcceptance" onChange={(e) =>  {buildInformationRelease('acceptance', e.target.value)}} id="releaseOfInformaionAcceptanceRadio1" checked={patientContext?.patientDetails?.covidData?.informationRelease?.acceptance == 'accept'} value="accept" />
            <span className="optionListName" htmlFor="releaseOfInformaionAcceptanceRadio1">I Accept</span>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="releaseOfInformaionAcceptance" onChange={(e) =>  {buildInformationRelease('acceptance', e.target.value)}}  id="releaseOfInformaionAcceptanceRadio2" checked={patientContext?.patientDetails?.covidData?.informationRelease?.acceptance == 'decline'} value="decline" />
            <span className="optionListName" htmlFor="releaseOfInformaionAcceptanceRadio2">I Decline</span>
          </div>
        </div>
        <div className='form-group mb-3'>
          <label className='label'>Please enter your full name in the textbox below to accept the policy.</label>  
          <input className='form-control ' value={patientContext?.patientDetails?.covidData?.informationRelease?.fullname} placeholder='Jack' onInput={(e) =>  {buildInformationRelease('fullname', e.target.value)}}/>
        </div>
        <div className='form-group mb-3'>
          <div class="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="TermAndConditions" defaultChecked={patientContext?.patientDetails?.covidData?.informationRelease?.termAndConditions } onChange={(e) =>  {buildInformationRelease('termAndConditions', e.target.checked)}} />
            <span className="optionListName" htmlFor="TermAndConditions">I understand that by typing my name and clicking on 'continue', I am electronically signing this document</span>
          </div>
        </div>
      </div>
      <div className='text-end'>
        <button className='buttonDiv' onClick={() => setFormStep(4)}>Back</button>
        <button className='buttonDiv nextButton' onClick={() => {generateDocs(5)}} disabled={checkFormStep5 || isLoading}>{isLoading ? (<span class="spinner-border spinner-border-sm"></span>) :'Continue'}</button>
       </div>
      </>
    :
    ''
    }
      
   </div>
  )
}
