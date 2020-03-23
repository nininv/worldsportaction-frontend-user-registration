import ApiConstants from "../../themes/apiConstants";

function loginAction(payload) {
  console.log(payload);
  const action = {
    type: ApiConstants.API_LOGIN_LOAD,
    payload: payload
  };

  return action;
}

export default loginAction;
