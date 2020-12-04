import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";
import { getOrganisationId,  getCompetitonId, getUserId } from "../../../util/sessionStorage.js";
import { deepCopyFunction, getAge, isNullOrEmptyString} from '../../../util/helpers';
import moment from 'moment';

let walkingNetballObj = {
	// "haveHeartTrouble" : null,
	// "havePainInHeartOrChest" : null,
	// "haveSpellsOfServerDizziness" : null,
	// "hasBloodPressureHigh" : null,
	// "hasBoneProblems" : null,
	// "whyShouldNotTakePhysicalActivity" : null,
	// "pregnentInLastSixMonths" : null,
	// "sufferAnyProblems" : null,
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

let registrationObjTemp = {
    "registrationId": null,
    "participantId": null,
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
	"photoUrl": null,
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
	"parentOrGuardian": [],
	"tempParents": [],
	"competitions": [],
	"emergencyFirstName": null,
	"emergencyLastName": null,
	"emergencyContactNumber": null,
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
		"heardByOther": null,
		"favouriteTeamRefId": null,
		"favouriteFireBird": null,
		"isConsentPhotosGiven": false,
		"isDisability": null,
		"disabilityCareNumber": null,
		"childrenCheckNumber": null,
		"childrenCheckExpiryDate": null,
		"lastCaptainName": null,
		"countryRefId": 1,
		"identifyRefId": null,
		"injuryInfo": null,
		"allergyInfo": null,
		"otherSportsInfo": [],
		"otherSports": null,
		"isYearsPlayed": null,
		"yearsPlayed": '2',
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
		//"walkingNetballRefId": null,
		"walkingNetball": deepCopyFunction(walkingNetballObj),
		"walkingNetballInfo": null
	}
}

const competitionObj = {
	"organisationId": null,
	"competitionId": null,
	"organisationInfo": null,
	"competitionInfo": null,
	"registrationRestrictionTypeRefId": null,
	"divisionInfoIndex": null,
	"regSetting": {
		"nominate_positions": 0,
		"play_friend": 0,
		"refer_friend": 0,
	},
	"products": [
		// {
		// 	"competitionMembershipProductId": null,
		// 	"competitionMembershipProductTypeId": null,
		// 		"membershipTypeName": null,
		// 	"isChecked": false,
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
		"totalCasualFee": "0.00",
		"totalSeasonalFee": "0.00"
	},
	"positionId1": null,
	"positionId2": null,
	"friends": [],
	"referFriends": []
}

let friendObj = {
	"firstName": null,
	"lastName": null,
	"middleName": null,
	"mobileNumber": null,
	"email": null
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
	onSaveLoad: false,
	parents: [],
	registeredParents: [],
	expiredRegistrationFlag: false,
	expiredRegistration: null,
	seasionalAndCasualFeesInputObj : null,
	enableSeasonalAndCasualService: false,
	getSeasonalCasualFeesOnLoad: false,
	seasonalAndCasualFeesCompetitionIndex: null,
	individualCompetitionNotExist: false
}

function getUserUpdatedRegistrationObj(state,action,key,registeringYourself){
	try{
		let registrationObj;
		if(key == "registeringYourself" && registeringYourself == 1){
			//For prepopulate loginned user when select registeringYourself as true
			registrationObj = state.registrationObj;
			registrationObj.userId = getUserId();
		}else{
			registrationObj = deepCopyFunction(registrationObjTemp);
		}
		if((action.data != -1) || (getUserId() != 0 && registrationObj.registeringYourself == 1)){
			let selectedUser = state.userInfo.find((user) => user.id == action.data);
			registrationObj.firstName = selectedUser.firstName;
			registrationObj.lastName = selectedUser.lastName;
			registrationObj.email = selectedUser.email;
			registrationObj.genderRefId = selectedUser.genderRefId;
			registrationObj.photoUrl = selectedUser.photoUrl;
			registrationObj.dateOfBirth = selectedUser.dateOfBirth;
			registrationObj.mobileNumber = selectedUser.mobileNumber;
			registrationObj.emergencyFirstName = selectedUser.emergencyFirstName;
            registrationObj.emergencyLastName = selectedUser.emergencyLastName;
            registrationObj.emergencyContactNumber = selectedUser.emergencyContactNumber;
			if(selectedUser.stateRefId){
				registrationObj.selectAddressFlag = true;
				registrationObj.addNewAddressFlag = false;
				registrationObj.street1 = selectedUser.street1;
				registrationObj.street2 = selectedUser.street2;
				registrationObj.suburb = selectedUser.suburb;
				registrationObj.postalCode = selectedUser.postalCode;	
				registrationObj.stateRefId = selectedUser.stateRefId;
				registrationObj.countryRefId = selectedUser.countryRefId;
			}else{
				registrationObj.selectAddressFlag = false;
				registrationObj.addNewAddressFlag = true;
			}
			if(selectedUser.parentOrGuardian != null && selectedUser.parentOrGuardian.length > 0){
				let i = 0;
				for(let parent of selectedUser.parentOrGuardian){
					let parentObj = {
						"tempParentId": i,
						"userId": parent.userId,
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
						"selectAddressFlag": (parent.stateRefId) ? true : false,
						"addNewAddressFlag": (parent.stateRefId) ? false : true,
						"manualEnterAddressFlag": false
					}
					registrationObj.parentOrGuardian.push(parentObj);
					i++;
				}
			}
			registrationObj.registeringYourself = selectedUser.additionalInfo.registeringYourselfRefId == null ? 1 : selectedUser.additionalInfo.registeringYourselfRefId;
			registrationObj.additionalInfo.countryRefId = selectedUser.additionalInfo.countryRefId;
			registrationObj.additionalInfo.identifyRefId = selectedUser.additionalInfo.identifyRefId;
			registrationObj.additionalInfo.injuryInfo = selectedUser.additionalInfo.injuryInfo;
			registrationObj.additionalInfo.allergyInfo = selectedUser.additionalInfo.allergyInfo;
			registrationObj.additionalInfo.otherSportsInfo = selectedUser.additionalInfo.otherSportsInfo ? selectedUser.additionalInfo.otherSportsInfo : [];
			registrationObj.additionalInfo.existingMedicalCondition = selectedUser.additionalInfo.existingMedicalCondition;
			registrationObj.additionalInfo.regularMedication = selectedUser.additionalInfo.regularMedication;
			registrationObj.additionalInfo.heardByRefId = selectedUser.additionalInfo.heardByRefId;
			if(registrationObj.additionalInfo.heardByRefId == 6){
				registrationObj.additionalInfo.heardByOther = selectedUser.additionalInfo.heardByOther;
			}
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
		if(organisationData == undefined){
			let membershipProductInfo = deepCopyFunction(state.membershipProductInfo);
			if(getOrganisationId() != null && getCompetitonId() != null){
				competition.organisationId = getOrganisationId();
				competition.competitionId = getCompetitonId();
				let organisatinInfoTemp = membershipProductInfo.find(x => x.organisationUniqueKey == competition.organisationId);
				if(organisatinInfoTemp != undefined){
					competition.organisationInfo = organisatinInfoTemp;
					let competitionInfoTemp = competition.organisationInfo.competitions.find(x => x.competitionUniqueKey == competition.competitionId);
					if(competitionInfoTemp != undefined){
						competition.competitionInfo = competitionInfoTemp;
						competition.registrationRestrictionTypeRefId = competition.competitionInfo.registrationRestrictionTypeRefId;
						state.registrationObj.competitions.push(competition);
						state.lastAddedCompetitionIndex = state.registrationObj.competitions.length - 1;
						state.addCompetitionFlag = true; 
					}
					// else{
					// 	state.expiredRegistrationFlag = true;
					// }
				}
				// else{
				// 	state.expiredRegistrationFlag = true;
				// }
			}
		}else{
			competition.organisationId = organisationData.organisationInfo.organisationUniqueKey;
			competition.competitionId = organisationData.competitionInfo.competitionUniqueKey;
			competition.organisationInfo = deepCopyFunction(organisationData.organisationInfo);
			competition.competitionInfo = deepCopyFunction(organisationData.competitionInfo);
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

function initiateExpiredRegistrationCall(state,membershipProductsInfoList){
	try{
		if(getOrganisationId() != null && getCompetitonId() != null){
			let organisatinInfoTemp = membershipProductsInfoList.find(x => x.organisationUniqueKey == getOrganisationId());
			if(organisatinInfoTemp){
				let competitionInfoTemp = organisatinInfoTemp.competitions.find(x => x.competitionUniqueKey == getCompetitonId());
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

function checkExistInFilteredOrgList(state,individualRegMembershipInfo){
	try{
		let organisation = individualRegMembershipInfo.find(x => x.organisationUniqueKey == getOrganisationId());
		if(organisation){
			let competition = organisation.competitions.find(x => x.competitionUniqueKey == getCompetitonId());
			if(competition == undefined){
				state.individualCompetitionNotExist = true;
			}
		}else{
			state.individualCompetitionNotExist = true;
		}
	}catch(ex){
		console.log("Error in checkExistInFilteredOrgList::"+ex)
	}
}

function getFilteredDivisions(divisions,state){
	try{
		let filteredDivisions = [];
		let genderRefId = state.registrationObj.genderRefId;
		var date = moment(state.registrationObj.dateOfBirth, "DD/MM/YYYY");
		for(let division of divisions){
			if(division.registrationLock == 0 && division.isIndividualRegistration == 1){
				if(division.genderRefId != null && (division.fromDate == null || division.toDate == null)){
					if(division.genderRefId == genderRefId || genderRefId == 3){
						let div = {
							"competitionMembershipProductId": division.competitionMembershipProductId,
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
							"competitionMembershipProductId": division.competitionMembershipProductId,
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
								"competitionMembershipProductId": division.competitionMembershipProductId,
								"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
								"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
								"divisionName": division.divisionName
							}      
							filteredDivisions.push(div);
					}
				}else{
					let div = {
						"competitionMembershipProductId": division.competitionMembershipProductId,
						"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
						"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId,
						"divisionName": division.divisionName
					}      
					filteredDivisions.push(div); 
				}
			}
		}
		console.log("filtered division",filteredDivisions)
		return filteredDivisions;
	}catch(ex){
		console.log("Error in getFilteredDivisions in userRegistrationReducer"+ex);
	}
}

function setSeasonalFeeAndCasualFeeInput(state,competitionIndex,fromNonProductsOrDivisions,actionCheckBoxProduct){
	try{
		let registrationObjTemp = deepCopyFunction(state.registrationObj);
		let competition = registrationObjTemp.competitions[competitionIndex];
		let selectedInSameCompetition = state.seasionalAndCasualFeesInputObj ? 
					(state.seasionalAndCasualFeesInputObj.organisationId == competition.organisationId) && (state.seasionalAndCasualFeesInputObj.competitionId == competition.competitionId) : false;
		if(selectedInSameCompetition){
			if(fromNonProductsOrDivisions == 1){
				state.seasionalAndCasualFeesInputObj.competitionMembershipProductTypes = state.seasionalAndCasualFeesInputObj.competitionMembershipProductTypes.filter(x => x.isPlayer != 0);
				let products = registrationObjTemp.competitions[competitionIndex].products;
				for(let product of products){
					if(product.isPlayer == 0){
						let obj = {
							"competitionMembershipProductId": product.competitionMembershipProductId,
							"isPlayer": product.isPlayer,
							"competitionMembershipProductTypeId": product.competitionMembershipProductTypeId,
							"competitionMembershipProductDivisionId": null
						}
						state.seasionalAndCasualFeesInputObj.competitionMembershipProductTypes.push(obj);
					}
				}
				if(actionCheckBoxProduct.isPlayer != 1){
					state.seasonalAndCasualFeesCompetitionIndex = competitionIndex;
					state.enableSeasonalAndCasualService = true;
				}
			}else if(fromNonProductsOrDivisions == 2){
				state.seasionalAndCasualFeesInputObj.competitionMembershipProductTypes = state.seasionalAndCasualFeesInputObj.competitionMembershipProductTypes.filter(x => x.isPlayer != 1);
				let divisions = registrationObjTemp.competitions[competitionIndex].divisions;
				for(let division of divisions){
					let obj = {
						"competitionMembershipProductId": division.competitionMembershipProductId,
						"isPlayer": 1,
						"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
						"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId
					}
					state.seasionalAndCasualFeesInputObj.competitionMembershipProductTypes.push(obj);
				}
				state.seasonalAndCasualFeesCompetitionIndex = competitionIndex;
				state.enableSeasonalAndCasualService = true;
			}
		}else{
			let seasionalAndCasualFeesInputObjTemp = deepCopyFunction(seasionalAndCasualFeesInputObj);
			seasionalAndCasualFeesInputObjTemp.organisationId = competition.organisationId;
			seasionalAndCasualFeesInputObjTemp.competitionId = competition.competitionId;
			let products = registrationObjTemp.competitions[competitionIndex].products;
			if(fromNonProductsOrDivisions == 1){
				for(let product of products){
					if(product.isPlayer == 0){
						let obj = {
							"competitionMembershipProductId": product.competitionMembershipProductId,
							"isPlayer": product.isPlayer,
							"competitionMembershipProductTypeId": product.competitionMembershipProductTypeId,
							"competitionMembershipProductDivisionId": null
						}
						seasionalAndCasualFeesInputObjTemp.competitionMembershipProductTypes.push(obj);
					}
				}
				state.seasionalAndCasualFeesInputObj = seasionalAndCasualFeesInputObjTemp;
				if(actionCheckBoxProduct.isPlayer != 1){
					state.seasonalAndCasualFeesCompetitionIndex = competitionIndex;
					state.enableSeasonalAndCasualService = true;
				}
			}else if(fromNonProductsOrDivisions == 2){
				let divisions = registrationObjTemp.competitions[competitionIndex].divisions;
				for(let division of divisions){
					let obj = {
						"competitionMembershipProductId": division.competitionMembershipProductId,
						"isPlayer": 1,
						"competitionMembershipProductTypeId": division.competitionMembershipProductTypeId,
						"competitionMembershipProductDivisionId": division.competitionMembershipProductDivisionId
					}
					seasionalAndCasualFeesInputObjTemp.competitionMembershipProductTypes.push(obj);
				}
				state.seasionalAndCasualFeesInputObj = seasionalAndCasualFeesInputObjTemp;
				state.seasonalAndCasualFeesCompetitionIndex = competitionIndex;
				state.enableSeasonalAndCasualService = true;
			}
		}
	}catch(ex){
		console.log("Error in setSeasonalFeeAndCasualFeeInput::"+ex);
	}
}

function setMembershipProductsAndDivisionInfo(state,competitionData,competitionIndex,competitionSubIndex){
	try{
		let competitionInfo = state.registrationObj.competitions[competitionIndex].competitionInfo;
		let membershipProductInfo = competitionInfo.membershipProducts[competitionSubIndex];
		membershipProductInfo.isChecked = competitionData;
		let actionCheckBoxProduct;
		if(competitionData){
			let product = {
				"competitionMembershipProductId": membershipProductInfo.competitionMembershipProductId,
				"competitionMembershipProductTypeId": membershipProductInfo.competitionMembershipProductTypeId,
				"membershipTypeName": membershipProductInfo.shortName,
				"isChecked": competitionData,
				"isPlayer": membershipProductInfo.isPlayer	
			}
			actionCheckBoxProduct = product;
			state.registrationObj.competitions[competitionIndex].products.push(product);
			if(membershipProductInfo.isPlayer == 1){
				let divisionInfoList = state.registrationObj.competitions[competitionIndex].divisionInfo;
				divisionInfoList.push.apply(divisionInfoList,getFilteredDivisions(membershipProductInfo.divisions,state));
			}

			setSeasonalFeeAndCasualFeeInput(state,competitionIndex,1,actionCheckBoxProduct)
		}else{
			let registrationObjProducts = state.registrationObj.competitions[competitionIndex].products;
			let registrationObjDivisionInfo = state.registrationObj.competitions[competitionIndex].divisionInfo;
			let registrationObjDivisions = state.registrationObj.competitions[competitionIndex].divisions;

			//for prevent loading in fees
			actionCheckBoxProduct = registrationObjProducts.find(product => product.competitionMembershipProductTypeId == membershipProductInfo.competitionMembershipProductTypeId);	
			let filteredProducts = registrationObjProducts.filter(product => product.competitionMembershipProductTypeId != membershipProductInfo.competitionMembershipProductTypeId);
			if(filteredProducts != undefined){
				state.registrationObj.competitions[competitionIndex].products = filteredProducts;
			}	
			let filteredDivisionInfo = registrationObjDivisionInfo.filter(divisionInfo => divisionInfo.competitionMembershipProductTypeId != membershipProductInfo.competitionMembershipProductTypeId);
			if(filteredDivisionInfo != undefined){
				state.registrationObj.competitions[competitionIndex].divisionInfo = filteredDivisionInfo;
			}
			let filteredDivisions = registrationObjDivisions.filter(division => division.competitionMembershipProductTypeId != membershipProductInfo.competitionMembershipProductTypeId);
			if(filteredDivisions != undefined){
				state.registrationObj.competitions[competitionIndex].divisions = filteredDivisions;
			}

			if(actionCheckBoxProduct.isPlayer == 0){
				setSeasonalFeeAndCasualFeeInput(state,competitionIndex,1,actionCheckBoxProduct)
			}else{
				setSeasonalFeeAndCasualFeeInput(state,competitionIndex,2,actionCheckBoxProduct)
			}
		}
		
		
	}catch(ex){
		console.log("Error in setMembershipProductsAndDivisionInfo in userRegistrationReducer"+ex);
	}
}

function updateUmpireCoachWalkingNetball(state){
	try{
		state.registrationObj.umpireFlag = state.registrationObj.competitions.find(x => 
			x.products.find(y => y.membershipTypeName == "Umpire")) ? 1 : 0;
		state.registrationObj.coachFlag = state.registrationObj.competitions.find(x => 
			x.products.find(y => y.membershipTypeName == "Coach")) ? 1 : 0;
		state.registrationObj.walkingNetballFlag = state.registrationObj.competitions.find(x => 
			x.products.find(y => y.membershipTypeName == "Walking Netball" || y.membershipTypeName == "Player - Walking Netball")) ? 1 : 0;
	}catch(ex){
		console.log("Error in updateUmpireCoachWalkingNetball in userRegistrationReducer"+ex);
	}
}

function updateParticipantByIdByMembershipInfo(state,participantData){
	try{
		let membershipProductInfo = deepCopyFunction(state.membershipProductInfo);
		for(let competition of participantData.competitions){
			let organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == competition.organisationId);
			competition.organisationInfo = organisationInfo;
			let competitionInfo = competition.organisationInfo.competitions.find(x => x.competitionUniqueKey == competition.competitionId);
			competition.competitionInfo = competitionInfo;
			for(let product of competition.products){
				let membershipProduct = competition.competitionInfo.membershipProducts.find(x => x.competitionMembershipProductTypeId == product.competitionMembershipProductTypeId)
				if(membershipProduct != undefined){
					membershipProduct.isChecked = true;
				}
			}
		}
		state.parents = participantData.parents;
		return participantData;
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
		console.log(state.registrationObj);
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
		if(competition.regSetting.play_friend == 1){
			let playFriend = deepCopyFunction(friendObj);
			competition.friends.push(playFriend);
		}
		if(competition.regSetting.refer_friend == 1){
			let playFriend = deepCopyFunction(friendObj);
			competition.referFriends.push(playFriend);
		}
	}catch(ex){
		console.log("Error in setRegistrationSetting in userRegistrationReducer"+ex);
	}
}

function removeDivisionInfoIndexIfItHas(competitionIndex,competitionSubIndex,state){
	try{
		let division = state.registrationObj.competitions[competitionIndex].divisions[competitionSubIndex];
		let divisionInfoIndex = state.registrationObj.competitions[competitionIndex].divisionInfoIndex;
		if(divisionInfoIndex){
			let divisionInfo = state.registrationObj.competitions[competitionIndex].divisionInfo[divisionInfoIndex];
			let sameTypeId = division.competitionMembershipProductTypeId == divisionInfo.competitionMembershipProductTypeId ? true : false;
			let sameDivisonId = division.competitionMembershipProductDivisionId == divisionInfo.competitionMembershipProductDivisionId ? true : false;
			if(sameTypeId && sameDivisonId){
				return true;
			}else{
				return false;
			}
		}
	}catch(ex){
		console.log("Error in removeDivisionInfoIndexIfItHas::"+ex);
	}
}

function getIndividualMembershipInfo(organisationList){
	try{
		let filteredMembershipProductInfoTemp = [];
		for(let organisation of organisationList){
			for(let competition of organisation.competitions){
				let individualMembershipProduct = competition.membershipProducts.find(x => x.isIndividualRegistration == 1);
				if(individualMembershipProduct){
					let organisationExist = filteredMembershipProductInfoTemp.find(x => x.organisationUniqueKey == organisation.organisationUniqueKey);
					if(organisationExist){
						organisationExist.competitions.push(competition);
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
			}else if(key == "registeringYourself"){
				state.registrationObj[key] = value;
				if(getUserId() != 0){
					getUserUpdatedRegistrationObj(state,{data: getUserId()},"registeringYourself",state.registrationObj.registeringYourself);
				}
			}else{
				state.registrationObj[key] = value;
			}
			return { 
				...state
			}

		case ApiConstants.API_GET_PARTICIPANT_BY_ID_LOAD:
			return { ...state, onParticipantByIdLoad: true };

		case ApiConstants.API_GET_PARTICIPANT_BY_ID_SUCCESS:
			try{
				let responseData = action.result;
				let participantId = action.participantId;
				let registrationObjTemp = null;
				if(isNullOrEmptyString(participantId)){
					registrationObjTemp = updateParticipantByIdByMembershipInfo(state,responseData);
				}else{
					//Link previous participant parents for next participant 
					state.parents = responseData.parents;
					state.registeredParents = responseData.registeredParents;
				}
				return {
					...state,
					onParticipantByIdLoad: false,
					status: action.status,
					registrationObj: registrationObjTemp
				};
			}catch(ex){
				console.log("Error in success",ex);
			}
			

		case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD:
			return { ...state, onMembershipLoad: true };

		case ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS:
			let data = action.result;
			initiateExpiredRegistrationCall(state,data);
			let individualRegMembershipInfo = getIndividualMembershipInfo(data);
			if(getOrganisationId() && getCompetitonId()){
				checkExistInFilteredOrgList(state,individualRegMembershipInfo)
			}
			return {
				...state,
				onMembershipLoad: false,
				status: action.status,
				membershipProductInfo: individualRegMembershipInfo
			};

		case ApiConstants.UPDATE_PARTICIPANT_COMPETITION_OBJECT: 
			let competitionData = action.data;
			let competitionKey = action.key;
			let competitionIndex = action.index;
			let competitionSubIndex = action.subIndex;
			let competitionSubKey = action.subKey;
			let competitionSubData = action.subData;
			if(competitionKey == "products"){
				setMembershipProductsAndDivisionInfo(state,competitionData,
					competitionIndex,competitionSubIndex);
				updateUmpireCoachWalkingNetball(state);
			}
			else if(competitionKey == "divisionInfo"){
				let divisionInfoTemp = state.registrationObj.competitions[competitionIndex].divisionInfo;
				let divisionInfo = divisionInfoTemp.find(x => x.competitionMembershipProductDivisionId == competitionData && x.competitionMembershipProductTypeId == competitionSubData);
				state.registrationObj.competitions[competitionIndex].divisions.push(divisionInfo);
				setSeasonalFeeAndCasualFeeInput(state,competitionIndex,2)
			}
			else if(competitionKey == "divisions"){
				if(removeDivisionInfoIndexIfItHas(competitionIndex,competitionSubIndex,state)){
					state.registrationObj.competitions[competitionIndex].divisionInfoIndex = null
				}
				state.registrationObj.competitions[competitionIndex].divisions.splice(competitionSubIndex,1);
				setSeasonalFeeAndCasualFeeInput(state,competitionIndex,2)
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
			let additionalInfoSubKey = action.subKey;
			if(additionalInfoSubKey == "walkingNetball"){
				state.registrationObj.additionalInfo.walkingNetball[additionalInfoKey] = additionalInfoData;
			}else{
				if(additionalInfoKey == "isYearsPlayed"){
					if(additionalInfoData == 1){
						state.registrationObj.additionalInfo.yearsPlayed = '2';
					}
				}
				state.registrationObj.additionalInfo[additionalInfoKey] = additionalInfoData;
			}
			return {
				...state
			};

		case ApiConstants.API_SAVE_PARTICIPANT_LOAD:
			return { ...state, onSaveLoad: true };

		case ApiConstants.API_GET_PARTICIPANT_SUCCESS:
			state.registrationId = action.result ? action.result.id : null;
            state.saveValidationErrorMsg = action.result ? action.result.errorMsg : null;
			state.saveValidationErrorCode = action.result ? action.result.errorCode : null;
			return {
				...state,
				onSaveLoad: false,
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

			case ApiConstants.API_EXPIRED_REGISTRATION_LOAD: 
				return {...state,onLoad: true}
			
			case ApiConstants.API_EXPIRED_REGISTRATION_SUCCESS:
				let expiredRegistrationTemp = action.result;
				console.log("sersf",expiredRegistrationTemp)
				return {
					...state,
					onLoad: false,
					expiredRegistration: expiredRegistrationTemp ? expiredRegistrationTemp : null,
					status: action.status
				};

			case ApiConstants.API_GET_SEASONAL_CASUAL_FEES_LOAD:
				return {...state,getSeasonalCasualFeesOnLoad: true }

			case ApiConstants.API_GET_SEASONAL_CASUAL_FEES_SUCCESS:
				try{
					let feesTemp = action.result;
					let index = state.seasonalAndCasualFeesCompetitionIndex;
					state.registrationObj.competitions[index].fees.totalCasualFee = feesTemp.totalCasualFees;
					state.registrationObj.competitions[index].fees.totalSeasonalFee = feesTemp.totalSeasonalFees;
					return {
						...state,
						getSeasonalCasualFeesOnLoad: false,
						seasonalAndCasualFeesCompetitionIndex: null
					}
				}catch(ex){
					console.log("Error in API_GET_SEASONAL_CASUAL_FEES_SUCCESS::"+ex);
				}

        default:
            return state;
    }
}

export default userRegistrationReducer;