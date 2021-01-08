import ApiConstants from "../../../themes/apiConstants";

//get Role Action
function getRoleAction() {
  const action = {
    type: ApiConstants.API_ROLE_LOAD
  };
  return action;
}

////get URE Action
function getUreAction() {
  const action = {
    type: ApiConstants.API_URE_LOAD
  };

  return action;
}


////get particular user organisation 
function getUserOrganisationAction() {
  const action = {
    type: ApiConstants.API_GET_USER_ORGANISATION_LOAD
  }
  return action
}


function getUserModulePersonalDetailsAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD,
    payload: userId
  };
  return action;
}

function getUserModulePersonalByCompetitionAction(payload) {
  const action = {
    type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD,
    payload: payload
  };
  return action;
}

function getUserModuleRegistrationAction(payload) {
  const action = {
    type: ApiConstants.API_USER_MODULE_REGISTRATION_LOAD,
    payload: payload
  };
  return action;
}

function getUserModuleMedicalInfoAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityPlayerAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityParentAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityScorerAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD,
    payload: userId
  };
  return action;
}

function getUserModuleActivityManagerAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD,
    payload: userId
  };
  return action;
}


function userProfileUpdateAction(data) {
  const action = {
    type: ApiConstants.API_USER_PROFILE_UPDATE_LOAD,
    data,
  };

  return action;
}

function getUserHistoryAction(userId) {
  const action = {
    type: ApiConstants.API_USER_MODULE_HISTORY_LOAD,
    payload: userId
  };
  return action;
}

function getUserRole(userId) {
  const action = {
    type: ApiConstants.API_GET_USER_ROLE_LOAD,
    userId
  };
  return action
}

function getScorerData(payload, roleId, matchStatus) {
  const action = {
    type: ApiConstants.API_GET_SCORER_ACTIVITY_LOAD,
    payload,
    roleId,
    matchStatus
  };
  return action
}

function getUmpireActivityListAction(payload, roleId, userId, sortBy, sortOrder) {
  const action = {
    type: ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_LOAD,
    payload, roleId, userId, sortBy, sortOrder
  };
  return action
}

/////get all the organisations without authentication and userId
function getAllOrganisationListAction() {
  const action = {
    type: ApiConstants.API_GET_ALL_ORGANISATION_LIST_LOAD,
  };
  return action
}

function userPhotoUpdateAction(payload, userId) {
  return {
      type: ApiConstants.API_USER_PHOTO_UPDATE_LOAD,
      payload,
      userId
  };
}

function registrationResendEmailAction(teamId){
  const action = {
      type: ApiConstants.API_REGISTRATION_RESEND_EMAIL_LOAD,
      teamId
  } 
  return action;
}

function userPasswordUpdateAction(payload) {
  return {
      type: ApiConstants.API_USER_PASSWORD_UPDATE_LOAD,
      payload,
  };
}

function getUserModuleTeamMembersAction(payload){
  return {
      type: ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_LOAD,
      payload: payload
  }
}

function teamMemberSaveUpdateAction(data,key,index,subIndex){
  const action = {
    type: ApiConstants.TEAM_MEMBER_SAVE_UPDATE_ACTION,
    data,
    key,
    index,
    subIndex
  }
  return action;
}

function teamMembersSaveAction(payload){
  const action = {
    type: ApiConstants.API_TEAM_MEMBERS_SAVE_LOAD,
    payload
  }
  return action;
}

function getTeamMembersAction(){
  const action = {
    type: ApiConstants.API_GET_TEAM_MEMBERS_LOAD
  }
  return action;
}



export {
  getRoleAction,
  getUreAction,
  getUserOrganisationAction,
  getUserModulePersonalDetailsAction,
  getUserModulePersonalByCompetitionAction,
  getUserModuleRegistrationAction,
  getUserModuleMedicalInfoAction,
  getUserModuleActivityPlayerAction,
  getUserModuleActivityParentAction,
  getUserModuleActivityScorerAction,
  getUserModuleActivityManagerAction,
  userProfileUpdateAction,
  getUserHistoryAction,
  getUserRole,
  getScorerData,
  getUmpireActivityListAction,
  getAllOrganisationListAction,
  userPhotoUpdateAction,
  registrationResendEmailAction,
  userPasswordUpdateAction,
  getUserModuleTeamMembersAction,
  teamMemberSaveUpdateAction,
  teamMembersSaveAction,
  getTeamMembersAction
}