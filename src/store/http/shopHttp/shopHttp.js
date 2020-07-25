import axios from "axios";

const http = axios.create({
    baseURL: "https://shop-api-dev.worldsportaction.com"
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
