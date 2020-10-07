import ApiConstants from "../../../themes/apiConstants";
import { deepCopyFunction, getAge, isNullOrEmptyString} from '../../../util/helpers';
import { getOrganisationId,  getCompetitonId } from "../../../util/sessionStorage.js";

const teamObj = {
  "registrationId": null,
  "participantId": null,
  "registeringYourself": null,
  "organisationId": null,
  "competitionId": null,
  "organisationInfo": null,
  "competitionInfo": null,
  "registrationRestrictionTypeRefId": null,
  "competitionMembershipProductId": null,
  "competitionMembershipProductTypeId": null,
  "competitionMembershipProductDivisionId": null,
  "membershipProductList": [
    // {
    //   "competitionMembershipProductId": null,
    //   "competitionMembershipProductTypeId": null,
    //   "productName": null,
    //   "divisions": [
    //     {
    //       "divisionName": null,
    //       "competitionMembershipProductTypeId": null,
    //       "competitionMembershipProductDivisionId": null
    //     }
    //   ],
	  // }
  ],
  "membershipProducts":[],
  "divisions": [
    // {
    //   "divisionName": null,
    //   "competitionMembershipProductTypeId": null,
    //   "competitionMembershipProductDivisionId": null
    // }
  ],
  "fees": {
    "totalCasualFee": null,
    "totalSeasonalFee": null
  },
  "regSetting": {
    "school_grade": 0,
    "school_program": 0,
    "school_standard": 0,
    "netball_experience": 0
  },
  "personRoleRefId":null,
  "genderRefId": null,
  "email": null,
  "suburb": null,
  "userId": null,
  "street1": null,
  "street2": null,
  "lastName": null,
  "firstName": null,
  "middleName": null,
  "postalCode": null,
  "stateRefId": null,
  "dateOfBirth": null,
  "genderRefId": null,
  "countryRefId": 1,
  "addNewAddressFlag": true,
  "selectAddressFlag": false,
  "manualEnterAddressFlag": false,
  "mobileNumber": null,
  "teamId": null,
  "teamName": null,
  "registeringAsAPlayer": null,
  "allowTeamRegistrationTypeRefId": null,
  "teamMembers": [
    // {
    //   "genderRefId": null,
    //   "email": null,
    //   "lastName": null,
    //   "firstName": null,
    //   "middleName": null,
    //   "dateOfBirth": null,
    //   "mobileNumber":null,
    //   "payingFor": 0,
    //   "membershipProductTypes": [
    //     {
    //       "competitionMembershipProductId": null,
    //       "competitionMembershipProductTypeId": null,
    //       "isPlayer": null,
    //       "productTypeName": null,
    //       "isChecked": null
    //     }
    //   ]
    // }
  ],
  "additionalInfo": {
    "isPlayer": null,
    "schoolId": null,
    "injuryInfo": null,
    "allergyInfo": null,
    "yearsPlayed": null,
    "countryRefId": 1,
    "heardByOther": null,
    "heardByRefId": null,
    "isDisability": false,
    "identifyRefId": null,
    "newToUmpiring": null,
    "lastCaptainName": null,
    "otherSportsInfo": [],
    "schoolGradeInfo": null,
    "hasDivisionError": null,
    "favouriteFireBird": null,
    "regularMedication": null,
    "favouriteTeamRefId": null,
    "walkingNetballInfo": null,
    "childrenCheckNumber": null,
    "disabilityTypeRefId": null,
    "isParticipatedInSSP": null,
    "walkingNetballRefId": null,
    "associationLevelInfo": null,
    "disabilityCareNumber": null,
    "emergencyContactName": null,
    "isConsentPhotosGiven": false,
    "isChildrenCheckNumber": null,
    "emergencyContactNumber": null,
    "childrenCheckExpiryDate": null,
    "existingMedicalCondition": null,
    "accreditationCoachExpiryDate": null,
    "accreditationLevelCoachRefId": null,
    "isPrerequestTrainingComplete": null,
  }
}

const teamMemberObj = {
  "genderRefId": null,
  "email": null,
  "lastName": null,
  "firstName": null,
  "middleName": null,
  "dateOfBirth": null,
  "mobileNumber":null,
  "payingFor": 0,
  "membershipProductTypes": [
    // {
    //   "competitionMembershipProductId": null,
    //   "competitionMembershipProductTypeId": null,
    //   "isPlayer": null,
    //   "productTypeName": null,
    //   "isChecked": null
    // }
  ]
}

const initialState = {
    onMembershipLoad: false,
    status: null,
    membershipProductInfo: [],
    teamRegistrationObj : null,
    hasTeamSelected: false,
    hasCompetitionSelected: false,
    userInfoOnLoad: false,
    isSavedTeam: false,
    saveValidationErrorMsg: null,
    saveValidationErrorCode: null,
    onSaveLoad: false,
    registrationId: null,
    onTeamInfoByIdLoad: false,
    onExistingTeamInfoByIdLoad: false,
    expiredRegistrationFlag: false,
    expiredRegistration: null,
    onExpiredRegistrationCheckLoad: false 
}

function setTeamRegistrationObj(state){
  try{
    state.teamRegistrationObj = deepCopyFunction(teamObj);
    let membershipProducts = deepCopyFunction(state.membershipProductInfo)
    if(getOrganisationId() != null && getCompetitonId() != null){
      state.teamRegistrationObj.organisationId = getOrganisationId();
      state.teamRegistrationObj.competitionId = getCompetitonId();
      let organisationInfoTemp = membershipProducts.find(x => x.organisationUniqueKey == state.teamRegistrationObj.organisationId);
      if(organisationInfoTemp != null){
        let competitionInfoTemp = organisationInfoTemp.competitions.find(x => x.competitionUniqueKey == state.teamRegistrationObj.competitionId);
        if(competitionInfoTemp != null){
          let details = {
            organisationInfo: organisationInfoTemp,
            competitionInfo: competitionInfoTemp
          }
          setCompetitionDetails(state,details);
        }else{
          state.expiredRegistrationFlag = true;
        }
      }else{
        state.expiredRegistrationFlag = true;
      }
    }
  }catch(ex){
    console.log("Error in getTeamRegistrationObj in teamRegistrationReducer::"+ex);
  }
}

function setCompetitionDetails(state,details){
  try{
    state.teamRegistrationObj.organisationInfo = deepCopyFunction(details.organisationInfo);
    state.teamRegistrationObj.organisationId = state.teamRegistrationObj.organisationInfo.organisationUniqueKey;
    state.teamRegistrationObj.competitionInfo = deepCopyFunction(details.competitionInfo);
    state.teamRegistrationObj.competitionId = state.teamRegistrationObj.competitionInfo.competitionUniqueKey;
    state.teamRegistrationObj.registrationRestrictionTypeRefId = state.teamRegistrationObj.competitionInfo.registrationRestrictionTypeRefId; 
    let filteredPayerAndTeamMembershipProducts = state.teamRegistrationObj.competitionInfo.membershipProducts.filter(x => x.isPlayer == 1 && x.isTeamRegistration == 1);
    state.teamRegistrationObj.membershipProductList = filteredPayerAndTeamMembershipProducts;
    state.hasCompetitionSelected = true;
  }catch(ex){
    console.log("Error in setCompetitionDetails::"+ex);
  }
}

function getUpdatedTeamMemberObj(state){
  try{
    let teamMemberTemp = deepCopyFunction(teamMemberObj);
    let competitionInfo = state.teamRegistrationObj.competitionInfo;
    let filteredTeamMembershipProducts =  competitionInfo.membershipProducts.filter(x => x.isTeamRegistration == 1);
    for(let product of filteredTeamMembershipProducts){
      let obj = {
        "competitionMembershipProductId": product.competitionMembershipProductId,
        "competitionMembershipProductTypeId": product.competitionMembershipProductTypeId,
        "isPlayer": product.isPlayer,
        "productTypeName": product.shortName,
        "isChecked": false
      }
      teamMemberTemp.membershipProductTypes.push(obj);
    }
    return teamMemberTemp;
  }catch(ex){
    console.log("Error in getUpdatedTeamMemberObj::"+ex);
  }
}

function setDivisions(state,competitionMembershipProductTypeId){
  try{
    state.teamRegistrationObj.competitionMembershipProductTypeId = competitionMembershipProductTypeId;
    let membershipProduct = state.teamRegistrationObj.membershipProductList.find(x => x.competitionMembershipProductTypeId == competitionMembershipProductTypeId);
    if(membershipProduct){
      state.teamRegistrationObj.competitionMembershipProductId = membershipProduct.competitionMembershipProductId;
      state.teamRegistrationObj.allowTeamRegistrationTypeRefId = membershipProduct.allowTeamRegistrationTypeRefId;
      if(state.teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && !state.teamRegistrationObj.existingTeamParticipantId){
        state.teamRegistrationObj.teamMembers = [];
        state.teamRegistrationObj.teamMembers.push(getUpdatedTeamMemberObj(state));
      }
      state.teamRegistrationObj.divisions = [];
      for(let division of membershipProduct.divisions){
        let div = {
          "divisionName": division.divisionName,
          "competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
			    "competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId
        }
        state.teamRegistrationObj.divisions.push(div);
      }
    }
  }catch(ex){
    console.log("Error in setDivisions::"+ex);
  }
}

function setTeamRegistrationSetting(state,settings){
	try{
		let teamRegistrationObj = state.teamRegistrationObj;
		let settingKeys = Object.keys(settings);
		for(let key of settingKeys){
			if(teamRegistrationObj.regSetting[key] == 0){
				teamRegistrationObj.regSetting[key] = settings[key];
			}
		}
	}catch(ex){
		console.log("Error in setTeamRegistrationSetting in teamRegistrationReducer"+ex);
	}
}

function updateTeamInfoByIdByMembershipInfo(state,teamData){
	try{
    let membershipProductInfo = deepCopyFunction(state.membershipProductInfo);
    console.log("membership",membershipProductInfo);
    teamData.organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == teamData.organisationId);
    console.log("organisationinfo",teamData.organisationInfo);
    teamData.competitionInfo = teamData.organisationInfo.competitions.find(x => x.competitionUniqueKey == teamData.competitionId);
		return teamData;
	}catch(ex){
		console.log("Error in updateTeamInfoByIdByMembershipInfo in teamRegistrationReducer"+ex);
	}
}

function teamRegistrationReducer(state = initialState, action){
    switch(action.type){
        case ApiConstants.UPDATE_TEAM_REGISTRATION_STATE_VAR:
            state[action.key] = action.data;
            return{
              ...state
            }

        case ApiConstants.API_MEMBERSHIP_PRODUCT_TEAM_REG_LOAD: 
            return {...state,onMembershipLoad: true}

        case ApiConstants.API_MEMBERSHIP_PRODUCT_TEAM_REG_SUCCESS:
            let data = action.result;
            return {
              ...state,
              membershipProductInfo: data,
              status: action.status,
              onMembershipLoad: false
            };

        case ApiConstants.SELECT_TEAM: 
            setTeamRegistrationObj(state);
            return { 
              ...state,
              hasTeamSelected: true 
            };
        
        case ApiConstants.UPDATE_TEAM_REGISTRATION_OBJECT:
            if(action.key == "competitionDetail"){
              let details = action.data;
              setCompetitionDetails(state,details);
            }else if(action.key == "competitionMembershipProductTypeId"){
              setDivisions(state,action.data)
            }else if(action.key == "addTeamMember"){
              let teamMemberObj = getUpdatedTeamMemberObj(state);
              state.teamRegistrationObj.teamMembers.push(teamMemberObj);
            }else if(action.key == "removeTeamMember"){
              state.teamRegistrationObj.teamMembers.splice(action.data,1);
            }else{
              state.teamRegistrationObj[action.key] = action.data;
            }
            return{
              ...state
            };
        
        case ApiConstants.UPDATE_REGISTRATION_TEAM_MEMBER_ACTION:
            if(action.key == "membershipProductTypes"){
              state.teamRegistrationObj.teamMembers[action.index][action.key][action.subIndex].isChecked = action.data;
            }else{
              state.teamRegistrationObj.teamMembers[action.index][action.key] = action.data;
            }
            return{
              ...state
            }
            
        case ApiConstants.API_ORG_TEAM_REGISTRATION_SETTINGS_LOAD:
            return { ...state, onLoad: true };
    
        case ApiConstants.API_ORG_TEAM_REGISTRATION_SETTINGS_SUCCESS:
            let registrationSettings = action.result;
            setTeamRegistrationSetting(state,registrationSettings);
            return {
              ...state,
              onLoad: false,
              status: action.status
            };
        
        case ApiConstants.API_SAVE_TEAM_LOAD:
            return { ...state, onSaveLoad: true };
    
        case ApiConstants.API_SAVE_TEAM_SUCCESS:
            state.registrationId = action.result ? action.result.id : null;
            state.saveValidationErrorMsg = action.result ? action.result.errorMsg : null;
            state.saveValidationErrorCode = action.result ? action.result.errorCode : null;
            return {
              ...state,
              onSaveLoad: false,
              status: action.status,
              isSavedTeam: true
            };

        case ApiConstants.UPDATE_TEAM_ADDITIONAL_INFO: 
            let additionalInfoKey = action.key;
            let additionalInfoData = action.data;
            state.teamRegistrationObj.additionalInfo[additionalInfoKey] = additionalInfoData;
            return {
              ...state
            };

        case ApiConstants.API_GET_TEAM_BY_ID_LOAD:
            return { ...state, onTeamInfoByIdLoad: true };
    
        case ApiConstants.API_GET_TEAM_BY_ID_SUCCESS:
            let responseData = action.result;
            let participantId = action.participantId;
            let teamRegistrationObjTemp = null;
            if(isNullOrEmptyString(participantId)){
              teamRegistrationObjTemp = updateTeamInfoByIdByMembershipInfo(state,responseData);
            }
            return {
              ...state,
              onTeamInfoByIdLoad: false,
              status: action.status,
              teamRegistrationObj: teamRegistrationObjTemp
            };

        case ApiConstants.API_GET_EXISTING_TEAM_BY_ID_LOAD:
            return { ...state, onExistingTeamInfoByIdLoad: true };
      
        case ApiConstants.API_GET_EXISTING_TEAM_BY_ID_SUCCESS:
            let existingTeamInfo = action.result;
            //teamRegistrationObjTemp = updateTeamInfoByIdByMembershipInfo(state,existingTeamInfo);
            return {
              ...state,
              onExistingTeamInfoByIdLoad: false,
              status: action.status,
              teamRegistrationObj: existingTeamInfo
            };

        case ApiConstants.API_EXPIRED_TEAM_REGISTRATION_LOAD: 
            return {...state,onExpiredRegistrationCheckLoad: true}
          
        case ApiConstants.API_EXPIRED_TEAM_REGISTRATION_SUCCESS:
            let expiredRegistrationTemp = action.result;
            return {
              ...state,
              onExpiredRegistrationCheckLoad: false,
              expiredRegistration: expiredRegistrationTemp,
              status: action.status
            };
  

        default:
            return state;
    }
}

export default teamRegistrationReducer;