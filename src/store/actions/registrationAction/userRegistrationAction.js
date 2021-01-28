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

function updateParticipantCompetitionAction(data,key,index,subIndex,subKey,subData){
    const action = {
        type: ApiConstants.UPDATE_PARTICIPANT_COMPETITION_OBJECT,
        data: data,
        key: key,
        index: index,
        subIndex: subIndex,
        subKey: subKey,
        subData: subData
    }
    return action;
}

function getParticipantInfoById(participantKey,registrarionKey) {
    const action = {
        type: ApiConstants.API_GET_PARTICIPANT_BY_ID_LOAD,
        participantKey: participantKey,
        registrationKey: registrarionKey
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

function membershipProductEndUserRegistrationAction(payload) {
    const action = {
        type: ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD,
        payload: payload
    };
    return action;
}

function updateUserRegistrationStateVarAction(key,data){
    const action = {
        type: ApiConstants.UPDATE_USER_REGISTRATION_STATE_VAR,
        key: key,
        data: data
    };
    return action;
}

function updateParticipantAdditionalInfoAction(data,key,subKey){
    const action = {
        type: ApiConstants.UPDATE_PARTICIPANT_ADDITIONAL_INFO,
        key: key,
        data: data,
        subKey: subKey
    };
    return action;
}

function orgRegistrationRegSettingsEndUserRegAction(payload) {
    const action = {
        type: ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD,
        payload: payload
    };
    return action;
}

function registrationExpiryCheckAction(payload){
    const action = {
        type: ApiConstants.API_EXPIRED_REGISTRATION_LOAD,
        payload: payload
    };
    return action;
}

function getSeasonalAndCasualFees(payload){
    const action = {
        type: ApiConstants.API_GET_SEASONAL_CASUAL_FEES_LOAD,
        payload
    }
    return action;
}

function startStepNavigation(){
    const action = {
        type: ApiConstants.API_START_STEP_NAVIGATION,
    };
    return action;
}
function stopStepNavigation(){
    const action = {
        type: ApiConstants.API_STOP_STEP_NAVIGATION,
    };
    return action;
}
function lookForExistingUser(payload){
    const action = {
        type: ApiConstants.API_GET_USER_EXIST,
        payload
    };
    return action;
}

function sendDigitCode(payload){
    const action = {
        type: ApiConstants.API_SEND_DIGIT_CODE,
        payload
    };
    return action;
}

function checkDigitCode(payload){
    const action = {
        type: ApiConstants.API_CHECK_DIGIT_CODE,
        payload
    };
    return action;
}

function doneCheckDigitCode(payload){
    const action = {
        type: ApiConstants.API_DONE_CHECK_DIGIT_CODE,
        payload
    };
    return action;
}

function cancelSend(){
    const action = {
        type: ApiConstants.API_CANCEL_SEND,
    };
    return action;
}

function startConfirm(payload){
    const action = {
        type: ApiConstants.API_START_CONFIRM,
        payload
    };
    return action;
}
function sendConfirmDetails(payload){
    const action = {
        type: ApiConstants.API_SEND_CONFIRM_DETAILS,
        payload
    };
    return action;
}

function declineConfirmDetails(payload){
    const action = {
        type: ApiConstants.API_DECLINE_CONFIRM_DETAILS,
        payload
    };
    return action;
}



export{
    getUserRegistrationUserInfoAction,
    selectParticipantAction,
    updateUserRegistrationObjectAction,
    getParticipantInfoById,
    saveParticipantInfo,
    membershipProductEndUserRegistrationAction,
    updateParticipantCompetitionAction,
    updateUserRegistrationStateVarAction,
    updateParticipantAdditionalInfoAction,
    orgRegistrationRegSettingsEndUserRegAction,
    registrationExpiryCheckAction,
    getSeasonalAndCasualFees,
    stopStepNavigation,
    startStepNavigation,
    lookForExistingUser,
    sendDigitCode,
    cancelSend,
    checkDigitCode,
    doneCheckDigitCode,
    sendConfirmDetails,
    startConfirm,
    declineConfirmDetails,
}
