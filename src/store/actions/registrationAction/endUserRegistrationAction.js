import ApiConstants from "../../../themes/apiConstants";


/////save end user registration
function saveEndUserRegistrationAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD,
        payload: payload
    };
    return action;
}

// Update End user registration
function updateEndUserRegisrationAction(data, key, subKey) {
    const action = {
      type: ApiConstants.UPDATE_END_USER_REGISTRATION,
      updatedData: data,
      key: key,
      subKey: subKey
    };
    return action;
  }

  function updateRegistrationSettingsAction(participantIndex, prodIndex, key) {
    const action = {
      type: ApiConstants.UPDATE_REGISTRATION_SETTINGS,
      participantIndex: participantIndex,
      prodIndex: prodIndex,
      key: key
    };
    return action;
  }

/////Organisation Registration Registration Settings
function orgRegistrationRegSettingsEndUserRegAction(payload) {
    const action = {
        type: ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD,
        payload: payload
    };
    return action;
}

/////End User Registration Membership Products
function membershipProductEndUserRegistrationAction(payload) {
    const action = {
        type: ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD,
        payload: payload
    };
    return action;
}


/////End User Registration getUser Info
function getUserRegistrationUserInfoAction(payload) {
    const action = {
        type: ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD,
        payload: payload
    };
    return action;
}

function clearRegistrationDataAction()
{
    const action = {
        type: ApiConstants.REGISTRATION_CLEAR_DATA
    }

    return action;
}

function updateTeamAction(data, index,key, subKey,subIndex){
    const action = {
        type: ApiConstants.UPDATE_TEAM_ACTION,
        data: data,
        index: index,
        subIndex: subIndex,
        key: key,
        subKey:subKey
    }
    return action;
}

function updateYourInfoAction(data, index, key, subKey){
    const action = {
        type: ApiConstants.UPDATE_YOUR_INFO_ACTION,
        data: data,
        index: index,
        key: key,
        subKey: subKey
    }
    return action;
}

// 
function getInvitedTeamRegInfoAction(payload) {
    const action = {
        type: ApiConstants.API_GET_INVITED_TEAM_REG_INFO_LOAD,
        payload: payload
    };
    return action;
}

function updateTeamParentInfoAction(data,key){
    const action = {
        type: ApiConstants.UPDATE_TEAM_PARENT_INFO,
        data: data,
        key: key
    }
    return action;
}

function updateTeamRegSettingAction(data,key){
    const action = {
        type: ApiConstants.UPDATE_TEAM_REG_SETTINGS,
        data: data,
        key: key
    }
    return action;
}

/////Update Team Registration Invite
function updateTeamRegistrationInvite(payload) {
    const action = {
        type: ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD,
        payload: payload
    };
    return action;
}

// Get Terms and Condition
function getTermsAndConditionsAction(payload){
    const action = {
        type: ApiConstants.API_GET_TERMS_AND_CONDITION_LOAD,
        payload: payload
    }

    return action;
}

export {
    saveEndUserRegistrationAction,
    updateEndUserRegisrationAction,
    orgRegistrationRegSettingsEndUserRegAction,
    membershipProductEndUserRegistrationAction,
    getUserRegistrationUserInfoAction,
    clearRegistrationDataAction,
    updateRegistrationSettingsAction,
    updateTeamAction,
    updateYourInfoAction,
    getInvitedTeamRegInfoAction,
    updateTeamParentInfoAction,
    updateTeamRegSettingAction,
    updateTeamRegistrationInvite,
    getTermsAndConditionsAction
}