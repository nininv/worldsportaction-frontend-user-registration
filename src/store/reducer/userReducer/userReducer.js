import ApiConstants from "../../../themes/apiConstants";
import { deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { JsonWebTokenError } from "jsonwebtoken";
import { setPhotoUrl } from "../../../util/sessionStorage";

const teamMemberObj = {
    "genderRefId": null,
    "email": null,
    "lastName": null,
    "firstName": null,
    "middleName": null,
    "dateOfBirth": null,
    "mobileNumber":null,
    "payingFor": 0,
    "emergencyFirstName": null,
    "emergencyLastName": null,
    "emergencyContactNumber": null,
    "isRegistererAsParent": 0,
    "parentOrGuardian": [],
    "membershipProductTypes": []
  }

const teamMembersSaveTemp = {
    "competitionId": null,
    "organisationId": null,
    "registrationId": null,
    "teamMemberRegId": null,
    "existingUserId": null,
    "teamId": null,
    "userId": null,
    "name": null,
    "countryRefId": null,
    "mobileNumber": null,
    "teamName": null,
    "divisions": [],
    "teamMembers": [],
    "registrationRestrictionTypeRefId": null
}

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
    userRegistrationList: null,
    userRegistrationPage: 1,
    userRegistrationTotalCount: 1,
    userRegistrationOnLoad: false,
    onMedicalLoad: false,
    onPersonLoad: false,
    userHistoryLoad: false,
    userHistoryList: [],
    userHistoryPage: 1,
    userHistoryTotalCount: 1,
    userRole: [],
    scorerActivityRoster: [],
    scorerCurrentPage: null,
    scorerTotalCount: null,
    activityScorerOnLoad: false,
    umpireActivityOnLoad: false,
    umpireActivityList: [],
    umpireActivityCurrentPage: 1,
    umpireActivityTotalCount: 0,
    allOrganisationList: [],
    getTeamMembersOnLoad: false,
    teamMembersDetails: null,
    teamMembersSave: deepCopyFunction(teamMembersSaveTemp),
    membershipProductsInfo: null,
    onMembershipLoad: false
};

//get User Role
function getUserRole(userRoleData) {

    let userRole = false

    for (let i in userRoleData) {
        if (userRoleData[i].roleId == 15 || userRoleData[i].roleId == 20) {

            userRole = true
            break;
        }
    }
    return userRole
}

function getUpdatedTeamMemberObj(competition){
    try{
      let teamMemberTemp = deepCopyFunction(teamMemberObj);
      teamMemberTemp.membershipProductTypes = [];
      let filteredTeamMembershipProducts =  competition.membershipProducts.filter(x => x.isTeamRegistration == 1 && x.allowTeamRegistrationTypeRefId == 1);
      for(let product of filteredTeamMembershipProducts){
        let obj = {
          "competitionMembershipProductId": product.competitionMembershipProductId,
          "competitionMembershipProductTypeId": product.competitionMembershipProductTypeId,
          "isPlayer": product.isPlayer,
          "productTypeName": product.shortName,
          "isChecked": false
        }
        teamMemberTemp.membershipProductTypes.push(obj);
      }
      return teamMemberTemp;
    }catch(ex){
      console.log("Error in getUpdatedTeamMemberObj::"+ex);
    }
  }

function upateTeamMembersSave(state){
    try{
        let membershipProducts = state.membershipProductInfo;
        let organisation = membershipProducts[0];
        let competition  = organisation.competitions[0];
        state.teamMembersSave.teamMembers.push(getUpdatedTeamMemberObj(competition));
        console.log("state",state.teamMembersSave.teamMembers)
    }catch(ex){
        console.log("Error in updateTeamMemberSave::"+ex);
    }
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_USER_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                umpireActivityOnLoad: false,
            };

        case ApiConstants.API_USER_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status,
                umpireActivityOnLoad: false,
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
            setPhotoUrl(personalData.photoUrl)
            let arr = [];
            if (personalData != null) {
                let obj = {
                    emergencyFirstName: personalData.emergencyFirstName,
                    emergencyLastName: personalData.emergencyLastName,
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
                userRegistrationList: userRegistrationData,
                // userRegistrationDataPage: userRegistrationData.page ? userRegistrationData.page.currentPage : 1,
                // userRegistrationDataTotalCount: userRegistrationData.page.totalCount,
                status: action.status
            };
        
        case ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_LOAD:
            return { ...state, getTeamMembersOnLoad: true };
        
        case ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_SUCCESS:
            let teamMembersDetailsData = action.result;
            return {
                ...state,
                getTeamMembersOnLoad: false,
                teamMembersDetails: teamMembersDetailsData,
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

        case ApiConstants.API_GET_USER_ROLE_LOAD:
            return { ...state, };

        case ApiConstants.API_GET_USER_ROLE_SUCCESS:
            let userRole = getUserRole(action.result)
            state.userRole = userRole
            return {
                ...state,
            };

        ////Scorer
        case ApiConstants.API_GET_SCORER_ACTIVITY_LOAD:
            return { ...state, activityScorerOnLoad: true };

        case ApiConstants.API_GET_SCORER_ACTIVITY_SUCCESS:
            return {
                ...state,
                activityScorerOnLoad: false,
                scorerActivityRoster: action.result.activityRoster,
                scorerCurrentPage: action.result.page.currentPage,
                scorerTotalCount: action.result.page.totalCount,
            };

        ////umpire activity list
        case ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_LOAD:
            return { ...state, umpireActivityOnLoad: true };

        case ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_SUCCESS:
            let umpireActivityData = action.result
            return {
                ...state,
                umpireActivityOnLoad: false,
                umpireActivityList: isArrayNotEmpty(umpireActivityData.results) ? umpireActivityData.results : [],
                umpireActivityCurrentPage: umpireActivityData.page.currentPage,
                umpireActivityTotalCount: umpireActivityData.page.totalCount,
            };

        /////////get all the organisations without authentication and userId
        case ApiConstants.API_GET_ALL_ORGANISATION_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_ALL_ORGANISATION_LIST_SUCCESS:
            state.allOrganisationList = action.result
            return {
                ...state,
                allOrganisationList: isArrayNotEmpty(action.result) ? action.result : [],
                onLoad: false,
            };
        
        case ApiConstants.API_USER_PHOTO_UPDATE_LOAD:
            return { ...state, userPhotoUpdate: true };

        case ApiConstants.API_USER_PHOTO_UPDATE_SUCCESS:
            let personalDataTemp = { ...action.result};
            personalDataTemp.userId = personalDataTemp.id;
            setPhotoUrl(personalDataTemp.photoUrl);
            let arrTemp = [];
            if (personalDataTemp != null) {
                let obj = {
                    emergencyFirstName: personalDataTemp.emergencyFirstName,
                    emergencyLastName: personalDataTemp.emergencyLastName,
                    emergencyContactNumber: personalDataTemp.emergencyContactNumber,
                    userId: personalDataTemp.userId
                };
                arrTemp.push(obj);
            }
        return {
            ...state,
            personalData: personalDataTemp,
            personalEmergency: arrTemp,
            userPhotoUpdate: false,
            status: action.status,
            error: null
        };

        case ApiConstants.API_REGISTRATION_RESEND_EMAIL_LOAD:
            return{...state,onLoad: true};
          
        case ApiConstants.API_REGISTRATION_RESEND_EMAIL_SUCCESS:
            return{
              ...state,
              onLoad: false,
              status: action.status
            }

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
            return { ...state, onMembershipLoad: true };

        case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
            state.membershipProductInfo = action.result;
            upateTeamMembersSave(state)
            return {
                ...state,
                onMembershipLoad: false,
                status: action.status,
            };
        
        case ApiConstants.TEAM_MEMBER_SAVE_UPDATE_ACTION:
            if(action.key == "teamMembersSave"){
                state.teamMembersSave = action.data;
            }else if(action.key == "teamMember"){
                if(action.index == undefined){
                    upateTeamMembersSave(state)
                }else{
                    state.teamMembersSave.teamMembers.splice(action.index,1);
                }
            }else if(action.key == "membershipProductTypes"){
                state.teamMembersSave.teamMembers[action.index].membershipProductTypes[action.subIndex].isChecked = action.data;
            }else{
                state.teamMembersSave.teamMembers[action.index][action.key] = action.data;
            }
            return{
                ...state
            }
        
        case ApiConstants.API_TEAM_MEMBERS_SAVE_LOAD:
            return{...state,teamMembersSaveOnLoad: false}
    
        case ApiConstants.API_TEAM_MEMBERS_SAVE_SUCCESS: 
            return {
                status: action.status,
                teamMembersSaveOnLoad: false,
                ...state
            }

        default:
            return state;
    }
}


export default userReducer;