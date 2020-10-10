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

function getInviteTeamReviewProductAction(payload){
    const action = {
        type: ApiConstants.API_GET_INVITE_TEAM_REVIEW_PRODUCT_LOAD,
        payload: payload
    }

    return action;
}

export{
    getTeamRegistrationInviteAction,
    updateInviteMemberInfoAction,
    saveInviteMemberInfoAction,
    teamInviteRegSettingsAction,
    getInviteTeamReviewProductAction,
}