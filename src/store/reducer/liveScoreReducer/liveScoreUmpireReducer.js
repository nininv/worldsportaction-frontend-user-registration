import ApiConstants from "../../../themes/apiConstants";

import { isArrayNotEmpty } from "../../../util/helpers";

const initialState = {
    onLoad: false,
    umpireAvailabilitySchedule: [],
};

function LiveScoreUmpireState(state = initialState, action) {

    switch (action.type) {
        ////umpire availability get
        case ApiConstants.API_LIVE_SCORE_GET_UMPIRE_AVAILABILITY_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_GET_UMPIRE_AVAILABILITY_SUCCESS:
            let umpireAvailabilityData = action.result;
            return {
                ...state,
                onLoad: false,
                umpireAvailabilitySchedule: isArrayNotEmpty(umpireAvailabilityData) ? umpireAvailabilityData : [],
            };

        ////umpire availability save
        case ApiConstants.API_LIVE_SCORE_SAVE_UMPIRE_AVAILABILITY_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_LIVE_SCORE_SAVE_UMPIRE_AVAILABILITY_SUCCESS:
            let umpireAvailabilityUpdatedData = action.result;

            return {
                ...state,
                onLoad: false,
                umpireAvailabilitySchedule: isArrayNotEmpty(umpireAvailabilityUpdatedData) ? umpireAvailabilityUpdatedData : [],
            };


        default:
            return state;
    }
}

export default LiveScoreUmpireState;
