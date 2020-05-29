import axios from "axios";

const http = axios.create({
    baseURL: "https://registration-api-dev.worldsportaction.com"
    // baseURL: "http://ec2-54-79-5-68.ap-southeast-2.compute.amazonaws.com:8089"
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
