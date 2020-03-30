import axios from "axios";

const http = axios.create({
    // baseURL: "http://192.168.3.74/WotAfrica/api/",
    // baseURL: "http://192.168.3.74/react_app/code"
    // baseURL: "http://1.6.98.141/mobile/well4life/api/v1"
    // baseURL: "http://1.6.98.142:3000/user"
    // baseURL: "https://us-central1-videostream-5d663.cloudfunctions.net/app"
    // baseURL: "https://world-sport-action-socket.appspot.com"
    // baseURL: "http://13.237.1.133:8085"
    // baseURL: "http://192.168.3.252:3000",
    // baseURL: "http://192.168.3.98:3000"
    // baseURL: "http://192.168.3.98:3009"
    // baseURL: "https://common-api-dev.worldsportaction.com"
    // baseURL: "https://world-sport-action-socket.appspot.com"
    baseURL: "https://netball-api-stg.worldsportaction.com/common"

});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
