import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { getAge, deepCopyFunction } from '../../../util/helpers';
import userHttpApi from "../../http/userHttp/userAxiosApi";

const initialState = {
    onLoad: false,
    onDeRegisterLoad: false,
    onSaveLoad: false,
    error: null,
    result: null,
    status: 0,
    registrationSelection: [
        { id: 1, value: "De-register", helpMsg: "What is de-registration? I am leaving netball and no longer want to participate in Netball.I have not taken the court in training, grading or competition games." },
        { id: 2, value: "Transfer", helpMsg: "What is a transfer? I am wanting to move to another Netball Club or Association for the upcoming season." }
    ],
    DeRegistionMainOption: [
        { id: 1, value: "Yes" },
        { id: 2, value: "No" }
    ],
    deRegistionOption: [
        { id: 1, value: "I am over committed with other activities and can't fit in time for netball" },
        { id: 2, value: "I have been injured or health reason(not netball related)" },
        { id: 3, value: "Decided not to participant in netball" },
        { id: 4, value: "Moving to a different geographical area" },
        { id: 5, value: "Other" },
    ],
    transferOption: [
        { id: 1, value: "Moving to another Netball Club or Association for the upcoming season" },
        { id: 2, value: "No team available in current Club or Association" },
        { id: 3, value: "Other" },

    ],
    reloadFormData:0,
    deRegisterData: [],
    organisations: [],
    competitions: [],
    membershipTypes: [],
    teams: [],
    divisions: [],
    saveData : {
        userId: null,
        email: null,
        mobileNumber: null,
        competitionId: null,
        organisationId: null,
        membershipMappingId: null,
        teamId: null,
        divisionId: null,
        regChangeTypeRefId: 0,         // DeRegister/ Transfer
        deRegistrationOptionId: 0,   /// Yes/No
        reasonTypeRefId: 0,      
        deRegisterOther: null,
        isAdmin: 0,
        registrationId: null,
        transfer: {
            transferOther: null,
            reasonTypeRefId: 0, 
            organisationId: null,
            competitionId: null
        }
    },
    transferOrganisations: [],
    transferCompetitions: []

}

function deRegistrationReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_UPDATE_DE_REGISTRATION:
            if(action.subKey == "deRegister"){
                if(action.key == "userId"){
                    let userData = state.deRegisterData.find(x=>x.userId == action.value);
                    state.saveData.organisationId = null;
                    let organisations = setOrganisations(action.value, state.deRegisterData);
                    state.organisations = organisations;
                    state.competitions = [];
                    state.saveData.competitionId = null;
                    state.membershipTypes = [];
                    state.saveData.membershipMappingId = null;
                    state.teams = [];
                    state.saveData.teamId = null;
                    state.divisions = [];
                    state.saveData.divisionId = null;
                    state.saveData.registrationId = null;
                    state.saveData.email = userData!= undefined ? userData.email : null;
                    state.saveData.mobileNumber = userData!= undefined ? userData.mobileNumber : null;
                    state.saveData[action.key] = action.value;
                    state.reloadFormData = 1;
                }
                else if(action.key == "organisationId"){
                    state.saveData.competitionId = null;
                    let competitions = setCompetitions(action.value, state.organisations);
                    state.competitions = competitions;
                    state.membershipTypes = [];
                    state.saveData.membershipMappingId = null;
                    state.teams = [];
                    state.saveData.teamId = null;
                    state.divisions = [];
                    state.saveData.divisionId = null;
                    state.saveData.registrationId = null;
                    state.saveData[action.key] = action.value;
                    state.reloadFormData = 1;
                }
                else if(action.key == "competitionId"){
                    //console.log("************" + action.value);
                    state.saveData.teamId = null;
                    state.saveData.membershipMappingId = null;
                    state.teams = [];
                    state.divisions = [];
                    state.saveData.divisionId = null;
                    state.saveData.registrationId = null;
                    let membershipTypes = setMembershipTypes(action.value, state.competitions);
                    state.membershipTypes = membershipTypes;
                   
                    state.saveData[action.key] = action.value;
                    state.reloadFormData = 1;
                }
                else if(action.key == "membershipMappingId"){
                    state.saveData.teamId = null;
                    state.saveData.divisionId = null;
                    state.teams = [];
                    let teams = setTeams(action.value, state.membershipTypes);
                    state.teams = teams;
                    state.divisions = [];
                    let divisions = setDivisions(action.value, state.membershipTypes);
                    state.divisions = divisions;

                    state.saveData[action.key] = action.value;
                    state.reloadFormData = 1;
                    let memObj = state.membershipTypes.find(x=>x.membershipMappingId == action.value);
                    state.saveData.registrationId = memObj.registrationId;
                }
                else if(action.key == "teamId"){
                    let teamObj = state.teams.find(x=>x.teamId == action.value);
                    state.saveData.registrationId = teamObj.registrationId;
                    state.saveData[action.key] = action.value;
                }
                else if(action.key == "divisionId"){
                    let divObj = state.divisions.find(x=>x.divisionId == action.value);
                    state.saveData.registrationId = divObj.registrationId;
                    state.saveData[action.key] = action.value;
                }
                else if(action.key == "regChangeTypeRefId"){
                    state.saveData[action.key] = action.value;
                    state.saveData["deRegistrationOptionId"] = 1;

                }
                else {
                    state.saveData[action.key] = action.value;
                }
            }
            else if(action.subKey == "transfer"){
                if(action.key == "organisationId"){
                    state.saveData.transfer.competitionId = null;
                    let competitions = setCompetitions(action.value, state.transferOrganisations);
                    state.transferCompetitions = competitions;
                    state.reloadFormData = 1;
                }
                state.saveData.transfer[action.key] = action.value;
            }
            else{
                state.reloadFormData = 0;
            }
            
            return {
                ...state,
                onLoad: false,
            }

        case ApiConstants.API_GET_DE_REGISTRATION_LOAD:
            return {...state, onDeRegisterLoad: true}

        case ApiConstants.API_GET_DE_REGISTRATION_SUCCESS:
            let deRegisterData = action.result;
            state.saveData = clearSaveData();
            state.organisations = [];
            state.competitions = [];
            state.membershipTypes = [];
            state.teams = [];
            state.deRegisterData = deRegisterData;
            if(isArrayNotEmpty(deRegisterData)){
                try {
                    let userData = deRegisterData[0];
                    state.saveData.email = userData.email;
                    state.saveData.mobileNumber = userData.mobileNumber;
                    state.saveData.userId = userData.userId;
                    let organisations = setOrganisations(userData.userId, deRegisterData);
                    state.organisations = organisations;
                } catch (error) {
                    console.log("Error", error);
                }
            }

        return {
            ...state,
            onDeRegisterLoad: false,
            status: action.status,
            deRegisterData: deRegisterData
        }

        case ApiConstants.API_SAVE_DE_REGISTRATION_LOAD:
            return {...state, onSaveLoad: true}

        case ApiConstants.API_SAVE_DE_REGISTRATION_SUCCESS:
            state.saveData = clearSaveData();
            return {
                ...state,
                onSaveLoad: false,
                status: action.status,
            }

        case ApiConstants.API_GET_TRANSFER_COMPETITIONS_LOAD:
            return {...state, onLoad: true}

        case ApiConstants.API_GET_TRANSFER_COMPETITIONS_SUCCESS:
            let transferOrgData = action.result;
            return {
                ...state,
                onLoad: false,
                transferOrganisations: transferOrgData,
                status: action.status,
            }

        default:
            return state;
    }
}

function setOrganisations(userId, deRegisterData){
    try {
        let arr = [];
        if(isArrayNotEmpty(deRegisterData)){
            let userData = deRegisterData.find(x=>x.userId == userId);
            if(userData!= undefined){
                if(isArrayNotEmpty(userData.organisations)){
                    arr.push(...userData.organisations);
                }
            }
        }
        return arr;
    } catch (error) {
        console.log("Error", error);
    }
}

function setCompetitions(organisationId, organisations){
    try {
        let arr = [];
        if(isArrayNotEmpty(organisations)){
            let compData = organisations.find(x=>x.organisationId == organisationId);
            if(compData!= undefined){
                if(isArrayNotEmpty(compData.competitions)){
                    arr.push(...compData.competitions);
                }
            }
        }
        return arr;
    } catch (error) {
        console.log("Error", error);
    }
}

function setMembershipTypes(competitionId, competitions){
    try {
        let arr = [];
       // console.log("setMembershipTypes", competitionId, competitions)
        if(isArrayNotEmpty(competitions)){
            let competitionData = competitions.find(x=>x.competitionId == competitionId);
            if(competitionData!= undefined){
                if(isArrayNotEmpty(competitionData.membershipTypes)){
                    arr.push(...competitionData.membershipTypes);
                }
            }
        }
        return arr;
    } catch (error) {
        console.log("Error", error);
    }
}

function setTeams(membershipMappingId, membershipTypes){
    try {
        let arr = [];
        //console.log("membershipMappingId", membershipMappingId, membershipTypes)
        if(isArrayNotEmpty(membershipTypes)){
            let membershipData = membershipTypes.find(x=>x.membershipMappingId == membershipMappingId);
           // console.log("membershipData", membershipData);
            if(membershipData!= undefined){
                if(isArrayNotEmpty(membershipData.teams)){
                    for(let item of membershipData.teams){
                        let obj = {
                            teamId: item.teamId,
                            teamName: item.teamName
                        }
                        arr.push(obj);
                    }
                }
            }
        }
        return arr;
    } catch (error) {
        console.log("Error", error);
    }
}


function setDivisions(membershipMappingId, membershipTypes){
    try {
        let arr = [];
        //console.log("membershipMappingId", membershipMappingId, membershipTypes)
        if(isArrayNotEmpty(membershipTypes)){
            let membershipData = membershipTypes.find(x=>x.membershipMappingId == membershipMappingId);
           // console.log("membershipData", membershipData);
            if(membershipData!= undefined){
                if(isArrayNotEmpty(membershipData.divisions)){
                    for(let item of membershipData.divisions){
                        let obj = {
                            divisionId: item.divisionId,
                            divisionName: item.divisionName,
                            registrationId: item.registrationId
                        }
                        arr.push(obj);
                    }
                }
            }
        }
        return arr;
    } catch (error) {
        console.log("Error", error);
    }
}


function clearSaveData(){
    let saveData =  {
        userId: 0,
        email: null,
        mobileNumber: null,
        competitionId: null,
        organisationId: null,
        membershipMappingId: null,
        teamId: null,
        regChangeTypeRefId: 0,         // DeRegister/ Transfer
        deRegistrationOptionId: 0,   /// Yes/No
        reasonTypeRefId: 0,      
        deRegisterOther: null,
        isAdmin:0,
        transfer: {
            transferOther: null,
            reasonTypeRefId: 0, 
            organisationId: null,
            competitionId: null
        }
        
    }
    return saveData;
}




export default deRegistrationReducer;