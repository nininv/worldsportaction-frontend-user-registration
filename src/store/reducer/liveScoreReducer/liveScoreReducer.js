import ApiConstants from "../../../themes/apiConstants";
import liveScoreModal from '../../objectModel/liveScoreMatchModal'

const initialState = {
    onLoad: false,
    error: null,
    divisionList: [],
    status: 0,
    liveScoreMatchListData: [],
    teamResult: [],
    roundResult: [],
    checkInitState: {
        isDivision: false,
        isTeam: false,
        isRound: false,
        isLadder: false
    },
    scorerListResult: []
};
function LiveScoreState(state = initialState, action) {

    switch (action.type) {
        case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:

            return {
                ...state,
                onLoad: false,
                divisionList: action.divisionList ? action.divisionList : [],
                teamResult: action.teamResult,
                roundResult: action.roundResult,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_CREATE_ROUND_SUCCESS:
            // state.roundResult.push(action.result)
            return {
                ...state,
                onLoad: false,
                // result: action.result,
                // status: action.status
            };

        //// scorer list
        case ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_GET_SCORER_LIST_SUCCESS:

            return {
                ...state,
                onLoad: false,
                scorerListResult: action.result
            };


        default:
            return state;
    }
}

export default LiveScoreState;
