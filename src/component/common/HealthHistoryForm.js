import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import PatientContext from "../../context/patientDetails/patientContext";
import html2canvas from 'html2canvas';
import moment from 'moment';
import jsPDF from 'jspdf';
import swal from "sweetalert";
import api from "../../api";
import "./common.css";

const childHoodIllnessOptions = [
  { value: "measles", label: "Measles" },
  { value: "mumps", label: "Mumps" },
  { value: "rubella", label: "Rubella" },
  { value: "chickenPox", label: "Chickenpox" },
  { value: "rheumaticFever", label: "Rheumatic Fever" },
  { value: "polio", label: "Polio" },
  { value: "none", label: "None" }
];

const immunizationAndDatesOptions = [
  { value: "tetanus", label: "Tetanus", },
  { value: "phenumonia", label: "Phenumonia", },
  { value: "hepatitisA", label: "Hepatitis A", },
  { value: "hepatitisB", label: "Hepatitis B", },
  { value: "chickenPox", label: "ChickenPox", },
  { value: "influenza", label: "Influenza A", },
  { value: "mmr", label: "MMR Measles, Mumps, Rubella", },
  { value: "menningococcal", label: "Menningococcal", },
  { value: "hepatitisA", label: "Hepatitis A", },
  { value: "none", label: "None", },
];

const testingOptions = [
  { value: "eyeExam", label: "Eye Exam" },
  { value: "colonoscopy", label: "Colonoscopy" },
  { value: "dexaScan", label: "Dexa Scan" },
];

const medicalHistoryOptions = [
  { value: 'alcoholAbuse', label: 'Alcohol Abuse' },
  { value: 'anemia', label: 'Anemia' },
  { value: 'anestheticComplication', label: 'Anesthetic Complication' },
  { value: 'anxietyDisorder', label: 'Anxiety Disorder' },
  { value: 'arthritis', label: 'Arthritis' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'autoimmuneProblems', label: 'Autoimmune Problems' },
  { value: 'birthDefects', label: 'Birth Defects' },
  { value: 'bladderProblems', label: 'Bladder Problems' },
  { value: 'Bleeding Disease', label: 'Bleeding Disease' },
  { value: 'BloodClots', label: 'Blood Clots' },
  { value: 'bloodTransfusions', label: 'Blood Transfusion(s)' },
  { value: 'bowelDisease', label: 'Bowel Disease' },
  { value: 'breastCancer', label: 'Breast Cancer' },
  { value: 'cervicalCancer', label: 'Cervical Cancer' },
  { value: 'colonCancer', label: 'Colon Cancer' },
  { value: 'depression', label: 'Depression' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'growthAndDevelopmentDisorder', label: 'Growth/Development Disorder' },
  { value: 'heartAttack', label: 'Heart Attack' },
  { value: 'heartDisease', label: 'Heart Disease' },
  { value: 'heartPainAngina', label: 'Heart Pain/Angina' },
  { value: 'hepatitisA', label: 'Hepatitis A' },
  { value: 'hepatitisB', label: 'Hepatitis B' },
  { value: 'hepatitisC', label: 'Hepatitis C' },
  { value: 'highBloodPressure', label: 'High Blood Pressure' },
  { value: 'highCholesterol', label: 'High Cholesterol' },
  { value: 'hiv', label: 'HIV' },
  { value: 'hives', label: 'Hives' },
  { value: 'kidneyDisease', label: 'Kidney Disease' },
  { value: 'liverCancer', label: 'Liver Cancer' },
  { value: 'liverDisease', label: 'Liver Disease' },
  { value: 'lungCancer', label: 'Lung Cancer' },
  { value: 'lungRespiratoryDisease', label: 'Lung/Respiratory Disease' },
  { value: 'mentalIllness', label: 'Mental Illness' },
  { value: 'migraines', label: 'Migraines' },
  { value: 'osteoporosis', label: 'Osteoporosis' },
  { value: 'prostateCancer', label: 'Prostate Cancer' },
  { value: 'rectalCancer', label: 'Rectal Cancer' },
  { value: 'refluxGERD', label: 'Reflux/GERD' },
  { value: 'seizuresConvulsions', label: 'Seizures/Convulsions' },
  { value: 'severeAllergy', label: 'Severe Allergy' },
  { value: 'sexuallyTransmittedDisease', label: ' Sexually Transmitted Disease' },
  { value: 'skinCancer', label: 'Skin Cancer' },
  { value: 'strokeCVAOfTheBrain', label: 'Stroke/CVA of the Brain' },
  { value: 'suicideAttempt', label: 'Suicide Attempt' },
  { value: 'thyroidProblems', label: 'Thyroid Problems' },
  { value: 'ulcer', label: 'Ulcer' },
  { value: 'visualImpairment', label: 'Visual Impairment' },
  { value: 'otherDiseaseCancerOrSignificantMedicalIllness', label: 'Other Disease, Cancer, or Significant Medical Illness' },
  { value: 'none', label: ' NONE of the Above' }
]

const familyMedicalHistoryOptions = [
  { value: 'adopted', label: 'I am adopted and do not know biological family history' },
  { value: 'unknown', label: 'Family History Unknown' },
  { value: 'alcoholAbuse', label: 'Alcohol Abuse' },
  { value: 'anemia', label: 'Anemia' },
  { value: 'anestheticComplication', label: 'Anesthetic Complication' },
  { value: 'anxietyDisorder', label: 'Anxiety Disorder' },
  { value: 'arthritis', label: 'Arthritis' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'autoimmuneProblems', label: 'Autoimmune Problems' },
  { value: 'birthDefects', label: 'Birth Defects' },
  { value: 'bladderProblems', label: 'Bladder Problems' },
  { value: 'Bleeding Disease', label: 'Bleeding Disease' },
  { value: 'BloodClots', label: 'Blood Clots' },
  { value: 'bloodTransfusions', label: 'Blood Transfusion(s)' },
  { value: 'bowelDisease', label: 'Bowel Disease' },
  { value: 'breastCancer', label: 'Breast Cancer' },
  { value: 'cervicalCancer', label: 'Cervical Cancer' },
  { value: 'colonCancer', label: 'Colon Cancer' },
  { value: 'depression', label: 'Depression' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'heartDisease', label: 'Heart Disease' },
  { value: 'highBloodPressure', label: 'High Blood Pressure' },
  { value: 'highCholesterol', label: 'High Cholesterol' },
  { value: 'kidneyDisease', label: 'Kidney Disease' },
  { value: 'leukemia', label: 'Leukemia' },
  { value: 'lungRespiratoryDisease', label: 'Lung/Respiratory Disease' },
  { value: 'migraines', label: 'Migraines' },
  { value: 'osteoporosis', label: 'Osteoporosis' },
  { value: 'otherCancer', label: 'Other Cancer' },
  { value: 'rectalCancer', label: 'Rectal Cancer' },
  { value: 'seizuresConvulsions', label: 'Seizures/Convulsions' },
  { value: 'severeAllergy', label: 'Severe Allergy' },
  { value: 'sexuallyTransmittedDisease', label: ' Sexually Transmitted Disease' },
  { value: 'severeAllergy', label: 'Severe Allergy' },
  { value: 'strokeCVAOfTheBrain', label: 'Stroke/CVA of the Brain' },
  { value: 'thyroidProblems', label: 'Thyroid Problems' },
  { value: 'motherGrandmotherOrSisterDevelopedHeartDiseaseBeforeTheAgeOf65', value: 'Mother, Grandmother, or Sister developed heart disease before the age of 65' },
  { value: 'fatherGrandfatherOrBrotherDevelopedHeartDiseaseBeforeTheAgeOf55', value: 'Father, Grandfather, or Brother developed heart disease before the age of 55' },
  { value: 'none', label: ' NONE of the Above' }
]

const currentlyExperiencingOrSymptoms = [
  { value: 'feverChills', label: 'Fever Chills' },
  { value: 'feelingPoorlyFeelingTiredFatigued', label: 'Feeling poorly Feeling tired/fatigued' },
  { value: 'recentWeightGainRecentWeightLoss', label: 'Recent weight gain Recent weight loss' },
  { value: 'EyePainRedEyes', label: 'Eye pain Red eyes' },
  { value: 'eyesightProblemsDischargeFromEyes', label: 'Eyesight problems Discharge from eyes' },
  { value: 'dryEyesEyesItch', label: 'Dry eyes Eyes itch' },
  { value: 'visionChanges', label: 'Vision changes' },
  { value: 'earacheLossOfHearing', label: 'Earache Loss of hearing' },
  { value: 'nosebleedsDischargeFromNose', label: 'Nosebleeds Discharge from nose' },
  { value: 'soreThroatHoarseness', label: 'Sore throat Hoarseness' },
  { value: 'ringingInEarsSinusProblems', label: 'Ringing in ears Sinus problems' },
  { value: 'chestPainPalpitations', label: 'Chest pain Palpitations' },
  { value: 'fastSlowHeartbeatColdHandsFeet', label: 'Fast/slow heartbeat Cold hands/feet' },
  { value: 'musclePainSwellingInLegs', label: 'Muscle pain Swelling in legs' },
  { value: 'historyOfHeartMurmurHistoryOfHeartAttack', label: 'History of heart murmur History of heart attack' },
  { value: 'shortnessOfBreathWheezing', label: 'Shortness of breath Wheezing' },
  { value: 'coughShortnessOfBreathWithActivity', label: 'Cough Shortness of breath with activity' },
  { value: 'difficultyBreathingWhileLyingDownSleeping', label: 'Difficulty breathing while lying down/sleeping' },
  { value: 'coughingUpPhlegmBlood', label: 'Coughing up phlegm/blood' },
  { value: 'abdominalPainVomiting', label: 'Abdominal pain Vomiting' },
  { value: 'constipationDiarrhea', label: 'Constipation Diarrhea' },
  { value: 'heartburnBlackTarryStools', label: 'Heartburn Black, tarry stools' },
  { value: 'BloodPerRectum', label: 'Blood per rectum' },
  { value: 'painWithUrinationUrinaryIncontinence', label: 'Pain with urination Urinary incontinence' },
  { value: 'frequentUrinationAtNight', label: 'Frequent urination at night' },
  { value: 'urinaryFrequency', label: 'Urinary frequency' },
  { value: 'muscleJointPain', value: 'Muscle/joint pain' },
  { value: 'jointSwellingJointStiffness', value: 'Joint swelling Joint stiffness' },
  { value: 'limbPain', label: 'Limb pain' },
  { value: 'backPain', label: 'Back pain' },
  { value: 'skinLesionsSkinWound', label: 'Skin lesions Skin wound' },
  { value: 'itchingChangeInMole', label: 'Itching Change in mole' },
  { value: 'nailDiscolorationDeformity', label: 'Nail discoloration/deformity' },
  { value: 'confusionConvulsionsSeizures', label: 'Confusion Convulsions/seizures' },
  { value: 'dizzinessFainting', label: 'Dizziness Fainting' },
  { value: 'limbWeaknessDifficultyWalking', label: 'Limb weakness Difficulty walking' },
  { value: 'numbnessTinglingFrequentFalls', label: 'Numbness/tingling Frequent falls' },
  { value: 'suicidalSleepDisturbances', label: 'Suicidal Sleep disturbances' },
  { value: 'anxietyDepression', label: 'Anxiety Depression' },
  { value: 'changeInPersonalityEmotionalProblems', label: 'Change in personality Emotional problems' },
  { value: 'decreasedLibidoSexualDesire', label: 'Decreased libido/sexual desire' },
  { value: 'deepeningOfVoice', label: 'Deepening of voice' },
  { value: 'easyBleedingOrBruising', label: 'Easy bleeding or bruising' },
  { value: 'swollenGlands', label: 'Swollen glands' }
]

export default function HealthHistoryForm(props) {
  const [multiStepForm, setMultiStepForm] = useState(1);
  const [surgeries, setSurgeries] = useState(["1"]);
  const patientContext = useContext(PatientContext)
  const [otherHospitalization, setOtherHospitalization] = useState(["1"]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkFormStep1, setCheckFormStep1] = useState(true);
  const [checkFormStep2, setCheckFormStep2] = useState(true);
  const [checkFormStep3, setCheckFormStep3] = useState(true);
  const [checkFormStep4, setCheckFormStep4] = useState(true);
  const [checkFormStep5, setCheckFormStep5] = useState(true);
  const [personalHealthHistory, setPersonalHealthHistory] = useState(patientContext?.patientDetails?.healthHistoryData?.personalHealthHistory);
  const [medicalHealthHistory, setMedicalHealthHistory] = useState(patientContext?.patientDetails?.healthHistoryData?.medicalHealthHistory);
  const [familyMedicalHealthHistory, setFamilyMedicalHealthHistory] = useState(patientContext?.patientDetails?.healthHistoryData?.familyMedicalHealthHistory)
  const [socialHistory, setSocialHistory] = useState(patientContext?.patientDetails?.healthHistoryData?.socialHistory)
  const [personalSafety, setPersonalSafety] = useState(patientContext?.patientDetails?.healthHistoryData?.personalSafety)
  const [questionForWomen, setQuestionForWomen] = useState(patientContext?.patientDetails?.healthHistoryData?.questionForWomen)
  const [questionForMen, setQuestionForMen]=  useState(patientContext?.patientDetails?.healthHistoryData?.questionForMen)
  const [otherInformation, setOtherInformation] = useState(patientContext?.patientDetails?.healthHistoryData?.otherInformation)
  const healthHistoryData = {
    personalHealthHistory: personalHealthHistory,
    medicalHealthHistory: medicalHealthHistory,
    familyMedicalHealthHistory: familyMedicalHealthHistory,
    socialHistory: socialHistory,
    questionForWomen:questionForWomen,
    questionForMen:questionForMen,
    personalSafety: personalSafety,
    otherInformation: otherInformation
  }
  const [stepCanvas, setStepCanvas] = useState({});
  
  useEffect(() => {

    updateContext()
    renderform()
  }, [personalHealthHistory, JSON.stringify(socialHistory), medicalHealthHistory,questionForWomen,questionForMen, familyMedicalHealthHistory, personalSafety, otherInformation])

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [multiStepForm])

  useEffect(() => {
    isFormStep1();
    isFormStep2();
    isFormStep3();
    isFormStep4();
    isFormStep5();
  })

  const handleSurgerBlock = (event) => {
    let data = JSON.parse(JSON.stringify(surgeries));
    if (event == "add") {
      data.push("1");
      setSurgeries(data);
    } else if (event == "remove") {
      data.splice(data.length - 1, 1);
      setSurgeries(data);
    }
  };
  const handleOtherHospitalization = (event) => {
    let data = JSON.parse(JSON.stringify(otherHospitalization));
    if (event == "add") {
      data.push("1");
      setOtherHospitalization(data);
    } else if (event == "remove") {
      data.splice(data.length - 1, 1);
      setOtherHospitalization(data);
    }
  };

  const updateContext = () => {
    patientContext.update({
      ...patientContext.patientDetails,
      healthHistoryData,
    });
  }

  const isFormStep1 = () => {
    if (
      personalHealthHistory?.numberOfChildren !== undefined &&
      personalHealthHistory?.numberOfChildren !== "" &&
      personalHealthHistory?.liveWithYou !== undefined &&
      personalHealthHistory?.liveWithYou !== "" &&
      personalHealthHistory?.occupation !== undefined &&
      personalHealthHistory?.occupation !== "" &&
      personalHealthHistory?.previousorreferringdoctor !== undefined &&
      personalHealthHistory?.previousorreferringdoctor !== "" &&
      personalHealthHistory?.dateoflastphysicalexam !== undefined &&
      personalHealthHistory?.dateoflastphysicalexam !== "" &&
      personalHealthHistory?.childHoodIllness !== undefined &&
      personalHealthHistory?.childHoodIllness.length > 0 &&
      personalHealthHistory?.immunizationAndDates !== undefined &&
      personalHealthHistory?.immunizationAndDates.length > 0 &&
      personalHealthHistory?.testing !== undefined &&
      personalHealthHistory?.testing.length > 0 &&
      personalHealthHistory?.bloodtransfusion !== undefined &&
      personalHealthHistory?.bloodtransfusion !== "" &&
      personalHealthHistory?.pleaselistotherphysicians !== undefined &&
      personalHealthHistory?.pleaselistotherphysicians !== "" &&
      personalHealthHistory?.hospital !== undefined &&
      personalHealthHistory?.hospital !== "" &&
      personalHealthHistory?.reason !== undefined &&
      personalHealthHistory?.reason !== "" &&
      personalHealthHistory?.years !== undefined &&
      personalHealthHistory?.years !== "" &&
      personalHealthHistory?.neverHospitalized !== undefined &&
      personalHealthHistory?.neverHospitalized !== false
    ) {
      setCheckFormStep1(false);
    } else {
      setCheckFormStep1(true);
    }
  };

  const isFormStep2 = () => {
    if (
      medicalHealthHistory?.medicalHistory !== undefined &&
      medicalHealthHistory?.medicalHistory.length > 0 &&
      medicalHealthHistory?.listPastmedicalproblems !== undefined &&
      medicalHealthHistory?.listPastmedicalproblems !== "" &&
      medicalHealthHistory?.drug !== undefined &&
      medicalHealthHistory?.drug !== "" &&
      medicalHealthHistory?.doseFrequency !== undefined &&
      medicalHealthHistory?.doseFrequency !== "" &&
      medicalHealthHistory?.listDrugsOfQuestionnaire !== undefined &&
      medicalHealthHistory?.listDrugsOfQuestionnaire !== false &&
      // medicalHealthHistory?.medicationsVitamins !== undefined &&
      // medicalHealthHistory?.medicationsVitamins !== false &&
      medicalHealthHistory?.allergiesName !== undefined &&
      medicalHealthHistory?.allergiesName !== "" &&
      medicalHealthHistory?.reactionYouHad !== undefined &&
      medicalHealthHistory?.reactionYouHad !== ""&&
      familyMedicalHealthHistory?.familyMedicalHistory !== undefined &&
      familyMedicalHealthHistory?.familyMedicalHistory.length>0 
    ) {
      setCheckFormStep2(false);
    } else {
      setCheckFormStep2(true);
    }
  };

  const isFormStep3 = () => {
    if (
      socialHistory?.doyouexercise !== undefined &&
      socialHistory?.doyouexercise !== "" &&
      socialHistory?.howmanymin !== undefined &&
      socialHistory?.howmanymin !== "" &&
      socialHistory?.areyoudieting !== undefined &&
      socialHistory?.areyoudieting !== "" &&
      socialHistory?.physicianprescribed !== undefined &&
      socialHistory?.physicianprescribed !== "" &&
      socialHistory?.youeatinanaverageday !== undefined &&
      socialHistory?.youeatinanaverageday !== false &&
      socialHistory?.Ranksaltintake !== undefined &&
      socialHistory?.Ranksaltintake !== false &&
      socialHistory?.Rankfatintake !== undefined &&
      socialHistory?.Rankfatintake !== "" &&
      socialHistory?.Caffeine !== undefined &&
      socialHistory?.Caffeine !== "" &&
      socialHistory?.upscansperday !== undefined &&
      socialHistory?.upscansperday !== ""&&
      socialHistory?.Alcohol !== undefined &&
      socialHistory?.Alcohol !== "" &&
      socialHistory?.Ifyeswhatkind !== undefined &&
      socialHistory?.Ifyeswhatkind !== "" &&
      socialHistory?.manydrinksperweek !== undefined &&
      socialHistory?.manydrinksperweek !== "" &&
      socialHistory?.theamountyoudrink !== undefined &&
      socialHistory?.theamountyoudrink !== "" &&
      socialHistory?.youconsideredstopping !== undefined &&
      socialHistory?.youconsideredstopping !== "" &&
      socialHistory?.everexperiencedblackouts !== undefined &&
      socialHistory?.everexperiencedblackouts !== "" &&
      socialHistory?.Areyoudrinking !== undefined &&
      socialHistory?.Areyoudrinking !== "" &&
      socialHistory?.Doyoudriveafterdrinking !== undefined &&
      socialHistory?.Doyoudriveafterdrinking !== "" &&
      socialHistory?.Doyouusetobacco !== undefined &&
      socialHistory?.Doyouusetobacco !== "" &&
      socialHistory?.Cigarettepkday !== undefined &&
      socialHistory?.Cigarettepkday !== "" &&
      socialHistory?.Cigarettepkdaytext !== undefined &&
      socialHistory?.Cigarettepkdaytext !== "" &&
      socialHistory?.Cigarettepkweektext !== undefined &&
      socialHistory?.Cigarettepkweektext !== "" &&
      socialHistory?.Chewday !== undefined &&
      socialHistory?.Chewday !== "" &&
      socialHistory?.Chewdaytext !== undefined &&
      socialHistory?.Chewdaytext !== "" &&
      socialHistory?.Pipeday !== undefined &&
      socialHistory?.Pipeday !== "" &&
      socialHistory?.Pipedaytext !== undefined &&
      socialHistory?.Pipedaytext !== "" &&
      socialHistory?.Cigarsday !== undefined &&
      socialHistory?.Cigarsday !== "" &&
      socialHistory?.Cigarsdaytext !== undefined &&
      socialHistory?.Cigarsdaytext !== "" &&
      socialHistory?.ofyears !== undefined &&
      socialHistory?.ofyears !== "" &&
      socialHistory?.ofyearstext !== undefined &&
      socialHistory?.ofyearstext !== "" &&
      socialHistory?.Previoustobaccouseryearquit !== undefined &&
      socialHistory?.Previoustobaccouseryearquit !== "" &&
      socialHistory?.Previoustobaccotext !== undefined &&
      socialHistory?.Previoustobaccotext !== "" &&
      socialHistory?.recreationalorstreet !== undefined &&
      socialHistory?.recreationalorstreet !== "" &&
      socialHistory?.streetdrugswithaneedle !== undefined &&
      socialHistory?.streetdrugswithaneedle !== "" &&
      // socialHistory?.discusswiththephysician !== undefined &&
      // socialHistory?.discusswiththephysician !== false &&
      socialHistory?.sexuallyactive !== undefined &&
      socialHistory?.sexuallyactive !== "" &&
      socialHistory?.tryforpregnancy !== undefined &&
      socialHistory?.tryforpregnancy !== "" &&
      socialHistory?.pregnancylistcontraceptive !== undefined &&
      socialHistory?.pregnancylistcontraceptive !== "" &&
      socialHistory?.anydiscomfortwithintercourse !== undefined &&
      socialHistory?.anydiscomfortwithintercourse !== "" &&
      socialHistory?.illnessrelatedtohuman !== undefined &&
      socialHistory?.illnessrelatedtohuman !== "" &&
      socialHistory?.stressmajorproblem !== undefined &&
      socialHistory?.stressmajorproblem !== "" &&
      socialHistory?.feeldepressed !== undefined &&
      socialHistory?.feeldepressed !== "" &&
      socialHistory?.panicwhenstressed !== undefined &&
      socialHistory?.panicwhenstressed !== "" &&
      socialHistory?.problemwitheating !== undefined &&
      socialHistory?.problemwitheating !== "" &&
      socialHistory?.cryfrequently !== undefined &&
      socialHistory?.cryfrequently !== "" &&
      socialHistory?.attemptedsuicide !== undefined &&
      socialHistory?.attemptedsuicide !== "" &&
      socialHistory?.hurtingyourself !== undefined &&
      socialHistory?.hurtingyourself !== "" &&
      socialHistory?.troublesleeping !== undefined &&
      socialHistory?.troublesleeping !== "" &&
      socialHistory?.counselor !== undefined &&
      socialHistory?.counselor !== ""

    ) {
      setCheckFormStep3(false);
    } else {
      setCheckFormStep3(true);
    }
  };
  const isFormStep4 = () => {
    if (
      (personalSafety?.doyoulivealone !== undefined &&
      personalSafety?.doyoulivealone !== "" &&
      personalSafety?.frequentfalls !== undefined &&
      personalSafety?.frequentfalls !== "" &&
      personalSafety?.visionorhearingloss !== undefined &&
      personalSafety?.visionorhearingloss !== "" &&
      personalSafety?.issuewithyourprovider !== undefined &&
      personalSafety?.issuewithyourprovider !== "" &&
      personalSafety?.youhavesunexposure !== undefined &&
      personalSafety?.youhavesunexposure !== false &&
      personalSafety?.experiencedasunburn !== undefined &&
      personalSafety?.experiencedasunburn !== false &&
      personalSafety?.wearyourseatbelt !== undefined &&
      personalSafety?.wearyourseatbelt !== "") &&
    (  
      questionForWomen?.onsetofmenstruation !== undefined &&
      questionForWomen?.onsetofmenstruation !== "" &&
      questionForWomen?.papsmearorpelvicexam !== undefined &&
      questionForWomen?.papsmearorpelvicexam !== "" &&
      questionForWomen?.painordischarge !== undefined &&
      questionForWomen?.painordischarge !== "" &&
      questionForWomen?.Numberofpregnancies !== undefined &&
      questionForWomen?.Numberofpregnancies !== "" &&
      questionForWomen?.Numberoflivebirths !== undefined &&
      questionForWomen?.Numberoflivebirths !== "" &&
      questionForWomen?.pregnantorbreastfeeding !== undefined &&
      questionForWomen?.pregnantorbreastfeeding !== "" &&
      questionForWomen?.hysterectomyorCesarean !== undefined &&
      questionForWomen?.hysterectomyorCesarean !== "" &&
      questionForWomen?.infectionswithinthelastyear !== undefined &&
      questionForWomen?.infectionswithinthelastyear !== "" &&
      questionForWomen?.bloodinyoururine !== undefined &&
      questionForWomen?.bloodinyoururine !== "" &&
      questionForWomen?.controlofurination !== undefined &&
      questionForWomen?.controlofurination !== "" &&
      questionForWomen?.sweatingatnight !== undefined &&
      questionForWomen?.sweatingatnight !== "" &&
      questionForWomen?.aroundtimeofperiod !== undefined &&
      questionForWomen?.aroundtimeofperiod !== "" &&
      questionForWomen?.breastselfexams !== undefined &&
      questionForWomen?.breastselfexams !== "" &&
      questionForWomen?.ornippledischarge !== undefined &&
      questionForWomen?.ornippledischarge !== "" &&
      questionForWomen?.Dateoflastmenstruation !== undefined &&
      questionForWomen?.Dateoflastmenstruation !== "" 
     
    )||
    (
      questionForMen?.urinateduringthenight !== undefined &&
      questionForMen?.urinateduringthenight !== "" &&
      questionForMen?.burningwithurination !== undefined &&
      questionForMen?.burningwithurination !== "" &&
      questionForMen?.yoururine !== undefined &&
      questionForMen?.yoururine !== false &&
      questionForMen?.dischargefrompenis !== undefined &&
      questionForMen?.dischargefrompenis !== "" &&
      questionForMen?.yoururinationdecreased !== undefined &&
      questionForMen?.yoururinationdecreased !== "" &&
      questionForMen?.prostrateinfectionswithin !== undefined &&
      questionForMen?.prostrateinfectionswithin !== "" &&
      questionForMen?.bladdercompletely !== undefined &&
      questionForMen?.bladdercompletely !== "" &&
      questionForMen?.erectionorejaculation !== undefined &&
      questionForMen?.erectionorejaculation !== "" &&
      questionForMen?.painorswelling !== undefined &&
      questionForMen?.painorswelling !== "" &&
      questionForMen?.Dateofastpapsmear !== undefined &&
      questionForMen?.Dateofastpapsmear !== ""
      )

    ) {
      setCheckFormStep4(false);
    } else {
      setCheckFormStep4(true);
    }
  };
  const isFormStep5 = () => {
    if (
      otherInformation?.haveAdvancedDirectives !== undefined &&
      otherInformation?.haveAdvancedDirectives !== "" &&
      otherInformation?.aboutAdvancedDirectives !== undefined &&
      otherInformation?.aboutAdvancedDirectives !== "" &&
      otherInformation?.impactyourhealthcare !== undefined &&
      otherInformation?.impactyourhealthcare !== "" &&
      otherInformation?.pleasedescribe !== undefined &&
      otherInformation?.pleasedescribe !== "" &&
      otherInformation?.newinformationby !== undefined &&
      otherInformation?.newinformationby !== false &&
      otherInformation?.educationcompleted !== undefined &&
      otherInformation?.educationcompleted !== false &&
      otherInformation?.understandEnglish !== undefined &&
      otherInformation?.understandEnglish !== ""&&
      otherInformation?.languagedoyouprefer !== undefined &&
      otherInformation?.languagedoyouprefer !== "" &&
      otherInformation?.currentlyExperiencing !== undefined &&
      otherInformation?.currentlyExperiencing.length>0

    ) {
      setCheckFormStep5(false);
    } else {
      setCheckFormStep5(true);
    }
  };

  const buildPersonalHealthHistory = (name, value) => {
    setPersonalHealthHistory((personalHealthHistory) => ({ ...personalHealthHistory, [name]: value }));
    updateContext();
  }

  const buildMedicalHistory = (name, value) => {
    setMedicalHealthHistory((medicalHealthHistory) => ({ ...medicalHealthHistory, [name]: value }));
    updateContext();
  }

  const buildFamilyMedicalHealthHistory = (name, value) => {
    setFamilyMedicalHealthHistory((familyMedicalHealthHistory) => ({ ...familyMedicalHealthHistory, [name]: value }));
    updateContext();
  }

  const buildSocialHistory =(name, value) => {
     setSocialHistory((socialHistory) => ({ ...socialHistory, [name]: value }));
    console.log(socialHistory , name, value,"socialHistorysocialHistorysocialHistory")
    // await updateContext();
  }

  const buildPersonalSafety = (name, value) => {
    setPersonalSafety((personalSafety) => ({ ...personalSafety, [name]: value }));
    updateContext();
  }

  const buildWomenInformation =(name, value)=>{
    setQuestionForWomen((questionForWomen) => ({ ...questionForWomen, [name]: value }));
    updateContext();
  }

  const buildMenInformation =(name, value)=>{
    setQuestionForMen((questionForMen) => ({ ...questionForMen, [name]: value }));
    updateContext();
  }
  const buildOtherInformation = (name, value) => {
    setOtherInformation((otherInformation) => ({ ...otherInformation, [name]: value }));
    updateContext();
  }

  const generateDocs = (step) => {
    html2canvas(document.getElementById(`pdf-ref2-${step}`)).then(async res => {
      const canvasData = { ...stepCanvas, [step]: res };
      setStepCanvas(canvasData);
      if(step === 6) {
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
    formData.append('originalfilename', 'Health History Form')
    formData.append('priority', '1')
    formData.append('providerid', '1')
    let request = {
      url: `https://appointmentapi.apatternclinic.com//v1/24451/patients/${props.patientid}/documents/admin`,
      data: formData,
    };
    api
      .postAuth(request)
      .then((res) => {
        swal("Health history form successfully submitted", "success");
        props.complete();
      })
      .catch((error) => {
      })
      .finally(() => { setIsLoading(false); });
  };


  const renderform =()=>{
    return(<>
    <div className="health-history-form ">
      {multiStepForm == 1 ? (
        <>
        <div id="pdf-ref2-1">
          <div className="h2 mb-3 fw-bold text-black">Health History Questionare</div>
          <div className="mb-3">
            Please complete this entire questionare. It will provide your care tean
            with important information about your health. All answered contained in
            this questionare are strcitly confidential and will become part of your
            medical record.
          </div>
          <div className="mb-5 row">
            <div className="form-group col-md-6 row align-items-center">
              <label
                htmlFor="staticEmail"
                className="col-sm-6 col-form-label  py-0"
              >
                Number of children:
              </label>
              <div className="col-sm-6 px-0">
                <input
                  type="text"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={personalHealthHistory?.numberOfChildren}
                  onInput={(e) => {
                    buildPersonalHealthHistory("numberOfChildren", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-group col-md-6 row  align-items-center">
              <label
                htmlFor="staticEmail"
                className="col-sm-6 col-form-label py-0"
              >
                How many live with you?
              </label>
              <div className="col-sm-6 px-0">
                <input
                  type="text"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={personalHealthHistory?.liveWithYou}
                  onInput={(e) => {
                    buildPersonalHealthHistory("liveWithYou", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-group col-md-6 row align-items-center">
              <label
                htmlFor="staticEmail"
                className="col-sm-6 col-form-label py-0"
              >
                Occupation is/was:
              </label>
              <div className="col-sm-6 px-0">
                <input
                  type="text"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={personalHealthHistory?.occupation}
                  onInput={(e) => {
                    buildPersonalHealthHistory("occupation", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-group col-md-6 row align-items-center">
              <label
                htmlFor="staticEmail"
                className="col-sm-6 col-form-label py-0"
              >
                Previous or referring doctor:
              </label>
              <div className="col-sm-6 px-0">
                <input
                  type="text"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={personalHealthHistory?.previousorreferringdoctor}
                  onInput={(e) => {
                    buildPersonalHealthHistory("previousorreferringdoctor", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-group col-md-6 row align-items-center">
              <label
                htmlFor="staticEmail"
                className="col-sm-6 col-form-label  py-0"
              >
                Date of last physical exam:
              </label>
              <div className="col-sm-6 px-0">
                <input
                  type="text"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={personalHealthHistory?.dateoflastphysicalexam}
                  onInput={(e) => {
                    buildPersonalHealthHistory("dateoflastphysicalexam", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <div className="h3 tet-uppercase mb-3 fw-bold text-black">
              Personal Health History
            </div>
            <div className="form-group col-md-12 mb-3 row align-items-center">
              <label className="col-sm-4 col-form-label  py-0">
                Childhood Illness:
              </label>
              <div className="col-sm-8 px-0">
                <MultiSelect
                  options={childHoodIllnessOptions}
                  value={patientContext?.patientDetails?.healthHistoryData?.personalHealthHistory?.childHoodIllness || []}
                  onChange={(e) => { buildPersonalHealthHistory('childHoodIllness', e) }}
                  labelledBy="Select"
                />
              </div>
            </div>
            <div className="form-group col-md-12 mb-3 row align-items-center">
              <label className="col-sm-4 col-form-label  py-0">
                Immunization And Dates:
              </label>
              <div className="col-sm-8 px-0">
                <MultiSelect
                  options={immunizationAndDatesOptions}
                  value={patientContext?.patientDetails?.healthHistoryData?.personalHealthHistory?.immunizationAndDates || []}
                  onChange={(e) => { buildPersonalHealthHistory('immunizationAndDates', e) }}
                  labelledBy="Select"
                />
              </div>
            </div>
            <div className="form-group col-md-12  row align-items-center">
              <label className="col-sm-4 col-form-label  py-0">
                Tests/Screenings and Dates:
              </label>
              <div className="col-sm-8 px-0">
                <MultiSelect
                  options={testingOptions}
                  value={patientContext?.patientDetails?.healthHistoryData?.personalHealthHistory?.testing || []}
                  onChange={(e) => { buildPersonalHealthHistory('testing', e) }}
                  labelledBy="Select"
                />
              </div>
            </div>
          </div>
          <div className="mb-5 border border-1 rounded-1 border-grey p-3">
            <div className="mb-3 fw-bold">Surgeries:</div>
            {surgeries.map((item, index) => {
              return (
                <div className="row mb-5">
                  <div className="form-group col-md-4 mb-2">
                    <div className="row w-100 align-items-center">
                      <label
                        htmlFor="staticEmail"
                        className="col-sm-4 col-form-label  py-0"
                      >
                        Year:
                      </label>
                      <div className="col-sm-8 px-0">
                        <input
                          type="text"
                          className="form-control mb-1"
                          id="staticEmail"

                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-8 mb-2">
                    <div className="row w-100 align-items-center">
                      <label
                        htmlFor="staticEmail"
                        className="col-sm-2 col-form-label py-0"
                      >
                        Reason
                      </label>
                      <div className="col-sm-10 px-0">
                        <input
                          type="text"
                          className="form-control mb-1"
                          id="staticEmail"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-md-12 mb-2">
                    <div className="row w-100 align-items-center">
                      <label
                        htmlFor="staticEmail"
                        className="col-sm-2 col-form-label py-0"
                      >
                        Hospital:
                      </label>
                      <div className="col-sm-10 px-0">
                        <input
                          type="text"
                          className="form-control mb-1"
                          id="staticEmail"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="w-100 mb-3 text-end">
              {surgeries.length > 1 && (
                <button
                  className="btn btn-sm me-2 btn-primary"
                  onClick={() => handleSurgerBlock("remove")}
                >
                  -
                </button>
              )}
              <button
                className='buttonDiv'
                onClick={() => handleSurgerBlock("add")}
              >
                Add More
              </button>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={""}
                id="flexCheckDefault"
              // onChange={(e) =>
              //   buildPersonalHealthHistory("ihavehadnosurgeries", e.target.checked)
              // }
              />
              <label className="form-check-label" for="flexCheckDefault">
                I have had no surgeries.
              </label>
            </div>
          </div>

          <div className="mb-5 border border-1 rounded-1 border-grey p-3">
            <div className="mb-3 fw-bold">Other Hospitalization:</div>
            {/* {otherHospitalization.map((item, index) => {
              return ( */}
            <div className="row mb-5">
              <div className="form-group col-md-4 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label  py-0"
                  >
                    Year:
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      value={personalHealthHistory?.years}
                      id="staticEmail"
                      onInput={(e) => {
                        buildPersonalHealthHistory("years", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-8 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-2 col-form-label py-0"
                  >
                    Reason
                  </label>
                  <div className="col-sm-10 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={personalHealthHistory?.reason}
                      onInput={(e) => {
                        buildPersonalHealthHistory("reason", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-12 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-2 col-form-label py-0"
                  >
                    Hospital:
                  </label>
                  <div className="col-sm-10 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={personalHealthHistory?.hospital}
                      onInput={(e) => {
                        buildPersonalHealthHistory("hospital", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* );
            })} */}
            {/* <div className="w-100 mb-3 text-end">
              {otherHospitalization.length > 1 && (
                <button
                  className="btn btn-sm me-2 btn-primary"
                  onClick={() => handleOtherHospitalization("remove")}
                >
                  -
                </button>
              )}
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleOtherHospitalization("add")}
              >
                +
              </button>
            </div> */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={personalHealthHistory?.neverHospitalized}
                onChange={(e) => { buildPersonalHealthHistory('neverHospitalized', e.target.checked) }}
                id="flexCheckDefault"
              />
              <label className="form-check-label" for="flexCheckDefault">
                I have never been hospitalized.
              </label>
            </div>
          </div>
          <div className='form-group mb-3 row g-0 w-100'>
            <label className="label d-block ">Have you ever been had a blood transfusion?</label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" name="inlineRadioOptions"
                checked={personalHealthHistory?.bloodtransfusion == "yes"}
                onChange={(e) => {
                  buildPersonalHealthHistory("bloodtransfusion", e.target.value);
                }}
                id="inlineRadio1" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" name="inlineRadioOptions"
                checked={personalHealthHistory?.bloodtransfusion == "no"}
                onChange={(e) => {
                  buildPersonalHealthHistory("bloodtransfusion", e.target.value);
                }}
                id="inlineRadio2" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>
          </div>
          <div className="mb-5 border border-1 rounded-1 border-grey p-3">
            <label className="label d-block ">Please list other physicians you have seen in the last 12 months, and for what reason</label>
            <div className="mb-3">
              <textarea rows="4"
                value={personalHealthHistory?.pleaselistotherphysicians}
                onInput={(e) => {
                  buildPersonalHealthHistory("pleaselistotherphysicians", e.target.value);
                }}
                className="form-control"></textarea>
            </div>
          </div>
        </div>
          <div className="mt-3 text-end" type="button">
            <button onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              props.back()
            }} className='buttonDiv' >
              back
            </button>
            <button
              disabled={checkFormStep1}
              onClick={() => {
                generateDocs(1);
              }}
              className='buttonDiv nextButton'
            >
              Continue
            </button>
          </div>
        </>
      ) : multiStepForm == 2 ? (
        <>
        <div id="pdf-ref2-2">
          <div className="h2 mb-3 fw-bold text-black">Your Medical History</div>
          <div className="mb-3">
            Please indicate if YOU have a history of the following:
          </div>
          <div className=" px-0 mb-5">
            <MultiSelect
              options={medicalHistoryOptions}
              value={patientContext?.patientDetails?.healthHistoryData?.medicalHealthHistory?.medicalHistory || []}
              onChange={(e) => { buildMedicalHistory('medicalHistory', e) }}
              labelledBy="Select"
            />
          </div>
          <div className="mb-5 border border-1 rounded-1 border-grey p-3">
            <label className="label d-block ">List other past medical problems:</label>
            <div className="mb-3">
              <textarea rows="4"
                value={medicalHealthHistory?.listPastmedicalproblems}
                onInput={(e) => {
                  buildMedicalHistory("listPastmedicalproblems", e.target.value);
                }}
                className="form-control"></textarea>
            </div>
          </div>
          <div className="mb-5 border border-1 rounded-1 border-grey p-3">
            <div className="mb-3 fw-bold">List your prescribed drugs and over-the-counter drugs, such as vitamins and inhalers:</div>
            <div className="row mb-5">
              <div className="form-group col-md-5 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label  py-0"
                  >
                    Drug:
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={medicalHealthHistory?.drug}
                      onInput={(e) => {
                        buildMedicalHistory("drug", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-7 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label py-0"
                  >
                    Dose/Frequency
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={medicalHealthHistory?.doseFrequency}
                      onInput={(e) => {
                        buildMedicalHistory("doseFrequency", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-check ">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                defaultChecked={medicalHealthHistory?.listDrugsOfQuestionnaire}
                onChange={(e) =>
                  buildMedicalHistory("listDrugsOfQuestionnaire", e.target.checked)
                }
              />
              <label className="form-check-label" for="flexCheckDefault">
                List additional drugs on back of questionnaire
              </label>
            </div>
            <div className="form-check mb-5">
              <input
                className="form-check-input"
                type="checkbox"
                id="medicationsVitamins"
                defaultChecked={medicalHealthHistory?.medicationsVitamins}
                onChange={(e) =>
                  buildMedicalHistory("medicationsVitamins", e.target.checked)
                }
              />
              <label className="form-check-label" for="flexCheckDefault">
                I take no medications, vitamins, herbals, or any other over-the-counter preparations
              </label>
            </div>
            <div className="row mb-5">
              <div className="form-group col-md-5 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label  py-0"
                  >
                    Allergies Name:
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={medicalHealthHistory?.allergiesName}
                      onInput={(e) => {
                        buildMedicalHistory("allergiesName", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-7 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label py-0"
                  >
                    Reaction You Had
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={medicalHealthHistory?.reactionYouHad}
                      onInput={(e) => {
                        buildMedicalHistory("reactionYouHad", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h2 mb-3 fw-bold text-black">Family Medical History </div>
            <div className="mb-3">
              Please indicate if YOUR FAMILY has a history of the following: (ONLY include parents, grandparents, siblings, and children)
            </div>
            <div className=" px-0 mb-5">
              <MultiSelect
                options={familyMedicalHistoryOptions}
                value={patientContext?.patientDetails?.healthHistoryData?.familyMedicalHealthHistory?.familyMedicalHistory || []}
                onChange={(e) => { buildFamilyMedicalHealthHistory('familyMedicalHistory', e) }}
                labelledBy="Select"
              />
            </div>
          </div>
        </div>
          <div className="mt-3 text-end" type="button">
            <button
              disabled={checkFormStep2}
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                setMultiStepForm(1);
              }}
              className='buttonDiv'
            >
              Back
            </button>
            <button
              disabled={checkFormStep2}
              onClick={() => generateDocs(2)}
              className='buttonDiv nextButton'
            >
              Continue
            </button>
          </div>
        </>
      ) : multiStepForm == 3 ? (
        <>
        <div id="pdf-ref2-3">
          <div className="h2 mb-3 fw-bold text-black">Social History</div>
          <div className="mb-3">
            ALL QUESTIONS CONTAINED IN THIS QUESTIONNAIRE ARE OPTIONAL AND WILL BE KEPT STRICTLY CONFIDENTIAL
          </div>
          <div className="fw-bold h4 text-black">Exercise</div>
          <div className='form-group mb-5 row g-0 w-100 border border-grey rounded-1 p-3'>
            <label className="label d-block ">Do you exercise? </label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input"
                type="radio"
                name="doyouexercise"
                id="inlineRadio1"
                onChange={(e) => {buildSocialHistory('doyouexercise', e.target.value) }} 
                checked={socialHistory?.doyouexercise == "yes"}
                value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio"
                name="doyouexercise"
                onChange={(e) => {buildSocialHistory('doyouexercise', e.target.value) }} checked={socialHistory?.doyouexercise == "no"}
                id="inlineRadio2" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>
            <div className="form-group mb-2">
              <div className="row w-100 align-items-center">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label  py-0"
                >
                  If yes, how many minutes per week?
                </label>
                <div className="col-sm-6 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    name="howmanymin"
                    value={socialHistory?.howmanymin}
                    onChange={(e) => {
                      buildSocialHistory("howmanymin", e.target.value);
                    }}
                    id="staticEmail"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="fw-bold h4 text-black">Diet</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Are you dieting? </label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('areyoudieting', e.target.value) }} checked={socialHistory?.areyoudieting == 'yes'}
                name="areyoudieting" id="inlineRadio3" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('areyoudieting', e.target.value) }} checked={socialHistory?.areyoudieting == 'no'}
                name="areyoudieting" id="inlineRadio4" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">If yes, are you on a physician prescribed medical diet? </label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('physicianprescribed', e.target.value) }} checked={socialHistory?.physicianprescribed == 'yes'}
                name="physicianprescribed" id="inlineRadio5" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>

            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('physicianprescribed', e.target.value) }} checked={socialHistory?.physicianprescribed == 'no'}
                name="physicianprescribed" id="inlineRadio6" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group mt-2 mb-3">
              <div className="row w-100 align-items-center">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label label  py-0"
                >
                  # of meals you eat in an average day?
                </label>
                <div className="col-sm-6 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={socialHistory?.youeatinanaverageday}
                    onInput={(e) => {
                      buildSocialHistory("youeatinanaverageday", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <label className="label d-block ">Rank salt intake </label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" name="Ranksaltintake" 
              checked={socialHistory?.Ranksaltintake == "high"}
              onChange={(e) => {
                buildSocialHistory("Ranksaltintake", e.target.value);}}
              id="inlineRadio7" value="high" />
              <label className="form-check-label" htmlFor="inlineRadio1">Hi</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" name="Ranksaltintake" 
              checked={socialHistory?.Ranksaltintake == "mid"}
              onChange={(e) => {
                buildSocialHistory("Ranksaltintake", e.target.value);}}
              id="inlineRadio8" value="mid" />
              <label className="form-check-label" htmlFor="inlineRadio1">Mid</label>
            </div>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" name="Ranksaltintake" 
              checked={socialHistory?.Ranksaltintake == "low"}
              onChange={(e) => {
                buildSocialHistory("Ranksaltintake", e.target.value);}}
              id="inlineRadio9" value="low" />
              <label className="form-check-label" htmlFor="inlineRadio1">Low</label>
            </div>

            <label className="label d-block ">Rank fat intake </label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" name="Rankfatintake"
               checked={socialHistory?.Rankfatintake == "high"}
               onChange={(e) => {
                 buildSocialHistory("Rankfatintake", e.target.value);}}
              id="inlineRadio10" value="high" />
              <label className="form-check-label" htmlFor="inlineRadio1">Hi</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" name="Rankfatintake" 
               checked={socialHistory?.Rankfatintake == "mid"}
               onChange={(e) => {
                 buildSocialHistory("Rankfatintake", e.target.value);}}
              id="inlineRadio11" value="mid" />
              <label className="form-check-label" htmlFor="inlineRadio1">Mid</label>
            </div>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" name="Rankfatintake" 
              checked={socialHistory?.Rankfatintake == "low"}
              onChange={(e) => {
                buildSocialHistory("Rankfatintake", e.target.value);}}
              id="inlineRadio12" value="low" />
              <label className="form-check-label" htmlFor="inlineRadio1">Low</label>
            </div>
          </div>

          <div className="fw-bold h4 text-black">Caffeine</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Caffeine </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              checked={socialHistory?.Caffeine == "none"}
              onChange={(e) => {
                buildSocialHistory("Caffeine", e.target.value);
              }}
              name="Caffeine" id="inlineRadio13" value="none" />
              <label className="form-check-label" htmlFor="inlineRadio1">None</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              checked={socialHistory?.Caffeine == "coffee"}
              onChange={(e) => {
                buildSocialHistory("Caffeine", e.target.value);
              }}
              name="Caffeine" id="inlineRadio14" value="coffee" />
              <label className="form-check-label" htmlFor="inlineRadio1">Coffee</label>
            </div>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio"
              checked={socialHistory?.Caffeine == "Tea"}
              onChange={(e) => {
                buildSocialHistory("Caffeine", e.target.value);
              }}
              name="Caffeine" id="inlineRadio15" value="Tea" />
              <label className="form-check-label" htmlFor="inlineRadio1">Tea</label>
            </div>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" 
              checked={socialHistory?.Caffeine == "cola"}
              onChange={(e) => {
                buildSocialHistory("Caffeine", e.target.value);
              }}
              name="Caffeine" id="inlineRadio16" value="cola" />
              <label className="form-check-label" htmlFor="inlineRadio1">Cola</label>
            </div>

            <div className="form-group mt-2 mb-3">
              <div className="row w-100 align-items-center">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label label  py-0"
                >
                  # of cups/cans per day?
                </label>
                <div className="col-sm-6 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={socialHistory?.upscansperday}
                    onInput={(e) => {
                      buildSocialHistory("upscansperday", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="fw-bold h4 text-black">Alcohol</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Alcohol </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" name="Alcohol"
               onChange={(e) => { buildSocialHistory('Alcohol', e.target.value) }} checked={socialHistory?.Alcohol == 'yes'}
              id="inlineRadio23" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('Alcohol', e.target.value) }} checked={socialHistory?.Alcohol == 'no'}
              name="Alcohol" id="inlineRadio24" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group g-0 row mt-2 mb-3">
              <div className="row col-md-6 px-0 align-items-center">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label label  py-0"
                >
                  If yes, what kind?
                </label>
                <div className="col-sm-6 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={
                      socialHistory?.Ifyeswhatkind
                    }
                    onInput={(e) =>
                      buildSocialHistory("Ifyeswhatkind", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="row  col-md-6 px-0 align-items-center">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label label  py-0"
                >
                  How many drinks per week?
                </label>
                <div className="col-sm-6 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={
                      socialHistory?.manydrinksperweek
                    }
                    onInput={(e) =>
                      buildSocialHistory("manydrinksperweek", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Alcohol */}
            <label className="label d-block mt-1">Are you concerned about the amount you drink? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('theamountyoudrink', e.target.value) }} checked={socialHistory?.theamountyoudrink == 'yes'}
              name="theamountyoudrink" id="inlineRadio33" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('theamountyoudrink', e.target.value) }} checked={socialHistory?.theamountyoudrink == 'no'}
              name="theamountyoudrink" id="inlineRadio34" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block mt-1">Have you considered stopping? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('youconsideredstopping', e.target.value) }} checked={socialHistory?.youconsideredstopping == 'yes'}
              name="youconsideredstopping" id="inlineRadio35" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('youconsideredstopping', e.target.value) }} checked={socialHistory?.youconsideredstopping == 'no'}
              name="youconsideredstopping" id="inlineRadio36" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block mt-1">Have you ever experienced blackouts?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('everexperiencedblackouts', e.target.value) }} checked={socialHistory?.everexperiencedblackouts == 'yes'}
              name="everexperiencedblackouts" id="inlineRadio37" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('everexperiencedblackouts', e.target.value) }} checked={socialHistory?.everexperiencedblackouts == 'no'}
              name="everexperiencedblackouts" id="inlineRadio38" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block mt-1">Are you prone to “binge” drinking?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
               onChange={(e) => { buildSocialHistory('Areyoudrinking', e.target.value) }} checked={socialHistory?.Areyoudrinking == 'yes'}
              name="Areyoudrinking" id="inlineRadio39" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('Areyoudrinking', e.target.value) }} checked={socialHistory?.Areyoudrinking == 'no'}
              name="Areyoudrinking" id="inlineRadio40" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block mt-1">Do you drive after drinking?.</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('Doyoudriveafterdrinking', e.target.value) }} checked={socialHistory?.Doyoudriveafterdrinking == 'yes'}
              name="Doyoudriveafterdrinking" id="inlineRadio41" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('Doyoudriveafterdrinking', e.target.value) }} checked={socialHistory?.Doyoudriveafterdrinking == 'no'}
              name="Doyoudriveafterdrinking" id="inlineRadio42" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>
          </div>

          <div className="fw-bold h4 text-black">Tobacco</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Do you use tobacco? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
               onChange={(e) => { buildSocialHistory('Doyouusetobacco', e.target.value) }} checked={socialHistory?.Doyouusetobacco == 'yes'}
              name="Doyouusetobacco" id="inlineRadio23" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('Doyouusetobacco', e.target.value) }} checked={socialHistory?.Doyouusetobacco == 'no'}
              name="Doyouusetobacco" id="inlineRadio24" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group g-0 row mt-2 mb-3">
              <div class="form-check form-check-inline col-md-8 mx-0">
                <input className="form-check-input mt-2" type="checkbox"
                 defaultChecked={socialHistory?.Cigarettepkday}
                 onChange={(e) =>
                  buildSocialHistory("Cigarettepkday", e.target.checked)
                 }
                id="TermAndConditions" />
                <label className="form-check-label me-2" htmlFor="TermAndConditions">Cigarettes – pks./day  </label>
                <input className="form-control w-80 py-0 d-inline" 
                 type='text'
                 value={
                   socialHistory?.Cigarettepkdaytext
                 }
                 onInput={(e) =>
                   buildSocialHistory("Cigarettepkdaytext", e.target.value)
                 }
                />
                <label className="form-check-label me-2" htmlFor="TermAndConditions">or pks./week </label>
                <input className="form-control w-80 py-0 d-inline"
                 type='text'
                 value={
                   socialHistory?.Cigarettepkweektext
                 }
                 onInput={(e) =>
                   buildSocialHistory("Cigarettepkweektext", e.target.value)
                 }
                />
              </div>
              <div class="form-check form-check-inline col-md-4 mx-0">
                <input className="form-check-input mt-2" type="checkbox" 
                 defaultChecked={socialHistory?.Chewday}
                 onChange={(e) =>
                  buildSocialHistory("Chewday", e.target.checked)
                 }
                id="TermAndConditions" />
                <label className="form-check-label me-2" htmlFor="TermAndConditions">Chew – #/day  </label>
                <input className="form-control w-80 py-0 d-inline"
                 type='text'
                 value={
                   socialHistory?.Chewdaytext
                 }
                 onInput={(e) =>
                   buildSocialHistory("Chewdaytext", e.target.value)
                 }
                />
              </div>
              <div class="form-check form-check-inline col-md-4 mx-0">
                <input className="form-check-input mt-2" type="checkbox"
                 defaultChecked={socialHistory?.Pipeday}
                 onChange={(e) =>
                  buildSocialHistory("Pipeday", e.target.checked)
                 }
                id="TermAndConditions" />
                <label className="form-check-label me-2" htmlFor="TermAndConditions">Pipe – #/day  </label>
                <input className="form-control w-80 py-0 d-inline"
                 type='text'
                 value={
                   socialHistory?.Pipedaytext
                 }
                 onInput={(e) =>
                   buildSocialHistory("Pipedaytext", e.target.value)
                 }
                />
              </div>
              <div class="form-check form-check-inline col-md-4 mx-0">
                <input className="form-check-input mt-2" type="checkbox" 
                 defaultChecked={socialHistory?.Cigarsday}
                 onChange={(e) =>
                  buildSocialHistory("Cigarsday", e.target.checked)
                 }
                id="TermAndConditions" />
                <label className="form-check-label me-2" htmlFor="TermAndConditions">Cigars – #/day  </label>
                <input className="form-control w-80 py-0 d-inline"
                 type='text'
                 value={
                   socialHistory?.Cigarsdaytext
                 }
                 onInput={(e) =>
                   buildSocialHistory("Cigarsdaytext", e.target.value)
                 }
                />
              </div>
              <div class="form-check form-check-inline col-md-4 mx-0">
                <input className="form-check-input mt-2" type="checkbox" 
                 defaultChecked={socialHistory?.ofyears}
                 onChange={(e) =>
                  buildSocialHistory("ofyears", e.target.checked)
                 }
                id="TermAndConditions" />
                <label className="form-check-label me-2" htmlFor="TermAndConditions"> # of years  </label>
                <input className="form-control w-80 py-0 d-inline"
                 type='text'
                 value={
                   socialHistory?.ofyearstext
                 }
                 onInput={(e) =>
                   buildSocialHistory("ofyearstext", e.target.value)
                 }
                />
              </div>
              <div class="form-check form-check-inline col-md-8 mx-0">
                <input className="form-check-input mt-2" type="checkbox" 
                 defaultChecked={socialHistory?.Previoustobaccouseryearquit}
                 onChange={(e) =>
                  buildSocialHistory("Previoustobaccouseryearquit", e.target.checked)
                 }
                id="TermAndConditions" />
                <label className="form-check-label me-2" htmlFor="TermAndConditions">  Previous tobacco user - year quit  </label>
                <input className="form-control w-80 py-0 d-inline"
                type='text'
                value={
                  socialHistory?.Previoustobaccotext
                }
                onInput={(e) =>
                  buildSocialHistory("Previoustobaccotext", e.target.value)
                }
                />
              </div>
            </div>

          </div>

          <div className="fw-bold h4 text-black">Drugs</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Do you currently use recreational or street drugs? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => { buildSocialHistory('recreationalorstreet', e.target.value) }} checked={socialHistory?.recreationalorstreet == 'yes'}
              name="recreationalorstreet" id="inlineRadio435" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
               onChange={(e) => { buildSocialHistory('recreationalorstreet', e.target.value) }} checked={socialHistory?.recreationalorstreet == 'no'}
              name="recreationalorstreet" id="inlineRadio245" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Have you ever given yourself street drugs with a needle? . </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
               onChange={(e) => { buildSocialHistory('streetdrugswithaneedle', e.target.value) }} checked={socialHistory?.streetdrugswithaneedle == 'yes'}
              name="streetdrugswithaneedle" id="inlineRadio253" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
               onChange={(e) => { buildSocialHistory('streetdrugswithaneedle', e.target.value) }} checked={socialHistory?.streetdrugswithaneedle == 'no'}
              name="streetdrugswithaneedle" id="inlineRadio244" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>
            <div className="form-check my-3">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={socialHistory?.discusswiththephysician}
                onChange={(e) =>
                  buildSocialHistory("discusswiththephysician", e.target.checked)
                }
                id="flexCheckDefault"
              />
              <label className="form-check-label" for="flexCheckDefault">
                I prefer to discuss with the physician.
              </label>
            </div>
          </div>

          <div className="fw-bold h4 text-black">Sex</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Are you sexually active? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
              onChange={(e) => { buildSocialHistory('sexuallyactive', e.target.value) }} checked={socialHistory?.sexuallyactive == 'yes'}
              name="sexuallyactive" id="inlineRadio4345" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => { buildSocialHistory('sexuallyactive', e.target.value) }} checked={socialHistory?.sexuallyactive == 'no'}
              name="sexuallyactive" id="inlineRadio2445" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">If yes, are you and your partner trying for a pregnancy?  </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
              onChange={(e) => { buildSocialHistory('tryforpregnancy', e.target.value) }} checked={socialHistory?.tryforpregnancy == 'yes'}
              name="tryforpregnancy" id="inlineRadio2853" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => { buildSocialHistory('tryforpregnancy', e.target.value) }} checked={socialHistory?.tryforpregnancy == 'no'}
              name="tryforpregnancy" id="inlineRadio2440" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group w-100 g-0  my-2 row align-items-center">
              <label
                htmlFor="staticEmail"
                className="col-sm-12 label col-form-label mb-0 py-0"
              >
                If not trying for a pregnancy list contraceptive or barrier method used
              </label>
              <div className="col-sm-12 px-0">
                <input
                  type="text"
                  className="form-control py-0 "
                  id="staticEmail"
                  value={socialHistory?.pregnancylistcontraceptive}
                  onChange={(e) => {
                    buildSocialHistory("pregnancylistcontraceptive", e.target.value);
                  }}
                />
              </div>
            </div>

            <label className="label d-block ">Any discomfort with intercourse? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
              onChange={(e) => { buildSocialHistory('anydiscomfortwithintercourse', e.target.value) }} checked={socialHistory?.anydiscomfortwithintercourse == 'yes'}
              name="anydiscomfortwithintercourse" id="inlineRadio2853" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => { buildSocialHistory('anydiscomfortwithintercourse', e.target.value) }} checked={socialHistory?.anydiscomfortwithintercourse == 'no'}
              name="anydiscomfortwithintercourse" id="inlineRadio2440" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Illness related to Human Immunodeficiency Virus (HIV), such as AIDS, has become a major public health problem. Risk factors for this illness include intravenous drug use and unprotected sexual intercourse. Would you like to speak with your provider about your risk of this illness? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
              onChange={(e) => { buildSocialHistory('illnessrelatedtohuman', e.target.value) }} checked={socialHistory?.illnessrelatedtohuman == 'yes'}
              name="illnessrelatedtohuman" id="inlineRadio2853" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => { buildSocialHistory('illnessrelatedtohuman', e.target.value) }} checked={socialHistory?.illnessrelatedtohuman == 'no'}
              name="illnessrelatedtohuman" id="inlineRadio2440" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

          </div>

          <div className="fw-bold h4 text-black">Mental Health </div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Is stress a major problem for you? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('stressmajorproblem', e.target.value) }} checked={socialHistory?.stressmajorproblem == 'yes'}
                name="stressmajorproblem" id="inlineRadio43545" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input"
                onChange={(e) => { buildSocialHistory('stressmajorproblem', e.target.value) }} checked={socialHistory?.stressmajorproblem == 'no'}
                type="radio" name="stressmajorproblem" id="inlineRadio24645" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you feel depressed?   </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('feeldepressed', e.target.value) }} checked={socialHistory?.feeldepressed == 'yes'}
                name="feeldepressed" id="inlineRadio28553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('feeldepressed', e.target.value) }} checked={socialHistory?.feeldepressed == 'no'}
                name="feeldepressed" id="inlineRadio24540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you panic when stressed? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('panicwhenstressed', e.target.value) }} checked={socialHistory?.panicwhenstressed == 'yes'}
                name="panicwhenstressed" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('panicwhenstressed', e.target.value) }} checked={socialHistory?.panicwhenstressed == 'no'}
                name="panicwhenstressed" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have problems with eating or your appetite? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('problemwitheating', e.target.value) }} checked={socialHistory?.problemwitheating == 'yes'}
                name="problemwitheating" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('problemwitheating', e.target.value) }} checked={socialHistory?.problemwitheating == 'no'}
                name="problemwitheating" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you cry frequently? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('cryfrequently', e.target.value) }} checked={socialHistory?.cryfrequently == 'yes'}
                name="cryfrequently" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('cryfrequently', e.target.value) }} checked={socialHistory?.cryfrequently == 'no'}
                name="cryfrequently" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Have you ever attempted suicide?  </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('attemptedsuicide', e.target.value) }} checked={socialHistory?.attemptedsuicide == 'yes'}
                name="attemptedsuicide" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('attemptedsuicide', e.target.value) }} checked={socialHistory?.attemptedsuicide == 'no'}
                name="attemptedsuicide" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Have you ever seriously thought about hurting yourself? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('hurtingyourself', e.target.value) }} checked={socialHistory?.hurtingyourself == 'yes'}
                name="hurtingyourself" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('hurtingyourself', e.target.value) }} checked={socialHistory?.hurtingyourself == 'no'}
                name="hurtingyourself" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have trouble sleeping?  </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('troublesleeping', e.target.value) }} checked={socialHistory?.troublesleeping == 'yes'}
                name="troublesleeping" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('troublesleeping', e.target.value) }} checked={socialHistory?.troublesleeping == 'no'}
                name="troublesleeping" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Have you ever been to a counselor? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('counselor', e.target.value) }} checked={socialHistory?.counselor == 'yes'}
                name="counselor" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => { buildSocialHistory('counselor', e.target.value) }} checked={socialHistory?.counselor == 'no'}
                name="counselor" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

          </div>
        </div>

          <div className="mt-3 text-end" type="button">
            <button
              onClick={() => {
                setMultiStepForm(2);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className='buttonDiv'
            >
              Back
            </button>
            <button
              disabled={checkFormStep3}
              onClick={() => generateDocs(3)}
              className='buttonDiv nextButton'
            >
              Continue
            </button>
          </div>
        </>
      ) : multiStepForm == 4 ? (
        <>
        <div id="pdf-ref2-4">
          <div className="h2 mb-3 fw-bold text-black">Personal Safety</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Do you live alone?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('doyoulivealone', e.target.value) }} 
              checked={personalSafety?.doyoulivealone == "yes"}
              name="doyoulivealone" id="inlineRadio43545" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('doyoulivealone', e.target.value) }} 
              checked={personalSafety?.doyoulivealone == "no"}
              name="doyoulivealone" id="inlineRadio24645" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have frequent falls?  </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('frequentfalls', e.target.value) }} 
              checked={personalSafety?.frequentfalls == "yes"}
              name="frequentfalls" id="inlineRadio28553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('frequentfalls', e.target.value) }} 
              checked={personalSafety?.frequentfalls == "no"}
              name="frequentfalls" id="inlineRadio24540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have vision or hearing loss? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('visionorhearingloss', e.target.value) }} 
              checked={personalSafety?.visionorhearingloss == "yes"}
              name="visionorhearingloss" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('visionorhearingloss', e.target.value) }} 
              checked={personalSafety?.visionorhearingloss == "no"}
              name="visionorhearingloss" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Physical and/or mental abuse have also become major public health issues in this country. This often takes the form of verbally threatening behavior or actual physical or sexual abuse. Would you like to discuss this issue with your provider? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('issuewithyourprovider', e.target.value) }} 
              checked={personalSafety?.issuewithyourprovider == "yes"}
              name="issuewithyourprovider" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('issuewithyourprovider', e.target.value) }} 
              checked={personalSafety?.issuewithyourprovider == "no"}
              name="issuewithyourprovider" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">How often do you have sun exposure? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('youhavesunexposure', e.target.value) }} 
              checked={personalSafety?.youhavesunexposure == "occasionally"}
              name="youhavesunexposure" id="inlineRadio285553" value="occasionally" />
              <label className="form-check-label" htmlFor="inlineRadio1">Occasionally</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('youhavesunexposure', e.target.value) }} 
              checked={personalSafety?.youhavesunexposure == "frequently"}
              name="youhavesunexposure" id="inlineRadio2540" value="frequently" />
              <label className="form-check-label" htmlFor="inlineRadio1">Frequently</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('youhavesunexposure', e.target.value) }} 
              checked={personalSafety?.youhavesunexposure == "rarely"}
              name="youhavesunexposure" id="inlineRadio2540" value="rarely" />
              <label className="form-check-label" htmlFor="inlineRadio1">Rarely</label>
            </div>

            <label className="label d-block ">Have you ever experienced a sunburn?  </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('experiencedasunburn', e.target.value) }} 
              checked={personalSafety?.experiencedasunburn == "yes"}
              name="experiencedasunburn" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('experiencedasunburn', e.target.value) }} 
              checked={personalSafety?.experiencedasunburn == "no"}
              name="experiencedasunburn" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">How often do you wear your seatbelt?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('wearyourseatbelt', e.target.value) }} 
              checked={personalSafety?.wearyourseatbelt == "occasionally"}
              name="wearyourseatbelt" id="inlineRadio285553" value="occasionally" />
              <label className="form-check-label" htmlFor="inlineRadio1">Occasionally</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('wearyourseatbelt', e.target.value) }} 
              checked={personalSafety?.wearyourseatbelt == "frequently"}
              name="wearyourseatbelt" id="inlineRadio2540" value="frequently" />
              <label className="form-check-label" htmlFor="inlineRadio1">Frequently</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
              onChange={(e) => {buildPersonalSafety('wearyourseatbelt', e.target.value) }} 
              checked={personalSafety?.wearyourseatbelt == "rarely"}
              name="wearyourseatbelt" id="inlineRadio2540" value="rarely" />
              <label className="form-check-label" htmlFor="inlineRadio1">Rarely</label>
            </div>

          </div>

          <div className="fw-bold h4 text-black">These questions are for WOMEN ONLY </div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <div className="row g-0 ">
              <div className="form-group col-md-7 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label  py-0"
                  >
                    Age at onset of menstruation:
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        questionForWomen?.onsetofmenstruation
                      }
                      onInput={(e) =>
                        buildWomenInformation("onsetofmenstruation", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-5 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-6 col-form-label py-0"
                  >
                    Date of last menstruation:
                  </label>
                  <div className="col-sm-6 px-0">
                    <input
                      type="date"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        questionForWomen?.Dateoflastmenstruation
                      }
                      onChange={(e) => buildWomenInformation("Dateoflastmenstruation", e.target.value)}
                      
                    />
                  </div>
                </div>
              </div>
            </div>

            <label className="label d-block ">Heavy periods, irregularity, spotting, pain, or discharge? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('painordischarge', e.target.value) }} 
               checked={questionForWomen?.painordischarge == "yes"}
              name="painordischarge" id="inlineRadio28553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('painordischarge', e.target.value) }} 
               checked={questionForWomen?.painordischarge == "no"}
              name="painordischarge" id="inlineRadio24540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="row g-0 ">
              <div className="form-group col-md-7 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label label  py-0"
                  >
                    Number of pregnancies:
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        questionForWomen?.Numberofpregnancies
                      }
                      onInput={(e) =>
                        buildWomenInformation("Numberofpregnancies", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="form-group col-md-5 mb-2">
                <div className="row w-100 align-items-center">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-6 label col-form-label py-0"
                  >
                    Number of live births:
                  </label>
                  <div className="col-sm-6 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        questionForWomen?.Numberoflivebirths
                      }
                      onInput={(e) =>
                        buildWomenInformation("Numberoflivebirths", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <label className="label d-block ">Are you pregnant or breastfeeding? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('pregnantorbreastfeeding', e.target.value) }} 
               checked={questionForWomen?.pregnantorbreastfeeding == "yes"}
              name="pregnantorbreastfeeding" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('pregnantorbreastfeeding', e.target.value) }} 
               checked={questionForWomen?.pregnantorbreastfeeding == "no"}
              name="pregnantorbreastfeeding" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Have you had a D&C, hysterectomy, or Cesarean? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('hysterectomyorCesarean', e.target.value) }} 
               checked={questionForWomen?.hysterectomyorCesarean == "yes"}
              name="hysterectomyorCesarean" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('hysterectomyorCesarean', e.target.value) }} 
               checked={questionForWomen?.hysterectomyorCesarean == "no"}
              name="hysterectomyorCesarean" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any urinary tract, bladder, or kidney infections within the last year? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('infectionswithinthelastyear', e.target.value) }} 
               checked={questionForWomen?.infectionswithinthelastyear == "yes"}
              name="infectionswithinthelastyear" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('infectionswithinthelastyear', e.target.value) }} 
               checked={questionForWomen?.infectionswithinthelastyear == "no"}
              name="infectionswithinthelastyear" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any blood in your urine? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('bloodinyoururine', e.target.value) }} 
               checked={questionForWomen?.bloodinyoururine == "yes"}
              name="bloodinyoururine" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('bloodinyoururine', e.target.value) }} 
               checked={questionForWomen?.bloodinyoururine == "no"}
              name="bloodinyoururine" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any problems with control of urination? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('controlofurination', e.target.value) }} 
               checked={questionForWomen?.controlofurination == "yes"}
              name="controlofurination" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('controlofurination', e.target.value) }} 
               checked={questionForWomen?.controlofurination == "no"}
              name="controlofurination" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any hot flashes or sweating at night? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('sweatingatnight', e.target.value) }} 
               checked={questionForWomen?.sweatingatnight == "yes"}
              name="sweatingatnight" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('sweatingatnight', e.target.value) }} 
               checked={questionForWomen?.sweatingatnight == "no"}
              name="sweatingatnight" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have menstrual tension, pain, bloating, irritability, or other symptoms at or around time of period?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('aroundtimeofperiod', e.target.value) }} 
               checked={questionForWomen?.aroundtimeofperiod == "yes"}
              name="aroundtimeofperiod" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('aroundtimeofperiod', e.target.value) }} 
               checked={questionForWomen?.aroundtimeofperiod == "no"}
              name="aroundtimeofperiod" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you perform monthly breast self exams? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('breastselfexams', e.target.value) }} 
               checked={questionForWomen?.breastselfexams == "yes"}
              name="breastselfexams" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('breastselfexams', e.target.value) }} 
               checked={questionForWomen?.breastselfexams == "no"}
              name="breastselfexams" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Experienced any recent breast tenderness, lumps, or nipple discharge? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('ornippledischarge', e.target.value) }} 
               checked={questionForWomen?.ornippledischarge == "yes"}
              name="ornippledischarge" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildWomenInformation('ornippledischarge', e.target.value) }} 
               checked={questionForWomen?.ornippledischarge == "no"}
              name="ornippledischarge" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group g-0 row my-2">
              <label
                htmlFor="staticEmail"
                className="col-sm-5 col-form-label label  py-0"
              >
                Date of last papsmear or pelvic exam:
              </label>
              <div className="col-sm-3 px-0">
                <input
                  type="Date"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={
                    questionForWomen?.papsmearorpelvicexam
                  }
                  onChange={(e) => buildWomenInformation("papsmearorpelvicexam", e.target.value)}
                />
              </div>
            </div>

          </div>

          <div className="fw-bold h4 text-black">These questions are for MEN ONLY </div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>

            <label className="label d-block ">Do you usually get up to urinate during the night? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('urinateduringthenight', e.target.value) }} 
               checked={questionForMen?.urinateduringthenight == "yes"}
              name="urinateduringthenight" id="inlineRadio28553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio"
               onChange={(e) => {buildMenInformation('urinateduringthenight', e.target.value) }} 
               checked={questionForMen?.urinateduringthenight == "no"} 
              name="urinateduringthenight" id="inlineRadio24540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you feel pain or burning with urination? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('burningwithurination', e.target.value) }} 
               checked={questionForMen?.burningwithurination == "yes"}
              name="burningwithurination" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('burningwithurination', e.target.value) }} 
               checked={questionForMen?.burningwithurination == "no"}
              name="burningwithurination" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any blood in your urine? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('yoururine', e.target.value) }} 
               checked={questionForMen?.yoururine == "yes"}
              name="yoururine" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('yoururine', e.target.value) }} 
               checked={questionForMen?.yoururine == "no"}
              name="yoururine" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you feel burning discharge from penis?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('dischargefrompenis', e.target.value) }} 
               checked={questionForMen?.dischargefrompenis == "yes"}
              name="dischargefrompenis" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('dischargefrompenis', e.target.value) }} 
               checked={questionForMen?.dischargefrompenis == "no"}
              name="dischargefrompenis" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Has the force of your urination decreased? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('yoururinationdecreased', e.target.value) }} 
               checked={questionForMen?.yoururinationdecreased == "yes"}
              name="yoururinationdecreased" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('yoururinationdecreased', e.target.value) }} 
               checked={questionForMen?.yoururinationdecreased == "no"}
              name="yoururinationdecreased" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Have you had any kidney, bladder, or prostrate infections within the last 12 months? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('prostrateinfectionswithin', e.target.value) }} 
               checked={questionForMen?.prostrateinfectionswithin == "yes"}
              name="prostrateinfectionswithin" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('prostrateinfectionswithin', e.target.value) }} 
               checked={questionForMen?.prostrateinfectionswithin == "no"}
              name="prostrateinfectionswithin" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have any problems emptying your bladder completely? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('bladdercompletely', e.target.value) }} 
               checked={questionForMen?.bladdercompletely == "yes"}
              name="bladdercompletely" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('bladdercompletely', e.target.value) }} 
               checked={questionForMen?.bladdercompletely == "no"}
              name="bladdercompletely" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any difficulty with erection or ejaculation?</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('erectionorejaculation', e.target.value) }} 
               checked={questionForMen?.erectionorejaculation == "yes"}
              name="erectionorejaculation" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('erectionorejaculation', e.target.value) }} 
               checked={questionForMen?.erectionorejaculation == "no"}
              name="erectionorejaculation" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Any testicle pain or swelling? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('painorswelling', e.target.value) }} 
               checked={questionForMen?.painorswelling == "yes"}
              name="painorswelling" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
               onChange={(e) => {buildMenInformation('painorswelling', e.target.value) }} 
               checked={questionForMen?.painorswelling == "no"}
              name="painorswelling" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group g-0 row my-2">
              <label
                htmlFor="staticEmail"
                className="col-sm-5 col-form-label label  py-0"
              >
                Date of last papsmear or pelvic exam:
              </label>
              <div className="col-sm-3 px-0">
                <input
                  type="Date"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={
                    questionForMen?.Dateofastpapsmear
                  }
                  onChange={(e) => buildMenInformation("Dateofastpapsmear", e.target.value)}
                />
              </div>
            </div>

          </div>
        </div>
          <div className="mt-3 text-end" type="button">
            <button
              onClick={() => {
                setMultiStepForm(3);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className='buttonDiv'
            >
              Back
            </button>
            <button
              disabled={checkFormStep4}
              onClick={() => generateDocs(4)}
              className='buttonDiv nextButton'
            >
              Continue
            </button>
          </div>
        </>
      ) : multiStepForm == 5 ? (
        <>
        <div id="pdf-ref2-5">
          <div className="h2 mb-3 fw-bold text-black">Other Information</div>
          <div className="fw-bold h4 text-black">Your healthcare provider needs to know:</div>
          <div className='form-group mb-5 row g-0 w-100  border border-grey rounded-1 p-3'>
            <label className="label d-block ">Do you have Advanced Directives? (Advance Directives refer to a person’s instructions about future medical care, in the event the person becomes unable to speak for himself/herself. A Living Will is an example of an Advance Directive.)</label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('haveAdvancedDirectives', e.target.value) }} 
                checked={otherInformation?.haveAdvancedDirectives == "yes"}
              name="haveAdvancedDirectives" id="inlineRadio43545" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('haveAdvancedDirectives', e.target.value) }} 
                checked={otherInformation?.haveAdvancedDirectives == "no"}
              name="haveAdvancedDirectives" id="inlineRadio24645" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">If no, would you like additional details about Advanced Directives? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('aboutAdvancedDirectives', e.target.value) }} 
                checked={otherInformation?.aboutAdvancedDirectives == "yes"}
              name="aboutAdvancedDirectives" id="inlineRadio28553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('aboutAdvancedDirectives', e.target.value) }} 
                checked={otherInformation?.aboutAdvancedDirectives == "no"}
              name="aboutAdvancedDirectives" id="inlineRadio24540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">Do you have any religious or cultural beliefs that may impact your healthcare? </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('impactyourhealthcare', e.target.value) }} 
                checked={otherInformation?.impactyourhealthcare == "yes"}
              name="impactyourhealthcare" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('impactyourhealthcare', e.target.value) }} 
                checked={otherInformation?.impactyourhealthcare == "no"}
              name="impactyourhealthcare" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <label className="label d-block ">If yes, please describe:</label>
            <div className="mb-3">
              <textarea rows="2" 
              type="text"
              className="form-control"
              value={
                otherInformation?.pleasedescribe
              }
              onInput={(e) =>
                buildOtherInformation("pleasedescribe", e.target.value)
              }
              ></textarea>
            </div>

            <label className="label d-block ">I best learn new information by: </label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('newinformationby', e.target.value) }} 
                checked={otherInformation?.newinformationby == "verbalInstructions"}
              name="newinformationby" id="inlineRadio285553" value="verbalInstructions" />
              <label className="form-check-label" htmlFor="inlineRadio1"> Verbal instructions </label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('newinformationby', e.target.value) }} 
                checked={otherInformation?.newinformationby == "writtenInstructions"}
              name="newinformationby" id="inlineRadio2540" value="writtenInstructions" />
              <label className="form-check-label" htmlFor="inlineRadio1"> Written instructions</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('newinformationby', e.target.value) }} 
                checked={otherInformation?.newinformationby == "pictures"}
              name="newinformationby" id="inlineRadio2540" value="pictures" />
              <label className="form-check-label" htmlFor="inlineRadio1"> Pictures</label>
            </div>

            <label className="label d-block ">Level of education completed:</label>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio"
                onChange={(e) => {buildOtherInformation('educationcompleted', e.target.value) }} 
                checked={otherInformation?.educationcompleted == "lessThanHighSchool"} 
              name="educationcompleted" id="inlineRadio285553" value="lessThanHighSchool" />
              <label className="form-check-label" htmlFor="inlineRadio1">Less than High School</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('educationcompleted', e.target.value) }} 
                checked={otherInformation?.educationcompleted == "highSchoolDiplomaOrGED"}
              name="educationcompleted" id="inlineRadio2540" value="highSchoolDiplomaOrGED" />
              <label className="form-check-label" htmlFor="inlineRadio1">High School diploma or GED</label>
            </div>
            <div className="form-check form-check col-md-4 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('educationcompleted', e.target.value) }} 
                checked={otherInformation?.educationcompleted == "1-4yearsOfCollege"}
              name="educationcompleted" id="inlineRadio2540" value="1-4yearsOfCollege" />
              <label className="form-check-label" htmlFor="inlineRadio1"> 1-4 years of college</label>
            </div>
            <div className="form-check form-check  col-md-4 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('educationcompleted', e.target.value) }} 
                checked={otherInformation?.educationcompleted == "greaterThan4YearsOfCollege"}
              name="educationcompleted" id="inlineRadio285553" value="greaterThan4YearsOfCollege" />
              <label className="form-check-label" htmlFor="inlineRadio1"> {">"} 4 years of college</label>
            </div>

            <label className="label d-block ">I understand English well?  </label>
            <div className="form-check form-check  col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('understandEnglish', e.target.value) }} 
                checked={otherInformation?.understandEnglish == "yes"}
              name="understandEnglish" id="inlineRadio285553" value="yes" />
              <label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
            </div>
            <div className="form-check form-check col-md-3 col-12">
              <input className="form-check-input" type="radio" 
                onChange={(e) => {buildOtherInformation('understandEnglish', e.target.value) }} 
                checked={otherInformation?.understandEnglish == "no"}
              name="understandEnglish" id="inlineRadio2540" value="no" />
              <label className="form-check-label" htmlFor="inlineRadio1">No</label>
            </div>

            <div className="form-group g-0 row my-2">
              <label
                htmlFor="staticEmail"
                className="col-sm-5 col-form-label label  py-0"
              >
                If no, what language do you prefer?
              </label>
              <div className="col-sm-5 px-0">
                <input
                  type="text"
                  className="form-control mb-1"
                  id="staticEmail"
                  value={
                    otherInformation?.languagedoyouprefer
                  }
                  onInput={(e) =>
                    buildOtherInformation("languagedoyouprefer", e.target.value)
                  }
                />
              </div>
            </div>

            <div className=" px-0 mb-5">
              <label className="label">Please circle any symptoms you are currently experiencing or symptoms you have frequently experienced in the past.</label>
              <MultiSelect
                options={currentlyExperiencingOrSymptoms}
                value={patientContext?.patientDetails?.healthHistoryData?.otherInformation?.currentlyExperiencing || []}
                onChange={(e) => { buildOtherInformation('currentlyExperiencing', e) }}
                labelledBy="Select"
              />
            </div>
          </div>
        </div>
          <div className="mt-3 text-end" type="button">
            <button
              onClick={() => {
                setMultiStepForm(4);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className='buttonDiv'
            >
              Back
            </button>
            <button
              disabled={checkFormStep5}
              onClick={() => generateDocs(5)}
              className='buttonDiv nextButton'
            >
              Continue
            </button>
          </div>
        </>
      ) : multiStepForm == 6 ? (
        <>
        <div id="pdf-ref2-6">
          <div className="alert alert-primary">Congratulations, you have successfully completed the Health History process.</div>
        </div>
        <div className="mt-3 text-end">
            <button
              onClick={() => {
                setMultiStepForm(5);
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }}
              className='buttonDiv'
            >
              Back
            </button>
            <button
              // disabled={isLoading}
              onClick={() => generateDocs(6) }
              className='buttonDiv nextButton'
            >
              {isLoading ? (<span class="spinner-border spinner-border-sm"></span>) :'Continue'}
            </button>
        </div>
        </>
      ) : ''}
    </div>
    </>)
  }

  return (
    <>
    {renderform()}
    </>
    
  );
}
