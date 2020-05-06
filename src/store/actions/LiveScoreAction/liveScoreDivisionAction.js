
import ApiConstants from "../../../themes/apiConstants";

//Banners action
function getLiveScoreDivisionList(competitionID, compKey) {

    const action = {
        type: ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD,
        competitionID: competitionID,
        compKey : compKey
    };
  
    return action;
}
//liveScoreUpdateDivisionAction
function liveScoreUpdateDivisionAction(data, key, contentType) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_UPDATE_DIVISION,
        data: data,
        key: key,
        contentType: contentType
    }
    console.log(action, "action")
    return action
}
//createDivisionAction
function createDivisionAction(name, divisionName, gradeName, competitionId, divisionId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_LOAD,
        name: name,
        divisionName: divisionName,
        gradeName: gradeName,
        competitionId: competitionId,
        divisionId: divisionId
    }
    return action
}
//liveScoreDeleteDivision
function liveScoreDeleteDivision(divisionId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_DELETE_DIVISION_LOAD,
        divisionId: divisionId,
    };

    return action;
}

function liveScoreDivisionImportAction(data) {
    return {
        type: ApiConstants.API_LIVE_SCORE_DIVISION_IMPORT_LOAD,
        payload: data
    }
}

export {
    getLiveScoreDivisionList,
    liveScoreUpdateDivisionAction,
    createDivisionAction,
    liveScoreDeleteDivision,
    liveScoreDivisionImportAction

};
