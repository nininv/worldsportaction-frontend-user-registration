import ApiConstants from "../../../themes/apiConstants";

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

function teamInviteRegSettingsAction(payload){
    const action = {
        type: ApiConstants.API_TEAM_INVITE_REG_SETTINGS_LOAD,
        payload: payload
    };
    return action;
}

function getTeamInviteReviewAction(payload){
    const action = {
        type: ApiConstants.API_GET_TEAM_INVITE_REVIEW_LOAD,
        payload: payload
    }

    return action;
}


function saveTeamInviteReviewAction(payload){
    const action = {
        type: ApiConstants.API_SAVE_TEAM_INVITE_REVIEW_LOAD,
        payload: payload
    }

    return action;
}

function updateTeamInviteAction(value, key, index, subkey, subIndex){
    const action = {
        type: ApiConstants.UPDATE_TEAM_REVIEW_INFO,
        value: value,
        key: key,
        index: index,
        subKey: subkey,
        subIndex: subIndex
    }

    return action;
}

function deleteTeamInivteProductAction(payload){
    const action = {
        type: ApiConstants.API_DELETE_TEAM_INVITE_PRODUCT_LOAD,
        payload: payload
    }

    return action;
}


export{
    getTeamRegistrationInviteAction,
    updateInviteMemberInfoAction,
    saveInviteMemberInfoAction,
    teamInviteRegSettingsAction,
    getTeamInviteReviewAction,
    saveTeamInviteReviewAction,
    updateTeamInviteAction,
    deleteTeamInivteProductAction
}