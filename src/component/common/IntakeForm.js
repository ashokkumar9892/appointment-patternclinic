import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import formLogo from "../../assets/intake-form-logo.png";
import PatientContext from "../../context/patientDetails/patientContext";
import FamilyForm from "./FamilyForm";
import HealthHistoryForm from "./HealthHistoryForm";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import moment from "moment";
import swal from "sweetalert";
import api from "../../api";
import Confetti from 'react-dom-confetti';

const emergencyContactRelationShipOptions = [
  { label: "SPOUSE", value: "spouse" },
  { label: "CHILD", value: "child" },
  { label: "COUSIN", value: "cousin" },
  { label: "FRIEND", value: "friend" },
  { label: "SIBLING", value: "sibling" },
  { label: "GUARDIAN", value: "guardian" },
  { label: "OTHER", value: "other" },
];

export default function IntakeForm(props) {
  const patientContext = useContext(PatientContext);
  const authToBillSign = useRef({});
  const beneficiarySign = useRef({});
  const consentSign = useRef({});
  const adultSign = useRef({});
  const parentGuardianSign = useRef({});
  const creditCardSign = useRef({});
  const [multiFormStep, setMultiFormStep] = useState(1);
  const [checkFormStep1, setCheckFormStep1] = useState(true);
  const [checkFormStep2, setCheckFormStep2] = useState(true);
  const [checkFormStep3, setCheckFormStep3] = useState(true);
  const [checkFormStep4, setCheckFormStep4] = useState(true);
  const [checkFormStep5, setCheckFormStep5] = useState(true);
  const [checkFormStep6, setCheckFormStep6] = useState(true);
  const [checkFormStep7, setCheckFormStep7] = useState(true);
  const [checkFormStep8, setCheckFormStep8] = useState(true);

  const [historyCanvas, setHistoryCanvas] = useState({});
  const [familyCanvas, setFamilyCanvas] = useState({});
  const [isLoading, setIsLoading] = useState(false);
	const BASE_URL = process.env.REACT_APP_BASE_URL
		? process.env.REACT_APP_BASE_URL
		: "http://localhost:3001";
  const config = {
    angle: 90,
    spread: 360,
    startVelocity: "74",
    elementCount: "165",
    dragFriction: "0.11",
    duration: "8480",
    stagger: "15",
    width: "21px",
    height: "20px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };
  const [showConfetti, setShowConfetti] = useState(false)

  const [authorization, setAuthorization] = useState(
    patientContext?.patientDetails?.intakeData?.authorization
  );
  const [paymentPlanAgreement, setPaymentPlanAgreement] = useState(
    patientContext?.patientDetails?.intakeData?.paymentPlanAgreement
  );
  const [beneficiaryAgreement, setBeneficiaryAgreemenr] = useState(
    patientContext?.patientDetails?.intakeData?.beneficiaryAgreement
  );
  const [emergencyContact, setEmergencyContact] = useState(
    patientContext?.patientDetails?.intakeData?.emergencyContact
  );

  const [consentAcknowledge, setConsentAcknowledge] = useState(
    patientContext?.patientDetails?.intakeData?.consentAcknowledge
  );

  const [riskAssumption, setRiskAssumption] = useState(
    patientContext?.patientDetails?.intakeData?.riskAssumption
  );

  const [creditCard, setCreditCard] = useState(
    patientContext?.patientDetails?.intakeData?.creditCard
  );

  const [stepCanvas, setStepCanvas] = useState({});

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [multiFormStep])

  const isFormStep1 = () => {
    if (
      authorization?.legalRepresentaive !== undefined &&
      authorization?.legalRepresentaive !== "" &&
      authorization?.patientRelationship !== undefined &&
      authorization?.patientRelationship !== "" &&
      authorization?.signature !== undefined &&
      authorization?.signature !== "" &&
      authorization?.date !== undefined
    ) {
      setCheckFormStep1(false);
    } else {
      setCheckFormStep1(true);
    }
  };

  const isFormStep2 = () => {
    if (
      paymentPlanAgreement?.patient !== undefined &&
      paymentPlanAgreement?.patient !== "" &&
      paymentPlanAgreement?.patientDate !== undefined &&
      paymentPlanAgreement?.initials !== undefined &&
      paymentPlanAgreement?.initials !== ""
    ) {
      setCheckFormStep2(false);
    } else {
      setCheckFormStep2(true);
    }
  };

  const isFormStep4 = () => {
    if (
      beneficiaryAgreement?.signature !== undefined &&
      beneficiaryAgreement?.signature !== "" &&
      beneficiaryAgreement?.printName !== undefined &&
      beneficiaryAgreement?.printName !== "" &&
      beneficiaryAgreement?.date !== undefined &&
      // beneficiaryAgreement?.witness !== undefined &&
      // beneficiaryAgreement?.witness !== "" &&
      // beneficiaryAgreement?.credentials !== undefined &&
      // beneficiaryAgreement?.credentials !== "" &&
      beneficiaryAgreement?.telephone !== undefined &&
      beneficiaryAgreement?.telephone !== "" &&
      beneficiaryAgreement?.revocation !== undefined &&
      beneficiaryAgreement?.revocation !== ""
    ) {
      setCheckFormStep4(false);
    } else {
      setCheckFormStep4(true);
    }
  };

  const isFormStep5 = () => {
    if (
      emergencyContact?.name !== undefined &&
      emergencyContact?.name !== "" &&
      emergencyContact?.contact > 0 &&
      emergencyContact?.gender !== undefined &&
      emergencyContact?.patientRelationship !== undefined
    ) {
      setCheckFormStep5(false);
    } else {
      setCheckFormStep5(true);
    }
  };

  const isFormStep6 = () => {
    if (
      consentAcknowledge?.signature !== undefined &&
      consentAcknowledge?.signature !== "" &&
      consentAcknowledge.date !== undefined
    ) {
      setCheckFormStep6(false);
    } else {
      setCheckFormStep6(true);
    }
  };

  const isFormStep7 = () => {
    if (
      riskAssumption?.adultName !== undefined &&
      riskAssumption?.adultName !== "" &&
      riskAssumption?.minorName !== undefined &&
      riskAssumption?.minorName !== "" &&
      riskAssumption?.adultSignature !== undefined &&
      riskAssumption?.adultSignature !== "" &&
      riskAssumption?.adultDate !== undefined &&
      riskAssumption?.parentGuardianSignature !== undefined &&
      riskAssumption?.parentGuardianSignature !== "" &&
      riskAssumption?.parentGuardianDate !== undefined
    ) {
      setCheckFormStep7(false);
    } else {
      setCheckFormStep7(true);
    }
  };

  const isFormStep8 = () => {
    if (
      creditCard?.type !== undefined &&
      creditCard?.name !== "" &&
      creditCard?.name !== undefined &&
      creditCard?.relationShip !== "" &&
      creditCard?.relationShip !== undefined &&
      creditCard?.cardNumber !== "" &&
      creditCard?.cardNumber !== undefined &&
      creditCard?.expireDate !== "" &&
      creditCard?.expireDate !== undefined &&
      creditCard?.patientName !== "" &&
      creditCard?.patientName !== undefined &&
      creditCard?.statementCheck!== undefined &&
      creditCard?.statementCheck!== false &&
      // creditCard?.signature !== undefined &&
      // creditCard?.signature !== "" &&
      creditCard?.date !== undefined
    ) {
      setCheckFormStep8(false);
    } else {
      setCheckFormStep8(true);
    }
  };

  const buildAuthForm = (name, value) => {
    setAuthorization((authorization) => ({ ...authorization, [name]: value }));
    updateContext();
  };

  const buildPaymentPlanAgreementForm = (name, value) => {
    setPaymentPlanAgreement((paymentPlanAgreement) => ({
      ...paymentPlanAgreement,
      [name]: value,
    }));
    updateContext();
  };

  const buildBeneficiaryForm = (name, value) => {
    setBeneficiaryAgreemenr((beneficiaryAgreement) => ({
      ...beneficiaryAgreement,
      [name]: value,
    }));
    updateContext();
  };

  const buildConsentForm = (name, value) => {
    setConsentAcknowledge((consent) => ({ ...consent, [name]: value }));
    updateContext();
  };

  const buildRiskAssumptionForm = (name, value) => {
    setRiskAssumption((riskAssumption) => ({
      ...riskAssumption,
      [name]: value,
    }));
    updateContext();
  };

  const buildCreditCardDetails = (name, value) => {
    setCreditCard((creditCard) => ({ 
      ...creditCard, 
      [name]: value 
    }));
    updateContext();
  };

  const buildEmergencyContactForm = (name, value) => {
    setEmergencyContact((emergencyContact) => ({
      ...emergencyContact,
      [name]: value,
    }));
    updateContext();
  };

  const intakeData = {
    authorization: authorization,
    paymentPlanAgreement: paymentPlanAgreement,
    beneficiaryAgreement: beneficiaryAgreement,
    emergencyContact: emergencyContact,
    consentAcknowledge: consentAcknowledge,
    riskAssumption: riskAssumption,
    creditCard: creditCard,
  };

  const updateContext = () => {
    patientContext.update({
      ...patientContext.patientDetails,
      intakeData,
    });
  };

  useEffect(() => {
    updateContext();
    //console.log(patientContext.patientDetails.intakeData.creditCard);
  }, [
    authorization,
    paymentPlanAgreement,
    beneficiaryAgreement,
    emergencyContact,
    consentAcknowledge,
    riskAssumption,
    creditCard,
  ]);

  useEffect(() => {
    isFormStep1();
    isFormStep2();
    isFormStep4();
    isFormStep5();
    isFormStep6();
    isFormStep7();
    isFormStep8();
    if (multiFormStep === 1) {
      authToBillSign.current.fromDataURL(authorization?.signature, {
        width: 500,
        height: 70,
      });
    }
    if (multiFormStep === 4) {
      beneficiarySign.current.fromDataURL(beneficiaryAgreement?.signature, {
        width: 500,
        height: 70,
      });
    }
    if (multiFormStep === 6) {
      consentSign.current.fromDataURL(consentAcknowledge?.signature, {
        width: 500,
        height: 70,
      });
    }
    if (multiFormStep === 7) {
      // adultSign.current.fromDataURL(riskAssumption?.adultSignature, {
      //   width: 500,
      //   height: 70,
      // });

      parentGuardianSign.current.fromDataURL(riskAssumption?.parentGuardianSignature, {
          width: 500,
          height: 70,
        }
      );
    }
    if (multiFormStep === 8) {
      creditCardSign.current.fromDataURL(creditCard?.signature, {
        width: 500,
        height: 70,
      });
    }
  });

  useEffect(()=>{
    window.gtag("event", "conversion", {
      send_to: "AW-774469977/9IDQCMrBpoEYENnypfEC",
    });
  });

  const generateDocs = (step) => {
    html2canvas(document.getElementById(`pdf-ref-${step}`)).then(async res => {
      const canvasData = { ...stepCanvas, [step]: res };
      setStepCanvas(canvasData)
      if (step === 8) {
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
        submitForm(pdfDataUri.split(',').pop(),step);
      }
    })
  }

  const submitForm = (attachmentcontents,step) => {
    const formData = new URLSearchParams();
    formData.append('attachmenttype', 'PDF')
    formData.append('attachmentcontents', attachmentcontents)
    formData.append('autoclose', 'true')
    formData.append('departmentid', '1')
    formData.append('documentdate', moment().format("MM/DD/YYYY"))
    formData.append('documentsubclass', 'ADMIN')
    formData.append('documenttypeid', '186965')
    formData.append('entitytype', 'PATIENT')
    formData.append('originalfilename', 'Intake Form')
    formData.append('priority', '1')
    formData.append('providerid', '1')
    let request = {
      url: `${BASE_URL}//v1/24451/patients/${props.patientid}/documents/admin`,
      data: formData,
    };
    api
      .postAuth(request)
      .then((res) => {
        swal("Basic Intake form successfully submitted", "success");
        
      setMultiFormStep(step + 1)
      })
      .catch((error) => {
      })
      .finally(() => {setIsLoading(false)});
  };

  return (
    <>
      <div className="intake-form-header d-flex mb-5 text-center align-items-start justify-content-between">
        <div className="col-4"></div>
        <div className="col-4">
          <img src={formLogo} className="w-100" />
        </div>
        <div className="col-4"></div>
      </div>
      <Confetti active={showConfetti} config={config} />
      <div className="intake-form px-3 text-black">
        {multiFormStep == 1 ? (
          <>
          <div id='pdf-ref-1'>
            <div className="fs-2 mb-2 fw-bold text-center">
              Authorization to Bill
            </div>
            <div className="fs-2 mb-3 fw-bold text-center">Please Sign</div>
            <div className="">
              <div className="fw-bold mb-3">
                My signature and date below authorizes/acknowledges each of the
                following:
              </div>
              <ol>
                <li>
                  Direct billing to Medicare, Medicaid, Medicare Supplemental or
                  other insurer(s) on my behalf, including billing of A PATTERN
                  Plus: Chronic Care Management services (CCM)/ Remote Patient
                  Monitoring (RPM) as outlined in the Practice Policies document
                  which I have received.
                </li>
                <li>
                  I have been made aware that there may be some costs associated
                  with my medical treatment that will not be paid htmlFor by my
                  insurance. In the event that this situation occurs, I will be
                  financially responsible htmlFor the cost of treatment.
                </li>
                <li>
                  A PATTERN Medical Clinic and/or any of their corporate
                  affiliates to obtain medical or other information necessary in
                  order to process claim(s), including determining eligibility
                  and seeking reimbursement and or medications provided.
                </li>
                <li>
                  There are certain services which are not covered by Medicare
                  and most other insurances. Payment htmlFor these services are
                  due at the time of service. Please contact A PATTERN Medical
                  Clinic at least 48 hours in advance to cancel you appointment
                  without penalty. If you do not contact us the following
                  charges may apply:
                  <ul>
                    <li>Missed Visit Fee $40</li>
                    <li> A PATTERN Plus Missed Phone Call $40</li>
                    <li>Records (free to MD office) $0.25/ page</li>
                  </ul>
                </li>
                <li>
                  Waivers htmlFor fees will be reviewed on an individual basis
                </li>
              </ol>
              <div className=" fs-6 my-4">
                SIGN, DATE AND RETURN THIS PAGE IMMEDIATELY! In order htmlFor us
                to bill Medicare and/or other insurance htmlFor your medical
                supplies and/or medications, this page must be completed,
                signed, dated and returned immediately
              </div>
              <form className="">
                <div className="form-group row">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-5 col-form-label"
                  >
                    Name of patient/legal representative:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        patientContext?.patientDetails?.intakeData
                          ?.authorization?.legalRepresentaive
                      }
                      onInput={(e) =>
                        buildAuthForm("legalRepresentaive", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-5 col-form-label  "
                  >
                    Relationship to patient:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        patientContext?.patientDetails?.intakeData
                          ?.authorization?.patientRelationship
                      }
                      onInput={(e) =>
                        buildAuthForm("patientRelationship", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="form-group row my-3">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-5 col-form-label "
                  >
                    SIGNATURE:
                  </label>
                  <div className="col-sm-7 text-end">
                    <div className="border mb-1 border-dark rounded-1">
                      <SignatureCanvas
                        ref={authToBillSign}
                        onEnd={(e) => {
                          buildAuthForm(
                            "signature",
                            authToBillSign.current.toDataURL()
                          );
                        }}
                        canvasProps={{
                          width: 500,
                          height: 70,
                          className: "sigCanvas",
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className='buttonDiv mt-2'
                      onClick={() => {
                        authToBillSign.current.clear();
                        buildAuthForm("signature", "");
                        updateContext();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-5 col-form-label  "
                  >
                    Date:
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="date"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={
                        patientContext?.patientDetails?.intakeData
                          ?.authorization?.date
                      }
                      onChange={(e) => buildAuthForm("date", e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
                <div className="mt-3 text-end" type="button">
                  
                  <button
                    disabled={checkFormStep1}
                    onClick={() => {
                      generateDocs(1);
                      setMultiFormStep(2);
                    }}
                    className='buttonDiv nextButton'
                  >
                    Continue
                  </button>
                </div>
          </>
        ) : multiFormStep == 2 ? (
          <>
          <div id='pdf-ref-2'>
            <div className="fs-2 mb-2 fw-bold text-center">
              Payment Plan Agreement
            </div>
            <div className="">
              <div className=" mb-3">
                The purpose of this agreement is to ensure the responsibility of
                the patient (or guardian or caregiver for dependent people) to
                pay for your services is understood.
              </div>
              <ul>
                <li>
                  Patient not enrolled in health plans are responsible for the
                  entire amount of their bills.
                </li>
                <li>
                  Patients in health plans are responsible for any amounts the
                  plans don not pay, up to the entire amount.
                </li>
                <li>
                  Payment is due the day your services are provided unless other
                  arrangements are made in advance.
                </li>
                <li>
                  Payments can be made by credit cards, debit cards and checks.
                  A PATTERN Medical Clinic Accepts.
                </li>
              </ul>
              <div>
                The cost of treatment with A Pattern Medical Clinic will range
                between{" "}
                <input
                  type="text"
                  value={paymentPlanAgreement?.initials}
                  className="form-control min-h-30 d-inline-block w-80 py-0 my-0"
                  onInput={(e) =>
                    buildPaymentPlanAgreementForm("initials", e.target.value)
                  }
                />
                .
              </div>
              <ul className="lh-lg">
                <li>
                  (Patient initials) I have discussed payment options and will
                  put an initial payment (50% down is recommended) at time of
                  service
                </li>
                <li>
                  (Patient initials) I have discussed payment options and will
                  enrolled in a payment oeriod of $20.00 per month minimums.
                </li>
                <li>
                  (Patient initials) I understand that I am responsible for
                  payments for payment of services rendered and also responsible
                  for paying the total amount due as agreed-upon above. If I am
                  unable to pay monthly payment, I will notify a PATTERN Medical
                  Clinic immediately and make arrangements.
                </li>
                <li>
                  (Patient initials) I understand my my responsibility for
                  payment of services rendered and responsibility of a
                  percentage for initial payment and monthly payment. If I
                  choose to stop monthly payments prior to completing full
                  payment, I understand the letter will be sent to collections
                </li>
              </ul>
              <div className="">
                I have discuss payment options and agree upon a payment plan
                with A PATTERN Medical Clinic.
              </div>
              <div className="row">
                <div className="form-group col-md-8 row align-items-end">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-3 col-form-label  py-0"
                  >
                    Patient:
                  </label>
                  <div className="col-sm-9 px-0">
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={paymentPlanAgreement?.patient}
                      onInput={(e) => {
                        buildPaymentPlanAgreementForm(
                          "patient",
                          e.target.value
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="form-group col-md-4 row align-items-end">
                  <label
                    htmlFor="staticEmail"
                    className="col-sm-4 col-form-label  py-0"
                  >
                    Date:
                  </label>
                  <div className="col-sm-8 px-0">
                    <input
                      type="date"
                      className="form-control mb-1"
                      id="staticEmail"
                      value={paymentPlanAgreement?.patientDate}
                      onInput={(e) => {
                        buildPaymentPlanAgreementForm(
                          "patientDate",
                          e.target.value
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
              <div className="mt-3 text-end" type="button">
                <button
                  onClick={() => {
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    setMultiFormStep(1);
                  }}
                  className='buttonDiv'
                >
                  Back
                </button>
                <button
                  disabled={checkFormStep2}
                  onClick={() => {
                    generateDocs(2);
                    setMultiFormStep(3);
                  }}
                  className='buttonDiv nextButton'
                >
                  Continue
                </button>
              </div>
          </>
        ) : multiFormStep == 3 ? (
          <>
          <div id='pdf-ref-3'>
            <div className="fs-2 mb-2 fw-bold ">
              A PATTERN Plus Patient Agreement
            </div>
            <div>
              <div className="text-black py-3">
                Medicare is offering a new benefit for beneficiaries with
                multiple chronic conditions, and by consenting to this
                agreement, you allow A Pattern Medical Clinic Providers to
                provide chronic care management services to you.
              </div>
              <div className="py-3">
                CCM services are only available to patients with two or more
                chronic conditions. Medicare defines a chronic condition that is
                expected to last for at least 12 months, and that increases the
                rick of death, acute exacerbation of disease, or a decline in
                function.
              </div>
              <div className="fw-bold text-black ">
                Benefits of CCM Services Include:
              </div>
              <ul>
                <li>
                  24/7 access to a care provider to help with your chronic
                  healthcare needs
                </li>
                <li>
                  A comprehensive plan of care for health needs, available on
                  paper or electronically
                </li>
                <li>
                  Coordination with both home and community-based service
                  providers
                </li>
                <li>
                  Transition management among health care providers, including
                  referrals, and follow-up after discharges from hospitals,
                  skilled nursing facilities, or other healthcare facilities
                </li>
                <li>Medication oversight and management</li>
                <li>
                  use a certified electronic health record (EHR) as mandated by
                  Medicare
                </li>
              </ul>
              <div>
                Should you desire to receive CCM services through your provider,
                he/she agrees to only bill Medicare for CCM services once per
                30-day billing cycle. Furthermore, your provider agrees only to
                bill Medicare for CCM services if you have more than one chronic
                condition
              </div>
            </div>
          </div>
              <div className="mt-3 text-end" type="button">
                <button
                  onClick={() => {
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    setMultiFormStep(2);
                  }}
                  className='buttonDiv'
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    generateDocs(3);
                    setMultiFormStep(4)
                  }}
                  className='buttonDiv nextButton'
                >
                  Continue
                </button>
              </div>
          </>
        ) : multiFormStep == 4 ? (
          <>
          <div id='pdf-ref-4'>
            <div className=" mb-2 fw-bold ">
              Beneficiary Acknowledgment and Agreement
            </div>
            <div>
              By signing this agreement, you agree to the following terms:
            </div>
            <ul>
              <li>
                You consent to your provider providing CCM services to you.
              </li>
              <li>
                You certify that your provider has fully explained the scope of
                CCM services to you.
              </li>
              <li>
                You acknowledge that only one practitioner can furnish and be
                paid for CCM services during a calendar month.
              </li>
              <li>
                You authorize electronic communication of your medical
                information between treating providers as part of your care.
              </li>
              <li>
                You understand that CCM services are subject to Medicare
                Co-Insurance, and so you may be billed for a portion of the CCM
                services.
              </li>
              <li>
                You understand that you have the right to terminate A PATTERN
                Plus services at any time effective at the end of the
                then-current month. You may revoke this agreement verbally by
                notifying A Pattern Medical Clinic by telephone at (
                <input
                  type="text"
                  className="form-control d-inline-block w-120 min-h-30 py-0 my-0"
                  value={beneficiaryAgreement?.telephone}
                  onInput={(e) => {
                    buildBeneficiaryForm("telephone", e.target.value);  
                  }}
                />
                ){" "}
                {/* <input
                  type="text"
                  className="form-control d-inline-block w-80 min-h-30 py-0 my-0"
                />
                -
                <input
                  type="text"
                  className="form-control d-inline-block w-80 min-h-30 py-0 my-0"
                /> */}
                , or by revocation to
                <input
                  type="text"
                  className="form-control d-inline-block max-w-200 min-h-30 py-0 my-0"
                  value={beneficiaryAgreement?.revocation}
                  onInput={(e) => {
                    buildBeneficiaryForm("revocation", e.target.value);
                  }}
                />
                . Your provider will then give you written confirmation,
                including the effective date of revocation.
              </li>
            </ul>
            <div className="row g-0 mt-5">
              <div className="form-group col-md-12 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-12 col-form-label px-0 mb-0  py-0"
                >
                  Beneficiary/Responsible Party Signature::
                </label>
                <div className="col-sm-12 px-0  text-end">
                  <div className="border mt-2 mb-1 border-dark rounded-1">
                    <SignatureCanvas
                      ref={beneficiarySign}
                      onEnd={() => {
                        buildBeneficiaryForm(
                          "signature",
                          beneficiarySign.current.toDataURL()
                        );
                      }}
                      canvasProps={{
                        width: 500,
                        height: 70,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className='buttonDiv mt-2 mb-3'
                    onClick={() => {
                      beneficiarySign.current.clear();
                      buildBeneficiaryForm("signature", "");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="form-group col-md-8 ps-0 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label  py-0"
                >
                  Print Name:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    onInput={(e) => {
                      buildBeneficiaryForm("printName", e.target.value);
                    }}
                    value={beneficiaryAgreement?.printName}
                  />
                </div>
              </div>
              <div className="form-group col-md-4 pe-md-0 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label  py-0"
                >
                  Date:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    onInput={(e) => {
                      buildBeneficiaryForm("date", e.target.value);
                    }}
                    value={beneficiaryAgreement?.date}
                  />
                </div>
              </div>
              {/* <div className="form-group col-md-12 ps-0 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-3 col-form-label  py-0"
                >
                  Witness:
                </label>
                <div className="col-sm-9 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    onInput={(e) => {
                      buildBeneficiaryForm("witness", e.target.value);
                    }}
                    value={beneficiaryAgreement?.witness}
                  />
                </div>
              </div>
              <div className="form-group col-md-12 ps-0 pe-md-0 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-3 col-form-label py-0"
                >
                  Credentials:
                </label>
                <div className="col-sm-9 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    onInput={(e) => {
                      buildBeneficiaryForm("credentials", e.target.value);
                    }}
                    value={beneficiaryAgreement?.credentials}
                  />
                </div>
              </div> */}
            </div>
          </div>
            <div className="mt-3 text-end" type="button">
              <button
                onClick={() => {
                  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                  setMultiFormStep(3);
                }}
                className='buttonDiv'
              >
                Back
              </button>
              <button
                disabled={checkFormStep4}
                onClick={() => {
                  generateDocs(4);
                  setMultiFormStep(5)
                }}
                className='buttonDiv nextButton'
              >
                Continue
              </button>
            </div>
          </>
        ) : multiFormStep == 5 ? (
          <>
          <div id='pdf-ref-5' className="mb-2">
            <div className="fw-bold mb-2">
              This person will be contacted in emergencies and allowed to
              receive informaiton about your medical treatment.
            </div>
            <div className="row">
              <div className="form-group col-md-6 col-12">
                <input
                  className="form-control"
                  placeholder="Name"
                  type="text"
                  value={emergencyContact?.name}
                  onInput={(e) => {
                    buildEmergencyContactForm("name", e.target.value);
                  }}
                />
              </div>
              <div className="form-group col-md-6">
                <input
                  className="form-control"
                  placeholder="Mobile Phone"
                  type="number"
                  value={emergencyContact?.contact}
                  onInput={(e) => {
                    buildEmergencyContactForm("contact", e.target.value);
                  }}
                />
              </div>
              <div className="form-group col-md-6 col-12">
                <div className="row align-items-end g-0 mt-md-3">
                  <div className="form-check col-md-4">
                    <input
                      className="form-check-input"
                      checked={emergencyContact?.gender == "male"}
                      onChange={(e) => {
                        buildEmergencyContactForm("gender", e.target.value);
                      }}
                      value="male"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                    >
                      Male
                    </label>
                  </div>
                  <div className="form-check col-md-4">
                    <input
                      checked={emergencyContact?.gender == "female"}
                      onChange={(e) => {
                        buildEmergencyContactForm("gender", e.target.value);
                      }}
                      className="form-check-input"
                      value="female"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Female
                    </label>
                  </div>
                  <div className="form-check col-md-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={emergencyContact?.gender == "other"}
                      onChange={(e) => {
                        buildEmergencyContactForm("gender", e.target.value);
                      }}
                      value="other"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Other
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group col-md-6 col-12">
                <select
                  className="form-select"
                  onChange={(e) => {
                    buildEmergencyContactForm(
                      "patientRelationship",
                      e.target.value
                    );
                  }}
                  aria-label="Default select example"
                >
                  <option selected disabled>
                    Relationship
                  </option>
                  {emergencyContactRelationShipOptions.map((item, index) => {
                    return (
                      <option
                        selected={
                          emergencyContact?.patientRelationship == item.label
                        }
                      >
                        {item.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
            <div className="mt-3 text-end" type="button">
              <button
                onClick={() => {
                  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                  setMultiFormStep(4);
                }}
                className='buttonDiv'
              >
                Back
              </button>
              <button
                disabled={checkFormStep5}
                onClick={() => {
                  generateDocs(5);
                  setMultiFormStep(6)
                }}
                className='buttonDiv nextButton'
              >
                Continue
              </button>
            </div>
          </>
        ) : multiFormStep == 6 ? (
          <>
          <div id='pdf-ref-6' className="mb-2">
            <div className="fw-bold mb-4">
              Consent for Treatment/Acknowledgement of Privacy
              Practices/Acknowledgement of Financial Responsibility
            </div>
            <div className="mb-5">
              I, the undersigned, consent to the care and treatment by the
              attending physician, his/her associates, or assistants and
              acknowledge that no guarantees have been made as to the effect of
              such treatment.
            </div>
            <div className="mb-5">
              I have reviewed the Notice of Privacy practices as provided at
              registration and understand that I may request a copy of the
              policy at any time.
            </div>
            <div className="my-5">
              I acknowledge full financial responsibility to any services
              received and I understand that the payment of charges incurred in
              this office is due at the time of service. I also understand that
              the charges not covered by insurance remain my responsibility. In
              the event that my account is turned over to a collection agency, I
              agree to pay all late fees, costs of collection fees and/or
              attorneys fees and all court costs. If any, I understand that any
              services not provided directly by A PATTERN Medical Clinic (lab
              results, diagnostic services) are a separate charge and those
              charges will be billed separately by the providers of such
              services
            </div>
            <div className="row">
              <div className="form-group  row align-items-start mb-2">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-3 col-form-label py-0"
                >
                  Signature:
                </label>
                <div className="col-sm-9 text-end px-0">
                  <div className="border mb-1 border-dark rounded-1">
                    <SignatureCanvas
                      onEnd={(e) => {
                        buildConsentForm(
                          "signature",
                          consentSign.current.toDataURL()
                        );
                      }}
                      ref={consentSign}
                      canvasProps={{
                        width: 500,
                        height: 70,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className='buttonDiv mt-2 mb-3'
                    onClick={() => {
                      consentSign.current.clear();
                      buildConsentForm("signature", "");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="form-group col-md-8 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-3 col-form-label py-0"
                >
                  Date:
                </label>
                <div className="col-sm-9 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={consentAcknowledge?.date}
                    onChange={(e) => {
                      buildConsentForm("date", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
            <div className="mt-3 px-2 text-end" type="button">
              <button
                onClick={() => {
                  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                  setMultiFormStep(5);
                }}
                className='buttonDiv'
              >
                Back
              </button>
              <button
                disabled={checkFormStep6}
                onClick={() => {
                  generateDocs(6);
                  setMultiFormStep(7)
                }}
                className='buttonDiv nextButton'
              >
                Continue
              </button>
            </div>
          </>
        ) : multiFormStep == 7 ? (
          <>
          <div id='pdf-ref-7'>
            <div className="fw-bold text-center mb-1">
              A Pattern Medical Clinic{" "}
            </div>
            <div className="fw-bold h5 text-black text-center mb-3">
              COVID-19 RELEASE, WAIVER OF LIABILITY, AND ASSUMPTION OF RISK
            </div>
            <div>
              Every person who uses the A Pattern Medical Clinic facility must
              read, agree to, complete, and sign this form. Anyone under the age
              of 18 must also have a parent/guardian sign this form on his/her
              behalf.
            </div>
            <div className="row mb-5">
              <div className="form-group col-md-12 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label py-0"
                >
                  Adult or guardian name(s):
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={riskAssumption?.adultName}
                    onInput={(e) => {
                      buildRiskAssumptionForm("adultName", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group col-md-12 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-3 col-form-label py-0"
                >
                  Minor name(s):
                </label>
                <div className="col-sm-9 px-0">
                  <input
                    type="name"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={riskAssumption?.minorName}
                    onInput={(e) => {
                      buildRiskAssumptionForm("minorName", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              In consideration of being permitted to use the A Pattern Medical
              Clinic facility, I. for myself and for my heirs, administrators,
              and personal representatives, fully understand, acknowledge, and
              agree:
            </div>
            <ul className="mb-3">
              <li>
                <span>
                  That there are risks and dangers associated with using A
                  Pattern Medical Clinic facility during the Covid-19 Pandemic.{" "}
                </span>
              </li>
              <li>
                <span>
                  That these risks and dangers include sickness, permanent
                  disability, and death;{" "}
                </span>
              </li>
              <li>
                <span>
                  That these risks and dangers cannot be fully known and
                  avoided, and{" "}
                </span>
              </li>
              <li>
                <span>
                  That these risks and dangers may be caused by my own actions
                  or inactions, the actions or inactions of others also using
                  the A Pattem Medical Clinic facility, and the actions or
                  inactions of the directors, officers, manager, employees, and
                  agents of A Pattern Medical Clinic
                </span>
              </li>
            </ul>
            <div className="mb-3">
              I FULLY ACCEPT AND ASSUME ALL SUCH RISKS AND ALL RESPONSIBILITY
              FOR LOSSES, COSTS, AND DAMAGES I INCUR AS A RESULT OF CONTRACTING
              COVID-19 WHILE USING THE FACILITIES
            </div>
            <div className="mb-3">
              I HEREBY WAIVE, RELEASE, DISCHARGE, AND COVENANT NOT TO SUE AND
              AGREE TO INDEMNIFY AND HOLD HARMLESS THE A Patten Medical Clinic
              ITS MEMBERS, DIRECTORS, OFFICERS, MANAGERS, EMPLOYEES, AGENTS,
              VOLUNTEERS, AND OTHER USERS OF THE A PATTERN MEDICAL FACILITY.
              (THE "RELEASEES) FROM AND FOR ANY AND ALL LIABILITY, CLAIMS,
              DEMANDS, LOSSES, OR DAMAGES CAUSED OR ALLEGED TO BE CAUSED IN
              WHOLE OR IN PART BY CONTRACTING COVID-19 OR THE NEGLIGENCE OF THE
              RELEASEES IN ANY WAY RELATED TO THE COVID-19 PANDEMIC, INCLUDING
              BUT NOT LIMITED TO THE CLEANING AND OPERATION OF THE A PATTERN
              MEDICAL FACILITY
            </div>
            <div className="mb-3">
              I have read, fully understand, and agree to be legally bound by
              this document.
            </div>
            <div className="row mb-3 align-items-start">
              <div className="form-group col-md-8 row ">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label py-0"
                >
                  Signature of adult:
                </label>
                <div className="col-sm-6 px-0 text-end">
                  <div className="border mb-1 border-dark rounded-1">
                    <SignatureCanvas
                      ref={adultSign}
                      onEnd={(e) => {
                        buildRiskAssumptionForm(
                          "adultSignature",
                          adultSign.current.toDataURL()
                        );
                      }}
                      canvasProps={{
                        width: 500,
                        height: 70,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className='buttonDiv mt-2 mb-3'
                    onClick={() => {
                      adultSign.current.clear();
                      buildRiskAssumptionForm("adultSignature", "");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="form-group col-md-4 row align-items-start">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label"
                >
                  Date:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={riskAssumption?.adultDate}
                    onChange={(e) => {
                      buildRiskAssumptionForm("adultDate", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              I, the minor's parent, and/or legal guardian, have read, fully
              understand, and agree, on behalf of the minor, to be legally bound
              by this document.
            </div>
            <div className="row mb-3">
              <div className="form-group col-md-8 row align-items-start">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label py-0"
                >
                  Signature of parent/guardian:
                </label>
                <div className="col-sm-6 px-0 text-end">
                  <div className="border mb-1 border-dark rounded-1">
                    <SignatureCanvas
                      onEnd={(e) => {
                        buildRiskAssumptionForm(
                          "parentGuardianSignature",
                          parentGuardianSign.current.toDataURL()
                        );
                      }}
                      ref={parentGuardianSign}
                      canvasProps={{
                        width: 500,
                        height: 70,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className='buttonDiv mt-2 mb-3'
                    onClick={() => {
                      parentGuardianSign.current.clear();
                      buildRiskAssumptionForm("parentGuardianSignature", "");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="form-group col-md-4 row align-items-start">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label py-0"
                >
                  Date:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={riskAssumption?.parentGuardianDate}
                    onInput={(e) => {
                      buildRiskAssumptionForm(
                        "parentGuardianDate",
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
            <div className="mt-3 text-end px-3" type="button">
              <button
                onClick={() => {
                  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                  setMultiFormStep(6);
                }}
                className='buttonDiv'
              >
                Back
              </button>
              <button
                disabled={checkFormStep7}
                onClick={() => {
                  generateDocs(7);
                  setMultiFormStep(8)
                }}
                className='buttonDiv nextButton'
              >
                Continue
              </button>
            </div>
          </>
        ) : multiFormStep == 8 ? (
          <>
          <div className="mb-2" id='pdf-ref-8'>
            <div className="mb-2 fs-4 fw-bold text-center text-black">
              Credit Card of File
            </div>
            <div className="mb-2 fs-5 fw-bold text-center text-black">
              Please Sign
            </div>
            <div className="mb-3">
              A Pattern Medical Clinic has implemented a new credit card policy.
              We kindly request our patients guardian/guarantor for a credit
              card which may be used later to pay any balance that may be due on
              your bill. Co-pays are still due at the time of service. At
              registration and/or check in your credit card information will be
              obtained and kept securely until your insurances have paid their
              portion and notifes us of the balance due, if any
            </div>
            <div className="mb-3">
              The information will be held securely until your insurance has
              paid their portion of the claim and notified us of any addicional
              amount owed by the patient. At that time, we will notify you that
              your outstanding balance will be charged to your credit card five
              5 days from the date of the notice. You may call our office if you
              have a question about your balance. We will send you a recept for
              the charge. This "Card on File program simplifies payment for you
              and cases the administrative burden on your provider's office. It
              reduces paperwork and ultimately helps lower the cost of
              healthcare. Your statements will be available via your patient
              portal and our Customer Support line is available to answer any
              questions about the balance due you have any questions about the
              card-on-file payment method, please do not hesitate to let us know
            </div>
            <div className="mb-3">
              By signing below, I authorise A Pattern Medical Clinic to keep my
              signature and my credit card information securely on-le in my
              account. I authorize A Pattern Medical Clinic to charge my credit
              card for any outstanding balances when due.
            </div>
            <div className="form-group col-12">
              <div className="row align-items-end g-0 mt-md-3">
                <div className="form-check col-md-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="visa"
                    checked={creditCard?.type == "visa"}
                    onChange={(e) => {
                      buildCreditCardDetails("type", e.target.value);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    Visa
                  </label>
                </div>
                <div className="form-check col-md-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    value="masterCard"
                    checked={creditCard?.type == "masterCard"}
                    onChange={(e) => {
                      buildCreditCardDetails("type", e.target.value);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Mastercard
                  </label>
                </div>
                <div className="form-check col-md-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault3"
                    value="discover"
                    checked={creditCard?.type == "discover"}
                    onChange={(e) => {
                      buildCreditCardDetails("type", e.target.value);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault3"
                  >
                    Discover
                  </label>
                </div>
                <div className="form-check col-md-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault4"
                    value="americanExpress"
                    checked={creditCard?.type == "americanExpress"}
                    onChange={(e) => {
                      buildCreditCardDetails("type", e.target.value);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault4"
                  >
                    American Express
                  </label>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="form-group col-md-12 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label py-0"
                >
                  Name on Card (Print):
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.name}
                    onChange={(e) => {
                      buildCreditCardDetails("name", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group col-md-12 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label py-0"
                >
                  Cardholder Relationship to Patient:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="name"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.relationShip}
                    onChange={(e) => {
                      buildCreditCardDetails("relationShip", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group col-md-8 row  align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label py-0"
                >
                  Last 4 Digits of Credit Card Number:
                </label>
                <div className="col-sm-5 px-0">
                  <input
                    type="name"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.cardNumber}
                    onChange={(e) => {
                      buildCreditCardDetails("cardNumber", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group col-md-4 g-md-0 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-5 col-form-label ps-3 py-0"
                >
                  Exp. Date:
                </label>
                <div className="col-sm-7 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.expireDate}
                    onChange={(e) => {
                      buildCreditCardDetails("expireDate", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              Please fill out information below for any person(s) you authorize
              this credit card for:
            </div>
            <div className="row mb-3">
              <div className="form-group col-md-8 row align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label py-0 "
                >
                  Patient Full Name (Print):
                </label>
                <div className="col-sm-6 px-0">
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.patientName}
                    onChange={(e) => {
                      buildCreditCardDetails("patientName", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group col-md-4 row g-0 align-items-end">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label ps-3 py-0"
                >
                  DOB:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.dob}
                    onChange={(e) => {
                      buildCreditCardDetails("dob", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="form-group col-md-8 row align-items-start">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-6 col-form-label py-0 "
                >
                  Credit Card Holder's Signature:
                </label>
                <div className="col-sm-6 px-0 text-end">
                  <div className="border mb-1 border-dark rounded-1">
                    <SignatureCanvas
                      ref={creditCardSign}
                      onEnd={(e) => {
                        buildCreditCardDetails(
                          "signature",
                          creditCardSign.current.toDataURL()
                        );
                      }}
                      canvasProps={{
                        width: 500,
                        height: 70,
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className='buttonDiv mt-2 mb-3'
                    onClick={() => {
                      creditCardSign.current.clear();
                      buildCreditCardDetails(
                        "signature",
                        ''
                      );
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="form-group col-md-4 row g-0 align-items-start">
                <label
                  htmlFor="staticEmail"
                  className="col-sm-4 col-form-label ps-3 py-0"
                >
                  Date:
                </label>
                <div className="col-sm-8 px-0">
                  <input
                    type="date"
                    className="form-control mb-1"
                    id="staticEmail"
                    value={creditCard?.date}
                    onChange={(e) => {
                      buildCreditCardDetails("date", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={creditCard?.statementCheck}
                onChange={(e) =>
                  buildCreditCardDetails("statementCheck", e.target.checked)
                }
                id="flexCheckDefault"
              />
              <label
                className="form-check-label"
                for="flexCheckDefault"
              >
                Please check this box if you prefer to not receive a statement
                and would like us to bill your credit card immediately for any
                balances due after the processing of your insurance.
              </label>
            </div>
          </div>
            <div className="mt-3 text-end" type="button">
              <button
                onClick={() => {
                  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                  setMultiFormStep(7);
                }}
                className='buttonDiv'
              >
                Back
              </button>
              <button
                disabled={isLoading || checkFormStep8}
                onClick={() => {
                  generateDocs(8);
                  setMultiFormStep(9)
                }}
                className='buttonDiv nextButton'
              >
                {isLoading ? (<span class="spinner-border spinner-border-sm"></span>) :'Continue'}
              </button>
            </div>
          </>
        )
        
        :
        
        // multiFormStep == 9 ? (
        //  <div>
        //     <div className="alert alert-primary">Congratulations, you have successfully completed the checkin process.</div>
        //     <div className="mt-3 text-end" type="button">
        //         <button
        //           onClick={() => {
        //             setMultiFormStep(8);
        //           }}
        //           className="btn me-2 btn-primary"
        //         >
        //           Back
        //         </button>
        //         <button
        //           disabled={checkFormStep8}
        //           onClick={() => {
        //             setMultiFormStep(10);
        //           }}
        //           className="btn btn-primary"
        //         >
        //           Continue
        //         </button>
        //       </div>
        //  </div>
        // ): 
        
        multiFormStep == 9 ? (
          <HealthHistoryForm patientid={props.patientid} back={() =>  setMultiFormStep(8)} complete={() => { setMultiFormStep(10)}}/>
        ) : multiFormStep == 10 ? (
          <FamilyForm patientid={props.patientid} back={() => setMultiFormStep(9)} complete={() => { setShowConfetti(true) }}/>
        ) : ''}
      </div>
    </>
  );
}
