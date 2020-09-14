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


export{
    getRegistrationReviewAction,
    saveRegistrationReview,
    updateReviewInfoAction,
   
}