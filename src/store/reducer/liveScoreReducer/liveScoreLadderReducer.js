import ApiConstants from '../../../themes/apiConstants'
import { isArrayNotEmpty } from '../../../util/helpers';

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    liveScoreLadderDivisionData: [],
    liveScoreLadderListData: [],
    liveScoreLadderAdjData: [],
    teamResult: [],
};

function createLadderRank(array) {
    for (let i in array) {
        array[i]["rank"] = JSON.parse(i) + 1
    }
    return array
}


function createLadderAdjustments(array) {
    let adjArr = [];
    array.map((x, index) => {
        if (isArrayNotEmpty(x.adjustments)) {
            adjArr = [...adjArr, ...x.adjustments];
        }
    })

    return adjArr;
}



function liveScoreLaddersReducer(state = initialState, action) {

    switch (action.type) {

        //LIVESCORE DIVISION LIST
        case ApiConstants.API_LIVE_SCORE_DIVISION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_DIVISION_SUCCESS:
            let divisionDatafromAction = action.divisionList
            let ladderList = action.ladderList ? action.ladderList : []
            let ladderAdjList = createLadderAdjustments(ladderList);

            return {
                ...state,
                onLoad: false,
                liveScoreLadderDivisionData: divisionDatafromAction,
                liveScoreLadderListData: ladderList,
                liveScoreLadderAdjData: ladderAdjList
                // status: action.status
            };


        /// ONLY LADDER
        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD:
            return {
                ...state,
                onLoad: true
            };

        case ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                liveScoreLadderDivisionData: action.result,
                status: action.status
            };



        //LIVESCORE LADDER LIST

        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD:
            return { ...state, onLoad: true };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_SUCCESS:

            let ladder_List = createLadderRank(action.result)
            let ladderAdjustmentList = createLadderAdjustments(action.result);
            return {
                ...state,
                onLoad: false,
                liveScoreLadderListData: ladder_List,
                liveScoreLadderAdjData: ladderAdjustmentList
            };

        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_LIVE_SCORE_LADDERS_LIST_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_LIVE_SCORE_CLEAR_LADDER:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                liveScoreLadderListData: []
            }

        case ApiConstants.API_LIVE_SCORE_TEAM_LOAD:

            return { ...state, };

        case ApiConstants.API_LIVE_SCORE_TEAM_SUCCESS:
            return {
                ...state,
                onLoad: false,
                teamResult: action.result,
            };

        default:
            return state;
    };

}

export default liveScoreLaddersReducer;