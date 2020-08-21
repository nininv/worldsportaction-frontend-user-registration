import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty, isNullOrEmptyString, formatValue, isNullOrUndefined, feeIsNull } from "../../../util/helpers";
import { getAge,deepCopyFunction} from '../../../util/helpers';
import moment from 'moment';

let registrationObj = {
    registrationUniqueKey: "",
    registrationId: 0,
    volunteers: [],
    childrenCheckNumber: "",
    userRegistrations: [],
    vouchers: [],
    yourInfo: {firstName: "",middleName:"",lastName:"",mobileNumber:"",email: "",
                reEnterEmail: "", street1:"",street2:"",suburb:"",stateRefId: 1,
                postalCode: "", userId: 0}
}

let commonRegSetting = {
    club_volunteer: 0,
    shop: 0,
    voucher: 0
}

const initialState = {
    onLoad: false,
    onRegLoad: false,
    onMembershipLoad: false,
    userInfoOnLoad: false,
    onDiscountCodeValidLoad: false,
    onInvLoad:false,
    onPFLoad: false,
    error: null,
    result: null,
    status: 0,
    registrationDetail: registrationObj,
    registrationSettings: [],
    populateParticipantDetails: 0,
    populateVolunteerInfo: 0,
    populateExistingInfo: 0,
    membershipProductInfo: [],
    refFlag: "",
    user: null,
    userInfo: [],
    setCompOrgKey: false,
    registrationId: null,
    participantIndex: null,
    commonRegSetting: commonRegSetting,
    regSettings: [],
    invCompetitionDetails: null,
    invUserInfo: null,
    invUserRegDetails: null,
    registrationSetting: {},
    termsAndConditions: [],
    termsAndConditionsFinal: [],
    isYourInfoSet: false,
    registrationReviewList: null,
    regReviewPrdData: null,
    singleCompErrorMsg: null

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
            state.registrationId = action.result ? action.result.id : null;
            state.singleCompErrorMsg = action.result ? action.result.errorMsg : null;
            return {
                ...state,
                onLoad: false,
                status: action.status
            };

        case ApiConstants.UPDATE_END_USER_REGISTRATION:
            try{
                let oldData = state.registrationDetail;
                let updatedValue = action.updatedData;
                let getKey = action.key;
                let getSubkey = action.subKey;
                if(getKey === "refFlag"){
                    state[getKey] = updatedValue;
                }
                if(getKey === "populateVolunteerInfo"){
                    state[getKey] = updatedValue;
                }
                if(getKey === "populateExistingInfo"){
                    state[getKey] = updatedValue;
                }

                if (getKey == "userInfo" || getKey == "user"
                    || getKey == "populateParticipantDetails" || getKey == "setCompOrgKey" ||
                    getKey == "participantIndex" || getKey == "populateYourInfo" ||
                    getKey == "populateTeamRegisteringPerson") {
                    state[getKey] = updatedValue;
                   
                }
                else {
                    oldData[getKey] = updatedValue;
                }
    
                if(getKey == "yourInfo"){
                    state.isYourInfoSet = true;
                    state["populateYourInfo"] = 1;
                }
    
                if(getSubkey == "organisationUniqueKey" || getSubkey == "removeProduct" ||
                    getSubkey == "removeParticipant"){
                    state.termsAndConditions = updateTermsAndConditions(state.termsAndConditions,
                        state.registrationDetail.userRegistrations, state);
                }
            }
            catch(error)
            {
                console.log("Error:" + error);
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
                existingParticipant["products"][prodIndex]["regSetting"] = null;
                // existingParticipant["products"][prodIndex]["regSetting"]["nominate_positions"] = 0;
                // existingParticipant["products"][prodIndex]["regSetting"]["play_friend"] = 0;
                // existingParticipant["products"][prodIndex]["regSetting"]["refer_friend"] = 0;
            }
            else if(action.key == "player") {
                if(settings!= null && settings!= undefined){
                  //  console.log("@@@@@" + JSON.stringify(settings.settingArr));
                    let setting = mergeRegistrationSettings1(settings.settingArr, state.commonRegSetting,prodIndex + 1);
                    existingParticipant["regSetting"] = setting;
                    existingParticipant["products"][prodIndex]["regSetting"] = settings.settingArr[prodIndex + 1];
                }
            }
            else{
                if(settings!= null && settings!= undefined){
                    settings.settingArr.splice(prodIndex + 1, 1);
                    let setting = mergeRegistrationSettings1(settings.settingArr, state.commonRegSetting,-1);
                    existingParticipant["regSetting"] = setting;
                }
            }

          //  console.log("state.regSettingsEND" + JSON.stringify(state.regSettings));
            
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
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" +  JSON.stringify(action.payload));
            return { ...state, onLoad: true };

        case ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS:
            let registrationSettings = action.result;
           // console.log("*******))))))))))" + state.participantIndex);

            if(state.participantIndex!= null){
                let index = state.participantIndex;
                let existingParticipant = state.registrationDetail.userRegistrations[index];
                let settings = state.regSettings.find(x=>x.index == index);
                console.log("&&&&&&&" + JSON.stringify(settings));
            //    console.log("registrationSettings######"+JSON.stringify(registrationSettings));
                if(settings!= undefined){
                    let ind = index;
                    let flag = -1;
                    if(state.prodIndex != undefined && state.prodIndex != null){
                        ind = state.prodIndex + 1;
                        flag = ind;
                        existingParticipant["products"][state.prodIndex]["regSetting"] = registrationSettings;
                    }
                    settings.settingArr[ind] = registrationSettings;
                   // console.log("&&&&&&1111&" + JSON.stringify(settings));
                    let setting = mergeRegistrationSettings1(settings.settingArr, state.commonRegSetting, flag);
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
               // console.log("existingParticipant11111",existingParticipant);
                state["participantIndex"] = null;
                state["prodIndex"] = null;
            }
            else{
                state.registrationSetting = action.result;
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
       
        case ApiConstants.UPDATE_YOUR_INFO_ACTION:
            state.registrationDetail[action.subKey][action.key] = action.data;
            return {
                ...state,
                error: null
            }

		case ApiConstants.UPDATE_TEAM_ACTION:
            let userRegistrations = state.registrationDetail.userRegistrations;
            let participant = userRegistrations[action.index];
           
            if(action.subKey == "participant"){
                if(action.key == "organisationUniqueKey"){
                    let membershipProductInfo = state.membershipProductInfo;
                    let organisationInfo = membershipProductInfo.find(x=>x.organisationUniqueKey == action.data);
                    participant.organisationInfo = deepCopyFunction(organisationInfo);
                    participant.competitionInfo = [];
                    participant.competitionUniqueKey = null;
                    participant.competitionMembershipProductId = null;
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
                    participant["fees"] = null;
                    state.termsAndConditions = updateTermsAndConditions(state.termsAndConditions,
                        state.registrationDetail.userRegistrations, state);
                    participant["team"]["teamName"] = null;
                    participant["team"]["resultCode"] = null;
                    participant["team"]["personRoleRefId"] = null;
                    participant["team"]["players"] = []
             
                }
                else if(action.key == "competitionUniqueKey"){
                    let competitionInfo = participant.organisationInfo.competitions.
                                    find(x=>x.competitionUniqueKey == action.data);
                    participant.competitionInfo = deepCopyFunction(competitionInfo);
                    participant.competitionMembershipProductId = null;
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
                    participant["fees"] = null;
                    participant["team"]["teamName"] = null;
                    participant["team"]["resultCode"] = null;
                    participant["team"]["personRoleRefId"] = null;
                    participant["team"]["players"] = []
                }
                else if(action.key == "competitionMembershipProductTypeId"){
                    let memProd = participant.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                        action.data);
                    let divisions = participant.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                        action.data).divisions;
                        //console.log("Divisions:" + JSON.stringify(divisions));
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
                                participant["divisions"] = divisions;
                            }
                            participant["isChildrenCheckNumber"] = memProd.isChildrenCheckNumber == null ? 0 : memProd.isChildrenCheckNumber;
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

                        participant["competitionMembershipProductId"] = memProd.competitionMembershipProductId;
                        participant["team"]["teamName"] = null;
                        participant["team"]["resultCode"] = null;
                        participant["team"]["personRoleRefId"] = null;
                        participant["team"]["players"] = []
                        
                }
                else if(action.key == "competitionMembershipProductDivisionId"){
                    participant["team"]["teamName"] = null;
                    participant["team"]["resultCode"] = null;
                }
                participant[action.key] = action.data;
            }
            else if(action.subKey == "team"){
                participant[action.subKey][action.key] = action.data;

                if(action.key =="teamName"){
                    participant[action.subKey]["resultCode"] = null;
                }

                if(action.key == "personRoleRefId" || action.key == "registeringAsAPlayer")
                {
                    addReadOnlyPlayer(participant, action)
                    let registeringYourself = userRegistrations.find(x=>x.registeringYourself == 1);
                    console.log("registeringYourself", registeringYourself)
                    if(registeringYourself!= null){
                        let filteredRegistrations = userRegistrations.filter(x=>x.registeringYourself == 4);
                        console.log("filteredRegistrations", filteredRegistrations);
                        (filteredRegistrations || []).map((item, index) =>{
                            console.log("item", item);
                            updatePlayerData(item,"firstName", registeringYourself.firstName);
                            updatePlayerData(item,"lastName", registeringYourself.lastName);
                            updatePlayerData(item,"email", registeringYourself.email);
                            updatePlayerData(item,"mobileNumber", registeringYourself.mobileNumber);
                        })
                    }
                }
                else{
                    updatePlayerData(participant, action.key, action.data);
                }
                state.refFlag = "players";
            }
            else if(action.subKey == "players"){
                if(action.key == "addPlayer"){
                    let obj = {
                        competitionMembershipProductTypeId: null,firstName: null, lastName: null,
                         email: null, mobileNumber: null, payingFor: null, index: action.index,
                         isDisabled: false, isPlayer: null
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
                else if(action.key == "addPlayersCSV"){
                    console.log("DATA::::", action.data);

                    let playerData = action.data;
                    if (isArrayNotEmpty(playerData)) {
                        if(isArrayNotEmpty(participant["team"][action.subKey])){
                            let prevData = participant["team"][action.subKey].filter(x=>x.isDisabled == true);
                            participant["team"][action.subKey] = prevData!= null ? prevData : [];
                        }

                        if(!participant["team"][action.subKey]){
                            participant["team"][action.subKey] = [];
                        }

                        for (let i in playerData) {
                            let obj = {
                                competitionMembershipProductTypeId: null,
                                firstName: playerData[i].first_name, 
                                lastName: playerData[i].last_name,
                                email: playerData[i].email, 
                                mobileNumber: playerData[i].mobile, 
                                payingFor: null, 
                                index: action.index,
                                isDisabled: false, isPlayer: null
                            }


                            let memProd = participant.competitionInfo.membershipProducts.
                                    find(x=>x.shortName == playerData[i].type && x.allowTeamRegistrationTypeRefId!= null &&
                                        x.competitionMembershipProductId == participant.competitionMembershipProductId);
                    
                           if(memProd!= null && memProd!= undefined){
                                obj.competitionMembershipProductTypeId = memProd.competitionMembershipProductTypeId;
                                obj.isPlayer =  memProd.isPlayer;
                                participant["team"][action.subKey].push(obj);
                           }
                        }

                        state.refFlag = "players";
                    }

                 //   console.log("participant", participant);
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
            else if(action.subKey == "updatePlayer"){
                let filteredRegistrations = userRegistrations.filter(x=>x.registeringYourself == 4);
                (filteredRegistrations || []).map((item, index) =>{
                    updatePlayerData(item,action.key, action.data);
                })

                state.refFlag = "players";
            }


            return {
                ...state,
                error: null
            }			 
        case ApiConstants.REGISTRATION_CLEAR_DATA:
            let registrationObj1 = {
                organisationUniqueKey: "",
                registrationId: 0,
                registrationUniqueKey: "",
                volunteers: [],
                competitionUniqueKey: "",
                childrenCheckNumber: "",
                userRegistrations: [],
                vouchers: [],
                yourInfo: {firstName: "",middleName:"",lastName:"",mobileNumber:"",email: "",
                reEnterEmail: "", street1:"",street2:"",suburb:"",stateRefId: 1,
                postalCode: "", userId: 0}
            }
            let commonRegSetting1 = {
                club_volunteer: 0,
                shop: 0,
                voucher: 0
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
            state.registrationId = null;
            state.participantIndex =  null;
            state.commonRegSetting = commonRegSetting1;
            state.regSettings = [];
            state.invCompetitionDetails =  null;
            state.invUserInfo = null;
            state.invUserRegDetails =  null;
            state.registrationSetting = {}
            state.termsAndConditions = [];
            state.isYourInfoSet =  false

           // console.log("$$$$$$$$$$$44" + JSON.stringify(state.registrationDetail));
            return {
                ...state
            };

        case ApiConstants.API_GET_INVITED_TEAM_REG_INFO_LOAD:
            return { ...state, onInvLoad: true };

        case ApiConstants.API_GET_INVITED_TEAM_REG_INFO_SUCCESS:
            let invData = action.result;
            state.registrationId = invData.userRegDetails!= null ? invData.userRegDetails.registrationId: 0;
            let invUser = null;
            if(!invData.userInfo){
                invUser = {userId: 0, street2: null}
            }
            else{
                invUser = invData.userInfo
            }
            return {
                ...state,
                onInvLoad: false,
                status: action.status,
                invCompetitionDetails: invData.competitionDetails,
                invUserInfo: invUser,
                invUserRegDetails: invData.userRegDetails
            };

        case ApiConstants.UPDATE_TEAM_PARENT_INFO:
            let parentInfo = state.invUserInfo;
            if(parentInfo == null){
                parentInfo = {}
            }
            parentInfo[action.key] = action.data;
            return {
                ...state,
                error: null
            }

        case ApiConstants.UPDATE_TEAM_REG_SETTINGS:
            let regSet = state.invUserRegDetails;
            if(regSet == null){
                regSet = {};
            }
            regSet[action.key] = action.data;
            return {
                ...state,
                error: null
            } 

        case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status
            };   
       
        case ApiConstants.API_GET_TERMS_AND_CONDITION_LOAD:
            return { ...state, onTCLoad: true };

        case ApiConstants.API_GET_TERMS_AND_CONDITION_SUCCESS:
            let tcData = action.result;
          //  console.log("TC Input :::", tcData)
            if(tcData!= null && tcData.termsAndConditions.length > 0){
                let isExistsTC = state.termsAndConditions.find(x=>x.organisationId == tcData.organisationId);
              //  console.log("isExistsTC", isExistsTC);
                if(isExistsTC == null || isExistsTC == undefined){
                    state.termsAndConditions.push(tcData);
                }
            }
           // console.log("TC:::TC Final1111", state.termsAndConditions)
            state.termsAndConditions = updateTermsAndConditions(state.termsAndConditions,
                                            state.registrationDetail.userRegistrations, state);
           
           // console.log("TC:::TC Final", state.termsAndConditions, state.termsAndConditionsFinal)
            return {
                ...state,
                onTCLoad: false,
                status: action.status
            }; 
            
        case ApiConstants.API_GET_REGISTRATION_PRODUCT_FEES_LOAD:
            state["participantIndex"] = action.payload.participantIndex;
            state["prodIndex"] = action.payload.prodIndex;
            return { ...state, onPFLoad: true };

        case ApiConstants.API_GET_REGISTRATION_PRODUCT_FEES_SUCCESS:

            if(state.participantIndex != null){
                let index = state.participantIndex;
                let existingParticipant = state.registrationDetail.userRegistrations[index];
               // console.log("index:::", index, state.prodIndex);
                if(state.prodIndex!= null && state.prodIndex!= undefined){
                    existingParticipant["products"][state.prodIndex]["fees"] = action.result;
                }
                else{
                    existingParticipant["fees"] = action.result;
                }
            }

            state["participantIndex"] = null;
            state["prodIndex"] = null;
           
            return {
                ...state,
                onPFLoad: false,
                status: action.status
            };

        case ApiConstants.API_GET_REGISTRATION_REVIEW_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_GET_REGISTRATION_REVIEW_SUCCESS:
           let regReviewData = action.result;
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status,
                registrationReviewList: regReviewData
            };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_LOAD:
            return { ...state, onRegReviewLoad: true };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_SUCCESS:
            return {
                ...state,
                onRegReviewLoad: false,
                status: action.status
            };
    
        case ApiConstants.UPDATE_REVIEW_INFO:
            let reviewData = state.registrationReviewList;
            if(action.subkey == "charity"){
                reviewData[action.key] = action.value;
            }
            else if(action.subkey == "selectedOptions"){
                let memProds = reviewData["compParticipants"][action.index]["membershipProducts"];
                let compParticipant = reviewData["compParticipants"][action.index];
                let gameVoucherVal = reviewData["compParticipants"][action.index][action.subkey]["gameVoucherValue"] ;
              
                if(action.key == "removeCode"){
                   
                    let memProd = reviewData["compParticipants"][action.index]["membershipProducts"][action.subIndex];
                    memProd["invalidCode"] = 0;
                    if(action.key == "removeCode"){
                        let disIndex = memProd.selectedDiscounts.findIndex(x=>x.discountCode === memProd.selectedCode);
                        memProd.selectedDiscounts.splice(disIndex,1);
                        memProd["selectedCode"] = null;
                        memProd.isDiscountApplied = 0;
                        memProd.discountsToDeduct = 0;
                        memProd.fees.competitionOrganisorFee.discountsToDeduct = 0;
                        if(isNullOrUndefined(memProd.fees.affiliateFee)){
                            memProd.fees.affiliateFee.discountsToDeduct = 0;
                        }
                        memProd.fees.membershipFee.discountsToDeduct = 0;
                    }
                }
                else if(action.key == "removeSchoolRegCode"){
                    reviewData["compParticipants"][action.index][action.subkey]["selectedSchoolRegCode"] = null;
                    reviewData["compParticipants"][action.index][action.subkey]["invalidSchoolRegCode"] = 0;
                    reviewData["compParticipants"][action.index][action.subkey]["isSchoolRegCodeApplied"] = 0;
                    memProds.map((x, mIndex) =>{
                        calculateFee(5, x, gameVoucherVal, compParticipant, 0);
                        calculateDiscount(x.selectedDiscounts, x, 5,  gameVoucherVal, null, compParticipant, 0);

                        x.feesToPay = formatValue(x.feesToPay);
                        x.discountsToDeduct = formatValue(x.discountsToDeduct);
                        x.childDiscountsToDeduct = formatValue(x.childDiscountsToDeduct);
                    })
                    setIsSchoolRegistration(reviewData);
                }
                else{
                    //console.log("******", action.index, action.subkey, action.key, action.value);
                    let isSchoolRegCodeApplied = reviewData["compParticipants"][action.index][action.subkey]["isSchoolRegCodeApplied"]
                    if(action.key == "paymentOptionRefId"){

                        if(action.value != 2){
                            reviewData["compParticipants"][action.index][action.subkey]["gameVoucherValue"] = null;
                        }
                        else{
                            reviewData["compParticipants"][action.index][action.subkey]["gameVoucherValue"] = "3";
                        }
                        if(action.value != 5){
                            reviewData["compParticipants"][action.index][action.subkey]["selectedSchoolRegCode"] = null;
                            reviewData["compParticipants"][action.index][action.subkey]["invalidSchoolRegCode"] = 0;
                            reviewData["compParticipants"][action.index][action.subkey]["isSchoolRegCodeApplied"] = 0;
                        }

                        let gameVoucherVal = reviewData["compParticipants"][action.index][action.subkey]["gameVoucherValue"] ;
                        
                        memProds.map((x, mIndex) =>{
                            calculateFee(action.value, x, gameVoucherVal, compParticipant, isSchoolRegCodeApplied);
                            calculateDiscount(x.selectedDiscounts, x, action.value,  gameVoucherVal, null, compParticipant, isSchoolRegCodeApplied);

                            x.feesToPay = formatValue(x.feesToPay);
                            x.discountsToDeduct = formatValue(x.discountsToDeduct);
                            x.childDiscountsToDeduct = formatValue(x.childDiscountsToDeduct);
                        })
                        reviewData["compParticipants"][action.index][action.subkey][action.key] = action.value;

                        setIsSchoolRegistration(reviewData);
                    }
                    else if(action.key == "gameVoucherValue"){
                        reviewData["compParticipants"][action.index][action.subkey]["paymentOptionRefId"] = 2;

                        memProds.map((x, mIndex) =>{
                            calculateFee(2, x, action.value, compParticipant, isSchoolRegCodeApplied);
                            calculateDiscount(x.selectedDiscounts, x, 2,  action.value, null, compParticipant, isSchoolRegCodeApplied);
                            x.feesToPay = formatValue(x.feesToPay);
                            x.discountsToDeduct = formatValue(x.discountsToDeduct);
                            x.childDiscountsToDeduct = formatValue(x.childDiscountsToDeduct)
                        })
                        
                        reviewData["compParticipants"][action.index][action.subkey][action.key] = action.value;
                    }
                    else if(action.key == "selectedCode"){
                        reviewData["compParticipants"][action.index]["membershipProducts"][action.subIndex]["invalidCode"] = 0;
                        reviewData["compParticipants"][action.index]["membershipProducts"][action.subIndex][action.key] = action.value;
                    }
                    else if(action.key == "selectedSchoolRegCode"){
                        reviewData["compParticipants"][action.index][action.subkey]["selectedSchoolRegCode"] = action.value ;
                        reviewData["compParticipants"][action.index][action.subkey]["invalidSchoolRegCode"] = 0;
                    }
                    else{
                        reviewData["compParticipants"][action.index][action.subkey][action.key] = action.value;
                    }
                }
            }

            //console.log("ReviewData", reviewData);
            
            return {
                ...state,
                error: null
            }

        case ApiConstants.API_GET_REGISTRATION_REVIEW_PRODUCT_LOAD:
            return { ...state, onRegReviewPrdLoad: true };

        case ApiConstants.API_GET_REGISTRATION_REVIEW_PRODUCT_SUCCESS:
            let regReviewPrdData = action.result;
            return {
                ...state,
                onRegReviewPrdLoad: false,
                status: action.status,
                regReviewPrdData: regReviewPrdData
            };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_PRODUCT_LOAD:
            return { ...state, onRegReviewPrdLoad: true };

        case ApiConstants.API_SAVE_REGISTRATION_REVIEW_PRODUCT_SUCCESS:
            return {
                ...state,
                onRegReviewPrdLoad: false,
                status: action.status
            };
        
        case ApiConstants.UPDATE_REVIEW_PRODUCT:
            let reviewPrdData = state.regReviewPrdData;
            if(action.key == "removeProduct"){
                console.log("*******" + action.index + "***" + action.subkey + "****" + action.subIndex);
                let partData = reviewPrdData["compParticipants"][action.index];
                let paymentOptionRefId = partData.selectedOptions.paymentOptionRefId;
                let memData = reviewPrdData["compParticipants"][action.index][action.subkey][action.subIndex];
                let fee = 0;
                let gst = 0;
                let discount = 0;

                if(paymentOptionRefId <= 2){
                    fee = memData.casualFee;
                    gst = memData.casualGST;
                }
                else{
                    fee = memData.seasonalFee;
                    gst = memData.seasonalGST;
                }

                memData.discounts.map((x) =>{
                    if(x.isSelected == 1){
                        discount += x.discountsToDeduct;
                    }
                });

                reviewPrdData.total.subTotal = (Number(reviewPrdData.total.subTotal) - fee) + discount;
                reviewPrdData.total.gst = Number(reviewPrdData.total.gst) - gst;
                let tempTargetVal = formatValue(reviewPrdData.total.subTotal) + formatValue(reviewPrdData.total.gst);
                if(reviewPrdData.charityRoundUpRefId > 0){
                    let charityData = getCharityValue(tempTargetVal, reviewPrdData.charityRoundUpRefId);
                    reviewPrdData.total.targetValue = charityData.targetValue;
                    reviewPrdData.total.charityValue = charityData.charityValue;
                }
                else{
                    reviewPrdData.total.targetValue = tempTargetVal;
                    reviewPrdData.total.charityValue = 0;
                }
               

                reviewPrdData.deletedProducts.push(memData.orgRegParticipantId);
                reviewPrdData["compParticipants"][action.index][action.subkey].splice(action.subIndex, 1);

                console.log("reviewPrdData", reviewPrdData);
            }

        case ApiConstants.API_GET_REGISTRATION_BY_ID_LOAD:
            return { ...state, onRegLoad: true };
    
        case ApiConstants.API_GET_REGISTRATION_BY_ID_SUCCESS:
            let registrationData = action.result;
            
            (action.result.userRegistrations || []).map((item, index) =>{

                let orgInfo =  state.membershipProductInfo.find(x=>x.organisationUniqueKey == 
                    item.organisationUniqueKey);
                item["organisationInfo"] = deepCopyFunction(orgInfo);
                let competitionInfo = item.organisationInfo.competitions.
                                find(x=>x.competitionUniqueKey == item.competitionUniqueKey);
                if(competitionInfo!= undefined){
                    item["competitionInfo"] = deepCopyFunction(competitionInfo);
                    setSettings(index,null,item.regSetting, state.regSettings, action.result, 
                        state.commonRegSetting);
                   
                }
                else{
                    item["organisationInfo"] = null;
                    item.organisationUniqueKey = null;
                    item.competitionUniqueKey = null;
                    item.competitionMembershipProductTypeId = null;
                    item.competitionMembershipProductDivisionId = null;
                    item.products = [];
                    item.specialNote = null;
                    item.training = null;
                    item.registrationOpenDate = null;
                    item.registrationCloseDate = null;
                    item.contactDetails = null;
                    item.divisionName = null;
                    item["hasDivisionError"] = false;
                    item.venue = [];
                    item["fees"] = null;
                }
                
                (item.products || []).map((prod, prodIndex) =>{
                    let orgInfo =  state.membershipProductInfo.find(x=>x.organisationUniqueKey == 
                        prod.organisationUniqueKey);
                        prod["organisationInfo"] = deepCopyFunction(orgInfo);
                    let competitionInfo = prod.organisationInfo.competitions.
                                    find(x=>x.competitionUniqueKey == prod.competitionUniqueKey);
                    if(competitionInfo != undefined){
                        prod["competitionInfo"] = deepCopyFunction(competitionInfo);
                        setSettings(index,prodIndex,item.regSetting, state.regSettings, action.result, 
                            state.commonRegSetting);
                    }
                    else{
                        prod["organisationInfo"] = null
                        prod["competitionInfo"] = null;
                        prod["organisationUniqueKey"] = null;
                        prod["competitionUniqueKey"] = null;
                        prod["competitionMembershipProductTypeId"] = null;
                        prod["competitionMembershipProductDivisionId"] = null;
                        prod["divisionName"] = null;
                        prod["friends"] = [];
                        prod["referFriends"] = [];
                        prod["positionId1"] = null;
                        prod["positionId1"] = null;
                        prod["fees"] = null;
                    }
                })

                if(item.registeringYourself == 4){
                    (item.team.players).map((p, pIndex) =>{
                        p.index = index;
                    })
                }
            });

            if(isArrayNotEmpty(action.result.termsAndConditions)){
                updateTermsAndConditions(action.result.termsAndConditions, action.result.userRegistrations,state);
            }


            state.registrationDetail = action.result;
            state.populateExistingInfo = 1;
             state.populateVolunteerInfo = 1;
            console.log("state.registrationDetail", state.registrationDetail, state.regSettings, state.commonRegSetting);
            
            return {
                ...state,
                onRegLoad: false,
                status: action.status,
                registrationDetail: registrationData
            };
        
        return {
            ...state,
            error: null
        }

        case ApiConstants.API_VALIDATE_DISCOUNT_CODE_LOAD:
            return { ...state, onDiscountCodeValidLoad: true };

        case ApiConstants.API_VALIDATE_DISCOUNT_CODE_SUCCESS:
            let codeValidationData = action.result;
            try {
                let reviewData = state.registrationReviewList;
                let compParticipant = reviewData["compParticipants"][action.index];
                let paymentOptionRefId = compParticipant["selectedOptions"]["paymentOptionRefId"];
                let gameVoucherValue = compParticipant["selectedOptions"]["gameVoucherValue"];
                if(codeValidationData.key == "discount"){
                    let discountData = codeValidationData.discounts;
                    let memProd = reviewData["compParticipants"][action.index]["membershipProducts"][action.subIndex];
                    let isSchoolRegCodeApplied = compParticipant["selectedOptions"]["isSchoolRegCodeApplied"];
                    memProd.discountsToDeduct = 0;
                    memProd.fees.competitionOrganisorFee.discountsToDeduct = 0;
                    if(isNullOrUndefined(memProd.fees.affiliateFee)){
                        memProd.fees.affiliateFee.discountsToDeduct = 0;
                    }
                    memProd.fees.membershipFee.discountsToDeduct = 0;
                    memProd.isDiscountApplied = 0;
                    memProd["invalidCode"] = 0;
                    memProd.selectedDiscounts = [];
                    memProd.selectedDiscounts.push(...discountData);
                    if(isArrayNotEmpty(discountData)){
                        calculateDiscount(discountData, memProd, paymentOptionRefId,  gameVoucherValue, "fromValidateDiscountCode", compParticipant,
                                            isSchoolRegCodeApplied);
                        memProd.discountsToDeduct = formatValue(memProd.discountsToDeduct)
                        memProd.childDiscountsToDeduct = formatValue(memProd.childDiscountsToDeduct)
                    }
                    else{
                        memProd["invalidCode"] = 1;
                    }
                }
                else if(codeValidationData.key == "school"){
                    if(codeValidationData.school.isValid == 1){
                        reviewData["compParticipants"][action.index]["selectedOptions"]["invalidSchoolRegCode"] = 0;
                        reviewData["compParticipants"][action.index]["selectedOptions"]["isSchoolRegCodeApplied"] = 1;
                        let memProds = reviewData["compParticipants"][action.index]["membershipProducts"];
                        memProds.map((x, mIndex) =>{
                            calculateFee(5, x, gameVoucherValue, compParticipant, 1);
                            calculateDiscount(x.selectedDiscounts, x, 5,  gameVoucherValue, null, compParticipant, 1);

                            x.feesToPay = formatValue(x.feesToPay);
                            x.discountsToDeduct = formatValue(x.discountsToDeduct);
                            x.childDiscountsToDeduct = formatValue(x.childDiscountsToDeduct);
                        })
                    }
                    else{
                        reviewData["compParticipants"][action.index]["selectedOptions"]["invalidSchoolRegCode"] = 1;
                        reviewData["compParticipants"][action.index]["selectedOptions"]["isSchoolRegCodeApplied"] = 0;
                    }

                    setIsSchoolRegistration(reviewData);
                }
                
            } catch (error) {
                console.log("API_VALIDATE_DISCOUNT_CODE_SUCCESS Error ", error);
            }
            

            console.log("discountData", action.index, action.subIndex);
            return {
                ...state,
                onDiscountCodeValidLoad: false,
                status: action.status
            };

        case ApiConstants.TEAM_NAME_CHECK_VALIDATION_LOAD: 
            state["participantIndex"] = action.participantIndex;
            return { ...state};

        case ApiConstants.TEAM_NAME_CHECK_VALIDATION_SUCCESS:
            let  userReg = state.registrationDetail.userRegistrations;
            userReg[state.participantIndex].team["resultCode"] = action.result.resultCode; 
            state["participantIndex"] = null;       

            return {
                ...state,
                onLoad: false,                
            };
        default:
            return state;
    }
}

 function getCharityValue(targetValue, charityRoundUpRefId){
    console.log("targetValue ::" + targetValue + ":::" + charityRoundUpRefId );
    try {
        let chartityValue = 0;
        let finalTargetValue = 0;
        let val = Math.ceil(targetValue);
        
        let remainder = val % 10;
        let quotient = ((val - remainder) / 10) * 10;
        console.log("val::" + val + "remainder::" + remainder + "quotient::" + quotient);
        if(charityRoundUpRefId == 1){
            finalTargetValue =  quotient + remainder +  ((remainder % 2) == 0 ? 2 : 1);
            console.log("finalTargetValue::" + finalTargetValue);
        }
        else if(charityRoundUpRefId == 2){
            if(remainder < 5){
                finalTargetValue = quotient + 5
            }
            else{
                finalTargetValue = quotient + 10
            }
        }
        else if(charityRoundUpRefId == 3){
            finalTargetValue = quotient + 10;
        }

        chartityValue = finalTargetValue - targetValue;

        return {
            charityValue: formatValue(chartityValue),
            targetValue: formatValue(finalTargetValue)
        }
    } catch (error) {
        throw error;
    } 
}

function addReadOnlyPlayer(participant, action){
    removeExistingPlayer(participant);
                
    if(participant[action.subKey]["registeringAsAPlayer"] == 1){
        addPlayer(participant, action);
        if(participant[action.subKey]["personRoleRefId"] == 2){
            addCoach(participant, action);
        }
    }
    else {
        if(participant[action.subKey]["personRoleRefId"] == 2){
            addCoach(participant,action);
        }
        else if(participant[action.subKey]["personRoleRefId"] == 4){
            addPlayer(participant, action);
        }
    }
}

function removeExistingPlayer(participant){
    if(participant["team"]["players"]!= null && participant["team"]["players"].length > 0){
        let players = participant["team"]["players"].filter(x=>x.isDisabled == false);
        participant["team"]["players"] = (players!= null && players!= undefined) ? players : [];
    }
}

function addPlayer(participant, action){
    let obj = {
        competitionMembershipProductTypeId:participant["competitionMembershipProductTypeId"],
        firstName: participant[action.subKey]["firstName"], 
        lastName: participant[action.subKey]["lastName"],
        email: participant[action.subKey]["email"], 
        mobileNumber: participant[action.subKey]["mobileNumber"],
        payingFor: true,
        index: action.index,
        isDisabled: true,
        isPlayer: 1
    }
    if(participant["team"]["players"]){
        participant["team"]["players"].push(obj);
    }
    else{
        participant["team"]["players"] = [];
        participant["team"]["players"].push(obj);
    }
}

function addCoach(participant, action){
    let memProds = participant.competitionInfo.membershipProducts;
    if(memProds!= null && memProds.length > 0){
        let memProd = memProds.find(x=>x.shortName == "Coach" && x.allowTeamRegistrationTypeRefId!= null &&
        x.competitionMembershipProductId == participant.competitionMembershipProductId);
        if(memProd!= null && memProd!= undefined){
            let obj = {
                competitionMembershipProductTypeId:memProd["competitionMembershipProductTypeId"],
                firstName: participant[action.subKey]["firstName"], 
                lastName: participant[action.subKey]["lastName"],
                email: participant[action.subKey]["email"], 
                mobileNumber: participant[action.subKey]["mobileNumber"],
                payingFor: true,
                index: action.index,
                isDisabled: true,
                isPlayer: 0
            }
            if(participant["team"]["players"]){
                participant["team"]["players"].push(obj);
            }
            else{
                participant["team"]["players"] = [];
                participant["team"]["players"].push(obj);
            }
        }
    }
}

function updatePlayerData(participant, key, data){
   //console.log("updatePlayerData !!!!!!!::" +  key, data, participant);
    if(key == "firstName" || key == "lastName" || key == "email"
    || key == "mobileNumber"){
        //console.log("updatePlayerData !!!!!!!::" + JSON.stringify(participant["team"]["players"]));
        if(participant["team"]["players"]!= null && participant["team"]["players"].length > 0){
            let players = participant["team"]["players"].filter(x=>x.isDisabled == true);
           // console.log("players:::" + JSON.stringify(players));
            if(players!= null && players.length > 0){
                players.map((item,index) => {
                    item[key] = data;
                })
            }
        }
    }
}

function mergeRegistrationSettings1(settings, commonRegSetting, flag){
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
                    if(j!=0 && (keys[i] == "nominate_positions" || 
                        keys[i] == "play_friend" ||  keys[i] == "refer_friend")){
                           // obj[keys[i]] = 0;
                    }
                    else{
                        obj[keys[i]] = 1;
                    }
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

function updateTermsAndConditions(data, userRegistrations, state){
    //console.log("^^^^^^^^^^^^^^ termsAndConditionsFinal");
    let arr = [];
    let finalArr = [];
    let tcMap = new Map();
    let tcFinalMap = new Map();
    userRegistrations.map((item, index) => {
        let finalVal = data.find(x=>x.organisationId == item.organisationUniqueKey);
        if(finalVal!= null && finalVal!= undefined){
            if(tcMap.get(item.organisationUniqueKey) == undefined){
                arr.push(finalVal);
                tcMap.set(item.organisationUniqueKey, finalVal);

                finalVal.termsAndConditions.map((i) =>{
                    if(tcFinalMap.get(i.organisationUniqueKey) == undefined){
                        finalArr.push(i);
                        tcFinalMap.set(i.organisationUniqueKey, i);
                    }
                })

            }
        }

        (item.products).map((p,pIndex) => {
            let finalVal = data.find(x=>x.organisationId == p.organisationUniqueKey);
            if(finalVal!= null && finalVal!= undefined){
                if(tcMap.get(p.organisationUniqueKey) == undefined){
                    arr.push(finalVal);
                    tcMap.set(p.organisationUniqueKey, finalVal);
                    finalVal.termsAndConditions.map((i) =>{
                        if(tcFinalMap.get(i.organisationUniqueKey) == undefined){
                            finalArr.push(i);
                            tcFinalMap.set(i.organisationUniqueKey, i);
                        }
                    })
                }
            }
        });
    })

    state.termsAndConditionsFinal = finalArr;
    
    return arr;
}

function setSettings(participantIndex, prodIndex, registrationSettings, regSettings, registrationDetail,
    commonRegSetting)
{
    try{
        let index = participantIndex;
        let existingParticipant = registrationDetail.userRegistrations[index];
        let settings = regSettings.find(x=>x.index == index);
      //  console.log("&&&&&&&" + existingParticipant);
    //    console.log("registrationSettings######"+JSON.stringify(registrationSettings));
        if(settings!= undefined){
            let ind = index;
            let flag = -1;
            if(prodIndex != undefined && prodIndex != null){
                ind = prodIndex + 1;
                flag = ind;
                existingParticipant["products"][prodIndex]["regSetting"] = registrationSettings;
            }
            settings.settingArr[ind] = registrationSettings;
           // console.log("&&&&&&1111&" + JSON.stringify(settings));
            let setting = mergeRegistrationSettings1(settings.settingArr, commonRegSetting, flag);
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
            regSettings.push(regSetObj);
            existingParticipant["regSetting"] = registrationSettings;
            if(registrationSettings.club_volunteer == 1){
                commonRegSetting.club_volunteer = 1
            }
            if(registrationSettings.shop == 1){
                commonRegSetting.shop = 1
            }
            if(registrationSettings.voucher == 1){
                commonRegSetting.voucher = 1
            }
        }
    }
    catch(error){
        console.log("Error", error);
    }
}

function getDiscountValue(discount, paymentOptionRefId, fee, gameVoucherValue, compParticipant, isSchoolRegCodeApplied
    , noOfPlayers, payingForCount){
    console.log("getDiscountValue", discount, paymentOptionRefId, fee)
    let discountsToDeduct = 0;
    let amount = Number(discount.amount);
    if(paymentOptionRefId == 5 && isSchoolRegCodeApplied == 1){
        discountsToDeduct = 0
    }
    else if(discount.discountTypeId == 1){
        discountsToDeduct = (Number(amount)/noOfPlayers) * payingForCount;
    }
    else{
        if(paymentOptionRefId!= null){
            if(paymentOptionRefId > 2){
                discountsToDeduct = (feeIsNull(fee.feesToPay) - feeIsNull(fee.childDiscountsToDeduct)) * (feeIsNull(amount)/100);
            }
            else{
                if(paymentOptionRefId == 2){
                    discountsToDeduct = ((feeIsNull(fee.feesToPay) - feeIsNull(fee.childDiscountsToDeduct)) * feeIsNull(gameVoucherValue)) * (feeIsNull(amount)/100);
                }
                else{
                    discountsToDeduct = (feeIsNull(fee.feesToPay) - feeIsNull(fee.childDiscountsToDeduct)) * (feeIsNull(amount)/100);
                }
            }
        }
    }
    console.log("discountsToDeduct", discountsToDeduct);
    return discountsToDeduct;
}

function getChildDiscountValue(discount, paymentOptionRefId, fee, gameVoucherValue, selectedDiscount, key, compParticipant,
    isSchoolRegCodeApplied){
    console.log("getChildDiscountValue", discount, paymentOptionRefId, fee, selectedDiscount)
    let childDiscountsToDeduct = 0;
    let amount = 0;
    let childDiscount = null;
    if(key == "Mem"){
        childDiscount =  discount.childDiscounts.find(x=>x.membershipProductTypeChildDiscountId == selectedDiscount.membershipProductTypeChildDiscountId);
    }
    else if (key == "Comp"){
        childDiscount =  discount.childDiscounts.find(x=>x.competitionTypeChildDiscountId == selectedDiscount.competitionTypeChildDiscountId);
    }
   
    if(isNullOrUndefined(childDiscount)){
        amount = childDiscount.amount;
    }
    if(paymentOptionRefId == 5 && isSchoolRegCodeApplied == 1){
        childDiscountsToDeduct = 0
    }
    else if(paymentOptionRefId == 2){
        childDiscountsToDeduct = (feeIsNull(fee.feesToPay) * feeIsNull(gameVoucherValue)) * (feeIsNull(amount)/100);
    }
    else{
        childDiscountsToDeduct = (feeIsNull(fee.feesToPay) * (feeIsNull(amount)/100));
    }
    
    console.log("childDiscountsToDeduct", childDiscountsToDeduct);
    return childDiscountsToDeduct;
}

function calculateFee(paymentOptionRefId, memObj, gameVoucherValue, compParticipant, isSchoolRegCodeApplied){
    //console.log("calculateFee::", paymentOptionRefId, memObj, gameVoucherValue)
    try {
        if(paymentOptionRefId!= null){
            if(paymentOptionRefId <=2){
                let aCasualFee = isNullOrUndefined(memObj.fees.affiliateFee) ? 
                                         feeIsNull(memObj.fees.affiliateFee.casualFee)  : 0;
                        let aCasualGST = isNullOrUndefined(memObj.fees.affiliateFee) ? 
                                         feeIsNull(memObj.fees.affiliateFee.casualGST) : 0;
                        let cCasualFee = feeIsNull(memObj.fees.competitionOrganisorFee.casualFee);
                        let cCasualGST = feeIsNull(memObj.fees.competitionOrganisorFee.casualGST);
                        let mCasualFee = feeIsNull(memObj.fees.membershipFee.casualFee);
                        let mCasualGST = feeIsNull(memObj.fees.membershipFee.casualGST);
                if(paymentOptionRefId == 1){
                    memObj.feesToPay = aCasualFee + cCasualFee + mCasualFee + aCasualGST
                                                + cCasualGST + mCasualGST;
                    memObj.fees.membershipFee.feesToPay = mCasualFee;  
                    memObj.fees.membershipFee.feesToPayGST = mCasualGST;  
                    memObj.fees.competitionOrganisorFee.feesToPay = cCasualFee; 
                    memObj.fees.competitionOrganisorFee.feesToPayGST = cCasualGST; 
                    if(isNullOrUndefined(memObj.fees.affiliateFee)){
                        memObj.fees.affiliateFee.feesToPay = aCasualFee;  
                        memObj.fees.affiliateFee.feesToPayGST = aCasualGST;  
                    }
                     
                }
                else if(paymentOptionRefId == 2){
                    memObj.feesToPay = (aCasualFee + cCasualFee + mCasualFee + aCasualGST+ cCasualGST + mCasualGST) * 
                    feeIsNull(gameVoucherValue);
                    memObj.fees.membershipFee.feesToPay = (mCasualFee) *  feeIsNull(gameVoucherValue);  
                    memObj.fees.membershipFee.feesToPayGST = (mCasualGST) *  feeIsNull(gameVoucherValue);  
                    memObj.fees.competitionOrganisorFee.feesToPay = (cCasualFee) *  feeIsNull(gameVoucherValue); 
                    memObj.fees.competitionOrganisorFee.feesToPayGST = (cCasualGST) *  feeIsNull(gameVoucherValue);  
                    if(isNullOrUndefined(memObj.fees.affiliateFee)){
                        memObj.fees.affiliateFee.feesToPay = (aCasualFee) *  feeIsNull(gameVoucherValue); 
                        memObj.fees.affiliateFee.feesToPayGST = (aCasualGST) *  feeIsNull(gameVoucherValue); 
                    }
                }
            }
            else{
                if(paymentOptionRefId == 5 && isSchoolRegCodeApplied == 1){
                    memObj.feesToPay = 0;
                    memObj.fees.membershipFee.feesToPay = 0;  
                    memObj.fees.membershipFee.feesToPayGST = 0;  
                    memObj.fees.competitionOrganisorFee.feesToPay = 0; 
                    memObj.fees.competitionOrganisorFee.feesToPayGST = 0; 
                    if(isNullOrUndefined(memObj.fees.affiliateFee)){ 
                        memObj.fees.affiliateFee.feesToPay = 0;    
                        memObj.fees.affiliateFee.feesToPayGST = 0;    
                    }
                }
                else{
                    let aSeasonalFee = isNullOrUndefined(memObj.fees.affiliateFee) ? 
                                                feeIsNull(memObj.fees.affiliateFee.seasonalFee) : 0;
                    let aSeasonalGST = isNullOrUndefined(memObj.fees.affiliateFee) ? 
                                        feeIsNull(memObj.fees.affiliateFee.seasonalGST) : 0;
                    let cSeasonalFee =   feeIsNull(memObj.fees.competitionOrganisorFee.seasonalFee);
                    let cSeasonalGST =  feeIsNull(memObj.fees.competitionOrganisorFee.seasonalGST);
                    let mSeasonalFee =   feeIsNull(memObj.fees.membershipFee.seasonalFee);
                    let mSeasonalGST =   feeIsNull(memObj.fees.membershipFee.seasonalGST);

                    if(paymentOptionRefId == 3 || paymentOptionRefId == 5){
                        memObj.feesToPay = (aSeasonalFee + cSeasonalFee + mSeasonalFee + aSeasonalGST + cSeasonalGST
                            +  mSeasonalGST);
                        memObj.fees.membershipFee.feesToPay = mSeasonalFee;  
                        memObj.fees.membershipFee.feesToPayGST = mSeasonalGST;  
                        memObj.fees.competitionOrganisorFee.feesToPay = cSeasonalFee; 
                        memObj.fees.competitionOrganisorFee.feesToPayGST = cSeasonalGST; 
                        if(isNullOrUndefined(memObj.fees.affiliateFee)){ 
                            memObj.fees.affiliateFee.feesToPay = aSeasonalFee;  
                            memObj.fees.affiliateFee.feesToPayGST = aSeasonalGST;
                        }
                    }
                    else if(paymentOptionRefId == 4){
                        let totalDates = 0;
                        let paidDates = 0;
                        let dates = getInstalmentDatesToPay(compParticipant);
                        console.log("dates" + JSON.stringify(dates));
                        totalDates = dates.totalDates;
                        paidDates = dates.paidDates;

                        memObj.feesToPay = totalDates == 0 ? 0 :
                            ((aSeasonalFee + cSeasonalFee + mSeasonalFee + aSeasonalGST + cSeasonalGST
                            +  mSeasonalGST) / totalDates) * paidDates;
                        memObj.fees.membershipFee.feesToPay = totalDates == 0 ? 0 : (mSeasonalFee / totalDates) * paidDates;  
                        memObj.fees.membershipFee.feesToPayGST = totalDates == 0 ? 0 : (mSeasonalGST / totalDates) * paidDates;  
                        memObj.fees.competitionOrganisorFee.feesToPay = totalDates == 0 ? 0 : (cSeasonalFee / totalDates) * paidDates; 
                        memObj.fees.competitionOrganisorFee.feesToPayGST = totalDates == 0 ? 0 : (cSeasonalGST / totalDates) * paidDates; 
                        if(isNullOrUndefined(memObj.fees.affiliateFee)){ 
                            memObj.fees.affiliateFee.feesToPay = totalDates == 0 ? 0 : (aSeasonalFee / totalDates) * paidDates;  
                            memObj.fees.affiliateFee.feesToPayGST = totalDates == 0 ? 0 : (aSeasonalGST / totalDates) * paidDates;
                        }
                    }
                    
                }
            }
        }
    } catch (error) {
        console.log("calculateFee Error", error);
    }
    

    //console.log("memObj::", memObj);

}

function calculateDiscount(discountData, memProd, paymentOptionRefId, gameVoucherValue, key, compParticipant,
    isSchoolRegCodeApplied)
{
    console.log("calculateDiscount", discountData, memProd,paymentOptionRefId,  compParticipant)
    try {
        let noOfPlayers = 1;
            let payingForCount = 1;
            if(compParticipant.isTeamRegistration == 1){
                noOfPlayers = compParticipant.noOfPlayers;
                payingForCount = compParticipant.payingForCount;
            }

        memProd.discountsToDeduct = 0;
        if(key != "fromValidateDiscountCode"){
            memProd.childDiscountsToDeduct = 0;
        }
       
        discountData.map((x) =>{
           // console.log("XXXXX", x);
            if(x.competitionTypeDiscountId!= null)
            {
                let discount = memProd.discounts.find(y=>y.competitionTypeDiscountId == 
                    x.competitionTypeDiscountId);
                   // console.log("discount", discount);
                if(isNullOrUndefined(discount)){
                    if(memProd.fees.competitionOrganisorFee.organisationId == discount.organisationId)
                    {
                        let feeObj = memProd.fees.competitionOrganisorFee;
                        if(x.typeId == 3){
                            let childDiscountVal =  getChildDiscountValue(discount, paymentOptionRefId, feeObj, gameVoucherValue, x, "Comp", 
                                            compParticipant, isSchoolRegCodeApplied);
                            //console.log("childDiscountVal" + childDiscountVal);
                            memProd.childDiscountsToDeduct = feeIsNull(memProd.childDiscountsToDeduct) +  childDiscountVal;
                            memProd.fees.competitionOrganisorFee.childDiscountsToDeduct = childDiscountVal;
                        }
                        else if(x.typeId == 2){
                            let discountVal =  getDiscountValue(discount, paymentOptionRefId, feeObj, gameVoucherValue,
                                         compParticipant, isSchoolRegCodeApplied, noOfPlayers, payingForCount);
                            memProd.discountsToDeduct = feeIsNull(memProd.discountsToDeduct) +  discountVal;
                            memProd.fees.competitionOrganisorFee.discountsToDeduct = discountVal;
                            if(paymentOptionRefId!= 5 || (paymentOptionRefId == 5 && isSchoolRegCodeApplied == 0)){
                                memProd.isDiscountApplied = 1;
                            }
                            else{
                                memProd.isDiscountApplied = 0;
                                memProd.selectedDiscounts = [];
                                memProd.selectedCode = null;
                            }
                        }
                    }
                    else if(memProd.fees.affiliateFee!= null && 
                            memProd.fees.affiliateFee.organisationId == discount.organisationId)
                    {
                        let feeObj = memProd.fees.affiliateFee;
                        if(x.typeId == 3){
                            let childDiscountVal =  getChildDiscountValue(discount, paymentOptionRefId, feeObj, gameVoucherValue, x,  "Comp", 
                                        compParticipant, isSchoolRegCodeApplied);
                            memProd.childDiscountsToDeduct = feeIsNull(memProd.childDiscountsToDeduct) +  childDiscountVal;
                            memProd.fees.affiliateFee.childDiscountsToDeduct = childDiscountVal;
                        }
                        else if(x.typeId == 2){
                            let discountVal =  getDiscountValue(discount, paymentOptionRefId, feeObj, gameVoucherValue, compParticipant, 
                                isSchoolRegCodeApplied, noOfPlayers, payingForCount);
                            memProd.discountsToDeduct = feeIsNull(memProd.discountsToDeduct) + discountVal;
                            memProd.fees.affiliateFee.discountsToDeduct = discountVal;
                            if(paymentOptionRefId!= 5 || (paymentOptionRefId == 5 && isSchoolRegCodeApplied == 0)){
                                memProd.isDiscountApplied = 1;
                            }
                            else{
                                memProd.isDiscountApplied = 0;
                                memProd.selectedDiscounts = [];
                                memProd.selectedCode = null;
                            }
                        }
                    }
                }
            }
            else if(x.membershipProductTypeDiscountId != null){
                let discount = memProd.discounts.find(y=>y.membershipProductTypeDiscountId == 
                    x.membershipProductTypeDiscountId);
                if(isNullOrUndefined(discount)){
                    if(memProd.fees.membershipFee.organisationId == discount.organisationId)
                    {
                        let feeObj = memProd.fees.membershipFee;
                        if(x.typeId == 3){
                            let childDiscountVal =  getChildDiscountValue(discount, paymentOptionRefId, feeObj, gameVoucherValue, x,  "Mem", compParticipant,
                                                    isSchoolRegCodeApplied);
                            memProd.childDiscountsToDeduct = feeIsNull(memProd.childDiscountsToDeduct) +  childDiscountVal;
                            memProd.fees.membershipFee.childDiscountsToDeduct = childDiscountVal;
                        }
                        else if(x.typeId == 2){
                            let discountVal =  getDiscountValue(discount, paymentOptionRefId, feeObj, gameVoucherValue, compParticipant,
                                                isSchoolRegCodeApplied, 1, 1);
                            memProd.discountsToDeduct = feeIsNull(memProd.discountsToDeduct) + discountVal;
                            memProd.fees.membershipFee.discountsToDeduct = discountVal;
                            if(paymentOptionRefId!= 5 || (paymentOptionRefId == 5 && isSchoolRegCodeApplied == 0)){
                                memProd.isDiscountApplied = 1;
                            }
                            else{
                                memProd.isDiscountApplied = 0;
                                memProd.selectedDiscounts = [];
                                memProd.selectedCode = null;
                            }
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.log("Error", error);
    }
    
}

function setIsSchoolRegistration(reviewData){
   // console.log("reviewData", reviewData);
    let otherOption = 0;
    let isSchoolRegistration = 0;
    reviewData.compParticipants.map((item) =>{
        if(item.selectedOptions.paymentOptionRefId != 5 || 
                (item.selectedOptions.paymentOptionRefId == 5 && item.selectedOptions.isSchoolRegCodeApplied == 0)){
            otherOption = 1;
        }
        if(item.selectedOptions.paymentOptionRefId == 5 && item.selectedOptions.isSchoolRegCodeApplied == 1){
            isSchoolRegistration = 1;
        }
    })

    if(otherOption == 0 && isSchoolRegistration == 1){
        isSchoolRegistration = 1;
    }
    else{
        isSchoolRegistration = 0; 
    }

   // console.log("isSchoolRegistration" + isSchoolRegistration);

    reviewData.isSchoolRegistration = isSchoolRegistration;
}

function getInstalmentDatesToPay(item){
    try {
        let totalDates = 0;
        let paidDates = 0;
        if(item.isTeamSeasonalUponReg == 1 || item.isSeasonalUponReg == 1){
            totalDates += 1;
            paidDates += 1;
        }

        if(isArrayNotEmpty(item.instalmentDates)){
            totalDates += item.instalmentDates.length;
            item.instalmentDates.map((x) =>{
                if(moment(x.instalmentDate).isBefore(moment())){
                    paidDates += 1;
                }
            })
        }

        return {
            totalDates,
            paidDates
        }
    } catch (error) {
        throw error;
    }
}
export default endUserRegistrationReducer;