import ApiConstants from "../../../themes/apiConstants";
import { feeIsNull } from "../../../util/helpers";

const initialState = {
    iniviteMemberInfo: null,
    inviteOnLoad: false,
    inviteMemberRegSettings: null,
    inviteMemberSaveOnLoad: false, 
    teamInviteProductsInfo: null,
    teamInviteProductsOnLoad: false,
    onTeamInviteReviewLoad: false,
    teamInviteReviewList: null,
    status: null,
    registrationId: null,
    shopPickupAddresses: null
}

function teamInviteReducer(state = initialState, action){
    switch(action.type){
        case ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_LOAD: 
            return {...state,inviteOnLoad: true}
          
        case ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_SUCCESS:
            let iniviteMemberInfoTemp = action.result;
            return {
              ...state,
              status: action.status,
              inviteOnLoad: false,
              iniviteMemberInfo : iniviteMemberInfoTemp
            };

        case ApiConstants.UPDATE_INVITE_MEMBER_INFO_ACTION:
            let inviteMemberInfoData = action.data;
            let inviteMemberInfoKey = action.key;
            let inviteMemberInfoSubKey= action.subKey;
            let inviteMemberInfoParentIndex = action.parentIndex;
            if(inviteMemberInfoSubKey == "userRegDetails"){
              state.iniviteMemberInfo.userRegDetails[inviteMemberInfoKey] = inviteMemberInfoData;
            }else if(inviteMemberInfoSubKey == "parentOrGaurdianDetails"){
              state.iniviteMemberInfo.userRegDetails[inviteMemberInfoSubKey][inviteMemberInfoParentIndex][inviteMemberInfoKey] = inviteMemberInfoData;
            }else if(inviteMemberInfoKey == "inviteMemberInfo"){
              state.iniviteMemberInfo = inviteMemberInfoData;
            }
            return{
              ...state
            }

        case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD:
            return { ...state, inviteMemberSaveOnLoad: true };
  
        case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_SUCCESS:
            return {
                ...state,
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
            // else if(action.subKey == "yourInfo"){
            //     if(action.key == "email"){
            //         setYourInfo(action,state);
            //     }else{
            //         reviewData[action.subKey][action.key] = action.value
            //     }   
            // }
            else if(action.subKey == "shippingOptions"){
                let organisationId = action.value;
                reviewData.shippingOptions = reviewData.shippingOptions ? reviewData.shippingOptions : [];
                let pickupAddress = state.shopPickupAddresses.find(x => x.organisationId === organisationId);
                if(action.key == "add"){
                    reviewData.shippingOptions.push(pickupAddress);
                }else if(action.key == "remove"){
                    let index = reviewData.shippingOptions.indexOf(pickupAddress);
                    reviewData.shippingOptions.splice(index,1);
                }
            }else if(action.subKey == "deliveryAddress" || action.subKey == "billingAddress"){
                let index = action.index;
                reviewData[action.subKey]["street1"] = state.participantAddresses[index].street1;
                reviewData[action.subKey]["street2"] = state.participantAddresses[index].steet2;
                reviewData[action.subKey]["suburb"] = state.participantAddresses[index].suburb;
                reviewData[action.subKey]["postalCode"] = state.participantAddresses[index].postalCode;
                reviewData[action.subKey]["stateRefId"] = state.participantAddresses[index].stateRefId;
                reviewData[action.subKey]["countryRefId"] = state.participantAddresses[index].countryRefId;
                state.deliveryOrBillingAddressSelected = true;
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