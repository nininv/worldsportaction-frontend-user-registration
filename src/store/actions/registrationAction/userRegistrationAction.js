import ApiConstants from "../../../themes/apiConstants";

function getUserRegistrationUserInfoAction(payload) {
    const action = {
        type: ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD,
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

function getParticipantInfoById(participantKey) {
    const action = {
        type: ApiConstants.API_GET_PARTICIPANT_BY_ID_LOAD,
        participantKey: participantKey
    };
    return action;
}

function saveParticipantInfo(payload) {
    const action = {
        type: ApiConstants.API_SAVE_PARTICIPANT_LOAD,
        payload: payload
    };
    return action;
}

export{
    getUserRegistrationUserInfoAction,
    selectParticipantAction,
    updateUserRegistrationObjectAction,
    getParticipantInfoById,
    saveParticipantInfo
}