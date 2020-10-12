import ApiConstants from "../../../themes/apiConstants";
import { deepCopyFunction, getAge, isNullOrEmptyString} from '../../../util/helpers';

const initialState = {
    iniviteMemberInfo: null,
    inviteOnLoad: false,
    inviteMemberRegSettings: null,
    inviteMemberSaveOnLoad: false, 
    teamInviteProductsInfo: null,
    teamInviteProductsOnLoad: false,
    status: null,
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

        case ApiConstants.API_GET_INVITE_TEAM_REVIEW_PRODUCT_LOAD:
            return { ...state, teamInviteProductsOnLoad: true };

        case ApiConstants.API_GET_INVITE_TEAM_REVIEW_PRODUCT_SUCCESS:
            let teamInviteProductsInfoTemp = action.result;
            return {
                ...state,
                teamInviteProductsOnLoad: false,
                status: action.status,
                teamInviteProductsInfo: teamInviteProductsInfoTemp
            };

        default:
            return state;
    }
}

export default teamInviteReducer;