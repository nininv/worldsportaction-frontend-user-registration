import ApiConstants from "../../themes/apiConstants";

function loginAction(payload) {
  console.log(payload);
  const action = {
    type: ApiConstants.API_LOGIN_LOAD,
    payload: payload
  };

  return action;
}

// forgot password
function forgotPasswordAction(email, resetType) {
  return {
    type: ApiConstants.API_FORGOT_PASSWORD_LOAD,
    email,
    resetType,
  };
}

// clear reducer
function clearReducerAction(key) {
  return {
    type: ApiConstants.ACTION_TO_CLEAR_AUTHENTICATION_REDUCER,
    key
  };
}

// change password fields
function updatePasswordFieldsAction(key , value) {
  return {
    type: ApiConstants.ACTION_TO_UPDATE_PASSWORD_FIELDS,
    key,
    value
  };
}
// change password
function updatePasswordAction(data) {
  return {
    type: ApiConstants.API_UPDATE_PASSWORD,
    data
  };
}

export {
   loginAction,
   forgotPasswordAction,
   clearReducerAction,
   updatePasswordFieldsAction,
   updatePasswordAction
}
