import axios from "axios";

const competitionHttp = axios.create({

    // baseURL: "http://192.168.3.98:3005",
    baseURL: "http://a90830342b690491db1e89b76ed1d900-512956195.ap-southeast-2.elb.amazonaws.com/competition"
});

competitionHttp.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default competitionHttp;
