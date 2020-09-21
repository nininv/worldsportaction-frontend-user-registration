import ApiConstants from "../../../themes/apiConstants";
import { getOrganisationId,  getCompetitonId } from "../../../util/sessionStorage.js";
import { deepCopyFunction, getAge} from '../../../util/helpers';
import moment from 'moment';

let registrationObjTemp = {
    "registrationId": null,
    "pariticipantId": null,
    "registeringYourself": null,
	"userId": null,
	"firstName": null,
	"middleName": null,
	"lastName": null,
	"genderRefId": null,
	"dateOfBirth": null,
	"mobileNumber": null,
	"email": null,
	"participantPhoto": null,
	"profileUrl": null,
	"street1": null,
	"street2": null,
	"suburb": null,
	"stateRefId": null,
	"countryRefId": 1,
	"postalCode": null,
	"latitue": null,
	"longitude": null,
	"referParentEmail": false,
	"selectAddressFlag": true,
	"addNewAddressFlag": false,
	"manualEnterAddressFlag": false,
	"umpireFlag": 0,
	"coachFlag": 0,
	"walkingNetballFlag": 0,
	"parentOrGuardian": [
		// {
		// 	"tempParentId": null,
		// 	"firstName": null,
		// 	"lastName": null,
		// 	"mobileNumber": null,
		// 	"email": null,
		// 	"street1": null,
		// 	"street2": null,
		// 	"suburb": null,
		// 	"stateRefId": null,
		// 	"countryRefId": null,
		// 	"postalCode": null
		// }
	],
	// "tempParentsDetail": [
	// 	// {
	// 	// 	"firstName": null,
	// 	// 	"lastName": null,
	// 	// 	"tempParentId": null
	// 	// }
	// ],
	"tempParents": [],
	"competitions": [
		// {
		// 	"organisationId": null,
		// 	"competitionId": null,
		// 	"organisationInfo": null,
		// 	"competitionInfo": null,
		// 	"products": [
		// 		{
		// 			"competitionMembershipProductId": null,
		// 			"competitionMembershipProductTypeId": null,
		// 			"isSelected": false
		// 		}
		// 	],
		// 	"divisionInfo":[
		// 		{
		// 			"competitionMembershipProductTypeId": null,
		// 			"competitionMembershipProductDivisionId": null
		// 		}
		// 	],
		// 	"divisions": [
		// 		{
		// 			"competitionMembershipProductTypeId": null,
		// 			"competitionMembershipProductDivisionId": null
		// 		}
		// 	],
		// 	"fees": {
		// 		"totalCasualFee": null,
		// 		"totalSeasonalFee": null
		// 	},
		// 	"positionId1": null,
		// 	"positionId2": null,
		// 	"friends": [
		// 		{
		// 			"firstName": null,
		// 			"lastName": null,
		// 			"mobileNumber": null,
		// 			"email": null
		// 		}
		// 	],
		// 	"referFriends": [
		// 		{
		// 			"firstName": null,
		// 			"lastName": null,
		// 			"mobileNumber": null,
		// 			"email": null
		// 		}
		// 	]
		// }
	],
	"regSetting":{
		"netball_experience": 0,
		"school_grade": 0,
		"school_program": 0,
		"school_standard": 0
	},
	"additionalInfo": {
		// "playedYear": null,
		// "playedClub": null,
		// "playedGrade": null,
		"hasDivisionError": null,
		"isPlayer": null,
		"isChildrenCheckNumber": null,
		"disabilityTypeRefId": null,
		"disabilityCareNumber": null,
		"emergencyContactNumber": null,
		"emergencyContactName": null,
		//"playedBefore": 0,
		"existingMedicalCondition": null,
		"regularMedication": null,
		"heardByRefId": null,
		"favouriteTeamRefId": null,
		"favouriteFireBird": null,
		"isConsentPhotosGiven": false,
		"isDisability": false,
		"disabilityCareNumber": null,
		"childrenCheckNumber": null,
		"childrenCheckExpiryDate": null,
		"lastCaptainName": null,
		"countryRefId": 1,
		"identifyRefId": null,
		"injuryInfo": null,
		"allergyInfo": null,
		"otherSportsInfo": [],
		"yearsPlayed": null,
		"schoolId": null,
		"schoolGradeInfo": null,
		"isParticipatedInSSP": null,
		"accreditationLevelUmpireRefId": null,
		"accreditationLevelCoachRefId": null,
		"newToUmpiring": null,
		"associationLevelInfo": null,
		"accreditationUmpireExpiryDate": null,
		"accreditationCoachExpiryDate": null,
		"isPrerequestTrainingComplete": null,
		"walkingNetballRefId": null,
		"walkingNetballInfo": null
	}
}

const competitionObj = {
	"organisationId": null,
	"competitionId": null,
	"organisationInfo": null,
	"competitionInfo": null,
	"registrationRestrictionTypeRefId": null,
	"regSetting": {
		"nominate_positions": 0,
		"play_friend": 0,
		"refer_friend": 0,
	},
	"products": [
		// {
		// 	"competitionMembershipProductId": null,
		// 	"competitionMembershipProductTypeId": null,
		// 		"competitionMembershipProductName": null,
		// 	"isSelected": false,
		// 	"isPlayer": 0
		// }
	],
	"divisionInfo":[
		// {
		// 	"competitionMembershipProductTypeId": null,
		// 	"competitionMembershipProductDivisionId": null,
		// 	"divisionName": null
		// }
	],
	"divisions": [
		// {
		// 	"competitionMembershipProductTypeId": null,
		// 	"competitionMembershipProductDivisionId": null
		// }
	],
	"fees": {
		"totalCasualFee": null,
		"totalSeasonalFee": null
	},
	"positionId1": null,
	"positionId2": null,
	"friends": [
		// {
		// 	"firstName": null,
		// 	"lastName": null,
		// 	"mobileNumber": null,
		// 	"email": null
		// }
	],
	"referFriends": [
		// {
		// 	"firstName": null,
		// 	"lastName": null,
		// 	"mobileNumber": null,
		// 	"email": null
		// }
	]
}

const initialState = {
	onLoad:false,
    registrationObj: null,
    userInfo: [],
	userInfoOnLoad: false,
	membershipProductInfo: [],
	addCompetitionFlag: false,
	registrationId: null,
	isSavedParticipant: false,
	saveValidationErrorMsg: null,
	saveValidationErrorCode: null,
	onMembershipLoad: false,
	onParticipantByIdLoad: false,
	lastAddedCompetitionIndex: null,
	updateExistingUserOnLoad: false,
}

function getUserUpdatedRegistrationObj(state,action){
	try{
		let registrationObj = deepCopyFunction(registrationObjTemp);
		if(action.data != -1 && action.data != -2){
			let selectedUser = state.userInfo.find((user) => user.id == action.data);
			registrationObj.firstName = selectedUser.firstName;
			registrationObj.lastName = selectedUser.lastName;
			registrationObj.email = selectedUser.email;
			registrationObj.genderRefId = selectedUser.genderRefId;
			registrationObj.profileUrl = selectedUser.photoUrl;
			registrationObj.dateOfBirth = selectedUser.dateOfBirth;
			registrationObj.mobileNumber = selectedUser.mobileNumber;
			if(selectedUser.street1 && selectedUser.suburb && selectedUser.postalCode){
				registrationObj.selectAddressFlag = true;
				registrationObj.street1 = selectedUser.street1;
				registrationObj.street2 = selectedUser.street2;
				registrationObj.suburb = selectedUser.suburb;
				registrationObj.postalCode = selectedUser.postalCode;	
				registrationObj.stateRefId = selectedUser.stateRefId;
				registrationObj.countryRefId = selectedUser.countryRefId;
			}
			if(selectedUser.parentOrGuardian != null && selectedUser.parentOrGuardian.length > 0){
				let i = 0;
				for(let parent of selectedUser.parentOrGuardian){
					let parentObj = {
						"tempParentId": i,
						"firstName": parent.firstName,
						"lastName": parent.lastName,
						"mobileNumber": parent.mobileNumber,
						"email": parent.email,
						"street1": parent.street1,
						"street2": parent.street2,
						"suburb": parent.suburb,
						"stateRefId": parent.stateRefId,
						"countryRefId": parent.countryRefId,
						"postalCode": parent.postalCode,
						"selectAddressFlag": true,
						"addNewAddressFlag": false,
						"manualEnterAddressFlag": false
					}
					registrationObj.parentOrGuardian.push(parentObj);
					i++;
				}
			}
			registrationObj.registeringYourself = selectedUser.additionalInfo.registeringYourselfRefId == null ? 1 : selectedUser.additionalInfo.registeringYourselfRefId;
			registrationObj.additionalInfo.countryRefId = selectedUser.additionalInfo.countryRefId;
			registrationObj.additionalInfo.identifyRefId = selectedUser.additionalInfo.identifyRefId
			registrationObj.additionalInfo.injuryInfo = selectedUser.additionalInfo.injuryInfo;
			registrationObj.additionalInfo.allergyInfo = selectedUser.additionalInfo.allergyInfo;
			registrationObj.additionalInfo.otherSportsInfo = selectedUser.additionalInfo.otherSportsInfo;
			registrationObj.additionalInfo.existingMedicalCondition = selectedUser.additionalInfo.existingMedicalCondition;
			registrationObj.additionalInfo.regularMedication = selectedUser.additionalInfo.regularMedication;
			registrationObj.additionalInfo.heardByRefId = selectedUser.additionalInfo.heardByRefId;
			registrationObj.additionalInfo.favouriteTeamRefId = selectedUser.additionalInfo.favouriteTeamRefId;
			registrationObj.additionalInfo.favouriteFireBird = selectedUser.additionalInfo.favouriteFireBird;
			registrationObj.additionalInfo.isConsentPhotosGiven = selectedUser.additionalInfo.isConsentPhotosGiven;
			registrationObj.additionalInfo.isDisability = selectedUser.additionalInfo.isDisability;
			registrationObj.additionalInfo.disabilityCareNumber = selectedUser.additionalInfo.disabilityCareNumber;
			registrationObj.additionalInfo.disabilityTypeRefId = selectedUser.additionalInfo.disabilityTypeRefId;
			registrationObj.additionalInfo.yearsPlayed = selectedUser.additionalInfo.yearsPlayed;
			registrationObj.additionalInfo.schoolId = selectedUser.additionalInfo.schoolId;
			registrationObj.additionalInfo.isParticipatedInSSP = selectedUser.additionalInfo.isParticipatedInSSP;
			registrationObj.additionalInfo.accreditationLevelUmpireRefId = selectedUser.additionalInfo.accreditationLevelUmpireRefId;
			registrationObj.additionalInfo.associationLevelInfo = selectedUser.additionalInfo.associationLevelInfo;
			registrationObj.additionalInfo.accreditationUmpireExpiryDate = selectedUser.additionalInfo.accreditationUmpireExpiryDate;
			registrationObj.additionalInfo.isPrerequestTrainingComplete = selectedUser.additionalInfo.isPrerequestTrainingComplete;
			registrationObj.additionalInfo.accreditationLevelCoachRefId = selectedUser.additionalInfo.accreditationLevelCoachRefId;
			registrationObj.additionalInfo.accreditationCoachExpiryDate = selectedUser.additionalInfo.accreditationCoachExpiryDate;
			registrationObj.additionalInfo.childrenCheckNumber = selectedUser.additionalInfo.childrenCheckNumber;
			registrationObj.additionalInfo.childrenCheckExpiryDate = selectedUser.additionalInfo.childrenCheckExpiryDate;
			registrationObj.additionalInfo.walkingNetballRefId = selectedUser.additionalInfo.walkingNetballRefId;
			registrationObj.additionalInfo.walkingNetballInfo = selectedUser.additionalInfo.walkingNetballInfo;
			state.updateExistingUserOnLoad = true;
		}else{
			registrationObj.selectAddressFlag = false;
			registrationObj.addNewAddressFlag = true;
		}
		return registrationObj;
	}catch(ex){
		console.log("Error in getUserUpdatedRegistrationObj in userRegistrationReducer"+ex);
	}
}

function setMembershipProductsInfo(state,organisationData){
	try{
		let competition = deepCopyFunction(competitionObj);
		let membershipProductInfo = deepCopyFunction(state.membershipProductInfo);
		if(organisationData == undefined){
			if(getOrganisationId() != null && getCompetitonId() != null){
				competition.organisationId = getOrganisationId();
				competition.competitionId = getCompetitonId();
				let organisatinInfoTemp = membershipProductInfo.find(x => x.organisationUniqueKey == competition.organisationId);
				competition.organisationInfo = organisatinInfoTemp;
				let competitionInfoTemp = competition.organisationInfo.competitions.find(x => x.competitionUniqueKey == competition.competitionId);
				competition.competitionInfo = competitionInfoTemp;
				competition.registrationRestrictionTypeRefId = competition.competitionInfo.registrationRestrictionTypeRefId;
				state.registrationObj.competitions.push(competition);
				state.lastAddedCompetitionIndex = state.registrationObj.competitions.length - 1;
				state.addCompetitionFlag = true; 
			}
		}else{
			competition.organisationId = organisationData.organisationInfo.organisationUniqueKey;
			competition.competitionId = organisationData.competitionInfo.competitionUniqueKey;
			competition.organisationInfo = organisationData.organisationInfo;
			competition.competitionInfo = organisationData.competitionInfo;
			competition.registrationRestrictionTypeRefId = competition.competitionInfo.registrationRestrictionTypeRefId;
			if(!organisationData.findAnotherCompetition){
				state.registrationObj.competitions.push(competition);
			}else{
				state.registrationObj.competitions[0] = competition;
			}
			state.lastAddedCompetitionIndex = state.registrationObj.competitions.length - 1;
			state.addCompetitionFlag = true; 
		}
	}catch(ex){
		console.log("Error in setMembershipProductsInfo in userRegistrationReducer"+ex);
	}
}

function getFilteredDivisions(divisions,state){
	try{
		let filteredDivisions = [];
		let genderRefId = state.registrationObj.genderRefId;
		var date = moment(state.registrationObj.dateOfBirth, "DD/MM/YYYY");
		for(let division of divisions){
			if(division.genderRefId != null && (division.fromDate == null || division.toDate == null)){
				if(division.genderRefId == genderRefId || genderRefId == 3){
					let div = {
						"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
						"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
						"divisionName": division.divisionName
					}      
					filteredDivisions.push(div);
				}
			}else if(division.genderRefId == null && (division.fromDate != null && division.toDate != null)){
				var startDate = moment(division.fromDate, "YYYY-MM-DD");
				var endDate = moment(division.toDate, "YYYY-MM-DD");
				if (date.isBefore(endDate) && date.isAfter(startDate) || (date.isSame(startDate) || date.isSame(endDate))){
					let div = {
						"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
						"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
						"divisionName": division.divisionName
					}      
					filteredDivisions.push(div);
				}
			}else if(division.genderRefId != null && (division.fromDate != null && division.toDate != null)){
				var startDate = moment(division.fromDate, "YYYY-MM-DD");
				var endDate = moment(division.toDate, "YYYY-MM-DD");
				if ((date.isBefore(endDate) && date.isAfter(startDate) || (date.isSame(startDate) || date.isSame(endDate))) 
					&& (division.genderRefId == genderRefId || genderRefId == 3)){
						let div = {
							"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
							"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
							"divisionName": division.divisionName
						}      
						filteredDivisions.push(div);
				}
			}else{
				let div = {
					"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
					"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
					"divisionName": division.divisionName
				}      
				filteredDivisions.push(div); 
			}
		}
		return filteredDivisions;
	}catch(ex){
		console.log("Error in getFilteredDivisions in userRegistrationReducer"+ex);
	}
}

function setMembershipProductsAndDivisionInfo(state,competitionData,competitionIndex,competitionSubIndex){
	try{
		let competitionInfo = state.registrationObj.competitions[competitionIndex].competitionInfo;
		let membershipProductInfo = competitionInfo.membershipProducts[competitionSubIndex];
		membershipProductInfo.isChecked = competitionData;
		if(membershipProductInfo.isPlayer == 1){
			if(competitionData){
				let product = {
					"competitionMembershipProductId": membershipProductInfo.competitionMembershipProductId,
					"competitionMembershipProductTypeId": membershipProductInfo.competitionMembershipProductTypeId,
					"competitionMembershipProductName": membershipProductInfo.shortName,
					"isSelected": competitionData,
					"isPlayer": membershipProductInfo.isPlayer	
				}
				state.registrationObj.competitions[competitionIndex].products.push(product);
				let divisionInfoList = state.registrationObj.competitions[competitionIndex].divisionInfo;
				divisionInfoList.push.apply(divisionInfoList,getFilteredDivisions(membershipProductInfo.divisions,state));
			}else{
				let registrationObjProducts = state.registrationObj.competitions[competitionIndex].products;
				let registrationObjDivisionInfo = state.registrationObj.competitions[competitionIndex].divisionInfo;
				let registrationObjDivisions = state.registrationObj.competitions[competitionIndex].divisions;
				let filteredProducts = registrationObjProducts.filter(product => product.competitionMembershipProductTypeId != membershipProductInfo.competitionMembershipProductTypeId);					
				state.registrationObj.competitions[competitionIndex].products = filteredProducts;
				let filteredDivisionInfo = registrationObjDivisionInfo.filter(divisionInfo => divisionInfo.competitionMembershipProductTypeId != membershipProductInfo.competitionMembershipProductTypeId);
				state.registrationObj.competitions[competitionIndex].divisionInfo = filteredDivisionInfo;
				let filteredDivisions = registrationObjDivisions.filter(division => division.competitionMembershipProductTypeId != membershipProductInfo.competitionMembershipProductTypeId);
				state.registrationObj.competitions[competitionIndex].divisions = filteredDivisions;
			}
		}
	}catch(ex){
		console.log("Error in setMembershipProductsAndDivisionInfo in userRegistrationReducer"+ex);
	}
}

function updateUmpireCoachWalkingNetball(state){
	try{
		state.registrationObj.umpireFlag = state.registrationObj.competitions.find(x => 
			x.products.find(y => y.competitionMembershipProductName == "Umpire")) ? 1 : 0;
		state.registrationObj.coachFlag = state.registrationObj.competitions.find(x => 
			x.products.find(y => y.competitionMembershipProductName == "Coach")) ? 1 : 0;
		state.registrationObj.walkingNetballFlag = state.registrationObj.competitions.find(x => 
			x.products.find(y => y.competitionMembershipProductName == "Walking Netball")) ? 1 : 0;
	}catch(ex){
		console.log("Error in updateUmpireCoachWalkingNetball in userRegistrationReducer"+ex);
	}
}

function updateParticipantByIdByMembershipInfo(state,partcipantData){
	try{
		let membershipProductInfo = deepCopyFunction(state.membershipProductInfo);
		for(let competition of partcipantData.competitions){
			let organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == competition.organisationId);
			competition.organisationInfo = organisationInfo;
			let competitionInfo = competition.organisationInfo.competitions.find(x => x.competitionUniqueKey == competition.competitionId);
			competition.competitionInfo = competitionInfo;
			for(let product of competition.products){
				let membershipProduct = competition.competitionInfo.membershipProducts.find(x => x.competitionMembershipProductId == product.competitionMembershipProductId)
				if(membershipProduct != undefined){
					membershipProduct.isChecked = true;
				}
			}
		}
		return partcipantData;
	}catch(ex){
		console.log("Error in updateParticipantByIdByMembershipInfo in userRegistrationReducer"+ex);
	}
}

function checkByDateOfBirth(state,dateOfBirth){
	try{
		state.registrationObj.dateOfBirth = dateOfBirth;
		if(getAge(dateOfBirth) < 18){
			state.registrationObj.referParentEmail = true;
		}else{
			state.registrationObj.referParentEmail = false;
		}
		let competitions = state.registrationObj.competitions;
		for(let competition of competitions){
			competition.products = [];
			competition.divisionInfo = [];
			competition.divisions = [];
			for(let membershipProduct of competition.competitionInfo.membershipProducts){
				membershipProduct.isChecked = false;
			}
		}
	}catch(ex){
		console.log("Error in checkByDateOfBirth in userRegistrationReducer"+ex);
	}
}

function checkByGender(state,genderRefId){
	try{
		state.registrationObj.genderRefId = genderRefId;
		let competitions = state.registrationObj.competitions;
		for(let competition of competitions){
			competition.products = [];
			competition.divisionInfo = [];
			competition.divisions = [];
			for(let membershipProduct of competition.competitionInfo.membershipProducts){
				membershipProduct.isChecked = false;
			}
		}
	}catch(ex){
		console.log("Error in checkByGender"+ex);
	}
}

function setRegistrationSetting(state,settings){
	try{
		let registrationObj = state.registrationObj;
		let competition = registrationObj.competitions[state.lastAddedCompetitionIndex];
		let settingKeys = Object.keys(settings);
		for(let key of settingKeys){
			if(registrationObj.regSetting[key] == 0){
				registrationObj.regSetting[key] = settings[key];
			}
			if(competition.regSetting[key] == 0){
				competition.regSetting[key] = settings[key];
			}
		}
	}catch(ex){
		console.log("Error in setRegistrationSetting in userRegistrationReducer"+ex);
	}
}

function userRegistrationReducer(state = initialState, action){
    switch(action.type){
        case ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD:
            return { ...state, userInfoOnLoad: true };

        case ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_SUCCESS:
            let userInfoData = action.result;
            return {
                ...state,
                userInfoOnLoad: false,
                status: action.status,
                userInfo: userInfoData
			};
			
		case ApiConstants.SELECT_PARTICIPANT: 
			registrationObjTemp[action.key] = action.data;
			state.registrationObj = getUserUpdatedRegistrationObj(state,action);
			setMembershipProductsInfo(state);
			return { 
				...state 
			}
		
		case ApiConstants.UPDATE_USER_REGISTATION_OBJECT: 
			let value = action.data;
			let key = action.key;
			if(key == "registrationObj"){
				state.registrationObj = value;
			}else if(key == "competitions"){
				setMembershipProductsInfo(state,value)
			}else if(key == "dateOfBirth"){
				checkByDateOfBirth(state,value);
			}else if(key == "genderRefId"){
				checkByGender(state,value);
			}else{
				state.registrationObj[key] = value;
			}
			return { 
				...state
			}

		case ApiConstants.API_GET_PARTICIPANT_BY_ID_LOAD:
			return { ...state, onParticipantByIdLoad: true };

		case ApiConstants.API_GET_PARTICIPANT_BY_ID_SUCCESS:
			let participantData = action.result;
			return {
				...state,
				onParticipantByIdLoad: false,
				status: action.status,
				registrationObj: updateParticipantByIdByMembershipInfo(state,participantData)
			};

		case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
			return { ...state, onMembershipLoad: true };

		case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
			let data = action.result;
			return {
				...state,
				onMembershipLoad: false,
				status: action.status,
				membershipProductInfo: data
			};

		case ApiConstants.UPDATE_PARTICIPANT_COMPETITION_OBJECT: 
			let competitionData = action.data;
			let competitionKey = action.key;
			let competitionIndex = action.index;
			let competitionSubIndex = action.subIndex;
			let competitionSubKey = action.subKey;
			if(competitionKey == "products"){
				setMembershipProductsAndDivisionInfo(state,competitionData,
					competitionIndex,competitionSubIndex);;
				updateUmpireCoachWalkingNetball(state);
			}
			else if(competitionKey == "divisionInfo"){
				let divisionInfoTemp = state.registrationObj.competitions[competitionIndex].divisionInfo;
				let divisionInfo = divisionInfoTemp.find(x => x.competitionMembershipProductDivisionId == competitionData);
				state.registrationObj.competitions[competitionIndex].divisions.push(divisionInfo);
			}
			else if(competitionKey == "divisions"){
				state.registrationObj.competitions[competitionIndex].divisions.splice(competitionSubIndex,1);
			}
			else if(competitionSubKey == "friends"){
				state.registrationObj.competitions[competitionIndex].friends[competitionSubIndex][competitionKey] = competitionData;
			}
			else if(competitionSubKey == "referFriends"){
				state.registrationObj.competitions[competitionIndex].referFriends[competitionSubIndex][competitionKey] = competitionData;
			}
			else if(competitionKey == "competition"){
				state.registrationObj.competitions.splice(competitionIndex,1);
			}
			else{
				state.registrationObj.competitions[competitionIndex][competitionKey] = competitionData;
			}
			return {
				...state
			};
		
		case ApiConstants.UPDATE_USER_REGISTRATION_STATE_VAR:
			let stateKey = action.key;
			let stateData = action.data;
			state[stateKey] = stateData;
			return {
				...state
			};

		case ApiConstants.UPDATE_PARTICIPANT_ADDITIONAL_INFO: 
			let additionalInfoKey = action.key;
			let additionalInfoData = action.data;
			state.registrationObj.additionalInfo[additionalInfoKey] = additionalInfoData;
			return {
				...state
			};

		case ApiConstants.API_SAVE_PARTICIPANT_LOAD:
			return { ...state, onLoad: true };

		case ApiConstants.API_GET_PARTICIPANT_SUCCESS:
			state.registrationId = action.result ? action.result.id : null;
            state.saveValidationErrorMsg = action.result ? action.result.errorMsg : null;
			state.saveValidationErrorCode = action.result ? action.result.errorCode : null;
			return {
				...state,
				onLoad: false,
				status: action.status,
				isSavedParticipant: true
			};

			case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD:
				return { ...state, onLoad: true };
	
			case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS:
				let registrationSettings = action.result;
				setRegistrationSetting(state,registrationSettings);
				return {
					...state,
					onLoad: false,
					status: action.status
				};

        default:
            return state;
    }
}

export default userRegistrationReducer;