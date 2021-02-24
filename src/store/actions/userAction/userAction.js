import ApiConstants from "../../../themes/apiConstants";

//get Role Action
function getRoleAction() {
  return {
    type: ApiConstants.API_ROLE_LOAD
  };
}

////get URE Action
function getUreAction() {
  return {
    type: ApiConstants.API_URE_LOAD
  };
}

////get particular user organisation
function getUserOrganisationAction() {
  return {
    type: ApiConstants.API_GET_USER_ORGANISATION_LOAD
  };
}

function getUserModulePersonalDetailsAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD,
    payload: userId
  };
}

function getUserModulePersonalByCompetitionAction(payload) {
  return {
    type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD,
    payload,
  };
}

function getUserModuleRegistrationAction(payload) {
  return {
    type: ApiConstants.API_USER_MODULE_REGISTRATION_LOAD,
    payload,
  };
}

function getUserModuleMedicalInfoAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD,
    payload: userId
  };
}

function getUserModuleActivityPlayerAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD,
    payload: userId
  };
}

function getUserModuleActivityParentAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD,
    payload: userId
  };
}

function getUserModuleActivityScorerAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD,
    payload: userId
  };
}

function getUserModuleActivityManagerAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD,
    payload: userId
  };
}

function userProfileUpdateAction(data) {
  return {
    type: ApiConstants.API_USER_PROFILE_UPDATE_LOAD,
    data,
  };
}

function getUserHistoryAction(userId) {
  return {
    type: ApiConstants.API_USER_MODULE_HISTORY_LOAD,
    payload: userId
  };
}

function getUserRole(userId) {
  return {
    type: ApiConstants.API_GET_USER_ROLE_LOAD,
    userId
  };
}

function getScorerData(payload, roleId, matchStatus) {
  return {
    type: ApiConstants.API_GET_SCORER_ACTIVITY_LOAD,
    payload,
    roleId,
    matchStatus
  };
}

function getUmpireActivityListAction(payload, roleId, userId, sortBy, sortOrder) {
  return {
    type: ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_LOAD,
    payload,
    roleId,
    userId,
    sortBy,
    sortOrder
  };
}

/////get all the organisations without authentication and userId
function getAllOrganisationListAction() {
  return {
    type: ApiConstants.API_GET_ALL_ORGANISATION_LIST_LOAD,
  };
}

function userPhotoUpdateAction(payload, userId) {
  return {
    type: ApiConstants.API_USER_PHOTO_UPDATE_LOAD,
    payload,
    userId
  };
}

function registrationResendEmailAction(teamId) {
  return {
    type: ApiConstants.API_REGISTRATION_RESEND_EMAIL_LOAD,
    teamId
  };
}

function userPasswordUpdateAction(payload) {
  return {
    type: ApiConstants.API_USER_PASSWORD_UPDATE_LOAD,
    payload,
  };
}

function getUserModuleTeamMembersAction(payload) {
  return {
    type: ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_LOAD,
    payload,
  }
}

function teamMemberSaveUpdateAction(data, key, index, subIndex) {
  return {
    type: ApiConstants.TEAM_MEMBER_SAVE_UPDATE_ACTION,
    data,
    key,
    index,
    subIndex,
  };
}

function teamMembersSaveAction(payload) {
  return {
    type: ApiConstants.API_TEAM_MEMBERS_SAVE_LOAD,
    payload
  };
}

function getTeamMembersAction(teamMemberRegId) {
  return {
    type: ApiConstants.API_GET_TEAM_MEMBERS_LOAD,
    teamMemberRegId
  };
}

function updateReviewInfoAction(value, key, index, subKey, subIndex) {
  return {
    type: ApiConstants.UPDATE_TEAM_MEMBER_REVIEW_INFO,
    value,
    key,
    index,
    subKey,
    subIndex,
  };
}

function getTeamMembersReviewAction(payload) {
  return {
    type: ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_LOAD,
    payload
  };
}

function teamMemberUpdateAction(data) {
    return {
        type: ApiConstants.API_TEAM_MEMBER_UPDATE_LOAD,
        data,
    }
}

function getUsersByRoleAction(data) {
  return {
      type: ApiConstants.API_GET_USERS_BY_ROLE_LOAD,
      data,
  }
}

function getUserParentDataAction(data) {
  return {
    type: ApiConstants.API_GET_USER_PARENT_DATA_LOAD,
    data,
  }
}
function cancelDeRegistrationAction(payload) {
  return {
      type: ApiConstants.API_CANCEL_DEREGISTRATION_LOAD,
      payload,
  };
}
function liveScorePlayersToPayRetryPaymentAction(payload){
  const action = {
      type: ApiConstants.API_LIVE_SCORE_PLAYERS_TO_PAY_RETRY_PAYMENT_LOAD,
      payload
  }

  return action;
}

function registrationRetryPaymentAction(payload){
  const action = {
      type: ApiConstants.API_REGISTRATION_RETRY_PAYMENT_LOAD,
      payload
  }
  return action
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
  getTeamMembersAction,
  updateReviewInfoAction,
  getTeamMembersReviewAction,
  teamMemberUpdateAction,
  getUserParentDataAction,
  getUsersByRoleAction,
  cancelDeRegistrationAction,
  liveScorePlayersToPayRetryPaymentAction,
  registrationRetryPaymentAction
}

