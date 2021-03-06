import ApiConstants from "../../../themes/apiConstants";
import { deepCopyFunction, getAge, isArrayNotEmpty, isNullOrEmptyString} from '../../../util/helpers';
import { getOrganisationId,  getCompetitionId } from "../../../util/sessionStorage.js";
import moment from 'moment';

let walkingNetballObj = {
	// "haveHeartTrouble" : null,
	// "havePainInHeartOrChest" : null,
	// "haveSpellsOfServerDizziness" : null,
	// "hasBloodPressureHigh" : null,
	// "hasBoneProblems" : null,
	// "whyShouldNotTakePhysicalActivity" : null,
	// "pregnentInLastSixMonths" : null,
  // "sufferAnyProblems" : null
  "heartTrouble": null,
  "chestPain": null,
  "faintOrSpells": null,
  "bloodPressure": null,
  "jointOrBoneProblem": null,
  "physicalActivity": null,
  "pregnant": null,
  "lowerBackProblem": null
}

let seasionalAndCasualFeesInputObj = {
	"organisationId" : "",
	"competitionId": "",
	"competitionMembershipProductTypes": []
}

let registrationCapValidateInputObjTemp = {
  "registrationId": "",
  "participantId": "",
  "isTeamRegistration": 0,
  "products": []
}

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
  "walkingNetballFlag": 0,
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
    "totalCasualFee": "0.00",
    "totalSeasonalFee": "0.00"
  },
  "regSetting": {
    "school_grade": 0,
    "school_program": 0,
    "school_standard": 0,
    "netball_experience": 0
  },
  "personRoleRefId":null,
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
  "parentOrGuardian": [],
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
    "isYearsPlayed": null,
    "yearsPlayed": '2',
    "countryRefId": 1,
    "heardByOther": null,
    "heardByRefId": null,
    "isDisability": null,
    "identifyRefId": null,
    "newToUmpiring": null,
    "lastCaptainName": null,
    "otherSportsInfo": [],
    "otherSports": null,
    "schoolGradeInfo": null,
    "hasDivisionError": null,
    "favouriteFireBird": null,
    "regularMedication": null,
    "favouriteTeamRefId": null,
    "walkingNetballInfo": null,
    "childrenCheckNumber": null,
    "disabilityTypeRefId": null,
    "isParticipatedInSSP": null,
    //"walkingNetballRefId": null,
    "walkingNetball": deepCopyFunction(walkingNetballObj),
    "associationLevelInfo": null,
    "disabilityCareNumber": null,
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
  // "street1":null,
  // "street2":null,
  // "suburb":null,
  // "stateRefId":null,
  // "countryRefId":1,
  // "postalCode":null,
  // "addNewAddressFlag": true,
  // "manualEnterAddressFlag": false,
  "payingFor": 0,
  "isRegistererAsParent": 0,
  "parentOrGuardian": [],
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
    NonFilteredMembershipProductInfo: [],
    teamRegistrationObj : null,
    hasTeamSelected: false,
    hasCompetitionSelected: false,
    userInfoOnLoad: false,
    isSavedTeam: false,
    saveValidationErrorMsg: null,
    saveValidationErrorCode: null,
    onSaveLoad: false,
    registrationId: null,
    participantId: null,
    onTeamInfoByIdLoad: false,
    onExistingTeamInfoByIdLoad: false,
    expiredRegistrationFlag: false,
    expiredRegistration: null,
    onExpiredRegistrationCheckLoad: false,
    divisionsChanged: false,
    // iniviteMemberInfo: null,
    // inviteOnLoad: false,
    // inviteMemberRegSettings: null,
    // inviteMemberSaveOnLoad: false ,
    getSeasonalCasualFeesOnLoad: false,
    enableSeasonalAndCasualService: false,
    seasionalAndCasualFeesInputObj : null,
    teamNameValidationResultCode: null,
    feesInfo: null,
    teamCompetitionNotExist: false,
    registrationCapValidateInputObj: deepCopyFunction(registrationCapValidateInputObjTemp),
    enableValidateRegistrationCapService: false
}

function setTeamRegistrationObj(state,existingTeamInfo){
  try{
    state.teamRegistrationObj = existingTeamInfo ? existingTeamInfo : deepCopyFunction(teamObj);
    let membershipProducts = deepCopyFunction(state.membershipProductInfo)
    if(getOrganisationId() != null && getCompetitionId() != null){
      state.teamRegistrationObj.organisationId = getOrganisationId();
      state.teamRegistrationObj.competitionId = getCompetitionId();
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
          // state.expiredRegistrationFlag = true;
          initiateExpiredRegistrationCall(state)
        }
      }else{
        // state.expiredRegistrationFlag = true;
        initiateExpiredRegistrationCall(state);
      }
    }
  }catch(ex){
    console.log("Error in getTeamRegistrationObj in teamRegistrationReducer::"+ex);
  }
}

function initiateExpiredRegistrationCall(state){
	try{
		if(getOrganisationId() != null && getCompetitionId() != null){
      let membershipProductsInfoList = state.NonFilteredMembershipProductInfo;
			let organisatinInfoTemp = membershipProductsInfoList.find(x => x.organisationUniqueKey == getOrganisationId());
			if(organisatinInfoTemp){
				let competitionInfoTemp = organisatinInfoTemp.competitions.find(x => x.competitionUniqueKey == getCompetitionId());
				if(competitionInfoTemp == undefined){
					state.expiredRegistrationFlag = true;
				}
			}else{
				state.expiredRegistrationFlag = true;
			}
		}
	}catch(ex){
		console.log("Error in initiateExpiredRegistrationCall::"+ex)
	}
}

function setCompetitionDetails(state,details){
  try{
    state.teamRegistrationObj.organisationInfo = deepCopyFunction(details.organisationInfo);
    state.teamRegistrationObj.organisationId = state.teamRegistrationObj.organisationInfo.organisationUniqueKey;
    state.teamRegistrationObj.competitionInfo = deepCopyFunction(details.competitionInfo);
    state.teamRegistrationObj.competitionId = state.teamRegistrationObj.competitionInfo.competitionUniqueKey;
    state.teamRegistrationObj.registrationRestrictionTypeRefId = state.teamRegistrationObj.competitionInfo.registrationRestrictionTypeRefId;
    state.teamRegistrationObj.membershipProductList = [];
    let filteredPayerAndTeamMembershipProducts = state.teamRegistrationObj.competitionInfo.membershipProducts.filter(x => x.isPlayer == 1);
    for(let productType of filteredPayerAndTeamMembershipProducts){
      let filteredTeamDivision = productType.divisions.find(x => x.isTeamRegistration == 1);
      if(filteredTeamDivision){
        state.teamRegistrationObj.membershipProductList.push(productType);
      }
    }

    //When it has one item set defualt the first position
    if(state.teamRegistrationObj.membershipProductList.length == 1){
      setDivisions(state,state.teamRegistrationObj.membershipProductList[0].competitionMembershipProductTypeId);
      state.teamRegistrationObj.fees.totalCasualFee = "0.00";
      state.teamRegistrationObj.fees.totalSeasonalFee = "0.00";
      state.teamRegistrationObj.fees.payAtRegistration = "0.00";
      state.teamRegistrationObj.fees.payAtMatch = "0.00";
    }else{
      state.teamRegistrationObj.competitionMembershipProductTypeId = null;
      state.teamRegistrationObj.divisions = [];
      state.teamRegistrationObj.walkingNetballFlag = 0;
      state.teamRegistrationObj.competitionMembershipProductId = null;
      state.teamRegistrationObj.allowTeamRegistrationTypeRefId = null;
      state.teamRegistrationObj.fees.totalCasualFee = "0.00";
      state.teamRegistrationObj.fees.totalSeasonalFee = "0.00";
      state.teamRegistrationObj.fees.payAtRegistration = "0.00";
      state.teamRegistrationObj.fees.payAtMatch = "0.00";
    }

    state.hasCompetitionSelected = true;
  }catch(ex){
    console.log("Error in setCompetitionDetails::"+ex);
  }
}

function getUpdatedTeamMemberObj(state,existingTeamMember){
  try{
    let teamMemberTemp = existingTeamMember ? existingTeamMember : deepCopyFunction(teamMemberObj);
    teamMemberTemp.membershipProductTypes = [];
    let competitionInfo = state.teamRegistrationObj.competitionInfo;
    let filteredTeamMembershipProducts =  competitionInfo.membershipProducts.filter(x => x.isTeamRegistration == 1 && x.allowTeamRegistrationTypeRefId == 1);
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
      state.teamRegistrationObj.walkingNetballFlag = (membershipProduct.shortName == "Walking Netball" || membershipProduct.shortName == "Player - Walking Netball") ? 1 : 0;
      state.teamRegistrationObj.competitionMembershipProductId = membershipProduct.competitionMembershipProductId;
      state.teamRegistrationObj.allowTeamRegistrationTypeRefId = membershipProduct.allowTeamRegistrationTypeRefId;
      // if(state.teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && !state.teamRegistrationObj.existingTeamParticipantId){
      if(state.teamRegistrationObj.allowTeamRegistrationTypeRefId == 1){
        if(!isArrayNotEmpty(state.teamRegistrationObj.teamMembers)){
          state.teamRegistrationObj.teamMembers = [];
          state.teamRegistrationObj.teamMembers.push(getUpdatedTeamMemberObj(state));
        }else{
          for(let teamMember of state.teamRegistrationObj.teamMembers){
            teamMember = getUpdatedTeamMemberObj(state,teamMember)
          }
        }
      }
      state.teamRegistrationObj.divisions = [];
      // let divisionInfoList = state.teamRegistrationObj.divisions;
      // divisionInfoList.push.apply(divisionInfoList,getFilteredDivisions(membershipProduct.divisions,state));
      for(let division of membershipProduct.divisions){
        if(division.registrationTeamLock == 0 && division.isTeamRegistration == 1){
          let div = {
            "divisionName": division.divisionName,
            "competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
            "competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
            "fromDate": division.fromDate,
            "toDate": division.toDate,
            "genderRefId": division.genderRefId
          }
          state.teamRegistrationObj.divisions.push(div);
        }
      }

      //When it has one item set defualt the first position
      if(state.teamRegistrationObj.divisions.length == 1){
        state.teamRegistrationObj.competitionMembershipProductDivisionId = state.teamRegistrationObj.divisions[0].competitionMembershipProductDivisionId;
        setSeasonalAndCasualFeesObj(state);
        setValidateRegistrationCapObj(state);
      }else{
        state.teamRegistrationObj.competitionMembershipProductDivisionId = null;
      }

      state.divisionsChanged = true;
    }
  }catch(ex){
    console.log("Error in setDivisions::"+ex);
  }
}

function setValidateRegistrationCapObj(state){
  try{
    let teamRegistrationObjTemp = deepCopyFunction(state.teamRegistrationObj);
    let validateRegistrationCapObj = deepCopyFunction(state.registrationCapValidateInputObj);
    validateRegistrationCapObj.registrationId = state.registrationId ? state.registrationId : "";
    validateRegistrationCapObj.participantId = state.participantId ? state.participantId : "";
    validateRegistrationCapObj.isTeamRegistration = 1;
    validateRegistrationCapObj.products = [];
    let product = {
      "competitionId": teamRegistrationObjTemp.competitionId,
      "organisationId": teamRegistrationObjTemp.organisationId,
      "competitionMembershipProductTypeId": teamRegistrationObjTemp.competitionMembershipProductTypeId,
      "divisionId": teamRegistrationObjTemp.competitionMembershipProductDivisionId
    }
    validateRegistrationCapObj.products.push(product);
    state.registrationCapValidateInputObj = validateRegistrationCapObj;
    state.enableValidateRegistrationCapService = true;
  }catch(ex){
    console.log("Error in setValidateRegistrationCapObj::"+ex);
  }
}

function setTeamRegistrationSetting(state,settings){
	try{
    let teamRegistrationObj = state.teamRegistrationObj;
    if(teamRegistrationObj){
      let settingKeys = Object.keys(settings);
      for(let key of settingKeys){
        if(teamRegistrationObj.regSetting[key] == 0){
          teamRegistrationObj.regSetting[key] = settings[key];
        }
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

function setSeasonalAndCasualFeesObj(state){
  try{
    let teamRegistrationObjTemp = deepCopyFunction(state.teamRegistrationObj);
    let seasionalAndCasualFeesInputObjTemp = deepCopyFunction(seasionalAndCasualFeesInputObj);
    seasionalAndCasualFeesInputObjTemp.organisationId = teamRegistrationObjTemp.organisationId;
    seasionalAndCasualFeesInputObjTemp.competitionId = teamRegistrationObjTemp.competitionId;
    let obj = {
      "competitionMembershipProductId": teamRegistrationObjTemp.competitionMembershipProductId,
      "isPlayer": 1,
      "competitionMembershipProductTypeId": teamRegistrationObjTemp.competitionMembershipProductTypeId,
      "competitionMembershipProductDivisionId": teamRegistrationObjTemp.competitionMembershipProductDivisionId
    }
    seasionalAndCasualFeesInputObjTemp.competitionMembershipProductTypes[0] = obj;
    state.seasionalAndCasualFeesInputObj = seasionalAndCasualFeesInputObjTemp;
    state.enableSeasonalAndCasualService = true;
  }catch(ex){
    console.log("Error in setSeasonalAndCasualFessOj::"+ex)
  }
}

function updateImportedTeamMember(state,importedTeamMemberList){
  try{
    state.teamRegistrationObj.teamMembers = [];
    for(let importedTeamMember of importedTeamMemberList){
      let teamMemberObj = getUpdatedTeamMemberObj(state);
      teamMemberObj.firstName = importedTeamMember.first_name ? importedTeamMember.first_name : null;
      teamMemberObj.middleName = importedTeamMember.middle_name ? importedTeamMember.middle_name : null;
      teamMemberObj.lastName = importedTeamMember.last_name ? importedTeamMember.last_name : null;
      if(importedTeamMember.gender){
        teamMemberObj.genderRefId = importedTeamMember.gender == "Female" ? 1 : (importedTeamMember.gender == "Male" ? 2 : 3);
      }
      teamMemberObj.email = importedTeamMember.email ? importedTeamMember.email : null;
      teamMemberObj.mobileNumber = importedTeamMember.phone ? importedTeamMember.phone : null;
      //console.log("date",JSON.stringify(moment(new Date(importedTeamMember.date_of_birth)).format("MM-DD-YYYY")));
      teamMemberObj.dateOfBirth = importedTeamMember.date_of_birth ? moment(importedTeamMember.date_of_birth,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
      let membershipProductTypesTemp = teamMemberObj.membershipProductTypes.find(x => x.productTypeName == importedTeamMember.type);
      if(membershipProductTypesTemp){
        membershipProductTypesTemp.isChecked = true;
      }
      state.teamRegistrationObj.teamMembers.push(teamMemberObj);
    }
  }catch(ex){
    console.log("Error in updateImportedTeamMember::"+ex)
  }
}

function getTeamMembershipInfo(organisationList){
	try{
		let filteredMembershipProductInfoTemp = [];
		for(let organisation of organisationList){
			for(let competition of organisation.competitions){
				let teamMembershipProduct = competition.membershipProducts.find(x => x.isTeamRegistration == 1);
				if(teamMembershipProduct){
					let organisatioExist = filteredMembershipProductInfoTemp.find(x => x.organisationUniqueKey == organisation.organisationUniqueKey);
					if(organisatioExist){
						organisatioExist.competitions.push(competition);
					}else{
            let organisationTemp = deepCopyFunction(organisation);
            organisationTemp.competitions = [];
            organisationTemp.competitions.push(competition);
            filteredMembershipProductInfoTemp.push(organisationTemp);
          }
				}
			}
    }
		return filteredMembershipProductInfoTemp;
	}catch(ex){
		console.log("Error in getIndividualMembershipInfo::"+ex)
	}
}

function checkExistInFilteredOrgList(state,teamRegMembershipInfo){
	try{
		let organisation = teamRegMembershipInfo.find(x => x.organisationUniqueKey == getOrganisationId());
		if(organisation){
			let competition = organisation.competitions.find(x => x.competitionUniqueKey == getCompetitionId());
			if(competition == undefined){
				state.teamCompetitionNotExist = true;
			}
		}else{
			state.teamCompetitionNotExist = true;
		}
	}catch(ex){
		console.log("Error in checkExistInFilteredOrgList::"+ex)
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
            let teamRegMembershipInfo = getTeamMembershipInfo(data);
            checkExistInFilteredOrgList(state,teamRegMembershipInfo);
            return {
              ...state,
              membershipProductInfo: teamRegMembershipInfo,
              NonFilteredMembershipProductInfo: data,
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
              setDivisions(state,action.data);
              state.teamRegistrationObj.fees.totalCasualFee = "0.00";
              state.teamRegistrationObj.fees.totalSeasonalFee = "0.00";
              state.teamRegistrationObj.fees.payAtRegistration = "0.00";
              state.teamRegistrationObj.fees.payAtMatch = "0.00";
            }else if(action.key == "competitionMembershipProductDivisionId"){
              state.teamRegistrationObj.competitionMembershipProductDivisionId = action.data;
              setSeasonalAndCasualFeesObj(state);
              setValidateRegistrationCapObj(state);
            }else if(action.key == "addTeamMember"){
              let teamMemberObj = getUpdatedTeamMemberObj(state);
              state.teamRegistrationObj.teamMembers.push(teamMemberObj);
            }else if(action.key == "removeTeamMember"){
              state.teamRegistrationObj.teamMembers.splice(action.data,1);
            }else if(action.key == "teamMemberList"){
              updateImportedTeamMember(state,action.data);
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
              //inviteMemberRegSettings: registrationSettings,
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
            let additionalInfoSubKey = action.subKey;
            if(additionalInfoSubKey == "walkingNetball"){
              state.teamRegistrationObj.additionalInfo.walkingNetball[additionalInfoKey] = additionalInfoData;
            }else{
              if(additionalInfoKey == "isYearsPlayed"){
                if(additionalInfoData == 1){
                  state.teamRegistrationObj.additionalInfo.yearsPlayed = '2';
                }
              }
              state.teamRegistrationObj.additionalInfo[additionalInfoKey] = additionalInfoData;
            }
            return {
              ...state
            };

        case ApiConstants.API_GET_TEAM_BY_ID_LOAD:
            return { ...state, onTeamInfoByIdLoad: true };

        case ApiConstants.API_GET_TEAM_BY_ID_SUCCESS:
            let responseData = action.result;
            let participantId = action.participantId;
            if(isNullOrEmptyString(participantId)){
              state.teamRegistrationObj = updateTeamInfoByIdByMembershipInfo(state,responseData);
              setValidateRegistrationCapObj(state);
            }
            return {
              ...state,
              onTeamInfoByIdLoad: false,
              status: action.status
            };

        case ApiConstants.API_GET_EXISTING_TEAM_BY_ID_LOAD:
            return { ...state, onExistingTeamInfoByIdLoad: true };

        case ApiConstants.API_GET_EXISTING_TEAM_BY_ID_SUCCESS:
            let existingTeamInfo = action.result;
            setTeamRegistrationObj(state,existingTeamInfo)
            return {
              ...state,
              onExistingTeamInfoByIdLoad: false,
              status: action.status,
              // teamRegistrationObj: existingTeamInfo
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

        // case ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_LOAD:
        //     return {...state,inviteOnLoad: true}

        // case ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_SUCCESS:
        //     let iniviteMemberInfoTemp = action.result;
        //     return {
        //       ...state,
        //       status: action.status,
        //       inviteOnLoad: false,
        //       iniviteMemberInfo : iniviteMemberInfoTemp
        //     };

        // case ApiConstants.UPDATE_INVITE_MEMBER_INFO_ACTION:
        //     let inviteMemberInfoData = action.data;
        //     let inviteMemberInfoKey = action.key;
        //     let inviteMemberInfoSubKey= action.subKey;
        //     let inviteMemberInfoParentIndex = action.parentIndex;
        //     if(inviteMemberInfoSubKey == "userRegDetails"){
        //       state.iniviteMemberInfo.userRegDetails[inviteMemberInfoKey] = inviteMemberInfoData;
        //     }else if(inviteMemberInfoSubKey == "parentOrGaurdianDetails"){
        //       state.iniviteMemberInfo.userRegDetails[inviteMemberInfoSubKey][inviteMemberInfoParentIndex][inviteMemberInfoKey] = inviteMemberInfoData;
        //     }else if(inviteMemberInfoKey == "inviteMemberInfo"){
        //       state.iniviteMemberInfo = inviteMemberInfoData;
        //     }
        //     return{
        //       ...state
        //     }

        // case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD:
        //     return { ...state, inviteMemberSaveOnLoad: true };

        // case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_SUCCESS:
        //     return {
        //         ...state,
        //         inviteMemberSaveOnLoad: false,
        //         status: action.status
        //     };

      case ApiConstants.API_GET_TEAM_SEASONAL_CASUAL_FEES_LOAD:
				return {...state,getSeasonalCasualFeesOnLoad: true }

			case ApiConstants.API_GET_TEAM_SEASONAL_CASUAL_FEES_SUCCESS:
        let feesTemp = action.result;
        state.teamRegistrationObj.fees.totalCasualFee = feesTemp.totalCasualTeamFees;
        state.teamRegistrationObj.fees.totalSeasonalFee = feesTemp.totalSeasonalTeamFees;
        state.teamRegistrationObj.fees.payAtRegistration = feesTemp.payAtRegistration;
        state.teamRegistrationObj.fees.payAtMatch = feesTemp.payAtMatch;
        return {
          ...state,
          feesInfo: feesTemp,
          getSeasonalCasualFeesOnLoad: false
        }

      case ApiConstants.TEAM_NAME_CHECK_VALIDATION_LOAD:
        return { ...state,onLoad: true};

      case ApiConstants.TEAM_NAME_CHECK_VALIDATION_SUCCESS:
        state.teamNameValidationResultCode = action.result.resultCode;
        return {
            ...state,
            onLoad: false,
        };

        default:
            return state;
    }
}

export default teamRegistrationReducer;
