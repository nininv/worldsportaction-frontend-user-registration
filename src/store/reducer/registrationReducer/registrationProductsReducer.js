import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";


const initialState = {
    onLoad: false,
    onRegReviewLoad: false,
    registrationReviewList: null
}

function registrationProductsReducer(state = initialState, action){
    switch(action.type){
        case ApiConstants.API_GET_REGISTRATION_REVIEW_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_GET_REGISTRATION_REVIEW_SUCCESS:
           let regReviewData = action.result;
           console.log("regReviewData", regReviewData);
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status,
                registrationReviewList: regReviewData
            };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_SUCCESS:
            let regReviewSaveData = action.result;
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status,
                registrationReviewList: regReviewSaveData
            };
    
        case ApiConstants.UPDATE_REVIEW_INFO:
            let reviewData = state.registrationReviewList;
            if(action.subKey == "charity"){
                reviewData[action.key] = action.value;
            }
            else if(action.subKey == "selectedOptions"){
                if(action.key == "paymentOptionRefId"){
                    reviewData["compParticipants"][action.index][action.subKey][action.key] = action.value;
                }
                else if(action.key == "addDiscount"){
                    let obj = {
                        discountCode: null,
                        typeId: 2,
                        isValid: null
                    }
                    reviewData["compParticipants"][action.index][action.subKey]["selectedDiscounts"].push(obj)
                }
                else if(action.key == "removeDiscount"){
                    reviewData["compParticipants"][action.index][action.subKey]["selectedDiscounts"].splice(action.subIndex, 1);
                }
                else if(action.key == "discountCode"){
                    reviewData["compParticipants"][action.index][action.subKey]["selectedDiscounts"][action.subIndex][action.key] = action.value;
                }
            }
            
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}

export default registrationProductsReducer;