import ApiConstants from "../../../themes/apiConstants";

function getUserRegistrationUserInfoAction(payload) {
    const action = {
        type: ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD_NEW,
        payload: payload
    };
    return action;
}

function selectParticipantAction(data,key) {
    const action = {
        type: ApiConstants.SELECT_PARTICIPANT,
        data: data,
        key: key
    }
    return action;
}

function updateUserRegistrationObjectAction(data,key){
    const action = {
        type: ApiConstants.UPDATE_USER_REGISTATION_OBJECT,
        data: data,
        key: key
    }
    return action;
}

export{
    getUserRegistrationUserInfoAction,
    selectParticipantAction,
    updateUserRegistrationObjectAction
}