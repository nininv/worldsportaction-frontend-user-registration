import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Radio, Form, Modal, message
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
import {getUreAction} from 
                "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { getCommonRefData,  favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction, heardByReferenceAction,playerPositionReferenceAction,
    genderReferenceAction, disabilityReferenceAction } from '../../store/actions/commonAction/commonAction';

import { saveEndUserRegistrationAction,updateEndUserRegisrationAction, orgRegistrationRegSettingsEndUserRegAction,
    membershipProductEndUserRegistrationAction, getUserRegistrationUserInfoAction,
    clearRegistrationDataAction} from 
            '../../store/actions/registrationAction/endUserRegistrationAction';
import { getAge,deepCopyFunction} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {getOrganisationId,  getCompetitonId, getUserId } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

class AppRegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreeTerm: false,
            competitionUniqueKey: getCompetitonId(),
            organisationUniqueKey: getOrganisationId(),
            showChildrenCheckNumber: false,
            volunteerList: [],
            modalVisible: false,
            modalKey: "",
            modalMessage: "",
            participantIndex: 0,
            productIndex: 0,
            subIndex: 0,
            buttonPressed: "",
            loading: false,
            flag: 0,
            tempParentId: 0,
			getMembershipLoad: false
        };
     
        this.props.getCommonRefData();
        this.props.firebirdPlayerReferenceAction();
        this.props.favouriteTeamReferenceAction();
        this.props.registrationOtherInfoReferenceAction();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();
        this.props.heardByReferenceAction();
        this.props.playerPositionReferenceAction();
        this.props.genderReferenceAction();
        this.props.disabilityReferenceAction();
        this.getUserInfo();
       // this.props.clearRegistrationDataAction();
       
    }

    componentDidMount(){
        console.log("Component Did mount");
     
        let payload = {
            competitionUniqueKey: this.state.competitionUniqueKey,
            organisationUniqueKey: this.state.organisationUniqueKey
        }

      //  this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
        this.props.membershipProductEndUserRegistrationAction(payload);
		 this.setState({getMembershipLoad: true})

    }
    componentDidUpdate(nextProps){
        console.log("Component componentDidUpdate");
        let commonReducerState = this.props.commonReducerState;
        let registrationState = this.props.endUserRegistrationState;
        if (nextProps.commonReducerState !== commonReducerState) {
            if (commonReducerState.registrationOtherInfoOnLoad === false) {
                commonReducerState.registrationOtherInfoList.forEach(function (element) {
                    element.isActive = false;
                  });
                this.setState({volunteerList: commonReducerState.registrationOtherInfoList});
            }
        }
		
		 if(registrationState.onMembershipLoad == false && this.state.getMembershipLoad == true)
        {
            if(registrationState.membershipProductInfo!= null
                && registrationState.membershipProductInfo.length > 0)
                {
                   this.setState({getMembershipLoad: false})
                    this.addParticipant(0, 1);
                }
        }

       if(registrationState.onLoad == false && this.state.loading === true)
       {
            this.setState({ loading: false });
            if(!registrationState.error)
            {
                if (this.state.buttonPressed == "save" ) {
                    history.push('/appRegistrationSuccess');
                }
            }
       }

       if(registrationState.populateParticipantDetails  == 1)
       {
           console.log("&&&&&&&&&&&");
           let user = registrationState.user;
           this.setFormFields(user, this.state.participantIndex);
           this.props.updateEndUserRegisrationAction(0, "populateParticipantDetails");
       }

    //    if(registrationState.populateParticipantDetails === 1 )
    //    {
    //        let registrationState = this.props.endUserRegistrationState;
    //        let userInfo = registrationState.userInfo;
    //        this.setFormFields(userInfo, 0);
    //        this.props.updateEndUserRegisrationAction(0, "populateParticipantDetails");
    //    }
       if(registrationState.refFlag === "parent")
       {
            this.setParentFormFields(this.state.participantIndex);
            this.props.updateEndUserRegisrationAction("", "refFlag");
       }

       if(registrationState.setCompOrgKey == true){
           if(registrationState.registrationDetail.userRegistrations[0].isPlayer!= -1)
           {
            this.props.form.setFieldsValue({
                [`organisationUniqueKey0`]: this.state.organisationUniqueKey,
                [`competitionUniqueKey0`]:  this.state.competitionUniqueKey,
            });
            this.props.updateEndUserRegisrationAction(false, "setCompOrgKey");
           }
        }
    }

    getRegistrationSettings = (competitionUniqueKey, organisationUniqueKey) => {
        let payload = {
            competitionUniqueKey: competitionUniqueKey,
            organisationUniqueKey: organisationUniqueKey
        }
        this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
    }

    getUserInfo = () => {
        console.log("getUserInfo::" + getUserId());
        if(getUserId() != 0)
        {
            let payload = {
                competitionUniqueKey: getCompetitonId(),
                organisationId: getOrganisationId(),
                userId: getUserId()
            }
            console.log("payload::" + JSON.stringify(payload));
            this.props.getUserRegistrationUserInfoAction(payload);
        }
        
    }

    setImage = (data, index, key) => {
        console.log("data**", data.files[0] + "Key::" + key)
        if (data.files[0] !== undefined) {
            let registrationState = this.props.endUserRegistrationState;
            let registrationDetail = registrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            let userRegistration = userRegistrations[index];
            userRegistration[key] = data.files[0];
            userRegistration["profileUrl"] = URL.createObjectURL(data.files[0]);
            this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
        }
    };

    selectImage(index) {
        const fileInput = document.getElementById('user-pic' + index);
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    addParticipant = (registeringYourself, populateParticipantDetails) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let membershipProductInfo = registrationState.membershipProductInfo;
       
        let participantObj = {
            tempParticipantId: userRegistrations.length + 1,
            competitionUniqueKey: null,
            organisationUniqueKey: null,
            registeringYourself: 0,
            isSameParentContact: false,
            isLinkExistingParent: false,
            isVoucherAdded: false,
            whoAreYouRegistering: 0,
            whatTypeOfRegistration: 0,
            userId: null,
            competitionMembershipProductTypeId:null,
            competitionMembershipProductDivisionId: 0,
            divisionName:"",
            genderRefId: 1,
            dateOfBirth:"",
            firstName: "",
            middleName:"",
            lastName:"",
            mobileNumber:"",
            email: "",
            reEnterEmail: "",
            street1:"",
            street2:"",
            suburb:"",
            stateRefId: 1,
            postalCode: "",
            statusRefId: 0,
            emergencyContactName: "",
            emergencyContactNumber: "",
            isPlayer: -1,
            userRegistrationId:0,
            playedBefore: 0,
            playedYear: null,
            playedClub: "",
            playedGrade: "",
            lastCaptainName: "",
            existingMedicalCondition: "",
            regularMedication: "",
            heardByRefId: 0,
            heardByOther: "",
            favouriteTeamRefId: null,
            favouriteFireBird: null,
            isConsentPhotosGiven: 0,
            participantPhoto: null,
            profileUrl: null,
            voucherLink: "",
            isDisability: 0,
            disabilityCareNumber: '',
            disabilityTypeRefId: 0,
            playerId:0,
            position1: null,
            position2:  null,
            parentOrGuardian: [],
            friends: [],
            referFriends: [],
            products:[],
           // membershipProducts: [],
            tempParents: [],
            countryRefId: null,
            nationalityRefId: null,
            languages: "",
            organisationInfo: null,
            competitionInfo: null,
            specialNote:null,
            training: null,
            contactDetails: null,
            postalCode: "",
            alternativeLocation: "",
            registrationOpenDate: null,
            registrationCloseDate: null,
            venue: []
        }

        let parentListLength = userRegistrations.filter(x=>x.parentOrGuardian.length > 0);
        let flag = false;
        if(userRegistrations.length == 0)
        {
            if(this.state.competitionUniqueKey!= null && this.state.organisationUniqueKey!= null &&
                this.state.competitionUniqueKey!= undefined && this.state.organisationUniqueKey!= undefined)
                {
                    let orgInfo =  membershipProductInfo.find(x=>x.organisationUniqueKey == 
                        this.state.organisationUniqueKey);
                    participantObj.organisationInfo = deepCopyFunction(orgInfo);
                    participantObj.competitionUniqueKey = this.state.competitionUniqueKey;
                    participantObj.organisationUniqueKey = this.state.organisationUniqueKey;
                    let competitionInfo = participantObj.organisationInfo.competitions.
                                    find(x=>x.competitionUniqueKey == this.state.competitionUniqueKey);
                    participantObj.competitionInfo = deepCopyFunction(competitionInfo);
                    if(competitionInfo!= null && competitionInfo!= undefined){
                        participantObj.specialNote = participantObj.competitionInfo.specialNote;
                        participantObj.training = participantObj.competitionInfo.training;
                        participantObj.contactDetails = participantObj.competitionInfo.contactDetails;
                       
                        participantObj.registrationOpenDate = participantObj.competitionInfo.registrationOpenDate;
                        participantObj.registrationCloseDate = participantObj.competitionInfo.registrationCloseDate;
                        participantObj.venue = participantObj.competitionInfo.venues!= null ? 
                                        participantObj.competitionInfo.venues: [];
                        this.getRegistrationSettings(this.state.competitionUniqueKey, this.state.organisationUniqueKey);
                    }
                    else{
                        participantObj.competitionUniqueKey = null;
                        this.setState({competitionUniqueKey: null});
                    }
                   flag = true;
                }
        }
        
        userRegistrations.push(participantObj);
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
        if(flag)
        {
            this.props.updateEndUserRegisrationAction(true, "setCompOrgKey");
        }
       
    }

    setUserInfo = (participantObj, userInfo, userRegistrations, index) => {
        console.log("userInfo" + JSON.stringify(userInfo));
        participantObj.firstName = userInfo!= null ? userInfo.firstName : "";
        participantObj.middleName = userInfo!= null ? userInfo.middleName : "";
        participantObj.lastName =  userInfo!= null ? userInfo.lastName : "";
        participantObj.mobileNumber =  userInfo!= null ? userInfo.mobileNumber : "";
        participantObj.email =  userInfo!= null ? userInfo.email : "";
        participantObj.reEnterEmail =  userInfo!= null ? userInfo.email : "";
        participantObj.street1 =  userInfo!= null ? userInfo.street1 : "";
        participantObj.street2 =  userInfo!= null ? userInfo.street2 : "";
        participantObj.suburb =  userInfo!= null ? userInfo.suburb : "";
        participantObj.stateRefId =  userInfo!= null ? userInfo.stateRefId : null;
        participantObj.postalCode =  userInfo!= null ? userInfo.postalCode : "";
        participantObj.emergencyContactName =  userInfo!= null ? userInfo.emergencyContactName : "";
        participantObj.emergencyContactNumber =  userInfo!= null ? userInfo.emergencyContactNumber : "";
        participantObj.profileUrl =  userInfo!= null ? userInfo.photoUrl : "";
        participantObj.genderRefId =  userInfo!= null ? userInfo.genderRefId : 0;
        participantObj.dateOfBirth =  userInfo!= null ? new Date(userInfo.dateOfBirth) : null;
        participantObj.userId =  userInfo!= null ? userInfo.id: 0;

        if(userInfo!= null && userInfo!= undefined){
            if(getAge(new Date(userInfo.dateOfBirth)) < 18){
                (userInfo.parentsOrGaurdian || []).map((item, userIndex) => {
                    this.addParent(index, userRegistrations, item);
                })
            }
        }
    }

    setFormFields = (userInfo, index) => {
        console.log("setFormFields"+ JSON.stringify(userInfo));
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 

        this.props.form.setFieldsValue({
            [`participantFirstName${index}`]: userInfo!= null ? userInfo.firstName : "",
            [`participantLastName${index}`]:  userInfo!= null ? userInfo.lastName : "",
            [`participantMobileNumber${index}`]:  userInfo!= null ? userInfo.mobileNumber : "",
            [`participantEmail${index}`]:  userInfo!= null ? userInfo.email : "",
            [`participantReEnterEmail${index}`]:  userInfo!= null ? userInfo.email : "",
            [`participantStreet1${index}`]:  userInfo!= null ? userInfo.street1 : "",
            [`participantSuburb${index}`]:  userInfo!= null ? userInfo.suburb : "",
            [`participantStateRefId${index}`]:  userInfo!= null ? userInfo.stateRefId : null,
            [`participantPostalCode${index}`]:  userInfo!= null ? userInfo.postalCode : "",
            [`participantEmergencyContactName${index}`]:  userInfo!= null ? userInfo.emergencyContactName : "",
            [`participantEmergencyContactNumber${index}`]:  userInfo!= null ? userInfo.emergencyContactNumber : "",
            [`genderRefId${index}`]:  userInfo!= null ? userInfo.genderRefId : 0,
            [`dateOfBirth${index}`]:  userInfo!= null ? ((userInfo.dateOfBirth!= null && userInfo.dateOfBirth!= '') ? 
                moment(userInfo.dateOfBirth, "YYYY-MM-DD") : null) : null,
        });

        if(userInfo!= null && userInfo!= undefined){
            if(getAge(new Date(userInfo.dateOfBirth)) < 18){
                (userInfo.parentsOrGaurdian || []).map((item, parentIndex) => {
                    this.setParentformFieldsValue(index, parentIndex, item);
                })
            }
        }
    }
        

    setParentFormFields = (index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
      
        console.log("userRegistration.parentOrGuardian" + JSON.stringify(userRegistration.parentOrGuardian));
        (userRegistration.parentOrGuardian || []).map((item, parentIndex) => {
            this.setParentformFieldsValue(index, parentIndex, item);
            // this.props.form.setFieldsValue({
            //     [`parentFirstName${index}${parentIndex}`]: item.firstName,
            //     [`parentLastName${index}${parentIndex}`]: item.lastName,
            //     [`parentContactField${index}${parentIndex}`]: item.mobileNumber,
            //     [`parentEmail${index}${parentIndex}`]: item.email,
            //     [`parentReEnterEmail${index}${parentIndex}`]: item.email,
            //     [`parentStreet1${index}${parentIndex}`]: item.street1,
            //     [`parentSuburb${index}${parentIndex}`]: item.suburb,
            //     [`parentStateRefId${index}${parentIndex}`]: item.stateRefId,
            //     [`parentPostalCode${index}${parentIndex}`]: item.postalCode,
            // });
        })

    }

    setParentformFieldsValue = (index, parentIndex, item) => {
        this.props.form.setFieldsValue({
            [`parentFirstName${index}${parentIndex}`]: item.firstName,
            [`parentLastName${index}${parentIndex}`]: item.lastName,
            [`parentContactField${index}${parentIndex}`]: item.mobileNumber,
            [`parentEmail${index}${parentIndex}`]: item.email,
            [`parentReEnterEmail${index}${parentIndex}`]: item.email,
            [`parentStreet1${index}${parentIndex}`]: item.street1,
            [`parentSuburb${index}${parentIndex}`]: item.suburb,
            [`parentStateRefId${index}${parentIndex}`]: item.stateRefId,
            [`parentPostalCode${index}${parentIndex}`]: item.postalCode,
        });
    }

    addProduct = (index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let product = {
            playerId: 0,
            divisionName: "",
            isPlayer: 0,
            position1: null,
            position2: null,
            competitionMembershipProductTypeId: null,
            competitionMembershipProductDivisionId: null,
            friends: [],
            referFriends: []
        }
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = registrationDetail.userRegistrations[index];
        let products = userRegistration.products;
        products.push(product);
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    addVoucher = () => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let vouchers = registrationDetail.vouchers;
        let voucher = {
            tempParticipantId: null,
            voucherLink: ""
        }
        vouchers.push(voucher);
        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
    }

    addFriend = (index, key, participantOrProduct, prodIndex) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
       
        let friendObj = {
            friendId: 0,
            firstName:"",
            lastName:"",
            email:"",
            mobileNumber:""
        }
        if(participantOrProduct === "participant")
        {
            if(key === "friend")
            {
                userRegistration.friends.push(friendObj);
            }
            else if(key === "referFriend")
            {
                userRegistration.referFriends.push(friendObj);
            }
        }
        else if(participantOrProduct === "product")
        {
            let product = userRegistration.products[prodIndex];
            if(key === "friend")
            {
                product.friends.push(friendObj);
            }
            else if(key === "referFriend")
            {
                product.referFriends.push(friendObj);
            }
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    addParent = (index, userRegistrations, parent) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;

        if(userRegistrations == null)
            userRegistrations = registrationDetail.userRegistrations;

        let userRegistration = userRegistrations[index];

        let parentObj = {
            tempParentId: ++this.state.tempParentId,
            userId: parent!= null ? parent.userId : 0,
            firstName: parent!= null ? parent.firstName : "",
            lastName: parent!= null ? parent.lastName : "",
            mobileNumber: parent!= null ? parent.mobileNumber: "",
            email:  parent!= null ? parent.email: "",
            street1: parent!= null ? parent.street1 : "",
            street2: parent!= null ? parent.street2 : "",
            suburb: parent!= null ? parent.suburb: "",
            stateRefId: parent!= null ? parent.stateRefId: 1,
            postalCode: parent!= null ? parent.postalCode: "",
            isSameAddress: 0,
            reEnterEmail: parent!= null ? parent.email : ""
        }
        console.log("parentObj ::" + JSON.stringify(parentObj));
        console.log("ParentOrGuardian" + JSON.stringify(userRegistration.parentOrGuardian));
        userRegistration.parentOrGuardian.push(parentObj);

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetRegistrationValue = (value, key) => {
       
        if(key === "whatTypeOfRegistration")
        {
            this.setState({whatTypeOfRegistration: value});
        }

        this.props.updateEndUserRegisrationAction(value, key);

    }

    onChangeSetParticipantValue = (value, key, index) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let membershipProdecutInfo = registrationState.membershipProductInfo;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
        let userInfo = registrationState.userInfo;
        if(key =="playedBefore" && value == 0)
        {
            userRegistration["playedYear"] = 0;
            userRegistration["playedClub"] = "";
            userRegistration["playedGrade"] = "";

        }
        else if(key === "competitionMembershipProductTypeId"){
    
            let memProd = userRegistration.competitionInfo.membershipProducts.
                find(x=>x.competitionMembershipProductTypeId === value);
            console.log("***********" + userRegistration.competitionMembershipProductDivisionId);
            let  divisions = userRegistration.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                value).divisions;
            console.log("&&&&&&&&&&" + JSON.stringify(divisions));
            if(divisions!= null && divisions!= undefined)
            {
                if(divisions.length == 1)
                {
                    console.log("&&&&&&" + divisions[0].competitionMembershipProductDivisionId);
                    userRegistration["competitionMembershipProductDivisionId"] = 
                    divisions[0].competitionMembershipProductDivisionId;
                    userRegistration["divisionName"] =  divisions[0].divisionName;
                }
                else{
                    userRegistration.competitionMembershipProductDivisionId = null;
                    this.props.form.setFieldsValue({
                        [`competitionMembershipProductDivisionId${index}`]:  null,
                    });
                }
            }
           
            userRegistration["isPlayer"] = memProd.isPlayer;
            // Enable the existing one and disable the new one
            let oldMemProd = userRegistration.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId === userRegistration.competitionMembershipProductTypeId);
            if(oldMemProd!= null && oldMemProd!= "" && oldMemProd!= undefined)
            {
                oldMemProd.isDisabled = false;
            }
            memProd.isDisabled = true;
        }
        else if(key === "whatTypeOfRegistration")
        {
            if(getUserId()  == 0 || userInfo.length == 0){
                if(value === 1){
                    let friendObj = {
                        friendId: 0,
                        firstName:"",
                        lastName:"",
                        email:"",
                        mobileNumber:""
                    }
                    let referFriendObj = {
                        friendId: 0,
                        firstName:"",
                        lastName:"",
                        email:"",
                        mobileNumber:""
                    }
                    userRegistration["isPlayer"] = 1;
                    userRegistration.friends.push(friendObj);
                    userRegistration.referFriends.push(referFriendObj);
                }
                else {
                    userRegistration["isPlayer"] = 0;
                }
            }
        }
        else if(key == "isSameParentContact" && value)
        {
            let mobileNumber;
            let contactName;
            if(userRegistration.parentOrGuardian[0] == null || userRegistration.parentOrGuardian[0] == undefined)
            {
                if(userRegistration.tempParents!= null && userRegistration.tempParents.length > 0){
                  let parentId =   userRegistration.tempParents[0];
                  userRegistrations.map((x, index) => {
                    let parent =   x.parentOrGuardian.find(y=> y.tempParentId == parentId);
                    if(parent!= null && parent!= undefined){
                        mobileNumber = parent.mobileNumber;
                        contactName = parent.firstName + " " + parent.lastName; 
                    }
                  })
                }
            }
            if(userRegistration.emergencyContactNumber == null || userRegistration.emergencyContactNumber == "")
            {
                if(userRegistration.parentOrGuardian[0]!= null && userRegistration.parentOrGuardian[0]!= undefined)
                {
                    if(userRegistration.parentOrGuardian[0].mobileNumber!= null && userRegistration.parentOrGuardian[0].mobileNumber!= "")
                    {
                        userRegistration["emergencyContactNumber"] = userRegistration.parentOrGuardian[0].mobileNumber;
                        this.props.form.setFieldsValue({
                            [`participantEmergencyContactNumber${index}`]: userRegistration.parentOrGuardian[0].mobileNumber
                        });
                    }
                }
                else{
                    userRegistration["emergencyContactNumber"] = mobileNumber;
                    this.props.form.setFieldsValue({
                        [`participantEmergencyContactNumber${index}`]: mobileNumber
                    });
                }
            }

            if(userRegistration.emergencyContactName == null || userRegistration.emergencyContactName == "")
            {
                if(userRegistration.parentOrGuardian[0]!= null && userRegistration.parentOrGuardian[0]!= undefined)
                {
                    if(userRegistration.parentOrGuardian[0].firstName!= null && userRegistration.parentOrGuardian[0].firstName!= "")
                    {
                        let emergencyContactName = userRegistration.parentOrGuardian[0].firstName + " " + userRegistration.parentOrGuardian[0].lastName;
                        userRegistration["emergencyContactName"] = emergencyContactName;
                        this.props.form.setFieldsValue({
                            [`participantEmergencyContactName${index}`]: emergencyContactName,
                        });
                    }
                }
                else{
                    userRegistration["emergencyContactName"] = contactName;
                    this.props.form.setFieldsValue({
                        [`participantEmergencyContactName${index}`]: contactName,
                    });
                }
            }
        }
        else if(key == "dateOfBirth")
        {
            
           // let filteredRegistrations =  userRegistrations.filter(x=>x.tempParticipantId != userRegistration.tempParticipantId);
            let isParentAvailable = false;
      
            (userRegistrations ||[]).map((item, index) => {
                    if(item.parentOrGuardian.length > 0){
                        isParentAvailable = true;
                    }
            });
            console.log("^^^^^^^^^^^^" + isParentAvailable);
            if(getAge(value) <= 18 && !isParentAvailable)
            {
                console.log("inside");
                this.addParent(index, userRegistrations);
            }
        }
        else if(key == "isDisability")
        {
            if(value == 0)
            {
                userRegistration["disabilityTypeRefId"] = 0;
                userRegistration["disabilityCareNumber"] = null;
            }
        }
        else if(key == "organisationUniqueKey")
        {
            let organisationInfo = membershipProdecutInfo.find(x=>x.organisationUniqueKey == value);
            console.log("organisationInfo::" + JSON.stringify(organisationInfo));
            if(userRegistration.competitionInfo!= undefined && 
                userRegistration.competitionInfo.membershipProducts!= undefined)
            {
                let oldMemProd = userRegistration.competitionInfo.membershipProducts.
                find(x=>x.competitionMembershipProductTypeId === userRegistration.competitionMembershipProductTypeId);
                if(oldMemProd!= null && oldMemProd!= "" && oldMemProd!= undefined)
                {
                    oldMemProd.isDisabled = false;
                }
            }
           
            userRegistration.organisationInfo = deepCopyFunction(organisationInfo);
            userRegistration.competitionInfo = [];
            userRegistration.competitionUniqueKey = null;
            userRegistration.competitionMembershipProductTypeId = null;
            userRegistration.competitionMembershipProductDivisionId = null;
            userRegistration.products = [];
            userRegistration.specialNote = null;
            userRegistration.training = null;
            userRegistration.registrationOpenDate = null;
            userRegistration.registrationCloseDate = null;
            userRegistration.contactDetails = null;
            userRegistration.divisionName = null;
            userRegistration.venue = [];
            this.props.form.setFieldsValue({
                [`competitionUniqueKey${index}`]:  null,
                [`competitionMembershipProductTypeId${index}`]:  null,
                [`competitionMembershipProductDivisionId${index}`]:  null,
                
            });
        }
        else if(key == "competitionUniqueKey"){
            if(userRegistration.competitionInfo!= undefined && 
                userRegistration.competitionInfo.membershipProducts!= undefined)
            {
                let oldMemProd = userRegistration.competitionInfo.membershipProducts.
                find(x=>x.competitionMembershipProductTypeId === userRegistration.competitionMembershipProductTypeId);
                if(oldMemProd!= null && oldMemProd!= "" && oldMemProd!= undefined)
                {
                    oldMemProd.isDisabled = false;
                }
            }

            let competitionInfo = userRegistration.organisationInfo.competitions.
                                    find(x=>x.competitionUniqueKey == value);
            userRegistration.competitionInfo = deepCopyFunction(competitionInfo);
            userRegistration.competitionMembershipProductTypeId = null;
            userRegistration.competitionMembershipProductDivisionId = null;
            userRegistration.specialNote = competitionInfo.specialNote;
            userRegistration.training = competitionInfo.training;
            userRegistration.contactDetails = competitionInfo.contactDetails;
            userRegistration.registrationOpenDate = competitionInfo.registrationOpenDate;
            userRegistration.registrationCloseDate = competitionInfo.registrationCloseDate;
            userRegistration.venue = competitionInfo.venues!= null ? competitionInfo.venues : [];
            userRegistration.products = [];
            userRegistration.divisionName = null;
            this.props.form.setFieldsValue({
                [`competitionMembershipProductTypeId${index}`]:  null,
                [`competitionMembershipProductDivisionId${index}`]:  null,
            });

            this.getRegistrationSettings(competitionInfo.competitionUniqueKey, userRegistration.organisationUniqueKey);
           
        }

        userRegistration[key] = value;

        console.log("UserRegistrations::" + JSON.stringify(userRegistrations));
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetUserSelection = (value, key, index) => {
        console.log("UserId" + value);
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
        let userInfoList = registrationState.userInfo;

        let user = userInfoList.find(x=>x.id == value);
        let oldUser = userInfoList.find(x=>x.id == userRegistration.userId);
        if(oldUser!= null && oldUser!= "" && oldUser!= undefined)
        {
            oldUser.isDisabled = 0;
        }
        userRegistration.parentOrGuardian = [];
        this.setUserInfo(userRegistration, user, userRegistrations, index);
        // if(user!= null && user!= undefined)
        // {
        //     this.setUserInfo(userRegistration, user, userRegistrations, index);
        // }

       // this.setFormFields(user);

        if(userRegistration.whatTypeOfRegistration == 1 || 
            userRegistration.registeringYourself == 1 ){
            userRegistration["isPlayer"] = 1;
          }
          else if(userRegistration.whatTypeOfRegistration == 2 || 
            userRegistration.registeringYourself == 2){
            userRegistration["isPlayer"] = 0;
          }
          else{
            userRegistration["isPlayer"] = -1;
          }
        
        if(user!= null && user!= undefined)
        {
            user.isDisabled = 1;
        }
        this.setState({participantIndex: index});
        this.props.updateEndUserRegisrationAction(user, "user");
        this.props.updateEndUserRegisrationAction(userInfoList, "userInfo");
        this.props.updateEndUserRegisrationAction(1, "populateParticipantDetails");

        console.log("userInfoList" + JSON.stringify(userInfoList));

        userRegistration[key] = value;
        
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetParentValue = (value, key, index, parentIndex) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
        userRegistration.parentOrGuardian[parentIndex][key] = value;

        if(key === "isSameAddress")
        {
            if(value === true || value === 1)
            {
                userRegistration.parentOrGuardian[parentIndex]["street1"] = userRegistration.street1;
                userRegistration.parentOrGuardian[parentIndex]["street2"] = userRegistration.street2;
                userRegistration.parentOrGuardian[parentIndex]["suburb"] = userRegistration.suburb;
                userRegistration.parentOrGuardian[parentIndex]["stateRefId"] = userRegistration.stateRefId;
                userRegistration.parentOrGuardian[parentIndex]["postalCode"] = userRegistration.postalCode;
            }
            else{
                userRegistration.parentOrGuardian[parentIndex]["street1"] = null;
                userRegistration.parentOrGuardian[parentIndex]["street2"] = null;
                userRegistration.parentOrGuardian[parentIndex]["suburb"] = null;
                userRegistration.parentOrGuardian[parentIndex]["stateRefId"] = null;
                userRegistration.parentOrGuardian[parentIndex]["postalCode"] = null;
            }
        }
        
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetProdMemberTypeValue = (value, index, prodIndex, key) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let membershipProdecutInfo = this.props.endUserRegistrationState.membershipProductInfo;
        let userRegistration = userRegistrations[index];
        let product = userRegistration.products[prodIndex];
        
        if(key == "competitionMembershipProductDivisionId"){
            product["competitionMembershipProductDivisionId"] = value;
            //product["divisionName"] = divisionName;
        }
        else{
            let memProd = userRegistration.competitionInfo.membershipProducts.
                find(x=>x.competitionMembershipProductTypeId === value);
            let  divisions = userRegistration.competitionInfo.membershipProducts.
                    find(x=>x.competitionMembershipProductTypeId == value).divisions;
            console.log("&&&&&&&&&&memProd::" + JSON.stringify(memProd));
            if(divisions!= null && divisions!= undefined)
            {
                if(divisions.length == 1)
                {
                    console.log("&&&&&&" + divisions[0].competitionMembershipProductDivisionId);
                    product["competitionMembershipProductDivisionId"] = 
                    divisions[0].competitionMembershipProductDivisionId;
                    product["divisionName"] =  divisions[0].divisionName;
                }
            }

            product["isPlayer"] =  memProd.isPlayer;
           
            // Enable the existing one and disable the new one
            let oldMemProd = userRegistration.competitionInfo.membershipProducts.
                        find(x=>x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId);
            if(oldMemProd!= null && oldMemProd!= "" && oldMemProd!= undefined)
            {
                oldMemProd.isDisabled = false;
            }
            memProd.isDisabled = true;
            product["competitionMembershipProductTypeId"] = memProd.competitionMembershipProductTypeId;
            if(memProd.isPlayer){
                this.addFriend(index,"friend","product", prodIndex);
                this.addFriend(index,"referFriend","product", prodIndex);
            }
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetVolunteerValue = (value, index) =>{
        let volunteerList = [...this.state.volunteerList];
        volunteerList[index].isActive = value;

        let filterList = volunteerList.filter(x=> (x.id === 1 && x.isActive == true) || (x.id == 3 && x.isActive == true));
        if(filterList!= null && filterList!= "" && filterList!= undefined)
        {
            this.setState({showChildrenCheckNumber: true});
        }
        else{
            this.setState({showChildrenCheckNumber: false});
        }
        this.setState({volunteerList: volunteerList});
    }

    onChangeSetValue = (e, index, participantOrProduct, productIndex, key, subIndex, subKey ) => {
        console.log("onChangeSetValue:" + e + "!!!" + index+ "!!!" + participantOrProduct + "!!!"+productIndex + "!!!" + key + "!!!" + subIndex + "!!!"+subKey);
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
        if(participantOrProduct =="participant")
        {
            console.log("key::" + key);
            if(key === "positions")
            {
                userRegistration[subKey] = e;
            }
            else if(key === "friend"){
                let friend = userRegistration.friends[subIndex];
                friend[subKey] = e;
            }
            else if(key === "referFriend"){
                let referFriend = userRegistration.referFriends[subIndex];
                referFriend[subKey] = e;
            }
            
        }else{
            let product = userRegistration.products[productIndex];
            if(key === "positions")
            {
                product[subKey] = e;
            }
            else if(key === "friend"){
                let friend = product.friends[subIndex];
                friend[subKey] = e;
            }
            else if(key ==="referFriend"){
                let referFriend = product.referFriends[subIndex];
                referFriend[subKey] = e;
            }
        }
        
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetRegYourself = (value, key, index)  => {
        console.log("registeringYourself" + value);
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
        let userInfo = registrationState.userInfo;
      //clearing up the existing participants
      //let newUserRegistration = [];
      //let vouchers = [];
     // this.props.updateEndUserRegisrationAction(newUserRegistration, "userRegistrations");
     // this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
      //this.setState({registeringYourself: e});
      userRegistration[key] = value;
      if(getUserId() == 0 || userInfo.length == 0)
      {
        if(value == 1){
            userRegistration["isPlayer"] = 1;
          }
          else if(value == 2){
            userRegistration["isPlayer"] = 0;
          }
          else{
            userRegistration["isPlayer"] = -1;
          }

          
      }
     
      this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
     
      //this.addParticipant(e, 1);
     
    }

    onChangeSetVoucherValue = (value, key, index) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let vouchers = registrationDetail.vouchers;
        let voucher = vouchers[index];
        let oldTempParticipantId = voucher.tempParticipantId;

        if(key === "tempParticipantId")
        {
            let oldTempParticipant = userRegistrations.find(x=>x.tempParticipantId === oldTempParticipantId);
            if(oldTempParticipant!= null && oldTempParticipant!= undefined && oldTempParticipant!= "")
            {
                oldTempParticipant.isVoucherAdded = false;
            }

            let newTempParticipant = userRegistrations.find(x=>x.tempParticipantId === value);
            newTempParticipant.isVoucherAdded = true;
        }

        voucher[key] = value;

        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeTempParent = (index, value) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
        userRegistration["tempParents"] = value;
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    deleteEnableOrDisablePopup = (key, value, participantIndex, productIndex, subIndex, message, subKey) => {
        console.log("key::" + key + "participantIndex"+participantIndex + "subKey::" + subKey);
        let modalKey = key;
        let modalMessage = message;
        if(subKey!= null)
        {
            modalKey = key+subKey;
        }
        if(key == "participant" && subKey == null)
        {
            modalMessage = AppConstants.participantDeleteConfirmMsg;
        }
        else if(key == "product" && subKey == null)
        {
            modalMessage = AppConstants.productDeleteConfirmMsg;
        }
        else if(key == "parent")
        {
            modalMessage = AppConstants.parentDeleteConfirmMsg;  
        }
        this.setState({modalVisible: value, 
                        participantIndex: participantIndex, 
                        productIndex: productIndex, 
                        subIndex: subIndex,
                        modalMessage: modalMessage,
                        modalKey: modalKey});

    }

    removeModalPopup = (modalOption) => {
        if(modalOption === "ok"){
            if(this.state.modalKey === "participant")
            this.removeParticipant();
            else if(this.state.modalKey === "product")
                this.removeProduct();
            else if(this.state.modalKey === "participantFriend" || 
                this.state.modalKey === "participantReferFriend" || 
                this.state.modalKey === "productFriend" || this.state.modalKey === "productReferFriend")
                this.removeFriend();
            else if(this.state.modalKey === "registrationOption")
                this.removeRegistration();
            else if(this.state.modalKey === "voucher")
                this.removeVoucher();
            else if(this.state.modalKey == "parent"){
                this.removeParent();
            }
        }
        this.setState({modalVisible: false});
        
    }

    removeParticipant = () => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex];
        let vouchers = registrationDetail.vouchers;

        let userInfoList = registrationState.userInfo;
        let oldUser = userInfoList.find(x=>x.id == userRegistration.userId);
        if(oldUser!= null && oldUser!= "" && oldUser!= undefined)
        {
            oldUser.isDisabled = 0;
        }

        let deletedTempParticipant = vouchers.find(x=>x.tempParticipantId === userRegistration.tempParticipantId);

        if(deletedTempParticipant!= null && deletedTempParticipant!= "" && deletedTempParticipant!= undefined)
        {
            let newVouchers = vouchers.filter(x=>x.tempParticipantId !=  userRegistration.tempParticipantId);
            if(newVouchers!= null && newVouchers!= "" && newVouchers!= undefined)
            {
                this.props.updateEndUserRegisrationAction(newVouchers, "vouchers");
            }
            else{
                this.props.updateEndUserRegisrationAction([], "vouchers");
            }
        }
        
        userRegistrations.splice(this.state.participantIndex, 1);
        this.props.updateEndUserRegisrationAction(userInfoList, "userInfo");
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");

    }

    removeProduct = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex]; 
        let product = userRegistration.products[this.state.productIndex];
        userRegistration.products.splice(this.state.productIndex, 1);

         // Enable the existing one
         let memProd = userRegistration.competitionInfo.membershipProducts
                .find(x=>x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId);
         if(memProd!= null && memProd!= "" && memProd!= undefined)
         {
            memProd.isDisabled = false;
         }

         this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
        
    }

    removeFriend = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex]; 
        if(this.state.modalKey == "participantFriend")
        {
            userRegistration.friends.splice(this.state.subIndex, 1);
        }
        else if(this.state.modalKey == "participantReferFriend"){
            userRegistration.referFriends.splice(this.state.subIndex, 1); 
        }
        else if(this.state.modalKey == "productFriend"){
            userRegistration.products[this.state.productIndex].friends.splice(this.state.subIndex, 1);  
        }
        else if(this.state.modalKey == "productReferFriend"){
            userRegistration.products[this.state.productIndex].referFriends.splice(this.state.subIndex, 1);  
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    removeRegistration = () => {
        
    }

    removeVoucher = (modalOption) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let vouchers = registrationDetail.vouchers;
        let voucher = vouchers[this.state.subIndex];

        let tempParticipant = userRegistrations.find(x=>x.tempParticipantId === voucher.tempParticipantId);
        if(tempParticipant!= null && tempParticipant!= "" && tempParticipant!= undefined)
        {
            tempParticipant.isVoucherAdded = false;
        }

        vouchers.splice(this.state.subIndex, 1);
        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    removeParent = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex]; 
        
        let filteredRegistrations =  userRegistrations.filter(x=>x.tempParticipantId != userRegistration.tempParticipantId);
        let tempParentId = userRegistration.parentOrGuardian[this.state.productIndex].tempParentId;

        filteredRegistrations.map((item, index) => {
            let linkedParentIndex =  item.tempParents.findIndex(x=>x === tempParentId);
            if(linkedParentIndex!= -1)
            {
                item.tempParents.splice(linkedParentIndex, 1);
            }
        })
        userRegistration.parentOrGuardian.splice(this.state.productIndex, 1); 

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
        this.props.updateEndUserRegisrationAction("parent", "refFlag");
        
    }

    saveRegistrationForm = (e) => {
        console.log("saveRegistrationForm" + e);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
                let registrationState = this.props.endUserRegistrationState;
                let regSetting = registrationState.registrationSettings;
                let registrationDetail = registrationState.registrationDetail;
                let userRegistrations = registrationDetail.userRegistrations;
                let volunteers = [];
                (this.state.volunteerList || []).map((item, index) => {
                    let obj = {
                        registrationOtherInfoRefId: item.id,
                        registrationVolunteerId: 0
                    }
                    if(item.isActive == true)
                    {
                        volunteers.push(obj)
                    }
                });
                registrationDetail.volunteers = volunteers;
                registrationDetail.organisationUniqueKey = this.state.organisationUniqueKey;
                registrationDetail.competitionUniqueKey = this.state.competitionUniqueKey;

                userRegistrations.map((item, index) =>{
                    if(getAge(item.dateOfBirth) > 18){
                        item.parentOrGuardian = [];
                    }

                    if(regSetting.play_friend == 0)
                    {
                        item.friends = [];
                    }
                    if(regSetting.refer_friend == 0)
                    {
                        item.referFriends = [];
                    }
                    delete item.organisationInfo;
                    delete item.competitionInfo;
                });
                // for(let y = 0; y< userRegistrations.length; y++)
                // {
                //     let dob = userRegistrations[y].dateOfBirth;
                //     if(getAge(dob) > 18){
                //         userRegistrations[y].parentOrGuardian = [];
                //     }

                //     if(regSetting.play_friend == 0)
                //     {
                //         userRegistrations[y].friends = [];
                //     }
                //     if(regSetting.refer_friend == 0)
                //     {
                //         userRegistrations[y].referFriends = [];
                //     }
                // }



                let formData = new FormData();
                let isError = false;
                for(let x = 0; x< userRegistrations.length; x++)
                {
                    let userRegistration = userRegistrations[x];
                    if(userRegistration.profileUrl == null){
                        isError = true;
                        break;
                    }
                    else{
                        formData.append("participantPhoto", userRegistration.participantPhoto);
                    }
                }

                if(!isError)
                {
                    console.log("FINAL DATA" + JSON.stringify(registrationDetail));
                    formData.append("registrationDetail", JSON.stringify(registrationDetail));

                     this.props.saveEndUserRegistrationAction(formData);
                     this.setState({ loading: true });
                }
                else{
                    message.error(ValidationConstants.userPhotoIsRequired);
                }
               
            }
        });
    }
    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "flex-start"
                    }}
                >
                    <Breadcrumb
                        style={{ alignItems: "center", alignSelf: "center" }}
                        separator=">"
                    >
                        {/* <NavLink to="/registration">
                            <Breadcrumb.Item className="breadcrumb-product">Products</Breadcrumb.Item>
                        </NavLink> */}
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.appRegoForm}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>

            </div>
        );
    };

    registeringYourselfView = (item, index, getFieldDecorator) => {
        return (
            <div className="formView content-view pt-5">
                 <span className="form-heading"> {AppConstants.registration}</span>
                <InputWithHead heading={AppConstants.areYouRegisteringYourself} required={"required-field"}></InputWithHead>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeSetRegYourself(e.target.value, "registeringYourself", index)}
                    value={item.registeringYourself}>
                    <Radio value={1}>{AppConstants.yesAsAPlayer}</Radio>
                    <Radio value={2}>{AppConstants.yesAsANonPlayer}</Radio>
                    <Radio value={3}>{AppConstants.registeringSomeoneElse}</Radio>
                </Radio.Group>
            </div>
        )
    }

    registrationQuestionView = (item, index, getFieldDecorator) =>{
        const {genderList} = this.props.commonReducerState;
        let registrationState = this.props.endUserRegistrationState;
        let userInfo = registrationState.userInfo;
        return (
            <div className="formView content-view pt-5">
                 <span className="form-heading"> {AppConstants.registration}</span>
                
                 {item.registeringYourself == 3 ? (
                     <div>
                        <InputWithHead heading={AppConstants.whoAreYouRegistering} required={"required-field"}></InputWithHead>
                        <Form.Item >
                        {getFieldDecorator(`whoAreYouRegistering${index}`, {
                            rules: [{ required: true, message: ValidationConstants.whoAreYouRegistering }],
                        })(
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "whoAreYouRegistering", index)}
                                value={item.whoAreYouRegistering}>
                                <Radio value={1}>{AppConstants.child}</Radio>
                                <Radio value={2}>{AppConstants.other}</Radio>
                                <Radio value={3}>{AppConstants.team}</Radio>
                            </Radio.Group>
                        )}
                        </Form.Item>
                        <InputWithHead heading={AppConstants.whatTypeOfRegistration} required={"required-field"}></InputWithHead>
                        <Form.Item >
                        {getFieldDecorator(`whatTypeOfRegistration${index}`, {
                            rules: [{ required: true, message: ValidationConstants.whatTypeOfRegistration }],
                        })(
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "whatTypeOfRegistration", index)}
                                value={item.whatTypeOfRegistration}>
                                <Radio value={1}>{AppConstants.player}</Radio>
                                <Radio value={2}>{AppConstants.nonPlayer}</Radio>
                            </Radio.Group>
                        )}
                        </Form.Item>
                    </div>
                ): null}

                { (item.registeringYourself!= 0 && (userInfo!= null && userInfo.length > 0))? 
                    this.userSelectionView(item, index) : null}
                {item.isPlayer!= -1  ? 
                <div>
                   
                    <InputWithHead heading={AppConstants.gender}   required={"required-field"}></InputWithHead>
                    <Form.Item >
                    {getFieldDecorator(`genderRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.genderField }],
                    })(
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "genderRefId", index)}
                        // value={item.genderRefId}
                            setFieldsValue={item.genderRefId}>
                                {(genderList || []).map((gender, genderIndex) => (
                                    <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                                ))}
                        </Radio.Group>
                    )}
                    </Form.Item>

                    <InputWithHead heading={AppConstants.dob}   required={"required-field"}/>
                    <Form.Item >
                    {getFieldDecorator(`dateOfBirth${index}`, {
                        rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
                    })(
                    <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        onChange={e => this.onChangeSetParticipantValue(e, "dateOfBirth", index) }
                        format={"DD-MM-YYYY"}
                        showTime={false}
                        name={'dateOfBirth'}
                    />
                    )}
                    </Form.Item>
                </div> : null}
            </div>
        )
    }

    membershipProductView = (item, index, getFieldDecorator) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let membershipProdecutInfo = this.props.endUserRegistrationState.membershipProductInfo;
        let divisions = [];
        if(item.competitionMembershipProductTypeId != null && item.competitionInfo!= null &&
            item.competitionInfo!= undefined)
        {
            divisions = item.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                item.competitionMembershipProductTypeId).divisions;
        }
        //console.log("item" + JSON.stringify(item));
        return (
            <div className="formView content-view pt-5" style={{backgroundColor: 'var(--app-ebf0f3)'}}>
             <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>
               
                <Form.Item >
                {getFieldDecorator(`postalCode${index}`, {
                    rules: [{ required: true, message: ValidationConstants.postCodeField }],
                })(
                    <InputWithHead
                        required={"required-field"}
                        heading={AppConstants.enterPostCode}
                        placeholder={AppConstants.enterPostCode}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "postalCode", index )} 
                        setFieldsValue={registrationDetail.postalCode}
                        maxLength={4}
                    /> 
                    )}
                    </Form.Item>
               
                
                {/* <InputWithHead
                    heading={AppConstants.alternate_location}
                    placeholder={AppConstants.alternate_location}
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "alternativeLocation", index )} 
                    value={registrationDetail.alternativeLocation}
                /> 
                */}
               <InputWithHead heading={AppConstants.organisationName}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`organisationUniqueKey${index}`, {
                        rules: [{ required: true, message: ValidationConstants.organisationRequired }],
                    })(
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "organisationUniqueKey", index )}
                       
                        >
                    {(membershipProdecutInfo || []).map((org, orgIndex) => (
                            <Option key={org.organisationUniqueKey} 
                            value={org.organisationUniqueKey}>{org.organisationName}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
 
                <InputWithHead heading={AppConstants.competition_name}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`competitionUniqueKey${index}`, {
                        rules: [{ required: true, message: ValidationConstants.competitionRequired }],
                    })(
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "competitionUniqueKey", index )}
                       
                        >
                    {(item.organisationInfo!= null && item.organisationInfo.competitions || []).map((comp, compIndex) => (
                            <Option key={comp.competitionUniqueKey} 
                            value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
               
                {item.organisationUniqueKey != null ? 
                <div>
                    <div style={{display: 'flex'}}>
                        <div className="col-sm-6" style={{paddingLeft: '0px'}}> 
                            <InputWithHead heading={AppConstants.startDate}/>
                            <div className="applicable-to-text">{item.registrationOpenDate}</div>
                        </div>
                        <div className="col-sm-6"> 
                            <InputWithHead heading={AppConstants.endDate}/>
                            <div className="applicable-to-text">{item.registrationCloseDate}</div>
                        </div>
                    </div>
                    <InputWithHead heading={AppConstants.venue}/>
                    {(item.venue || []).map((v, vIndex) =>(
                        <span>
                            <span>{v.venueName}</span>
                            <span>{item.venue.length != (vIndex + 1) ? ', ': ''}</span>
                        </span>
                    ))}
                    <InputWithHead heading={AppConstants.specialNotes}/>
                        <div className="applicable-to-text">{item.specialNote}</div>
                    <InputWithHead heading={AppConstants.training} />
                        <div className="applicable-to-text">{item.training}</div>
                    <InputWithHead heading={AppConstants.contactDetails}/>
                        <span className="applicable-to-text">{item.contactDetails}</span>
                    <InputWithHead heading={AppConstants.photos}/>
                    <div className="org-photos">
                    {((item.organisationInfo!=null && item.organisationInfo.organisationPhotos) || [] )
                    .map((ph, phIndex) => (
                        <div key={ph.organisationPhotoId}>
                            <div>
                                <img src={ph.photoUrl} alt=""height= {125} width={125}
                                    style={{ borderRadius:0, marginLeft: 0 }} name={'image'}
                                        onError={ev => {ev.target.src = AppImages.circleImage;}}
                                />
                            </div>
                            <div className="photo-type">{ph.photoType}</div>
                        </div>
                    ))}
                    </div>
                </div> : null}

                <InputWithHead heading={AppConstants.membershipProduct}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`competitionMembershipProductTypeId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductRequired }],
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "competitionMembershipProductTypeId", index )}
                        setFieldsValue={item.competitionMembershipProductTypeId}
                        >
                    {(item.competitionInfo!= null && item.competitionInfo.membershipProducts || []).map((mem, index) => (
                            <Option key={mem.competitionMembershipProductTypeId} 
                            value={mem.competitionMembershipProductTypeId} disabled={mem.isDisabled}>{mem.name}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                
                <InputWithHead heading={AppConstants.divisions} required={"required-field"}/>
                { 
                    divisions.length > 1 ?
                    <div>
                        <Form.Item>
                            {getFieldDecorator(`competitionMembershipProductDivisionId${index}`, {
                                rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired }],
                            })(
                            <Select
                                style={{ width: "100%", paddingRight: 1 }}
                                onChange={(e) => this.onChangeSetParticipantValue(e, "competitionMembershipProductDivisionId", index )}
                                setFieldsValue={item.competitionMembershipProductDivisionId}
                                >
                                {(divisions || []).map((division, index) => (
                                    <Option key={division.competitionMembershipProductDivisionId} 
                                    value={division.competitionMembershipProductDivisionId}>{division.divisionName}</Option>
                                ))}
                            </Select>
                        )}
                        </Form.Item>
                    </div>
                    : 
                     <div className="applicable-to-text">{item.divisionName}</div> 
                }
            </div>
        )
    }

    participantDetailView = (item, index, getFieldDecorator) => {
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                 <span className="form-heading"> {AppConstants.participantDetails}</span>
                 <Form.Item >
                    {getFieldDecorator(`participantFirstName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.participant_firstName}
                        placeholder={AppConstants.participant_firstName}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "firstName",index )} 
                       // value={item.firstName}
                        setFieldsValue={item.firstName}
                    />
                    )}
                </Form.Item>

                <InputWithHead
                    heading={AppConstants.participant_middleName}
                    placeholder={AppConstants.participant_middleName}
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "middleName", index )} 
                    value={item.middleName}
                />

                <Form.Item >
                    {getFieldDecorator(`participantLastName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.participant_lastName}
                        placeholder={AppConstants.participant_lastName}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastName", index )} 
                        setFieldsValue={item.lastName}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`participantMobileNumber${index}`, {
                        rules: [{ required: true, message: ValidationConstants.contactField }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.contactMobile}
                        placeholder={AppConstants.contactMobile}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "mobileNumber", index )} 
                        setFieldsValue={item.mobileNumber}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`participantEmail${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.contactEmail}
                        placeholder={AppConstants.contactEmail}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "email", index )} 
                        setFieldsValue={item.email}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`participantReEnterEmail${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.reenterEmail}
                        placeholder={AppConstants.reenterEmail}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "reEnterEmail", index )} 
                        setFieldsValue={item.reEnterEmail}
                    />
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.photo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="reg-competition-logo-view" onClick={ () => this.selectImage(index)}>
                                <label>
                                    <img
                                        src={item.profileUrl == null ? AppImages.circleImage  : item.profileUrl}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name={'image'}
                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label>

                            </div>
                            <input
                                type="file"
                                id= {"user-pic" + index} 
                                style={{ display: 'none' }}
                                onChange={(evt) => this.setImage(evt.target, index, "participantPhoto")} />

                        </div>
                        <div
                            className="col-sm-2"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <InputWithHead heading={AppConstants.takePhoto} />
                        </div>
                        <div
                            className="col-sm-1"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <InputWithHead heading={AppConstants.or} />
                        </div>
                        <div
                            className="col-sm-2"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <InputWithHead heading={AppConstants.uploadPhoto} />
                        </div>
                    </div>
                </div>

                <span className="applicable-to-heading" style={{fontSize:'18px'}}>{AppConstants.address}</span>
                <Form.Item >
                    {getFieldDecorator(`participantStreet1${index}`, {
                        rules: [{ required: true, message: ValidationConstants.addressField}],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street1", index )} 
                        setFieldsValue={item.street1}
                    />
                    )}
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street2", index )} 
                    value={item.street2}
                />
                <Form.Item >
                    {getFieldDecorator(`participantSuburb${index}`, {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "suburb", index )} 
                        setFieldsValue={item.suburb}
                    />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
                <Form.Item >
                    {getFieldDecorator(`participantStateRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                    })(
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "stateRefId", index )}
                        setFieldsValue={item.stateRefId}>
                        {stateList.length > 0 && stateList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.name}</Option>
                        ))
                        }
                    </Select>
                    )}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator(`participantPostalCode${index}`, {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "postalCode", index )} 
                        setFieldsValue={item.postalCode}
                    />
                    )}
                </Form.Item>

                
            </div>
        )
    }

    parentGuardianView = (item, index, getFieldDecorator) => {
        const { stateList } = this.props.commonReducerState;
        const styles = {paddingTop: '20px', marginBottom: '20px', width: '100%'};
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let filteredRegistrations =  userRegistrations.filter(x=>x.tempParticipantId != item.tempParticipantId);
        let isParentAvailable = false;
       //console.log("@@@@@@@@@" + JSON.stringify(filteredRegistrations));
       (filteredRegistrations ||[]).map((item, index) => {
            if(item.parentOrGuardian.length > 0){
                isParentAvailable = true;
            }
       });
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading">
                    {AppConstants.parents_guardians}
                </span>
                {isParentAvailable ? (
                <div >
                    <Checkbox
                            className="single-checkbox" 
                            checked={item.isLinkExistingParent}
                            onChange={e => this.onChangeSetParticipantValue(e.target.checked, "isLinkExistingParent", index )} >
                            {AppConstants.linkExistingParent}
                    </Checkbox>
                    {
                    (item.isLinkExistingParent && (
                        <Select
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(e) => this.onChangeTempParent(index, e)}
                            value={item.tempParents}>
                            {(filteredRegistrations).map((reg, regIndex) => (
                                (reg.parentOrGuardian).map((tParent, tpIndex) => (
                                    <Option key={tParent.tempParentId + tpIndex} 
                                        value={tParent.tempParentId}>
                                        {tParent.firstName + " " + tParent.lastName} 
                                    </Option>
                                ))
                            ))}
                        
                    </Select>

                    ))
                    }
                </div>
                ) : null}
               
                {(item.parentOrGuardian || []).map((parent, parentIndex) => (
                <div key={"parent"+parentIndex}>
                   {this.dividerTextView("PARENT " + (parentIndex + 1), styles, "parent", index, parentIndex)}
                    <Form.Item>
                        {getFieldDecorator(`parentFirstName${index}${parentIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                        })(
                        <InputWithHead 
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.firstName} 
                        placeholder={AppConstants.firstName} 
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "firstName", index, parentIndex )} 
                        setFieldsValue={parent.firstName}/>
                        )}
                    </Form.Item>

                    <Form.Item>
                        {getFieldDecorator(`parentLastName${index}${parentIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                        })(
                        <InputWithHead 
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.lastName} 
                            placeholder={AppConstants.lastName} 
                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "lastName", index, parentIndex )} 
                            setFieldsValue={parent.lastName}/>
                            )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator(`parentContactField${index}${parentIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.contactField }],
                        })(
                        <InputWithHead 
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.mobile} 
                            placeholder={AppConstants.mobile} 
                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "mobileNumber", index, parentIndex  )} 
                            setFieldsValue={parent.mobileNumber}
                        />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator(`parentEmail${index}${parentIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                        })(
                        <InputWithHead 
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.email} 
                            placeholder={AppConstants.email} 
                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "email", index, parentIndex  )} 
                            setFieldsValue={parent.email}
                        />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator(`parentReEnterEmail${index}${parentIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                        })(
                        <InputWithHead 
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.reenterEmail}
                            placeholder={AppConstants.reenterEmail} 
                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "reEnterEmail", index, parentIndex  )} 
                            setFieldsValue={parent.reEnterEmail}/>
                            )}
                    </Form.Item>
                    <Checkbox
                        className="single-checkbox"
                        checked={parent.isSameAddress}
                        onChange={e => this.onChangeSetParentValue(e.target.checked, "isSameAddress", index, parentIndex  )} >
                        {AppConstants.sameAddress}
                    </Checkbox>
                    {
                        parent.isSameAddress != true && (
                            <div>
                                <span className="applicable-to-heading" style={{fontSize:'18px'}}>{AppConstants.address}</span>
                                <Form.Item>
                                    {getFieldDecorator(`parentStreet1${index}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                                    })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.addressOne}
                                        placeholder={AppConstants.addressOne}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "street1", index, parentIndex  )} 
                                        setFieldsValue={parent.street1}
                                    />
                                    )}
                                </Form.Item>
                                <InputWithHead
                                    heading={AppConstants.addressTwo}
                                    placeholder={AppConstants.addressTwo}
                                    onChange={(e) => this.onChangeSetParentValue(e.target.value, "street2", index, parentIndex  )} 
                                    value={parent.street2}
                                />
                                <Form.Item>
                                    {getFieldDecorator(`parentSuburb${index}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                    })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.suburb}
                                        placeholder={AppConstants.suburb}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "suburb", index, parentIndex  )} 
                                        setFieldsValue={parent.suburb}
                                    />
                                    )}
                                </Form.Item> 
                            
                                <InputWithHead heading={AppConstants.state}  required={"required-field"}/>
                                <Form.Item>
                                    {getFieldDecorator(`parentStateRefId${index}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                    })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.select}
                                        onChange={(e) => this.onChangeSetParentValue(e, "stateRefId", index, parentIndex  )}
                                        setFieldsValue={parent.stateRefId}>
                                        {stateList.length > 0 && stateList.map((item) => (
                                            < Option key={item.id} value={item.id}> {item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                    )}
                                </Form.Item>

                                <Form.Item>
                                    {getFieldDecorator(`parentPostalCode${index}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                    })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.postcode}
                                        placeholder={AppConstants.postcode}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "postalCode", index, parentIndex  )} 
                                        setFieldsValue={parent.postalCode}
                                        maxLength={4}
                                    />
                                )}
                                </Form.Item>
                            </div>
                        )
                    }
                </div>
                ))}
                <span className="input-heading-add-another pointer" onClick={()=> this.addParent(index, null)}>
                    + {AppConstants.addParent_guardian}
                </span>

            </div>
        )
    }

    emergencyContactView = (item, index, getFieldDecorator) => {
        return(
            <div className="formView content-view pt-5" >
                 <span className="form-heading">
                    {AppConstants.emergency_contact}
                </span>
                {(getAge(item.dateOfBirth) <= 18) ? 
                    <Checkbox
                        className="single-checkbox"
                        checked={item.isSameParentContact}
                        onChange={e => this.onChangeSetParticipantValue(e.target.checked, "isSameParentContact", index )} >
                        {AppConstants.useParentInfo}
                    </Checkbox> : null
                }
                <Form.Item >
                    {getFieldDecorator(`participantEmergencyContactName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emergencyContactName[0] }],
                    })(
                    <InputWithHead 
                    required={"required-field pt-0 pb-0"}
                    heading={AppConstants.emergencyContactName} 
                    placeholder={AppConstants.emergencyContactName} 
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyContactName", index )} 
                    setFieldsValue={item.emergencyContactName}/>
                )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator(`participantEmergencyContactNumber${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emergencyContactNumber[0] }],
                    })(
                    <InputWithHead 
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.emergencyContactMobile} 
                        placeholder={AppConstants.emergencyContactMobile} 
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyContactNumber", index )} 
                        setFieldsValue={item.emergencyContactNumber}/>
                    )}
                </Form.Item>
            </div>
        )
    }

    additionalPersonalInfoView = (item, index, getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSettings;
        return(
            <div className="formView content-view pt-5" >
                 <span className="form-heading">
                    {AppConstants.additionalPersonalInfoReqd}
                </span>
                {regSetting.played_before === 1 && (
                    <div>
                        <span className="applicable-to-heading">
                            {" "}
                            {AppConstants.haveYouEverPlayed}{" "}
                        </span>
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedBefore", index )}
                            value={item.playedBefore}>
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            {item.playedBefore == true && (
                                <div className=" pl-5 pb-5">
                                    <InputWithHead heading={AppConstants.year} placeholder={AppConstants.year}
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedYear", index )} 
                                    value={item.playedYear} 
                                    maxLength={4}/>

                                    <InputWithHead heading={AppConstants.clubOther} placeholder={AppConstants.clubOther} 
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedClub", index )} 
                                    value={item.playedClub}/>

                                    <InputWithHead heading={AppConstants.grade} placeholder={AppConstants.grade} 
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedGrade", index )} 
                                    value={item.playedGrade}/>

                                     {regSetting.last_captain === 1 && (
                                        <div>
                                            <span className="applicable-to-heading">
                                                {AppConstants.lastCaptainName}
                                            </span>
                                            <InputWithHead heading={AppConstants.fullName} placeholder={AppConstants.lastCaptainName}
                                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastCaptainName", index )} 
                                                value={item.lastCaptainName}/>
                                        </div>
                                      )}
                                </div>
                            )}
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                    </div>
                )}
               
            </div>
        )
    }

    playerPosition = (item, index, participantOrProduct, productIndex, getFieldDecorator) => {
        const {playerPositionList} = this.props.commonReducerState;
        let subIndex = 0;
        return (
            <div className="formView content-view pt-5" >
                <InputWithHead heading={AppConstants.indicatePreferredPlayerPosition}/>
                
                <InputWithHead heading={AppConstants.position1} />
                <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex, "position1" )}
                    value={item.position1}>
                    {(playerPositionList || []).map((play1, index) => (
                        <Option key={play1.id} value={play1.id}>{play1.name}</Option>
                    ))}
                </Select>

                <InputWithHead heading={AppConstants.position2} />
                <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex,"position2" )}
                    value={item.position2}>
                    {(playerPositionList || []).map((play2, index) => (
                        <Option key={play2.id} value={play2.id}>{play2.name}</Option>
                    ))}
                </Select>
            </div>
        )
    }

    playWithFriendView = (item, index, participantOrProduct, productIndex, getFieldDecorator) => {
        const styles = {marginTop: '30px', width: '100%'};
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading"> {AppConstants.playWithFriend} </span>   
                <span className="form-heading" style={{fontSize:"10px"}}> {AppConstants.playWithFriendSubtitle} </span>

                {(item.friends || []).map((friend, friendIndex) => (
                    <div key={"friend"+friendIndex} className="inside-container-view pt-0">
                         <div className="row" >
                            <div className="col-sm" >
                                <span className="user-contact-heading">{"FRIEND " + (friendIndex + 1)}</span>
                            </div>
                            <div className="transfer-image-view pointer" onClick={() => 
                                        this.deleteEnableOrDisablePopup(participantOrProduct, true, index, productIndex, friendIndex, AppConstants.friendDeleteConfirmMsg, "Friend")}>
                                <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                                <span className="user-remove-text">
                                    {AppConstants.remove}
                                </span>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.firstName} placeholder={AppConstants.firstName} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "firstName" )} 
                        value={friend.firstName}/>
                        <InputWithHead heading={AppConstants.lastName} placeholder={AppConstants.lastName} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "lastName" )} 
                        value={friend.lastName}/>
                        <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "email" )} 
                        value={friend.email}/>
                        <InputWithHead heading={AppConstants.mobile} placeholder={AppConstants.mobile} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "mobileNumber" )} 
                        value={friend.mobileNumber}/>
                    </div>
                ))}
                <span className="input-heading-add-another pointer" onClick={() => this.addFriend(index, "friend", participantOrProduct, productIndex )}>
                    + {AppConstants.addfriend}
                </span> 
            </div>
        )
    }

    referAFriendView = (item, index, participantOrProduct, productIndex, getFieldDecorator) => {
        const styles = {marginTop: '30px', width: '100%'};
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading"> {AppConstants.referfriend} </span>   
                <span className="form-heading" style={{fontSize:"10px"}}> {AppConstants.friendLiketoPlay} </span>

                {(item.referFriends || []).map((friend, friendIndex) => (
                <div key={"referFriend" + friendIndex}  className="inside-container-view pt-0">
                    <div className="row" >
                        <div className="col-sm" >
                            <span className="user-contact-heading">{"FRIEND " + (friendIndex + 1)}</span>
                        </div>
                        <div className="transfer-image-view pointer" onClick={() => 
                                        this.deleteEnableOrDisablePopup(participantOrProduct, true, index, productIndex, friendIndex, AppConstants.friendDeleteConfirmMsg, "ReferFriend")}>
                            <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                            <span className="user-remove-text">
                                {AppConstants.remove}
                            </span>
                        </div>
                    </div>
                     <InputWithHead heading={AppConstants.firstName} placeholder={AppConstants.firstName} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "firstName" )} 
                        value={friend.firstName}/>
                        <InputWithHead heading={AppConstants.lastName} placeholder={AppConstants.lastName} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "lastName" )} 
                        value={friend.lastName}/>
                        <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "email" )} 
                        value={friend.email}/>
                        <InputWithHead heading={AppConstants.mobile} placeholder={AppConstants.mobile} 
                        onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "mobileNumber" )} 
                        value={friend.mobileNumber}/>
                </div>
                ))}
                <span className="input-heading-add-another pointer" onClick={() => this.addFriend(index, "referFriend", participantOrProduct, productIndex )}>
                    + {AppConstants.addfriend}
                </span> 
            </div>
        )
    }

    additionalInfoView = (item, index, getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSettings;
        const {favouriteTeamsList, firebirdPlayerList, heardByList, disabilityList} = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                 <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>   
                 <InputWithHead heading={AppConstants.existingMedConditions}/>
                 {/* <Form.Item>
                    {getFieldDecorator(`existingMedicalCondition${index}`, {
                        rules: [{ required: true, message: ValidationConstants.existingMedicalCondition[0] }],
                    })( */}
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "existingMedicalCondition", index )} 
                        value={item.existingMedicalCondition}
                        allowClear
                    />
                    {/* )}
                 </Form.Item>     */}

                <InputWithHead heading={AppConstants.redularMedicalConditions}  />
                {/* <Form.Item>
                    {getFieldDecorator(`regularMedication${index}`, {
                        rules: [{ required: true, message: ValidationConstants.regularMedication[0] }],
                    })( */}
                    <TextArea
                        placeholder={AppConstants.redularMedicalConditions}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "regularMedication", index )} 
                        value={item.regularMedication}
                        allowClear/>
                    {/* )}
                </Form.Item>  */}
                <InputWithHead heading={AppConstants.hearAbouttheCompition} />
                {/* <Form.Item>
                    {getFieldDecorator(`heardByRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.heardBy[0] }],
                    })(   */}
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "heardByRefId", index )} 
                        value={item.heardByRefId}>
                            {(heardByList || []).map((heard, index) => (
                                <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                            ))}
                    </Radio.Group>
                {/* )}
                </Form.Item>  */}
                {item.heardByRefId == 4 && (
                    <div className="pl-5 pr-5">
                        <InputWithHead placeholder={AppConstants.other} 
                         onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "heardByOther", index )}
                         value={item.heardByOther}/>
                    </div>
                )}

                <InputWithHead heading={AppConstants.favouriteTeam}/>
                {/* <Form.Item>
                    {getFieldDecorator(`favouriteTeamRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.favoriteTeamField[0] }],
                    })(   */}
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "favouriteTeamRefId", index )}
                        value={item.favouriteTeamRefId}>  
                        {(favouriteTeamsList || []).map((fav, index) => (
                            <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                        ))}
                    </Select>
                    {/* )}
                </Form.Item>  */}
                   
                {item.favouriteTeamRefId === 6?(
                    <div>
                        <InputWithHead heading={AppConstants.who_fav_bird} />
                        {/* <Form.Item>
                            {getFieldDecorator(`favouriteFireBird${index}`, {
                                rules: [{ required: item.favouriteTeamRefId === 6, message: ValidationConstants.firebirdField[0] }],
                            })(   */}
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(e) => this.onChangeSetParticipantValue(e, "favouriteFireBird", index )}
                                value={item.favouriteFireBird}>  
                                {(firebirdPlayerList || []).map((fire, index) => (
                                    <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                                ))}
                            </Select>
                            {/* )}
                        </Form.Item>  */}
                 </div>
                ) : null}

                {regSetting.photo_consent === 1 && (
                    <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.checked, "isConsentPhotosGiven", index )}
                        checked={item.isConsentPhotosGiven}>{AppConstants.consentForPhotos}
                    </Checkbox>
                )}

                {regSetting.disability === 1 && (
                    <div>
                        <InputWithHead heading={AppConstants.haveDisability} />
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "isDisability", index )} 
                            value={item.isDisability}>
                            <Radio value={1}>{AppConstants.yes}</Radio>
                                {item.isDisability == 1 ? 
                                <div style={{marginLeft: '25px'}}>
                                    <InputWithHead heading={AppConstants.disabilityCareNumber} placeholder={AppConstants.disabilityCareNumber} 
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "disabilityCareNumber", index )}
                                        value={item.disabilityCareNumber}/>
                                    <InputWithHead heading={AppConstants.typeOfDisability} />
                                    <Radio.Group
                                        className="reg-competition-radio"
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "disabilityTypeRefId", index )} 
                                        value={item.disabilityTypeRefId}>
                                            {(disabilityList || []).map((dis, disIndex) => (
                                            <Radio key={dis.id} value={dis.id}>{dis.description}</Radio>
                                        ))}
                                    </Radio.Group>
                                </div> 
                                : null
                                }
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>

                    </div>
                )}
            </div>
        )
    }

    otherParticipantReqInfo = (item, index, getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        const { countryList, nationalityList} = this.props.commonReducerState;
        let regSetting = registrationState.registrationSettings;
        return(
            <div className="formView content-view pt-5" >
                <span className="form-heading">
                    {AppConstants.OtherParticipantReqd}
                </span>
                {regSetting.country === 1 && (
                <div>
                    <InputWithHead heading={AppConstants.childCountry} />
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "countryRefId", index )}
                        value={item.countryRefId}>
                        {countryList.length > 0 && countryList.map((country, index) => (
                            < Option key={country.id} value={country.id}> {country.description}</Option>
                        ))
                        }
                    </Select>
                </div>
                )}

                {regSetting.nationality === 1 && (
                    <div>
                        <InputWithHead heading={AppConstants.childNationality} />
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(e) =>  this.onChangeSetParticipantValue(e, "nationalityRefId", index )}
                            value={item.nationalityRefId}>
                            {nationalityList.length > 0 && nationalityList.map((nation, index) => (
                                < Option key={nation.id} value={nation.id}> {nation.description}</Option>
                            ))
                            }
                        </Select>
                    </div>
                )}
                {regSetting.language === 1 &&(
                    <InputWithHead heading={AppConstants.childLangSpoken} placeholder={AppConstants.childLangSpoken} 
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "languages", index )}
                    value={item.languages}/>
                )}
            </div>
        )
    }

    otherInfoReqdView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let regSetting = registrationState.registrationSettings;
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading">
                    {AppConstants.OtherInfoReqd}
                </span>
                {regSetting.club_volunteer === 1 && (
                    <div>
                        <span className="applicable-to-heading">
                            {AppConstants.yourSupportImportant}{" "}
                        </span>
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm">
                                    {(this.state.volunteerList || []).map((info, index) => (
                                        <div key={info.id} style={{display: "flex",flexDirection: "column",justifyContent: "center"}} >
                                            <Checkbox className="single-checkbox" checked={info.isActive} 
                                            onChange={(e) => this.onChangeSetVolunteerValue(e.target.checked, index)}>{info.description}</Checkbox>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.showChildrenCheckNumber && (
                    <InputWithHead heading={AppConstants.childrenCheckNumberInfo} placeholder={AppConstants.childrenNumber} 
                    onChange={(e) => this.onChangeSetRegistrationValue(e.target.value, "childrenCheckNumber" )} 
                    value={registrationDetail.childrenCheckNumber}/>
                )}

                
            </div>
        )
    }

    uniformAndMerchandise = () => {
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading pb-4">
                    {AppConstants.uniformAndMerchandise}
                </span>
            </div>
        )
    }

    voucherView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let isPlayerAvailable = userRegistrations.find(x=>x.isPlayer === 1);
        return (
            <div>
                {isPlayerAvailable ? (
                <div className="advanced-setting-view formView pt-5" >
                    <span className="form-heading">{AppConstants.vouchers}</span>
                    {(registrationDetail.vouchers || []).map((voc, index) => (
                        <div key={voc.tempParticipantId} className="inside-container-view pt-0">
                            <div className="row" >
                                <div className="col-sm" >
                                    <span className="user-contact-heading">{"VOUCHER " + (index + 1)}</span>
                                </div>
                                <div className="transfer-image-view pointer" onClick={() => 
                                        this.deleteEnableOrDisablePopup("voucher", true, 0, 0, index, AppConstants.voucherDeleteConfirmMsg)}>
                                    <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                                    <span className="user-remove-text">
                                        {AppConstants.remove}
                                    </span>
                                </div>
                            </div>
                        <InputWithHead
                            heading={AppConstants.voucherLink}
                            placeholder={AppConstants.voucherLink}
                            onChange={(e) => this.onChangeSetVoucherValue(e.target.value, "voucherLink", index )} 
                            value={voc.voucherLink}
                        />
                        <InputWithHead
                            heading={AppConstants.participant}
                        />
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(e) => this.onChangeSetVoucherValue(e, "tempParticipantId", index )} 
                            value={voc.tempParticipantId} >
                            {(userRegistrations || []).map((item, partIndex)=> (
                                <Option key={item.tempParticipantId} value={item.tempParticipantId} disabled={item.isVoucherAdded}>{item.firstName}</Option>
                            ))}
                        </Select>
                    </div>
                    ))}
                    <span className="input-heading-add-another pointer" onClick={() => this.addVoucher()}>
                        + {AppConstants.addvoucher}
                    </span>
                </div>
                ): null}
            </div>
        );
    };

    membershipProductProductView = (item, prod, prodIndex, index, getFieldDecorator) => {
        let membershipProdecutInfo = this.props.endUserRegistrationState.membershipProductInfo;
        let divisions = [];
        if(prod.competitionMembershipProductTypeId != null && item.competitionInfo!= null &&
            item.competitionInfo!= undefined)
        {
            divisions = item.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                prod.competitionMembershipProductTypeId).divisions;
        }
        return (
            <div className="formView content-view pt-5">
              <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>
             
                <InputWithHead heading={AppConstants.competition_name}/>
                 <div style={{display:'flex'}} className="applicable-to-text">
                    <div>{(item.competitionInfo!= undefined && item.competitionInfo!= null)? item.competitionInfo.competitionName : null}</div>
                </div>

                <InputWithHead heading={AppConstants.membershipProduct} required={"required-field"}/>
                <Form.Item >
                    {getFieldDecorator(`participantMembershipProductTypeId${index}${prodIndex}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductRequired }],
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex, "competitionMembershipProductTypeId")}
                        setFieldsValue={prod.competitionMembershipProductTypeId}>
                        {(item.competitionInfo!= undefined && item.competitionInfo!= null && item.competitionInfo.membershipProducts || []).map((mem, index) => (
                            <Option key={mem.competitionMembershipProductTypeId} 
                            value={mem.competitionMembershipProductTypeId} disabled={mem.isDisabled}>{mem.name}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                {/* <InputWithHead heading={AppConstants.divisions} required={"required-field"}/>
                <InputWithHead heading={prod.divisionName} /> */}


                <InputWithHead heading={AppConstants.divisions} required={"required-field"}/>
                {
                     divisions.length > 1 ?
                     <Form.Item>
                    {getFieldDecorator(`competitionMembershipProductDivisionId${index}${prodIndex}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired }],
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex, "competitionMembershipProductDivisionId" )}
                        setFieldsValue={prod.competitionMembershipProductDivisionId}
                        >
                        {(divisions || []).map((division, index) => (
                            <Option key={division.competitionMembershipProductDivisionId} 
                            value={division.competitionMembershipProductDivisionId}>{division.divisionName}</Option>
                        ))}
                    </Select>
                 )}
                 </Form.Item> : 
                  <InputWithHead heading={prod.divisionName} /> 
                }
                
            </div>
        )
    }

    dividerTextView = (text, styles, playerOrProduct, index, prodIndex) => {
        return(
            <div className="form-heading formView end-user-divider-header" style={styles}>
                <div className="end-user-divider-side" style={{width:'75px'}}></div>
                <div className="end-user-divider-text">{text}</div>
                <div className="end-user-divider-side" style={{flexGrow: '1'}}></div>
                <div className="transfer-image-view pointer" style={{paddingLeft: '33px'}} onClick={() => 
                                        this.deleteEnableOrDisablePopup(playerOrProduct, true, index, prodIndex, 0, "", null)}>
                    <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    <span className="user-remove-text">
                        {AppConstants.remove}
                    </span>
                </div>
            </div>
        )
    }

    removeModalView = () => {
        return (
            <div>
              <Modal
                title="End User Registration"
                visible={this.state.modalVisible}
                onOk={() => this.removeModalPopup("ok")}
                onCancel={() => this.removeModalPopup("cancel")}>
                  <p>{this.state.modalMessage}</p>
              </Modal>
            </div>
          );
    }

    userSelectionView = (item, index) => {
        let registrationState = this.props.endUserRegistrationState;
        let userInfo = registrationState.userInfo;
        return (
            <div>
                <InputWithHead heading={AppConstants.existingUserSelection}/>
                <Select
                    style={{ width: "100%" }}
                    placeholder={AppConstants.select}
                    onChange={(e) => this.onChangeSetUserSelection(e, "userId", index )}
                    value={item.userId}>
                      <Option key={0} value={0}> {AppConstants.newUser}</Option>   
                    {(userInfo || []).map((user, userIndex) => (
                    <Option disabled={parseInt(user.isDisabled)} key={user.id} value={user.id}> {user.firstName + " " + user.lastName}</Option>
                    ))}
                </Select>
               
            </div>
        )
    }

    contentView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let regSetting = registrationState.registrationSettings;
        //console.log("userRegistrations::" + JSON.stringify(userRegistrations));
        //console.log("registrationSettings" + JSON.stringify(regSetting));
        const styles = {paddingTop: '10px', marginBottom: '15px'};
        const stylesProd = {paddingTop: '20px', marginBottom: '20px'};
        return (
            <div>
                {/* <div style={{marginBottom: "20px"}}>
                    {this.registeringYourselfView()}
                </div> */}

                {(userRegistrations || []).map((item, index) => (
                    <div key={"userReg" + index}>
                        <div style={{marginBottom: "20px"}}>
                            {this.registeringYourselfView(item, index, getFieldDecorator)}
                        </div>
                        {item.registeringYourself != 0 ? 
                        <div>
                            {this.dividerTextView("PARTICIPANT " + (index + 1), styles, "participant", index, -1)}
                            <div style={{marginBottom: "20px"}}>
                               
                                {this.registrationQuestionView(item, index, getFieldDecorator)}
                            </div>
                        </div>
                        : null }
                        {item.isPlayer != -1 ? (
                        <div>
                            <div style={{marginBottom: "20px"}}>
                                {this.membershipProductView(item, index, getFieldDecorator)}
                            </div>
                            <div style={{marginBottom: "20px"}}>
                                {this.participantDetailView(item, index, getFieldDecorator)}
                            </div>
                            {(getAge(item.dateOfBirth) <= 18) ? 
                            <div style={{marginBottom: "20px"}}>
                                {this.parentGuardianView(item, index, getFieldDecorator)}
                            </div> : null
                            }

                            {(regSetting.country === 1 || regSetting.nationality === 1 || regSetting.language === 1) && (
                                    <div style={{marginBottom: "20px"}}>
                                        {this.otherParticipantReqInfo(item, index, getFieldDecorator)} 
                                    </div>
                            )}

                            <div style={{marginBottom: "20px"}}>
                               {this.emergencyContactView(item, index, getFieldDecorator)} 
                            </div>
                            {(regSetting.played_before === 1) && (
                                <div style={{marginBottom: "20px"}}>
                                    {this.additionalPersonalInfoView(item, index, getFieldDecorator)}
                                </div>
                            )}
                            {item.isPlayer === 1 ? (
                            <div>
                                {regSetting.nominate_positions === 1 && (
                                    <div style={{marginBottom: "20px"}}>
                                        {this.playerPosition(item, index, "participant", index, getFieldDecorator)}
                                    </div>
                                )}
                                {regSetting.play_friend == 1 && (
                                    <div style={{marginBottom: "20px"}}>
                                        {this.playWithFriendView(item, index, "participant", index, getFieldDecorator)}
                                    </div>
                                )}
                                {regSetting.refer_friend === 1 && (
                                    <div style={{marginBottom: "10px"}}>
                                        {this.referAFriendView(item, index, "participant", index, getFieldDecorator)}
                                    </div>
                                )}
                            </div>
                            ): null}
                            {(item.products || []).map((prod, prodIndex) => (
                                <div key={"prod" + prodIndex}>
                                    {this.dividerTextView("PARTICIPANT " + (index + 1) + " - MEMBERSHIP " + (prodIndex + 2), stylesProd, "product", index, prodIndex)}
                                    <div>
                                        {this.membershipProductProductView(item, prod, prodIndex, index, getFieldDecorator)}
                                    </div>
                                    {prod.isPlayer && (
                                        <div>
                                            {regSetting.nominate_positions === 1 && (
                                                <div style={{marginBottom: "20px"}}>
                                                    {this.playerPosition(prod, index, "product", prodIndex, getFieldDecorator)}
                                                </div>
                                            )}
                                            {regSetting.play_friend === 1 && (
                                                <div style={{marginBottom: "20px"}}>
                                                    {this.playWithFriendView(prod, index, "product", prodIndex, getFieldDecorator)}
                                                </div>
                                            )}
                                            {regSetting.refer_friend === 1 && (
                                                <div style={{marginBottom: "40px"}}>
                                                    {this.referAFriendView(prod, index, "product", prodIndex, getFieldDecorator)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="formView" style={{background: "none", marginBottom: "30px"}}>
                                <span className="input-heading-add-another pointer" onClick={() => this.addProduct(index)}>
                                    + {AppConstants.addAnotherProduct}
                                </span> 
                            </div>   
                            <div style={{marginBottom: "20px"}}>
                                {this.additionalInfoView(item, index, getFieldDecorator)}
                            </div>
                        </div>
                        ): null}

                        {(userRegistrations.length > 0 && (index + 1 == userRegistrations.length) &&
                            userRegistrations[userRegistrations.length - 1].isPlayer != -1)? (
                        <div  className="formView" style={{background: "none", marginBottom: "40px"}}>
                            <span className="input-heading-add-another pointer" onClick={() => this.addParticipant(0)}>
                                + {AppConstants.addAnotherParticipant}
                            </span> 
                        </div>
                        ) : null}
                    </div>
                ))}
                {userRegistrations.length > 0 && userRegistrations[0].isPlayer != -1 ? (
                <div>
                    {/* <div  className="formView" style={{background: "none", marginBottom: "40px"}}>
                        <span className="input-heading-add-another pointer" onClick={() => this.addParticipant(this.state.registeringYourself)}>
                            + {AppConstants.addAnotherParticipant}
                        </span> 
                    </div> */}
                    {(regSetting.club_volunteer === 1) && (
                        <div style={{marginBottom: "20px"}}>
                            {this.otherInfoReqdView(getFieldDecorator)}
                        </div>
                    )}
                    {regSetting.shop === 1 && (
                        <div style={{marginBottom: "20px"}}>
                            {this.uniformAndMerchandise()}
                        </div>
                    )}
                    {regSetting.voucher === 1 && (
                        <div>
                            {this.voucherView(getFieldDecorator)}
                        </div>
                    )}

                    <div className="formView" style={{background: "none"}}>
                        <Form.Item>
                            {getFieldDecorator(`termsAndCondition`, {
                                rules: [{ required: true, message: ValidationConstants.termsAndCondition[0] }],
                            })(  
                            <div >
                                <Checkbox
                                    className="single-checkbox pt-3"
                                    checked={this.state.agreeTerm}
                                    onChange={e => this.setState({ agreeTerm: e.target.checked })}>
                                    {AppConstants.agreeTerm}
                                    <span className="app-reg-terms">
                                        {AppConstants.termsAndConditions}{" "}
                                    </span>
                                    <span className="required-field"></span>
                                </Checkbox>
                            </div>
                            )}
                        </Form.Item> 
                     </div>
                </div>
                ): null}
                {this.removeModalView()}
            </div>
        )
    }

    //////navigate to stripe payment screen
    navigatePaymentScreen = () => {
        history.push("/checkoutPayment", {
            competitionId: this.state.competitionUniqueKey,
            organisationUniqueKey: this.state.organisationUniqueKey
        })
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        return (
            <div className="fluid-width">
                {userRegistrations.length > 0 && userRegistrations[0].isPlayer != -1 ? (
                    <div className="footer-view">
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    <Button className="save-draft-text" type="save-draft-text"
                                        onClick={() => this.navigatePaymentScreen()}>
                                        {AppConstants.pay}
                                    </Button>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button className="save-draft-text" type="save-draft-text"
                                        onClick={() => this.setState({ buttonPressed: "save" })}>
                                        {AppConstants.reviewOrder}
                                    </Button>
                                    <Button
                                        className="open-reg-button"
                                        htmlType="submit"
                                    type="primary"
                                    disabled={isSubmitting}
                                    onClick={() => this.setState({ buttonPressed: "save" })}>
                                    {AppConstants.checkOptions}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                ): null}
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveRegistrationForm}
                        noValidate="noValidate">
                        <Content>
                        <div>
                            {this.contentView(getFieldDecorator)}
                        </div>
                         <Loader visible={this.props.endUserRegistrationState.onLoad} />
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getUreAction,
        getCommonRefData,
        favouriteTeamReferenceAction,
        firebirdPlayerReferenceAction,
        registrationOtherInfoReferenceAction,
        countryReferenceAction,
        nationalityReferenceAction,
        heardByReferenceAction,
        playerPositionReferenceAction,
        updateEndUserRegisrationAction,
        orgRegistrationRegSettingsEndUserRegAction,
        membershipProductEndUserRegistrationAction,
        saveEndUserRegistrationAction,
        genderReferenceAction,
        getUserRegistrationUserInfoAction,
        disabilityReferenceAction,
        clearRegistrationDataAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppRegistrationForm));
