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
        { id: 2, value: "I have been injured or health reason(not netball related" },
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
    competitions: [],
    membershipTypes: [],
    teams: [],
    saveData : {
        userId: 0,
        email: null,
        mobileNumber: null,
        competitionId: null,
        membershipMappingId: null,
        teamId: null,
        regChangeTypeRefId: 0,         // DeRegister/ Transfer
        deRegistrationOptionId: 0,   /// Yes/No
        reasonTypeRefId: 0,      
        deRegisterOther: null,
        transfer: {
            transferOther: null,
            reasonTypeRefId: 0, 
            organisationId: null,
            competitionId: null
        }
        
    }

}

function deRegistrationReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_UPDATE_DE_REGISTRATION:
            if(action.subKey == "deRegister"){
                if(action.key == "userId"){
                    let userData = state.deRegisterData.find(x=>x.userId == action.value);
                    let competitions = setCompetitions(action.value, state.deRegisterData);
                    state.competitions = competitions;
                    state.saveData.membershipTypes = [];
                    state.saveData.membershipMappingId = null;
                    state.saveData.teams = [];
                    state.saveData.teamId = null;
                    state.saveData.email = userData!= undefined ? userData.email : null;
                    state.saveData.mobileNumber = userData!= undefined ? userData.mobileNumber : null;
                    state.reloadFormData = 1;
                }
                else if(action.key == "competitionId"){
                    //console.log("************" + action.value);
                    state.saveData.teamId = null;
                    state.saveData.membershipMappingId = null;
                    let membershipTypes = setMembershipTypes(action.value, state.competitions);
                    state.membershipTypes = membershipTypes;
                    let teams = setTeams(action.value, state.competitions);
                    state.teams = teams;
                    state.saveData[action.key] = action.value;
                    state.reloadFormData = 1;
                }
                else if(action.key == "regChangeTypeRefId"){
                    state.saveData[action.key] = action.value;
                    state.saveData["deRegistrationOptionId"] = 1;

                }
                else {
                    state.saveData[action.key] = action.value;
                }
    
                // if (action.key == "registrationOption") {
                //     state.registrationOption = action.value
                //     state.selectedDeRegistionMainOption = 1
                // }
                // if (action.key == "selectedDeRegistionMainOption") {
                //     state.selectedDeRegistionMainOption = action.value
                // }
                // if (action.key == "selectedDeRegistionOption") {
                //     state.selectedDeRegistionOption = action.value
                // }
                // if (action.key == "deRegistionOther") {
                //     state.deRegistionOther = action.value
                // }
               
                // if (action.key == "email") {
                //     state.email = action.value
                // }
                // if (action.key == "userName") {
                //     state.userName = action.value
                // }
                // if (action.key == "mobileNumber") {
                //     state.mobileNumber = action.value
                // }
                
                // if(action.key == "membershipMappingId"){
                //     state.saveData.membershipMappingId = action.value;
                // }
            }
            else if(action.subKey == "transfer"){
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
            state.deRegisterData = deRegisterData;
            if(isArrayNotEmpty(deRegisterData)){
                try {
                    let userData = deRegisterData[0];
                    state.saveData.email = userData.email;
                    state.saveData.mobileNumber = userData.mobileNumber;
                    state.saveData.userId = userData.userId;
                    let competitions = setCompetitions(userData.userId, deRegisterData);
                    state.competitions = competitions;
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

        default:
            return state;
    }
}

function setCompetitions(userId, deRegisterData){
    try {
        let arr = [];
        if(isArrayNotEmpty(deRegisterData)){
            let userData = deRegisterData.find(x=>x.userId == userId);
            if(userData!= undefined){
                if(isArrayNotEmpty(userData.competitions)){
                    arr.push(...userData.competitions);
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
        console.log("setMembershipTypes", competitionId, competitions)
        if(isArrayNotEmpty(competitions)){
            let competitionData = competitions.find(x=>x.competitionId == competitionId);
            if(competitionData!= undefined){
                if(isArrayNotEmpty(competitionData.membershipTypes)){
                    for(let item of competitionData.membershipTypes){
                        let obj = {
                            membershipMappingId: item.membershipMappingId,
                            typeName: item.typeName
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

function setTeams(competitionId, competitions){
    try {
        let arr = [];
        if(isArrayNotEmpty(competitions)){
            let competitionData = competitions.find(x=>x.competitionId == competitionId);
            if(competitionData!= undefined){
                if(isArrayNotEmpty(competitionData.teams)){
                    for(let item of competitionData.teams){
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

function clearSaveData(){
    let saveData =  {
        userId: 0,
        email: null,
        mobileNumber: null,
        competitionId: null,
        membershipMappingId: null,
        teamId: null,
        regChangeTypeRefId: 0,         // DeRegister/ Transfer
        deRegistrationOptionId: 0,   /// Yes/No
        reasonTypeRefId: 0,      
        deRegisterOther: null,
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