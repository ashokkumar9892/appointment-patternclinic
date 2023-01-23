import React from 'react'
import Navbarcomponent from './Navbar'
import "./common.css"
import "./FamilyForm.css"
import { useContext } from 'react'
import PatientContext from '../../context/patientDetails/patientContext'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import SignatureCanvas from "react-signature-canvas";
import html2canvas from 'html2canvas';
import moment from 'moment';
import jsPDF from 'jspdf';
import swal from "sweetalert";
import api from "../../api";

const peronsnalAndFamilyHistoryOptions = [
  'Lung cancer', 'Colon cancer/rectal cancer', 'Colon polyp', 'Breast cancer', 'Breast cancer', 'Ovarian cancer', 'Pancreatic cancer', 'Other cancer', 'Heart disease', 'Diabetes', 'Asthma', 'Eczema/psoriasis', 'Migraine headache', 'Seizure disorder', 'Stroke/TIA', 'High cholesterol', 'Abnormal bleeding (Bleeding disorder)', 'High or low white count', 'High blood pressure', 'Anemia', 'Liver disease', 'Hepatitis', 'Arthritis', 'Osteoporosis', 'Alcohol abuse', 'Recreational/street drug use', 'Sexually transmitted disease(s)', 'Depression', 'Other psychiatric/mental illness', 'Suicide (Or attempted suicide)', 'Tuberculosis (TB)', 'Anesthesia complications', 'Geneticdisorder', 'COPD/Emphysema', 'Allergies/AllergicreactionsSpecify', 'Other (Discuss with care provider)'
]

export default function FamilyForm(props) {
  const personalSignature = useRef({});
  const providerSignature = useRef({});
  const patientContext = useContext(PatientContext);
  const [isLoading, setIsLoading] = useState(false);
  const [checkFormStep1, setCheckFormStep1] = useState(true);
  const [checkFormStep2, setCheckFormStep2] = useState(true);
  const [checkFormStep3, setCheckFormStep3] = useState(false);
  const [checkFormStep4, setCheckFormStep4] = useState(true);
  const [multiStepForm, setMultiStepForm] = useState(1);
  const [patientProvidedInformation, setPatientProvidedInformation] = useState(patientContext?.patientDetails?.familyData?.patientProvidedInformation)
  const [pastMedicalHistory, setPastMedicalHistory] = useState(patientContext?.patientDetails?.familyData?.pastMedicalHistory)
  const [pastMedicalHistorycontinue, setPastMedicalHistoryContinue] = useState(patientContext?.patientDetails?.familyData?.pastMedicalHistorycontinue)
  const [pastMedicalHistorycontinuesecond, setPastMedicalHistoryContinueSecond] = useState(patientContext?.patientDetails?.familyData?.pastMedicalHistorycontinuesecond ?? {})
  const [personalAndFamilyHistory, setPersonalAndFamilyHistory] = useState(patientContext?.patientDetails?.familyData?.personalAndFamilyHistory)
  const [personalAndFamilyHistoryContinue, setPersonalAndFamilyHistoryContinue] = useState(patientContext?.patientDetails?.familyData?.personalAndFamilyHistoryContinue ?? {})
  const [providerUpdatesComments, setProviderUpdatesComments] = useState(patientContext?.patientDetails?.familyData?.providerUpdatesComments)
  const [stepCanvas, setStepCanvas] = useState({});
	const BASE_URL = process.env.REACT_APP_BASE_URL
		? process.env.REACT_APP_BASE_URL
		: "http://localhost:3001";
  const familyFormData = {
    patientProvidedInformation: patientProvidedInformation,
    pastMedicalHistory: pastMedicalHistory,
    pastMedicalHistorycontinue: pastMedicalHistorycontinue,
    personalAndFamilyHistory: personalAndFamilyHistory,
    pastMedicalHistorycontinuesecond: pastMedicalHistorycontinuesecond,
    personalAndFamilyHistoryContinue: personalAndFamilyHistoryContinue,
    providerUpdatesComments: providerUpdatesComments
  }

  const buildPatientProvidedInformation = (name, value) => {
    setPatientProvidedInformation((patientProvidedInformation) => ({ ...patientProvidedInformation, [name]: value }));
    updateContext();
  }

  const buildPastMedicalHistory = (name, value) => {
    setPastMedicalHistory((pastMedicalHistory) => ({ ...pastMedicalHistory, [name]: value }));
    updateContext();
  }
  const buildPastMedicalHistoryContinue = (name, value) => {
    setPastMedicalHistoryContinue((pastMedicalHistorycontinue) => ({ ...pastMedicalHistorycontinue, [name]: value }));
    updateContext();
  }

  const buildPastMedicalHistoryContinueSecond = (name, value) => {
    setPastMedicalHistoryContinueSecond((pastMedicalHistorycontinuesecond) => ({ ...pastMedicalHistorycontinuesecond, [name]: value }));
    updateContext();
  }

  const buildPersonalAndFamilyHistory = (name, value) => {
    setPersonalAndFamilyHistory((personalAndFamilyHistory) => ({ ...personalAndFamilyHistory, [name]: value }));
    updateContext();
  }
  const buildPersonalAndFamilyHistoryContinue = (name, value) => {
    setPersonalAndFamilyHistoryContinue((personalAndFamilyHistoryContinue) => ({ ...personalAndFamilyHistoryContinue, [name]: value }));
    updateContext();
  }

  const buildProviderUpdatesComments = (name, value) => {
    setProviderUpdatesComments((providerUpdatesComments) => ({ ...providerUpdatesComments, [name]: value }));
    updateContext();
  }







  const updateContext = () => {
    patientContext.update({
      ...patientContext.patientDetails,
      familyFormData,
    });
  }
  const checkragen = (bloodTransfusion, bloodtransfusionage) => {
    if (bloodTransfusion == "yes") {
      if (bloodtransfusionage !== undefined && bloodtransfusionage != "") {
        return (true)
      }
      else {
        return (false)

      }
    }
    else {
      return (true)
    }
  }

  const isFormStep1 = () => {
    if (
      patientProvidedInformation?.location !== undefined &&
      patientProvidedInformation?.location !== "" &&
      patientProvidedInformation?.date !== undefined &&
      patientProvidedInformation?.date !== "" &&
      patientProvidedInformation?.Gender !== undefined &&
      patientProvidedInformation?.Gender !== "" &&
      patientProvidedInformation?.DOB !== undefined &&
      patientProvidedInformation?.DOB !== "" &&
      pastMedicalHistory?.UnitedStatesorCanada !== undefined &&
      pastMedicalHistory?.UnitedStatesorCanada !== "" &&
      pastMedicalHistory?.bloodTransfusion !== undefined &&
      pastMedicalHistory?.bloodTransfusion !== "" &&
      checkragen(pastMedicalHistory?.bloodTransfusion, pastMedicalHistory?.bloodtransfusionage) &&
      // (pastMedicalHistory?.bloodTransfusion== "yes" && (pastMedicalHistory?.bloodtransfusionage !== undefined && pastMedicalHistory?.bloodtransfusionage!== "" ) )&& 
      pastMedicalHistory?.DOB !== undefined &&
      pastMedicalHistory?.DOB !== "" &&
      pastMedicalHistory?.Pneumococcal !== undefined &&
      pastMedicalHistory?.Pneumococcal !== "" &&
      pastMedicalHistory?.HepatitisA !== undefined &&
      pastMedicalHistory?.HepatitisA !== "" &&
      pastMedicalHistory?.HepatitisB !== undefined &&
      pastMedicalHistory?.HepatitisB !== "" &&
      pastMedicalHistory?.Measles !== undefined &&
      pastMedicalHistory?.Measles !== "" &&
      pastMedicalHistory?.Mumps !== undefined &&
      pastMedicalHistory?.Mumps !== "" &&
      pastMedicalHistory?.Rubella !== undefined &&
      pastMedicalHistory?.Rubella !== "" &&
      pastMedicalHistory?.Polio !== undefined &&
      pastMedicalHistory?.Polio !== "" &&
      pastMedicalHistory?.Varicella !== undefined &&
      pastMedicalHistory?.Varicella !== "" &&
      pastMedicalHistory?.Eyes !== undefined &&
      pastMedicalHistory?.Eyes !== "" &&
      pastMedicalHistory?.Eyescheck !== undefined &&
      pastMedicalHistory?.Eyescheck !== false &&
      pastMedicalHistory?.Eyestext !== undefined &&
      pastMedicalHistory?.Eyestext !== "" &&
      pastMedicalHistory?.Ears !== undefined &&
      pastMedicalHistory?.Ears !== "" &&
      pastMedicalHistory?.Earscheck !== undefined &&
      pastMedicalHistory?.Earscheck !== false &&
      pastMedicalHistory?.Earstext !== undefined &&
      pastMedicalHistory?.Earstext !== "" &&
      pastMedicalHistory?.Nose !== undefined &&
      pastMedicalHistory?.Nose !== "" &&
      pastMedicalHistory?.Nosecheck !== undefined &&
      pastMedicalHistory?.Nosecheck !== false &&
      pastMedicalHistory?.Nosetext !== undefined &&
      pastMedicalHistory?.Nosetext !== "" &&
      pastMedicalHistory?.Sinuses !== undefined &&
      pastMedicalHistory?.Sinuses !== "" &&
      pastMedicalHistory?.Sinusescheck !== undefined &&
      pastMedicalHistory?.Sinusescheck !== false &&
      pastMedicalHistory?.Sinusestext !== undefined &&
      pastMedicalHistory?.Sinusestext !== "" &&
      pastMedicalHistory?.Tonsils !== undefined &&
      pastMedicalHistory?.Tonsils !== "" &&
      pastMedicalHistory?.Tonsilscheck !== undefined &&
      pastMedicalHistory?.Tonsilscheck !== false &&
      pastMedicalHistory?.Tonsilstext !== undefined &&
      pastMedicalHistory?.Tonsilstext !== "" &&
      pastMedicalHistory?.Thyroidorparathyroid !== undefined &&
      pastMedicalHistory?.Thyroidorparathyroid !== "" &&
      pastMedicalHistory?.Thyroidorparathyroidcheck !== undefined &&
      pastMedicalHistory?.Thyroidorparathyroidcheck !== false &&
      pastMedicalHistory?.Thyroidorparathyroidtext !== undefined &&
      pastMedicalHistory?.Thyroidorparathyroidtext !== "" &&
      pastMedicalHistory?.Heartattack !== undefined &&
      pastMedicalHistory?.Heartattack !== "" &&
      pastMedicalHistory?.Heartattackcheck !== undefined &&
      pastMedicalHistory?.Heartattackcheck !== false &&
      pastMedicalHistory?.Heartattacktext !== undefined &&
      pastMedicalHistory?.Heartattacktext !== "" &&
      pastMedicalHistory?.Heartvalves !== undefined &&
      pastMedicalHistory?.Heartvalves !== "" &&
      pastMedicalHistory?.Heartvalvescheck !== undefined &&
      pastMedicalHistory?.Heartvalvescheck !== false &&
      pastMedicalHistory?.Heartvalvestext !== undefined &&
      pastMedicalHistory?.Heartvalvestext !== "" &&
      pastMedicalHistory?.Abnormalheartrhythm !== undefined &&
      pastMedicalHistory?.Abnormalheartrhythm !== "" &&
      pastMedicalHistory?.Abnormalheartrhythmcheck !== undefined &&
      pastMedicalHistory?.Abnormalheartrhythmcheck !== false &&
      pastMedicalHistory?.Abnormalheartrhythmtext !== undefined &&
      pastMedicalHistory?.Abnormalheartrhythmtext !== "" &&
      pastMedicalHistory?.Other !== undefined &&
      pastMedicalHistory?.Other !== "" &&
      pastMedicalHistory?.Othercheck !== undefined &&
      pastMedicalHistory?.Othercheck !== false &&
      pastMedicalHistory?.Othertext !== undefined &&
      pastMedicalHistory?.Othertext !== "" &&
      pastMedicalHistory?.Arteries !== undefined &&
      pastMedicalHistory?.Arteries !== "" &&
      pastMedicalHistory?.Arteriescheck !== undefined &&
      pastMedicalHistory?.Arteriescheck !== false &&
      pastMedicalHistory?.Arterieschecktext !== undefined &&
      pastMedicalHistory?.Arterieschecktext !== "" &&
      pastMedicalHistory?.Veinsorblood !== undefined &&
      pastMedicalHistory?.Veinsorblood !== "" &&
      pastMedicalHistory?.Veinsorbloodcheck !== undefined &&
      pastMedicalHistory?.Veinsorbloodcheck !== false &&
      pastMedicalHistory?.Veinsorbloodchecktext !== undefined &&
      pastMedicalHistory?.Veinsorbloodchecktext !== "" &&
      pastMedicalHistory?.Lungs !== undefined &&
      pastMedicalHistory?.Lungs !== "" &&
      pastMedicalHistory?.Lungscheck !== undefined &&
      pastMedicalHistory?.Lungscheck !== false &&
      pastMedicalHistory?.Lungschecktext !== undefined &&
      pastMedicalHistory?.Lungschecktext !== "" &&
      pastMedicalHistory?.Esophagus !== undefined &&
      pastMedicalHistory?.Esophagus !== "" &&
      pastMedicalHistory?.Esophaguscheck !== undefined &&
      pastMedicalHistory?.Esophaguscheck !== false &&
      pastMedicalHistory?.Esophaguschecktext !== undefined &&
      pastMedicalHistory?.Esophaguschecktext !== "" &&
      pastMedicalHistory?.Stomach !== undefined &&
      pastMedicalHistory?.Stomach !== "" &&
      pastMedicalHistory?.Stomachcheck !== undefined &&
      pastMedicalHistory?.Stomachcheck !== false &&
      pastMedicalHistory?.Stomachchecktext !== undefined &&
      pastMedicalHistory?.Stomachchecktext !== "" &&
      pastMedicalHistory?.Bowel !== undefined &&
      pastMedicalHistory?.Bowel !== "" &&
      pastMedicalHistory?.Bowelcheck !== undefined &&
      pastMedicalHistory?.Bowelcheck !== false &&
      pastMedicalHistory?.Bowelchecktext !== undefined &&
      pastMedicalHistory?.Bowelchecktext !== "" &&
      pastMedicalHistory?.Appendix !== undefined &&
      pastMedicalHistory?.Appendix !== "" &&
      pastMedicalHistory?.Appendixcheck !== undefined &&
      pastMedicalHistory?.Appendixcheck !== false &&
      pastMedicalHistory?.Appendixchecktext !== undefined &&
      pastMedicalHistory?.Appendixchecktext !== "" &&
      pastMedicalHistory?.Lymphnodes !== undefined &&
      pastMedicalHistory?.Lymphnodes !== "" &&
      pastMedicalHistory?.Lymphnodescheck !== undefined &&
      pastMedicalHistory?.Lymphnodescheck !== false &&
      pastMedicalHistory?.Lymphnodeschecktext !== undefined &&
      pastMedicalHistory?.Lymphnodeschecktext !== "" &&
      pastMedicalHistory?.Spleen !== undefined &&
      pastMedicalHistory?.Spleen !== "" &&
      pastMedicalHistory?.Spleencheck !== undefined &&
      pastMedicalHistory?.Spleencheck !== false &&
      pastMedicalHistory?.Spleenchecktext !== undefined &&
      pastMedicalHistory?.Spleenchecktext !== "" &&
      pastMedicalHistory?.Liver !== undefined &&
      pastMedicalHistory?.Liver !== "" &&
      pastMedicalHistory?.Livercheck !== undefined &&
      pastMedicalHistory?.Livercheck !== false &&
      pastMedicalHistory?.Liverchecktext !== undefined &&
      pastMedicalHistory?.Liverchecktext !== "" &&
      pastMedicalHistory?.Gallbladder !== undefined &&
      pastMedicalHistory?.Gallbladder !== "" &&
      pastMedicalHistory?.Gallbladdercheck !== undefined &&
      pastMedicalHistory?.Gallbladdercheck !== false &&
      pastMedicalHistory?.Gallbladderchecktext !== undefined &&
      pastMedicalHistory?.Gallbladderchecktext !== "" &&
      pastMedicalHistory?.Pancreas !== undefined &&
      pastMedicalHistory?.Pancreas !== "" &&
      pastMedicalHistory?.Pancreascheck !== undefined &&
      pastMedicalHistory?.Pancreascheck !== false &&
      pastMedicalHistory?.Pancreaschecktext !== undefined &&
      pastMedicalHistory?.Pancreaschecktext !== "" &&
      pastMedicalHistory?.Hernia !== undefined &&
      pastMedicalHistory?.Hernia !== "" &&
      pastMedicalHistory?.Herniacheck !== undefined &&
      pastMedicalHistory?.Herniacheck !== false &&
      pastMedicalHistory?.Herniachecktext !== undefined &&
      pastMedicalHistory?.Herniachecktext !== "" &&
      pastMedicalHistory?.Kidneys !== undefined &&
      pastMedicalHistory?.Kidneys !== "" &&
      pastMedicalHistory?.Kidneyscheck !== undefined &&
      pastMedicalHistory?.Kidneyscheck !== false &&
      pastMedicalHistory?.Kidneyschecktext !== undefined &&
      pastMedicalHistory?.Kidneyschecktext !== "" &&
      pastMedicalHistory?.Bladder !== undefined &&
      pastMedicalHistory?.Bladder !== "" &&
      pastMedicalHistory?.Bladdercheck !== undefined &&
      pastMedicalHistory?.Bladdercheck !== false &&
      pastMedicalHistory?.Bladderchecktext !== undefined &&
      pastMedicalHistory?.Bladderchecktext !== "" &&
      pastMedicalHistory?.Bones !== undefined &&
      pastMedicalHistory?.Bones !== "" &&
      pastMedicalHistory?.Bonescheck !== undefined &&
      pastMedicalHistory?.Bonescheck !== false &&
      pastMedicalHistory?.Boneschecktext !== undefined &&
      pastMedicalHistory?.Boneschecktext !== ""

    ) {
      setCheckFormStep1(false);
    } else {
      setCheckFormStep1(true);
    }
  };
  const agecheck = (name, age, cong) => {
    if (name == 'deceased') {
      if (age !== undefined && age != "" && cong != undefined && cong != "") {
        return (true)
      }
      else {
        return (false)
      }
    }
    else {
      return (true)
    }
  }

  const isFormStep2 = () => {
    if (
      pastMedicalHistorycontinue?.Joints !== undefined &&
      pastMedicalHistorycontinue?.Joints !== "" &&
      pastMedicalHistorycontinue?.Jointscheck !== undefined &&
      pastMedicalHistorycontinue?.Jointscheck !== false &&
      pastMedicalHistorycontinue?.Jointschecktext !== undefined &&
      pastMedicalHistorycontinue?.Jointschecktext !== "" &&
      pastMedicalHistorycontinue?.Muscles !== undefined &&
      pastMedicalHistorycontinue?.Muscles !== "" &&
      pastMedicalHistorycontinue?.Musclescheck !== undefined &&
      pastMedicalHistorycontinue?.Musclescheck !== false &&
      pastMedicalHistorycontinue?.Muscleschecktext !== undefined &&
      pastMedicalHistorycontinue?.Muscleschecktext !== false &&
      pastMedicalHistorycontinue?.Back !== undefined &&
      pastMedicalHistorycontinue?.Back !== "" &&
      pastMedicalHistorycontinue?.Backcheck !== undefined &&
      pastMedicalHistorycontinue?.Backcheck !== false &&
      pastMedicalHistorycontinue?.Backchecktext !== undefined &&
      pastMedicalHistorycontinue?.Backchecktext.length > 0 &&
      pastMedicalHistorycontinue?.Uterus !== undefined &&
      pastMedicalHistorycontinue?.Uterus !== "" &&
      pastMedicalHistorycontinue?.Uteruscheck !== undefined &&
      pastMedicalHistorycontinue?.Uteruscheck !== false &&
      pastMedicalHistorycontinue?.Uteruschecktext !== undefined &&
      pastMedicalHistorycontinue?.Uteruschecktext !== "" &&
      pastMedicalHistorycontinue?.Ovaries !== undefined &&
      pastMedicalHistorycontinue?.Ovaries !== "" &&
      pastMedicalHistorycontinue?.Ovariescheck !== undefined &&
      pastMedicalHistorycontinue?.Ovariescheck !== false &&
      pastMedicalHistorycontinue?.Ovarieschecktext !== undefined &&
      pastMedicalHistorycontinue?.Ovarieschecktext !== "" &&
      pastMedicalHistorycontinue?.Fallopiantubes !== undefined &&
      pastMedicalHistorycontinue?.Fallopiantubes !== "" &&
      pastMedicalHistorycontinue?.Fallopiantubescheck !== undefined &&
      pastMedicalHistorycontinue?.Fallopiantubescheck !== "" &&
      pastMedicalHistorycontinue?.Fallopiantubeschecktext !== undefined &&
      pastMedicalHistorycontinue?.Fallopiantubeschecktext !== "" &&
      pastMedicalHistorycontinue?.Hysterectomy !== undefined &&
      pastMedicalHistorycontinue?.Hysterectomy !== "" &&
      pastMedicalHistorycontinue?.Hysterectomycheck !== undefined &&
      pastMedicalHistorycontinue?.Hysterectomycheck !== false &&
      pastMedicalHistorycontinue?.Hysterectomychecktext !== undefined &&
      pastMedicalHistorycontinue?.Hysterectomychecktext !== "" &&
      pastMedicalHistorycontinue?.Other !== undefined &&
      pastMedicalHistorycontinue?.Other !== "" &&
      pastMedicalHistorycontinue?.Othercheck !== undefined &&
      pastMedicalHistorycontinue?.Othercheck !== false &&
      pastMedicalHistorycontinue?.Otherchecktext !== undefined &&
      pastMedicalHistorycontinue?.Otherchecktext !== "" &&
      pastMedicalHistorycontinue?.Othernew !== undefined &&
      pastMedicalHistorycontinue?.Othernew !== "" &&
      pastMedicalHistorycontinue?.Othernewcheck !== undefined &&
      pastMedicalHistorycontinue?.Othernewcheck !== false &&
      pastMedicalHistorycontinue?.Othernewchecktext !== undefined &&
      pastMedicalHistorycontinue?.Othernewchecktext !== "" &&
      pastMedicalHistorycontinue?.Spine !== undefined &&
      pastMedicalHistorycontinue?.Spine !== "" &&
      pastMedicalHistorycontinue?.Spinecheck !== undefined &&
      pastMedicalHistorycontinue?.Spinecheck !== false &&
      pastMedicalHistorycontinue?.Spinechecktext !== undefined &&
      pastMedicalHistorycontinue?.Spinechecktext !== "" &&
      pastMedicalHistorycontinue?.Brain !== undefined &&
      pastMedicalHistorycontinue?.Brain !== "" &&
      pastMedicalHistorycontinue?.Braincheck !== undefined &&
      pastMedicalHistorycontinue?.Braincheck !== false &&
      pastMedicalHistorycontinue?.Brainchecktext !== undefined &&
      pastMedicalHistorycontinue?.Brainchecktext !== "" &&
      pastMedicalHistorycontinue?.Skin !== undefined &&
      pastMedicalHistorycontinue?.Skin !== "" &&
      pastMedicalHistorycontinue?.Skincheck !== undefined &&
      pastMedicalHistorycontinue?.Skincheck !== false &&
      pastMedicalHistorycontinue?.Skinchecktext !== undefined &&
      pastMedicalHistorycontinue?.Skinchecktext !== "" &&
      pastMedicalHistorycontinue?.Breasts !== undefined &&
      pastMedicalHistorycontinue?.Breasts !== "" &&
      pastMedicalHistorycontinue?.Breastscheck !== undefined &&
      pastMedicalHistorycontinue?.Breastscheck !== false &&
      pastMedicalHistorycontinue?.Breastschecktext !== undefined &&
      pastMedicalHistorycontinue?.Breastschecktext !== "" &&
      pastMedicalHistorycontinue?.Prostate !== undefined &&
      pastMedicalHistorycontinue?.Prostate !== "" &&
      pastMedicalHistorycontinue?.Prostatecheck !== undefined &&
      pastMedicalHistorycontinue?.Prostatecheck !== false &&
      pastMedicalHistorycontinue?.Prostatechecktext !== undefined &&
      pastMedicalHistorycontinue?.Prostatechecktext !== "" &&
      pastMedicalHistorycontinue?.Penis !== undefined &&
      pastMedicalHistorycontinue?.Penis !== "" &&
      pastMedicalHistorycontinue?.Penischeck !== undefined &&
      pastMedicalHistorycontinue?.Penischeck !== false &&
      pastMedicalHistorycontinue?.Penischecktext !== undefined &&
      pastMedicalHistorycontinue?.Penischecktext !== "" &&
      pastMedicalHistorycontinue?.Testicles !== undefined &&
      pastMedicalHistorycontinue?.Testicles !== "" &&
      pastMedicalHistorycontinue?.Testiclescheck !== undefined &&
      pastMedicalHistorycontinue?.Testiclescheck !== false &&
      pastMedicalHistorycontinue?.Testicleschecktext !== undefined &&
      pastMedicalHistorycontinue?.Testicleschecktext !== "" &&
      pastMedicalHistorycontinue?.Vasectomy !== undefined &&
      pastMedicalHistorycontinue?.Vasectomy !== "" &&
      pastMedicalHistorycontinue?.Vasectomychck !== undefined &&
      pastMedicalHistorycontinue?.Vasectomychck !== false &&
      pastMedicalHistorycontinue?.Vasectomychcktext !== undefined &&
      pastMedicalHistorycontinue?.Vasectomychcktext !== "" &&
      pastMedicalHistorycontinue?.None !== undefined &&
      pastMedicalHistorycontinue?.None !== false &&
      pastMedicalHistorycontinue?.Nonetext !== undefined &&
      pastMedicalHistorycontinue?.Nonetext !== "" &&
      pastMedicalHistorycontinue?.otherSurgeries !== undefined &&
      pastMedicalHistorycontinue?.otherSurgeries !== "" &&
      personalAndFamilyHistory?.brothernumberalive !== undefined &&
      personalAndFamilyHistory?.brothernumberalive !== "" &&
      personalAndFamilyHistory?.brotherNumberofdeceased !== undefined &&
      personalAndFamilyHistory?.brotherNumberofdeceased !== "" &&
      personalAndFamilyHistory?.sisternumberalive !== undefined &&
      personalAndFamilyHistory?.sisternumberalive !== "" &&
      personalAndFamilyHistory?.sisternumberofdeceased !== undefined &&
      personalAndFamilyHistory?.sisternumberofdeceased !== "" &&
      personalAndFamilyHistory?.sonnumberalive !== undefined &&
      personalAndFamilyHistory?.sonnumberalive !== "" &&
      personalAndFamilyHistory?.sonNumberofdeceased !== undefined &&
      personalAndFamilyHistory?.sonNumberofdeceased !== "" &&
      personalAndFamilyHistory?.Daughternumberalive !== undefined &&
      personalAndFamilyHistory?.Daughternumberalive !== "" &&
      personalAndFamilyHistory?.Daughternumofdeceased !== undefined &&
      personalAndFamilyHistory?.Daughternumofdeceased !== "" &&
      personalAndFamilyHistory?.father !== undefined &&
      personalAndFamilyHistory?.father !== "" &&
      agecheck(personalAndFamilyHistory?.father, personalAndFamilyHistory?.fatherAgeatdeath, personalAndFamilyHistory?.fatherCauseofdeath) &&
      personalAndFamilyHistory?.mother !== undefined &&
      personalAndFamilyHistory?.mother !== "" &&
      agecheck(personalAndFamilyHistory?.mother, personalAndFamilyHistory?.motherAgeatdeath, personalAndFamilyHistory?.motherCauseofdeath)

    ) {
      setCheckFormStep2(false);
    } else {
      setCheckFormStep2(true);
    }
  };


  const setArrfunction = (Historycontinue, item) => {
    if (Historycontinue && item in Historycontinue) {
      return (Historycontinue[item])
    }
    else {
      return ([false, false, false, false, false, false, false, false, false])
    }
  }

  const CheckedFunvtion = (Historycontinuesecond, item, index) => {
    if (Historycontinuesecond && item in Historycontinuesecond) {
      return (Historycontinuesecond[item][index])
    }
  }

  const isFormStep3 = () => {
    let count = 0;
    peronsnalAndFamilyHistoryOptions.map((item, index) => {
      if (pastMedicalHistorycontinuesecond && item in pastMedicalHistorycontinuesecond) {
        if (pastMedicalHistorycontinuesecond[item].includes(true)) {
          count++
        }
        else {
          setCheckFormStep3(true)

        }

      }
      else {
        setCheckFormStep3(true)
      }
    })

    if (count >= peronsnalAndFamilyHistoryOptions.length) {
      setCheckFormStep3(false)
    }
  }

  const isFormStep4 = () => {
    if (
      providerUpdatesComments?.SignatureofProvider !== undefined &&
      providerUpdatesComments?.SignatureofProvider !== "" &&
      providerUpdatesComments?.SignatureofProvider !== undefined &&
      providerUpdatesComments?.SignatureofProvider !== "" &&
      providerUpdatesComments?.date !== undefined &&
      providerUpdatesComments?.date !== "" &&
      providerUpdatesComments?.ReviewedUpdated !== undefined &&
      providerUpdatesComments?.ReviewedUpdated !== "" &&
      providerUpdatesComments?.RelationshiptoPatient !== undefined &&
      providerUpdatesComments?.RelationshiptoPatient !== ""
    ) {
      setCheckFormStep4(false);
    } else {
      setCheckFormStep4(true);
    }
  }

  useEffect(() => {
    isFormStep1();
    isFormStep2();
    isFormStep3();
    isFormStep4();
  })
  useEffect(() => {
    updateContext();
  }, [patientProvidedInformation, pastMedicalHistory])

  useEffect(() => {
    window.gtag("event", "conversion", {
      send_to: "AW-774469977/9IDQCMrBpoEYENnypfEC",
    });
  }, []);

  const generateDocs = (step) => {
    html2canvas(document.getElementById(`pdf-ref3-${step}`)).then(async res => {
      const canvasData = { ...stepCanvas, [step]: res };
      setStepCanvas(canvasData);
      if(step === 4) {
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
        setMultiStepForm(step + 1);
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
    formData.append('originalfilename', 'Family Form')
    formData.append('priority', '1')
    formData.append('providerid', '1')
    let request = {
      url: `${BASE_URL}//v1/24451/patients/${props.patientid}/documents/admin`,
      data: formData,
    };
    api
      .postAuth(request)
      .then((res) => {
        swal("Family form successfully submitted", "success");
        setMultiStepForm(5);
        props.complete()
      })
      .catch((error) => {
      })
      .finally(() => { setIsLoading(false); props.complete(); });
  };

  return (
    <div >
      <div className=" my-5 ">
        <div className='h2 fw-bold  text-black mt-3'>Patient/Family History</div>
        <div className=''>
          {multiStepForm == 1 ? (
            <>
              <div id="pdf-ref3-1" className="mb-3">
                <div className="fw-bold h4 text-black">PATIENT PROVIDED INFORMATION</div>
                <div className='form-group mb-5 row g-0'>
                  <div className='form-group mb-3 row g-0'>
                    <label className="label d-block ">Location</label>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.location == "mankato"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("location", e.target.value);
                        }}
                        name="location" id="inlineRadio3" value="mankato" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Mankato</label>
                    </div>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.location == "fairmont"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("location", e.target.value);
                        }}
                        name="location" id="inlineRadio4" value="fairmont" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Fairmont</label>
                    </div>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.location == "newPrague"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("location", e.target.value);
                        }}
                        name="location" id="inlineRadio5" value="newPrague" />
                      <label className="form-check-label" htmlFor="inlineRadio1">New Prague</label>
                    </div>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.location == "springfield"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("location", e.target.value);
                        }}
                        name="location" id="inlineRadio6" value="springfield" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Springfield</label>
                    </div>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.location == "stJames"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("location", e.target.value);
                        }}
                        name="location" id="inlineRadio7" value="stJames" />
                      <label className="form-check-label" htmlFor="inlineRadio1">St. James</label>
                    </div>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.location == "waseca"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("location", e.target.value);
                        }}
                        name="location" id="inlineRadio8" value="waseca" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Waseca</label>
                    </div>
                  </div>
                  <div className="row col-md-6 align-items-center mb-3">
                    <label
                      htmlFor="staticEmail"
                      className="col-sm-6 label col-form-label px-0 py-0"
                    >
                      Date:
                    </label>
                    <div className="col-sm-6 px-0">
                      <input
                        type="date"
                        className="form-control mb-1"
                        id="staticEmail"
                        value={patientProvidedInformation?.date}
                        onInput={(e) => {
                          buildPatientProvidedInformation("date", e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className='row g-0'>
                    <label className="label  col-md-3 ">Gender </label>
                    <div className="form-check form-check col-md-2 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.Gender == "male"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("Gender", e.target.value);
                        }}
                        name="gender" id="inlineRadio3" value="male" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                    </div>
                    <div className="form-check form-check col-md-2 col-12">
                      <input className="form-check-input" type="radio"
                        checked={patientProvidedInformation?.Gender == "female"}
                        onChange={(e) => {
                          buildPatientProvidedInformation("Gender", e.target.value);
                        }}
                        name="gender" id="inlineRadio4" value="female" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Female</label>
                    </div>
                  </div>

                  <div className="row col-md-6 align-items-center my-3">
                    <label htmlFor="staticEmail" className="col-sm-6 label col-form-label px-0 py-0" > DOB  </label>
                    <div className="col-sm-6 px-0">
                      <input type="date" className="form-control mb-1"
                        value={patientProvidedInformation?.DOB}
                        onInput={(e) => {
                          buildPatientProvidedInformation("DOB", e.target.value);
                        }}
                        id="staticEmail" />
                    </div>
                  </div>
                </div>

                <div className="fw-bold h4 text-black">Past Medical History</div>
                <div className='form-group mb-5 row g-0'>
                  <div className="row col-md-6 align-items-center mb-3">
                    <label htmlFor="staticEmail" className="col-sm-6 label mb-0 col-form-label px-0 py-0" > Date </label>
                    <div className="col-sm-6 px-0">
                      <input type="date" className="form-control mb-1" id="staticEmail" />
                    </div>
                  </div>

                  <div className='row g-0 mb-2'>
                    <label className="label  d-block">Have you ever traveled or lived outside of the United States or Canada?</label>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        checked={pastMedicalHistory?.UnitedStatesorCanada == "doNotKnow"}
                        onChange={(e) => {
                          console.log("check hereee")
                          buildPastMedicalHistory("UnitedStatesorCanada", e.target.value);
                        }}
                        name="UnitedStatesorCanada" id="inlineRadio8" value="doNotKnow" />
                      <label className="form-check-label" htmlFor="inlineRadio8">Do not know</label>
                    </div>
                    <div className="form-check form-check col-md-2 col-12">
                      <input className="form-check-input" type="radio"
                        checked={pastMedicalHistory?.UnitedStatesorCanada == "no"}
                        onChange={(e) => {
                          buildPastMedicalHistory("UnitedStatesorCanada", e.target.value);
                        }}
                        name="UnitedStatesorCanada" id="inlineRadio9" value="no" />
                      <label className="form-check-label" htmlFor="inlineRadio9">No</label>
                    </div>
                    <div className="form-check form-check col-md-5 col-12">
                      <input className="form-check-input" type="radio"
                        checked={pastMedicalHistory?.UnitedStatesorCanada == "yes"}
                        onChange={(e) => {
                          buildPastMedicalHistory("UnitedStatesorCanada", e.target.value);
                        }}
                        name="UnitedStatesorCanada" id="inlineRadio10" value="yes" />
                      <label className="form-check-label" htmlFor="inlineRadio10">Yes</label>
                    </div>
                  </div>

                  <div className='row g-0'>
                    <label className="label  d-block">Have you ever received a blood transfusion? </label>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        name="transfusion" checked={pastMedicalHistory?.bloodTransfusion == 'doNotKnow'} onChange={(e) => { buildPastMedicalHistory('bloodTransfusion', e.target.value) }} id="inlineRadio8" value="doNotKnow" />
                      <label className="form-check-label" htmlFor="inlineRadio8">Do not know</label>
                    </div>
                    <div className="form-check form-check col-md-2 col-12">
                      <input className="form-check-input" type="radio"
                        name="transfusion" checked={pastMedicalHistory?.bloodTransfusion == 'no'} onChange={(e) => { buildPastMedicalHistory('bloodTransfusion', e.target.value) }} id="inlineRadio9" value="no" />
                      <label className="form-check-label" htmlFor="inlineRadio9">No</label>
                    </div>
                    <div className="form-check form-check col-md-5 col-12">
                      <input className="form-check-input" type="radio"
                        name="transfusion" onChange={(e) => { buildPastMedicalHistory('bloodTransfusion', e.target.value) }} checked={pastMedicalHistory?.bloodTransfusion == "yes"} id="inlineRadio10" value="yes" />
                      <label className="form-check-label" htmlFor="inlineRadio10">Yes (If yes, check all that apply.)</label>
                    </div>
                  </div>

                  {pastMedicalHistory?.bloodTransfusion && pastMedicalHistory?.bloodTransfusion == "yes" &&
                    <div className='row g-0'>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          checked={pastMedicalHistory?.bloodtransfusionage == "before1980"}
                          onChange={(e) => {
                            buildPastMedicalHistory("bloodtransfusionage", e.target.value);
                          }}
                          name="bloodtransfusionage" id="inlineRadio88" value="before1980" />
                        <label className="form-check-label" htmlFor="inlineRadio8">Before 1980 </label>
                      </div>
                      <div className="form-check form-check col-md-2 col-12">
                        <input className="form-check-input" type="radio"
                          checked={pastMedicalHistory?.bloodtransfusionage == "1980-1990"}
                          onChange={(e) => {
                            buildPastMedicalHistory("bloodtransfusionage", e.target.value);
                          }}
                          name="bloodtransfusionage" id="inlineRadio955" value="1980-1990" />
                        <label className="form-check-label" htmlFor="inlineRadio9">1980-1990</label>
                      </div>
                      <div className="form-check form-check col-md-5 col-12">
                        <input className="form-check-input" type="radio"
                          checked={pastMedicalHistory?.bloodtransfusionage == "after1990"}
                          onChange={(e) => {
                            buildPastMedicalHistory("bloodtransfusionage", e.target.value);
                          }}
                          name="bloodtransfusionage" id="inlineRadio104454" value="after1990" />
                        <label className="form-check-label" htmlFor="inlineRadio10">After 1990</label>
                      </div>
                    </div>
                  }

                  <div className="row col-md-6 align-items-center my-3">
                    <label htmlFor="staticEmail" className="col-sm-6 mb-0 label col-form-label px-0 py-0" > DOB  </label>
                    <div className="col-sm-6 px-0">
                      <input type="date" className="form-control mb-1"
                        value={pastMedicalHistory?.DOB}
                        onInput={(e) => {
                          buildPastMedicalHistory("DOB", e.target.value);
                        }}
                        id="staticEmail" />
                    </div>
                  </div>
                </div>

                <div className='row g-0 mb-3'>
                  <label className="label  d-block "> Have you received the following immunizations and/or had the disease?</label>
                  <label className="label  d-block">Pneumococcal (For pneumonia)</label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Pneumococcal == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Pneumococcal", e.target.value);
                      }}
                      name="pneumonia" id="pneumonia1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="pneumonia1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Pneumococcal == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Pneumococcal", e.target.value);
                      }}
                      name="pneumonia" id="pneumonia2" value="no" />
                    <label className="form-check-label" htmlFor="pneumonia2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Pneumococcal == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Pneumococcal", e.target.value);
                      }}
                      name="pneumonia" id="pneumonia3" value="yes" />
                    <label className="form-check-label" htmlFor="pneumonia3">Yes</label>
                  </div>

                  <label className="label  d-block">Hepatitis A </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.HepatitisA == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("HepatitisA", e.target.value);
                      }}
                      name="hepatitis" id="hepatitisA1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="hepatitis1A">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.HepatitisA == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("HepatitisA", e.target.value);
                      }}
                      name="hepatitis" id="hepatitisA2" value="no" />
                    <label className="form-check-label" htmlFor="hepatitis2A">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.HepatitisA == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("HepatitisA", e.target.value);
                      }}
                      name="hepatitis" id="hepatitisA3" value="yes" />
                    <label className="form-check-label" htmlFor="hepatitis3A">Yes</label>
                  </div>

                  <label className="label  d-block">Hepatitis B </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.HepatitisB == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("HepatitisB", e.target.value);
                      }}
                      name="hepatitisB" id="hepatitisB1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="hepatitisB1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.HepatitisB == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("HepatitisB", e.target.value);
                      }}
                      name="hepatitisB" id="hepatitisB2" value="no" />
                    <label className="form-check-label" htmlFor="hepatitisB2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.HepatitisB == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("HepatitisB", e.target.value);
                      }}
                      name="hepatitisB" id="hepatitisB3" value="yes" />
                    <label className="form-check-label" htmlFor="hepatitisB3">Yes</label>
                  </div>

                  <label className="label  d-block">Measles </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Measles == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Measles", e.target.value);
                      }}
                      name="measles" id="measles1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="measles1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Measles == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Measles", e.target.value);
                      }}
                      name="measles" id="measles2" value="no" />
                    <label className="form-check-label" htmlFor="measles2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Measles == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Measles", e.target.value);
                      }}
                      name="measles" id="measles3" value="yes" />
                    <label className="form-check-label" htmlFor="measles3">Yes</label>
                  </div>

                  <label className="label  d-block">Mumps </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Mumps == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Mumps", e.target.value);
                      }}
                      name="mumps" id="mumps1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="mumps1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Mumps == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Mumps", e.target.value);
                      }}
                      name="mumps" id="mumps2" value="no" />
                    <label className="form-check-label" htmlFor="mumps2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Mumps == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Mumps", e.target.value);
                      }}
                      name="mumps" id="mumps3" value="yes" />
                    <label className="form-check-label" htmlFor="mumps3">Yes</label>
                  </div>

                  <label className="label  d-block">Rubella </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Rubella == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Rubella", e.target.value);
                      }}
                      name="rubella" id="rubella1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="rubella1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Rubella == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Rubella", e.target.value);
                      }}
                      name="rubella" id="rubella2" value="no" />
                    <label className="form-check-label" htmlFor="rubella2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Rubella == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Rubella", e.target.value);
                      }}
                      name="rubella" id="rubella3" value="yes" />
                    <label className="form-check-label" htmlFor="rubella13">Yes</label>
                  </div>

                  <label className="label  d-block">Polio </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Polio == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Polio", e.target.value);
                      }}
                      name="polio" id="polio1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="polio1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Polio == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Polio", e.target.value);
                      }}
                      name="polio" id="polio2" value="no" />
                    <label className="form-check-label" htmlFor="polio2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Polio == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Polio", e.target.value);
                      }}
                      name="polio" id="polio3" value="yes" />
                    <label className="form-check-label" htmlFor="polio3">Yes</label>
                  </div>

                  <label className="label  d-block">Varicella (For chicken pox) </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Varicella == "doNotKnow"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Varicella", e.target.value);
                      }}
                      name="varicella" id="varicella1" value="doNotKnow" />
                    <label className="form-check-label" htmlFor="varicella1">Do not know</label>
                  </div>
                  <div className="form-check form-check col-md-2 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Varicella == "no"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Varicella", e.target.value);
                      }}
                      name="varicella" id="varicella2" value="no" />
                    <label className="form-check-label" htmlFor="varicella2">No</label>
                  </div>
                  <div className="form-check form-check col-md-5 col-12">
                    <input className="form-check-input" type="radio"
                      checked={pastMedicalHistory?.Varicella == "yes"}
                      onChange={(e) => {
                        buildPastMedicalHistory("Varicella", e.target.value);
                      }}
                      name="varicella" id="varicella3" value="yes" />
                    <label className="form-check-label" htmlFor="varicella3">Yes</label>
                  </div>

                </div>

                <div className='row g-0 mb-3'>
                  <label className='d-block label'> Indicate whether you have ever had a medical problem or surgery related to each of the following. Check all that apply</label>
                  <div className="form-group  row mb-2">
                    <div className="row col-12 align-items-center">
                      <label className='d-block label col-md-8'>Medical Problem </label>
                      <label className='d-block label col-md-4'>Surgery/Year</label>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Eyes </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Eyes}
                          onInput={(e) => {
                            buildPastMedicalHistory("Eyes", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Eyescheck}
                          onChange={(e) => { buildPastMedicalHistory('Eyescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Eyestext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Eyestext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Ears </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Ears}
                          onInput={(e) => {
                            buildPastMedicalHistory("Ears", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Earscheck}
                          onChange={(e) => { buildPastMedicalHistory('Earscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Earstext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Earstext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Nose </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Nose}
                          onInput={(e) => {
                            buildPastMedicalHistory("Nose", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Nosecheck}
                          onChange={(e) => { buildPastMedicalHistory('Nosecheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Nosetext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Nosetext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Sinuses </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Sinuses}
                          onInput={(e) => {
                            buildPastMedicalHistory("Sinuses", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Sinusescheck}
                          onChange={(e) => { buildPastMedicalHistory('Sinusescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Sinusestext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Sinusestext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Tonsils </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Tonsils}
                          onInput={(e) => {
                            buildPastMedicalHistory("Tonsils", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Tonsilscheck}
                          onChange={(e) => { buildPastMedicalHistory('Tonsilscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Tonsilstext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Tonsilstext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-6 col-form-label py-0" > Thyroid or parathyroid gland </label>
                      <div className="col-sm-6 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Thyroidorparathyroid}
                          onInput={(e) => {
                            buildPastMedicalHistory("Thyroidorparathyroid", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Thyroidorparathyroidcheck}
                          onChange={(e) => { buildPastMedicalHistory('Thyroidorparathyroidcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Thyroidorparathyroidtext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Thyroidorparathyroidtext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label className=" w-100 d-block  my-2 label" > Heart problems </label>
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" > Heart attack </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Heartattack}
                          onInput={(e) => {
                            buildPastMedicalHistory("Heartattack", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-end">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Heartattackcheck}
                          onChange={(e) => { buildPastMedicalHistory('Heartattackcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Heartattacktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Heartattacktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >  Heart valves </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Heartvalves}
                          onInput={(e) => {
                            buildPastMedicalHistory("Heartvalves", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Heartvalvescheck}
                          onChange={(e) => { buildPastMedicalHistory('Heartvalvescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Heartvalvestext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Heartvalvestext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-5 col-form-label py-0" > Abnormal heart rhythm </label>
                      <div className="col-sm-7 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Abnormalheartrhythm}
                          onInput={(e) => {
                            buildPastMedicalHistory("Abnormalheartrhythm", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Abnormalheartrhythmcheck}
                          onChange={(e) => { buildPastMedicalHistory('Abnormalheartrhythmcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Abnormalheartrhythmtext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Abnormalheartrhythmtext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-6 col-form-label py-0" > Other </label>
                      <div className="col-sm-6 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Other}
                          onInput={(e) => {
                            buildPastMedicalHistory("Other", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Othercheck}
                          onChange={(e) => { buildPastMedicalHistory('Othercheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Othertext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Othertext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-6 col-form-label py-0" > Arteries (Head, arms, legs, aorta, etc.) </label>
                      <div className="col-sm-6 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Arteries}
                          onInput={(e) => {
                            buildPastMedicalHistory("Arteries", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Arteriescheck}
                          onChange={(e) => { buildPastMedicalHistory('Arteriescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Arterieschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Arterieschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 mb-4 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-6 col-form-label py-0" > Veins or blood clots in the veins </label>
                      <div className="col-sm-6 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Veinsorblood}
                          onInput={(e) => {
                            buildPastMedicalHistory("Veinsorblood", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Veinsorbloodcheck}
                          onChange={(e) => { buildPastMedicalHistory('Veinsorbloodcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Veinsorbloodchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Veinsorbloodchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>


                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Lungs </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Lungs}
                          onInput={(e) => {
                            buildPastMedicalHistory("Lungs", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Lungscheck}
                          onChange={(e) => { buildPastMedicalHistory('Lungscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Lungschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Lungschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-6 col-form-label py-0" > Esophagus (Food or swallowing pipe) </label>
                      <div className="col-sm-6 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Esophagus}
                          onInput={(e) => {
                            buildPastMedicalHistory("Esophagus", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Esophaguscheck}
                          onChange={(e) => { buildPastMedicalHistory('Esophaguscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Esophaguschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Esophaguschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-4 col-form-label py-0" >Stomach (Ulcer)  </label>
                      <div className="col-sm-8 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Stomach}
                          onInput={(e) => {
                            buildPastMedicalHistory("Stomach", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Stomachcheck}
                          onChange={(e) => { buildPastMedicalHistory('Stomachcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Stomachchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Stomachchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-6 col-form-label py-0" > Bowel (Small or large intestine, rectum) </label>
                      <div className="col-sm-6 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Bowel}
                          onInput={(e) => {
                            buildPastMedicalHistory("Bowel", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Bowelcheck}
                          onChange={(e) => { buildPastMedicalHistory('Bowelcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Bowelchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Bowelchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >Appendix  </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Appendix}
                          onInput={(e) => {
                            buildPastMedicalHistory("Appendix", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Appendixcheck}
                          onChange={(e) => { buildPastMedicalHistory('Appendixcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Appendixchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Appendixchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >Lymph nodes  </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Lymphnodes}
                          onInput={(e) => {
                            buildPastMedicalHistory("Lymphnodes", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Lymphnodescheck}
                          onChange={(e) => { buildPastMedicalHistory('Lymphnodescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Lymphnodeschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Lymphnodeschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Spleen  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Spleen}
                          onInput={(e) => {
                            buildPastMedicalHistory("Spleen", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Spleencheck}
                          onChange={(e) => { buildPastMedicalHistory('Spleencheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Spleenchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Spleenchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Liver  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Liver}
                          onInput={(e) => {
                            buildPastMedicalHistory("Liver", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Livercheck}
                          onChange={(e) => { buildPastMedicalHistory('Livercheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Liverchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Liverchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >Gallbladder  </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Gallbladder}
                          onInput={(e) => {
                            buildPastMedicalHistory("Gallbladder", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Gallbladdercheck}
                          onChange={(e) => { buildPastMedicalHistory('Gallbladdercheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Gallbladderchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Gallbladderchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >Pancreas  </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Pancreas}
                          onInput={(e) => {
                            buildPastMedicalHistory("Pancreas", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Pancreascheck}
                          onChange={(e) => { buildPastMedicalHistory('Pancreascheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Pancreaschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Pancreaschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Hernia  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Hernia}
                          onInput={(e) => {
                            buildPastMedicalHistory("Hernia", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Herniacheck}
                          onChange={(e) => { buildPastMedicalHistory('Herniacheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Herniachecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Herniachecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Kidneys  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Kidneys}
                          onInput={(e) => {
                            buildPastMedicalHistory("Kidneys", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Kidneyscheck}
                          onChange={(e) => { buildPastMedicalHistory('Kidneyscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Kidneyschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Kidneyschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Bladder  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Bladder}
                          onInput={(e) => {
                            buildPastMedicalHistory("Bladder", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Bladdercheck}
                          onChange={(e) => { buildPastMedicalHistory('Bladdercheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Bladderchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Bladderchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Bones  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Bones}
                          onInput={(e) => {
                            buildPastMedicalHistory("Bones", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistory?.Bonescheck}
                          onChange={(e) => { buildPastMedicalHistory('Bonescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistory?.Boneschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistory("Boneschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="buttonmaindiv" type="button">
                <button onClick={() => { props.back() }} className='buttonDivfamily' >
                  back
                </button>
                <button
                  disabled={checkFormStep1}
                  onClick={() => {
                    generateDocs(1)
                  }}
                  className='buttonDivfamily nextButtonfamily'
                >
                  Continue
                </button>
              </div>
            </>
          ) : multiStepForm == 2 ? (
            <>
              <div id="pdf-ref3-2" className='mb-3'>
                {/* PAST MEDICAL HISTORY (Continued) */}
                <div className="fw-bold h4 text-black">PAST MEDICAL HISTORY (Continued)</div>
                <div className="form-group  row mb-2">
                  <div className="row col-11 align-items-center">
                    <label className='d-block label col-md-8'>Medical Problem </label>
                    <label className='d-block label col-md-4'>Surgery/Year</label>
                  </div>
                  <div className="row peronsnalandfamilydiv" >
                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Joints </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Joints}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Joints", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox" defaultChecked={pastMedicalHistorycontinue?.Jointscheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Jointscheck', e.target.checked) }} id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Jointschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Jointschecktext", e.target.value);
                          }} id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" > Muscles </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Muscles}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Muscles", e.target.value);
                          }} id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox" defaultChecked={pastMedicalHistorycontinue?.Musclescheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Musclescheck', e.target.checked) }} id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Muscleschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Muscleschecktext", e.target.value);
                          }} id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Back </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Back}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Back", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Backcheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Backcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Backchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Backchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label className=" w-100 d-block  my-2 label" > Females </label>
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Uterus </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Uterus}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Uterus", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-end">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Uteruscheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Uteruscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          id="staticEmail"
                          value={pastMedicalHistorycontinue?.Uteruschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Uteruschecktext", e.target.value);
                          }}
                        />

                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >  Ovaries </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Ovaries}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Ovaries", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Ovariescheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Ovariescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Ovarieschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Ovarieschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-4 col-form-label py-0" > Fallopian tubes </label>
                      <div className="col-sm-8 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Fallopiantubes}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Fallopiantubes", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Fallopiantubescheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Fallopiantubescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Fallopiantubeschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Fallopiantubeschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-4 col-form-label py-0" > Hysterectomy </label>
                      <div className="col-sm-8 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Hysterectomy}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Hysterectomy", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Hysterectomycheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Hysterectomycheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Hysterectomychecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Hysterectomychecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Other </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Othernew}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Othernew", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Othernewcheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Othernewcheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Othernewchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Othernewchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Spine </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Spine}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Spine", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Spinecheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Spinecheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Spinechecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Spinechecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>


                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" > Brain </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Brain}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Brain", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Braincheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Braincheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Brainchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Brainchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Skin </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Skin}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Skin", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Skincheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Skincheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Skinchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Skinchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Breasts  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Breasts}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Breasts", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Breastscheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Breastscheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Breastschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Breastschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label className=" w-100 d-block  my-2 label" > Males </label>
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" > Prostate </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Prostate}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Prostate", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-end  ">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Prostatecheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Prostatecheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Prostatechecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Prostatechecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Penis  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Penis}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Penis", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Penischeck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Penischeck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Penischecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Penischecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >Testicles  </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Testicles}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Testicles", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Testiclescheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Testiclescheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Testicleschecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Testicleschecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-3 col-form-label py-0" >Vasectomy  </label>
                      <div className="col-sm-9 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Vasectomy}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Vasectomy", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox" defaultChecked={pastMedicalHistorycontinue?.Vasectomychck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Vasectomychck', e.target.checked) }} id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Vasectomychcktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Vasectomychcktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-8 align-items-center">
                      <label htmlFor="staticEmail" className="col-sm-2 col-form-label py-0" >Other  </label>
                      <div className="col-sm-10 px-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Other}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Other", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                    <div className="row col-md-4 align-items-center">
                      <div className="col-sm-2 px-0 text-end">
                        <input className="form-check-input ms-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.Othercheck}
                          onChange={(e) => { buildPastMedicalHistoryContinue('Othercheck', e.target.checked) }}
                          id="flexCheckDefault" />
                      </div>
                      <div className="col-sm-10 pe-0">
                        <input type="text" className="form-control mb-1"
                          value={pastMedicalHistorycontinue?.Otherchecktext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Otherchecktext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>

                    <div className="row col-md-12 align-items-center">
                      <div className="w-auto d-flex justify-content-between px-0 text-end">
                        <input className="form-check-input mx-2" type="checkbox"
                          defaultChecked={pastMedicalHistorycontinue?.None}
                          onChange={(e) => { buildPastMedicalHistoryContinue('None', e.target.checked) }}
                          id="flexCheckDefault" />
                        <label className="form-check-label" for="flexCheckDefault">None</label>
                      </div>
                      <div className="col-sm-8 pe-0">
                        <input type="text" className="form-control ms-3 mb-1"
                          value={pastMedicalHistorycontinue?.Nonetext}
                          onInput={(e) => {
                            buildPastMedicalHistoryContinue("Nonetext", e.target.value);
                          }}
                          id="staticEmail" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='form-group mb-3 row g-0 p-2'>
                  <label className="label d-block "> Have you been hospitalized for any other surgeries not listed above? </label>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio" name="hospitalized" onChange={(e) => { buildPastMedicalHistoryContinue('otherSurgeries', e.target.value) }} checked={pastMedicalHistorycontinue?.otherSurgeries == 'no'} id="inlineRadio3" value="no" />
                    <label className="form-check-label" htmlFor="inlineRadio1">No</label>
                  </div>
                  <div className="form-check form-check col-md-3 col-12">
                    <input className="form-check-input" type="radio"
                      onChange={(e) => { buildPastMedicalHistoryContinue('otherSurgeries', e.target.value) }}
                      checked={pastMedicalHistorycontinue?.otherSurgeries == 'yes'}
                      name="hospitalized" id="inlineRadio4" value="yes" />
                    <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
                  </div>
                </div>
                {pastMedicalHistorycontinue?.otherSurgeries == 'yes' &&
                  <div className="mb-5 border border-1 rounded-1 border-grey p-3">
                    <label className="label d-block ">What was the problem?</label>
                    <div className="mb-5">
                      <textarea rows="4" className="form-control"></textarea>
                    </div>
                    <div className="mb-3">
                      <div className="row w-100 align-items-center">
                        <label htmlFor="staticEmail" className="col-sm-2 label col-form-label  py-0" >
                          When:
                        </label>
                        <div className="col-sm-10 px-0">
                          <input type="text" className="form-control mb-1" id="staticEmail" />
                        </div>
                      </div>
                    </div>
                  </div>
                }

                {/* PERSONAL AND FAMILY HISTORY */}
                <div>
                  <div className="fw-bold h4 text-black">PERSONAL AND FAMILY HISTORY</div>
                  <div className='form-group row mb-3 g-0'>
                    <label className="label d-block ">If known, complete the following information about your blood relatives (Include children). </label>
                    <label className="label d-block "> Are you adopted? </label>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        onChange={(e) => { buildPersonalAndFamilyHistory('Areyouadopted', e.target.value) }}
                        checked={personalAndFamilyHistory?.Areyouadopted == 'no'}
                        name="adopted" id="inlineRadio3" value="no" />
                      <label className="form-check-label" htmlFor="inlineRadio1">No</label>
                    </div>
                    <div className="form-check form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        onChange={(e) => { buildPersonalAndFamilyHistory('Areyouadopted', e.target.value) }}
                        checked={personalAndFamilyHistory?.Areyouadopted == 'yes'}
                        name="adopted" id="inlineRadio4" value="yes" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
                    </div>
                  </div>

                  {/* father */}
                  <div className='form-group mb-3 row g-0'>
                    <label className="label d-block "> Father </label>
                    <div className="form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        name="father"
                        onChange={(e) => { buildPersonalAndFamilyHistory('father', e.target.value) }}
                        checked={personalAndFamilyHistory?.father == 'doNotKnow'}
                        id="inlineRadio3father" value="doNotKnow" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                    </div>
                    <div className="form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        onChange={(e) => { buildPersonalAndFamilyHistory('father', e.target.value) }} checked={personalAndFamilyHistory?.father == 'alive'} name="father" id="inlineRadio4father" value="alive" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Alive</label>
                    </div>
                    <div className="form-check  col-md-3 col-12">
                      <input className="form-check-input" type="radio"
                        onChange={(e) => { buildPersonalAndFamilyHistory('father', e.target.value) }} checked={personalAndFamilyHistory?.father == 'deceased'} name="father" id="inlineRadio6father" value="deceased" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Deceased</label>
                    </div>
                  </div>
                  {personalAndFamilyHistory?.father == 'deceased' &&
                    <div className="mb-5 form-group row g-0 border border-1 rounded-1 border-grey p-3">
                      <label className="label d-block "> Age at death </label>
                      <div className="form-check  col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('fatherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.fatherAgeatdeath == 'under30'}
                          name="fatherDeceased" id="inlineRadio3fatherDeceased" value="under30" />
                        <label className="form-check-label" htmlFor="inlineRadio1">Under 30</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('fatherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.fatherAgeatdeath == '30-40'}
                          name="fatherDeceased" id="inlineRadio4fatherDeceased" value="30-40" />
                        <label className="form-check-label" htmlFor="inlineRadio1">30-40</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('fatherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.fatherAgeatdeath == '41-50'}
                          name="fatherDeceased" id="inlineRadio6fatherDeceased" value="41-50" />
                        <label className="form-check-label" htmlFor="inlineRadio1">41-50</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('fatherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.fatherAgeatdeath == '51-60'}
                          name="fatherDeceased" id="inlineRadio7fatherDeceased" value="51-60" />
                        <label className="form-check-label" htmlFor="inlineRadio1">51-60</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('fatherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.fatherAgeatdeath == '61-70'}
                          name="fatherDeceased" id="inlineRadio8fatherDeceased" value="61-70" />
                        <label className="form-check-label" htmlFor="inlineRadio1">61-70</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('fatherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.fatherAgeatdeath == 'over70'}
                          name="fatherDeceased" id="inlineRadio9fatherDeceased" value="over70" />
                        <label className="form-check-label" htmlFor="inlineRadio1">Over 70</label>
                      </div>

                      <div className="mb-3">
                        <div className="row w-100 align-items-end">
                          <label htmlFor="staticEmail" className="col-sm-3 label col-form-label  py-0" >
                            Cause of death:
                          </label>
                          <div className="col-sm-9 px-0">
                            <input type="text" className="form-control mb-1"
                              value={personalAndFamilyHistory?.fatherCauseofdeath}
                              onInput={(e) => {
                                buildPersonalAndFamilyHistory("fatherCauseofdeath", e.target.value);
                              }}
                              id="staticEmail" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  {/* Mother */}
                  <div className='form-group mb-3 row g-0 '>
                    <label className="label d-block "> Mother </label>
                    <div className="form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio" onChange={(e) => { buildPersonalAndFamilyHistory('mother', e.target.value) }} name="mother" checked={personalAndFamilyHistory?.mother == 'doNotKnow'} id="inlineRadio3father" value="doNotKnow" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                    </div>
                    <div className="form-check col-md-3 col-12">
                      <input className="form-check-input" type="radio" onChange={(e) => { buildPersonalAndFamilyHistory('mother', e.target.value) }} checked={personalAndFamilyHistory?.mother == 'alive'} name="mother" id="inlineRadio4father" value="alive" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Alive</label>
                    </div>
                    <div className="form-check  col-md-3 col-12">
                      <input className="form-check-input" type="radio" onChange={(e) => { buildPersonalAndFamilyHistory('mother', e.target.value) }} checked={personalAndFamilyHistory?.mother == 'deceased'} name="mother" id="inlineRadio6father" value="deceased" />
                      <label className="form-check-label" htmlFor="inlineRadio1">Deceased</label>
                    </div>
                  </div>
                  {personalAndFamilyHistory?.mother == 'deceased' &&
                    <div className="mb-5 form-group row g-0 border border-1 rounded-1 border-grey p-3">
                      <label className="label d-block "> Age at death </label>
                      <div className="form-check  col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('motherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.motherAgeatdeath == 'under30'}
                          name="motherDeceased" id="inlineRadio3motherDeceased" value="under30" />
                        <label className="form-check-label" htmlFor="inlineRadio1">Under 30</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('motherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.motherAgeatdeath == '30-40'}
                          name="motherDeceased" id="inlineRadio4motherDeceased" value="30-40" />
                        <label className="form-check-label" htmlFor="inlineRadio1">30-40</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('motherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.motherAgeatdeath == '41-50'}
                          name="motherDeceased" id="inlineRadio6motherDeceased" value="41-50" />
                        <label className="form-check-label" htmlFor="inlineRadio1">41-50</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('motherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.motherAgeatdeath == '51-60'}
                          name="motherDeceased" id="inlineRadio7motherDeceased" value="51-60" />
                        <label className="form-check-label" htmlFor="inlineRadio1">51-60</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('motherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.motherAgeatdeath == '61-70'}
                          name="motherDeceased" id="inlineRadio8motherDeceased" value="61-70" />
                        <label className="form-check-label" htmlFor="inlineRadio1">61-70</label>
                      </div>
                      <div className="form-check form-check col-md-3 col-12">
                        <input className="form-check-input" type="radio"
                          onChange={(e) => { buildPersonalAndFamilyHistory('motherAgeatdeath', e.target.value) }}
                          checked={personalAndFamilyHistory?.motherAgeatdeath == 'over70'}
                          name="motherDeceased" id="inlineRadio9motherDeceased" value="over70" />
                        <label className="form-check-label" htmlFor="inlineRadio1">Over 70</label>
                      </div>

                      <div className="mb-3">
                        <div className="row w-100 align-items-end">
                          <label htmlFor="staticEmail" className="col-sm-3 label col-form-label  py-0" >
                            Cause of death:
                          </label>
                          <div className="col-sm-9 px-0">
                            <input type="text" className="form-control mb-1"
                              value={personalAndFamilyHistory?.motherCauseofdeath}
                              onInput={(e) => {
                                buildPersonalAndFamilyHistory("motherCauseofdeath", e.target.value);
                              }}
                              id="staticEmail" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  {/* Brothers alive */}
                  <div className="mb-5 form-group row g-0 ">
                    <label className="label mb-0 d-block "> Brothers </label>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of alive: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brothernumberalive == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brothernumberalive", e.target.value);
                            }}
                            name="brothernumberalive" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of deceased: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.brotherNumberofdeceased == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("brotherNumberofdeceased", e.target.value);
                            }}
                            name="numberOfBrothersdeceased" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sisters Alive */}
                  <div className="mb-5 form-group row g-0 ">
                    <label className="label mb-0 d-block "> Sisters </label>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of alive: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberalive == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberalive", e.target.value);
                            }}
                            name="numberOfSistersAlive" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of deceased: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sisternumberofdeceased == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sisternumberofdeceased", e.target.value);
                            }}
                            name="numberOfSistersdeceased" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sons Alive */}
                  <div className="mb-5 form-group row g-0 ">
                    <label className="label mb-0 d-block "> Sons </label>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of alive: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonnumberalive == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonnumberalive", e.target.value);
                            }}
                            name="numberOfSonsAlive" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of deceased: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "4"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio4motherDeceased" value="4" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.sonNumberofdeceased == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("sonNumberofdeceased", e.target.value);
                            }}
                            name="sonNumberofdeceased" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daughter Alive */}
                  <div className="mb-5 form-group row g-0 ">
                    <label className="label mb-0 d-block "> Daughter </label>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of alive: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumberalive == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumberalive", e.target.value);
                            }}
                            name="numberOfDaughtersAlive" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                    <div className='row g-0'>
                      <label className=" d-block col-md-2 "> Number of deceased: </label>
                      <div className='form-group col-md-10 row g-0 justify-content-end'>
                        <div className="form-check  col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "0"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio3motherDeceased" value="0" />
                          <label className="form-check-label" htmlFor="inlineRadio1">0</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "1"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio4motherDeceased" value="1" />
                          <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "2"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio6motherDeceased" value="2" />
                          <label className="form-check-label" htmlFor="inlineRadio1">2</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "3"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio3motherDeceased" value="3" />
                          <label className="form-check-label" htmlFor="inlineRadio1">3</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "5"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio4motherDeceased" value="5" />
                          <label className="form-check-label" htmlFor="inlineRadio1">5</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "6"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio6motherDeceased" value="6" />
                          <label className="form-check-label" htmlFor="inlineRadio1">6</label>
                        </div>
                        <div className="form-check col-md-1 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "7Plus"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio4motherDeceased" value="7Plus" />
                          <label className="form-check-label" htmlFor="inlineRadio1">7+</label>
                        </div>
                        <div className="form-check col-md-3 col-6">
                          <input className="form-check-input" type="radio"
                            checked={personalAndFamilyHistory?.Daughternumofdeceased == "donotKnow"}
                            onChange={(e) => {
                              buildPersonalAndFamilyHistory("Daughternumofdeceased", e.target.value);
                            }}
                            name="Daughternumofdeceased" id="inlineRadio6motherDeceased" value="donotKnow" />
                          <label className="form-check-label" htmlFor="inlineRadio1">Do not know</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="mt-3 text-end" type="button">
                <button onClick={() => { setMultiStepForm(1) }} className='buttonDivfamily' >
                  back
                </button>
                <button
                  disabled={checkFormStep2}
                  onClick={() => { setMultiStepForm(3) }} className='buttonDivfamily nextButtonfamily' >

                  Continue
                </button>
              </div>
            </>
          ) : multiStepForm == 3 ? (
            <>
              <div id="pdf-ref3-3" className='mb-3' style={{ height: "80vh" }}>
                <div className="fw-bold h4 text-black">PERSONAL AND FAMILY HISTORY (Continued)</div>
                <div className='mb-3'>
                  <label>To help us understand any special circumstances for your family, we need to know if you or any of your family has had any of the following. Please check the appropriate boxes. Identify all illnesses or conditions which you know have occured in you or your blood relatives. Indicate “None” if you are unsure</label>
                </div>
                <div className='perosnalFamilyHistoryForm'>
                  <div className='form-group mb-2 row g-0 p-2 headers text-center'>
                    <div className='col-3 label'></div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Self</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Father</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Mother</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Brother</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Sisters</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Sons</div>
                    <div  className='col-1 label' style={{fontSize:"13px"}}>Daughters</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>Grand-parents</div>
                    <div className='col-1 label' style={{fontSize:"13px"}}>None</div>
                  </div>
                  <div className='peronsnalandfamilydiv'>
                    {peronsnalAndFamilyHistoryOptions.map((item, index) => {
                      let arr = setArrfunction(pastMedicalHistorycontinuesecond, item)
                      return (
                        <div key={index}>
                          {index < 50 &&
                            <div className='form-group mb-1 row g-0 p-2 data-rows text-center' >
                              <div className='col-3 text-start'>{item}</div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 0)}
                                  onChange={(e) => { arr[0] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 1)}
                                  onChange={(e) => { arr[1] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 2)}
                                  onChange={(e) => { arr[2] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 3)}
                                  onChange={(e) => { arr[3] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }} id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 4)}
                                  onChange={(e) => { arr[4] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 5)}
                                  onChange={(e) => { arr[5] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }} id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 6)}
                                  onChange={(e) => { arr[6] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 7)}
                                  onChange={(e) => { arr[7] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                              <div className='col-1 label '>
                                <input className="form-check-input mx-auto" type="checkbox"
                                  checked={CheckedFunvtion(pastMedicalHistorycontinuesecond, item, 8)}
                                  onChange={(e) => { arr[8] = (e.target.checked); buildPastMedicalHistoryContinueSecond(item, arr) }}
                                  id="flexCheckDefault" />
                              </div>
                            </div>
                          }
                        </div>
                      )
                    })}
                  </div>

                </div>
              </div>
              <div className="mt-3 text-end" type="button">
                <button onClick={() => { setMultiStepForm(2) }} className='buttonDivfamily' >
                  back
                </button>
                <button onClick={() => { generateDocs(3) }}
                  disabled={checkFormStep3}
                  className='buttonDivfamily nextButtonfamily' >
                  Continue
                </button>
              </div>
            </>
          ) : multiStepForm == 4 ? (
            <>
              <div id="pdf-ref3-4" className='mb-3'>
                {/* <div className="fw-bold h4 text-black">PERSONAL AND FAMILY HISTORY (Continued)</div>
                <div className='perosnalFamilyHistoryForm mb-5'>
                  <div className='form-group mb-2 row g-0 p-2 headers text-center'>
                    <div className='col-2'></div>
                    <div className='col-1 label'>Self</div>
                    <div className='col-1 label'>Father</div>
                    <div className='col-1 label'>Mother</div>
                    <div className='col-1 label'>Brother</div>
                    <div className='col-1 label'>Sisters</div>
                    <div className='col-1 label'>Sons</div>
                    <div className='col-2 label' >Daughters</div>
                    <div className='col-1 label'>Grand-parents</div>
                    <div className='col-1 label'>None</div>
                  </div>
                  {peronsnalAndFamilyHistoryOptions.map((item, index) => {
                    let arr = setArrfunction(personalAndFamilyHistoryContinue, item)
                    return (
                      <div key={index}>
                        {index > 31 &&
                          <div className='form-group mb-1 row g-0 p-2 data-rows text-center'>
                            <div className='col-2 text-start'>{item}</div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 0)}
                                onChange={(e) => { arr[0] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 1)}
                                onChange={(e) => { arr[1] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 2)}
                                onChange={(e) => { arr[2] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 3)}
                                onChange={(e) => { arr[3] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 4)}
                                onChange={(e) => { arr[4] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 5)}
                                onChange={(e) => { arr[5] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-2 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 6)}
                                onChange={(e) => { arr[6] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 7)}
                                onChange={(e) => { arr[7] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                            <div className='col-1 label '>
                              <input className="form-check-input mx-auto" type="checkbox"
                                checked={CheckedFunvtion(personalAndFamilyHistoryContinue, item, 8)}
                                onChange={(e) => { arr[8] = (e.target.checked); buildPersonalAndFamilyHistoryContinue(item, arr) }}
                                id="flexCheckDefault" />
                            </div>
                          </div>
                        }
                      </div>
                    )
                  })}

                </div> */}

                <div className='h5  text-black'><span className='fw-bold'>Provider Updates/Comments:</span> (Sign and Date)</div>

                <div className='row align-items-end'>
                  <div className="form-group col-md-6 my-3 ">
                    <label htmlFor="staticEmail " className="col-form-label label" >
                      (Signature of Person Completing Form)
                    </label>
                    <button type="button" className="btn btn-sm btn-primary ms-5 " onClick={() => { personalSignature.current.clear();
                    buildProviderUpdatesComments(
                      "SignatureofPerson",
                      ""
                    );
                    }} >
                      Reset
                    </button>
                    <div className="w-100 text-end">
                      <div className="border mb-1 border-dark rounded-1">
                        <SignatureCanvas ref={personalSignature}
                          onEnd={(e) => {
                            buildProviderUpdatesComments(
                              "SignatureofPerson",
                              personalSignature.current.toDataURL()
                            );
                          }}
                          canvasProps={{ width: 500, height: 70, className: "sigCanvas", }} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-6 align-items-end row my-2">
                    <label htmlFor="staticEmail" className="col-sm-5 col-form-label  " > (Relationship to Patient): </label>
                    <div className="col-sm-7">
                      <input type="text" className="form-control mb-1"
                        value={
                          providerUpdatesComments?.RelationshiptoPatient
                        }
                        onInput={(e) =>
                          buildProviderUpdatesComments("RelationshiptoPatient", e.target.value)
                        }
                        id="staticEmail" />
                    </div>
                  </div>

                  <div className="form-group col-md-6 my-3 ">
                    <label htmlFor="staticEmail " className="col-form-label label" >
                      (Signature of Provider
                    </label>
                    <button type="button" className="btn btn-sm btn-primary ms-5" onClick={() => {
                      providerSignature.current.clear(); 
                      buildProviderUpdatesComments(
                        "SignatureofProvider",
                       ""
                      );
                      }} >
                      Reset
                    </button>
                    <div className="w-100 text-end">
                      <div className="border mb-1 border-dark rounded-1">
                        <SignatureCanvas ref={providerSignature}
                          onEnd={(e) => {
                            buildProviderUpdatesComments(
                              "SignatureofProvider",
                              providerSignature.current.toDataURL()
                            );
                          }}
                          canvasProps={{ width: 500, height: 70, className: "sigCanvas", }} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-6 align-items-end row my-2">
                    <label htmlFor="staticEmail" className="col-sm-5 col-form-label label " > Date </label>
                    <div className="col-sm-7">
                      <input type="date" className="form-control mb-1"
                        value={
                          providerUpdatesComments?.date
                        }
                        onChange={(e) => buildProviderUpdatesComments("date", e.target.value)}
                        id="staticEmail" />
                    </div>
                  </div>
                </div>

                <div className="form-group col-md-12 my-2">
                  <label className="label d-block ">(Reviewed/Updated)?</label>
                  <div className="mb-5">
                    <textarea rows="4"
                      value={
                        providerUpdatesComments?.ReviewedUpdated
                      }
                      onInput={(e) =>
                        buildProviderUpdatesComments("ReviewedUpdated", e.target.value)
                      }
                      className="form-control"></textarea>
                  </div>
                </div>


              </div>
              <div className="mt-3 text-end" type="button">
                <button onClick={() => { setMultiStepForm(3) }} className='buttonDivfamily' >
                  back
                </button>
                <button className='buttonDivfamily nextButtonfamily' onClick={() => { generateDocs(4) }} disabled={isLoading && checkFormStep4} >
                  {isLoading ? (<span class="spinner-border spinner-border-sm"></span>) :'Continue'}
                </button>
              </div>
            </>
          ) : multiStepForm == 5 ? (
                    <>
                      <div>
                        <div className="alert alert-primary">Congratulations, you have successfully completed all steps.</div>
                      </div>
                    </>
          ) : ''}
        </div>
      </div>
    </div>
  )
}
