// import userHttp from './userHttp';
import userHttp from "./userHttp";
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";
import { getUserId, getAuthToken, getOrganisationData } from "../../../util/sessionStorage"


let token = getAuthToken();
let userId = getUserId()

async function logout() {
  await localStorage.clear();
  history.push("/");
}

let userHttpApi = {


  Login(payload) {
    var base64 = require("base-64");
    var md5 = require("md5");
    let authorization = base64.encode(
      payload.userName + ":" + md5(payload.password)
    );
    var url = "/users/loginWithEmailPassword";
    return Method.dataGet(url, authorization);
  },

  forgotPassword(email, resetType) {
    const param = encodeURIComponent(email);
    const url = `password/forgot?email=${param}&type=${resetType}`;
    return Method.dataGet(url, token);
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

  //// get particular user organisation 
  async getUserOrganisation() {
    let userId =  await getUserId()
    if(userId!= 0){
      var url = `api/userorganisation?userId=${userId}`;
      return Method.dataGet(url, token)
    }
  },
  getUserModulePersonalData(payload) {
    var url = `api/user/personaldetails?userId=${payload.userId}&organisationId=${payload.organisationId!= null ? payload.organisationId: '' }`;
    return Method.dataGet(url, token);
  },
  getUserModulePersonalByCompData(payload) {
    var url = `api/user/personaldetails/competition`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleMedicalInfo(payload) {
    var url = `api/user/medical`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleRegistrationData(payload) {
    var url = `api/user/registration`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityPlayer(payload) {
    var url = `api/user/activity/player`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityParent(payload) {
    var url = `api/user/activity/parent`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityScorer(payload) {
    var url = `api/user/activity/scorer`;
    return Method.dataPost(url, token, payload);
  },
  getUserModuleActivityManager(payload) {
    var url = `api/user/activity/manager`;
    return Method.dataPost(url, token, payload);
  },


  updateUserProfile(payload) {
    var url = `api/userprofile/update?section=${payload.section}`;
    return Method.dataPost(url, token, payload);
  },
  getUserHistory(payload) {
    const url = `api/user/history`;
    return Method.dataPost(url, token, payload);
  },
  getUserRoleData(userId) {
    const url = `ure/byUserId?userId=${userId}`;
    return Method.dataGet(url, token);
  },
  
  getScorerActivityData(payload, roleId, matchStatus) {
    const url = `api/user/activity/roster?roleId=${roleId}&matchStatus=${matchStatus}`;
    return Method.dataPost(url, token, payload);
  },

  ////get all the organisations without authentication and userId
  getAllOrganisationList() {
    const url = `api/organisations/all`;
    return Method.dataGet(url, token);
  },

  saveUserPhoto(payload) {
    const url = `users/photo`;
    return Method.dataPost(url, token, payload);
  },
  registrationResendEmail(teamId){
    const url = `api/users/registration/resendmail`;
    return Method.dataPost(url, token, null);
  },
  updatePassword(data) {
    console.log(data)
    let payload = {
      password: data.currentPassword,
      newPassword: data.newPassword,
    }
    console.log(payload)
    const url = `users/updatePassword`;
    return Method.dataPatch(url, token, payload);        
  },

  checkUserMatch(payload) {
    const url = `api/user/existing`;
    return Method.dataPost(url, token, payload);
  },

  sendAuthenticationCodeType(payload) {
    const url = `api/user/existing-auth-code`;
    return Method.dataPost(url, token, payload);
  },

  sendDigitCode(payload) {
    const url = `api/user/existing-digit-code`;
    return Method.dataPost(url, token, payload);
  },
  checkDigitCode(payload) {
    const url = `api/user/check-existing-digit-code`;
    return Method.dataPost(url, token, payload);
  },
}

let Method = {
  async dataPost(newurl, authorization, body) {
    const url = newurl;
    return await new Promise((resolve, reject) => {
      userHttp
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
      userHttp
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
      userHttp
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
  async dataPatch(newUrl, authorization, body) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      userHttp
        .patch(url, body, {    
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
          } else if (result.status === 212) {
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
              if (err.response.status === 401) {
                let unauthorizedStatus = err.response.status;
                if (unauthorizedStatus === 401) {
                  logout();
                  message.error(ValidationConstants.messageStatus401)
                }
              } else if (err.response.status === 400) {
                message.config({
                  duration: 1.5,
                  maxCount: 1,
                });
                message.error(err.response.data.message);
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
};

export default userHttpApi;
