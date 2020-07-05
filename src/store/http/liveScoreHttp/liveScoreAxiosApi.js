// import { DataManager } from './../../Components';
import http from "./liveScorehttp";
import { getUserId, getAuthToken, getLiveScoreCompetiton } from "../../../util/sessionStorage"
import history from "../../../util/history";
import { message } from "antd";
import ValidationConstants from "../../../themes/validationConstant";
import { isArrayNotEmpty } from "../../../util/helpers";


async function logout() {
    await localStorage.clear();
    history.push("/");
}

let token = getAuthToken();
// let userId = getUserId();


let LiveScoreAxiosApi = {
   
    liveScoreGetDivision(data, compKey) {
    
        var url = null
        if(compKey){
            url =  `/division?competitionKey=${compKey}`
        }else{
            url =  `/division?competitionId=${data}`
        }

       
        return Method.dataGet(url, null)
    },
  

    liveScoreLadderList(divisionId, competitionID, compKey) {
        var url = null
        if(compKey){
             url = `/teams/ladder?divisionIds=${divisionId}&competitionKey=${compKey}`;
        }else{
             url = `/teams/ladder?divisionIds=${divisionId}&competitionIds=${competitionID}`;
        }
       
        return Method.dataGet(url, localStorage.token)
    },


    liveScoreRound(competitionID) {
        console.log("colled")
        var url = `/round?competitionId=${competitionID}`;
        return Method.dataGet(url, localStorage.token)
    },

    //Get Fixture Competition List
    getFixtureCompList(orgId){
        let url = `/competitions/list?organisationUniqueKey=${orgId}`
        return Method.dataGet(url, localStorage.token);
    }
};




const Method = {
   
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
