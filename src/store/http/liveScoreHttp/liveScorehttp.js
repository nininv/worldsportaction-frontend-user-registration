import axios from "axios";

const http = axios.create({
    // baseURL: "http://13.237.1.133:8085"
    // baseURL: "https://world-sport-action-socket.appspot.com"
    // baseURL: "http://192.168.3.98:3001"
    // baseURL: "http://127.0.0.1:5000"
    baseURL: "https://livescores-api-dev.worldsportaction.com/"
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
