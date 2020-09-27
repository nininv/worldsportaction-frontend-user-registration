// import { DataManager } from './../../Components';
import http from "./liveScorehttp";
import { getUserId, getAuthToken, getLiveScoreCompetiton } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";
import { isArrayNotEmpty } from "../../../util/helpers";
import { post } from "jquery";


async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
// let userId = getUserId();


let LiveScoreAxiosApi = {

    liveScoreGetDivision(data, compKey) {

        var url = null
        if (compKey) {
            url = `/division?competitionKey=${compKey}`
        } else {
            url = `/division?competitionId=${data}`
        }


        return Method.dataGet(url, null)
    },


    liveScoreLadderList(divisionId, competitionID, compKey) {
        var url = null;
        if (compKey) {
            url = `/teams/ladder?divisionIds=${divisionId}&competitionKey=${compKey}`;
        } else {
            url = `/teams/ladder?divisionIds=${divisionId}&competitionIds=${competitionID}`;
        }

        return Method.dataGet(url, localStorage.token)
        // return Method.dataPost(url, localStorage.token, postBody)
    },


    liveScoreRound(competitionID, division) {
        var url = `/round?competitionId=${competitionID}&divisionId=${division}`;
        return Method.dataGet(url, localStorage.token)
    },

    //Get Fixture Competition List
    getFixtureCompList(orgId, yearId) {
        let url = `/competitions/list?organisationUniqueKey=${orgId}&yearRefId=${yearId}`
        return Method.dataGet(url, localStorage.token);
    }
};




const Method = {

    async dataPost(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .post(url, body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "BWSA " + authorization,
                        "SourceSystem": "WebAdmin"
                    }
                })

                .then(result => {

                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {

                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {

                    if (err.response) {

                        if (err.response.status !== null || err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    //message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else if (err.response.status == 400) {

                                message.config({
                                    duration: 1.5,
                                    maxCount: 1,
                                });
                                message.error(err.response.data.message)
                                return reject({
                                    status: 5,
                                    error: err.response.data.message
                                });
                            }
                            else {
                                return reject({

                                    status: 5,
                                    error: err.response && err.response.data.message
                                });
                            }
                        }
                    }
                    else {

                        return reject({
                            status: 5,
                            error: err.response && err.response.data.message
                        });

                    }
                });
        });
    },

    // Method to GET response

    async dataGet(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            http
                .get(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "BWSA " + authorization,
                        "Access-Control-Allow-Origin": "*"
                    }
                })

                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    }
                    else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    }
                    else {
                        if (result) {
                            return reject({
                                status: 3,
                                error: result.data.message,
                            });
                        } else {
                            return reject({
                                status: 4,
                                error: "Something went wrong."
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    // logout()
                                    message.error(ValidationConstants.messageStatus401)
                                }
                            }
                        }
                    }
                    else {
                        return reject({
                            status: 5,
                            error: err
                        });

                    }
                });
        });
    },

};
export default LiveScoreAxiosApi;
