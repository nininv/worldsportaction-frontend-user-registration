import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";


const initialState = {
    onLoad: false,
    onRegReviewLoad: false,
    registrationReviewList: null,
    termsAndConditions: []
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
                    reviewData["compParticipants"][action.index][action.subKey]["discountCodes"].push(obj)
                }
                else if(action.key == "removeDiscount"){
                    reviewData["compParticipants"][action.index][action.subKey]["discountCodes"].splice(action.subIndex, 1);
                }
                else if(action.key == "discountCode"){
                    reviewData["compParticipants"][action.index][action.subKey]["discountCodes"][action.subIndex][action.key] = action.value;
                }
                else if(action.key =="addVoucher"){
                    let obj = {
                        governmentVoucherRefId: null,
                        voucherCode: null,
                        balance: 0,
                        isValid: null,
                        message: null
                    }

                    reviewData["compParticipants"][action.index][action.subKey]["selectedGovernmentVouchers"].push(obj);
                }
                else if(action.key == "voucherCode" || action.key == "governmentVoucherRefId"){
                    reviewData["compParticipants"][action.index][action.subKey]["selectedGovernmentVouchers"][action.subIndex][action.key] = action.value;
                }
                else if (action.key == "removeVoucher"){
                    reviewData["compParticipants"][action.index][action.subKey]["selectedGovernmentVouchers"].splice(action.subIndex, 1);
                }
                else {
                    reviewData["compParticipants"][action.index][action.subKey][action.key] = action.value;
                }
               
            }
            else if (action.subKey == "volunteerInfo"){
                reviewData[action.subKey][action.index][action.key] = action.value;
            }
            return {
                ...state,
                error: null
            }

        case ApiConstants.API_DELETE_REGISTRATION_PRODUCT_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_DELETE_REGISTRATION_PRODUCT_SUCCESS:
            let regReviewDeleteData = action.result;
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status,
                registrationReviewList: regReviewDeleteData
            };

        case ApiConstants.API_DELETE_REGISTRATION_PARTICIPANT_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_DELETE_REGISTRATION_PARTICIPANT_SUCCESS:
            let regReviewUpdatedData = action.result;
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status,
                registrationReviewList: regReviewUpdatedData
            };

        case ApiConstants.API_GET_TERMS_AND_CONDITION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_GET_TERMS_AND_CONDITION_SUCCESS:
            let termsAndConditionsData = action.result;
            console.log("termsAndConditionsData",termsAndConditionsData);
            return {
                ...state,
                onLoad: false,
                status: action.status,
                termsAndConditions:  termsAndConditionsData
            }; 
        default:
            return state;
    }
}

export default registrationProductsReducer;