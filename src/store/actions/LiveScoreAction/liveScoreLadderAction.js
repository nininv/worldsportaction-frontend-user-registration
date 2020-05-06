import ApiConstants from "../../../themes/apiConstants";



function liveScoreLaddersListAction(competitionID, divisionID, compKey) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD,
        competitionID: competitionID,
        divisionID: divisionID,
        compKey:compKey
    };
    return action;
}

function clearLadderList(){
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CLEAR_LADDER,
    };
    return action;
}

export {
    liveScoreLaddersListAction,
    clearLadderList
}