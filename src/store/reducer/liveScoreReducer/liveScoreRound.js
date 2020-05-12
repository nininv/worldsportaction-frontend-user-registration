import ApiConstants from '../../../themes/apiConstants'

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    roundList: []

};

function liveScoreRound(state = initialState, action) {
    switch (action.type) {

        //// Live Score Create Round
    
        case ApiConstants.API_LIVE_SCORE_ROUND_LIST_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_ROUND_LIST_SUCCESS:
           
            return {
                ...state,
                onLoad: false,
                roundList: action.result,
                status: action.status
            };

        case ApiConstants.API_CLEAR_ROUND_DATA:
            if (action.key == 'all') {
                state.roundList = []
                state.divisionList = []
            }
            else {
                state.roundList = []
            }

            return {
                ...state,
            }

        default:
            return state;
    };

}

export default liveScoreRound;
