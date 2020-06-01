import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";


let registrationObj = {
    organisationUniqueKey: "",
    registrationId: 0,
    orgRegistrationId: 0,
    volunteers: [],
    competitionUniqueKey: "",
    childrenCheckNumber: "",
    userRegistrations: [],
    vouchers: []
}

let commonRegSetting = {
    club_volunteer: 0,
    shop: 0,
    voucher: 0
}


const initialState = {
    onLoad: false,
    onMembershipLoad: false,
    userInfoOnLoad: false,
    error: null,
    result: null,
    status: 0,
    registrationDetail: registrationObj,
    registrationSettings: [],
    populateParticipantDetails: 0,
    membershipProductInfo: [],
    refFlag: "",
    user: null,
    userInfo: [],
    setCompOrgKey: false,
    registrationId: null,
    participantIndex: null,
    commonRegSetting: commonRegSetting

}


function endUserRegistrationReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_END_USER_REGISTRATION_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_END_USER_REGISTRATION_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_END_USER_REGISTRATION_SUCCESS:
            state.registrationId = action.result ? action.result.id : null
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.UPDATE_END_USER_REGISTRATION:

            let oldData = state.registrationDetail;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            if (getKey == "userInfo" || getKey == "refFlag" || getKey == "user"
                || getKey == "populateParticipantDetails" || getKey == "setCompOrgKey" ||
                getKey == "participantIndex") {
                state[getKey] = updatedValue;
            }
            else {
                oldData[getKey] = updatedValue;
            }

            return { ...state, error: null };


        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
            return { ...state, onMembershipLoad: true };

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
            let data = action.result;
            return {
                ...state,
                onMembershipLoad: false,
                status: action.status,
                membershipProductInfo: data
            };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD:
            state["participantIndex"] = action.payload.participantIndex;
            state["prodIndex"] = action.payload.prodIndex;
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" +  JSON.stringify(action.payload));
            return { ...state, onLoad: true };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS:
            let registrationSettings = action.result;
            console.log("*******))))))))))" + state["participantIndex"] + "^^^^" + state["refFlag"]);
    
            if(registrationSettings.club_volunteer == 1){
                state.commonRegSetting.club_volunteer = 1
            }
            if(registrationSettings.shop == 1){
                state.commonRegSetting.shop = 1
            }
            if(registrationSettings.voucher == 1){
                state.commonRegSetting.voucher = 1
            }

            if(state.participantIndex!= null){
                let index = state.participantIndex;
                let existingParticipant = state.registrationDetail.userRegistrations[index];
                if(state.prodIndex == undefined || state.prodIndex == null){
                    existingParticipant["regSetting"] = registrationSettings;
                }
                else{
                   
                    let existingSettings = existingParticipant.regSetting;
                    if(existingSettings!= null){
                        mergeRegistrationSettings(existingSettings, registrationSettings)
                        existingParticipant["regSetting"] = existingSettings;
                    }
                    else{
                        existingParticipant["regSetting"] = registrationSettings;
                    }
                }
                state["participantIndex"] = null;
                state["prodIndex"] = null;
            }
            return {
                ...state,
                onLoad: false,
                status: action.status,
                registrationSettings: registrationSettings
            };

        case ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD:
            return { ...state, userInfoOnLoad: true };

        case ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_SUCCESS:
            let userInfoData = action.result;
            return {
                ...state,
                userInfoOnLoad: false,
                status: action.status,
                userInfo: userInfoData
            };
        case ApiConstants.REGISTRATION_CLEAR_DATA:
            let registrationObj1 = {
                organisationUniqueKey: "",
                registrationId: 0,
                orgRegistrationId: 0,
                volunteers: [],
                competitionUniqueKey: "",
                childrenCheckNumber: "",
                userRegistrations: [],
                vouchers: []
            }

            state.status = 0;
            state.registrationDetail = registrationObj1;
            state.registrationSettings = [];
            state.populateParticipantDetails = 0;
            state.membershipProductInfo = [];
            state.refFlag = "";
            state.user = null;
            state.userInfo = [];
            state.isSetCompOrgKey = false;

            console.log("$$$$$$$$$$$44" + JSON.stringify(state.registrationDetail));
            return {
                ...state
            };

        default:
            return state;
    }
}

function mergeRegistrationSettings(existingSetting, newSetting){
    let keys = Object.keys(existingSetting);
    console.log("existingSetting11::" + JSON.stringify(existingSetting));
    for(let i in keys){
        // console.log("Keys::"+ keys[i]);
        // console.log("Keys New Value ::" + newSetting[keys[i]]);
        if(newSetting[keys[i]] == 1){
            existingSetting[keys[i]] = 1;
        }
    }

    console.log("existingSetting22::" + JSON.stringify(existingSetting));

    return existingSetting;
}   

export default endUserRegistrationReducer;