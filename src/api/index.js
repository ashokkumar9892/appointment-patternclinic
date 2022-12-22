import axios from 'axios'
import schedule from 'node-schedule'
import React,{useState} from 'react';
var fromDate=new Date();
var toDate=new Date();
const BASE_URL = process.env.REACT_APP_BASE_URL?process.env.REACT_APP_BASE_URL:'http://localhost:3001';
fromDate.setDate(toDate.getDate() + 3)
toDate.setDate(toDate.getDate() + 3);
function getToken() {
    return new Promise((resolve, reject) => {
        const token = getLocalToken();
        if (token) {
            return resolve(token)
        }
        axios.request({
            url: "/oauth2/v1/token",
            method: "post",
            baseURL: "https://appointmentapi.apatternclinic.com/",
            auth: {
                username: process.env.REACT_APP_USER_NAME,
                password: process.env.REACT_APP_PASSWORD
            },
            data: "grant_type=client_credentials&scope=athena/service/Athenanet.MDP.*"
        }).then(res => {
            localStorage.setItem('token', res?.data?.access_token);
            localStorage.setItem('expire', String((Number(res?.data?.expires_in) * 1000) + Date.now()));
            resolve(res?.data?.access_token)
        }).catch(() => reject(''))
    })
}
const dateFormate = (date) => {
    let datt = new Date(date);
    return (((datt.getMonth() > 8) ? (datt.getMonth() + 1) : ('0' + (datt.getMonth() + 1))) + '/' + ((datt.getDate() > 9) ? datt.getDate() : ('0' + datt.getDate())) + '/' + datt.getFullYear());
  }
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1)
schedule.scheduleJob('0 0 * * *', () => { 
    try {
        let req = {
            url : `https://appointmentapi.apatternclinic.com/v1/24451/appointments/booked?practiceid=24451&startdate=${dateFormate(fromDate)}&showinsurance=true&enddate=${dateFormate(toDate)}&departmentid=1&showpatientdetail=true`,
          };
          api.getAuth(req).then((response) => {
        let data = []

        response.data.appointments && response.data.appointments.length > 0 &&
          response.data.appointments.map((item, index) => {
            let dateTime = item.date + " " + item.starttime
            let request = {
                url: `https://appointmentapi.apatternclinic.com/sms`,
                params: {
                  name: `${item.patient?.firstname} ${item.patient?.lastname}`,
                  to: `+1${item.patient?.homephone?item.patient?.homephone:item.patient?.mobilephone}`,
                  time: item.starttime,
                  location: '',
                },
              };
              api.get(request);
          
      })
    // console.log(response.data.appointments[0],response.data.appointments[0],response.data.appointments[0],response.data.appointments[0].patient.homephone,'sortedAsc')
        if (data.length > 0) {
          const sortedAsc = data.sort(
            (objA, objB) => Number(new Date(objA.date)) - Number(new Date(objB.date)),
          );
          console.log(response.data.appointments[0].patient.homephone,'sortedAsc')
        }
        else {
        //   setBookApptData(data)
        }
      
      })
        
      } catch (error) {
  
      } finally {
        
      }
    
   
 })

const saveProviderAndReasonToJSON = async()=>{
    const savedProviders = await axios.request({url:`${BASE_URL}/saveproviders`});
    if(savedProviders['status']===200){
        let reasonresponse=[];
        let reasonPromise = [];
        console.log(savedProviders['data']['provider_ids']);
			for (const el of savedProviders['data']['provider_ids']) {
				reasonPromise.push(
					new Promise((resolve, reject) => {
						let request = {
							url: `https://appointmentapi.apatternclinic.com/v1/24451/patientappointmentreasons?departmentid=1&providerid=${el.providerid}`,
						};
						api
							.getAuth(request)
							.then((data) => {
								for (const element of data.data.patientappointmentreasons){
									element.providerid = el.providerid;
									reasonresponse.push(element);
								}
								resolve(data.data.patientappointmentreasons);
							})
							.catch(reject);
					})
				);
			}
			Promise.all(reasonPromise).then((res) => {
				console.log('reason 144');
				console.log(res);
				axios.request({
					method: 'post',
					url: `${BASE_URL}/saveappointmentreasons`,
					contentType: "application/json",
					data: {
						'patientappointmentreasons':JSON.stringify({patientappointmentreasons:reasonresponse})
					}
				  }).then(data=>{
					console.log(data);
				}).catch(err=>{
					console.log(err);
				})
			});
    }

}

const api = {
    get: async(request) => axios.get(
        request.url,
        {
            headers: { "accept": "application/json" },
            params: request?.params || {}
        }
    ),
    getAuth: async(request) => axios.get(
        request.url,
        
        {
            headers: { "Authorization": "Bearer " + await getToken(), "accept": "application/json" }
        }
    ),
    checkInsurances: async(request) => axios.get(
        request.url,
        {
            headers: { "Authorization": "Bearer " + await getToken(), "accept": "application/json" }
        }
    ),
    getAuth1: async(request) => axios.get(
        request.url,
        request.data,
        {
            headers: { "Authorization": "Bearer " + await getToken(), 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        }

    ),
    postAuth: async(request) => axios.post(
        request.url,
        request.data,
        {
            headers: { "Authorization": "Bearer " + await getToken(), 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', "Accept": "*/*", "Accept-Encoding": "gzip, deflate, br" }
        }

    ),
    putAuth: async(request) => axios.put(
        request.url,
        request.data,
        {
            headers: { Authorization: "Bearer " + await getToken(),'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', "Accept": "*/*", "Accept-Encoding": "gzip, deflate, br" }
        }
    ),
    updatePatientInsurance: async(request) => axios.put(
        request.url,
        request.data,
        {
            headers: { Authorization: "Bearer " + await getToken() }
        }
    ),
    postInsuranceImage:async(request) => axios.post(
        request.url,
        request.data,
        {
            headers: { Authorization: "Bearer " + await getToken(),   'Content-Type': 'text/html;charset=UTF-8'   }
        }
    ),
    postpayment: async(request) => axios.post(
        request.url,
        request.data, 
        {
             headers: { "Authorization": "Bearer " + await getToken(), 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', "Accept": "*/*", "Accept-Encoding": "gzip, deflate, br" }
        }
    ),
    getBalance: async(request) => axios.get(
        request.url, {
            headers: { "Authorization": "Bearer " + await getToken(), "accept": "application/json" }
        }
    ),
    saveProviderAndReasonToJSON : saveProviderAndReasonToJSON

}
// const isTokenExpired =  (token) => (Date.now() >= JSON.parse(window.Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000)
const getLocalToken = () => {
    const token = localStorage.getItem('token');
    const expire = localStorage.getItem('expire');
    if (token && Number(expire) > Date.now()) {
        return token;
    }
    return null;
}
export default api