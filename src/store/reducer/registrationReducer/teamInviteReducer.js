import ApiConstants from "../../../themes/apiConstants";
import { feeIsNull, formatValue } from "../../../util/helpers";

const initialState = {
    iniviteMemberInfo: null,
    inviteMemberDeregisterErrorMsg: null,
    inviteOnLoad: false,
    inviteMemberRegSettings: null,
    inviteMemberSaveOnLoad: false,
    teamInviteProductsInfo: null,
    teamInviteProductsOnLoad: false,
    onTeamInviteReviewLoad: false,
    teamInviteReviewList: null,
    status: null,
    registrationId: null,
    shopPickupAddresses: null,
    participantAddresses: [],
    deliveryOrBillingAddressSelected: false,
    teamInviteCount: null
}

function updateInviteMemberInfo(iniviteMemberInfoTemp){
    try{
        let userRegDetails = iniviteMemberInfoTemp.userRegDetails;
        userRegDetails.referParentEmail = !!userRegDetails.isInActive;
        let registererAddress = userRegDetails.street1 + userRegDetails.street2 + userRegDetails.suburb + userRegDetails.postalCode + userRegDetails.stateRefId + userRegDetails.countryRefId;
        if(userRegDetails.parentOrGaurdianDetails){
            for(let parent of userRegDetails.parentOrGaurdianDetails){
                let parentAddress = parent.street1 + parent.street2 + parent.suburb + parent.postalCode + parent.stateRefId + parent.countryRefId;
                if(parent.stateRefId){
                    if(registererAddress === parentAddress){
                        parent["isSameAddress"] = true;
                        parent["searchAddressFlag"] = false;
                        parent["manualEnterAddressFlag"] = false;
                    }else{
                        parent["isSameAddress"] = false;
                        parent["searchAddressFlag"] = true;
                        parent["manualEnterAddressFlag"] = false;
                    }
                }else{
                    parent["isSameAddress"] = false;
                    parent["searchAddressFlag"] = true;
                    parent["manualEnterAddressFlag"] = false;
                }
            }
        }
        return iniviteMemberInfoTemp;
    }catch(ex){
        console.log("Error in updateInviteMemberInfo::"+ex)
    }
}

function teamInviteReducer(state = initialState, action){
    switch(action.type){
        case ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_LOAD:
            return {...state,inviteOnLoad: true}

        case ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_SUCCESS:
            let iniviteMemberInfoTemp = action.result;
            if(action.status == 1){
                state.iniviteMemberInfo = updateInviteMemberInfo(iniviteMemberInfoTemp);
            }else{
                state.inviteMemberDeregisterErrorMsg = iniviteMemberInfoTemp;
            }
            return {
              ...state,
              status: action.status,
              inviteOnLoad: false,
            };

        case ApiConstants.UPDATE_INVITE_MEMBER_INFO_ACTION:
            let inviteMemberInfoData = action.data;
            let inviteMemberInfoKey = action.key;
            let inviteMemberInfoSubKey= action.subKey;
            let inviteMemberInfoParentIndex = action.parentIndex;
            if(state.iniviteMemberInfo.userRegDetails.referParentEmail){
                state.iniviteMemberInfo.userRegDetails.email = null;
            }
            if(inviteMemberInfoSubKey == "userRegDetails"){
                if(inviteMemberInfoKey == "isYearsPlayed"){
                    if(inviteMemberInfoData == 1){
                        state.iniviteMemberInfo.userRegDetails.yearsPlayed = '2';
                    }
                }
                state.iniviteMemberInfo.userRegDetails[inviteMemberInfoKey] = inviteMemberInfoData;
            }else if(inviteMemberInfoSubKey == "parentOrGaurdianDetails"){
                state.iniviteMemberInfo.userRegDetails[inviteMemberInfoSubKey][inviteMemberInfoParentIndex][inviteMemberInfoKey] = inviteMemberInfoData;
            }else if(inviteMemberInfoKey == "inviteMemberInfo"){
                state.iniviteMemberInfo = inviteMemberInfoData;
            }else if(inviteMemberInfoSubKey == "walkingNetball"){
                state.iniviteMemberInfo.userRegDetails.walkingNetball = state.iniviteMemberInfo.userRegDetails.walkingNetball == null ? {} : state.iniviteMemberInfo.userRegDetails.walkingNetball;
                state.iniviteMemberInfo.userRegDetails.walkingNetball[inviteMemberInfoKey] = inviteMemberInfoData;
            }
            return{
              ...state
            }

        case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD:
            return { ...state, inviteMemberSaveOnLoad: true };

        case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_SUCCESS:
            return {
                ...state,
                teamInviteCount: action.result.teamInviteCount,
                inviteMemberSaveOnLoad: false,
                status: action.status
            };

        case ApiConstants.API_TEAM_INVITE_REG_SETTINGS_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_TEAM_INVITE_REG_SETTINGS_SUCCESS:
            let registrationSettings = action.result;
            return {
                ...state,
                onLoad: false,
                inviteMemberRegSettings: registrationSettings,
                status: action.status
            };

        case ApiConstants.API_GET_TEAM_INVITE_REVIEW_LOAD:
            return { ...state, teamInviteProductsOnLoad: true };

        case ApiConstants.API_GET_TEAM_INVITE_REVIEW_SUCCESS:
            let teamInviteReviewList = action.result;
            state.registrationId = teamInviteReviewList ? teamInviteReviewList.registrationId : null;
            console.log("state.registrationId ",state.registrationId )
            return {
                ...state,
                teamInviteProductsOnLoad: false,
                status: action.status,
                teamInviteReviewList: teamInviteReviewList
            };

        case ApiConstants.API_GET_REGISTRATION_SHOP_PICKUP_ADDRESS_SUCCESS:
            let shopPickupAddresses = action.result;
            return {
                ...state,
                status: action.status,
                shopPickupAddresses: shopPickupAddresses
            };

        case ApiConstants.API_SAVE_TEAM_INVITE_REVIEW_LOAD:
            return { ...state, onTeamInviteReviewLoad: true };

        case ApiConstants.API_SAVE_TEAM_INVITE_REVIEW_SUCCESS:
            let teamInviteSaveData = action.result.response;
            return {
                ...state,
                onTeamInviteReviewLoad: false,
                status: action.status,
                teamInviteReviewList: teamInviteSaveData
            };

        case ApiConstants.API_GET_REGISTRATION_PARTICIPANT_ADDRESS_SUCCESS:
            let participantAddresses = action.result;
            return {
                ...state,
                onLoad: false,
                status: action.status,
                participantAddresses: participantAddresses
            };

        case ApiConstants.UPDATE_TEAM_REVIEW_INFO:
            let reviewData = state.teamInviteReviewList;
            if(action.subKey == "charity"){
                reviewData[action.key] = action.value;
            }
            else if(action.subKey == "selectedOptions"){
                if(action.key == "paymentOptionRefId"){
                    reviewData["compParticipants"][action.index][action.subKey][action.key] = action.value;
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
            else if(action.subKey == "shopProducts"){
                if(action.key == "addShopProduct"){
                    console.log("action.value", action.value);
                    let sameProduct = reviewData[action.subKey].find(x => x.productId == action.value.productId && x.variantOptionId == action.value.variantOptionId);
                    if(sameProduct){
                        let index = reviewData[action.subKey].indexOf(sameProduct);
                        reviewData[action.subKey].splice(index,1);
                    }
                    reviewData[action.subKey].push(action.value);
                    if(!sameProduct){
                        reviewData["total"]["subTotal"] = (feeIsNull(reviewData["total"]["subTotal"]) +
                        feeIsNull(action.value.amount)).toFixed(2);
                        reviewData["total"]["gst"] = (feeIsNull(reviewData["total"]["gst"]) +
                                                feeIsNull(action.value.tax)).toFixed(2);
                        reviewData["total"]["targetValue"] = (feeIsNull(reviewData["total"]["targetValue"]) +
                        feeIsNull(action.value.amount)+  feeIsNull(action.value.tax)).toFixed(2);

                        reviewData["total"]["total"] = (feeIsNull(reviewData["total"]["total"]) +
                        feeIsNull(action.value.amount) + feeIsNull(action.value.tax)).toFixed(2);
                    }
                }
                else if(action.key == "removeShopProduct"){
                    let shopData = reviewData[action.subKey][action.index];
                    reviewData["total"]["subTotal"] = (feeIsNull(reviewData["total"]["subTotal"]) -
                                                feeIsNull(shopData.amount)).toFixed(2);
                    reviewData["total"]["gst"] = (feeIsNull(reviewData["total"]["gst"]) -
                                        feeIsNull(shopData.tax)).toFixed(2);
                    reviewData["total"]["targetValue"] = (feeIsNull(reviewData["total"]["targetValue"]) -
                    feeIsNull(shopData.amount) -  feeIsNull(shopData.tax)).toFixed(2);

                    reviewData["total"]["total"] = (feeIsNull(reviewData["total"]["total"]) -
                    feeIsNull(shopData.amount) - feeIsNull(shopData.tax)).toFixed(2);

                    reviewData[action.subKey].splice(action.index,1);
                }

                console.log("reviewData", reviewData);
            }
            // else if(action.subKey == "yourInfo"){
            //     if(action.key == "email"){
            //         setYourInfo(action,state);
            //     }else{
            //         reviewData[action.subKey][action.key] = action.value
            //     }
            // }
            // else if(action.subKey == "shippingOptions"){
            //     let organisationId = action.value;
            //     reviewData.shippingOptions = reviewData.shippingOptions ? reviewData.shippingOptions : [];
            //     let pickupAddress = state.shopPickupAddresses.find(x => x.organisationId === organisationId);
            //     if(action.key == "add"){
            //         reviewData.shippingOptions.push(pickupAddress);
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
            }
            else if(action.subKey == "total"){
                console.log("***********************************" + action.key)
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
                    console.log("TransVal" + transactionVal);
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

        default:
            return state;
    }
}

export default teamInviteReducer;
