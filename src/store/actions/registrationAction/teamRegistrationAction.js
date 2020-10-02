import ApiConstants from "../../../themes/apiConstants";

function membershipProductTeamRegistrationAction(payload) {
    console.log("action");
    const action = {
        type: ApiConstants.API_MEMBERSHIP_PRODUCT_TEAM_REG_LOAD,
        payload: payload
    };
    return action;
}

function selectTeamAction() {
    const action = {
        type: ApiConstants.SELECT_TEAM
    }
    return action;
}

function updateTeamRegistrationObjectAction(data,key){
    const action = {
        type: ApiConstants.UPDATE_TEAM_REGISTRATION_OBJECT,
        data: data,
        key: key
    }
    return action;
}

function updateTeamRegistrationStateVarAction(data,key){
    const action = {
        type: ApiConstants.UPDATE_TEAM_REGISTRATION_STATE_VAR,
        data: data,
        key: key
    }
    return action;
}

function updateRegistrationTeamMemberAction(data,key,index,subIndex){
    const action = {
        type: ApiConstants.UPDATE_REGISTRATION_TEAM_MEMBER_ACTION,
        data: data,
        key: key,
        index: index,
        subIndex: subIndex
    }
    return action;
}

function orgteamRegistrationRegSettingsAction(payload){
    const action = {
        type: ApiConstants.API_ORG_TEAM_REGISTRATION_SETTINGS_LOAD,
        payload: payload
    };
    return action;
}

function saveTeamInfoAction(payload) {
    const action = {
        type: ApiConstants.API_SAVE_TEAM_LOAD,
        payload: payload
    };
    return action;
}

function updateTeamAdditionalInfoAction(key,data){
    const action = {
        type: ApiConstants.UPDATE_TEAM_ADDITIONAL_INFO,
        key: key,
        data: data
    };
    return action;
}

function getTeamInfoById(participantKey,registrarionKey) {
    const action = {
        type: ApiConstants.API_GET_TEAM_BY_ID_LOAD,
        participantKey: participantKey,
        registrationKey: registrarionKey
    };
    return action;
}


export{
    membershipProductTeamRegistrationAction,
    selectTeamAction,
    updateTeamRegistrationObjectAction,
    updateTeamRegistrationStateVarAction,
    updateRegistrationTeamMemberAction,
    orgteamRegistrationRegSettingsAction,
    saveTeamInfoAction,
    updateTeamAdditionalInfoAction,
    getTeamInfoById
}