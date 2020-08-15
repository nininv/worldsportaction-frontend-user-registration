
import http from "./commonhttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let userId = getUserId();
let token = getAuthToken();

let AxiosApi = {
    // /login Api call
    Login(payload) {
        var base64 = require("base-64");
        var md5 = require("md5");
        let authorization = base64.encode(
            payload.userName + ":" + md5(payload.password)
        );
        var url = "/users/loginWithEmailPassword";
        return Method.dataGet(url, authorization);
    },

    //role Api
    role() {
        var url = "/ref/roles";
        return Method.dataGet(url, token);
    },

    // User Role Entity Api
    ure() {
        var url = "/ure";
        return Method.dataGet(url, token);
    },

    /////get the common year list reference
    getYearList() {
        var url = `/common/reference/year`;
        return Method.dataGet(url, token);
    },

    /////get the common membership product validity type list reference
    getProductValidityList() {
        var url = `/common/reference/MembershipProductValidity`;
        return Method.dataGet(url, token);
    },

    /////get the common Competition type list reference
    getCompetitionTypeList(year) {
        var url = `/api/orgregistration/competitionyear/${year}`;
        return Method.dataGet(url, token);
    },

    getVenue() {
        var url = `/api/venue/all`;
        return Method.dataGet(url, token);
    },
    getRegFormSetting() {
        var url = "/common/reference/RegistrationSettings";
        return Method.dataGet(url, token);
    },
    getRegFormMethod() {
        var url = "/common/reference/RegistrationMethod";
        return Method.dataGet(url, token);
    },
    getMatchTypes() {
        var url = "/common/reference/MatchType";
        return Method.dataGet(url, token);
    },
    getCompetitionFormatTypes() {
        var url = `/common/reference/CompetitionFormat`;
        return Method.dataGet(url, token);
    },
    getTypesOfCompetition() {
        var url = `/common/reference/CompetitionType`;
        return Method.dataGet(url, token);
    },
    getCommonTimeSlotInit(payload) {
        let body = {
            ApplyToVenue: "ApplyToVenue",
            TimeslotRotation: "TimeslotRotation",
            TimeslotGeneration: "TimeslotGeneration",
            Day: "Day"
        }
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },
    getRegistrationInvitees() {
        var url = "/common/reference/RegistrationInvitees";
        return Method.dataGet(url, token)
    },
    getPaymentOption() {
        var url = "/common/reference/PaymentOption";
        return Method.dataGet(url, token)
    },

    ////get Common Api
    getCommonData() {
        let body = {
            State: "State",
            Day: "Day",
            CourtRotation: "CourtRotation",
            HomeTeamRotation: "HomeTeamRotation",
        }
        var url = "/common/references";
        return Method.dataPost(url, token, body);
    },

    ////Add Venue Api
    addVenue(venuData) {
        console.log(venuData, 'venuData_FetchApi')
        let body = {
            "competitionUniqueKey": venuData.competitionUniqueKey,
            "yearRefId": venuData.yearRefId,
            "competitionMembershipProductDivisionId": venuData.competitionMembershipProductDivisionId,
            "venueId": venuData.venueId,
            "name": venuData.name,
            "street1": venuData.street1,
            "street2": venuData.street2,
            "suburb": venuData.suburb,
            "stateRefId": venuData.stateRefId,
            "postalCode": venuData.postalCode,
            "statusRefId": venuData.statusRefId,
            "contactNumber": venuData.contactNumber,
            "organisations": venuData.organisations,
            "gameDays": venuData.gameDays,
            "venueCourts": venuData.venueCourts

        }
        var url = `/api/venue/save?userId=${userId}`;
        return Method.dataPost(url, token, body);
    },

    ////own Competition venue list
    getVenueList(competitionID) {
        var url = ""
        if (competitionID) {
            url = `/api/venue/competitionmgmnt?competitionId=${competitionID}`;
        } else {
            url = `/api/venue/competitionmgmnt`;
        }

        return Method.dataGet(url, token);
    },

    /////////get the grades reference data 
    gradesReferenceList() {
        let url = `common/reference/grade`;
        return Method.dataGet(url, token);
    },
    getCommonReference(referenceName) {
        let url = `/common/reference/${referenceName}`;
        return Method.dataGet(url, token)
    },

    /// All Venues Listing 
    getVenuesList(payload) {
        let url = `/api/venue/list?userId=${userId}`;
        return Method.dataPost(url, token, payload);
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
            http
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
    }
};


export default AxiosApi;
