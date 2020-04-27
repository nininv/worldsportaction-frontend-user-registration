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


////get organisation
function getOrganisationAction() {
  const action = {
    type: ApiConstants.API_ORGANISATION_LOAD
  }
  return action
}


////get particular user organisation 
function getUserOrganisationAction() {
  const action = {
    type: ApiConstants.API_GET_USER_ORGANISATION_LOAD
  }
  return action
}

export {
  getRoleAction,
  getUreAction,
  getOrganisationAction,
  getUserOrganisationAction,
}