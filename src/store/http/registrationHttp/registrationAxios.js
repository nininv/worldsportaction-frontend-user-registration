// import { DataManager } from './../../Components';
import http from "./registrationhttp";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"
import history from "../../../util/history";
import moment from 'moment';

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
        // var url = `/api/registrationdraft/save?userId=${userId == undefined ? 0 : userId}`;
        return Method.dataPost(url, token, payload);
    },
    getOrgRegistrationRegistrationSettings(payload) {
        var url = `/api/registration/registrationsettings`;
        return Method.dataPost(url, token, payload);
    },
    getEndUserRegMembershipProducts(payload) {
        payload["currentDate"] = moment(new Date()).format('YYYY-MM-DD');
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
    getTermsAndConditions(payload) {
        var url;
        if (payload.registrationId) {
            url = `/api/registration/termsandconditions?registrationId=${payload.registrationId}`;
        }
        else {
            url = `/api/registration/termsandconditions?userRegistrationId=${payload.userRegId}`;
        }
        return Method.dataGet(url, token);
    },
    getRegistrationProductFees(payload) {
        var url = `/api/registration/productfees`;
        return Method.dataPost(url, token, payload);
    },
    getRegistrationReview(payload) {
        var url = `/api/registration/review?registrationId=${payload.registrationId}`;
        return Method.dataGet(url, token);
    },
    saveRegistrationReview(payload) {
        var url = `/api/registration/review?registrationId=${payload.registrationId}`;
        return Method.dataPost(url, token, payload);
    },
    getRegistrationReviewProducts(payload) {
        var url = `/api/registration/review/products?registrationId=${payload.registrationId}`;
        return Method.dataGet(url, token);
    },
    saveRegistrationReviewProducts(payload) {
        var url = `/api/registration/review/products?registrationId=${payload.registrationId}`;
        return Method.dataPost(url, token, payload);
    },
    getRegistrationById(payload) {
        console.log("payload", payload);
        var url;
        if (payload.userRegId && payload.registrationId) {
            url = `/api/registration?registrationId=${payload.registrationId}&userRegId=${payload.userRegId}`;
        }
        else if (payload.userRegId) {
            url = `/api/registration?userRegId=${payload.userRegId}`;
        }
        else {
            url = `/api/registration?registrationId=${payload.registrationId}`;
        }

        return Method.dataGet(url, token);
    },
    // validateDiscountCode(payload) {
    //     var url = `/api/registration/discountcode/validate`;
    //     return Method.dataPost(url, token, payload);
    // },
    teamNameCheck(payload) {
        var url = `/api/registration/team/validate`;
        return Method.dataPost(url, token, payload);
    },
    getTeamInviteReview(payload) {
        var url = `/api/teaminvite/review?userRegId=${payload.userRegId}`;
        return Method.dataGet(url, token);
    },
    saveTeamInviteReview(payload) {
        var url = `/api/teaminvite/review?userRegId=${payload.userRegId}`;
        return Method.dataPost(url, token, payload);
    },
    // getTeamRegistrationReviewProducts(payload) {
    //     var url = `/api/teaminvite/review/products?userRegId=${payload.userRegId}`;
    //     return Method.dataGet(url, token);
    // },
    getDeRegisterData(userId) {
        var url = `/api/deregister?userId=${userId}`;
        return Method.dataGet(url, token);
    },
    saveDeRegister(payload) {
        var url = `/api/deregister`;
        return Method.dataPost(url, token, payload);
    },
    getParticipantDataById(participantKey, registrationKey) {
        var url = `/api/registration/participant?participantId=${participantKey}&registrationId=${registrationKey}`;
        return Method.dataGet(url, token);
    },
    saveParticipantData(payload) {
        var url = `/api/registration/participant`;
        return Method.dataPost(url, token, payload);
    },
    deleteRegistrationProduct(payload) {
        if (payload.teamName) {
            var url = `/api/registration/product/delete?registrationId=${payload.registrationId}&orgRegParticipantId=${payload.orgRegParticipantId}&teamName=${payload.teamName}`;
        } else {
            var url = `/api/registration/product/delete?registrationId=${payload.registrationId}&orgRegParticipantId=${payload.orgRegParticipantId}`;
        }
        return Method.dataDelete(url, token);
    },
    deleteRegistrationParticipant(payload) {
        if (payload.teamName) {
            var url = `/api/registration/participant/delete?registrationId=${payload.registrationId}&participantId=${payload.participantId}&competitionUniqueKey=${payload.competitionUniqueKey}&organisationUniqueKey=${payload.organisationUniqueKey}&teamName=${payload.teamName}`;
        } else {
            var url = `/api/registration/participant/delete?registrationId=${payload.registrationId}&participantId=${payload.participantId}&competitionUniqueKey=${payload.competitionUniqueKey}&organisationUniqueKey=${payload.organisationUniqueKey}`;
        }
        return Method.dataDelete(url, token);
    },
    getRegParticipantUsers(payload) {
        var url = `/api/registration/participant/users?registrationId=${payload.registrationId}`;
        return Method.dataGet(url, token);
    },
    getRegParticipantAddress(payload) {
        var url;
        if (payload.userRegId && payload.registrationId) {
            url = `/api/registration/participant/address?registrationId=${payload.registrationId}&userRegId=${payload.userRegId}`;
        }
        else if (payload.userRegId) {
            url = `/api/registration/participant/address?userRegId=${payload.userRegId}`;
        }
        else {
            url = `/api/registration/participant/address?registrationId=${payload.registrationId}`;
        }

        return Method.dataGet(url, token);
    },
    //check expired registration from appRegistrationForm
    expiredRegistrationCheck(payload) {
        let currentDate = moment(new Date()).format('YYYY-MM-DD');
        var url = `/api/registration/expiry/check?organisationId=${payload.organisationId}&competitionId=${payload.competitionId}&currentDate=${currentDate}`;
        return Method.dataGet(url, token);
    },
    getTransferOrganisationsData(payload) {
        var url = `/api/transfer/competitions?`;
        return Method.dataPost(url, token, payload);
    },

    getExistingTeamDataById(participantId) {
        var url = `/api/registration/teamparticipant?participantId=${participantId}`;
        return Method.dataGet(url, token);
    },

    getSeasonalCasualFees(payload) {
        var url = `api/registration/productfees`;
        return Method.dataPost(url, token, payload);
    },

    getSingleGameData(payload) {
        var url = `api/registration/singlegame`;
        return Method.dataPost(url, token, payload);
    },

    validateRegistrationCap(payload) {
        var url = `api/registrationcap/validate`;
        return Method.dataPost(url,token,payload)
    },

    teamMembersSave(payload){
        var url = `api/registration/teamparticipant`;
        return Method.dataPost(url,token,payload)
    },

    getTeamMembers(teamMemberRegId){
        var url = `api/registration/teamparticipantdata?teamMemberRegId=${teamMemberRegId}`;
        return Method.dataGet(url, token);
    },

    getTeamMembersReview(payload){
        var url = `api/registration/teamparticipant/review?registrationId=${payload.registrationId}&teamMemberRegId=${payload.teamMemberRegId}`;
        return Method.dataGet(url, token);
    },

    updateTeamMembers(payload) {
        const url = `api/registration/teamparticipant/removeoradd?userRegUniqueKey=${payload.userRegUniqueKey}&processType=${payload.processType}`;
        return Method.dataPost(url, token, payload);
      },

    cancelDeRegistration(payload) {
        const url = `/api/deregisterortransfer/cancel`;
        return Method.dataPost(url, token, payload);
    },
    playersToPayRetryPayment(payload) {
        const url = `api/playerstopay/pay`;
        return Method.dataPost(url, token, payload);
    },
    registrationRetryPayment(payload){
        const url = `api/payments/regitrations/retry`;
        return Method.dataPost(url, token, payload);
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
                        "Access-Control-Allow-Origin": "*",
                    },
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
