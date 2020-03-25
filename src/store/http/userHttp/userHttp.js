import axios from "axios";

const http = axios.create({
    // baseURL: "http://192.168.3.252:3000"
    // baseURL: "http://192.168.3.98:3000"
    // baseURL: "https://world-sport-action-socket.appspot.com"
    baseURL: "http://a90830342b690491db1e89b76ed1d900-512956195.ap-southeast-2.elb.amazonaws.com/users/"
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
