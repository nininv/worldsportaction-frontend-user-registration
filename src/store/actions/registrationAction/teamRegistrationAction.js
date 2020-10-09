import ApiConstants from "../../../themes/apiConstants";

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

function getExistingTeamInfoById(existingTeamParticipatKey){
    const action = {
        type: ApiConstants.API_GET_EXISTING_TEAM_BY_ID_LOAD,
        participantKey: existingTeamParticipatKey
    };
    return action;
}

function membershipProductTeamRegistrationAction(payload){
    const action = {
        type: ApiConstants.API_MEMBERSHIP_PRODUCT_TEAM_REG_LOAD,
        payload: payload
    };
    return action;
}

function teamRegistrationExpiryCheckAction(payload){
    const action = {
        type: ApiConstants.API_EXPIRED_TEAM_REGISTRATION_LOAD,
        payload: payload
    }
    return action;
}

function getTeamRegistrationInviteAction(payload){
    const action = {
        type: ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_LOAD,
        payload: payload
    }
    return action;
}

function updateInviteMemberInfoAction(data,key,subKey,parentIndex){
    const action = {
        type: ApiConstants.UPDATE_INVITE_MEMBER_INFO_ACTION,
        data: data,
        key: key,
        subKey: subKey,
        parentIndex: parentIndex
    }
    return action;
}

function saveInviteMemberInfoAction(payload){
    const action = {
        type: ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD,
        payload: payload
    }
    return action;
}


export{
    selectTeamAction,
    updateTeamRegistrationObjectAction,
    updateTeamRegistrationStateVarAction,
    updateRegistrationTeamMemberAction,
    orgteamRegistrationRegSettingsAction,
    saveTeamInfoAction,
    updateTeamAdditionalInfoAction,
    getTeamInfoById,
    getExistingTeamInfoById,
    membershipProductTeamRegistrationAction,
    teamRegistrationExpiryCheckAction,
    getTeamRegistrationInviteAction,
    updateInviteMemberInfoAction,
    saveInviteMemberInfoAction
}