import axios from "axios";

const http = axios.create({
    // baseURL: process.env.REACT_APP_SHOP_API_URL
    baseURL: '192.168.88.216:8083'
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    console.log('CONFIG', config);
    return config;
});

export default http;
