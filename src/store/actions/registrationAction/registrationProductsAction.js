import ApiConstants from "../../../themes/apiConstants";

function getRegistrationReviewAction(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_REVIEW_LOAD,
        payload: payload
    }

    return action;
}

function saveRegistrationReview(payload){
    const action = {
        type: ApiConstants.API_SAVE_REGISTRATION_REVIEW_LOAD,
        payload: payload
    }

    return action;
}

function updateReviewInfoAction(value, key, index, subkey, subIndex){
    const action = {
        type: ApiConstants.UPDATE_REVIEW_INFO,
        value: value,
        key: key,
        index: index,
        subKey: subkey,
        subIndex: subIndex
    }

    return action;
}

function deleteRegistrationProductAction(payload){
    const action = {
        type: ApiConstants.API_DELETE_REGISTRATION_PRODUCT_LOAD,
        payload: payload
    }

    return action;
}

function deleteRegistrationParticipantAction(payload){
    const action = {
        type: ApiConstants.API_DELETE_REGISTRATION_PARTICIPANT_LOAD,
        payload: payload
    }

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

function getRegistrationByIdAction(payload){
    const action = {
        type: ApiConstants.API_GET_REGISTRATION_BY_ID_LOAD,
        payload: payload
    }

    return action;
}



export{
    getRegistrationReviewAction,
    saveRegistrationReview,
    updateReviewInfoAction,
    deleteRegistrationProductAction,
    deleteRegistrationParticipantAction,
    getTermsAndConditionsAction,
    getRegistrationByIdAction
}