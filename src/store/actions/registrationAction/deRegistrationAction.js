import ApiConstants from "../../../themes/apiConstants";


/////save end user registration
function updateDeregistrationData(value, key, subKey) {
    const action = {
        type: ApiConstants.API_UPDATE_DE_REGISTRATION,
        value, key, subKey
    };
    return action;
}

function getDeRegisterDataAction(userId){
    const action = {
        type: ApiConstants.API_GET_DE_REGISTRATION_LOAD,
        userId
    }

    return action;
}

function saveDeRegisterDataAction(payload){
    const action = {
        type: ApiConstants.API_SAVE_DE_REGISTRATION_LOAD,
        payload
    }

    return action;
}

function getTransferCompetitionsAction(payload){
    const action = {
        type: ApiConstants.API_GET_TRANSFER_COMPETITIONS_LOAD,
        payload
    }

    return action;
}



export {
    updateDeregistrationData,
    getDeRegisterDataAction,
    saveDeRegisterDataAction,
    getTransferCompetitionsAction
}