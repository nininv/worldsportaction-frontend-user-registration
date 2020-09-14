import ApiConstants from "../../../themes/apiConstants";
import AppConstants from "../../../themes/appConstants";

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
	"profileUrl": null,
	"street1": null,
	"street2": null,
	"suburb": null,
	"stateRefId": null,
	"countryRefId": null,
	"postalCode": null,
	"latitue": null,
	"longitude": null,
	"refFlag": null,
	"parentOrGuardian": [
		{
			"tempParentId": null,
			"firstName": null,
			"lastName": null,
			"mobileNumber": null,
			"email": null,
			"street1": null,
			"street2": null,
			"suburb": null,
			"stateRefId": null,
			"countryRefId": null,
			"postalCode": null
		}
	],
	"tempParentsDetail": [
		{
			"firstName": null,
			"lastName": null,
			"tempParentId": null
		}
	],
	"tempParents": [],
	"competitions": [
		{
			"organisationId": null,
			"competitionId": null,
			"organisationInfo": null,
			"competitionInfo": null,
			"products": [
				{
					"competitionMembershipProductId": null,
					"competitionMembershipProductTypeId": null,
				}
			],
			"divisions": [
				{
					"competitionMembershipProductTypeId": null,
					"competitionMembershipProductDivisionId": null,
				}
			],
			"fees": {
				"totalCasualFee": null,
				"totalSeasonalFee": null
			},
			"positionId1": null,
			"positionId2": null,
			"friends": [
				{
					"firstName": null,
					"lastName": null,
					"mobileNumber": null,
					"email": null
				}
			],
			"referFriends": [
				{
					"firstName": null,
					"lastName": null,
					"mobileNumber": null,
					"email": null
				}
			]
		}
	],
	"regSetting":{
		"updates":0,
		"daily":0,
		"weekly":0,
		"monthly":0,
		"played_before":0,
		"nominate_positions":0,
        "last_captain":0,
		"play_friend":0,
		"refer_friend":0,
		"attended_state_game":0,
		"photo_consent":0,
		"club_volunteer":0,
        "country":0,
        "nationality":0,
        "language":0,
		"disability":0,
		"shop":0,
		"voucher":0
	},
	"additionalInfo": {
		"playedYear": null,
		"playedClub": null,
		"playedGrade": null,
		"hasDivisionError": null,
		"isPlayer": null,
		"isChildrenCheckNumber": null,
		"disabilityTypeRefId": null,
		"disabilityCareNumber": null,
		"emergencyContactNumber": "",
		"emergencyContactName": "",
		"isPlayedBefore": false,
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
		"countryRefId": null
	}
}

const initialState = {
	onLoad:false,
    registrationObj: null,
    userInfo: [],
	userInfoOnLoad: false
}

function getUserUpdatedRegistrationObj(state,action){
	let registrationObj = registrationObjTemp;
	if(action.data != -1 && action.data != -2){
		let selectedUser = state.userInfo.find((user) => user.id == action.data);
		registrationObj.firstName = selectedUser.firstName;
		registrationObj.lastName = selectedUser.lastName;
		registrationObj.email = selectedUser.email;
		registrationObj.genderRefId = selectedUser.genderRefId;
		registrationObj.profileUrl = selectedUser.photoUrl;
		registrationObj.dateOfBirth = selectedUser.dateOfBirth;
		registrationObj.street1 = selectedUser.street1;
		registrationObj.street2 = selectedUser.street2;
		registrationObj.suburb = selectedUser.suburb;
		registrationObj.postalCode = selectedUser.postalCode;	
		registrationObj.stateRefId = selectedUser.stateRefId;
		registrationObj.mobileNumber = selectedUser.mobileNumber;
		registrationObj.refFlag = "participant";
	}
	return registrationObj;
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
			return { 
				...state 
			}
		
		case ApiConstants.UPDATE_USER_REGISTATION_OBJECT: 
			let value = action.data;
			let key = action.key;
			if(key == "registrationObj"){
				state.registrationObj = value;
			}else{
				state.registrationObj[key] = value;
			}
			return { 
				...state 
			}
		case ApiConstants.API_GET_PARTICIPANT_BY_ID_LOAD:
			return { ...state, onLoad: true };

		case ApiConstants.API_GET_PARTICIPANT_BY_ID_SUCCESS:
			let participantData = action.result;
			return {
				...state,
				onLoad: false,
				status: action.status,
				registrationObj: participantData
			};
				
        default:
            return state;
    }
}

export default userRegistrationReducer;