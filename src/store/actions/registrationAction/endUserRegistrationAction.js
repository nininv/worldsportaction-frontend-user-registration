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
function updateEndUserRegisrationAction(data, key) {
    const action = {
      type: ApiConstants.UPDATE_END_USER_REGISTRATION,
      updatedData: data,
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

export {
    saveEndUserRegistrationAction,
    updateEndUserRegisrationAction,
    orgRegistrationRegSettingsEndUserRegAction,
    membershipProductEndUserRegistrationAction,
    getUserRegistrationUserInfoAction
}