import http from "./liveScorehttp";
import { getUserId, getAuthToken } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
// let userId = getUserId();

let LiveScoreAxiosApi = {
    liveScoreGetDivision(data, compKey) {
        let url = null
        if (compKey) {
            url = `/division?competitionKey=${compKey}`
        } else {
            url = `/division?competitionId=${data}`
        }
        return Method.dataGet(url, null)
    },

    liveScoreLadderList(divisionId, competitionID, compKey) {
        let url = null;
        if (compKey) {
            url = `/teams/ladder?divisionIds=${divisionId}&competitionKey=${compKey}`;
        } else {
            url = `/teams/ladder?divisionIds=${divisionId}&competitionIds=${competitionID}`;
        }
        return Method.dataGet(url, localStorage.token)
        // return Method.dataPost(url, localStorage.token, postBody)
    },

    liveScoreRound(competitionID, division, teamId) {
        let url = null
        if (teamId === "All") {
            url = `/round?competitionId=${competitionID}&divisionId=${division}`;
        } else {
            let team = JSON.stringify(teamId)
            url = `/round?competitionId=${competitionID}&divisionId=${division}&teamIds=${team}`;
        }
        return Method.dataGet(url, localStorage.token)
    },

    //Get Fixture Competition List
    getFixtureCompList(orgId, yearId) {
        let url = `/competitions/list?organisationUniqueKey=${orgId}&yearRefId=${yearId}`
        return Method.dataGet(url, localStorage.token);
    },

    getUmpireActivityList(payload, roleId, userId, sortBy, sortOrder) {
        let url = `roster/umpireActivity?roleIds=${roleId}&userId=${userId}`;
        if (sortBy && sortOrder) {
            url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        }
        return Method.dataPost(url, token, payload);
    },

    liveScoreTeam(competitionID, divisionId) {
        let url;
        if (divisionId) {
            url = `/teams/list?competitionId=${competitionID}&divisionId=${divisionId}&includeBye=0`;
        } else {
            url = `/teams/list?competitionId=${competitionID}`;
        }
        return Method.dataGet(url, localStorage.token)
    },

    getUmpireAvailabilityList(userId, fromTime, endTime) {
        const url = `/booking/?userId=${userId}&fromTime=${fromTime}&endTime=${endTime}`;
        return Method.dataGet(url, token);
    },

    saveUmpireAvailabilityList(payload, userId, fromTime, endTime) {
        let url = `/booking/save?userId=${userId}&fromTime=${fromTime}&endTime=${endTime}`;
        return Method.dataPost(url, token, payload);
    },

    createRefereeReport(data) {
        let url = `/incident/refereeReport`;
        return Method.dataPost(url, token, data);
    },
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
                        Authorization: "BWSA " + authorization
                    }
                })
                .then(result => {
                    if (result.status === 200) {
                        return resolve({
                            status: 1,
                            result: result
                        });
                    } else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                            } else if (err.response.status == 400) {

                                message.config({
                                    duration: 1.5,
                                    maxCount: 1,
                                });
                                message.error(err.response.data.message)
                                return reject({
                                    status: 5,
                                    error: err.response.data.message
                                });
                            } else {
                                return reject({
                                    status: 5,
                                    error: err.response && err.response.data.message
                                });
                            }
                        }
                    } else {
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
                    } else if (result.status == 212) {
                        return resolve({
                            status: 4,
                            result: result
                        });
                    } else {
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
                    } else {
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
