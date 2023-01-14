import React, { useEffect } from "react";
import "./appointmentnew.css";
import { useState } from "react";
import SheduleData from "./shedule";
import Bozzone from "../../assets/drimages/BozzoneDr.jpeg";
import MitchekkNP from "../../assets/drimages/MitchellNP-removebg.jpeg";
import Jonthan from "../../assets/drimages/jonthan.png";
import Lily from "../../assets/drimages/lily.png";
import Calella from "../../assets/drimages/Calella.jpeg";
import Casey from "../../assets/drimages/Casey.jpeg";
import Sherrie from "../../assets/drimages/Sherrie.jpeg"
import Icons from "../../assets/favicon.jpg";

const ProviderList = (props) => {
  const [show, setShow] = useState(false);
  const[isMobile,setMobile] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', setWindowDimensions);
    return () => {
      window.removeEventListener('resize', setWindowDimensions)
    }
  }, [])
  const setWindowDimensions = () => {
    setMobile(window.innerWidth<600 );
  }
  
  const isFound = (arr, num1, num2) => {
    if (arr?.length > 0) {
      arr.some((element) => {
        if (
          Number(element.starttime.split(":")[0]) > num1 &&
          Number(element.starttime.split(":")[0]) < num2
        ) {
          return false;
        }
        return true;
      });
    } else {
      return true;
    }
  };

  const removeDuplicatedata = (arr) => {
    const res = {};
    const data = [];
    const originalArr = [];
    arr?.forEach((obj) => {
      const key = `${obj.starttime}`;
      if (!res[key]) {
        res[key] = { ...obj, count: 1 };
        data.push(key);
      } else {
        res[key].count = res[key].count + 1;
      }
    });
    data?.forEach((item, index) => {
      originalArr[index] = res[item];
    });
    return originalArr;
  };

  const getdateData = (rawInformation) => {
    const yyyy = props?.value.getFullYear();
    let mm = props?.value.getMonth() + 1; // Months start at 0!
    let dd = props?.value.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const date = mm + "/" + dd + "/" + yyyy;
    const data = rawInformation?.filter((el) => el.date === date);
    return data;
  };

  const SetImages = (img) => {
    switch (img) {
      case 3: {
        return Lily;
      }
      case 20: {
        return Jonthan;
      }
      case 10: {
        return MitchekkNP;
      }

      case 8: {
        return Bozzone;
      }
      case 4: {
        return Calella;
      }
      case 23: {
        return Casey;
      }
      case 15: {
        return Sherrie;
      }

      default: {
        return Icons;
      }
    }
  };
  return (
    <>
      <div
        className="appointmentcard border-bottom"
        style={{
          display:
            isFound(
              props?.sheduleobj[Number(props?.item.providerid)],
              12,
              16
            ) &&
            props?.openApiCall &&
            "none",
        }}
      >
        <div className="appointmentrow">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <div style={{ width: "auto" }}>
              <img
                src={SetImages(props?.item?.providerid)}
                alt=''
                style={{
                  borderRadius: "50%",
                  marginRight: "1rem",
                  objectFit: "contain",
                  height: "5rem",
                  width: '5rem'
                }}
                width="100%"
              />
            </div>
            <div className="appointmentcolshedule">
              <h4 className="card-heading-small">{props?.item.displayname}</h4>
              {(props?.patientType == "" || props?.reason == "") && (
                <h6>
                  (Choose a "Reason" and "Patient Type" above to see open slot)
                </h6>
              )}
              {Object.keys(props?.sheduleobj).length > 0 && (
                <>
                  <div
                    className="timing-cards-wrap"
                    style={{
                      height: !show ? "34px" : "auto",
                      overflow: "hidden",
                    }}
                  >
                    {props?.sheduleobj[Number(props?.item.providerid)]?.length >
                      0 &&
                      removeDuplicatedata(
                        getdateData(
                          props?.sheduleobj[Number(props?.item.providerid)]
                        )
                      )?.map((item, index) => (
                        <>
                          {
                            <SheduleData
                              item={item}
                              UpdateData={props.UpdateData}
                            />
                          }
                        </>
                      ))}

                    {(props?.patientType != "" || props?.reason != "") &&
                      isFound(
                        props?.sheduleobj[Number(props.item.providerid)],
                        12,
                        16
                      ) && <p>No Schedule Found</p>}
                  </div>
                  {removeDuplicatedata(
                    getdateData(
                      props?.sheduleobj[Number(props?.item.providerid)]
                    )
                  )?.length > 0 ? (
                    (removeDuplicatedata(
                      getdateData(
                        props?.sheduleobj[Number(props?.item.providerid)]
                      )
                    )?.length > 2 && isMobile ) ? (<button
                      className="buttonDiv"
                      style={{ marginTop: "8px" }}
                      onClick={() => {
                        setShow(!show);
                      }}
                    >
                      {show ? "show less" : "show more"}
                    </button>) : 
                    (removeDuplicatedata(
                      getdateData(
                        props?.sheduleobj[Number(props?.item.providerid)]
                      )
                    )?.length > 7 ? (<button
                      className="buttonDiv"
                      style={{ marginTop: "8px" }}
                      onClick={() => {
                        setShow(!show);
                      }}
                    >
                      {show ? "show less" : "show more"}
                    </button>) : null)
                    
                  ) : (
                    "Slots available for other dates."
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProviderList;
