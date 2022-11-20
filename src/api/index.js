import axios from 'axios'

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
                username: "0oady1uewg1C26P1X297",
                password: "AzW1B_E3PuijHjhqMtte5FmV8yggwc209qDqKxj9"
            },
            data: "grant_type=client_credentials&scope=athena/service/Athenanet.MDP.*"
        }).then(res => {
            localStorage.setItem('token', res?.data?.access_token);
            localStorage.setItem('expire', String((Number(res?.data?.expires_in) * 1000) + Date.now()));
            resolve(res?.data?.access_token)
        }).catch(() => reject(''))
    })
}


const api = {

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
            headers: { Authorization: "Bearer " + await getToken() }
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
    )

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