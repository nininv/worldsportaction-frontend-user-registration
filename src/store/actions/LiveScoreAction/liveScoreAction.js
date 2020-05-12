import ApiConstants from "../../../themes/apiConstants";

function liveScorePlayerListAction(competitionID) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_PLAYER_LIST_LOAD,
        competitionID: competitionID
    };

    return action;
}

function getliveScoreScorerList(competitionId, roleId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_LOAD,
        competitionId,
        roleId,

    };

    return action;
}



export {
    liveScorePlayerListAction,
    getliveScoreScorerList
} 
