import axios from "axios";

const http = axios.create({
    // baseURL: "http://192.168.3.252:3000"
    // baseURL: "http://192.168.3.98:3000"
    // baseURL: "https://world-sport-action-socket.appspot.com"
    baseURL: "https://netball-api-stg.worldsportaction.com/users/"
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
