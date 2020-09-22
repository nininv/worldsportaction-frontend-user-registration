import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button, 
    Table,
    DatePicker,
    Radio, 
    Form, 
    Modal, 
    message, 
    Steps,
    Tag
} from "antd";
import "./product.css";
import "../user/user.css";
import '../competition/competition.css';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import {getUreAction} from "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { 
    getCommonRefData,  
    favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction, 
    heardByReferenceAction,
    playerPositionReferenceAction,
    genderReferenceAction, 
    disabilityReferenceAction,
    personRegisteringRoleReferenceAction ,
    identificationReferenceAction,
    otherSportsReferenceAction,
    accreditationUmpireReferenceAction,
    accreditationCoachReferenceAction,
    walkingNetballQuesReferenceAction
} from '../../store/actions/commonAction/commonAction';
import { 
    getUserRegistrationUserInfoAction,
    updateUserRegistrationObjectAction,
    selectParticipantAction,
    membershipProductEndUserRegistrationAction,
    updateParticipantCompetitionAction,
    updateUserRegistrationStateVarAction,
    updateParticipantAdditionalInfoAction,
    saveParticipantInfo,
    getParticipantInfoById,
    orgRegistrationRegSettingsEndUserRegAction
} from '../../store/actions/registrationAction/userRegistrationAction';
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {getOrganisationId,  getCompetitonId, getUserId, getAuthToken, getSourceSystemFlag } from "../../util/sessionStorage";
import CSVReader from 'react-csv-reader'
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import { isEmptyArray } from "formik";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class AppRegistrationFormNew extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            submitButtonText: AppConstants.addPariticipant,
            showAddAnotherCompetitionView: false,
            searchAddressError: null,
            organisationId: null,
            competitionId: null,
            enabledSteps: [],
            completedSteps: [],
            singleCompModalVisible: false,
            getMembershipLoad: false,
            getParticipantByIdLoad: false,
            findAnotherCompetitionFlag: false,
            registrationId: null,
            participantId: null
        } 
        this.props.getCommonRefData();
        this.props.genderReferenceAction();
        this.props.countryReferenceAction();
        this.props.playerPositionReferenceAction();
        this.props.identificationReferenceAction();
        this.props.disabilityReferenceAction();
        this.props.favouriteTeamReferenceAction();
        this.props.firebirdPlayerReferenceAction();
        this.props.otherSportsReferenceAction();
        this.props.heardByReferenceAction();
        this.props.accreditationUmpireReferenceAction();
        this.props.accreditationCoachReferenceAction();
        this.props.walkingNetballQuesReferenceAction();
    }

    componentDidUpdate(nextProps){
        let registrationState = this.props.userRegistrationState;
        if(!registrationState.onMembershipLoad && this.state.getMembershipLoad){
            let participantId = this.props.location.state ? this.props.location.state.participantId : null;
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            //let participantId = "5f85e320-ba23-4654-848e-8b9aa00ca15f";
            this.setState({participantId: participantId,registrationId: registrationId});
            if(participantId){
                this.props.getParticipantInfoById(participantId);
                this.setState({getParticipantByIdLoad: true})
            }else{
                if(registrationId){
                    this.props.updateUserRegistrationStateVarAction("registrationId",registrationId);
                    this.selectAnotherParticipant();
                } 
            }
            this.setState({getMembershipLoad: false});
        }

        if(!registrationState.onParticipantByIdLoad && this.state.getParticipantByIdLoad){
            this.state.completedSteps = [0,1,2];
            this.state.enabledSteps = [0,1,2];
            this.setState({getParticipantByIdLoad: false,
                completedSteps: this.state.completedSteps,
                enabledSteps: this.state.enabledSteps});
            setTimeout(() => {
                this.setParticipantDetailStepFormFields();
            },300);
        }

        if(registrationState.addCompetitionFlag){
            //calling setting service after added competition
            let payload = {
                "organisationUniqueKey": this.state.organisationId,
                "competitionUniqueKey": this.state.competitionId
            }
            this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
            this.setState({showAddAnotherCompetitionView: false,
                organisationId: null,
                competitionId: null
            });
            if(this.state.findAnotherCompetitionFlag){
                this.setState({findAnotherCompetitionFlag: false})
            }
            this.props.updateUserRegistrationStateVarAction("addCompetitionFlag",false);
        }

        if(registrationState.isSavedParticipant){
            this.props.updateUserRegistrationStateVarAction("isSavedParticipant",false);
            if(registrationState.saveValidationErrorMsg!= null && registrationState.saveValidationErrorMsg.length > 0){
                this.setState({singleCompModalVisible: true});
            }else{
                history.push("/registrationProducts", {
                    registrationId: this.props.userRegistrationState.registrationId,
                    paymentSuccess: false					 
                })
            }
        }

        if(registrationState.updateExistingUserOnLoad){
            setTimeout(() => {
                this.setParticipantDetailStepFormFields();
            },300);
            this.props.updateUserRegistrationStateVarAction("updateExistingUserOnLoad",false);
        }
    }

    componentDidMount(){
        this.getUserInfo();
        this.props.membershipProductEndUserRegistrationAction({});
        this.setState({getMembershipLoad: true});
        if(getOrganisationId() != null && getCompetitonId != null){
            this.setState({showAddAnotherCompetitionView: false,
            organisationId: getOrganisationId(),
            competitionId: getCompetitonId()})
        }
    }

    changeStep = (current) => {
        if(this.state.enabledSteps.includes(current)){
            this.setState({currentStep: current});
        }
        if(current == 0){
            this.setState({submitButtonText: AppConstants.addPariticipant})
            setTimeout(() => {
                this.setParticipantDetailStepFormFields();
            },300);
        }else if(current == 1){
            if(this.state.enabledSteps.includes(1)){
                this.setState({submitButtonText: AppConstants.addCompetitionAndMembership});
            }
        }else{
            if(this.state.enabledSteps.includes(2)){
                this.setState({submitButtonText: AppConstants.signupToCompetition});
            }
        }
    }

    setParticipantDetailStepFormFields(){
        const { registrationObj } = this.props.userRegistrationState;
        try{
            this.props.form.setFieldsValue({
                [`genderRefId`]: registrationObj.genderRefId,
                [`dateOfBirth`]: moment(registrationObj.dateOfBirth, "YYYY-MM-DD"),
                [`participantFirstName`]: registrationObj.firstName,
                [`participantMiddleName`]: registrationObj.middleName,
                [`participantLastName`]: registrationObj.lastName,
                [`participantMobileNumber`]: registrationObj.mobileNumber,
                [`participantEmail`]: registrationObj.email
            });
            if(registrationObj.addNewAddressFlag){
                this.setParticipantDetailStepAddressFormFields("addNewAddressFlag");
            }
            if(registrationObj.manualEnterAddressFlag){
                this.setParticipantDetailStepAddressFormFields("manualEnterAddressFlag");
            }
            {(registrationObj.parentOrGuardian || []).map((parent,pIndex) =>{
                this.props.form.setFieldsValue({
                    [`parentFirstName${pIndex}`]: parent.firstName,
                    [`parentMiddleName${pIndex}`]: parent.middleName,
                    [`parentLastName${pIndex}`]: parent.lastName,
                    [`parentMobileNumber${pIndex}`]: parent.mobileNumber,
                    [`parentEmail${pIndex}`]: parent.email,
                });
                if(parent.addNewAddressFlag){
                    this.setParticipantDetailStepParentAddressFormFields("addNewAddressFlag",parent,pIndex);
                }
            })}
                
        }catch(ex){
            console.log("Error in setParticipantDetailStepFormFields"+ex);
        }
    }

    setParticipantDetailStepAddressFormFields = (key) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            if(key == "addNewAddressFlag"){
                this.props.form.setFieldsValue({
                    [`participantAddressSearch`]: this.getAddress(registrationObj)
                });
            }else if(key == "manualEnterAddressFlag"){
                this.props.form.setFieldsValue({
                    [`participantStreet1`]: registrationObj.street1,
                    [`participantSuburb`]: registrationObj.suburb,
                    [`participantStateRefId`]: registrationObj.stateRefId,
                    [`participantPostalCode`]: registrationObj.postalCode,
                    [`participantCountryRefId`]: registrationObj.countryRefId
                }); 
            }
        }catch(ex){
            console.log("Error in setParticipantDetailStepAddressFormFields"+ex);
        }
    }

    setParticipantDetailStepParentAddressFormFields = (key,parent,pIndex) => {
        try{
            if(key == "addNewAddressFlag"){
                this.props.form.setFieldsValue({
                    [`parentAddressSearch${pIndex}`]: this.getAddress(parent),
                });
            }else if(key == "manualEnterAddressFlag"){
                console.log("country",parent.countryRefId);
                this.props.form.setFieldsValue({
                    [`parentStreet1${pIndex}`]: parent.street1,
                    [`parentSuburb${pIndex}`]: parent.suburb,
                    [`parentStateRefId${pIndex}`]: parent.stateRefId,
                    [`parentCountryRefId${pIndex}`]: parent.countryRefId,
                    [`parentPostalCode${pIndex}`]: parent.postalCode,
                }); 
            }
        }catch(ex){
            console.log("Error in setParticipantDetailStepParentAddressFormFields"+ex);
        }
    }

    getAddress = (addressObject) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const state = stateList.length > 0 && addressObject.stateRefId > 0
                ? stateList.find((state) => state.id === addressObject.stateRefId).name
                : null;
            const country = countryList.length > 0 && addressObject.countryRefId > 0
            ? countryList.find((country) => country.id === addressObject.countryRefId).name
            : null;

            let defaultAddress = '';
            if(addressObject.street1 && addressObject.suburb && state){
                defaultAddress = (addressObject.street1 ? addressObject.street1 + ', ': '') + 
                (addressObject.suburb ? addressObject.suburb + ', ': '') +
                (addressObject.postalCode ? addressObject.postalCode + ', ': '') + 
                (state ? state + ', ': '') +
                (country ? country + '.': '');
            }
            return defaultAddress;
        }catch(ex){
            console.log("Error in getPartcipantParentAddress"+ex);
        }
    }

    // getParentAddress = (parent) => {
    //     try{
    //         const { stateList,countryList } = this.props.commonReducerState;
    //         const state = stateList.length > 0 && parent.stateRefId > 0
    //             ? stateList.find((state) => state.id === parent.stateRefId).name
    //             : null;
    //         const country = countryList.length > 0 && parent.countryRefId > 0
    //             ? countryList.find((country) => country.id === parent.countryRefId).name
    //             : null;

    //         let defaultAddress = '';
    //         if(parent.street1 && parent.suburb && state){
    //             defaultAddress = (parent.street1 ? parent.street1 + ', ': '') + 
    //             (parent.suburb ? parent.suburb + ', ': '') +
    //             (parent.postalCode ? parent.postalCode + ', ': '') + 
    //             (state ? state + ', ': '') +
    //             (country ? country + '.': '');
    //         }
    //         return defaultAddress;
    //     }catch(ex){
    //         console.log("Error in getParentAddress"+ex);
    //     }
    // }

    getUserInfo = () => {
        if(getUserId() != 0)
        {
            let payload = {
                competitionUniqueKey: getCompetitonId(),
                organisationId: getOrganisationId(),
                userId: getUserId()
            }
            this.setState({getUserLoad: true});
            this.props.getUserRegistrationUserInfoAction(payload);
        }
    }

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    setImage = (data,key) => {
        if(data.files[0] !== undefined){
            if(key == "participantPhoto"){
                let photoUrl = URL.createObjectURL(data.files[0]);
                this.props.updateUserRegistrationObjectAction(photoUrl, "photoUrl");
                let particpantPhoto = data.files[0];
                this.props.updateUserRegistrationObjectAction(particpantPhoto, "participantPhoto");
            }
        }
    }

    addOrSelectParticipant = (userId) => {
        this.props.selectParticipantAction(userId,"userId");
    }

    getParentObj = () => {
        let parentObj = {
            "tempParentId": null,
            "userId": 0,
            "firstName": null,
            "middleName": null,
			"lastName": null,
			"mobileNumber": null,
			"email": null,
			"street1": null,
			"street2": null,
			"suburb": null,
            "stateRefId": null,
            "countryRefId": 1,
            "postalCode": null,
            "isSameAddress": false,
            "selectAddressFlag": true,
            "addNewAddressFlag": false,
            "manualEnterAddressFlag": false
        }
        return parentObj;
    }

    onChangeSetParticipantValue = (value,key) => {
        const { registrationObj } = this.props.userRegistrationState;
        this.props.updateUserRegistrationObjectAction(value,key);
        if(key == "dateOfBirth" || key == "referParentEmail"){
            setTimeout(() => {
                this.props.form.setFieldsValue({
                    [`participantEmail`]: registrationObj.email ? registrationObj.email : null
                });
            });
        }
    }

    addParent = (key,parentIndex) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
            if(key == "add"){
                let parentObj = this.getParentObj();
                parentObj.selectAddressFlag = newUser ? false : true;
                parentObj.addNewAddressFlag = newUser ? true : false;
                parentObj.tempParentId = registrationObj.parentOrGuardian.length + 1; 
                registrationObj.parentOrGuardian.push(parentObj);
            }
            if(key == "remove"){
                registrationObj.parentOrGuardian.splice(parentIndex,1);
            }
            this.props.updateUserRegistrationObjectAction(registrationObj,"registrationObj")
        }catch(ex){
            console.log("Exception occured in addParent"+ex);
        }
    }

    onChangeSetParentValue = (value,key,parentIndex) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            registrationObj.parentOrGuardian[parentIndex][key] = value;
            if(key == "isSameAddress"){
                if(value){
                    registrationObj.parentOrGuardian[parentIndex]["street1"] = registrationObj.street1;
                    registrationObj.parentOrGuardian[parentIndex]["street2"] = registrationObj.street2;
                    registrationObj.parentOrGuardian[parentIndex]["suburb"] = registrationObj.suburb;
                    registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = registrationObj.stateRefId;
                    registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = registrationObj.countryRefId;
                    registrationObj.parentOrGuardian[parentIndex]["postalCode"] = registrationObj.postalCode;
                }else{
                    this.clearParentAddress(registrationObj,parentIndex);
                }
            }else if(key == "addOrRemoveAddressBySelect"){
                if(value){
                    let userInfoList = deepCopyFunction(this.props.userRegistrationState.userInfo);
                    let userInfo = userInfoList.find(x => x.id == registrationObj.userId);
                    let parentInfo = userInfo.parentOrGuardian.find(x => x.userId == value);
                    registrationObj.parentOrGuardian[parentIndex]["street1"] = parentInfo.street1;
                    registrationObj.parentOrGuardian[parentIndex]["street2"] = parentInfo.street2;
                    registrationObj.parentOrGuardian[parentIndex]["postalCode"] = parentInfo.postalCode;
                    registrationObj.parentOrGuardian[parentIndex]["suburb"] = parentInfo.suburb;
                    registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = parentInfo.stateRefId;
                    registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = parentInfo.countryRefId;
                }else{
                   this.clearParentAddress(registrationObj,parentIndex);
                }
            }
            this.props.updateUserRegistrationObjectAction(registrationObj,"registrationObj");
        }catch(ex){
            console.log("Exception occured in onChangeSetParentValue"+ex);
        }
    }

    clearParentAddress = (registrationObj,parentIndex) => {
        registrationObj.parentOrGuardian[parentIndex]["street1"] = null;
        registrationObj.parentOrGuardian[parentIndex]["street2"] = null;
        registrationObj.parentOrGuardian[parentIndex]["suburb"] = null;
        registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = null;
        registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = null;
        registrationObj.parentOrGuardian[parentIndex]["postalCode"] = null;
    }

    handlePlacesAutocomplete = (addressData,key,parentGuardianIndex) => {
        const { stateList } = this.props.commonReducerState;
        const address = addressData;
        // if (!address.addressOne) {
        //     this.setState({searchAddressError: ValidationConstants.addressDetailsError});
        // }else {
        //     this.setState({searchAddressError: ''})
        // }
        const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address.state).id : null;
        if(address){
            // if(key == "parent"){
            //     this.onChangeSetParentValue(stateRefId, "stateRefId", index, parentGuardianIndex);
            //     this.onChangeSetParentValue(address.addressOne, "street1", index, parentGuardianIndex);
            //     this.onChangeSetParentValue(address.suburb, "suburb", index, parentGuardianIndex);
            //     this.onChangeSetParentValue(address.postcode, "postalCode", index, parentGuardianIndex);
            //     this.onChangeSetParentValue(address.lat, "lat", index, parentGuardianIndex);
            //     this.onChangeSetParentValue(address.lng, "lng", index, parentGuardianIndex);
            //     this.props.form.setFieldsValue({
            //         [`parentStreet1${index}${parentGuardianIndex}`]: address.addressOne,
            //         [`parentSuburb${index}${parentGuardianIndex}`]: address.suburb,
            //         [`parentStateRefId${index}${parentGuardianIndex}`]: stateRefId,
            //         [`parentPostalCode${index}${parentGuardianIndex}`]: address.postcode,
            //     });
            // }
            if (key == "participant"){
                this.onChangeSetParticipantValue(stateRefId, "stateRefId");
                this.onChangeSetParticipantValue(address.addressOne, "street1");
                this.onChangeSetParticipantValue(address.suburb, "suburb");
                this.onChangeSetParticipantValue(address.postcode, "postalCode");
                this.onChangeSetParticipantValue(address.lat, "latitue");
                this.onChangeSetParticipantValue(address.lng, "longitude");
                this.props.form.setFieldsValue({
                    [`participantStreet1`]:  address.addressOne,
                    [`participantSuburb`]:  address.suburb,
                    [`participantStateRefId`]:  stateRefId,
                    [`participantPostalCode`]:  address.postcode,
                });              
            }
            // if(key == "yourInfo"){
            //     this.onChangeSetYourInfo(stateRefId, "stateRefId")
            //     this.onChangeSetYourInfo(address.addressOne, "street1");
            //     this.onChangeSetYourInfo(address.suburb, "suburb");
            //     this.onChangeSetYourInfo(address.postcode, "postalCode");
            //     this.onChangeSetYourInfo(address.lat, "lat");
            //     this.onChangeSetYourInfo(address.lng, "lng");
            //     this.props.form.setFieldsValue({
            //         [`yStreet1`]:  address.addressOne,
            //         [`ySuburb`]:  address.suburb,
            //         [`yStateRefId`]:  stateRefId,
            //         [`yPostalCode`]:  address.postcode,
            //     });
            // }  
            // if(key == "team"){
            //     this.onChangeSetTeam(stateRefId, "stateRefId", index, "team")
            //     this.onChangeSetTeam(address.addressOne, "street1", index, "team")
            //     this.onChangeSetTeam(address.suburb, "suburb", index, "team")
            //     this.onChangeSetTeam(address.postcode, "postalCode", index, "team")
            //     this.onChangeSetTeam(address.lat, "lat", index, "team")
            //     this.onChangeSetTeam(address.lng, "lng", index, "team");
            //     this.props.form.setFieldsValue({
            //         [`tStreet1${index}`]:  address.addressOne,
            //         [`tSuburb${index}`]:  address.suburb,
            //         [`tStateRefId${index}`]:  stateRefId,
            //         [`tPostalCode${index}`]:  address.postcode,
            //     });
            // }  
        }  
    };

    onChangeSetCompetitionValue = (value,key,index,subIndex,subKey) =>{
        this.props.updateParticipantCompetitionAction(value,key,index,subIndex,subKey);
    }

    addFriend = (removeOrAdd,competitionIndex,friendIndex) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            let friends = registrationObj.competitions[competitionIndex].friends;
            if(removeOrAdd == "add"){
                let friend = {
                    "firstName": null,
                    "lastName": null,
                    "mobileNumber": null,
                    "email": null
                }
                friends.push(friend);
            }else{
                friends.splice(friendIndex,1);
            }
            this.onChangeSetCompetitionValue(friends,"friends",competitionIndex);
        }catch(ex){
            console.log("Error in addFriend"+ex);
        }
    }

    addReferFriend = (removeOrAdd,competitionIndex,referFriendIndex) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            let referFriends = registrationObj.competitions[competitionIndex].referFriends;
            if(removeOrAdd == "add"){
                let friend = {
                    "firstName": null,
                    "lastName": null,
                    "mobileNumber": null,
                    "email": null
                }
                referFriends.push(friend);
            }else{
                referFriends.splice(referFriendIndex,1);
            }
            this.onChangeSetCompetitionValue(referFriends,"referFriends",competitionIndex);
        }catch(ex){
            console.log("Error in addReferFriends"+ex);
        }
    }

    addAnotherCompetition = (competition) => {
        this.setState({competitionId: competition.competitionUniqueKey});
        let { membershipProductInfo } = this.props.userRegistrationState;
        let organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == this.state.organisationId);
        if(organisationInfo){
            let organisation = {
                organisationInfo : deepCopyFunction(organisationInfo),
                competitionInfo: competition,
                findAnotherCompetition: this.state.findAnotherCompetitionFlag
            }
            this.props.updateUserRegistrationObjectAction(organisation,"competitions");
        }
    }

    onChangeSetAdditionalInfo = (value,key) => {
        this.props.updateParticipantAdditionalInfoAction(key,value);
    }

    getFilteredRegisrationObj = (registrationObj) => {
        registrationObj["existingUserId"] = getUserId() ? Number(getUserId()) : null;
        registrationObj.participantId = this.state.participantId != null ? this.state.participantId : null;
        registrationObj.registrationId = this.state.registrationId != null ? this.state.registrationId : null; 
        registrationObj.userId = registrationObj.userId == -1 || registrationObj.userId == -2 ? null : registrationObj.userId;
        let competitions = registrationObj.competitions;
        for(let competition of competitions){
            competition.organisationInfo = null;
            competition.competitionInfo = null;
        }
        return registrationObj;
    }

    getParticipantType = () => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            let participantType;
            if(registrationObj.registeringYourself == 1){
                participantType = "Myself";
            }else if(registrationObj.registeringYourself == 2){
                participantType = "Child";
            }else{
                participantType = "Registering someone else"
            }
            return participantType;
        }catch(ex){
            console.log("Error in getParticipantType"+ex);
        }
    }

    findAnotherCompetition = (competitionIndex) => {
        if(competitionIndex == 0){
            this.setState({showAddAnotherCompetitionView: true,
            findAnotherCompetitionFlag: true});
        }else{
            this.onChangeSetCompetitionValue(null,"competition",competitionIndex,null,null)
        }  
    }

    disabledOrNot = () => {
        // let disabled;
        // this.props.form.validateFields((err,values) => {
        //     disabled = err ? true : false;
        // });
        // console.log("button",disabled);
        // return disabled;
    }

    selectAnotherParticipant = () => {
        let empty = [];
        this.setState({enabledSteps: empty,
            completedSteps: empty,
            currentStep: 0});
        this.props.updateUserRegistrationStateVarAction("registrationObj",null);
    }

    productValidation = () => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            let competitions = registrationObj.competitions;
            let check = true;
            for(let competition of competitions){
                if(isArrayNotEmpty(competition.products)){
                    for(let product of competition.products){
                        if(product.isPlayer == 1){
                            let divisionsTemp = competition.divisions.find(x => x.competitionMembershipProductTypeId == product.competitionMembershipProductTypeId);
                            if(divisionsTemp == undefined){
                                check = false;
                                break;
                            }
                        }
                    }
                }else{
                    check = false;
                } 
            }
            return check;
        }catch(ex){
            console.log("Error in checkProductEitherAddOrNot"+ex);
        }
    }
    
    saveRegistrationForm = (e) => {
        try{
            e.preventDefault();
            const { registrationObj } = this.props.userRegistrationState;
            let saveRegistrationObj = JSON.parse(JSON.stringify(registrationObj));
            let filteredSaveRegistrationObj = this.getFilteredRegisrationObj(saveRegistrationObj)
            //console.log("final obj"+JSON.stringify(filteredSaveRegistrationObj));
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                    if(registrationObj.photoUrl == null){
                        message.error(ValidationConstants.userPhotoIsRequired);
                        return;
                    }
                    if(registrationObj.parentOrGuardian.length == 0 && 
                        getAge(registrationObj.dateOfBirth) < 18){
                        message.error(ValidationConstants.parentDetailsIsRequired)
                        return;
                    }
                    if(this.state.currentStep == 1){
                        if(registrationObj.competitions.length == 0){
                            message.error(ValidationConstants.competitionField);
                            return;
                        }else{
                            let productAdded = this.productValidation();
                            if(!productAdded){
                                message.error(ValidationConstants.fillMembershipProductInformation);
                                return;
                            }
                        }
                    }
                    if(this.state.currentStep != 2){
                        let nextStep = this.state.currentStep + 1;
                        if(nextStep == 1){
                            if(registrationObj.competitions.length == 0){
                                this.setState({showAddAnotherCompetitionView: true});
                            }
                            this.state.enabledSteps.push(0,nextStep);
                        }else{
                            this.state.enabledSteps.push(nextStep);
                        }
                        this.state.completedSteps.push(this.state.currentStep);
                        this.setState({currentStep: nextStep,
                        enabledSteps: this.state.enabledSteps,
                        completedSteps: this.state.completedSteps});
                    }
                    setTimeout(() => {
                        this.setState({
                            submitButtonText: this.state.currentStep == 1 ? 
                            AppConstants.addCompetitionAndMembership : 
                            AppConstants.signupToCompetition});
                    },100);
                    if(this.state.currentStep == 2){
                        let formData = new FormData();
                        formData.append("participantPhoto", registrationObj.participantPhoto);
                        formData.append("participantDetail", JSON.stringify(filteredSaveRegistrationObj));
                        this.props.saveParticipantInfo(formData);
                    }
                }
            });
        }catch(ex){
            console.log("Exception occured in saveRegistrationForm"+ex);
        }
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "flex-start"
                    }}>
                    <Breadcrumb
                        style={{ alignItems: "center", alignSelf: "center" }}
                        separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.signupToCompetition}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        )
    }

    participantDetailsStepView = (getFieldDecorator) => {
        let { registrationObj } = this.props.userRegistrationState;
        return(
            <div>
                {registrationObj.userId == -1 || registrationObj.userId == -2 ? 
                    <div>{this.addedParticipantView()}</div>
                : 
                    <div>{this.addedParticipantWithProfileView()}</div>
                }
                <div>{this.participantDetailView(getFieldDecorator)}</div>
                {getAge(registrationObj.dateOfBirth) < 18 && (
                    <div>{this.parentOrGuardianView(getFieldDecorator)}</div>
                )}
            </div>
        )
    }

    addOrSelectParticipantView = () => {
        let userRegistrationstate = this.props.userRegistrationState;
        let userInfo = userRegistrationstate.userInfo;
        let registrationObj = userRegistrationstate.registrationObj;
        return(
            <div style={{marginTop: "0px !important",
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "40px"}}>
                <div className="form-heading" 
                style={{paddingBottom: "0px"}}>
                    {userInfo.length == 0 ? AppConstants.addPariticipant : AppConstants.selectOrAddParticipant}
                </div>
                <div className="row">
                    {(userInfo || []).map((user,index) => (
                        <div className='col-sm-12 col-md-6' key={index}>
                            <div 
                            onClick={() => this.addOrSelectParticipant(user.id)}
                            className={registrationObj != null && registrationObj.userId == user.id ? 'new-participant-button-active' : 'new-participant-button-inactive'}>
                                <img className="profile-img" src={user.photoUrl}/> 
                                <div style={{width: "75%",paddingLeft: "15px"}}>
                                    <div>{user.firstName} {user.lastName}</div>
                                    <div style={{fontSize: "15px"}}>{user.genderRefId == 1 ? 'Male' : 'Female'}, {moment(user.dateOfBirth).format("DD/MM/YYYY")}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='col-sm-12 col-md-6'>
                        <div 
                        onClick={() => this.addOrSelectParticipant(-1)}
                        className={registrationObj != null && registrationObj.userId == -1 ? 'new-participant-button-active' : 'new-participant-button-inactive'} 
                        style={{textAlign: "center",padding: "0px 40px"}}>+ {AppConstants.newParticipantRegistration}</div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div 
                        onClick={() => this.addOrSelectParticipant(-2)}
                        className={registrationObj != null && registrationObj.userId == -2 ? 'new-participant-button-active' : 'new-participant-button-inactive'}
                        style={{textAlign: "center",padding: "0px 70px"}}>+ {AppConstants.newTeamRegistration}</div>
                    </div>
                </div>

                {registrationObj != null && (registrationObj.userId == -1 || registrationObj.userId == -2) ?
                    <div>
                        <InputWithHead heading={AppConstants.areYouRegisteringYourself} required={"required-field"}></InputWithHead>
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "registeringYourself")}
                            value={registrationObj.registeringYourself}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={2}>{AppConstants.noRegisteringMyChild}</Radio>
                            <Radio value={3}>{AppConstants.noRegisteringSomeoneElse}</Radio>
                        </Radio.Group>
                    </div>
                : null}
            </div>
        )
    }

    addedParticipantView = () => {
        return(
            <div className="registration-form-view">
                <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.participant}</div>
                <div style={{display: "flex",flexWrap: "wrap"}}>
                    <div className="form-heading" style={{textAlign: "start"}}>{AppConstants.addNewParticipant}</div>
                    <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "5px"}}
                    onClick={() => this.selectAnotherParticipant()}>{AppConstants.selectAnother}</div>
                </div>
                <div style={{fontWeight: "600",marginTop: "-5px"}}>{this.getParticipantType()}</div>
            </div>
        )
    }

    participantAddressView = (getFieldDecorator) => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        let userInfo = userRegistrationstate.userInfo;
        const { stateList,countryList } = this.props.commonReducerState;
        let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
        return(
            <div>
                {registrationObj.selectAddressFlag && (
                    <div>
                        <div className="form-heading" 
                        style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.address}</div>
                        <InputWithHead heading={AppConstants.selectAddress} required={"required-field"}/>
                        <Form.Item >
                            {getFieldDecorator(`participantSelectAddress`, {
                                rules: [{ required: true, message: ValidationConstants.selectAddressRequired}],
                            })(
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.select}
                                onChange={(e) => this.onChangeSetParticipantValue(e, "addOrRemoveAddressBySelect")}
                                setFieldsValue={registrationObj.stateRefId}>
                                {userInfo.length > 0 && userInfo.map((item) => (
                                    <Option key={item.id} value={item.id}> {this.getAddress(item)}</Option>
                                ))}
                            </Select>
                            )}
                        </Form.Item> 
                        <div className="orange-action-txt" style={{marginTop: "10px"}}
                        onClick={() => {
                            this.onChangeSetParticipantValue(true,"addNewAddressFlag")
                            this.onChangeSetParticipantValue(false,"selectAddressFlag");
                            this.onChangeSetParticipantValue(null,"addOrRemoveAddressBySelect");
                        }}
                        >+ {AppConstants.addNewAddress}</div>	
                    </div>
                )} 
                    
                {registrationObj.addNewAddressFlag && (
                    <div>
                        {!newUser && (
                            <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                            onClick={() => {
                                this.onChangeSetParticipantValue(true,"selectAddressFlag");
                                this.onChangeSetParticipantValue(false,"addNewAddressFlag");
                            }}
                            >{AppConstants.returnToSelectAddress}</div>
                        )}
                        <div className="form-heading" 
                        style={newUser ? {marginTop: "20px",marginBottom: "-20px"} : {paddingBottom: "0px",marginBottom: "-20px"}}>{AppConstants.findAddress}</div>
                        <div>
                            <Form.Item name="addressSearch">
                                {getFieldDecorator(`participantAddressSearch`, {
                                    rules: [{ required: true, message: ValidationConstants.addressField}],
                                })(
                                    <PlacesAutocomplete
                                        setFieldsValue={"participantAddressSearch"}
                                        heading={AppConstants.addressSearch}
                                        error={this.state.searchAddressError}
                                        onBlur={() => { this.setState({searchAddressError: ''})}}
                                        onSetData={(e)=>this.handlePlacesAutocomplete(e,"participant")}
                                    />
                                )}
                            </Form.Item>
                            <div className="orange-action-txt" style={{marginTop: "10px"}}
                            onClick={() => {
                                this.onChangeSetParticipantValue(true,"manualEnterAddressFlag");
                                this.onChangeSetParticipantValue(false,"addNewAddressFlag");
                                setTimeout(() => {
                                    this.setParticipantDetailStepAddressFormFields("manualEnterAddressFlag");
                                },300);
                            }}
                            >{AppConstants.enterAddressManually}</div>	 
                        </div> 
                    </div>
                )}

                {registrationObj.manualEnterAddressFlag && (
                    <div>
                        <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                        onClick={() => {
                            this.onChangeSetParticipantValue(false,"manualEnterAddressFlag");
                            this.onChangeSetParticipantValue(true,"addNewAddressFlag");
                            setTimeout(() => {
                                this.setParticipantDetailStepAddressFormFields("addNewAddressFlag");
                            },300);
                        }}
                        >{AppConstants.returnToAddressSearch}</div>
                        <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.enterAddress}</div>
                        <Form.Item >
                            {getFieldDecorator(`participantStreet1`, {
                                rules: [{ required: true, message: ValidationConstants.addressField}],
                            })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street1")} 
                                setFieldsValue={registrationObj.street1}
                            />
                            )}
                        </Form.Item>
                        <InputWithHead
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street2")} 
                            value={registrationObj.street2}
                        />
                        <Form.Item >
                            {getFieldDecorator(`participantSuburb`, {
                                rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                            })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.suburb}
                                placeholder={AppConstants.suburb}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "suburb")} 
                                setFieldsValue={registrationObj.suburb}
                            />
                            )}
                        </Form.Item>
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
                                <Form.Item >
                                    {getFieldDecorator(`participantStateRefId`, {
                                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                    })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.state}
                                        onChange={(e) => this.onChangeSetParticipantValue(e, "stateRefId")}
                                        setFieldsValue={registrationObj.stateRefId}>
                                        {stateList.length > 0 && stateList.map((item) => (
                                            < Option key={item.id} value={item.id}> {item.name}</Option>
                                        ))}
                                    </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.postCode}   required={"required-field"}/>
                                <Form.Item >
                                    {getFieldDecorator(`participantPostalCode`, {
                                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                    })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        placeholder={AppConstants.postcode}
                                        maxLength={4}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "postalCode")} 
                                        setFieldsValue={registrationObj.postalCode}
                                    />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.country}   required={"required-field"}/>
                        <Form.Item >
                            {getFieldDecorator(`participantCountryRefId`, {
                                rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                            })(
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.country}
                                onChange={(e) => this.onChangeSetParticipantValue(e, "countryRefId")}
                                setFieldsValue={registrationObj.countryRefId}>
                                {countryList.length > 0 && countryList.map((item) => (
                                    < Option key={item.id} value={item.id}> {item.description}</Option>
                                ))}
                            </Select>
                            )}
                        </Form.Item>
                    </div>
                )} 
            </div>
        )
    }

    participantDetailView = (getFieldDecorator) => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        const { genderList,stateList,countryList } = this.props.commonReducerState;
        return(
            <div className="registration-form-view">
                <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.participantDetails}</div>
                <InputWithHead heading={AppConstants.gender} required={"required-field"}></InputWithHead>
                <Form.Item >
                    {getFieldDecorator(`genderRefId`, {
                        rules: [{ required: true, message: ValidationConstants.genderField }],
                    })(
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "genderRefId")}
                            setFieldsValue={registrationObj.genderRefId}
                            >
                            {(genderList || []).map((gender, genderIndex) => (
                                <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Form.Item>
            
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.participant_firstName} required={"required-field"}/>
                        <Form.Item >
                            {getFieldDecorator(`participantFirstName`, {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    placeholder={AppConstants.participant_firstName}
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "firstName")} 
                                    setFieldsValue={registrationObj.firstName}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.participant_middleName}/>
                        <Form.Item >
                            {getFieldDecorator(`participantMiddleName`, {
                                rules: [{ required: false }],
                            })(
                            <InputWithHead
                                placeholder={AppConstants.participant_middleName}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "middleName")} 
                                setFieldsValue={registrationObj.middleName}
                            />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.participant_lastName} required={"required-field"}/>
                        <Form.Item >
                            {getFieldDecorator(`participantLastName`, {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                            <InputWithHead
                                placeholder={AppConstants.participant_lastName}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastName")} 
                                setFieldsValue={registrationObj.lastName}
                            />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.dob}   required={"required-field"}/>
                        <Form.Item >
                            {getFieldDecorator(`dateOfBirth`, {
                                rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
                            })(
                                <DatePicker
                                    size="large"
                                    placeholder={"dd-mm-yyyy"}
                                    style={{ width: "100%" }}
                                    onChange={e => this.onChangeSetParticipantValue(e, "dateOfBirth") }
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'dateOfBirth'}
                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.contactMobile} required={"required-field"}/>
                        <Form.Item >
                            {getFieldDecorator(`participantMobileNumber`, {
                                rules: [{ required: true, message: ValidationConstants.contactField }],
                            })(
                            <InputWithHead
                                placeholder={AppConstants.contactMobile}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "mobileNumber")} 
                                setFieldsValue={registrationObj.mobileNumber}
                            />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6"
                    style={registrationObj.referParentEmail ? {alignSelf: "center",marginTop: "25px"} : {}}>
                        {!registrationObj.referParentEmail ? 
                            <div>
                                <InputWithHead heading={AppConstants.contactEmail} required={"required-field"}/>
                                <Form.Item >
                                    {getFieldDecorator(`participantEmail`, {
                                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                                    })(
                                        <InputWithHead
                                            disabled={registrationObj.userId == getUserId()}
                                            placeholder={AppConstants.contactEmail}
                                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "email")} 
                                            setFieldsValue={registrationObj.email}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        : 
                            <Checkbox
                                className="single-checkbox"
                                checked={registrationObj.referParentEmail}
                                onChange={e => this.onChangeSetParticipantValue(e.target.checked, "referParentEmail")} >
                                {AppConstants.useParentsEmailAddress}
                            </Checkbox> 
                        }
                    </div>
                </div>

                <InputWithHead heading={AppConstants.photo}/>
                {registrationObj.photoUrl ? 
                    <img
                        src={registrationObj.photoUrl}
                        alt=""
                        height="80"
                        width="80"
                        style={{ borderRadius: "50%" }}
                        name={'image'}
                        onError={ev => {
                            ev.target.src = AppImages.circleImage;
                        }}
                        onClick={ () => this.selectImage()}
                    />
                : 
                    <div className="orange-action-txt" onClick={ () => this.selectImage()}>+ {AppConstants.upload}</div>
                }
                <input
                    type="file"
                    id= {"user-pic"} 
                    style={{ display: 'none' }}
                    onChange={(evt) => this.setImage(evt.target,"participantPhoto")} 
                />
                <div>{this.participantAddressView(getFieldDecorator)}</div>	
            </div>
        )
    } 

    parentOrGuardianAddressView = (parent, parentIndex,getFieldDecorator) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            const { stateList,countryList } = this.props.commonReducerState;
            const { userInfo } = this.props.userRegistrationState;
            let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
            return(
                <div>
                    {parent.selectAddressFlag && (
                        <div>
                            <div className="form-heading" 
                            style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.address}</div>
                            <InputWithHead heading={AppConstants.selectAddress} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`parentSelectAddress`, {
                                    rules: [{ required: true, message: ValidationConstants.selectAddressRequired}],
                                })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.select}
                                    onChange={(e) => this.onChangeSetParentValue(e, "addOrRemoveAddressBySelect",parentIndex)}
                                    setFieldsValue={registrationObj.stateRefId}>
                                    {userInfo.parentOrGuardian && userInfo.parentOrGuardian.length > 0 && userInfo.parentOrGuardian.map((item) => (
                                        <Option key={item.userId} value={item.userId}> {this.getAddress(item)}</Option>
                                    ))}
                                </Select>
                                )}
                            </Form.Item> 
                            <div className="orange-action-txt" style={{marginTop: "10px"}}
                            onClick={() => {
                                this.onChangeSetParentValue(true,"addNewAddressFlag",parentIndex)
                                this.onChangeSetParentValue(false,"selectAddressFlag",parentIndex);
                                this.onChangeSetParentValue(null, "addOrRemoveAddressBySelect",parentIndex)
                            }}
                            >+ {AppConstants.addNewAddress}</div>	
                        </div>
                    )} 
                    {parent.addNewAddressFlag && (
                        <div>
                            {!newUser && (
                                <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                                onClick={() => {
                                    this.onChangeSetParentValue(true,"selectAddressFlag",parentIndex);
                                    this.onChangeSetParentValue(false,"addNewAddressFlag",parentIndex);
                                }}
                                >{AppConstants.returnToSelectAddress}</div>
                            )}
                            <div className="form-heading" 
                            style={newUser ? {marginTop: "20px",marginBottom: "-20px"} : {paddingBottom: "0px",marginBottom: "-20px"}}>{AppConstants.findAddress}</div>
                            <Form.Item name="addressSearch">
                                {getFieldDecorator(`parentAddressSearch${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                                    })(
                                    <PlacesAutocomplete
                                        setFieldsValue={"defaultAddress"}
                                        heading={AppConstants.addressSearch}
                                        required
                                        error={this.state.searchAddressError}
                                        onBlur={() => {
                                            this.setState({
                                                searchAddressError: ''
                                            })
                                        }}
                                        onSetData={(e)=>this.handlePlacesAutocomplete(e,parentIndex,"parent")}
                                    />
                                )}
                            </Form.Item>
                            <div className="orange-action-txt" style={{marginTop: "10px"}}
                            onClick={() => {
                                this.onChangeSetParentValue(true,"manualEnterAddressFlag",parentIndex);
                                this.onChangeSetParentValue(false,"addNewAddressFlag",parentIndex);
                                setTimeout(() => {
                                    this.setParticipantDetailStepParentAddressFormFields("manualEnterAddressFlag",parent,parentIndex)
                                },300);
                            }}
                            >{AppConstants.enterAddressManually}</div>
                        </div>
                    )}
                    {parent.manualEnterAddressFlag && (
                        <div>
                            <div className="orange-action-txt" 
                            style={{marginTop: "20px",marginBottom: "10px"}}
                            onClick={() => {
                                this.onChangeSetParentValue(false,"manualEnterAddressFlag",parentIndex);
                                this.onChangeSetParentValue(true,"addNewAddressFlag",parentIndex);
                                setTimeout(() => {
                                    this.setParticipantDetailStepParentAddressFormFields("addNewAddressFlag",parent,parentIndex)
                                },300);
                            }}
                            >{AppConstants.returnToAddressSearch}</div>
                            <div className="form-heading" 
                            style={{paddingBottom: "0px"}}>{AppConstants.enterAddress}</div>
                            <Form.Item>
                                {getFieldDecorator(`parentStreet1${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                                })(
                                <InputWithHead
                                    required={"required-field pt-0 pb-0"}
                                    heading={AppConstants.addressOne}
                                    placeholder={AppConstants.addressOne}
                                    onChange={(e) => this.onChangeSetParentValue(e.target.value, "street1", parentIndex  )} 
                                    setFieldsValue={parent.street1}
                                />
                                )}
                            </Form.Item>
                            <InputWithHead
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "street2", parentIndex  )} 
                                value={parent.street2}
                            />
                            <Form.Item>
                                {getFieldDecorator(`parentSuburb${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                <InputWithHead
                                    required={"required-field pt-0 pb-0"}
                                    heading={AppConstants.suburb}
                                    placeholder={AppConstants.suburb}
                                    onChange={(e) => this.onChangeSetParentValue(e.target.value, "suburb", parentIndex  )} 
                                    setFieldsValue={parent.suburb}
                                />
                                )}
                            </Form.Item> 
                            <div className="row">
                                <div className="col-sm-12 col-lg-6">
                                    <InputWithHead heading={AppConstants.state}  required={"required-field"}/>
                                    <Form.Item>
                                        {getFieldDecorator(`parentStateRefId${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                        })(
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder={AppConstants.state}
                                            onChange={(e) => this.onChangeSetParentValue(e, "stateRefId", parentIndex  )}
                                            setFieldsValue={parent.stateRefId}>
                                            {stateList.length > 0 && stateList.map((item) => (
                                                < Option key={item.id} value={item.id}> {item.name}</Option>
                                            ))
                                            }
                                        </Select>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-lg-6">
                                    <InputWithHead heading={AppConstants.postCode}  required={"required-field"}/>
                                    <Form.Item>
                                        {getFieldDecorator(`parentPostalCode${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                        })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            placeholder={AppConstants.postcode}
                                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "postalCode", parentIndex  )} 
                                            setFieldsValue={parent.postalCode}
                                            maxLength={4}
                                        />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <InputWithHead heading={AppConstants.country}   required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`parentCountryRefId${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                                })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.country}
                                    onChange={(e) => this.onChangeSetParentValue(e, "countryRefId", parentIndex)}
                                    setFieldsValue={parent.countryRefId}>
                                    {countryList.length > 0 && countryList.map((item) => (
                                        < Option key={item.id} value={item.id}> {item.description}</Option>
                                    ))}
                                </Select>
                                )}
                            </Form.Item>
                        </div>
                    )}	
                </div>
            )

        }catch(ex){
            console.log("Error in parentOrGuardianAddressView"+ex);
        }
    }

    parentOrGuardianView = (getFieldDecorator) => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        const { stateList,countryList } = this.props.commonReducerState;
        return(
            <div className="registration-form-view">
                <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.parentOrGuardianDetail}</div>
                {/* <Select
                    mode="multiple"
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    //onChange={(e) => this.onChangeTempParent(index, e)}
                    // value={item.tempParents}
                    >
                    {(filteredRegistrations).map((reg, regIndex) => (
                        (reg.parentOrGuardian).map((tParent, tpIndex) => (
                            <Option key={tParent.tempParentId + tpIndex} 
                                value={tParent.tempParentId}>
                                {tParent.firstName + " " + tParent.lastName} 
                            </Option>
                        ))
                    ))}  
                </Select> */}

                {(registrationObj.parentOrGuardian || []).map((parent, parentIndex) => {
                    return(
                        <div key={"parent"+parentIndex} className="light-grey-border-box">
                            <div className="orange-action-txt" style={{marginTop: "30px"}}
                                onClick={() => {this.addParent("remove",parentIndex)}}
                                >{AppConstants.cancel}
                            </div>
                            <div className="form-heading" 
                            style={{
                                paddingBottom: "0px",
                                marginTop: "10px"}}>{AppConstants.newParentOrGuardian}
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentFirstName${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                        })(
                                            <InputWithHead 
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.firstName} 
                                            placeholder={AppConstants.firstName} 
                                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "firstName", parentIndex )} 
                                            setFieldsValue={parent.firstName}/>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentMiddleName${parentIndex}`, {
                                            rules: [{ required: false }],
                                        })(
                                        <InputWithHead 
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.middleName} 
                                            placeholder={AppConstants.middleName} 
                                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "middleName", parentIndex )} 
                                            setFieldsValue={parent.middleName}/>
                                            )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-md-12">
                                    <Form.Item>
                                        {getFieldDecorator(`parentLastName${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                        })(
                                        <InputWithHead 
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.lastName} 
                                            placeholder={AppConstants.lastName} 
                                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "lastName", parentIndex )} 
                                            setFieldsValue={parent.lastName}/>
                                            )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentMobileNumber${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.contactField }],
                                        })(
                                        <InputWithHead 
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.mobile} 
                                            placeholder={AppConstants.mobile} 
                                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "mobileNumber", parentIndex  )} 
                                            setFieldsValue={parent.mobileNumber}
                                        />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentEmail${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                                        })(
                                        <InputWithHead 
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.email} 
                                            placeholder={AppConstants.email} 
                                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "email", parentIndex  )} 
                                            setFieldsValue={parent.email}
                                        />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <Checkbox
                                className="single-checkbox"
                                checked={parent.isSameAddress}
                                onChange={e => this.onChangeSetParentValue(e.target.checked, "isSameAddress", parentIndex  )} >
                                {AppConstants.sameAddress}
                            </Checkbox>
                            {!parent.isSameAddress && (
                                <div>{this.parentOrGuardianAddressView(parent,parentIndex,getFieldDecorator)}</div>
                            )}
                        </div>
                    );
                })}
                <div className="orange-action-txt" style={{marginTop: "10px"}}
                onClick={() => {this.addParent("add")}}
                >+ {AppConstants.addNewParentGaurdian}</div>	
            </div>
        )
    }

    selectCompetitionStepView = (getFieldDecorator) => {
        const { registrationObj } = this.props.userRegistrationState;
        return(
            <div>
                <div>{this.addedParticipantWithProfileView()}</div> 
                {!this.state.showAddAnotherCompetitionView && (
                    <div>
                        {(registrationObj.competitions || []).map((competition, competitionIndex) => (
                            <div>{this.competitionDetailView(competition,competitionIndex,getFieldDecorator)}</div>
                        ))}
                    </div>
                )}
                {this.state.showAddAnotherCompetitionView ? 
                    <div>{this.findAnotherCompetitionView()}</div>
                    : 
                    <div className="orange-action-txt"
                    style={{marginTop: "20px"}}
                    onClick={() => this.setState({showAddAnotherCompetitionView: true})}>+ {AppConstants.addAnotherCompetition}</div>
                }
            </div>
        )
    }

    addedParticipantWithProfileView = () => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        return(
            <div className="registration-form-view">
                <div className="row">
                    <div className="col-sm-1.5">
                        <img 
                        height="80px"
                        width="80px"
                        style={{borderRadius: "50%"}} 
                        src={registrationObj.photoUrl != null && registrationObj.photoUrl}/> 
                    </div>
                    <div className="col">
                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.participant}</div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            <div className="form-heading" style={{textAlign: "start"}}>{registrationObj.firstName} {registrationObj.lastName}</div>
                            <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "5px"}}
                            onClick={() => this.selectAnotherParticipant()}>{AppConstants.selectAnother}</div>
                        </div>
                        <div style={{fontWeight: "600",marginTop: "-5px"}}>{registrationObj.genderRefId == 2 ? 'Male' : 'Female'}, {moment(registrationObj.dateOfBirth).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
            </div>
        )
    }

    findAnotherCompetitionView = () => {
        let { membershipProductInfo } = this.props.userRegistrationState;
        let organisation = membershipProductInfo.find(x => x.organisationUniqueKey == this.state.organisationId);
        let competitions = [];
        let organisationCoverImage;
        if(organisation){
            competitions = organisation.competitions;
            organisationCoverImage = organisation.organisationLogoUrl;
        }
        return(
            <div className="registration-form-view">
                <div style={{display: "flex",alignItems: "center" }}>
                    <div className="form-heading">{AppConstants.findACompetition}</div>
                    <div className="orange-action-txt" 
                    style={{marginLeft: "auto",paddingBottom: "7.5px"}}
                    onClick={() => this.setState({showAddAnotherCompetitionView: false,organisationId: null})}>{AppConstants.cancel}</div>
                </div>

                <div className="light-grey-border-box">
                    <InputWithHead heading={AppConstants.organisationName}/>
                    <Select
                        onChange={(e) => this.setState({organisationId : e})}
                        style={{ width: "100%", paddingRight: 1 }}>
                        {membershipProductInfo.length > 0 && membershipProductInfo.map((item) => (
                            < Option key={item.organisationUniqueKey} value={item.organisationUniqueKey}> {item.organisationName}</Option>
                        ))}
                    </Select>
                </div>
                <div className="row" style={{marginTop: "30px"}}>
                    {(competitions || []).map((competition,competitionIndex) => (
                        <div className="col-md-6 col-sm-12 pointer"
                        onClick={() => this.addAnotherCompetition(competition)}
                        key={competition.competitionUniqueKey} 
                        style={{marginBottom: "20px"}}>
                            <div style={{border:"1px solid var(--app-f0f0f2)",borderRadius: "10px",padding: "20px"}}>
                                <div style={{height: "150px",
                                display: "flex",
                                justifyContent: "center",
                                borderRadius: "10px 10px 0px 0px",
                                margin: "-20px -20px -0px -20px",
                                borderBottom: "1px solid var(--app-f0f0f2)"}}>
                                    <img style={{height: "149px",borderRadius: "10px 10px 0px 0px"}} src={competition.compLogoUrl}/>
                                </div>
                                <div className="form-heading" style={{marginTop: "20px",textAlign: "start"}}>{competition.competitionName}</div>
                                <div style={{fontWeight: "600"}}>&#128198; {competition.registrationOpenDate} - {competition.registrationCloseDate}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    competitionDetailView = (competition,competitionIndex,getFieldDecorator) => {
        console.log("competition",competition);
        const {playerPositionList} = this.props.commonReducerState;
        let competitionInfo = competition.competitionInfo;
        let contactDetails = competitionInfo.replyName || competitionInfo.replyPhone || competitionInfo.replyEmail ?
                            competitionInfo.replyName + ' ' + competitionInfo.replyPhone + ' ' + competitionInfo.replyEmail : ''; 
        return(
            <div className="registration-form-view"  key={competitionIndex}>
                <div className="map-style">
                    <img style={{height: "249px",borderRadius: "10px 10px 0px 0px"}} src={competitionInfo.compLogoUrl}/>
                </div>
                <div>
                    <div className="row" style={{marginTop: "30px",marginLeft: "0px",marginRight: "0px"}}>
                        <div className="col-sm-1.5">
                            <img style={{height: "60px",borderRadius: "50%"}} src={competitionInfo.compLogoUrl}/> 
                        </div>
                        <div className="col">
                            <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.competition}</div>
                            <div style={{display: "flex",flexWrap: "wrap"}}>
                                <div className="form-heading" style={{textAlign: "start"}}>{competition.competitionInfo.competitionName}</div>
                                <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "8px"}}
                                onClick={() => this.findAnotherCompetition(competitionIndex)}>{competitionIndex == 0 ? AppConstants.findAnotherCompetition : AppConstants.cancel}</div>
                            </div>
                            <div style={{fontWeight: "600",marginTop: "-5px"}}>&#128198; {competition.competitionInfo.registrationOpenDate} - {competition.competitionInfo.registrationCloseDate}</div>
                        </div>
                    </div>
                    <div className="light-grey-border-box">
                        <InputWithHead heading={AppConstants.chooseMembershipProducts}/>
                        {(competition.competitionInfo.membershipProducts || []).map((membershipProduct, membershipProductIndex) => (
                            <Checkbox 
                            checked={membershipProduct.isChecked}
                            key={membershipProduct.competitionMembershipProductId + membershipProductIndex}
                            onChange={(e) => this.onChangeSetCompetitionValue(e.target.checked,"products",competitionIndex,membershipProductIndex)}>
                                {membershipProduct.shortName}</Checkbox>
                        ))}
                        <InputWithHead heading={AppConstants.registrationDivisions}/>
                        <div
                        style={{marginBottom: "10px"}}>
                            {(competition.divisions || []).map((division,divisionIndex) => (
                                <Tag 
                                key={division.competitionMembershipProductDivisionId + divisionIndex} 
                                style={{marginBottom: "10px"}}
                                closable 
                                color="volcano"
                                onClose={(e) => this.onChangeSetCompetitionValue(e,"divisions",competitionIndex,divisionIndex)}>{division.divisionName}</Tag>
                            ))}
                        </div>
                        {/* <Form.Item>
                            {getFieldDecorator(`competitionMembershipProductDivisionId${competitionIndex}`, {
                                rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired }],
                            })( */}
                                <Select
                                    style={{ width: "100%", paddingRight: 1 }}
                                    onChange={(e) => this.onChangeSetCompetitionValue(e, "divisionInfo", competitionIndex )}
                                    >
                                    {(competition.divisionInfo || []).map((divisionInfo, divisionInfoIndex) => (
                                        <Option key={divisionInfo.competitionMembershipProductDivisionId + divisionInfoIndex} 
                                        value={divisionInfo.competitionMembershipProductDivisionId}>{divisionInfo.divisionName}</Option>
                                    ))}
                                </Select>
                            {/* )}
                        </Form.Item> */}
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.totalCasualFees}/>
                                <div className="form-heading">$60.00<span style={{fontSize: "12px",alignSelf: "flex-end",marginBottom: "5px"}}>&#8199;incl.GST</span></div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <InputWithHead heading={AppConstants.totalSeasonalFees}/>
                                <div className="form-heading">$120.00<span style={{fontSize: "12px",alignSelf: "flex-end",marginBottom: "5px"}}>&#8199;incl.GST</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{marginTop: "30px"}}>
                        <div className="col-xl-6 col-sm-12 col-md-6 col-lg-6">
                            <InputWithHead heading={AppConstants.training}/>
                            <div 
                            className="inter-medium-font" 
                            style={{fontSize: "13px"}}>{competition.competitionInfo.training ? 
                                competition.competitionInfo.training : 
                                AppConstants.noInformationProvided}
                            </div>
                            <InputWithHead heading={AppConstants.specialNotes}/>
                            <div 
                            className="inter-medium-font" 
                            style={{fontSize: "13px"}}>{competition.competitionInfo.specialNote ? 
                                competition.competitionInfo.specialNote : 
                                AppConstants.noInformationProvided}
                            </div>                                    
                            <InputWithHead heading={AppConstants.venue}/>
                            <div 
                            className="inter-medium-font" 
                            style={{fontSize: "13px"}}>
                                {competitionInfo.venues == null || competitionInfo.venues.length == 0 ? AppConstants.noInformationProvided :
                                    <span>
                                        {(competitionInfo.venues || []).map((v, vIndex) =>(
                                            <span>
                                                <span>{v.venueName}</span>
                                                <span>{competitionInfo.venues.length != (vIndex + 1) ? ', ': ''}</span>
                                            </span>
                                        ))}
                                    </span>
                                }
                            </div> 
                            <InputWithHead heading={AppConstants.contactDetails}/>
                            <div  className="inter-medium-font" style={{fontSize: "13px"}}>{contactDetails ? contactDetails : 
                                AppConstants.noInformationProvided}
                            </div> 
                        </div>
                        <div className="col-xl-3 col-sm-12 col-md-6 col-lg-6">
                            <InputWithHead heading={AppConstants.venue}/>
                            <img style={{height: "65%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/>
                        </div>
                        <div className="col-xl-3 col-sm-12 col-md-6 col-lg-6">
                            <InputWithHead heading={AppConstants.uniform}/>
                            <img style={{height: "65%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/>
                        </div>
                    </div>
                    
                    {competition.regSetting.nominate_positions == 1 && (
                        <div>
                            <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.indicatePreferredPlayerPosition}</div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead heading={AppConstants.position1} />
                                    <Select
                                        style={{ width: "100%", paddingRight: 1 }}
                                        onChange={(e) => this.onChangeSetCompetitionValue(e,"positionId1", competitionIndex)}
                                        value={competition.positionId1}
                                        >
                                        {(playerPositionList || []).map((play1, index) => (
                                            <Option key={play1.id} value={play1.id}>{play1.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead heading={AppConstants.position2} />
                                    <Select
                                        style={{ width: "100%", paddingRight: 1 }}
                                        onChange={(e) => this.onChangeSetCompetitionValue(e,"positionId2", competitionIndex)}
                                        value={competition.positionId2}
                                        >
                                        {(playerPositionList || []).map((play2, index) => (
                                            <Option key={play2.id} value={play2.id}>{play2.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {competition.regSetting.play_friend == 1 && (
                        <div>
                            <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.playWithFriend}</div>
                            <div className="inter-medium-font">{AppConstants.playWithFriendSubtitle}</div>
                                {(competition.friends || []).map((friend,friendIndex) => (
                                    <div className="light-grey-border-box">
                                        <div 
                                        className="orange-action-txt" 
                                        style={{marginTop: "20px"}}
                                        onClick={e => this.addFriend("remove",competitionIndex,friendIndex)}>{AppConstants.cancel}</div>
                                        <div className="form-heading" style={{marginTop: "10px"}}>{AppConstants.friend} {friendIndex + 1}</div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead 
                                                    heading={AppConstants.firstName} 
                                                    placeholder={AppConstants.firstName} 
                                                    onChange={(e) => this.onChangeSetCompetitionValue(e.target.value,"firstName",competitionIndex,friendIndex,"friends")} 
                                                    value={friend.firstName}
                                                    />
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead 
                                                    heading={AppConstants.lastName} 
                                                    placeholder={AppConstants.lastName} 
                                                    onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "lastName",competitionIndex, friendIndex, "friends")} 
                                                    value={friend.lastName}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email} 
                                                    onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "email",competitionIndex, friendIndex, "friends")}  
                                                    value={friend.email}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead heading={AppConstants.mobile} placeholder={AppConstants.mobile} 
                                                    onChange={(e) => this.onChangeSetCompetitionValue(e.target.value, "mobileNumber",competitionIndex, friendIndex, "friends")} 
                                                    value={friend.mobileNumber}
                                                />
                                            </div>
                                        </div> 
                                    </div>
                                ))}
                            <div 
                                className="orange-action-txt" 
                                style={{marginTop: "15px"}}
                                onClick={e => this.addFriend("add",competitionIndex)}>+ {AppConstants.addfriend}
                            </div>
                        </div>
                    )}

                    {competition.regSetting.refer_friend == 1 && (
                        <div>
                            <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.referfriend}</div>
                            <div className="inter-medium-font">{AppConstants.referFriendSubTitle}</div>
                                {(competition.referFriends || []).map((referFriend,referFriendIndex) => (
                                    <div className="light-grey-border-box">
                                        <div 
                                        className="orange-action-txt" 
                                        style={{marginTop: "20px"}}
                                        onClick={e => this.addReferFriend("remove",competitionIndex,referFriendIndex)}>{AppConstants.cancel}</div>
                                        <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.friend} {referFriendIndex + 1}</div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead heading={AppConstants.firstName} placeholder={AppConstants.firstName} 
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value,"firstName",competitionIndex,referFriendIndex,"referFriends")} 
                                                value={referFriend.firstName}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead heading={AppConstants.lastName} placeholder={AppConstants.lastName} 
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value,"lastName",competitionIndex,referFriendIndex,"referFriends")} 
                                                value={referFriend.lastName}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email} 
                                                onChange={(e) => this.onChangeSetCompetitionValue(e.target.value,"email",competitionIndex,referFriendIndex,"referFriends")} 
                                                value={referFriend.email}
                                                />
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <InputWithHead heading={AppConstants.mobile} placeholder={AppConstants.mobile} 
                                                    onChange={(e) => this.onChangeSetCompetitionValue(e.target.value,"mobileNumber",competitionIndex,referFriendIndex,"referFriends")} 
                                                    value={referFriend.mobileNumber}
                                                />
                                            </div>
                                        </div> 
                                    </div>
                                ))}
                            <div 
                            className="orange-action-txt" 
                            style={{marginTop: "15px"}}
                            onClick={e => this.addReferFriend("add",competitionIndex)}>+ {AppConstants.addfriend}</div>
                        </div>
                    )}	 
                </div>
            </div>
        )
    }

    additionalInfoStepView = (getFieldDecorator) => {
        const { registrationObj } = this.props.userRegistrationState;
        return(
            <div>
                {registrationObj != null && (<div>{this.addedParticipantWithProfileView()}</div> )}
                
                {(registrationObj != null && registrationObj.competitions || []).map((competition,competitionIndex) => (
                    <div>{this.additionalInfoAddCompetitionView(competition,competitionIndex)}</div>
                ))}
                <div>{this.additionalPersonalInfoView(getFieldDecorator)}</div>
            </div>
        )
    }

    additionalInfoAddCompetitionView = (competition,competitionIndex) => {
        return(
            <div className="registration-form-view">
                <div className="row" style={{marginLeft: "0px",marginRight: "0px"}}>
                    <div className="col-sm-1.5">
                        <img style={{height: "60px",borderRadius: "50%"}} src={competition.competitionInfo.compLogoUrl}/> 
                    </div>
                    <div className="col">
                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.competition}</div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            <div className="form-heading" style={{textAlign: "start"}}>{competition.competitionInfo.competitionName}</div>
                            <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "8px"}}>{AppConstants.edit}</div>
                        </div>
                        <div style={{fontWeight: "600",marginTop: "-5px"}}>
                            {(competition.products || []).map((product,productIndex) => (
                                <span>
                                    <span>{product.membershipTypeName}</span>
                                    <span>{competition.products.length != productIndex + 1 ? ',' : ''}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    additionalPersonalInfoView = (getFieldDecorator) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            const { countryList, identifyAsList,disabilityList,favouriteTeamsList,
                firebirdPlayerList,otherSportsList,heardByList,accreditationUmpireList,accreditationCoachList,walkingNetballQuesList } = this.props.commonReducerState;
            let yearsOfPlayingList = ['1','2','3','4','5','6','7','8','9','10+'];
            return(
                <div className="registration-form-view">
                    <div className="form-heading">{AppConstants.additionalPersonalInformation}</div>
                    <InputWithHead heading={AppConstants.whichCountryWereBorn}/>
                    {/* <Form.Item >
                        {getFieldDecorator(`additionalInfoCountryRefId`, {
                            rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                        })( */}
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(e) => this.onChangeSetAdditionalInfo(e,"countryRefId")}
                            value={registrationObj.additionalInfo.countryRefId}>
                            {countryList.length > 0 && countryList.map((item) => (
                                < Option key={item.id} value={item.id}> {item.description}</Option>
                            ))}
                        </Select>
                        {/* )}
                    </Form.Item> */}
                    <InputWithHead heading={AppConstants.doYouIdentifyAs}/>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"identifyRefId")}
                        value={registrationObj.additionalInfo.identifyRefId}
                        >
                        {(identifyAsList || []).map((identification, identificationIndex) => (
                            <Radio key={identification.id} value={identification.id}>{identification.description}</Radio>
                        ))}
                    </Radio.Group>
                    <InputWithHead heading={AppConstants.injury}/>
                    <TextArea
                        placeholder={AppConstants.anyInjury}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "injuryInfo")} 
                        value={registrationObj.additionalInfo.injuryInfo}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.alergy}/>
                    <TextArea
                        placeholder={AppConstants.anyAlergies}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "allergyInfo")} 
                        value={registrationObj.additionalInfo.allergyInfo}
                        allowClear
                    />

                    {registrationObj.registeringYourself == 2 && (
                        <InputWithHead heading={AppConstants.childPlayingOtherParticipantSports} />
                    )}
                    {registrationObj.registeringYourself == 1 && (
                        <InputWithHead heading={AppConstants.playingOtherParticipantSports} />
                    )}
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e,"otherSportsInfo")}
                        value={registrationObj.additionalInfo.otherSportsInfo}>
                        {otherSportsList.length > 0 && otherSportsList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))}
                    </Select>

                    {/* <InputWithHead heading={AppConstants.haveYouEverPlayed}/>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "playedBefore")}
                        value={registrationObj.additionalInfo.playedBefore}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    {registrationObj.additionalInfo.playedBefore == true && (
                        <div>
                            <InputWithHead 
                            heading={AppConstants.year} 
                            placeholder={AppConstants.year}
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "playedYear")} 
                            value={registrationObj.additionalInfo.playedYear!= null ? parseInt(registrationObj.additionalInfo.playedYear) : registrationObj.additionalInfo.playedYear} 
                            maxLength={4}/>

                            <InputWithHead 
                            heading={AppConstants.clubOther} 
                            placeholder={AppConstants.clubOther} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "playedClub")} 
                            value={registrationObj.additionalInfo.playedClub}/>

                            <InputWithHead 
                            heading={AppConstants.grade} 
                            placeholder={AppConstants.grade} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "playedGrade")} 
                            value={registrationObj.additionalInfo.playedGrade}/>
                            {registrationObj.regSetting.last_captain === 1 && (
                                <div>
                                    <span className="applicable-to-heading">
                                        {AppConstants.lastCaptainName}
                                    </span>
                                    <InputWithHead 
                                    heading={AppConstants.fullName} 
                                    placeholder={AppConstants.lastCaptainName}
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "lastCaptainName")} 
                                    value={registrationObj.additionalInfo.lastCaptainName}/>
                                </div>
                            )}
                        </div>
                    )} */}

                    <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.additionalInformation}</div>
                    <InputWithHead heading={AppConstants.emergencyContact}/>
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        >  
                    </Select>
                    <InputWithHead heading={AppConstants.existingMedConditions}/>
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "existingMedicalCondition")} 
                        value={registrationObj.additionalInfo.existingMedicalCondition}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.redularMedicalConditions}  />
                    <TextArea
                        placeholder={AppConstants.redularMedicalConditions}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "regularMedication")} 
                        value={registrationObj.additionalInfo.regularMedication}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.hearAbouttheCompition} />
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByRefId")} 
                        value={registrationObj.additionalInfo.heardByRefId}
                        >
                        {(heardByList || []).map((heard, index) => (
                            <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                        ))}
                    </Radio.Group>
                    {registrationObj.additionalInfo.heardByRefId == 6 && (
                        <div style={{marginTop: "10px"}}>
                            <InputWithHead 
                            placeholder={AppConstants.other} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByOther")}
                            value={registrationObj.additionalInfo.heardByOther}/>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <InputWithHead heading={AppConstants.teamYouFollow}/>
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteTeamRefId")}
                                value={registrationObj.additionalInfo.favouriteTeamRefId}
                                >  
                                {(favouriteTeamsList || []).map((fav, index) => (
                                    <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                                ))}
                            </Select>
                        </div>
                        {registrationObj.additionalInfo.favouriteTeamRefId == 6 && (
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.who_fav_bird} />
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteFireBird")}
                                    value={registrationObj.additionalInfo.favouriteFireBird}
                                    >  
                                    {(firebirdPlayerList || []).map((fire, index) => (
                                        <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                    <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.checked, "isConsentPhotosGiven")}
                        checked={registrationObj.additionalInfo.isConsentPhotosGiven}>{AppConstants.consentForPhotos}
                    </Checkbox>

                    <InputWithHead heading={AppConstants.haveDisability} />
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isDisability")} 
                        value={registrationObj.additionalInfo.isDisability}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    {registrationObj.additionalInfo.isDisability == 1 ? 
                        <div>
                            <InputWithHead 
                            heading={AppConstants.disabilityCareNumber} 
                            placeholder={AppConstants.disabilityCareNumber} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityCareNumber")}
                            value={registrationObj.additionalInfo.disabilityCareNumber}/>
                            <InputWithHead heading={AppConstants.typeOfDisability} />
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityTypeRefId")} 
                                value={registrationObj.additionalInfo.disabilityTypeRefId}>
                                    {(disabilityList || []).map((dis, disIndex) => (
                                    <Radio key={dis.id} value={dis.id}>{dis.description}</Radio>
                                ))}
                            </Radio.Group>
                        </div> 
                        : null
                    }

                    {registrationObj.regSetting.netball_experience == 1 && (
                        <div>
                            <InputWithHead heading={AppConstants.firstYearPlayingNetball} />
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "yearsPlayed")} 
                                value={registrationObj.additionalInfo.yearsPlayed}
                                >
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                            {registrationObj.additionalInfo.yearsPlayed == 1 && (
                                <div>
                                <Select
                                        placeholder={AppConstants.yearsOfPlaying}
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182,marginTop: "20px" }}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "yearsPlayed")}
                                        value={registrationObj.additionalInfo.yearsPlayed}
                                        >  
                                        {(yearsOfPlayingList || []).map((years, index) => (
                                            <Option key={years} value={years}>{years}</Option>
                                        ))}
                                    </Select> 
                                </div>
                            )}
                        </div>
                    )}

                    {(getAge(registrationObj.dateOfBirth) < 18) && (
                        <div>
                            {registrationObj.regSetting.school_standard == 1 && (
                                <div>
                                    {registrationObj.registeringYourself == 2 && (
                                        <InputWithHead heading={AppConstants.schoolYourChildAttend} />
                                    )}
                                    {registrationObj.registeringYourself == 1 && (
                                        <InputWithHead heading={AppConstants.schoolYouAttend} />
                                    )}
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182}}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "schoolId")}
                                        value={registrationObj.additionalInfo.schoolId}
                                        >  
                                        {/* {(yearsOfPlayingList || []).map((years, index) => (
                                            <Option key={years} value={years}>{years}</Option>
                                        ))} */}
                                    </Select> 
                                </div>
                            )}
                            {registrationObj.regSetting.school_grade == 1 && (
                                <InputWithHead 
                                heading={(registrationObj.registeringYourself == 2 && AppConstants.yourChildSchoolGrade) 
                                    || (registrationObj.registeringYourself == 1 && AppConstants.yourSchoolGrade)} 
                                placeholder={AppConstants.schoolGrade} 
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"schoolGradeInfo")} 
                                value={registrationObj.additionalInfo.schoolGradeInfo}
                                />
                            )}
                            {registrationObj.regSetting.school_program == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.participatedSchoolProgram}/>
                                    <Radio.Group
                                        className="registration-radio-group"
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isParticipatedInSSP")} 
                                        value={registrationObj.additionalInfo.isParticipatedInSSP}
                                        >
                                        <Radio value={1}>{AppConstants.yes}</Radio>
                                        <Radio value={0}>{AppConstants.no}</Radio>
                                    </Radio.Group>
                                </div>
                            )}
                        </div>
                    )}

                    {/* show below when umpire or coach selected */}
                    <div>
                        {registrationObj.umpireFlag == 1 && (
                            <div>
                                <InputWithHead heading={AppConstants.nationalAccreditationLevelUmpire}/>
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "accreditationLevelUmpireRefId")} 
                                    value={registrationObj.additionalInfo.accreditationLevelUmpireRefId}
                                    >
                                    {(accreditationUmpireList || []).map((accreditaiton,accreditationIndex) => (
                                        <Radio key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                    ))}
                                </Radio.Group>
                                {(registrationObj.additionalInfo.accreditationLevelUmpireRefId != null) && (
                                    <div>
                                        {registrationObj.additionalInfo.accreditationLevelUmpireRefId == 1 ? 
                                            <div>
                                                <InputWithHead heading={AppConstants.newToUmpiring}/>
                                                <Radio.Group
                                                    className="registration-radio-group"
                                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "newToUmpiring")} 
                                                    value={registrationObj.additionalInfo.newToUmpiring}
                                                    >
                                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                                    <Radio value={0}>{AppConstants.no}</Radio>
                                                </Radio.Group>
                                                {(registrationObj.additionalInfo.newToUmpiring == 0) && (
                                                    <div>
                                                        <InputWithHead 
                                                        heading={AppConstants.yourAssociationLevel}
                                                        placeholder={AppConstants.associationLevel} 
                                                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"associationLevelInfo")} 
                                                        value={registrationObj.additionalInfo.associationLevelInfo}
                                                        />
                                                        {/* <Form.Item >
                                                            {getFieldDecorator(`accreditationUmpireExpiryDate`, {
                                                                rules: [{ required: true}],
                                                            })( */}
                                                                <DatePicker
                                                                    size="large"
                                                                    placeholder={AppConstants.checkExpiryDate}
                                                                    style={{ width: "100%",marginTop: "20px" }}
                                                                    onChange={e => this.onChangeSetAdditionalInfo(e, "accreditationUmpireExpiryDate") }
                                                                    format={"DD-MM-YYYY"}
                                                                    showTime={false}
                                                                    value={registrationObj.additionalInfo.accreditationUmpireExpiryDate && moment(registrationObj.additionalInfo.accreditationUmpireExpiryDate,"YYYY-MM-DD")}
                                                                    // name={'accreditationUmpireExpiryDate'}
                                                                />
                                                            {/* )}
                                                        </Form.Item> */}
                                                    </div>
                                                )}
                                            </div>
                                        : 
                                        // <Form.Item >
                                        //     {getFieldDecorator(`accreditationUmpireExpiryDate`, {
                                        //         rules: [{ required: true}],
                                        //     })(
                                                <DatePicker
                                                    size="large"
                                                    placeholder={AppConstants.checkExpiryDate}
                                                    style={{ width: "100%",marginTop: "20px" }}
                                                    onChange={e => this.onChangeSetAdditionalInfo(e, "accreditationUmpireExpiryDate") }
                                                    format={"DD-MM-YYYY"}
                                                    showTime={false}
                                                    value={registrationObj.additionalInfo.accreditationUmpireExpiryDate && moment(registrationObj.additionalInfo.accreditationUmpireExpiryDate,"YYYY-MM-DD")}
                                                    // name={'accreditationUmpireExpiryDate'}
                                                />
                                        //     )}
                                        // </Form.Item>
                                        }
                                    </div> 
                                )}
                                <InputWithHead heading={AppConstants.haveCompletedPrerequisites}/>
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isPrerequestTrainingComplete")} 
                                    value={registrationObj.additionalInfo.isPrerequestTrainingComplete}
                                    >
                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                    <Radio value={0}>{AppConstants.no}</Radio>
                                </Radio.Group>
                            </div>
                        )}

                        {registrationObj.coachFlag == 1 && (
                            <div>
                                <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach}/>
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "accreditationLevelCoachRefId")} 
                                    value={registrationObj.additionalInfo.accreditationLevelCoachRefId}
                                    >
                                    {(accreditationCoachList || []).map((accreditaiton,accreditationIndex) => (
                                    <Radio key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                    ))}
                                </Radio.Group>
                                {(registrationObj.additionalInfo.accreditationLevelCoachRefId != null) && (
                                    // <Form.Item >
                                    //     {getFieldDecorator(`accreditationCoachExpiryDate`, {
                                    //         rules: [{ required: true}],
                                    //     })(
                                            <DatePicker
                                                size="large"
                                                placeholder={AppConstants.checkExpiryDate}
                                                style={{ width: "100%",marginTop: "20px" }}
                                                onChange={e => this.onChangeSetAdditionalInfo(e, "accreditationCoachExpiryDate") }
                                                format={"DD-MM-YYYY"}
                                                showTime={false}
                                                value={registrationObj.additionalInfo.accreditationCoachExpiryDate && moment(registrationObj.additionalInfo.accreditationCoachExpiryDate,"YYYY-MM-DD")}
                                                // name={'accreditationCoachExpiryDate'}
                                            />
                                    //     )}
                                    // </Form.Item>
                                )}
                            </div>
                        )}
                        
                        {registrationObj.umpireFlag == 1 || registrationObj.coachFlag == 1 && (
                            <div>
                                <InputWithHead 
                                heading={AppConstants.workingWithChildrenCheckNumber}
                                placeholder={AppConstants.childrenNumber} 
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"childrenCheckNumber")} 
                                value={registrationObj.additionalInfo.childrenCheckNumber}
                                />
                                {/* <Form.Item >
                                    {getFieldDecorator(`childrenCheckExpiryDate`, {
                                        rules: [{ required: true}],
                                    })( */}
                                        <DatePicker
                                            size="large"
                                            placeholder={AppConstants.checkExpiryDate}
                                            style={{ width: "100%",marginTop: "20px" }}
                                            onChange={e => this.onChangeSetAdditionalInfo(e, "childrenCheckExpiryDate") }
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            value={registrationObj.additionalInfo.childrenCheckExpiryDate && moment(registrationObj.additionalInfo.childrenCheckExpiryDate,"YYYY-MM-DD")}
                                            // name={'childrenCheckExpiryDate'}
                                        />
                                    {/* )}
                                </Form.Item> */}
                            </div>
                        )}

                        {registrationObj.walkingNetballFlag == 1 && (
                            <div>
                                <InputWithHead heading={AppConstants.walkingNetball}/>
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "walkingNetballRefId")} 
                                    value={registrationObj.additionalInfo.walkingNetballRefId}
                                    >
                                    {(walkingNetballQuesList || []).map((ques,quesIndex) => (
                                        <Radio key={ques.id} value={ques.id}>{ques.description}</Radio>
                                    ))}
                                </Radio.Group>
                                {registrationObj.additionalInfo.walkingNetballRefId != null && (
                                    <InputWithHead 
                                    placeholder={AppConstants.walkingNetball} 
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"walkingNetballInfo")} 
                                    value={registrationObj.additionalInfo.walkingNetballInfo}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in additionalPersonalInfoView"+ex);
        }
    }

    stepsContentView = (getFieldDecorator) => {
        return(
            <div>
               {this.state.currentStep == 0 && 
                    <div>{this.participantDetailsStepView(getFieldDecorator)}</div>
               } 
               {this.state.currentStep == 1 && 
                    <div>{this.selectCompetitionStepView(getFieldDecorator)}</div>
               }
               {this.state.currentStep == 2 && 
                    <div>{this.additionalInfoStepView(getFieldDecorator)}</div>
               }
            </div>
        )
    }

    contentView = (getFieldDecorator) => {
        let { registrationObj } = this.props.userRegistrationState;
        return(
            <div className="pt-0" style={{width: "70%",margin: "auto"}}>
                {(registrationObj == null || registrationObj.registeringYourself == undefined) && (
                    <div>{this.addOrSelectParticipantView()}</div>
                )}
                {registrationObj != null && registrationObj.registeringYourself && (
                    <div>
                        <Steps className="registration-steps" current={this.state.currentStep} onChange={this.changeStep}>
                            <Step status={this.state.completedSteps.includes(0) && "finish"} title={AppConstants.participantDetails}/>
                            <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && "finish"} title={AppConstants.selectCompetition}/>
                            <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && this.state.completedSteps.includes(2) &&"finish"} title={AppConstants.additionalInformation}/>
                        </Steps>
                        {this.stepsContentView(getFieldDecorator)}
                        {this.singleCompModalView()}
                    </div>
                )}
            </div>
        )
    }

    footerView = () => {
        let { registrationObj } = this.props.userRegistrationState;
        return(
            <div>
                {registrationObj != null && registrationObj.registeringYourself && !this.state.showAddAnotherCompetitionView && (
                    <div style={{width: "75%",margin: "auto",paddingBottom: "50px"}}>
                        <Button 
                        htmlType="submit"
                        type="primary"
                        style={{float: "right",color: "white"}}
                        disabled={this.disabledOrNot()} 
                        className="open-reg-button">{this.state.submitButtonText}</Button>
                    </div>
                )}
            </div>
        )
    }

    singleCompModalView = () =>{
        let {saveValidationErrorMsg} = this.props.userRegistrationState;
        let {saveValidationErrorCode} = this.props.userRegistrationState;
        let errorMsg = saveValidationErrorMsg!=  null ? saveValidationErrorMsg : [];
        let title = saveValidationErrorCode == 1 ? AppConstants.singleCompetition : AppConstants.userDetailsInvalid;
        return (
            <div>
              <Modal
                className="add-membership-type-modal"
                title={title}
                visible={this.state.singleCompModalVisible}
                footer={[
                    <Button onClick={() => this.setState({singleCompModalVisible: false})}>
                        {AppConstants.ok}                          
                    </Button>
                ]}>
                {(errorMsg || []).map((item, index) =>(
                    <p key= {index}> {item}</p>
                ))}
              </Modal>
            </div>
          )
    }

    render(){
        const { getFieldDecorator } = this.props.form;
       // console.log("form",this.props.form);
        return(
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout>
                    {this.headerView()}
                    <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveRegistrationForm}
                        noValidate="noValidate">
                        <Content>
                        <div>
                            {this.contentView(getFieldDecorator)}
                        </div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                        <Loader visible={this.props.userRegistrationState.onMembershipLoad || 
                                            this.props.userRegistrationState.onParticipantByIdLoad ||
                                            this.props.userRegistrationState.onSaveLoad
                                        } />
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({	
        getUserRegistrationUserInfoAction,
        selectParticipantAction,
        updateUserRegistrationObjectAction,
        genderReferenceAction,
        countryReferenceAction,
        getCommonRefData,
        membershipProductEndUserRegistrationAction,
        updateParticipantCompetitionAction,
        playerPositionReferenceAction,
        updateUserRegistrationStateVarAction,
        identificationReferenceAction,
        disabilityReferenceAction,
        favouriteTeamReferenceAction,
        firebirdPlayerReferenceAction,
        otherSportsReferenceAction,
        heardByReferenceAction,
        updateParticipantAdditionalInfoAction,
        accreditationUmpireReferenceAction,
        accreditationCoachReferenceAction,
        walkingNetballQuesReferenceAction,
        saveParticipantInfo	,
        getParticipantInfoById,
        orgRegistrationRegSettingsEndUserRegAction				 
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userRegistrationState: state.UserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppRegistrationFormNew));