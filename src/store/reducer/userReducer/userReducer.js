import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { JsonWebTokenError } from "jsonwebtoken";


const initialState = {
    onLoad: false,
    onUpUpdateLoad: false,
    error: null,
    result: [],
    status: 0,
    roles: [],
    userRolesEntity: [],
    allUserOrganisationData: [],
    getUserOrganisation: [],
    activityPlayerOnLoad: false,
    activityPlayerList: [],
    activityPlayerPage: 1,
    activityPlayerTotalCount: 1,
    activityParentOnLoad: false,
    activityParentList: [],
    activityParentPage: 1,
    activityParentTotalCount: 1,
    activityScorerOnLoad: false,
    activityScorerList: [],
    activityScorerPage: 1,
    activityScorerTotalCount: 1,
    activityManagerOnLoad: false,
    activityManagerList: [],
    activityManagerPage: 1,
    activityManagerTotalCount: 1,
    personalData: {},
    personalEmergency: [],
    medicalData: [],
    personalByCompData: [],
    userRegistrationList: [],
    userRegistrationPage: 1,
    userRegistrationTotalCount: 1,
    userRegistrationOnLoad: false,
    onMedicalLoad:false,
    onPersonLoad:false,
    userHistoryLoad: false,
    userHistoryList: [],
    userHistoryPage: 1,
    userHistoryTotalCount: 1
};

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_USER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_USER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        // get Role Entity List for current  user
        case ApiConstants.API_ROLE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_ROLE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                roles: action.result,
                status: action.status
            };

        // User Role Entity List for current  user
        case ApiConstants.API_URE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_URE_SUCCESS:

            return {
                ...state,
                onLoad: false,
                userRoleEntity: action.result,
                status: action.status
            };

        /////get particular user organisation 
        case ApiConstants.API_GET_USER_ORGANISATION_LOAD:
            return { ...state, onLoad: true, error: null }

        case ApiConstants.API_GET_USER_ORGANISATION_SUCCESS:
            state.allUserOrganisationData = isArrayNotEmpty(action.result) ? action.result : []
            state.getUserOrganisation = isArrayNotEmpty(action.result) ? action.result : []

            return {
                ...state,
                onLoad: false,
                error: null,
                status: action.status
            }

        case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS:
            let personalData = action.result;
            let arr = [];
            if (personalData != null) {
                let obj = {
                    emergencyContactName: personalData.emergencyContactName,
                    emergencyContactNumber: personalData.emergencyContactNumber,
                    userId: personalData.userId
                };
                arr.push(obj);
            }
            return {
                ...state,
                onLoad: false,
                personalData: personalData,
                personalEmergency: arr,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD:
            return { ...state, onPersonLoad: true };

        case ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS:
            let personalByCompData = action.result;
            return {
                ...state,
                onPersonLoad: false,
                personalByCompData: personalByCompData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD:
            return { ...state, onMedicalLoad: true };

        case ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS:
            let medicalData = action.result;

            return {
                ...state,
                onMedicalLoad: false,
                medicalData: medicalData,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_REGISTRATION_LOAD:
            return { ...state, userRegistrationOnLoad: true };

        case ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS:
            let userRegistrationData = action.result;
            return {
                ...state,
                userRegistrationOnLoad: false,
                userRegistrationList: userRegistrationData.registrationDetails,
                userRegistrationDataPage: userRegistrationData.page ? userRegistrationData.page.currentPage : 1,
                userRegistrationDataTotalCount: userRegistrationData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD:
            return { ...state, activityPlayerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS:
            let activityPlayerData = action.result;
            return {
                ...state,
                activityPlayerOnLoad: false,
                activityPlayerList: activityPlayerData.activityPlayers,
                activityPlayerPage: activityPlayerData.page ? activityPlayerData.page.currentPage : 1,
                activityPlayerTotalCount: activityPlayerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD:
            return { ...state, activityParentOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS:
            let activityParentData = action.result;
            return {
                ...state,
                activityParentOnLoad: false,
                activityParentList: activityParentData.activityParents,
                activityParentPage: activityParentData.page ? activityParentData.page.currentPage : 1,
                activityParentTotalCount: activityParentData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD:
            return { ...state, activityScorerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS:
            let activityScorerData = action.result;
            return {
                ...state,
                activityScorerOnLoad: false,
                activityScorerList: activityScorerData.activityScorer,
                activityScorerPage: activityScorerData.page ? activityScorerData.page.currentPage : 1,
                activityScorerTotalCount: activityScorerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD:
            return { ...state, activityManagerOnLoad: true };

        case ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS:
            let activityManagerData = action.result;
            return {
                ...state,
                activityManagerOnLoad: false,
                activityManagerList: activityManagerData.activityManager,
                activityManagerPage: activityManagerData.page ? activityManagerData.page.currentPage : 1,
                activityManagerTotalCount: activityManagerData.page.totalCount,
                status: action.status
            };

        case ApiConstants.API_USER_PROFILE_UPDATE_LOAD:  
            return { ...state, onUpUpdateLoad: true };

        case ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS:
            return {
                ...state,
                onUpUpdateLoad: false,
                userProfileUpdate: action.result,
                status: action.status
            };
        case ApiConstants.API_USER_MODULE_HISTORY_LOAD:
            return { ...state, userHistoryLoad: true };

        case ApiConstants.API_USER_MODULE_HISTORY_SUCCESS:
            let userHistoryData = action.result;
            return {
                ...state,
                userHistoryLoad: false,
                userHistoryList: userHistoryData.userHistory,
                userHistoryPage: userHistoryData.page ? userHistoryData.page.currentPage : 1,
                userHistoryTotalCount: userHistoryData.page.totalCount,
                status: action.status
            };
        default:
            return state;
    }
}


export default userReducer;