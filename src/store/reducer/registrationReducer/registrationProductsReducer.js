import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";


const initialState = {
    onLoad: false,
	onRegReviewLoad: false
}

function registrationProductsReducer(state = initialState, action){
    switch(action.type){
        case ApiConstants.API_GET_REGISTRATION_REVIEW_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_GET_REGISTRATION_REVIEW_SUCCESS:
           let regReviewData = action.result;
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status,
                registrationReviewList: regReviewData
            };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_SUCCESS:
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status
            };
    
        case ApiConstants.UPDATE_REVIEW_INFO:
            let reviewData = state.registrationReviewList;
            
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}

export default registrationProductsReducer;