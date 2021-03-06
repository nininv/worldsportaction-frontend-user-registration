import ApiConstants from "../../../themes/apiConstants";

function timeSlotInit() {
    const action = {
        type: ApiConstants.API_TIME_SLOT_INIT_LOAD,
    };

    return action;
}

function getCommonRefData(data) {
    const action = {
        type: ApiConstants.API_GET_COMMON_REF_DATA_LOAD,
        data: data
    };

    return action;
}

//////get the grades reference data
function gradesReferenceListAction() {
    const action = {
        type: ApiConstants.API_GRADES_REFERENCE_LIST_LOAD,
    };
    return action;
}

//////get the favorite Team Reference Action
function favouriteTeamReferenceAction() {
    const action = {
        type: ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD,
    };
    return action;
}

//////get the Firebird Player Reference Action
function firebirdPlayerReferenceAction() {
    const action = {
        type: ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD,
    };
    return action;
}

//////get the Registration Other Info Reference Action
function registrationOtherInfoReferenceAction() {
    const action = {
        type: ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD,
    };
    return action;
}

//////get the Country Reference Action
function countryReferenceAction() {
    const action = {
        type: ApiConstants.API_COUNTRY_REFERENCE_LOAD,
    };
    return action;
}

//////get the Nationality Reference Action
function nationalityReferenceAction() {
    const action = {
        type: ApiConstants.API_NATIONALITY_REFERENCE_LOAD,
    };
    return action;
}

//////get the Nationality Reference Action
function heardByReferenceAction() {
    const action = {
        type: ApiConstants.API_HEARDBY_REFERENCE_LOAD,
    };
    return action;
}

//////get the Player Position Reference Action
function playerPositionReferenceAction() {
    const action = {
        type: ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD,
    };
    return action;
}

function clearFilter() {
    const action = {
        type: ApiConstants.CLEAR_FILTER_SEARCH,

    }
    return action;

}

function genderReferenceAction() {
    const action = {
        type: ApiConstants.API_GENDER_REFERENCE_LOAD,
    };
    return action;
}


function disabilityReferenceAction() {
    const action = {
        type: ApiConstants.API_DISABILITY_REFERENCE_LOAD,
    };
    return action;
}

function personRegisteringRoleReferenceAction(){
    const action = {
        type: ApiConstants.API_PERSON_REGISTERING_ROLE_REFERENCE_LOAD,
    };
    return action;
}

function identificationReferenceAction() {
    const action = {
        type: ApiConstants.API_IDENTIFICATION_REFERENCE_LOAD,
    };
    return action;
}

function otherSportsReferenceAction() {
    const action = {
        type: ApiConstants.API_OTHER_SPORTS_REFERENCE_LOAD,
    };
    return action;
}

function accreditationUmpireReferenceAction() {
    const action = {
        type: ApiConstants.API_ACCREDITATION_UMPIRE_REFERENCE_LOAD,
    };
    return action;
}

function accreditationCoachReferenceAction() {
    const action = {
        type: ApiConstants.API_ACCREDITATION_COACH_REFERENCE_LOAD,
    };
    return action;
}

function walkingNetballQuesReferenceAction() {
    const action = {
        type: ApiConstants.API_WALKING_NETBALL_QUES_REFERENCE_LOAD,
    };
    return action;
}

function getSchoolListAction(stateRefId){
    const action = {
        type: ApiConstants.API_GET_SCHOOLS_LOAD,
        stateRefId
    };
    return action;
}

function validateRegistrationCapAction(payload){
    const action = {
        type: ApiConstants.API_VALIDATE_REGISTRATION_CAP_LOAD,
        payload
    };
    return action;
}

function netSetGoTshirtSizeAction(){
    const action = {
        type: ApiConstants.API_NETSETGO_TSHIRT_SIZE_LOAD,
    };
    return action;
}

function getRelationshipListAction(){
    const action = {
        type: ApiConstants.API_RELATIONSHIP_LIST_LOAD,
    };
    return action;
}

function combinedAccreditationUmpieCoachRefrence() {
    const action = {
        type: ApiConstants.API_ACCREDITATION_UMPIRE_COACH_COMBINED_REFERENCE_LOAD,
    };
    return action;
}

function getRefereeOffenceListAction(){
    const action = {
        type: ApiConstants.API_REFEREE_OFFENCE_LIST_LOAD,
    };
    return action;
}


export {
    timeSlotInit,
    getCommonRefData,
    gradesReferenceListAction,
    favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction,
    heardByReferenceAction,
    playerPositionReferenceAction,
    clearFilter,
    genderReferenceAction,
    disabilityReferenceAction,
    personRegisteringRoleReferenceAction,
    identificationReferenceAction,
    otherSportsReferenceAction,
    accreditationUmpireReferenceAction,
    accreditationCoachReferenceAction,
    walkingNetballQuesReferenceAction,
    getSchoolListAction,
    validateRegistrationCapAction,
    netSetGoTshirtSizeAction,
    combinedAccreditationUmpieCoachRefrence,
    getRefereeOffenceListAction,
    getRelationshipListAction
}
