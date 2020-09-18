import ApiConstants from "../../../themes/apiConstants";


function fixtureCompetitionListAction(orgId, yearId) {
    const action = {
        type: ApiConstants.API_LIVE_SCORE_GET_FIXTURE_COMP_LOAD,
        orgId,
        yearId
    };

    return action;
}



export {
    fixtureCompetitionListAction
} 
