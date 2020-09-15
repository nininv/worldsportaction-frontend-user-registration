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
// function membershipProductEndUserRegistrationAction(payload) {
//     const action = {
//         type: ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD,
//         payload: payload
//     };
//     return action;
// }


/////End User Registration getUser Info
// function getUserRegistrationUserInfoAction(payload) {
//     const action = {
//         type: ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD,
//         payload: payload
//     };
//     return action;
// }

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

function updateYourInfoAction(data, key, subKey){
    const action = {
        type: ApiConstants.UPDATE_YOUR_INFO_ACTION,
        data: data,
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

// // Get Terms and Condition
// function getTermsAndConditionsAction(payload){
//     const action = {
//         type: ApiConstants.API_GET_TERMS_AND_CONDITION_LOAD,
//         payload: payload
//     }

//     return action;
// }

function getRegistrationProductFeesAction(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_PRODUCT_FEES_LOAD,
        payload: payload
    }

    return action;
}

// function getRegistrationReviewAction(payload){
//     const action = {
//         type: ApiConstants.API_GET_REGISTRATION_REVIEW_LOAD,
//         payload: payload
//     }

//     return action;
// }

// function saveRegistrationReview(payload){
//     const action = {
//         type: ApiConstants.API_SAVE_REGISTRATION_REVIEW_LOAD,
//         payload: payload
//     }

//     return action;
// }

// function updateReviewInfoAction(value, key, index, subkey, subIndex){
//     const action = {
//         type: ApiConstants.UPDATE_REVIEW_INFO,
//         value: value,
//         key: key,
//         index: index,
//         subkey: subkey,
//         subIndex: subIndex
//     }

//     return action;
// }

function getRegistrationReviewProductAction(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_REVIEW_PRODUCT_LOAD,
        payload: payload
    }

    return action;
}

function saveRegistrationReviewProduct(payload){
    const action = {
        type: ApiConstants.API_SAVE_REGISTRATION_REVIEW_PRODUCT_LOAD,
        payload: payload
    }

    return action;
}


function updateReviewProductAction(value, key, index, subIndex, subkey){
    const action = {
        type: ApiConstants.UPDATE_REVIEW_PRODUCT,
        value: value,
        key: key,
        index: index,
        subIndex: subIndex,
        subkey: subkey
    }

    return action;
}

function getRegistrationByIdAction(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_BY_ID_LOAD,
        payload: payload
    }

    return action;
}


function validateDiscountCode(payload, index, subIndex){
    const action = {
        type: ApiConstants.API_VALIDATE_DISCOUNT_CODE_LOAD,
        payload: payload,
        index: index,
        subIndex: subIndex
    }

    return action;
}

function teamNameValidationAction(payload,index){
    const action = {
        type: ApiConstants.TEAM_NAME_CHECK_VALIDATION_LOAD,
        payload: payload,
        participantIndex:index
    }

    return action;
}

function getTeamRegistrationReviewAction(payload){
    const action = {
        type: ApiConstants.API_GET_TEAM_REGISTRATION_REVIEW_LOAD,
        payload: payload
    }

    return action;
}

function saveTeamRegistrationReview(payload){
    const action = {
        type: ApiConstants.API_SAVE_TEAM_REGISTRATION_REVIEW_LOAD,
        payload: payload
    }

    return action;
}

function updateTeamReviewInfoAction(value, key, index, subkey, subIndex){
    const action = {
        type: ApiConstants.UPDATE_TEAM_REVIEW_INFO,
        value: value,
        key: key,
        index: index,
        subkey: subkey,
        subIndex: subIndex
    }

    return action;
}

function getTeamRegistrationReviewProductAction(payload){
    const action = {
        type: ApiConstants.API_GET_TEAM_REGISTRATION_REVIEW_PRODUCT_LOAD,
        payload: payload
    }

    return action;
}

function clearUserRegistrationAction(){
    const action = {
        type: ApiConstants.USER_REGISTRATION_CLEAR_DATA
    }
    return action;
}
export {
    saveEndUserRegistrationAction,
    updateEndUserRegisrationAction,
    orgRegistrationRegSettingsEndUserRegAction,
    //membershipProductEndUserRegistrationAction,
    //getUserRegistrationUserInfoAction,
    clearRegistrationDataAction,
    updateRegistrationSettingsAction,
    updateTeamAction,
    updateYourInfoAction,
    getInvitedTeamRegInfoAction,
    updateTeamParentInfoAction,
    updateTeamRegSettingAction,
    updateTeamRegistrationInvite,
    // getTermsAndConditionsAction,
    getRegistrationProductFeesAction,
    // getRegistrationReviewAction,
    // saveRegistrationReview,
    // updateReviewInfoAction,
    getRegistrationReviewProductAction,
    saveRegistrationReviewProduct,
    updateReviewProductAction,
    getRegistrationByIdAction,
    validateDiscountCode,
    teamNameValidationAction,
    getTeamRegistrationReviewAction,
    saveTeamRegistrationReview,
    getTeamRegistrationReviewProductAction,
    updateTeamReviewInfoAction,
	clearUserRegistrationAction												  
}