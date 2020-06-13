import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { getAge,deepCopyFunction} from '../../../util/helpers';

let registrationObj = {
    organisationUniqueKey: "",
    registrationId: 0,
    orgRegistrationId: 0,
    volunteers: [],
    competitionUniqueKey: "",
    childrenCheckNumber: "",
    userRegistrations: [],
    vouchers: []
}

let commonRegSetting = {
    club_volunteer: 0,
    shop: 0,
    voucher: 0
}




const initialState = {
    onLoad: false,
    onMembershipLoad: false,
    userInfoOnLoad: false,
    error: null,
    result: null,
    status: 0,
    registrationDetail: registrationObj,
    registrationSettings: [],
    populateParticipantDetails: 0,
    membershipProductInfo: [],
    refFlag: "",
    user: null,
    userInfo: [],
    setCompOrgKey: false,
    registrationId: null,
    participantIndex: null,
    commonRegSetting: commonRegSetting,
    regSettings: []
}


function endUserRegistrationReducer(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_END_USER_REGISTRATION_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_END_USER_REGISTRATION_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };
        case ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_END_USER_REGISTRATION_SUCCESS:
            state.registrationId = action.result ? action.result.id : null
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.UPDATE_END_USER_REGISTRATION:

            let oldData = state.registrationDetail;
            let updatedValue = action.updatedData;
            let getKey = action.key;
            if (getKey == "userInfo" || getKey == "refFlag" || getKey == "user"
                || getKey == "populateParticipantDetails" || getKey == "setCompOrgKey" ||
                getKey == "participantIndex") {
                state[getKey] = updatedValue;
            }
            else {
                oldData[getKey] = updatedValue;
            }

            return { ...state, error: null };

        case ApiConstants.UPDATE_REGISTRATION_SETTINGS:
            let prodIndex = action.prodIndex;
            let participantIndex = action.participantIndex;
            let existingParticipant = state.registrationDetail.userRegistrations[participantIndex];
            let settings = state.regSettings.find(x=>x.index == participantIndex);
           // console.log("participantIndex ::" + participantIndex + "prodIndex::" + prodIndex);
           // console.log("state.regSettings" + JSON.stringify(state.regSettings));
            if(action.key == "nonPlayer"){
                existingParticipant["regSetting"]["nominate_positions"] = 0;
                existingParticipant["regSetting"]["play_friend"] = 0;
                existingParticipant["regSetting"]["refer_friend"] = 0;
            }
            else if(action.key == "player") {
                if(settings!= null && settings!= undefined){
                    let setting = mergeRegistrationSettings1(settings.settingArr, state.commonRegSetting);
                    existingParticipant["regSetting"] = setting;
                }
            }
            else{
                if(settings!= null && settings!= undefined){
                    settings.settingArr.splice(prodIndex + 1, 1);
                    let setting = mergeRegistrationSettings1(settings.settingArr, state.commonRegSetting);
                    existingParticipant["regSetting"] = setting;
                }
            }
            
            return { ...state, error: null };
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

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD:
            state["participantIndex"] = action.payload.participantIndex;
            state["prodIndex"] = action.payload.prodIndex;
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" +  JSON.stringify(action.payload));
            return { ...state, onLoad: true };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS:
            let registrationSettings = action.result;
           // console.log("*******))))))))))" + state.participantIndex);

            if(state.participantIndex!= null){
                let index = state.participantIndex;
                let existingParticipant = state.registrationDetail.userRegistrations[index];
                let settings = state.regSettings.find(x=>x.index == index);
               // console.log("&&&&&&&" + JSON.stringify(settings));
                if(settings!= null){
                    let ind = index;
                    if(state.prodIndex != undefined && state.prodIndex != null){
                        ind = state.prodIndex + 1;
                    }
                    settings.settingArr[ind] = registrationSettings;
                    let setting = mergeRegistrationSettings1(settings.settingArr, state.commonRegSetting);
                   // console.log("*******))))))))))" + JSON.stringify(setting));
                    existingParticipant["regSetting"] = setting;
                }
                else{
                   // console.log("**** else");
                    let regSetObj = {
                        index: index,
                        settingArr: []
                    }
                    regSetObj.settingArr.push(registrationSettings);
                    state.regSettings.push(regSetObj);
                    existingParticipant["regSetting"] = registrationSettings;
                    if(registrationSettings.club_volunteer == 1){
                        state.commonRegSetting.club_volunteer = 1
                    }
                    if(registrationSettings.shop == 1){
                        state.commonRegSetting.shop = 1
                    }
                    if(registrationSettings.voucher == 1){
                        state.commonRegSetting.voucher = 1
                    }
                }

                state["participantIndex"] = null;
                state["prodIndex"] = null;
            }
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

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
		case ApiConstants.UPDATE_TEAM_ACTION:
           // console.log("action.index::" + action.index);
            let participant = state.registrationDetail.userRegistrations[action.index];
            if(action.subKey == "participant"){
                if(action.key == "organisationUniqueKey"){
                    let membershipProductInfo = state.membershipProductInfo;
                    let organisationInfo = membershipProductInfo.find(x=>x.organisationUniqueKey == action.data);
                    participant.organisationInfo = deepCopyFunction(organisationInfo);
                    participant.competitionInfo = [];
                    participant.competitionUniqueKey = null;
                    participant.competitionMembershipProductTypeId = null;
                    participant.competitionMembershipProductDivisionId = null;
                    participant.products = [];
                    participant.specialNote = null;
                    participant.training = null;
                    participant.registrationOpenDate = null;
                    participant.registrationCloseDate = null;
                    participant.contactDetails = null;
                    participant.divisionName = null;
                    participant.venue = [];
                    // this.props.form.setFieldsValue({
                    //     [`competitionUniqueKey${index}`]:  null,
                    //     [`competitionMembershipProductTypeId${index}`]:  null,
                    //     [`competitionMembershipProductDivisionId${index}`]:  null,
                        
                    // });
                }
                else if(action.key == "competitionUniqueKey"){
                    let competitionInfo = participant.organisationInfo.competitions.
                                    find(x=>x.competitionUniqueKey == action.data);
                    participant.competitionInfo = deepCopyFunction(competitionInfo);
                    participant.competitionMembershipProductTypeId = null;
                    participant.competitionMembershipProductDivisionId = null;
                    participant.specialNote = competitionInfo.specialNote;
                    participant.training = competitionInfo.training;
                    participant.contactDetails = competitionInfo.contactDetails;
                    participant.registrationOpenDate = competitionInfo.registrationOpenDate;
                    participant.registrationCloseDate = competitionInfo.registrationCloseDate;
                    participant.venue = competitionInfo.venues!= null ? competitionInfo.venues : [];
                    participant.products = [];
                    participant.divisionName = null;
                    // this.props.form.setFieldsValue({
                    //     [`competitionMembershipProductTypeId${index}`]:  null,
                    //     [`competitionMembershipProductDivisionId${index}`]:  null,
                    // });
                }
                else if(action.key == "competitionMembershipProductTypeId"){
                    let memProd = participant.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                        action.data);
                    let divisions = participant.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                        action.data).divisions;
                        console.log("Divisions:" + JSON.stringify(divisions));
                        if(divisions!= null && divisions!= undefined && divisions.length > 0)
                        {
                            participant[action.key] = action.data;											
                            if(divisions.length == 1)
                            {
                                participant["competitionMembershipProductDivisionId"] = 
                                divisions[0].competitionMembershipProductDivisionId;
                                participant["divisionName"] =  divisions[0].divisionName;
                                participant["divisions"] = [];
                            }
                            else{
                                participant.competitionMembershipProductDivisionId = null;
                                // this.props.form.setFieldsValue({
                                //     [`competitionMembershipProductDivisionId${index}`]:  null,
                                // });
                                participant["divisions"] = divisions;
                            }

                            participant["team"]["registeringAsAPlayer"] = 2;
                            participant["team"]["allowTeamRegistrationTypeRefId"] = memProd.allowTeamRegistrationTypeRefId;
                            participant["team"]["registrationTypeId"] = 1;
                        }
                        else{
                            participant["divisionName"] =  null;
                            participant.competitionMembershipProductDivisionId = null;
                            participant["divisions"] = [];
                            participant[action.key] = null;		
                        }
                }
                participant[action.key] = action.data;
            }
            else if(action.subKey == "team"){
                participant[action.subKey][action.key] = action.data;
            }
            else if(action.subKey == "players"){
                if(action.key == "addPlayer"){
                    let obj = {
                        competitionMembershipProductTypeId:0,firstName: null, lastName: null,
                         email: null, mobileNumber: null, payingFor: null, index: action.index
                    }
                    if(participant["team"][action.subKey]){
                        participant["team"][action.subKey].push(obj);
                    }
                    else{
                        participant["team"][action.subKey] = [];
                        participant["team"][action.subKey].push(obj);
                    }

                   // console.log("Player::" + JSON.stringify(participant));
                    
                }
                else if(action.key == "removePlayer"){
                    participant["team"][action.subKey].splice(action.subIndex, 1);
                    state.refFlag = "players";
                }
                else {
                    if(action.key == "competitionMembershipProductTypeId"){
                        let memProd = participant.competitionInfo.membershipProducts.
                        find(x=>x.competitionMembershipProductTypeId == 
                            action.data);
                            participant["team"][action.subKey][action.subIndex]["isPlayer"] = memProd.isPlayer;
                    }
                    participant["team"][action.subKey][action.subIndex][action.key] = action.data;
                }
            }

            return {
                ...state,
                error: null
            }			 
        case ApiConstants.REGISTRATION_CLEAR_DATA:
            let registrationObj1 = {
                organisationUniqueKey: "",
                registrationId: 0,
                orgRegistrationId: 0,
                volunteers: [],
                competitionUniqueKey: "",
                childrenCheckNumber: "",
                userRegistrations: [],
                vouchers: []
            }

            state.status = 0;
            state.registrationDetail = registrationObj1;
            state.registrationSettings = [];
            state.populateParticipantDetails = 0;
            state.membershipProductInfo = [];
            state.refFlag = "";
            state.user = null;
            state.userInfo = [];
            state.isSetCompOrgKey = false;

           // console.log("$$$$$$$$$$$44" + JSON.stringify(state.registrationDetail));
            return {
                ...state
            };

        default:
            return state;
    }
}

function mergeRegistrationSettings1(settings, commonRegSetting){
    try{
      //  console.log("existingSetting11::" + JSON.stringify(settings));
        let obj =  {"updates":0,"daily":0,"weekly":0,"monthly":0,"played_before":0,
        "nominate_positions":0,"last_captain":0,"play_friend":0,"refer_friend":0,
        "attended_state_game":0,"photo_consent":0,"club_volunteer":0,"country":0,
        "nationality":0,"language":0,"disability":0,"shop":0,"voucher":0};
        commonRegSetting["club_volunteer"] = 0;
        commonRegSetting["shop"] = 0;
        commonRegSetting["voucher"] = 0;
        for(let j in settings){
            let setting = settings[j];
           // console.log("&&&&&&" + JSON.stringify(setting));
            let keys = Object.keys(setting);
           // console.log("&&&&&&keys" + JSON.stringify(keys));
            for(let i in keys){
               // console.log("***" + keys[i] + "**" + i);
                if(setting[keys[i]] == 1){
                    obj[keys[i]] = 1;
                }
               // console.log("***" + JSON.stringify(obj))
                if(keys[i] === "club_volunteer" || keys[i] === "shop" || keys[i] === "voucher"){
                    if(setting[keys[i]] == 1){
                        commonRegSetting[keys[i]] = 1
                    }
                }

              //  console.log("commonRegSetting::" + JSON.stringify(commonRegSetting));
            }
        }
    
     //   console.log("existingSetting22::" + JSON.stringify(obj));
    
        return obj;
    }
    catch(error){
        console.log("Error" + error);
    }
} 

export default endUserRegistrationReducer;