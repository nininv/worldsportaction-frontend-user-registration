// import { DataManager } from './../../Components';
import competitionHttp from "./competitionHttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
let userId = getUserId()
let CompetitionAxiosApi = {
    // get year
    competitionYear() {
        var url = "/common/reference/year";
        return Method.dataGet(url, token);
    },

    /////get the common Competition type list reference
    getCompetitionTypeList(year) {
        var url = `/api/orgregistration/competitionyear/${year}`;
        return Method.dataGet(url, token);
    },

    //get time slot
    async  getTimeSlotData(yearRefId, competitionId, organisationId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            // organisationId: organisationUniqueKey
            organisationId: 'sd-gdf45df-09486-sdg5sfd-546sdf'
        };
        var url = `/api/competitiontimeslot?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    /////competition part player grade calculate player grading summmary get API
    async getCompPartPlayerGradingSummary(yearRefId, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `/api/playergrading/summary?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////competition own proposed team grading get api
    async getCompOwnProposedTeamGrading(yearRefId, competitionId, divisionId, gradeRefId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            divisionId: divisionId,
            organisationId: organisationUniqueKey,
            gradeRefId: gradeRefId
        };
        var url = `/api/teamgrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////save the own competition final grading api
    saveOwnFinalTeamGradingData(payload) {
        var url = `/api/teamgrading/save?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    //////competition part proposed team grading get api
    async  getCompPartProposedTeamGrading(yearRefId, competitionId, divisionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            divisionId: divisionId,
            organisationId: organisationUniqueKey,
        };
        var url = `api/proposedteamgrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //////competition save own final team grading table data
    savePartProposedTeamGradingData(payload) {
        var url = `/api/proposedteamgrading/save?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    //post TIme Slot
    postTimeSlotData(payload) {
        var url = `/api/competitiontimeslot/save?userId=${userId}`
        return Method.dataPost(url, token, payload)
    },

    ///////////save the competition part player grade calculate player grading summmary or say proposed player grading toggle
    saveCompPartPlayerGradingSummary(payload) {
        var url = `api/playergrading/summary/save?userId=${userId}`
        return Method.dataPost(url, token, payload)
    },

    ///////get the own team grading summary listing data
    async getTeamGradingSummary(yearRefId, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `api/teamgrading/summary?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //////competition part player grading get API 
    async getCompPartPlayerGrading(yearRefId, competitionId, divisionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            divisionId: divisionId,
            organisationId: organisationUniqueKey,
        };
        var url = `api/playergrading?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////competition draws get 
    async getCompetitionDraws(yearRefId, competitionId, venueId, roundId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            venueId: venueId,
            roundId: roundId
        };
        var url = `/api/draws?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////////competition draws rounds 
    async  getDrawsRounds(yearRefId, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `/api/rounds?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ////own competition venue constraint list in the venue and times
    async   venueConstraintList(yearRefId, competitionId, organisationId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey
        };
        var url = `/api/venueconstraints?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    //////save the venueConstraints in the venue and times
    venueConstraintPost(data) {
        let body = data
        var url = `/api/venueconstraint/save?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ///////save the changed grade name in own competition team grading summary data
    saveUpdatedGradeTeamSummary(payload) {
        var url = `/api/teamgrading/summary/grade?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    ////////team grading summmary publish
    async publishGradeTeamSummary(yearRefId, competitionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let payload = {
            competitionUniqueKey: competitionId,
            organisationId: organisationUniqueKey,
            yearRefId: yearRefId
        }
        var url = `/api/teamgrading/summary/publish?userId=${userId}`;
        return Method.dataPost(url, token, payload);
    },

    ///////competition dashboard get api call
    async competitionDashboard(yearId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            "yearRefId": yearId,
            "organisationId": organisationUniqueKey
        }
        var url = `/api/competitionmanagement/dashboard?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    ///// update Draws
    updateDraws(data) {
        let body = data
        var url = `/api/draws/update?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    /// Save Draws 
    saveDrawsApi(yearId, competitionId, drawsId) {
        let body = {
            "competitionUniqueKey": competitionId,
            "yearRefId": 1,
            "drawsMasterId": 0,
        }
        var url = `/api/draws/save?userId=${userId}`
        return Method.dataPut(url, token, body);
    },

    ////////////get the competition final grades on the basis of competition and division
    async  getCompFinalGradesList(yearRefId, competitionId, divisionId) {
        let orgItem = await getOrganisationData()
        let organisationUniqueKey = orgItem ? orgItem.organisationUniqueKey : 1;
        let body = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            divisionId: divisionId,
            organisationId: organisationUniqueKey,
        };
        var url = `/api/competitiongrades?userId=${userId}`
        return Method.dataPost(url, token, body);
    },

    updateCourtTimingsDrawsAction(body) {
        var url = `/api/draws/update/courttiming?userId=${userId}`
        return Method.dataPut(url, token, body);
    },


};

const Method = {
    async dataPost(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
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
                    console.log(err.response)
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    //message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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



    // Method to GET response

    async dataGet(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
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
                    console.log(err.response)
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    //message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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

    async dataDelete(newurl, authorization) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
                .delete(url, {
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
                    console.log(err.response)
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    //message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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

    //Put Method
    async dataPut(newurl, authorization, body) {
        const url = newurl;
        return await new Promise((resolve, reject) => {
            competitionHttp
                .put(url, body, {
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
                    console.log(err.response)
                    if (err.response) {
                        if (err.response.status !== null && err.response.status !== undefined) {
                            if (err.response.status == 401) {
                                let unauthorizedStatus = err.response.status
                                if (unauthorizedStatus == 401) {
                                    logout()
                                    //message.error(ValidationConstants.messageStatus401)
                                }
                            }
                            else {
                                return reject({
                                    status: 5,
                                    error: err
                                })

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

export default CompetitionAxiosApi;
