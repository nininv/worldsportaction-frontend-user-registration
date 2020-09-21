import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";
import { feeIsNull } from "../../../util/helpers";


const initialState = {
    onLoad: false,
    onRegReviewLoad: false,
    registrationReviewList: null,
    termsAndConditions: [],
    shopProductList: [],
    shopProductsTotalCount: 1,
    shopProductsPage: 1,
    shopProductsTypes: [],
    participantUsers: []
}

function setYourInfo(action,state){
    try{
        let email = action.value;
        let yourInfo = state.registrationReviewList.yourInfo;
        let user = state.participantUsers.find(x => x.email === email);
        if(user != undefined){
            yourInfo["firstName"] = user.firstName;
            yourInfo["lastName"] = user.lastName;
            yourInfo["mobileNumber"] = user.mobileNumber;
            yourInfo["postalCode"] = user.postalCode;
            yourInfo["email"] = user.email;
            yourInfo["street1"] = user.street1;
            yourInfo["street2"] = user.street2;
            yourInfo["suburb"] = user.suburb;
            yourInfo["stateRefId"] = user.stateRefId;
            yourInfo["countryRefId"] = user.countryRefId;
        }
    }catch(ex){
        console.log("Error in setYourInfo"+ex);
    }
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
            let regReviewSaveData = action.result.response;
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

                    reviewData["compParticipants"][action.index][action.subKey]["vouchers"].push(obj);
                }
                else if(action.key == "voucherCode" || action.key == "governmentVoucherRefId"){
                    reviewData["compParticipants"][action.index][action.subKey]["vouchers"][action.subIndex][action.key] = action.value;
                }
                else if (action.key == "removeVoucher"){
                    reviewData["compParticipants"][action.index][action.subKey]["vouchers"].splice(action.subIndex, 1);
                }
                else {
                    reviewData["compParticipants"][action.index][action.subKey][action.key] = action.value;
                }
               
            }
            else if (action.subKey == "volunteerInfo"){
                reviewData[action.subKey][action.index][action.key] = action.value;
            }
            else if(action.subKey == "shopProducts"){
                if(action.key == "addShopProduct"){
                    console.log("action.value", action.value);
                    reviewData[action.subKey].push(action.value);
                    reviewData["total"]["subTotal"] = feeIsNull(reviewData["total"]["subTotal"]) +
                                            feeIsNull(action.value.amount);
                    reviewData["total"]["gst"] = feeIsNull(reviewData["total"]["gst"]) +
                                            feeIsNull(action.value.tax);
                    reviewData["total"]["targetValue"] = feeIsNull(reviewData["total"]["targetValue"]) +
                    feeIsNull(action.value.amount)+  feeIsNull(action.value.tax);

                                            
                }
                else if(action.key == "removeShopProduct"){
                    let shopData = reviewData[action.subKey][action.index];
                    reviewData["total"]["subTotal"] = feeIsNull(reviewData["total"]["subTotal"]) -
                                                feeIsNull(shopData.amount);
                    reviewData["total"]["gst"] = feeIsNull(reviewData["total"]["gst"]) -
                                        feeIsNull(shopData.tax);
                    reviewData["total"]["targetValue"] = feeIsNull(reviewData["total"]["targetValue"]) -
                    feeIsNull(shopData.amount) -  feeIsNull(shopData.tax);
                    
                    reviewData[action.subKey].splice(action.index,1);
                }
                
                console.log("reviewData", reviewData);
            }
            else if(action.subKey == "yourInfo"){
                if(action.key == "email"){
                    setYourInfo(action,state);
                }else{
                    reviewData[action.subKey][action.key] = action.value
                }   
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
        
            case ApiConstants.API_GET_REGISTRATION_BY_ID_LOAD:
                return { ...state, onRegReviewLoad: true };
        
            case ApiConstants.API_GET_REGISTRATION_BY_ID_SUCCESS:
                let registrationData = action.result;
                return {
                    ...state,
                    onRegReviewLoad: false,
                    status: action.status,
                    registrationReviewList: registrationData
                };

            case ApiConstants.API_GET_REGISTRATION_SHOP_PRODUCTS_LOAD:
                return { ...state, onLoad: true };
        
            case ApiConstants.API_GET_REGISTRATION_SHOP_PRODUCTS_SUCCESS:
                let shopProductData = action.result;
                return {
                    ...state,
                    onLoad: false,
                    status: action.status,
                    shopProductList: shopProductData.products,
                    shopProductsTotalCount: shopProductData.page.totalCount,
                    shopProductsPage: shopProductData.page
                        ? shopProductData.page.currentPage: 1,
                    shopProductsTypes: shopProductData.types
                };
            
            case ApiConstants.API_GET_REGISTRATION_PARTICIPANT_USERS_LOAD:
                return { ...state, onLoad: true };
        
            case ApiConstants.API_GET_REGISTRATION_PARTICIPANT_USERS_SUCCESS:
                let participantUsers = action.result;
                return {
                    ...state,
                    onLoad: false,
                    status: action.status,
                    participantUsers: participantUsers
                };
    
        default:
            return state;
    }
}

export default registrationProductsReducer;