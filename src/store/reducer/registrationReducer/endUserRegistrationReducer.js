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

let membershipProdInfoObj = {
    specialNote: "",
    training: "",
    competitionName: "",
    membershipProducts: []
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
                || getKey == "populateParticipantDetails" || getKey == "setCompOrgKey") {
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
            return { ...state, onLoad: true };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS:
            let orgData = action.result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
                registrationSettings: orgData
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

export default endUserRegistrationReducer;