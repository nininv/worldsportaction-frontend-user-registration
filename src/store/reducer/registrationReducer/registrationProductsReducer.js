import { message } from "antd";
import ApiConstants from "../../../themes/apiConstants";
import { feeIsNull, formatValue } from "../../../util/helpers";


const initialState = {
    onLoad: false,
    onRegReviewLoad: false,
    registrationReviewList: null,
    termsAndConditions: [],
    shopProductList: [],
    shopProductsTotalCount: 1,
    shopProductsPage: 1,
    shopProductsTypes: [],
    participantUsers: [],
    participantAddresses: [],
    shopPickupAddresses: [],
    pickupAddressLoad: false,
    // deliveryOrBillingAddressSelected: false,
    deleteOnLoad: false,
    singlePaymentData: null
}

function setYourInfo(action,state){
    try{
        //let email = action.value;
        let yourInfo = state.registrationReviewList.yourInfo;
        //let user = state.participantUsers.find(x => x.email === email);
        let user = state.participantUsers[action.value]
        if(user != undefined){
            yourInfo["userId"] = user.id;
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
        }else{
            //yourInfo["email"] = action.value;
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
            // let govtVoucherFlag = action.govtVoucherFlag;
            // let compParticipants = regReviewSaveData.compParticipants
            // if(govtVoucherFlag){
            //     for(let participant of compParticipants){
            //         let vouchers = participant.selectedOptions.vouchers
            //         for(let voucher of vouchers){
            //             if(voucher.isValid == 0){
            //                 message.error(voucher.message)
            //             }
            //         }
            //     }
            // }
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
                        redeemAmount: 0,
                        remainingAmount: 0,
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
                    let sameProduct = reviewData[action.subKey].find(x => x.productId == action.value.productId && x.variantOptionId == action.value.variantOptionId);
                    if(sameProduct){
                        let index = reviewData[action.subKey].indexOf(sameProduct);
                        reviewData[action.subKey].splice(index,1);
                    }
                    reviewData[action.subKey].push(action.value);
                    reviewData["total"]["subTotal"] = feeIsNull(reviewData["total"]["subTotal"]) +
                                            feeIsNull(action.value.amount);
                    reviewData["total"]["gst"] = feeIsNull(reviewData["total"]["gst"]) +
                                            feeIsNull(action.value.tax);
                    console.log("total amount",reviewData["total"]["total"],action.value.amount,action.value.tax)
                    let total = feeIsNull(reviewData["total"]["total"]) +
                    feeIsNull(action.value.amount)+  feeIsNull(action.value.tax);
                    reviewData["total"]["total"] = total.toFixed(2);

                                            
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
                if(action.key == "emailSelection"){
                    setYourInfo(action,state);
                }else{
                    reviewData[action.subKey][action.key] = action.value
                }   
            }
            // else if(action.subKey == "shippingOptions"){
            //     let organisationId = action.value;
            //     reviewData.shippingOptions = reviewData.shippingOptions ? reviewData.shippingOptions : [];
            //     let pickupAddress = state.shopPickupAddresses.find(x => x.organisationId === organisationId);
            //     if(action.key == "add"){
            //        reviewData.shippingOptions.push(pickupAddress);
            //     }else if(action.key == "remove"){
            //         let index = reviewData.shippingOptions.indexOf(pickupAddress);
            //         reviewData.shippingOptions.splice(index,1);
            //     }
            // }
            else if(action.subKey == "deliveryAddress" || action.subKey == "billingAddress"){
                let index = action.index;
                reviewData[action.subKey]["street1"] = state.participantAddresses[index].street1;
                reviewData[action.subKey]["street2"] = state.participantAddresses[index].steet2;
                reviewData[action.subKey]["suburb"] = state.participantAddresses[index].suburb;
                reviewData[action.subKey]["postalCode"] = state.participantAddresses[index].postalCode;
                reviewData[action.subKey]["stateRefId"] = state.participantAddresses[index].stateRefId;
                reviewData[action.subKey]["countryRefId"] = state.participantAddresses[index].countryRefId;
                // state.deliveryOrBillingAddressSelected = true;
            }else if(action.subKey == "enterManualBillingAddress"){
                reviewData["billingAddress"][action.key] = action.value;
            }else if(action.subKey == "enterManualDeliveryAddress"){
                reviewData["deliveryAddress"][action.key] = action.value;
            }else if(action.subKey == "total"){
                // console.log("***********************************" + action.key)
                let type = action.key;
                let totalVal = reviewData.total.total; 
                console.log("totalVal" + totalVal);
                let transactionVal = 0;
                let targetVal = 0;
                if(action.value == 1){
                    if(type == "International_CC"){
                        transactionVal = (totalVal * 3.0/100) + 0.30;
                    }
                    if(type == "International_AE"){
                        transactionVal = (totalVal * 2.7/100) + 0.30;
                    }
                    else if(type == "DOMESTIC_CC"){
                        transactionVal = (totalVal * 2.25/100)  + 0.30;
                    }
                    else if(type == "direct_debit"){
                        transactionVal = (totalVal * 1.5/100) + 0.30;
                        console.log("transactionVal DD" + transactionVal);
                        if(transactionVal > 3.50){
                            transactionVal = 3.50;
                        }
                    }
                    console.log("TransVal" + feeIsNull(transactionVal));
                    targetVal = feeIsNull(transactionVal) + feeIsNull(totalVal);
                    reviewData["total"]["targetValue"] = formatValue(targetVal);
                    reviewData["total"]["transactionFee"] = formatValue(transactionVal);
                }
                else{
                    reviewData["total"]["targetValue"] = "0.00";
                    reviewData["total"]["transactionFee"] = "0.00";
                }
               
            }
            return {
                ...state,
                error: null
            }

        case ApiConstants.API_DELETE_REGISTRATION_PRODUCT_LOAD:
            return { ...state, deleteOnLoad: true };

        case ApiConstants.API_DELETE_REGISTRATION_PRODUCT_SUCCESS:
            let regReviewDeleteData = action.result;
            return {
                ...state,
                deleteOnLoad: false,
                status: action.status,
                registrationReviewList: regReviewDeleteData
            };

        case ApiConstants.API_DELETE_REGISTRATION_PARTICIPANT_LOAD:
            return { ...state, deleteOnLoad: true };

        case ApiConstants.API_DELETE_REGISTRATION_PARTICIPANT_SUCCESS:
            let regReviewUpdatedData = action.result;
            return {
                ...state,
                deleteOnLoad: false,
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

            case ApiConstants.API_GET_REGISTRATION_PARTICIPANT_ADDRESS_LOAD:
                return { ...state, onLoad: true };
        
            case ApiConstants.API_GET_REGISTRATION_PARTICIPANT_ADDRESS_SUCCESS:
                let participantAddresses = action.result;
                return {
                    ...state,
                    onLoad: false,
                    status: action.status,
                    participantAddresses: participantAddresses
                };

            case ApiConstants.API_GET_REGISTRATION_SHOP_PICKUP_ADDRESS_LOAD:
                return { ...state, pickupAddressLoad: true };
        
            case ApiConstants.API_GET_REGISTRATION_SHOP_PICKUP_ADDRESS_SUCCESS:
                let shopPickupAddresses = action.result;
                return {
                    ...state,
                    pickupAddressLoad: false,
                    status: action.status,
                    shopPickupAddresses: shopPickupAddresses
                };

            case ApiConstants.API_GET_REGISTRATION_SINGLE_GAME_LOAD:
                return { ...state, onLoad: true };
        
            case ApiConstants.API_GET_REGISTRATION_SINGLE_GAME_SUCCESS:
                let singlePaymentData = action.result;
                return {
                    ...state,
                    onLoad: false,
                    status: action.status,
                    singlePaymentData: singlePaymentData
                };

            case ApiConstants.UPDATE_SINGLE_FEE:
                let singleGameData = state.singlePaymentData;
                
                if(action.subKey == "total"){
                    let type = action.key;
                    if(type == "noOfMatch"){
                        let existingVal = singleGameData[action.subKey][type];
                        let gst =  feeIsNull(singleGameData[action.subKey]["gst"]) / existingVal;
                        let total = feeIsNull(singleGameData[action.subKey]["total"]) / existingVal;
                        let subTotal = feeIsNull(singleGameData[action.subKey]["subTotal"]) / existingVal;
                        let targetValue = feeIsNull(singleGameData[action.subKey]["targetValue"]) / existingVal;
                        let charityValue = feeIsNull(singleGameData[action.subKey]["charityValue"]) / existingVal;
                        let transactionFee = feeIsNull(singleGameData[action.subKey]["transactionFee"]) / existingVal;

                        if(action.subIndex == "increment"){
                            singleGameData[action.subKey][type] = Number(action.value) + 1;
                        }
                        else if(action.subIndex == "decrement"){
                            if(action.value == 1){
                                singleGameData[action.subKey][type] = action.value;
                            }
                            else{
                                singleGameData[action.subKey][type] = Number(action.value) - 1; 
                            }
                        }
                        else{
                            singleGameData[action.subKey][type] = action.value;
                        }
                        let newVal = singleGameData[action.subKey][type];
                        singleGameData[action.subKey]["gst"] = formatValue(gst * newVal);
                        singleGameData[action.subKey]["total"] = formatValue(total * newVal);
                        singleGameData[action.subKey]["subTotal"] = formatValue(subTotal * newVal);
                        singleGameData[action.subKey]["targetValue"] = formatValue(targetValue * newVal);
                        singleGameData[action.subKey]["charityValue"] = formatValue(charityValue * newVal);
                        singleGameData[action.subKey]["transactionFee"] = formatValue(transactionFee * newVal);

                        (singleGameData.compParticipants).map((item) =>{
                            (item.membershipProducts).map((mem) =>{
                                let oldVal = feeIsNull(mem.feesToPay) / existingVal;
                                mem["feesToPay"] = formatValue(feeIsNull(oldVal) * newVal);
                            })
                        });
                    }
                    else{
                        let totalVal = singleGameData.total.total; 
                        console.log("totalVal" + totalVal);
                        let transactionVal = 0;
                        let targetVal = 0;
                        if(action.value == 1){
                            if(type == "International_CC"){
                                transactionVal = (totalVal * 3.0/100) + 0.30;
                            }
                            if(type == "International_AE"){
                                transactionVal = (totalVal * 2.7/100) + 0.30;
                            }
                            else if(type == "DOMESTIC_CC"){
                                transactionVal = (totalVal * 2.25/100)  + 0.30;
                            }
                            
                            targetVal = feeIsNull(transactionVal) + feeIsNull(totalVal);
                            singleGameData["total"]["targetValue"] = formatValue(targetVal);
                            singleGameData["total"]["transactionFee"] = formatValue(transactionVal);
                        }
                        else{
                            singleGameData["total"]["targetValue"] = "0.00";
                            singleGameData["total"]["transactionFee"] = "0.00";
                        }
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