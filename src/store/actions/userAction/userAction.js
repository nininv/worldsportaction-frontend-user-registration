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

/* Affiliates Listing */
function getAffiliatesListingAction(payload) {
  const action = {
    type: ApiConstants.API_AFFILIATES_LISTING_LOAD,
    payload: payload
  };
  return action;
}

/* Save Affiliate */
function saveAffiliateAction(payload) {
  const action = {
    type: ApiConstants.API_SAVE_AFFILIATE_LOAD,
    payload: payload
  };
  return action;
}


/* Get Affiliate by Organisation Id */
function getAffiliateByOrganisationIdAction(organisationId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_LOAD,
    payload: organisationId
  };
  return action;
}

/* Get Affiliate Our Organisation */
function getAffiliateOurOrganisationIdAction(organisationId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_LOAD,
    payload: organisationId
  };
  return action;
}

/* Get AffiliateTo Organisation*/
function getAffiliateToOrganisationAction(organisationId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_LOAD,
    payload: organisationId
  };
  return action;
}

// Update Affiliate
function updateAffiliateAction(data, key) {
  const action = {
    type: ApiConstants.UPDATE_AFFILIATE,
    updatedData: data,
    key: key
  };
  return action;
}

// Update NewAffiliate
function updateNewAffiliateAction(data, key) {
  const action = {
    type: ApiConstants.UPDATE_NEW_AFFILIATE,
    updatedData: data,
    key: key
  };
  return action;
}

// Update Org Affiliate
function updateOrgAffiliateAction(data, key) {
  const action = {
    type: ApiConstants.UPDATE_ORG_AFFILIATE,
    updatedData: data,
    key: key
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

function affiliateDeleteAction(affiliateId) {
  const action = {
    type: ApiConstants.API_AFFILIATE_DELETE_LOAD,
    payload: affiliateId
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

//onchange user organisation data
function onOrganisationChangeAction(organisationData, key) {
  const action = {
    type: ApiConstants.ONCHANGE_USER_ORGANISATION,
    organisationData,
    key
  }
  return action
}

export {
  getRoleAction,
  getUreAction,
  getAffiliatesListingAction,
  saveAffiliateAction,
  getAffiliateByOrganisationIdAction,
  getAffiliateToOrganisationAction,
  updateAffiliateAction,
  updateNewAffiliateAction,
  getAffiliateOurOrganisationIdAction,
  updateOrgAffiliateAction,
  getOrganisationAction,
  affiliateDeleteAction,
  getUserOrganisationAction,
  onOrganisationChangeAction
}