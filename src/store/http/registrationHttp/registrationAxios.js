// import { DataManager } from './../../Components';
import http from "./registrationhttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";

async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();

// let organisationUniqueKey = "sd-gdf45df-09486-sdg5sfd-546sdf"
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
  
    getRegFormSetting() {
        var url = "/common/reference/RegistrationSettings";
        return Method.dataGet(url, token);
    },
    getRegFormMethod() {
        var url = "/common/reference/RegistrationMethod";
        return Method.dataGet(url, token);
    },
    getMembershipProductList(CompetitionId) {
        var url = `/api/details/membershipproduct/${CompetitionId}`;
        return Method.dataGet(url, token);
    },
    
    /////get the membership product discount Types
    membershipProductDiscountTypes() {
        var url = `/api/membershipproductdiscounttype/default`;
        return Method.dataGet(url, token);
    },
    /////types of competition in competition fees section from reference table
    getTypesOfCompetition() {
        var url = `/common/reference/CompetitionType`;
        return Method.dataGet(url, token);
    },

    ////////competition format types in the competition fees section from the reference table
    getCompetitionFormatTypes() {
        var url = `/common/reference/CompetitionFormat`;
        return Method.dataGet(url, token);
    },

    getRegistrationInvitees() {
        var url = "/common/reference/RegistrationInvitees";
        return Method.dataGet(url, token)
    },

    getGovtVouchers() {
        var url = '/common/reference/GovernmentVoucher';
        return Method.dataGet(url, token)
    },

   async saveEndUserRegistration(payload) {
        let userId = await getUserId();
        var url = `/api/registration/save?userId=${userId == undefined ? 0 : userId}`;
        return Method.dataPost(url, token, payload);
    },
    getOrgRegistrationRegistrationSettings(payload) {
        var url = `/api/registration/registrationsettings`;
        return Method.dataPost(url, token, payload);
    },
    getEndUserRegMembershipProducts(payload) {
        var url = `/api/registration/membershipproducts`;
        return Method.dataPost(url, token, payload);
    },
    getEndUserRegUserInfo(payload) {
        var url = `/api/registration/userinfo`;
        return Method.dataPost(url, token, payload);
    },
    getInvitedTeamRegInfo(payload) {
        var url = `/api/teamregistration/invite?userRegUniqueKey=${payload.userRegId}&userId=${payload.userId}`;
        return Method.dataGet(url, token);
    },
    updateTeamRegistrationInvite(payload) {
        var url = `/api/teamregistration/invite/update`;
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
                                    message.error(ValidationConstants.messageStatus401)
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
                                    message.error(ValidationConstants.messageStatus401)
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
                                    message.error(ValidationConstants.messageStatus401)
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
