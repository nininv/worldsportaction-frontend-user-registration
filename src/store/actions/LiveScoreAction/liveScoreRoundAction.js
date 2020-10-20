import ApiConstants from "../../../themes/apiConstants";


function liveScoreRoundListAction(competitionID, division, teamId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_ROUND_LIST_LOAD,
        competitionID,
        division,
        teamId
    };
    return action;
}

function liveScoreCreateRoundAction(roundName, sequence, competitionID, divisionId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CREATE_ROUND_LOAD,
        roundName: roundName,
        sequence: sequence,
        competitionID: competitionID,
        divisionId: divisionId
    };
    return action;
}

function clearRoundData(key) {
    const action = {
        type: ApiConstants.API_CLEAR_ROUND_DATA,
        key
    }
    return action
}

export {
    liveScoreRoundListAction,
    liveScoreCreateRoundAction,
    clearRoundData
} 
