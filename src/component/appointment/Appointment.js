import React, { useEffect, useState } from "react";
import "./appointment.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api";
import { useContext } from "react";
import PatientContext from "../../context/patientDetails/patientContext";
import { useHistory } from "react-router-dom";
import Loader from "react-js-loader";
import Modal from "react-bootstrap/Modal";

const Appointment = () => {
  const history = useHistory();
  const patientContext = useContext(PatientContext);
  const [value, onChange] = useState(new Date());
  const [information, setData] = useState([]);
  const [rawInformation, setRawData] = useState([]);
  const [patientType, setPatientType] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialtyList, setSpecialtyList] = useState([]);
  const [reason, setReason] = useState("");
  const [reasonLabel, setReasonLabel] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [provider, setProvider] = useState("");
  const [providerList, setProviderList] = useState([]);
  const [selectedProviderList, setSelectedProviderList] = useState([]);
  const [location, setLoction] = useState("OOLTEWAH CLINIC (EDT)");
  const [timeData, setTimeData] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (reason) {
      setLoading(true);
      let request = {
        url: `https://appointmentapi.apatternclinic.com/v1/24451/appointments/open?practiceid=24451&departmentid=1&reasonid=${reason}&providerid=${provider}`,
      };
      api.getAuth(request).then((data) => {
        setLoading(false);
        if (data.data.appointments.length > 0) {
          setRawData([...data.data.appointments]);
        }
      });
    }
  }, [provider]);

  useEffect(() => {
    let request = {
      url: `https://appointmentapi.apatternclinic.com/v1/24451/providers`,
    };
    api.getAuth(request).then((data) => {
      setLoading(false);
      setProviderList(data.data.providers);
      setSpecialtyList(
        [...new Set(data.data.providers.map((el) => el.specialty))].sort(
          (a, b) => a.localeCompare(b)
        )
      );
    });
  }, []);

  useEffect(() => {
    setReasonLabel(reasonList.find((el) => el.reasonid === +reason)?.reason);
  }, [reason]);

  useEffect(() => {
    if (specialty) {
      const reasonPromise = [];
      const filteredList = providerList.filter(
        (el) => el.specialty === specialty
      );
      console.log(filteredList);
      setSelectedProviderList(filteredList);
      for (const el of filteredList) {
        reasonPromise.push(
          new Promise((resolve, reject) => {
            let request = {
              url: `https://appointmentapi.apatternclinic.com/v1/24451/patientappointmentreasons?departmentid=1&providerid=${el.providerid}`,
            };
            api
              .getAuth(request)
              .then((data) => {
                resolve(data.data.patientappointmentreasons);
              })
              .catch(reject);
          })
        );
      }
      Promise.all(reasonPromise).then((res) => {
        let rList = [];
        let rIdList = [];
        for (const el of res) {
          for (const item of el) {
            if (
              !rIdList.includes(item.reasonid) &&
              (item.reasontype === patientType.toLowerCase() ||
                item.reasontype === "all")
            ) {
              rList.push(item);
              rIdList.push(item.reasonid);
            }
          }
        }
        setReasonList(rList.sort((a, b) => a.reason.localeCompare(b.reason)));
      });
    }
  }, [specialty]);

  useEffect(() => {
    if (rawInformation.length > 0) {
      const yyyy = value.getFullYear();
      let mm = value.getMonth() + 1; // Months start at 0!
      let dd = value.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const date = mm + "/" + dd + "/" + yyyy;
      const data = rawInformation.filter((el) => el.date === date);
      setData([...data]);
    }
  }, [value, rawInformation]);

  const UpdateData = (starttime, appointmentid, appointmenttypeid) => {
    setTimeData(starttime);
    patientContext.update({
      location: location,
      timeData: starttime,
      reason: reason,
      reasonLabel: reasonLabel,
      appointmenttypeid: appointmenttypeid,
      appointmentid: appointmentid,
      value: value.toDateString(),
      providerid: provider,
    });
    setTimeout(() => {
      history.push("/schedule/");
    }, 500);
  };

  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="row mb-3 d-block d-sm-none">
            <div className="col-md-12 text-center">
              <div className="d-grid gap-2 col-10 mx-auto mb-3">
                {/* <button
                  type="button"
                  className="btn btn-primary mb-1"
                  data-bs-toggle="modal"
                  onClick={handleShow}
                  data-bs-target="#leftModalScrollExample"
                >
                  Search
                </button> */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 d-none d-sm-block">
              <div className="sidebar-left">
                <div className="sidebar-contnt pt-2">
                  <div>
                    <img
                      className="mb-2"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABkCAYAAADnn/DLAAABBmlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGCSYAACFgMGhty8kqIgdyeFiMgoBQYkkJhcXMCAGzAyMHy7BiIZGC7r4lGHC3CmpBYnA+kPQFxSBLQcaGQKkC2SDmFXgNhJEHYPiF0UEuQMZC8AsjXSkdhJSOzykoISIPsESH1yQRGIfQfItsnNKU1GuJuBJzUvNBhIRwCxDEMxQxCDO4MTGX7ACxDhmb+IgcHiKwMD8wSEWNJMBobtrQwMErcQYipAP/C3MDBsO1+QWJQIFmIBYqa0NAaGT8sZGHgjGRiELzAwcEVj2oGICxx+VQD71Z0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCSpUCz8yM2qAAAJdBJREFUeF7tnWnMHdV5x+N9BV6z79jG7GENSwmbWQKENVKStklUVVGUqu3HSlU+9XMrtVKjtqiJ2oQmkARIQwhQAgRMwpoEAw57zGYMJtgsNjbet/5+kzlXc+eduXPmzr333TzS0dw7c9bn/M9znuc5zzkz6RN7rigKbNmyZe6uXbuOIfKm2bNn/z4q0Z5IXVFgUlepJliizZs3f5ImX0s4kvAR4RHCPbNmzdo9wUgxkOZOHUgpY7gQAHn2pEmT/o5wIc3Yn7CecOLu3bt3cr93DDdtT9XHIgW2bt26/44dO360c+fObUzdu7kngWc7eHfTpk2b5Jx7rj0UGBwFtm3b9nU44puEYdf27dvfRc78q8HVZuKUNHniNLVeS+GEsyZPnnweaCzkhlOmTDmIcAHT+wH1ct4Tu4oCe0BZQiFkyDMA5anckxiAMwnh8jlBBejcKiLveV+PAntAWUAvuN8sHp8C6A7LgjALzBSgh/D+5DR+PcrviV1KgQmrfSMPzoEqM1FgpgO+KfzeQdgO2GSNR/LscO5q2G3cMU9JgUuaLwLMVdw38n8bYRfxthE+IKyfOXPm5j0YjKfAhAEloJnOdHwSYTHhTIBzLGE/gDQNcu3i/hEAfR3F+gXua1BkpnF/Y9q0aQcRL5nDw1Tub01CXK9y38XzU8nzSsIR/N6fIKd1FtpCHm+R1wvEe4rwKGEFIG0De3x3TYyY49p4DjecClDmAZLzCVcQLiIcTRCIwy4A9AmAtgJg/oaXa4g3BChPJA8BvFdIALA+JM5ThOf4vRWF55ipU6d+mvuhZbAh3gbyf4nwIL8Ny1Iuun1iQC2+lQMHJRxrLtVzutzKisiW+KoWxwR403kzA9DMJMjVnHYP567WfCxAOZn7AoLca9iVVV58KTABmxxwKXmskuORx5GA7lh+z+b5KoD7HOH3xN3E/6N4dxnhXMCb5B9kz1QZaiszLW81d5cqXyWfl7wTVpg39y3cnfrlpkGzMuPQV4l5yqpCP8WE1gUtjOPsZ5DG08yLeBuL2j5anw10+oZoi+i4q+ms+RBrM2aXd/j9FsR5h7CWoOwlwQXabMI+xN+P+xAhkQHTMJt0gtsgBxviv6aZA+Vu6fMEIfZfdtrNd0T+nf8pcxFg2ayMyP11njl4BMBUgPiyoOTdeuIdRjhKThkAGfIvKzN97uA5iLgXpuk+Jr93+b+Gu3LoBjmweRFvhvTgvyATdEFe3cjgMZ50E3Q+l27SY5+UXlNJ/wH21vumT58+ZlafBgpKOmAhHXgehDLsrVwG8exwg9OYhLcT5GpOsdPSqbaRlaAKmFmgBnBRrhx2NiB0cAhQ6xJkQQfL4bRFk5Ec0uXH1tVpEGTjZX7PJc0i/i+qmzbH6R3Q2dlvK/k5qFbBAB6YMWOGytyovwYKSjr4HTrwI4Kj2o6QQI7qnl356biok7NxfB/+h7gCMwXn0bzbT26TVtBO3gcwHi9n5n4S7+fVAX22ofm6+q4uKHPx8+LYNsp4A7q/OFYAmdCgZ2iIzIgRewmd+SU6/dMQdAFEK5T1QnZVoOqmI4uqWgasvHyY/lfjnlwFoF6CtWY7HfRvEJag+d/K1P1gZPdERUMvOImIZxGGUgx9zP1twouElU29pwYOSlsNMBfSoZdomgGgJzCSj6QDD1F+ystmeSp129FR1O5zpDyH7lVxmXz/QJ4v8f8F5N4nCPcBkA97VY754IQymzy/SZ9dTl8pF0+hvB3OJtyf5H4b4ZYmZY4IKEOFAaca84E05hSCnPOzgPQ0gRm4UH5qbdLYsZi2aIrPck3fawUAgLdxFxCPYQfVva4vF6A8CVBalqaypIzAKNL7bXDSr+MI3XUdBipT5qmEnKOCs9JAY39FI5fSsK/w/1JCImtWTZF9ofwoyrSq/dDrZQByE+G7gEUNvt/X3hSgRaTsOo4X2mvHJiizrWJkbeD/7ZgvHoPQX6AzruP/2YShstaP5am8IXI0nb1OeBwO+WPosARADmqVyNlV01PZtS8vWgsN3bRzRDllUYURylfz/AbAeQ/AvArueQFE1xtHc0mbzFnFRbohyGhMk07RTpNPU7/fcH+Ou7bSp5htBr2uXmVWErCa9rq+Rh0oQ0sAp9rjDRjcb4T48wHgRQD0CzxTQeq6waMlYR1ZWUWC6fk7hP+i/s8iM47k0qRlt60kFdC00d6lUQvK0FA6YBO/X9y4ceNyOuclwPmxU/tY5ZIBjLGgBIg6igjIf4YWg5AZq8atgOwESsWIRqLEqAdloNCcOXOcNn7JtO6S3FpA+Tn+99TwXtUbvX5fpllnytHw/V3Cv/VTo67ZLu3Knaw2EweUmWl9KaakbwDKpUzjF2JC0tliBh28k6A/pFOdv6cS9kfmOrqCiMP6JM/FgkKls4aiQ7ibMAusGO6dxlnLuvUjhOfJTxvf/un6+cEa5clfm9/z3O9HkXEr70hO1230cRsID6ZJh0CX0G7v0p53nRShyjEwZjhltiUATWXoPwDnf9OxEiArZE6CWDpv6Cu5gE5Vgz8LQp0D0dq0QomaJ6zlZMEVlAw6o/WcMlfhFTSFPPclbmEHFE3PaXmP0XF3EH5OUa/CARPHC2x72mx1OCba7q0811NoVF2IUNL5cOqnV1ZZ3XQemdek4mMSlKHBqZ2zyP1Nz5m36ehnWWZ7HAKeBag+A4guI7hEllwSNk/cPOcjvaKC7muJqMB7XdeW8nMTz4bIT+8k7XYHEuZkuUa2Y0i3mnQPAca7CHfD/drseKkbX2NXvm7BgEI5MwWTwFOjlzvr9tYaNPyXdp8i6K3VusLATh/MgwbHQ/vH8230Pc/Nf3enpcgxDcqqDkgbvgZCPAwg1kK8lYSzIJrHrxzKXTAlnI7n+jHqCqbMqnJlx3xEuvUAT2PwacTXP3Gj+QCsN3nmFnBpqHOJHucCdJ+UI+vltJt4upXp0KGi9iThiaLOqmpLP98z4xxPG6+hbidYf8JO2mA7P2RQvs9/6bEP/13F0Vk6qU7RAOTZLAbrZXJ70rpFRBBKF/czedf4vgvdQOvKowYsLW2zwrgGZehIQLABYC5PASRI9OEUlAekAAp7dORUdoaG/HUEHQ18J2dQ0XLacoo1az3Jf0dcASuwJfZQep/Dc9PtJq4ENy9B/CqLBGtCvUbLHRDpJPMX1FlOOCUnvmxPAeq0rB9rx2r73lmJuPq2biBoTNfxWrBnPf4d9C/TJzfDpf89a+aaEKBMpwxd0BTSdbD1tyBSjkucaAmOaBUk/3tf65oynEH51HfBIDyLNBJY+dQdjwLV/05bdoCOx4JYRwU1UYmve5tl7KAD1tIBOjWPigvaCBQ55AnUf5jR29mBdzpRRy/5pgNXL6JOl1r86cRVPFK+1gM/uSYEKGnnfMB1HkGHXPfbOIoDeASQQEw6RC4JGN9l2k44HUHWYMeEDhNcpj2YcAhc4TDyUmvel7ydunUKNr5AJqtky4TT3wf8PkLtFCD8bLRo1NRNkcS2eE9AEbih/6s4YwXw2qwTRXGh2UJo7dQ+cUAJAFRGrgY8V3A/US6ZgkYaJftYUuCFDtGJN/HxJO5kCOYpawnnS0Er0NyQJrAPQAs/nudyXsE4bJATbyjtjAVyajpax1v35Cyr6tBBvKdOtiXxnG8CwADouqBWJCBNmwVj7K/XVffcOexIvAageWqaTsVO25NT7iUHa60+SNiUuMqNBwO+/fm/l1M092QVg7t2xWRKI1+XP+WS5tlx1lHGpPPnI9RrAbgsNa9U177PMRx46aAbVlIWaFXVCNN7FtgxILcfCG3r9+MalHDJSW5ZgDgnQlTBlXADwLbeKZrwBwiyLgAzKzcBHM8SUp5MprUMKAWnXNPRrfDvu+xar+8lss61igFuBstyoSM8g4i8dfEa8ct2ZUFRxPGylQwDN8TLDORuQa3rYtvy6XiXKacq88nVshQDjGsBy1sAQ+14M3G4JTKm9HCgujKkrfN9nqtBCmjtdnJQt0K4aqFWup4gcNWwBaZcV4db5UcVJbX5/eCoTlFhT5KeTscSTuVZS44aKXRSf+uoOOGZSCp+raoUcbr8s07csIJTas3Q0+n/0vJb5Y53UAo2uVnWjqFM+HHKwdSuNWJv4K6saacIynW8f4V4rwnQFGzuI/edR7N8RJ5ywXeRKdXoBZ1LMdvTvHWi2KTsSVy1cIGc3e7rAGjbATlSoHTlCHuiBn2N/+5tdwCGU0PcKOeA04arMqioojLXsbrOPoTHiBSsDNLWVR7bbWJNbe57v4dy782fGDLeQelUql0yWTtOiRlkKInsNP424S3Bw3/B4wrG+xD1bcKHBAnpFO6+IumVAJLgXpgNANOttypCiYbOM/MXjHMBeiJvpiHbkXLVKr/EgeEUTn4XBvQ3qLt+AonMLc347wA0KKEI2tNpk1tWPsk9vw0iqS+09JSR+7h/n3QeV6OiGOy44SAKZ6G3ylzwxjUoMbu44rISAmoLGwq9nE7pW5Ub4RKv8PwdiOfKhXKgx7Uk8qAnSyCXns5vN7W5KUsgf8DvtcR3/V2nCQEpyHyXbBXgvYb5Q8jfveFH2YFtiPzjypH5jZqLJdvnbU+nCrFl5dmUjjpdt64854QmjxMeYqEgq8BELxqMa1BKNc/8gRMsFyT8TdZsXcfmv57srvcqU7m0+B5B75wVgjOzvUB5a2HKTfU8Wsd/T1ZTENVorgYfNHJlznkED7paxHNPBLHc7OUU/zr5vDBqEBlfkeVEfZ02OQMVbjFOAfpWDpDxJRBzIoByKSC8H0JqI/QQgQSY/HdF5iAAq0liB8FVHI9pUSuXQyZaNr8Pde7i0rlY8E7iWbK1lJBskOK50/5elkHwKBenwaMIR4TecFpLO+w1fj8A6AX7mLoA2nZWpBRpkn3v3JM2hXumMQ7Urq9xD8q5c+fuhJA3QbjpgPMaiKh5yGlWUNl+BXtd0AStCorAc+16ksoPQXCpALgSdCT/p6Pc6LCgArCZu5w2rIsL9ORsI4KKTGutl3QeHfgSnPt2yri56x4b4YS01wHMrVzZ6fgyov7jHpTSAIH6PYB5Az+Va3Rh85wgtUHBtF4PIrXlFFBnADo/UzKPeMqGcjtPcXMpLrhsBUVFBSpx8SIk6+N0WKJIEb+1SqG8Sv7PUs6d/P4+HEdBf0xe1N/BnKxuZYGZ5ZqCtknjJgQoU2DqKfQ9CPYmHHMxBNUBYW+Asg7AGJIVF2VA3isTJm5oBM09+StZDycvNe+2d7n/ct0VlPFrOOTd/L4LQFZtumrSn4NIW4iZ0O703mhRZsKA0t5KlZcHMX+sgHieyHE8gJnHfT+AeCDhcLljFohygE6XsmJOuzbBVtKtkTtyfzTd0uC22PFwVW4KGzPTd3qgp5zHM8IT2186BTiFakt8j7COqbbv3teYP16Da2oYls255HcSgFQJanPdKhDgs6ASfGrh1j9ZzXEFhzTaORUJnics4b3n+biUVnnh+Hotkdy+oYyrSOAS5dvcNT9JI8vKc1pBoghhuaYxTti8paYfjP8+3wF9G21/pT6ay6yLK1lFl4sRXZ+OYYYD4ZQQ+wg6/s8g9AWUqWaqSUa7XuAqNkKTzHK3L0DI2wGOjrZ9u+RkdpJTtaAsEtzzMpOVIV1SV8JHvBeEdrpazHY1GWnKc+1zfhTqRabrKEAyvX+VdH9LUN6VNspsZLFbAITtCVlAOaCy06RlB0CGbbDWzUGuhWG9ihzleFeD1i6rpUFv/OUMHNtUeUGrN6mXNlZNXsmVo50HJrxYmVGHCH0HJVPlXnT8N2jM56mHysKwK9Ooxby8nL5dRLp/Aph2SF8uuSSX8mPbQU2ByHSUJqL3Um1cjdMVDpfHXDqTewlqO9x9OR7SNUTwMFXFAF3f1PCjBH7aqgx7PWnPzDXWOjqrGBpd+UFHXQW6K1oedf0KjOO3/H6Y308D0E6b1p4hzo/J7zri6xY4h3viXc8zj9y+kX4T8F1ffQclNbuScDUhAWSZjJYhmu5gf05Ujcu3dN2yioTaKSnHrzq0bIkBkFYT4i51Cua3y4qyLM87lxsJSB0pVokY0utccaBKEs9UlGxnAmJtnJH1d7uA6Xt+ZemdBSa/HTjup9Hmegp1/UwKtIcRtX5BukdcEctXyMNXGUT/wPMfkuZg2usnp7eQdhW/X8U1r80NrZsG9RWULEtNppKXZgleMGKHeTrTuEXaFJH73PPcSD7pQJSjMZy3ueyHujHFvemORTrmtzxby30ucY9xJUgPIESM13jm2rjat2eeu8Z9Av/d1mt7pKtgPU73uapDRFWWSNfqizSPpOrZ3910cEiTp3s+L97vjSnsPJ6fRX3O90Op9N/3ED+GGcIBpoOzclmy2/o2Ut2rCtW8QpwzquIVvYdIHlJ/WTdpI9PoYGBo+8SdICA4EHRbe5rf9/Fbfz9ti2FTme5srp3vAqQezq8C55p3q2h+e8CA8nPbdtSSusldCqfMokFcNtuU0HGYPTFtY9ms5VKpyt9fU/+vM6gUQwZ69RWUNOoSWuN21tKrbATzXAXkkn59Yo78BUvCnXJg0sSjsmKn6XLlxrCWCxe/g7at0qEB3s1irt7kL9fGh3hYpqVm4yfuc4PoeduVDZaZB7nv6btTCF8jfDX9LMwgqpeU0TdQInfMpUHKknZM7UvCAA4/ytQVp40osI07ZYFJuRrM/USeDhh+Es+6BCdeNVu3R7hdwu/ruGfao2OSK+RjR6sk8ShGxoqNV3iAQkRbO0YpYgwpME+mD7/Mb0WwgV19A6VcjsZc3KQl5HGC+TTJoyxtKhOWuY/NoVynX6d3FRydMLQD+lm7hEPyfiHhVEB5RsoR24oijY7CL0d+WClw3340tTDPMIVXFUgbXXK9Gvmy4wcTqvKp874vig5c0gOQrqMiicwWexWMWL+neCn53YRwvSI2n5h4dIqfpHsC4GkXTK6gVFCPGYDtMN7NZ+pya8MWlJtNPgdo7t05jvdaCeTiib0ur5CYP2FJTF2IE5xDIqO3plxtoJ6+oT0y7Mx0zV2RYYiQ7EsquvLPi+KFNtFeHXvvJ587oyvYIGJfQEkD3GP9mQb1aiUlr9MBhWalb/Uiv5CHB0thm7udenqgwJ/4PNMxLhPqtqbychS/5ZLKjfsTfwZ1kosKxvmEYQOP+NrrHEiPR9ZZIEVzolQ0WEIZvyCdWrCG7+AU4kqZoNTUo2XgFO5uA3YQJYcKZK9O2n2I66xAvKsZoHdDt76v3fcclFRcTvKXNNzPkDTaS5wSz+0El6Hw3MJUuC6yk6Oi2alwwIPpOA+rcuPULOqsR49HvKwmzPRDoHYm7w+lXSo+tk/3tHByRlJW2oHuDHwSburB+P8VVYk/RhJIySpOzGUdKeNeyvh2lcmMaZeqJeccnUG9tWi4//1TWXBW9VMqUy+mTJVW99b09eo5KJ1uacRnMx1V2YCg/WWVhGx6AHGOI5VnP6jMrEYERz2d9iPyduVIo7hHB24AjO/TjlnYWM/EPun5OpUrKuThRjJXRW4n/g/Ju84eHPshe85OYSsy4oUD56kqQJoJdkZlYDmppq37YBo/o21fY7B9BXq3TonrRLa0XBcGPjXmQKnTBdcVVNypo5eX/oxXwi3viumIOgXTadvI916AaN1dmz+CDtN4b6iUif+43J18gfYZgHI/oZsjWerKlMqQOmnUvhgsv6Wf3qLezg6utbedTtEhQ+2XOkj3/eqp9s1IUoa5qG6t5ZBlArl5pdOHJ0tcXzfvmPgAyu2wrmVPo/4nwR39dnclIM0bMLt7z6VIPXo8+k7zTt2r5TgbmdD4lS5kZXkBzD9Q529T9wcjywumqAXpgVixybqK12tQfg4AFZ78EKbo2FoWaIeus17LKM9vxIrNsjQeZU2DOy4keLjqMZ0GSD6TdMAcTd20V7q0GK2wZPISZHX6Ihyg1XXbAaYfhXo01jRkQbRNx5GhrguNTFiHEB2zBCwK05qBoqaDVIP0k8Vt+ZaBN+18P8l8VWTboqMBRE08bpNQZkqu2M4inasfLhRcxO/ruXdjaK7bD8avm2YYPWijuxPreGLZx4WeXtHEjojYuGGhDDrjWip8TlmZeW2PUfoSU4gnM/ySNG1mhjJOxXM1YJcee7Yeqxys+Yq829bZq0SK0E7StkQP0njU4FV+czKC9tkodftBu06UW1ynelBfRY3k+OiYi/gqfEMxcZvEqUuMwrKw92kmuYhKF+1nKUwDGH+dnqTwICM2aqtAyi3P5X5+k0Zn0wp0wmKeuSen8jzFinJdM7+AkPeL7FV1Qz5OL408yNOMWmdSxlSQfnJbbbTpKibPojg9AaWdACg/HdupqVLg6RJ+0k25xnNnSqeR7JROWQsIF/dK4CYvj2PR7JNceY4eQ9jsVE9618o9GbfuVQdkzix14hfWhXpriqqDAeNWmq7qNjwfv06FCsvSgwRAXsPLYd5AAUx5OREwulXgd6Rzqc9PeGhD042+EBRZoPgb7XgxaXtlnnBtO0oODoMuL2/mpnqdNTSu9/NS8+4FKGdCx7aT1ooqnaG/IkPjcqsI0xiUVPg0wuUVjWm9TjtUDvkYNsddHrPM73sJrq16GFLM5ZKZKzC9uJSrWo7EOa5c6NaVlzdzg06n2Nh2hPrXlQ+LNpB1Q4shEkUPSOLKoZPDwvp5NQYlI+1yOunUskraYVlO5xIe4c70uzFJMj9ZodGZn49m88mmyz1XCzybKbyxfEP9fk94ipA9ma2tOXXMWcTVVul6dJ2rroxoXRuvQdN3bteogwHL7bvfZ50KDSMyWuZBqbE8aqQDPLeh3kOnDfOewZyisiMw37CgKiBA0HMIjRUKNzk5SCjyiTwXCAMqPzjC9B3qmHnvgamuST9ZB5EpwOqArGvDeahX6u+qo0adS0D2/bS4RqAEFFc6fXdqVU5xWEZH3lb2wXQ68y7yivKsIV8N1pe6B6YOVYviUu5PAdP3U2tAchx0/soCMUzfubZtFpCEmxVLatZJkNVNU2faHVYd6u63c2o5UEMD3fG6Wt6sQ4+uQYkZyO2kOkkUbQUo6lSX8n6mKaisghDJw0h973bNQmCEh7z3mOaLu9R02/LWeYLrB7Tpu3gN3QGwVhihqA4lXHMV7fpf0v0neT1VpwPSuOHwgNikii3uC+rqQjnVWvJFEi+skYE7PJdUbL+tkV151K5BSedcpyE7n3WZHEiDHpYjRezse4Y8E/eoqimcKCenmn9jYqQy7kPKl2TWdjB8AGjeXER7XgHMOnPcKqdFFHigy4rU5ZTuDVqYfrQqqkiAOFlxi4H3ZUSlZB9+WV8VZQhdnks9oKLKaxKpK9c1zUA0aDEF61/YAk9ZI2mQU6IdXnlygooHWS4jqDwNWxnJKk6U51F9V0Hou1GWKvOuIhSceosmEu52eun2VjpHJ4xnDETzcIKXqZe/u73q2h0PoyAdXzb5eT/u2niT8zQJrr278qJZSm46DzqpGHrwwjG072R+m77WRft+yqCLPo23Vua5yF2BksYlnyoOeVWNODrRjf1PxshaxPVYvmXk7zp3x2OMLZe6nEn8z1GXxqC0E9OPNR1l28w/bz0IbXZ5UQAQX2+iNakLW5O+qEwb6Mx9EmLCl0igoicgXUkTjMEvM9w1dDuwo5c9i9qrSMVscGNlBXsUoTYoUy55PXSJMl7TII8GeZH7sCmxqA1udHezP/m/mgdlSZt1VL1C51U6qtGRzQDNkyqSvdplYAxg5X4CA0KveM8vl0spW7tfpptLzaquwiYQS01x3VQi07bs7OfRNd+kX97sNs+66WrLlMqRBP0ao4hIh2lG0Nh7CFNNMt13utJ93tYr2lEAcHj8ih5KjS7FATKoXAOXYznNEwSwp7Ud7RTZoPCeOFh0U36Z3G4bCR7a9W1mg1u7ybvbNLU4JYKyB4teRmU9bjnqIq7n7LgNVTnnAqYBv7Ei1/QQJA+Ikkv4rRunGGVVt7d6lHMyhcZcxNUScDmA/gkigjJWt1dyGKqJM1NlVV7Wey71b7ImnD9BrarMnr2vEL1+CCj/sWeFRWZUC5Q0QK7QkiU7TXGhfOK73dZlSGXExPRBOsHo2Y5utHLqC1zXJTo377spSy4UfZHX6QT3BnUNSuri9LsuC8p8BUpkLo/Xa7LS4cygkjIqLtqinPoD7n/PtD3sLKF+V7IWKNV0CafXrVQ6GlvHl2RHZ9lIDdNKxUhuVUVuyTSubHkXsuXrdetofGQnv9ig9n8u5bd9jD2bX3bKc6CRzj06TVY6euK0202bC9L49Yp/hUN+Kz3IqkfZxmcTLVNidvEcR0+aTcAVwyXLqpGXY8r+xwIycDbqd5qrTPHNb49JJ6xDyVpC0FpQmE0qa7WmdzpQw7lbC5qsdNR1Ieu2iaXpFKlow62IV19BhrxhpABpBaM5JZ2hLNnaLlCHKkVcLw/q/P86gAx1AZCHQNjzkS1vRLaMOcNnWDMAox5MnpzhuvA+VVo45XkS7qtlS6eRdBoJTqnyqVz/CvVfQrvvwCVwWWR9+xotCpRwSb9Bo6tYy7M8D5pO020+bt3/+akzpM9No0k0gOlGe0WMqDX0AuquxhC/zgMKyL/y45hwFs8Ar+uqli+248axMDCyA0QDPm1dR0bKf0Em9R5WhwRdOAfdu6d+GFf5V1HDr549zazwGwbUwOXGTqiOAiUZaA+LWrzPT8XdcLwYEBqnCJw8djeiB2t1BUo6ejdBuiTKVxHws/VjqtuXOE3MQUlTQnmdOiv7Ds72S/4/QNnKwCpZupUJSO8e4aIyuRnwOmM4wATmDqblvvtDxrahLF4UKF1fpqMXFWVSVyFpUuEYgFNXN4ItRuH5HxSeVXXL01pAcHWkTagsKtu2w1Hn0/HHeKhXgw6vNX3L8SjT7/KojNTZjViXHCMSv1LRgb2fpNZN7Qrj5jljr1sRA8R8HOp7Is+GOYvE1I32JF9SIK6fFC48D9I2Z9rtOvm+hCYmnbp2Sr/R88x4BKR9VMkp6eDP0jmt4/LyHRs6LjxPO8yF+xWE93jvVBKmk2CT1PVKLV6OZNB5wG2zGqLtIKceZbXVpPf0CQ3sB6b1qDy5gnhuxXVzmb6b0StDtoGO9qPsy5mWV/LX2WHYYMwOAkEMQDYQ6vpDDiNl0aApGfS2qdEXGGIG6EjF6QhKpiTXdi+0r8oqmO0g+gVRZ+cS7h5R9zTv7FiVAGWe7GanIJjLXXRWDR4trvoITOWedQS/EOuXFlzf9mwfj27RD7Cjl0s6UC4WmMS9ty5xaYPftX6S8g7h9wJ+z84PvpAnis47tPfttM51i8rGL1y2tdwCOd2Vr75v4GrSmCZpO4LSNW4a33ZqRNl0KuHonF8RvkW4k4Oj6pw6VunIoIsWZa+lTguyoMxqpFlCEG8+764i3cN1tUvSvZaeoObXbHX38rvdreNc0rbaXp1NNJz7wfomIKmr6DiQK0+CawKMkUxbKlPCJV2z/gKVa/sWTJkMqfBNUBu8uyYgo9qfdrr7eF4rS5DXlFV4iNvN4a1y/HfhgppNXOXRY2kF92SKdqbm3ceYysKBVpWyeUUjO6YPjCDTPplJv7fxRvVLPyKVEgNCfD7t1Fa5RVNYRvt2l2Jf3eUBymbA4FmLCRfOc8kChceD5K+DW9Y6mpB8/UraAciX+xH8AJLr9OsocjV18MDS1cicW+bMmbM37/zw/BGU0WTPjCBrKUr5dmRonPRF+r+JYtUPLPUsz0JQYk7xhDNdwSrP7AkEBJBLib+sZzUryCg9iFS7WwLKMlEim5R2eHJtrSMEWdk40UOvyOcAlJ6dzBofpEZyZWP3D6mdK/cKWI+a9nz0JpxLZa+Jl1E/yT7wvIfJlADS7QB/Q0dGnzMJIN+BezzhOeL9bgFcIvlSLMCI8qamHYdRPw/F+hUiQLL3p9MF+FQiFlDGvrRpK0GxRC6oGKPcqEF6rRYBp3E45vv8dN1boHZ7JW57NRJbjzoye42sRz5qkaLzp3SkRw9Hn7NI5ywjPDqI5gAAHSDeZuBE7eaTm9IeD/N36bESlIAMUXGbDhaCz4O7ZpGHRysH0LjfaCnv3J+ugvYB/7UZNlkpaa0gRdJQ2bbvDCCyLj2P1gZKzv8+XeWGkPgylmm22VrIJeggv6H4Ss9rV5Ah5Xmu+OMAxX3fUdySuAcRjqF9U1DCKjfys/a9lLjPKFsSwkYraeV5mvpr/pyyn2Jm+LhHbZbr1QG1dt9xt5ITaNmSKZne9Ph22+zZNQi9g+ntLjpqYO7yAMHVjFspM5oza2d0GidEy22CF0VmHbRYQRB8gkZnBrnt0z0EpOTWlru2Bt01nDfx36xR1OCjtjglHXccU+LZdFyyR8WrQpFQ4XgYUH6HDhro6gLAeAhgOqXOo45Oy1UmFbfOuujSjS3xA8r4iJA4OlD2m8wKTbzMi3rZRQZNXQsjIOC07REz4x+UNHKqHQfxXd7bO526wylbThe6N9kZBkGo/e5+AFl64kUEgbuK4lZdNOJbUoXnPDJxP4+eOkMEZU1XoBxw6iN+SGYl4VnkvtpyGEDeTlpXlbhNkj79mDZ1HJHzO8CKPI4cTNLdvU2PEL7T0FjfFd0HlSgrUz6H+eMnEP1FpzsqoEOCn4BzRLqWrVDvFBOmsi10cleOtL1oXOqMcDNKyR3kp+nKoFlGBwm5vbZJ/ytDLgdUnlNU+3K2ILjMqXypJh61i7NOQR6Fgvj0I+gv+DzAVfoHEEp/wWiQo67MnlhXp5yxErcFSjgedNn8Pc0fsgQakHBJnncz5Q2s/SglDhKDJ1X045oETWZo/pEuziD9uFQUof+/kPcQQcXHmWnTeOaIZXRs075TAtSe4vrRSaMlT6dsgKhA6qqOYkzfVlLSLRwjNvuMFpo3XbMdLe3oWz0A4hCgnAMo/YCoR0fXWrLsW8XGccb/D6sltND4S1IHAAAAAElFTkSuQmCC"
                      style={{ width: "70px" }}
                    />
                  </div>
                  <form>
                    <div className="mb-3">
                      <label className="form-label text-white">
                        Patient Type <span className="text-white">*</span>
                      </label>
                      <select
                        className="form-select"
                        onChange={(event) => {
                          setPatientType(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        <option>Existing</option>
                        <option>New</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white">
                        Specialty <span className="text-white">*</span>
                      </label>
                      <select
                        disabled={!patientType}
                        className="form-select"
                        onChange={(event) => {
                          setSpecialty(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        {specialtyList.map((el, i) => (
                          <option value={el} key={i}>
                            {el}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-white">
                        Reason for visit <span className="text-white">*</span>
                      </label>
                      <select
                        disabled={!specialty}
                        className="form-select"
                        onChange={(event) => {
                          setReason(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        {reasonList.map((el) => (
                          <option value={el.reasonid} key={el.reasonid}>
                            {el.reason}
                          </option>
                        ))}
                      </select>
                      <label className="form-label text-white mt-2">
                        What reason should I choose?
                      </label>
                    </div>
                    <div className="row mb-1">
                      <div className="col-sm-12">
                        <Calendar
                          onChange={onChange}
                          value={value}
                          minDate={new Date()}
                        />
                      </div>
                    </div>

                    <div className="row mb-1 mt-2">
                      <div className="col-md-6 col-6">
                        <h4 className="text-info ">Filters</h4>
                      </div>
                      <div className="col-md-6 col-6 text-end">
                        <span className="text-medium text-white">
                          Clear Filters
                        </span>
                      </div>
                    </div>
                    <hr className="mt-0 mb-0" />
                    <div className="mb-3">
                      <label className="form-label text-white">Provider</label>
                      <select
                        className="form-select"
                        disabled={!specialty}
                        onChange={(event) => {
                          setProvider(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        {selectedProviderList.map((el) => (
                          <option value={el.providerid} key={el.providerid}>
                            {el.displayname || el.firstname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white">Location</label>
                      <select
                        className="form-select"
                        onChange={(event) => {
                          setLoction(event.target.value);
                        }}
                      >
                        <option>OOLTEWAH CLINIC</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="card mb-1">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h3 className="text-medium mb-0">
                        <strong>{value.toDateString()} </strong>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb-5 ">
                <div className="card-body min-vh-100">
                  <div className="row">
                    <div className="col-md-6">
                      <h3 className="text-medium mb-1 mt-1">
                        <strong>{location}</strong>
                      </h3>
                    </div>
                    <div className="col-md-6 text-sm-end">
                      <h3 className="mb-0 text-medium">
                        5545 abc, new york, usa, 110010
                      </h3>
                    </div>
                  </div>
                  <hr className="mt-2" />
                  <div className="row">
                    <div className="col-md-2">
                      <div className="card h-100 hover-scale-up bg-light">
                        <a
                          className="card-body text-center d-flex flex-column align-items-center"
                          href="#"
                        >
                          <div className="sw-8 sh-8 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                            <img src="img/provider-black.png" alt="" />{" "}
                          </div>
                          <p className="heading mt-3 text-body mb-0">
                            <strong>{reasonLabel}</strong>
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-5">
                    <div className="col-md-12">
                      {loading && (
                        <Loader
                          type="bubble-scale"
                          bgColor={"#0c71c3"}
                          title={"bubble-scale"}
                          color={"#FFFFFF"}
                          size={100}
                        />
                      )}

                      {information && information.length > 0
                        ? information.map((item, index) => {
                            return (
                              <>
                                <div
                                  className="cat action"
                                  data-toggle="tooltip"
                                  title={
                                    item.patientappointmenttypename +
                                    " " +
                                    item.date
                                  }
                                  onClick={() => {
                                    UpdateData(
                                      item.starttime,
                                      item.appointmentid,
                                      item.appointmenttypeid
                                    );
                                  }}
                                >
                                  <label>
                                    <input type="checkbox" value="1" />
                                    <span>{item.starttime}</span>
                                  </label>
                                </div>
                              </>
                            );
                          })
                        : loading == false && <p>No Schedule Found</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <div className="row">
            <div className="col-sm-3">
              <div className="sidebar-left">
                <div className="sidebar-contnt pt-2">
                  <div>
                    <img
                      className="mb-2"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABkCAYAAADnn/DLAAABBmlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGCSYAACFgMGhty8kqIgdyeFiMgoBQYkkJhcXMCAGzAyMHy7BiIZGC7r4lGHC3CmpBYnA+kPQFxSBLQcaGQKkC2SDmFXgNhJEHYPiF0UEuQMZC8AsjXSkdhJSOzykoISIPsESH1yQRGIfQfItsnNKU1GuJuBJzUvNBhIRwCxDEMxQxCDO4MTGX7ACxDhmb+IgcHiKwMD8wSEWNJMBobtrQwMErcQYipAP/C3MDBsO1+QWJQIFmIBYqa0NAaGT8sZGHgjGRiELzAwcEVj2oGICxx+VQD71Z0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCSpUCz8yM2qAAAJdBJREFUeF7tnWnMHdV5x+N9BV6z79jG7GENSwmbWQKENVKStklUVVGUqu3HSlU+9XMrtVKjtqiJ2oQmkARIQwhQAgRMwpoEAw57zGYMJtgsNjbet/5+kzlXc+eduXPmzr333TzS0dw7c9bn/M9znuc5zzkz6RN7rigKbNmyZe6uXbuOIfKm2bNn/z4q0Z5IXVFgUlepJliizZs3f5ImX0s4kvAR4RHCPbNmzdo9wUgxkOZOHUgpY7gQAHn2pEmT/o5wIc3Yn7CecOLu3bt3cr93DDdtT9XHIgW2bt26/44dO360c+fObUzdu7kngWc7eHfTpk2b5Jx7rj0UGBwFtm3b9nU44puEYdf27dvfRc78q8HVZuKUNHniNLVeS+GEsyZPnnweaCzkhlOmTDmIcAHT+wH1ct4Tu4oCe0BZQiFkyDMA5anckxiAMwnh8jlBBejcKiLveV+PAntAWUAvuN8sHp8C6A7LgjALzBSgh/D+5DR+PcrviV1KgQmrfSMPzoEqM1FgpgO+KfzeQdgO2GSNR/LscO5q2G3cMU9JgUuaLwLMVdw38n8bYRfxthE+IKyfOXPm5j0YjKfAhAEloJnOdHwSYTHhTIBzLGE/gDQNcu3i/hEAfR3F+gXua1BkpnF/Y9q0aQcRL5nDw1Tub01CXK9y38XzU8nzSsIR/N6fIKd1FtpCHm+R1wvEe4rwKGEFIG0De3x3TYyY49p4DjecClDmAZLzCVcQLiIcTRCIwy4A9AmAtgJg/oaXa4g3BChPJA8BvFdIALA+JM5ThOf4vRWF55ipU6d+mvuhZbAh3gbyf4nwIL8Ny1Iuun1iQC2+lQMHJRxrLtVzutzKisiW+KoWxwR403kzA9DMJMjVnHYP567WfCxAOZn7AoLca9iVVV58KTABmxxwKXmskuORx5GA7lh+z+b5KoD7HOH3xN3E/6N4dxnhXMCb5B9kz1QZaiszLW81d5cqXyWfl7wTVpg39y3cnfrlpkGzMuPQV4l5yqpCP8WE1gUtjOPsZ5DG08yLeBuL2j5anw10+oZoi+i4q+ms+RBrM2aXd/j9FsR5h7CWoOwlwQXabMI+xN+P+xAhkQHTMJt0gtsgBxviv6aZA+Vu6fMEIfZfdtrNd0T+nf8pcxFg2ayMyP11njl4BMBUgPiyoOTdeuIdRjhKThkAGfIvKzN97uA5iLgXpuk+Jr93+b+Gu3LoBjmweRFvhvTgvyATdEFe3cjgMZ50E3Q+l27SY5+UXlNJ/wH21vumT58+ZlafBgpKOmAhHXgehDLsrVwG8exwg9OYhLcT5GpOsdPSqbaRlaAKmFmgBnBRrhx2NiB0cAhQ6xJkQQfL4bRFk5Ec0uXH1tVpEGTjZX7PJc0i/i+qmzbH6R3Q2dlvK/k5qFbBAB6YMWOGytyovwYKSjr4HTrwI4Kj2o6QQI7qnl356biok7NxfB/+h7gCMwXn0bzbT26TVtBO3gcwHi9n5n4S7+fVAX22ofm6+q4uKHPx8+LYNsp4A7q/OFYAmdCgZ2iIzIgRewmd+SU6/dMQdAFEK5T1QnZVoOqmI4uqWgasvHyY/lfjnlwFoF6CtWY7HfRvEJag+d/K1P1gZPdERUMvOImIZxGGUgx9zP1twouElU29pwYOSlsNMBfSoZdomgGgJzCSj6QDD1F+ystmeSp129FR1O5zpDyH7lVxmXz/QJ4v8f8F5N4nCPcBkA97VY754IQymzy/SZ9dTl8pF0+hvB3OJtyf5H4b4ZYmZY4IKEOFAaca84E05hSCnPOzgPQ0gRm4UH5qbdLYsZi2aIrPck3fawUAgLdxFxCPYQfVva4vF6A8CVBalqaypIzAKNL7bXDSr+MI3XUdBipT5qmEnKOCs9JAY39FI5fSsK/w/1JCImtWTZF9ofwoyrSq/dDrZQByE+G7gEUNvt/X3hSgRaTsOo4X2mvHJiizrWJkbeD/7ZgvHoPQX6AzruP/2YShstaP5am8IXI0nb1OeBwO+WPosARADmqVyNlV01PZtS8vWgsN3bRzRDllUYURylfz/AbAeQ/AvArueQFE1xtHc0mbzFnFRbohyGhMk07RTpNPU7/fcH+Ou7bSp5htBr2uXmVWErCa9rq+Rh0oQ0sAp9rjDRjcb4T48wHgRQD0CzxTQeq6waMlYR1ZWUWC6fk7hP+i/s8iM47k0qRlt60kFdC00d6lUQvK0FA6YBO/X9y4ceNyOuclwPmxU/tY5ZIBjLGgBIg6igjIf4YWg5AZq8atgOwESsWIRqLEqAdloNCcOXOcNn7JtO6S3FpA+Tn+99TwXtUbvX5fpllnytHw/V3Cv/VTo67ZLu3Knaw2EweUmWl9KaakbwDKpUzjF2JC0tliBh28k6A/pFOdv6cS9kfmOrqCiMP6JM/FgkKls4aiQ7ibMAusGO6dxlnLuvUjhOfJTxvf/un6+cEa5clfm9/z3O9HkXEr70hO1230cRsID6ZJh0CX0G7v0p53nRShyjEwZjhltiUATWXoPwDnf9OxEiArZE6CWDpv6Cu5gE5Vgz8LQp0D0dq0QomaJ6zlZMEVlAw6o/WcMlfhFTSFPPclbmEHFE3PaXmP0XF3EH5OUa/CARPHC2x72mx1OCba7q0811NoVF2IUNL5cOqnV1ZZ3XQemdek4mMSlKHBqZ2zyP1Nz5m36ehnWWZ7HAKeBag+A4guI7hEllwSNk/cPOcjvaKC7muJqMB7XdeW8nMTz4bIT+8k7XYHEuZkuUa2Y0i3mnQPAca7CHfD/drseKkbX2NXvm7BgEI5MwWTwFOjlzvr9tYaNPyXdp8i6K3VusLATh/MgwbHQ/vH8230Pc/Nf3enpcgxDcqqDkgbvgZCPAwg1kK8lYSzIJrHrxzKXTAlnI7n+jHqCqbMqnJlx3xEuvUAT2PwacTXP3Gj+QCsN3nmFnBpqHOJHucCdJ+UI+vltJt4upXp0KGi9iThiaLOqmpLP98z4xxPG6+hbidYf8JO2mA7P2RQvs9/6bEP/13F0Vk6qU7RAOTZLAbrZXJ70rpFRBBKF/czedf4vgvdQOvKowYsLW2zwrgGZehIQLABYC5PASRI9OEUlAekAAp7dORUdoaG/HUEHQ18J2dQ0XLacoo1az3Jf0dcASuwJfZQep/Dc9PtJq4ENy9B/CqLBGtCvUbLHRDpJPMX1FlOOCUnvmxPAeq0rB9rx2r73lmJuPq2biBoTNfxWrBnPf4d9C/TJzfDpf89a+aaEKBMpwxd0BTSdbD1tyBSjkucaAmOaBUk/3tf65oynEH51HfBIDyLNBJY+dQdjwLV/05bdoCOx4JYRwU1UYmve5tl7KAD1tIBOjWPigvaCBQ55AnUf5jR29mBdzpRRy/5pgNXL6JOl1r86cRVPFK+1gM/uSYEKGnnfMB1HkGHXPfbOIoDeASQQEw6RC4JGN9l2k44HUHWYMeEDhNcpj2YcAhc4TDyUmvel7ydunUKNr5AJqtky4TT3wf8PkLtFCD8bLRo1NRNkcS2eE9AEbih/6s4YwXw2qwTRXGh2UJo7dQ+cUAJAFRGrgY8V3A/US6ZgkYaJftYUuCFDtGJN/HxJO5kCOYpawnnS0Er0NyQJrAPQAs/nudyXsE4bJATbyjtjAVyajpax1v35Cyr6tBBvKdOtiXxnG8CwADouqBWJCBNmwVj7K/XVffcOexIvAageWqaTsVO25NT7iUHa60+SNiUuMqNBwO+/fm/l1M092QVg7t2xWRKI1+XP+WS5tlx1lHGpPPnI9RrAbgsNa9U177PMRx46aAbVlIWaFXVCNN7FtgxILcfCG3r9+MalHDJSW5ZgDgnQlTBlXADwLbeKZrwBwiyLgAzKzcBHM8SUp5MprUMKAWnXNPRrfDvu+xar+8lss61igFuBstyoSM8g4i8dfEa8ct2ZUFRxPGylQwDN8TLDORuQa3rYtvy6XiXKacq88nVshQDjGsBy1sAQ+14M3G4JTKm9HCgujKkrfN9nqtBCmjtdnJQt0K4aqFWup4gcNWwBaZcV4db5UcVJbX5/eCoTlFhT5KeTscSTuVZS44aKXRSf+uoOOGZSCp+raoUcbr8s07csIJTas3Q0+n/0vJb5Y53UAo2uVnWjqFM+HHKwdSuNWJv4K6saacIynW8f4V4rwnQFGzuI/edR7N8RJ5ywXeRKdXoBZ1LMdvTvHWi2KTsSVy1cIGc3e7rAGjbATlSoHTlCHuiBn2N/+5tdwCGU0PcKOeA04arMqioojLXsbrOPoTHiBSsDNLWVR7bbWJNbe57v4dy782fGDLeQelUql0yWTtOiRlkKInsNP424S3Bw3/B4wrG+xD1bcKHBAnpFO6+IumVAJLgXpgNANOttypCiYbOM/MXjHMBeiJvpiHbkXLVKr/EgeEUTn4XBvQ3qLt+AonMLc347wA0KKEI2tNpk1tWPsk9vw0iqS+09JSR+7h/n3QeV6OiGOy44SAKZ6G3ylzwxjUoMbu44rISAmoLGwq9nE7pW5Ub4RKv8PwdiOfKhXKgx7Uk8qAnSyCXns5vN7W5KUsgf8DvtcR3/V2nCQEpyHyXbBXgvYb5Q8jfveFH2YFtiPzjypH5jZqLJdvnbU+nCrFl5dmUjjpdt64854QmjxMeYqEgq8BELxqMa1BKNc/8gRMsFyT8TdZsXcfmv57srvcqU7m0+B5B75wVgjOzvUB5a2HKTfU8Wsd/T1ZTENVorgYfNHJlznkED7paxHNPBLHc7OUU/zr5vDBqEBlfkeVEfZ02OQMVbjFOAfpWDpDxJRBzIoByKSC8H0JqI/QQgQSY/HdF5iAAq0liB8FVHI9pUSuXQyZaNr8Pde7i0rlY8E7iWbK1lJBskOK50/5elkHwKBenwaMIR4TecFpLO+w1fj8A6AX7mLoA2nZWpBRpkn3v3JM2hXumMQ7Urq9xD8q5c+fuhJA3QbjpgPMaiKh5yGlWUNl+BXtd0AStCorAc+16ksoPQXCpALgSdCT/p6Pc6LCgArCZu5w2rIsL9ORsI4KKTGutl3QeHfgSnPt2yri56x4b4YS01wHMrVzZ6fgyov7jHpTSAIH6PYB5Az+Va3Rh85wgtUHBtF4PIrXlFFBnADo/UzKPeMqGcjtPcXMpLrhsBUVFBSpx8SIk6+N0WKJIEb+1SqG8Sv7PUs6d/P4+HEdBf0xe1N/BnKxuZYGZ5ZqCtknjJgQoU2DqKfQ9CPYmHHMxBNUBYW+Asg7AGJIVF2VA3isTJm5oBM09+StZDycvNe+2d7n/ct0VlPFrOOTd/L4LQFZtumrSn4NIW4iZ0O703mhRZsKA0t5KlZcHMX+sgHieyHE8gJnHfT+AeCDhcLljFohygE6XsmJOuzbBVtKtkTtyfzTd0uC22PFwVW4KGzPTd3qgp5zHM8IT2186BTiFakt8j7COqbbv3teYP16Da2oYls255HcSgFQJanPdKhDgs6ASfGrh1j9ZzXEFhzTaORUJnics4b3n+biUVnnh+Hotkdy+oYyrSOAS5dvcNT9JI8vKc1pBoghhuaYxTti8paYfjP8+3wF9G21/pT6ay6yLK1lFl4sRXZ+OYYYD4ZQQ+wg6/s8g9AWUqWaqSUa7XuAqNkKTzHK3L0DI2wGOjrZ9u+RkdpJTtaAsEtzzMpOVIV1SV8JHvBeEdrpazHY1GWnKc+1zfhTqRabrKEAyvX+VdH9LUN6VNspsZLFbAITtCVlAOaCy06RlB0CGbbDWzUGuhWG9ihzleFeD1i6rpUFv/OUMHNtUeUGrN6mXNlZNXsmVo50HJrxYmVGHCH0HJVPlXnT8N2jM56mHysKwK9Ooxby8nL5dRLp/Aph2SF8uuSSX8mPbQU2ByHSUJqL3Um1cjdMVDpfHXDqTewlqO9x9OR7SNUTwMFXFAF3f1PCjBH7aqgx7PWnPzDXWOjqrGBpd+UFHXQW6K1oedf0KjOO3/H6Y308D0E6b1p4hzo/J7zri6xY4h3viXc8zj9y+kX4T8F1ffQclNbuScDUhAWSZjJYhmu5gf05Ujcu3dN2yioTaKSnHrzq0bIkBkFYT4i51Cua3y4qyLM87lxsJSB0pVokY0utccaBKEs9UlGxnAmJtnJH1d7uA6Xt+ZemdBSa/HTjup9Hmegp1/UwKtIcRtX5BukdcEctXyMNXGUT/wPMfkuZg2usnp7eQdhW/X8U1r80NrZsG9RWULEtNppKXZgleMGKHeTrTuEXaFJH73PPcSD7pQJSjMZy3ueyHujHFvemORTrmtzxby30ucY9xJUgPIESM13jm2rjat2eeu8Z9Av/d1mt7pKtgPU73uapDRFWWSNfqizSPpOrZ3910cEiTp3s+L97vjSnsPJ6fRX3O90Op9N/3ED+GGcIBpoOzclmy2/o2Ut2rCtW8QpwzquIVvYdIHlJ/WTdpI9PoYGBo+8SdICA4EHRbe5rf9/Fbfz9ti2FTme5srp3vAqQezq8C55p3q2h+e8CA8nPbdtSSusldCqfMokFcNtuU0HGYPTFtY9ms5VKpyt9fU/+vM6gUQwZ69RWUNOoSWuN21tKrbATzXAXkkn59Yo78BUvCnXJg0sSjsmKn6XLlxrCWCxe/g7at0qEB3s1irt7kL9fGh3hYpqVm4yfuc4PoeduVDZaZB7nv6btTCF8jfDX9LMwgqpeU0TdQInfMpUHKknZM7UvCAA4/ytQVp40osI07ZYFJuRrM/USeDhh+Es+6BCdeNVu3R7hdwu/ruGfao2OSK+RjR6sk8ShGxoqNV3iAQkRbO0YpYgwpME+mD7/Mb0WwgV19A6VcjsZc3KQl5HGC+TTJoyxtKhOWuY/NoVynX6d3FRydMLQD+lm7hEPyfiHhVEB5RsoR24oijY7CL0d+WClw3340tTDPMIVXFUgbXXK9Gvmy4wcTqvKp874vig5c0gOQrqMiicwWexWMWL+neCn53YRwvSI2n5h4dIqfpHsC4GkXTK6gVFCPGYDtMN7NZ+pya8MWlJtNPgdo7t05jvdaCeTiib0ur5CYP2FJTF2IE5xDIqO3plxtoJ6+oT0y7Mx0zV2RYYiQ7EsquvLPi+KFNtFeHXvvJ587oyvYIGJfQEkD3GP9mQb1aiUlr9MBhWalb/Uiv5CHB0thm7udenqgwJ/4PNMxLhPqtqbychS/5ZLKjfsTfwZ1kosKxvmEYQOP+NrrHEiPR9ZZIEVzolQ0WEIZvyCdWrCG7+AU4kqZoNTUo2XgFO5uA3YQJYcKZK9O2n2I66xAvKsZoHdDt76v3fcclFRcTvKXNNzPkDTaS5wSz+0El6Hw3MJUuC6yk6Oi2alwwIPpOA+rcuPULOqsR49HvKwmzPRDoHYm7w+lXSo+tk/3tHByRlJW2oHuDHwSburB+P8VVYk/RhJIySpOzGUdKeNeyvh2lcmMaZeqJeccnUG9tWi4//1TWXBW9VMqUy+mTJVW99b09eo5KJ1uacRnMx1V2YCg/WWVhGx6AHGOI5VnP6jMrEYERz2d9iPyduVIo7hHB24AjO/TjlnYWM/EPun5OpUrKuThRjJXRW4n/g/Ju84eHPshe85OYSsy4oUD56kqQJoJdkZlYDmppq37YBo/o21fY7B9BXq3TonrRLa0XBcGPjXmQKnTBdcVVNypo5eX/oxXwi3viumIOgXTadvI916AaN1dmz+CDtN4b6iUif+43J18gfYZgHI/oZsjWerKlMqQOmnUvhgsv6Wf3qLezg6utbedTtEhQ+2XOkj3/eqp9s1IUoa5qG6t5ZBlArl5pdOHJ0tcXzfvmPgAyu2wrmVPo/4nwR39dnclIM0bMLt7z6VIPXo8+k7zTt2r5TgbmdD4lS5kZXkBzD9Q529T9wcjywumqAXpgVixybqK12tQfg4AFZ78EKbo2FoWaIeus17LKM9vxIrNsjQeZU2DOy4keLjqMZ0GSD6TdMAcTd20V7q0GK2wZPISZHX6Ihyg1XXbAaYfhXo01jRkQbRNx5GhrguNTFiHEB2zBCwK05qBoqaDVIP0k8Vt+ZaBN+18P8l8VWTboqMBRE08bpNQZkqu2M4inasfLhRcxO/ruXdjaK7bD8avm2YYPWijuxPreGLZx4WeXtHEjojYuGGhDDrjWip8TlmZeW2PUfoSU4gnM/ySNG1mhjJOxXM1YJcee7Yeqxys+Yq829bZq0SK0E7StkQP0njU4FV+czKC9tkodftBu06UW1ynelBfRY3k+OiYi/gqfEMxcZvEqUuMwrKw92kmuYhKF+1nKUwDGH+dnqTwICM2aqtAyi3P5X5+k0Zn0wp0wmKeuSen8jzFinJdM7+AkPeL7FV1Qz5OL408yNOMWmdSxlSQfnJbbbTpKibPojg9AaWdACg/HdupqVLg6RJ+0k25xnNnSqeR7JROWQsIF/dK4CYvj2PR7JNceY4eQ9jsVE9618o9GbfuVQdkzix14hfWhXpriqqDAeNWmq7qNjwfv06FCsvSgwRAXsPLYd5AAUx5OREwulXgd6Rzqc9PeGhD042+EBRZoPgb7XgxaXtlnnBtO0oODoMuL2/mpnqdNTSu9/NS8+4FKGdCx7aT1ooqnaG/IkPjcqsI0xiUVPg0wuUVjWm9TjtUDvkYNsddHrPM73sJrq16GFLM5ZKZKzC9uJSrWo7EOa5c6NaVlzdzg06n2Nh2hPrXlQ+LNpB1Q4shEkUPSOLKoZPDwvp5NQYlI+1yOunUskraYVlO5xIe4c70uzFJMj9ZodGZn49m88mmyz1XCzybKbyxfEP9fk94ipA9ma2tOXXMWcTVVul6dJ2rroxoXRuvQdN3bteogwHL7bvfZ50KDSMyWuZBqbE8aqQDPLeh3kOnDfOewZyisiMw37CgKiBA0HMIjRUKNzk5SCjyiTwXCAMqPzjC9B3qmHnvgamuST9ZB5EpwOqArGvDeahX6u+qo0adS0D2/bS4RqAEFFc6fXdqVU5xWEZH3lb2wXQ68y7yivKsIV8N1pe6B6YOVYviUu5PAdP3U2tAchx0/soCMUzfubZtFpCEmxVLatZJkNVNU2faHVYd6u63c2o5UEMD3fG6Wt6sQ4+uQYkZyO2kOkkUbQUo6lSX8n6mKaisghDJw0h973bNQmCEh7z3mOaLu9R02/LWeYLrB7Tpu3gN3QGwVhihqA4lXHMV7fpf0v0neT1VpwPSuOHwgNikii3uC+rqQjnVWvJFEi+skYE7PJdUbL+tkV151K5BSedcpyE7n3WZHEiDHpYjRezse4Y8E/eoqimcKCenmn9jYqQy7kPKl2TWdjB8AGjeXER7XgHMOnPcKqdFFHigy4rU5ZTuDVqYfrQqqkiAOFlxi4H3ZUSlZB9+WV8VZQhdnks9oKLKaxKpK9c1zUA0aDEF61/YAk9ZI2mQU6IdXnlygooHWS4jqDwNWxnJKk6U51F9V0Hou1GWKvOuIhSceosmEu52eun2VjpHJ4xnDETzcIKXqZe/u73q2h0PoyAdXzb5eT/u2niT8zQJrr278qJZSm46DzqpGHrwwjG072R+m77WRft+yqCLPo23Vua5yF2BksYlnyoOeVWNODrRjf1PxshaxPVYvmXk7zp3x2OMLZe6nEn8z1GXxqC0E9OPNR1l28w/bz0IbXZ5UQAQX2+iNakLW5O+qEwb6Mx9EmLCl0igoicgXUkTjMEvM9w1dDuwo5c9i9qrSMVscGNlBXsUoTYoUy55PXSJMl7TII8GeZH7sCmxqA1udHezP/m/mgdlSZt1VL1C51U6qtGRzQDNkyqSvdplYAxg5X4CA0KveM8vl0spW7tfpptLzaquwiYQS01x3VQi07bs7OfRNd+kX97sNs+66WrLlMqRBP0ao4hIh2lG0Nh7CFNNMt13utJ93tYr2lEAcHj8ih5KjS7FATKoXAOXYznNEwSwp7Ud7RTZoPCeOFh0U36Z3G4bCR7a9W1mg1u7ybvbNLU4JYKyB4teRmU9bjnqIq7n7LgNVTnnAqYBv7Ei1/QQJA+Ikkv4rRunGGVVt7d6lHMyhcZcxNUScDmA/gkigjJWt1dyGKqJM1NlVV7Wey71b7ImnD9BrarMnr2vEL1+CCj/sWeFRWZUC5Q0QK7QkiU7TXGhfOK73dZlSGXExPRBOsHo2Y5utHLqC1zXJTo377spSy4UfZHX6QT3BnUNSuri9LsuC8p8BUpkLo/Xa7LS4cygkjIqLtqinPoD7n/PtD3sLKF+V7IWKNV0CafXrVQ6GlvHl2RHZ9lIDdNKxUhuVUVuyTSubHkXsuXrdetofGQnv9ig9n8u5bd9jD2bX3bKc6CRzj06TVY6euK0202bC9L49Yp/hUN+Kz3IqkfZxmcTLVNidvEcR0+aTcAVwyXLqpGXY8r+xwIycDbqd5qrTPHNb49JJ6xDyVpC0FpQmE0qa7WmdzpQw7lbC5qsdNR1Ieu2iaXpFKlow62IV19BhrxhpABpBaM5JZ2hLNnaLlCHKkVcLw/q/P86gAx1AZCHQNjzkS1vRLaMOcNnWDMAox5MnpzhuvA+VVo45XkS7qtlS6eRdBoJTqnyqVz/CvVfQrvvwCVwWWR9+xotCpRwSb9Bo6tYy7M8D5pO020+bt3/+akzpM9No0k0gOlGe0WMqDX0AuquxhC/zgMKyL/y45hwFs8Ar+uqli+248axMDCyA0QDPm1dR0bKf0Em9R5WhwRdOAfdu6d+GFf5V1HDr549zazwGwbUwOXGTqiOAiUZaA+LWrzPT8XdcLwYEBqnCJw8djeiB2t1BUo6ejdBuiTKVxHws/VjqtuXOE3MQUlTQnmdOiv7Ds72S/4/QNnKwCpZupUJSO8e4aIyuRnwOmM4wATmDqblvvtDxrahLF4UKF1fpqMXFWVSVyFpUuEYgFNXN4ItRuH5HxSeVXXL01pAcHWkTagsKtu2w1Hn0/HHeKhXgw6vNX3L8SjT7/KojNTZjViXHCMSv1LRgb2fpNZN7Qrj5jljr1sRA8R8HOp7Is+GOYvE1I32JF9SIK6fFC48D9I2Z9rtOvm+hCYmnbp2Sr/R88x4BKR9VMkp6eDP0jmt4/LyHRs6LjxPO8yF+xWE93jvVBKmk2CT1PVKLV6OZNB5wG2zGqLtIKceZbXVpPf0CQ3sB6b1qDy5gnhuxXVzmb6b0StDtoGO9qPsy5mWV/LX2WHYYMwOAkEMQDYQ6vpDDiNl0aApGfS2qdEXGGIG6EjF6QhKpiTXdi+0r8oqmO0g+gVRZ+cS7h5R9zTv7FiVAGWe7GanIJjLXXRWDR4trvoITOWedQS/EOuXFlzf9mwfj27RD7Cjl0s6UC4WmMS9ty5xaYPftX6S8g7h9wJ+z84PvpAnis47tPfttM51i8rGL1y2tdwCOd2Vr75v4GrSmCZpO4LSNW4a33ZqRNl0KuHonF8RvkW4k4Oj6pw6VunIoIsWZa+lTguyoMxqpFlCEG8+764i3cN1tUvSvZaeoObXbHX38rvdreNc0rbaXp1NNJz7wfomIKmr6DiQK0+CawKMkUxbKlPCJV2z/gKVa/sWTJkMqfBNUBu8uyYgo9qfdrr7eF4rS5DXlFV4iNvN4a1y/HfhgppNXOXRY2kF92SKdqbm3ceYysKBVpWyeUUjO6YPjCDTPplJv7fxRvVLPyKVEgNCfD7t1Fa5RVNYRvt2l2Jf3eUBymbA4FmLCRfOc8kChceD5K+DW9Y6mpB8/UraAciX+xH8AJLr9OsocjV18MDS1cicW+bMmbM37/zw/BGU0WTPjCBrKUr5dmRonPRF+r+JYtUPLPUsz0JQYk7xhDNdwSrP7AkEBJBLib+sZzUryCg9iFS7WwLKMlEim5R2eHJtrSMEWdk40UOvyOcAlJ6dzBofpEZyZWP3D6mdK/cKWI+a9nz0JpxLZa+Jl1E/yT7wvIfJlADS7QB/Q0dGnzMJIN+BezzhOeL9bgFcIvlSLMCI8qamHYdRPw/F+hUiQLL3p9MF+FQiFlDGvrRpK0GxRC6oGKPcqEF6rRYBp3E45vv8dN1boHZ7JW57NRJbjzoye42sRz5qkaLzp3SkRw9Hn7NI5ywjPDqI5gAAHSDeZuBE7eaTm9IeD/N36bESlIAMUXGbDhaCz4O7ZpGHRysH0LjfaCnv3J+ugvYB/7UZNlkpaa0gRdJQ2bbvDCCyLj2P1gZKzv8+XeWGkPgylmm22VrIJeggv6H4Ss9rV5Ah5Xmu+OMAxX3fUdySuAcRjqF9U1DCKjfys/a9lLjPKFsSwkYraeV5mvpr/pyyn2Jm+LhHbZbr1QG1dt9xt5ITaNmSKZne9Ph22+zZNQi9g+ntLjpqYO7yAMHVjFspM5oza2d0GidEy22CF0VmHbRYQRB8gkZnBrnt0z0EpOTWlru2Bt01nDfx36xR1OCjtjglHXccU+LZdFyyR8WrQpFQ4XgYUH6HDhro6gLAeAhgOqXOo45Oy1UmFbfOuujSjS3xA8r4iJA4OlD2m8wKTbzMi3rZRQZNXQsjIOC07REz4x+UNHKqHQfxXd7bO526wylbThe6N9kZBkGo/e5+AFl64kUEgbuK4lZdNOJbUoXnPDJxP4+eOkMEZU1XoBxw6iN+SGYl4VnkvtpyGEDeTlpXlbhNkj79mDZ1HJHzO8CKPI4cTNLdvU2PEL7T0FjfFd0HlSgrUz6H+eMnEP1FpzsqoEOCn4BzRLqWrVDvFBOmsi10cleOtL1oXOqMcDNKyR3kp+nKoFlGBwm5vbZJ/ytDLgdUnlNU+3K2ILjMqXypJh61i7NOQR6Fgvj0I+gv+DzAVfoHEEp/wWiQo67MnlhXp5yxErcFSjgedNn8Pc0fsgQakHBJnncz5Q2s/SglDhKDJ1X045oETWZo/pEuziD9uFQUof+/kPcQQcXHmWnTeOaIZXRs075TAtSe4vrRSaMlT6dsgKhA6qqOYkzfVlLSLRwjNvuMFpo3XbMdLe3oWz0A4hCgnAMo/YCoR0fXWrLsW8XGccb/D6sltND4S1IHAAAAAElFTkSuQmCC"
                      style={{ width: "70px" }}
                    />
                  </div>
                  <form>
                    <div className="mb-3">
                      <label className="form-label text-white">
                        Patient Type <span className="text-white">*</span>
                      </label>
                      <select
                        className="form-select"
                        onChange={(event) => {
                          setPatientType(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        <option>Existing</option>
                        <option>New</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white">
                        Specialty <span className="text-white">*</span>
                      </label>
                      <select
                        disabled={!patientType}
                        className="form-select"
                        onChange={(event) => {
                          setSpecialty(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        {specialtyList.map((el, i) => (
                          <option value={el} key={i}>
                            {el}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-white">
                        Reason for visit <span className="text-white">*</span>
                      </label>
                      <select
                        disabled={!specialty}
                        className="form-select"
                        onChange={(event) => {
                          setReason(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        {reasonList.map((el) => (
                          <option value={el.reasonid} key={el.reasonid}>
                            {el.reason}
                          </option>
                        ))}
                      </select>
                      <label className="form-label text-white mt-2">
                        What reason should I choose?
                      </label>
                    </div>
                    <div className="row mb-1">
                      <div className="col-sm-12">
                        <Calendar
                          onChange={onChange}
                          value={value}
                          minDate={new Date()}
                        />
                      </div>
                    </div>

                    <div className="row mb-1 mt-2">
                      <div className="col-md-6 col-6">
                        <h4 className="text-info ">Filters</h4>
                      </div>
                      <div className="col-md-6 col-6 text-end">
                        <span className="text-medium text-white">
                          Clear Filters
                        </span>
                      </div>
                    </div>
                    <hr className="mt-0 mb-0" />
                    <div className="mb-3">
                      <label className="form-label text-white">Provider</label>
                      <select
                        className="form-select"
                        disabled={!specialty}
                        onChange={(event) => {
                          setProvider(event.target.value);
                        }}
                      >
                        <option value="" hidden>
                          -Select-
                        </option>
                        {selectedProviderList.map((el) => (
                          <option value={el.providerid} key={el.providerid}>
                            {el.displayname || el.firstname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white">Location</label>
                      <select
                        className="form-select"
                        onChange={(event) => {
                          setLoction(event.target.value);
                        }}
                      >
                        <option>OOLTEWAH CLINIC</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </main>
    </>
  );
};

export default Appointment;
