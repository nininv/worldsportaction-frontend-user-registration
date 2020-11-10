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
    Tag,
    Pagination,
    Carousel
} from "antd";
import { connect } from 'react-redux';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import { bindActionCreators } from "redux";
import "./product.css";
import "../user/user.css";
import '../competition/competition.css';
import { isEmptyArray } from "formik";
import Loader from '../../customComponents/loader';
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import {getOrganisationId,  getCompetitonId, getUserId, getAuthToken, getSourceSystemFlag, getUserRegId,getExistingUserRefId } from "../../util/sessionStorage";
import history from "../../util/history";
import { 
    getTeamRegistrationInviteAction,
    teamInviteRegSettingsAction,
    updateInviteMemberInfoAction,
    saveInviteMemberInfoAction
} from '../../store/actions/registrationAction/teamInviteAction';
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
    walkingNetballQuesReferenceAction ,
    getSchoolListAction
} from '../../store/actions/commonAction/commonAction';
import ValidationConstants from "../../themes/validationConstant";
import { captializedString } from "../../util/helpers";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class TeamInivteForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentStep: 0,
            enabledSteps: [],
            completedSteps: [],
            submitButtonText: AppConstants.addDetails,
            inviteOnLoad: false,
            searchAddressFlag: true,
            manualEnterAddressFlag: false,
            showMoreInformation: true,
            buttonSaveOnLoad: false
        }
        this.props.genderReferenceAction();
        this.props.getCommonRefData();
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
    
    componentDidMount(){
        try{
            let existingUserRefId = getExistingUserRefId();
            let payload = {
                userRegId : getUserRegId(),
                //userRegId : "1eaac181-71b2-416a-97dd-fe9e3777be9e",
                userId: existingUserRefId == 1 ? getUserId() : 0
            }
            this.props.getTeamRegistrationInviteAction(payload);
            this.setState({inviteOnLoad: true});
        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            let teamInviteState = this.props.teamInviteState;
            if(!teamInviteState.inviteOnLoad && this.state.inviteOnLoad){
                let payload = {
                    "organisationUniqueKey": teamInviteState.iniviteMemberInfo.competitionDetails.organisationUniqueKey,
                    "competitionUniqueKey": teamInviteState.iniviteMemberInfo.competitionDetails.competitionUniqueKey
                }
                this.props.teamInviteRegSettingsAction(payload);
                this.setYourDetailsValue();
                this.setState({inviteOnLoad: false});
            }
            if(!teamInviteState.inviteMemberSaveOnLoad && this.state.buttonSaveOnLoad){
                history.push({pathname: "/teamInviteProductsReview",state: {userRegId: getUserRegId()}})
            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    getParentObj = () => {
        let parentObj = {
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
            "searchAddressFlag": true,
            "manualEnterAddressFlag": false
        }
        return parentObj;
    }

    setYourDetailsValue = () => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            this.props.form.setFieldsValue({
                [`yourDetailsgenderRefId`]: userRegDetails.genderRefId,
                [`yourDetailsFirstName`]: userRegDetails.firstName,
                [`yourDetailsMiddleName`]: userRegDetails.middleName,
                [`yourDetailsLastName`]: userRegDetails.lastName,
                [`yourDetailsdateOfBirth`]: userRegDetails.dateOfBirth && moment(userRegDetails.dateOfBirth, "YYYY-MM-DD"),
                [`yourDetailsMobileNumber`]: userRegDetails.mobileNumber,
                [`yourDetailsEmail`]: userRegDetails.email
            });
            if(getAge(userRegDetails.dateOfBirth)){
                this.addParent("add");
            }
        }catch(ex){
            console.log("Error in setYourDetailsValue::"+ex);
        }
    }

    setParticipantAdditionalInfoStepFormFields = () => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            if(iniviteMemberInfo){
                this.props.form.setFieldsValue({
                    [`additionalInfoCountryRefId`]: userRegDetails.countryRefId,
                    [`additionalInfoAnyExistingMedialCondition`]: userRegDetails.existingMedicalCondition,
                    [`additionalInfoAnyRedularMedicalConditions`]: userRegDetails.regularMedication,
                    [`additionalInfoInjury`]: userRegDetails.injuryInfo,
                    [`additionalInfoAlergies`]: userRegDetails.allergyInfo,
                    [`additionalInfoTeamYouFollow`]: userRegDetails.favouriteTeamRefId,
                    [`additionalInfoPlayingOtherParticipantSports`]: userRegDetails.otherSportsInfo ? userRegDetails.otherSportsInfo : [],
                    [`additionalInfoFavoriteBird`]: userRegDetails.favouriteTeamRefId,
                    [`additionalInfoDisablityCareNumber`]:userRegDetails.disabilityCareNumber,
                    [`additionalInfoHeartTrouble`]:userRegDetails.walkingNetball.heartTrouble,
                    [`additionalInfoChestPain`]:userRegDetails.walkingNetball.heartTrouble,
                    [`additionalInfoFaintOrSpells`]:userRegDetails.walkingNetball.faintOrSpells,
                    [`additionalInfoBloodPressure`]:userRegDetails.walkingNetball.bloodPressure,
                    [`additionalInfoJointOrBoneProblem`]:userRegDetails.walkingNetball.jointOrBoneProblem,
                    [`additionalInfoPhysicalActivity`]:userRegDetails.walkingNetball.physicalActivity,
                    [`additionalInfoPregnant`]:userRegDetails.walkingNetball.pregnant,
                    [`additionalInfoLowerBackProblem`]:userRegDetails.walkingNetball.lowerBackProblem,
                    [`additionalInfoProvideFurtherDetails`]:userRegDetails.walkingNetballInfo
                });
            }
        }catch(ex){
            console.log("Error in setParticipantAdditionalInfoStepFormFields::"+ex);
        }
    }

    onChangeStep = (current) => {
        try{
            if(this.state.enabledSteps.includes(current)){
                this.setState({currentStep: current});
                this.scrollToTop();
            }
            if(current == 0){
                this.setState({submitButtonText: AppConstants.addDetails,
                showMoreInformation: true});
                setTimeout(() => {
                    this.setYourDetailsValue();
                },300);
            }else if(current == 1){
                if(this.state.enabledSteps.includes(1)){
                    this.setState({submitButtonText: AppConstants.reviewOrder});
                    setTimeout(() => {
                        this.setParticipantAdditionalInfoStepFormFields();
                    },300);
                }
            }
        }catch(ex){
            console.log("Error in onChangeStep::"+ex);
        }
    }

    getOrganisationPhotos = (organisationPhotos) => {
        try{
            let organisationPhotosTemp = [];
            if(organisationPhotos){
                for(let i=0;i<organisationPhotos.length;i++){
                    if((i % 2) == 0){
                        let obj = {
                            photoUrl1: organisationPhotos[i].photoUrl,
                            photoType1: organisationPhotos[i].photoType,
                            photoUrl2: organisationPhotos[i+1].photoUrl,
                            photoType2: organisationPhotos[i+1].photoType,
                        }
                        organisationPhotosTemp.push(obj);
                    }
                }
                return organisationPhotosTemp;
            }
        }catch(ex){
            console.log("Error in getOrganisationPhotos::"+ex);
        }
    }

    getAddress = (addressObject) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const state = stateList.length > 0 && addressObject.stateRefId > 0
                ? stateList.find((state) => state.id === addressObject.stateRefId).name
                : null;
            const country = countryList.length > 0 && addressObject.countryRefId > 0
            ? countryList.find((country) => country.id === addressObject.countryRefId).description
            : null;

            let defaultAddress = '';
            if(state){
                defaultAddress = (addressObject.street1 ? addressObject.street1 + ', ': '') + 
                    (addressObject.suburb ? addressObject.suburb + ', ': '') +
                    (addressObject.postalCode ? addressObject.postalCode + ', ': '') + 
                    (state ? state + ', ': '') +
                    (country ? country + '.': '');
                return defaultAddress;
            }
        }catch(ex){
            console.log("Error in getPartcipantParentAddress"+ex);
        }
    }

    handlePlacesAutocomplete = (addressData,key) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const address = addressData;
            const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address?.state).id : null;
            const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address?.country).id : null;
            if(address){
                if(key == "yourDetails"){
                    this.onChangeSetMemberInfoValue(address.addressOne, "street1","userRegDetails");
                    this.onChangeSetMemberInfoValue(address.suburb, "suburb","userRegDetails");
                    this.onChangeSetMemberInfoValue(address.postcode, "postalCode","userRegDetails");
                    this.onChangeSetMemberInfoValue(countryRefId ? countryRefId : null, "countryRefId","userRegDetails");
                    this.onChangeSetMemberInfoValue(stateRefId ? stateRefId : null, "stateRefId","userRegDetails");
                    if(stateRefId){
                        this.getSchoolList(stateRefId)
                    }  
                }
            }
        }catch(ex){
            console.log("Error in handlePlacesAutoComplete::"+ex);
        }
    }

    getSchoolList = (stateRefId) => {
        this.onChangeSetMemberInfoValue(null, "schoolId","userRegDetails")
        this.props.getSchoolListAction(stateRefId);
    }

    onChangeSetMemberInfoValue = (value,key,subKey) => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            this.props.updateInviteMemberInfoAction(value,key,subKey,null);
            if(key == "dateOfBirth"){
                if(getAge(value) < 18){
                    if(!isArrayNotEmpty(userRegDetails.parentOrGaurdianDetails)){
                        this.addParent("add");
                    }
                }else{
                    this.addParent("removeAllParent")
                }
            }
            if(key == "referParentEmail"){
                if(!value){
                    setTimeout(() => {
                        this.props.form.setFieldsValue({
                            [`yourDetailsEmail`]: userRegDetails.email ? userRegDetails.email : null
                        });
                    });
                }
            }
            if(key == "stateRefId"){
                this.getSchoolList(value)
            }
        }catch(ex){
            console.log("Error in onChangeSetMemberInfoValue::"+ex);
        }
    }

    onChangeSetParentValue = (value,key,parentIndex) => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            let parentOrGuardians = userRegDetails.parentOrGaurdianDetails;
            if(key == "isSameAddress"){
                parentOrGuardians[parentIndex][key] = value;
                if(value){
                    parentOrGuardians[parentIndex]["street1"] = userRegDetails.street1;
                    parentOrGuardians[parentIndex]["street2"] = userRegDetails.street2;
                    parentOrGuardians[parentIndex]["suburb"] = userRegDetails.suburb;
                    parentOrGuardians[parentIndex]["stateRefId"] = userRegDetails.stateRefId;
                    parentOrGuardians[parentIndex]["countryRefId"] = userRegDetails.countryRefId;
                    parentOrGuardians[parentIndex]["postalCode"] = userRegDetails.postalCode;
                    this.props.updateInviteMemberInfoAction(iniviteMemberInfo,"iniviteMemberInfo",null,null)
                }else{
                    this.clearParentAddress(parentOrGuardians,parentIndex);
                }
            }else{
                this.props.updateInviteMemberInfoAction(value,key,"parentOrGaurdianDetails",parentIndex);
            }
        }catch(ex){
            console.log("Error in onChangeSetParentValue::"+ex);
        }
    } 

    clearParentAddress = (parentOrGuardians,parentIndex) => {
        const { iniviteMemberInfo } = this.props.teamInviteState;
        parentOrGuardians[parentIndex]["street1"] = null;
        parentOrGuardians[parentIndex]["street2"] = null;
        parentOrGuardians[parentIndex]["suburb"] = null;
        parentOrGuardians[parentIndex]["stateRefId"] = null;
        parentOrGuardians[parentIndex]["countryRefId"] = null;
        parentOrGuardians[parentIndex]["postalCode"] = null;
        this.props.updateInviteMemberInfoAction(iniviteMemberInfo,"iniviteMemberInfo",null,null)
    }

    scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    addParent = (key,parentIndex) => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            userRegDetails.parentOrGaurdianDetails = userRegDetails.parentOrGaurdianDetails == null ? [] : userRegDetails.parentOrGaurdianDetails;
            if(key == "add"){
                let parentObj = deepCopyFunction(this.getParentObj()); 
                userRegDetails.parentOrGaurdianDetails.push(parentObj);
            }
            if(key == "remove"){
                userRegDetails.parentOrGaurdianDetails.splice(parentIndex,1);
            }
            if(key == "removeAllParent"){
                userRegDetails.parentOrGaurdianDetails = [];
            }
            this.props.updateInviteMemberInfoAction(iniviteMemberInfo,"iniviteMemberInfo",null,null)
        }catch(ex){
            console.log("Exception occured in addParent"+ex);
        }
    }

    dateConversion = (f, key, subKey, referenceKey) => {
        try{
            let date = moment(f,"DD-MM-YYYY").format("MM-DD-YYYY");
            if(referenceKey == "teamMember"){
                this.onChangeSetMemberInfoValue(date, key, subKey) 
            }else if(referenceKey == "additionalInfo"){
                this.onChangeSetMemberInfoValue(date, key,subKey)
            }
        }catch(ex){
            console.log("Error in dateConversion::"+ex)
        }
    }

    // getUpdatedUserRegDetailObj = (userRegDetails) => {
    //     try{
    //         userRegDetails.dateOfBirth = userRegDetails.dateOfBirth ? moment(userRegDetails.dateOfBirth,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
    //         userRegDetails.accreditationCoachExpiryDate = userRegDetails.accreditationCoachExpiryDate ? moment(userRegDetails.accreditationCoachExpiryDate,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
    //         userRegDetails.childrenCheckExpiryDate = userRegDetails.childrenCheckExpiryDate ? moment(userRegDetails.childrenCheckExpiryDate,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
    //         return userRegDetails;
    //     }catch(ex){
    //         console.log("Error in getUpdatedUserRegDetailObj::"+ex);
    //     }
    // }

    addressSearchValidation = () => {
        try{
            let error = false;
            const { iniviteMemberInfo } = this.props.teamInviteState;
            if(this.state.searchAddressFlag && 
                iniviteMemberInfo.userRegDetails.stateRefId == null){
                error = true;
            }
            if(isArrayNotEmpty(iniviteMemberInfo.userRegDetails.parentOrGaurdianDetails)){
                let parent = iniviteMemberInfo.userRegDetails.parentOrGaurdianDetails.find(x => x.searchAddressFlag ==  true && 
                    x.stateRefId == null);
                if(parent != undefined){
                    error = true;
                }
            }
            return error;
        }catch(ex){
            console.log("Error in addressSearchValidation"+ex);
        }
    }

    saveReviewOrder = (e) => {
        try{
            e.preventDefault();
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let inviteMemberInfoTemp = JSON.parse(JSON.stringify(iniviteMemberInfo));
            //let userRegDetails = this.getUpdatedUserRegDetailObj(inviteMemberInfoTemp.userRegDetails);
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                    if(this.state.currentStep == 0){
                        let addressSearchError = this.addressSearchValidation();
                        if(addressSearchError){
                            message.error(ValidationConstants.addressDetailsIsRequired);
                            return;
                        }
                    }
                    if(this.state.currentStep != 1){
                        let nextStep = this.state.currentStep + 1;
                        if(nextStep == 1){
                            this.state.enabledSteps.push(0,nextStep);
                            this.setState({showMoreInformation: false});
                            setTimeout(() => {
                                this.setParticipantAdditionalInfoStepFormFields();
                            },300);
                        }
                        this.state.completedSteps.push(this.state.currentStep);
                        this.setState({currentStep: nextStep,
                        enabledSteps: this.state.enabledSteps,
                        completedSteps: this.state.completedSteps});
                        this.scrollToTop();
                        this.setState({submitButtonText: AppConstants.reviewOrder});
                    }
                    if(this.state.currentStep == 1){
                        this.setState({buttonSaveOnLoad: true});
                        this.props.saveInviteMemberInfoAction(inviteMemberInfoTemp.userRegDetails);
                    }
                }
            });
        }catch(ex){
            console.log("Error in saveReviewOrder::"+ex);
        }
    }

    headerView = () => {
        try{
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
                                {AppConstants.netballRegistration}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Header>
                </div>
            )
        }catch(ex){
            console.log("Error in headerView::"+ex);
        }
    }

    competitionDetailView = () => {
        const { iniviteMemberInfo } = this.props.teamInviteState;
        let competitionDetails = iniviteMemberInfo?.competitionDetails;
        let userRegDetails = iniviteMemberInfo?.userRegDetails;
        let contactDetails = competitionDetails.replyName || competitionDetails.replyPhone || competitionDetails.replyEmail ?
            competitionDetails.replyName + ' ' + competitionDetails.replyPhone + ' ' + competitionDetails.replyEmail : ''; 
        let organisationPhotos = this.getOrganisationPhotos(competitionDetails.organisationPhotos);
        try{
            return(
                <div className="registration-form-view">
                    <div className="row" style={{marginLeft: "0px",marginRight: "0px"}}>
                        <div className="col-sm-1.5">
                            <img style={{height: "60px",borderRadius: "50%"}} src={competitionDetails.compLogoUrl}/> 
                        </div>
                        <div className="col">
                            <div className="form-heading" style={{paddingBottom: "0px"}}>{competitionDetails.organisationName}</div>
                            <div style={{textAlign: "start",fontWeight: "600"}}>{competitionDetails.stateOrgName} - {competitionDetails.competitionName}</div>
                            <div style={{display: "flex",marginTop: "15px",alignItems: "center"}}>
                                <img className="icon-size-25" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> 
                                <div style={{fontWeight: "600"}}>{competitionDetails.registrationOpenDate} - {competitionDetails.registrationCloseDate}</div>
                                <img className="icon-size-25" style={{marginRight: "5px",marginLeft: "25px"}} src={AppImages.teamLoadDefualtGrey}/> 
                                <div style={{fontWeight: "600"}}>{userRegDetails.resgistererDetails.teamName}</div>
                            </div>
                        </div>
                    </div>
                    {this.state.showMoreInformation ? 
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-sm-12 col-md-4">
                                <InputWithHead heading={AppConstants.divisions}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionDetails.divisionName ? 
                                    competitionDetails.divisionName : 
                                    AppConstants.noInformationProvided}
                                </div>
                                <InputWithHead heading={AppConstants.organisationName}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionDetails.organisationName ? 
                                    competitionDetails.organisationName : 
                                    AppConstants.noInformationProvided}
                                </div>
                                <InputWithHead heading={AppConstants.training}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionDetails.training ? 
                                    competitionDetails.training : 
                                    AppConstants.noInformationProvided}
                                </div>
                                <InputWithHead heading={AppConstants.specialNotes}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionDetails.specialNote ? 
                                    competitionDetails.specialNote : 
                                    AppConstants.noInformationProvided}
                                </div>                                    
                                <InputWithHead heading={AppConstants.venue}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>
                                    {competitionDetails.venues == null || competitionDetails.venues.length == 0 ? AppConstants.noInformationProvided :
                                        <span>
                                            {(competitionDetails.venues || []).map((v, vIndex) =>(
                                                <span>
                                                    <span>{v.venueName}</span>
                                                    <span>{competitionDetails.venues.length != (vIndex + 1) ? ', ': ''}</span>
                                                </span>
                                            ))}
                                        </span>
                                    }
                                </div> 
                                <InputWithHead heading={AppConstants.contactDetails}/>
                                <div  className="inter-medium-font" style={{fontSize: "13px"}}>{contactDetails ? contactDetails : 
                                    AppConstants.noInformationProvided}
                                </div> 
                                <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                                onClick={() => {this.setState({showMoreInformation: false})}}>{AppConstants.hide}</div>
                            </div>
                            <div className="col-sm-12 col-md-8">
                                <Carousel autoplay
                                    style={{marginTop: "16px",
                                    height: "160px",
                                    borderRadius: "10px",
                                    display: "flex"}}>
                                    {(organisationPhotos || []).map((photo,photoIndex) => (
                                        <div>
                                            <div style={{display: "flex",justifyContent: "flex-end"}}>
                                                <div>
                                                    <div style={{marginTop: "-21px",fontWeight: "500",fontFamily: "inter-medium",marginBottom: "10px"}}>{photo.photoType1}</div>
                                                    <img style={{height: "158px",margin: "auto",fontWeight: "500"}} src={photo.photoUrl1}/>
                                                </div>
                                                <div style={{marginLeft: "25px"}}>
                                                    <div style={{marginTop: "-21px",fontWeight: "500",fontFamily: "inter-medium",marginBottom: "10px"}}>{photo?.photoType2}</div>
                                                    <img style={{height: "158px",margin: "auto",fontWeight: "500"}} src={photo?.photoUrl2}/>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div> 
                    : 
                        <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                        onClick={() => {this.setState({showMoreInformation: true})}}>{AppConstants.showMoreInformation}</div>
                    }
                </div>
            )
        }catch(ex){
            console.log("Error in competitionDetailView::"+ex);
        }
    }

    yourDetailsAddressView = (getFieldDecorator) => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            const { stateList,countryList } = this.props.commonReducerState;
            return(
                <div>
                    {/* {teamRegistrationObj.selectAddressFlag && (
                        <div>
                            <div className="form-heading" 
                            style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.address}</div>
                            <InputWithHead heading={AppConstants.selectAddress} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsSelectAddress`, {
                                    rules: [{ required: true, message: ValidationConstants.selectAddressRequired}],
                                })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.select}
                                    onChange={(e) => this.onChangeSetTeamValue(e, "addOrRemoveAddressBySelect")}
                                    setFieldsValue={this.getAddress(user)}>
                                    {(this.getSelectAddressDropdown(user) || []).map((item) => (
                                        <Option key={item.userId} value={item.userId}> {this.getAddress(item)}</Option>
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
                    )}  */}
                        
                    {this.state.searchAddressFlag && (
                        <div>
                            {/* {!newUser && (
                                <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                                onClick={() => {
                                    this.onChangeSetParticipantValue(true,"selectAddressFlag");
                                    this.onChangeSetParticipantValue(false,"addNewAddressFlag");
                                }}
                                >{AppConstants.returnToSelectAddress}</div>
                            )} */}
                            <div className="form-heading" 
                            style={{paddingBottom: "0px",marginBottom: "-20px",marginTop: "20px"}}>{AppConstants.findAddress}</div>
                            <div>
                                <Form.Item name="addressSearch">
                                    <PlacesAutocomplete
                                        defaultValue={this.getAddress(userRegDetails)}
                                        heading={AppConstants.addressSearch}
                                        required
                                        error={this.state.searchAddressError}
                                        onBlur={() => { this.setState({searchAddressError: ''})}}
                                        onSetData={(e)=>this.handlePlacesAutocomplete(e,"yourDetails")}
                                    />
                                </Form.Item> 
                                <div className="orange-action-txt" style={{marginTop: "10px"}}
                                onClick={() => {
                                    this.setState({manualEnterAddressFlag: true,searchAddressFlag: false});
                                }}
                                >{AppConstants.enterAddressManually}</div>	 
                            </div> 
                        </div>
                    )}

                    {this.state.manualEnterAddressFlag && (
                        <div>
                            <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                            onClick={() => {
                                this.setState({manualEnterAddressFlag: false,searchAddressFlag: true});
                            }}
                            >{AppConstants.returnToAddressSearch}</div>
                            <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.enterAddress}</div>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsStreet1`, {
                                    rules: [{ required: true, message: ValidationConstants.addressField}],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.addressOne}
                                        placeholder={AppConstants.addressOne}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "street1","userRegDetails")} 
                                        setFieldsValue={userRegDetails.street1}
                                    />
                                )}
                            </Form.Item>
                            <InputWithHead
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "street2","userRegDetails")} 
                                value={userRegDetails.street2}
                            />
                            <InputWithHead heading={AppConstants.suburb} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsSuburb`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                    <InputWithHead
                                        // required={"required-field pt-0 pb-0"}
                                        // heading={AppConstants.suburb}
                                        placeholder={AppConstants.suburb}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "suburb","userRegDetails")} 
                                        setFieldsValue={userRegDetails.suburb}
                                    />
                                )}
                            </Form.Item>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
                                    <Form.Item >
                                        {getFieldDecorator(`yourDetailsStateRefId`, {
                                            rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder={AppConstants.state}
                                                onChange={(e) => this.onChangeSetMemberInfoValue(e, "stateRefId","userRegDetails")}
                                                setFieldsValue={userRegDetails.stateRefId}>
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
                                        {getFieldDecorator(`yourDetailsPostalCode`, {
                                            rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                placeholder={AppConstants.postcode}
                                                maxLength={4}
                                                onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "postalCode","userRegDetails")} 
                                                setFieldsValue={userRegDetails.postalCode}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <InputWithHead heading={AppConstants.country}   required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsCountryRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                                })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.country}
                                    onChange={(e) => this.onChangeSetMemberInfoValue(e, "countryRefId","userRegDetails")}
                                    setFieldsValue={userRegDetails.countryRefId}>
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
            console.log("Error in yourDetailsAddressView::"+ex);
        }
    }

    yourDetailsView = (getFieldDecorator) => {
        try{
            const { genderList } = this.props.commonReducerState;
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            let resgistererDetails = userRegDetails.resgistererDetails;
            return(
                <div className="registration-form-view">
                    <div className="form-heading" 
                    style={{paddingBottom: "0px"}}>{AppConstants.yourDetails}</div>
                    <InputWithHead heading={AppConstants.personRegisteringRole}/>
                    <div 
                    className="inter-medium-font" 
                    style={{fontSize: "13px"}}>
                        {resgistererDetails.personRole ? 
                        resgistererDetails.personRole : 
                        AppConstants.noInformationProvided}
                    </div>
                    <InputWithHead heading={AppConstants.gender} required={"required-field"}/>
                    <Form.Item >
                        {getFieldDecorator(`yourDetailsgenderRefId`, {
                            rules: [{ required: true, message: ValidationConstants.genderField }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={ (e) => this.onChangeSetMemberInfoValue(e.target.value, "genderRefId","userRegDetails")}
                                setFieldsValue={userRegDetails.genderRefId}
                                >
                                {(genderList || []).map((gender, genderIndex) => (
                                    <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                                ))}
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.firstName} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsFirstName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.firstName}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(captializedString(e.target.value), "firstName","userRegDetails")} 
                                        setFieldsValue={userRegDetails.firstName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`yourDetailsFirstName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.middleName}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsMiddleName`, {
                                    rules: [{ required: false }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.middleName}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(captializedString(e.target.value), "middleName","userRegDetails")} 
                                        setFieldsValue={userRegDetails.middleName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`yourDetailsMiddleName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.lastName} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsLastName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.lastName}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(captializedString(e.target.value), "lastName","userRegDetails")} 
                                        setFieldsValue={userRegDetails.lastName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`yourDetailsLastName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.dob}   required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsdateOfBirth`, {
                                    rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
                                })(
                                    <DatePicker
                                        size="large"
                                        placeholder={"dd-mm-yyyy"}
                                        style={{ width: "100%" }}
                                        onChange={(e,f) => this.dateConversion(f, "dateOfBirth","userRegDetails", "teamMember")}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        name={'dateOfBirth'}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.phone} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsMobileNumber`, {
                                    rules: [{ required: true, message: ValidationConstants.contactField }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.phone}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "mobileNumber","userRegDetails")} 
                                        setFieldsValue={userRegDetails.mobileNumber}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6"
                         style={userRegDetails.referParentEmail ? {alignSelf: "center",marginTop: "25px"} : {}}>
                            {!userRegDetails.referParentEmail && (
                                <div>
                                    <InputWithHead heading={AppConstants.email} required={"required-field"}/>
                                    <Form.Item >
                                        {getFieldDecorator(`yourDetailsEmail`, {
                                            rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                                        })(
                                            <InputWithHead
                                                placeholder={AppConstants.email}
                                                onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "email","userRegDetails")} 
                                                setFieldsValue={userRegDetails.email}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            )}
                            {getAge(userRegDetails.dateOfBirth) < 18 && (
                                <Checkbox
                                    className="single-checkbox"
                                    checked={userRegDetails.referParentEmail}
                                    onChange={e => this.onChangeSetMemberInfoValue(e.target.checked, "referParentEmail","userRegDetails")} >
                                    {AppConstants.useParentsEmailAddress}
                                </Checkbox> 
                            )}
                        </div>
                    </div>
                    <div>{this.yourDetailsAddressView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in yourDetailsView::"+ex);
        }
    }

    parentOrGuardianAddressView = (parent, parentIndex,getFieldDecorator) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            return(
                <div>
                    {parent.searchAddressFlag && (
                        <div>
                            <div className="form-heading" 
                            style={{marginTop: "20px",marginBottom: "-20px"}}>{AppConstants.findAddress}</div>
                            <Form.Item name="addressSearch">
                                <PlacesAutocomplete
                                    defaultValue={this.getAddress(parent)}
                                    heading={AppConstants.addressSearch}
                                    required
                                    error={this.state.searchAddressError}
                                    onBlur={() => {
                                        this.setState({
                                            searchAddressError: ''
                                        })
                                    }}
                                    onSetData={(e)=>this.handlePlacesAutocomplete(e,"parent",parentIndex)}
                                />
                            </Form.Item>
                            <div className="orange-action-txt" style={{marginTop: "10px"}}
                            onClick={() => {
                                this.onChangeSetParentValue(true,"manualEnterAddressFlag",parentIndex);
                                this.onChangeSetParentValue(false,"searchAddressFlag",parentIndex);
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
                                this.onChangeSetParentValue(true,"searchAddressFlag",parentIndex);
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
                                    onChange={(e) => this.onChangeSetParentValue( e.target.value, "street1", parentIndex  )} 
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
                            <InputWithHead heading={AppConstants.suburb}   required={"required-field"}/>
                            <Form.Item>
                                {getFieldDecorator(`parentSuburb${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                <InputWithHead
                                    // required={"required-field pt-0 pb-0"}
                                    // heading={AppConstants.suburb}
                                    placeholder={AppConstants.suburb}
                                    onChange={(e) => this.onChangeSetParentValue( e.target.value, "suburb", parentIndex  )} 
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
                                            onChange={(e) => this.onChangeSetParentValue( e.target.value, "postalCode", parentIndex  )} 
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
        const { iniviteMemberInfo } = this.props.teamInviteState;
        let userRegDetails = iniviteMemberInfo?.userRegDetails;
        let parentOrGuardians = userRegDetails.parentOrGaurdianDetails;
        return(
            <div className="registration-form-view">
                <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.parentOrGuardianDetail}</div>

                {(parentOrGuardians || []).map((parent, parentIndex) => {
                    return(
                        <div key={"parent"+parentIndex} className="light-grey-border-box">
                            {(parentOrGuardians.length != 1) && (
                                <div className="orange-action-txt" style={{marginTop: "30px"}}
                                    onClick={() => {this.addParent("remove",parentIndex)}}
                                    >{AppConstants.cancel}
                                </div>
                            )}
                            <div className="form-heading" 
                            style={(parentOrGuardians.length != 1) ? {paddingBottom: "0px",marginTop: "10px"} : {paddingBottom: "0px",marginTop: "30px"}}>
                                {AppConstants.newParentOrGuardian}
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
                                                onChange={(e) => this.onChangeSetParentValue( captializedString(e.target.value), "firstName", parentIndex )} 
                                                setFieldsValue={parent.firstName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    'parentFirstName': captializedString(i.target.value)
                                                })}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentMiddleName${parentIndex}`, {
                                            rules: [{ required: false }],
                                        })(
                                        <InputWithHead 
                                            required={"pt-0 pb-0"}
                                            heading={AppConstants.middleName} 
                                            placeholder={AppConstants.middleName} 
                                            onChange={(e) => this.onChangeSetParentValue( captializedString(e.target.value), "middleName", parentIndex )} 
                                            setFieldsValue={parent.middleName}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                'parentMiddleName': captializedString(i.target.value)
                                            })}
                                        />
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
                                            onChange={(e) => this.onChangeSetParentValue( captializedString(e.target.value), "lastName", parentIndex )} 
                                            setFieldsValue={parent.lastName}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                'parentLastName': captializedString(i.target.value)
                                            })}
                                        />
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
                                            onChange={(e) => this.onChangeSetParentValue( e.target.value, "mobileNumber", parentIndex  )} 
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
                                            onChange={(e) => this.onChangeSetParentValue( e.target.value, "email", parentIndex  )} 
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

    yourDetailsStepView = (getFieldDecorator) => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            return(
                <div>
                    <div>{this.competitionDetailView()}</div>
                    <div>{this.yourDetailsView(getFieldDecorator)}</div>
                    {getAge(userRegDetails.dateOfBirth) < 18 && (
                        <div>{this.parentOrGuardianView(getFieldDecorator)}</div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in yourDetailsStepView::"+ex);
        }
    }

    userView = () => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            return(
                <div className="registration-form-view">
                    <div style={{display: "flex",alignItems:"center"}}>
                        <div className="form-heading" 
                            style={{paddingBottom: "0px"}}>{userRegDetails.firstName} {userRegDetails.middleName} {userRegDetails.lastName}</div>
                        <div className="orange-action-txt" style={{marginLeft: "auto"}}
                            onClick={() => this.onChangeStep(0)}>{AppConstants.edit}</div>
                    </div>
                    <div className="inter-medium-font" style={{fontSize: "13px"}}>
                        {userRegDetails.role}
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in userView::"+ex);
        }
    }

    walkingNetballQuestions = (getFieldDecorator) => {
        try{
            const { iniviteMemberInfo } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            return(
                <div>
                    <InputWithHead required={"pt-0"} heading={AppConstants.haveHeartTrouble}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoHeartTrouble`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value,"heartTrouble","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.heartTrouble}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group> 
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.havePainInHeartOrChest}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoChestPain`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "chestPain","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.chestPain}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>  
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.haveSpellsOfServerDizziness}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoFaintOrSpells`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "faintOrSpells","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.faintOrSpells}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>  
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.hasBloodPressureHigh}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoBloodPressure`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "bloodPressure","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.bloodPressure}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>  
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.hasBoneProblems}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoJointOrBoneProblem`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "jointOrBoneProblem","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.jointOrBoneProblem}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>  
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.whyShouldNotTakePhysicalActivity}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPhysicalActivity`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "physicalActivity","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.physicalActivity}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>  
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.pregnentInLastSixMonths}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPregnant`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "pregnant","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.pregnant}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>    
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.sufferAnyProblems}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoLowerBackProblem`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "lowerBackProblem","walkingNetball")} 
                            setFieldsValue={userRegDetails.walkingNetball.lowerBackProblem}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                </div>
            )
        }catch(ex){
            console.log("Error in walkingNetballQuestions::"+ex);
        }
    }

    additionalInfoView = (getFieldDecorator) => {
        try{
            const { iniviteMemberInfo,inviteMemberRegSettings } = this.props.teamInviteState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            const {  countryList, identifyAsList,disabilityList,favouriteTeamsList,
                firebirdPlayerList,otherSportsList,heardByList,accreditationUmpireList,accreditationCoachList,walkingNetballQuesList,schoolList } = this.props.commonReducerState;
            let yearsOfPlayingList = [{years: '2'},{years: '3'},{years: '4'},{years: '5'},{years: '6'},{years: '7'},{years: '8'},{years: '9'},{years: '10+'}];
            let hasOtherParticipantSports = userRegDetails.otherSportsInfo?.find(x => x == "14");
            let walkingNetballQuesKeys = userRegDetails.walkingNetball && Object.keys(userRegDetails.walkingNetball);
            let hasAnyOneYes = walkingNetballQuesKeys?.find(key => userRegDetails.walkingNetball[key] == 1);
            return(
                <div className="registration-form-view"> 
                    <div className="form-heading">{AppConstants.additionalPersonalInformation}</div>
                    <InputWithHead heading={AppConstants.whichCountryWereBorn} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoCountryRefId`, {
                            rules: [{ required: true, message: ValidationConstants.countryField }],
                        })(
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(e) => this.onChangeSetMemberInfoValue(e,"countryRefId","userRegDetails")}
                            setFieldsValue={userRegDetails.countryRefId}>
                            {countryList.length > 0 && countryList.map((item) => (
                                < Option key={item.id} value={item.id}> {item.description}</Option>
                            ))}
                        </Select>
                         )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.doYouIdentifyAs}/>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value,"identifyRefId","userRegDetails")}
                        value={userRegDetails.identifyRefId ? userRegDetails.identifyRefId : 3}
                        >
                        {(identifyAsList || []).map((identification, identificationIndex) => (
                            <Radio key={identification.id} value={identification.id}>{identification.description}</Radio>
                        ))}
                    </Radio.Group>
                    <InputWithHead heading={AppConstants.anyExistingMedicalCondition} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAnyExistingMedialCondition`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[1] }],
                        })(
                        <TextArea
                            placeholder={AppConstants.existingMedConditions}
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "existingMedicalCondition","userRegDetails")} 
                            setFieldsValue={userRegDetails.existingMedicalCondition}
                            allowClear
                        />
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.anyRedularMedicalConditions} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAnyRedularMedicalConditions`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[2] }],
                        })(
                        <TextArea
                            placeholder={AppConstants.redularMedicalConditions}
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "regularMedication","userRegDetails")} 
                            setFieldsValue={userRegDetails.regularMedication}
                            allowClear
                        />
                        )}
                    </Form.Item>   
                    <InputWithHead heading={AppConstants.injury} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoInjury`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[3] }],
                        })( 
                            <TextArea
                                placeholder={AppConstants.anyInjury}
                                onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "injuryInfo","userRegDetails")} 
                                setFieldsValue={userRegDetails.injuryInfo}
                                allowClear
                            />
                        )}
                    </Form.Item>  
                    {/* <InputWithHead heading={AppConstants.alergy} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAlergies`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[4] }],
                        })( 
                        <TextArea
                            placeholder={AppConstants.anyAlergies}
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "allergyInfo","userRegDetails")} 
                            setFieldsValue={userRegDetails.allergyInfo}
                            allowClear
                        />
                        )}
                    </Form.Item>   */}
                    <InputWithHead heading={AppConstants.haveDisability} required={"required-field"}/> 
                    {/* <Form.Item>
                        {getFieldDecorator(`additionalInfoHaveDisablity`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[5] }],
                        })(  */}
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "isDisability","userRegDetails")} 
                            value={userRegDetails.isDisability ? userRegDetails.isDisability : 0}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        {/* )}
                    </Form.Item>   */}
                    {userRegDetails.isDisability == 1 ? 
                        <div>
                            <InputWithHead heading={AppConstants.disabilityCareNumber}/>
                            <Form.Item>
                                {getFieldDecorator(`additionalInfoDisablityCareNumber`, {
                                    rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[5] }],
                                })( 
                                    <InputWithHead 
                                    placeholder={AppConstants.disabilityCareNumber} 
                                    onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "disabilityCareNumber","userRegDetails")}
                                    setFieldsValue={userRegDetails.disabilityCareNumber}
                                    style={{marginBottom:'15px'}}/>
                                )}
                            </Form.Item>   
                            <InputWithHead heading={AppConstants.typeOfDisability} />
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "disabilityTypeRefId","userRegDetails")} 
                                value={userRegDetails.disabilityTypeRefId ? userRegDetails.disabilityTypeRefId  : 5}>
                                    {(disabilityList || []).map((dis, disIndex) => (
                                    <Radio key={dis.id} value={dis.id}>{dis.description}</Radio>
                                ))}
                            </Radio.Group>
                        </div> 
                        : null
                    }
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <InputWithHead heading={AppConstants.teamYouFollow} required={"required-field"}/>
                            <Form.Item>
                                {getFieldDecorator(`additionalInfoTeamYouFollow`, {
                                    rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                                })(  
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182,paddingBottom: "10px" }}
                                    onChange={(e) => this.onChangeSetMemberInfoValue(e, "favouriteTeamRefId","userRegDetails")}
                                    setFieldsValue={userRegDetails.favouriteTeamRefId}
                                    >  
                                    {(favouriteTeamsList || []).map((fav, index) => (
                                        <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                                    ))}
                                </Select>
                                )}
                            </Form.Item>
                        </div>
                        {userRegDetails.favouriteTeamRefId == 6 && (
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.who_fav_bird} />
                                <Form.Item>
                                    {getFieldDecorator(`additionalInfoFavoriteBird`, {
                                        rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[7] }],
                                    })(
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182,paddingBottom: "10px" }}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e, "favouriteFireBird","userRegDetails")}
                                        setFieldsValue={userRegDetails.favouriteFireBird}
                                        >  
                                        {(firebirdPlayerList || []).map((fire, index) => (
                                            <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                                        ))}
                                    </Select>
                                    )}
                                </Form.Item>
                            </div>
                        )}
                    </div>
                  
                    <InputWithHead heading={AppConstants.playingOtherParticipantSports} />
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPlayingOtherParticipantSports`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[7] }],
                        })(
                        <Select
                            mode="multiple"
                            showArrow
                            style={{ width: "100%",paddingBottom: "10px" }}
                            placeholder={AppConstants.select}
                            onChange={(e) => this.onChangeSetMemberInfoValue(e,"otherSportsInfo","userRegDetails")}
                            setFieldsValue={userRegDetails.otherSportsInfo ? userRegDetails.otherSportsInfo: []}>
                            {otherSportsList.length > 0 && otherSportsList.map((item) => (
                                < Option key={item.id} value={item.id}> {item.description}</Option>
                            ))}
                        </Select>
                        )}
                     </Form.Item> 
                    {hasOtherParticipantSports && (
                        <div style={{marginTop: "20px"}}>
                            <InputWithHead 
                                placeholder={AppConstants.pleaseSpecify} 
                                onChange={(e) => this.onChangeSetMemberInfoValue( e.target.value,"otherSports","userRegDetails")} 
                                value={userRegDetails.otherSports ? userRegDetails.otherSports : null}
                            />
                        </div>
                    )}
                    <InputWithHead heading={AppConstants.hearAbouttheCompition} required={"required-field"}/>
                    {/* <Form.Item>
                        {getFieldDecorator(`additionalInfoHeardAboutTheCompition`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[8] }],
                        })(  */}
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "heardByRefId","userRegDetails")} 
                            value={userRegDetails.heardByRefId ? userRegDetails.heardByRefId : 6}
                            >
                            {(heardByList || []).map((heard, index) => (
                                <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                            ))}
                        </Radio.Group>
                        {/* )}
                    </Form.Item>  */}
                    {(userRegDetails.heardByRefId == null || userRegDetails.heardByRefId == 6) && (
                        <div style={{marginTop: "10px"}}>
                            <InputWithHead 
                            placeholder={AppConstants.other} 
                            onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "heardByOther","userRegDetails")}
                            value={userRegDetails.heardByOther}/>
                        </div>
                    )}

                    {inviteMemberRegSettings.netball_experience == 1 && (
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.firstYearPlayingNetball} />
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "isYearsPlayed","userRegDetails")} 
                                    value={userRegDetails.isYearsPlayed}
                                    >
                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                    <Radio value={0}>{AppConstants.no}</Radio>
                                </Radio.Group>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {userRegDetails.isYearsPlayed == 0 && (
                                    <div>
                                        <InputWithHead heading={AppConstants.yearsOfPlayingNetball} />
                                        <Select
                                            placeholder={AppConstants.yearsOfPlaying}
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182,marginTop: "20px" }}
                                            onChange={(e) => this.onChangeSetMemberInfoValue(e, "yearsPlayed","userRegDetails")}
                                            value={userRegDetails.yearsPlayed ? userRegDetails.yearsPlayed : '2'}
                                            >  
                                            {(yearsOfPlayingList || []).map((item, index) => (
                                                <Option key={item.years} value={item.years}>{item.years}</Option>
                                            ))}
                                        </Select> 
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(getAge(userRegDetails.dateOfBirth) < 18) && (
                        <div>
                            {inviteMemberRegSettings.school_standard == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.schoolYouAttend} />
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182}}
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e, "schoolId","userRegDetails")}
                                        value={userRegDetails.schoolId}>  
                                        {(schoolList || []).map((school, index) => (
                                            <Option key={school.id} value={school.id}>{school.name}</Option>
                                        ))}
                                    </Select> 
                                </div>
                            )}

                            {inviteMemberRegSettings.school_grade == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.yourSchoolGrade} />
                                    <InputWithHead 
                                        // heading={(AppConstants.yourSchoolGrade)} 
                                        placeholder={AppConstants.schoolGrade} 
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value,"schoolGradeInfo","userRegDetails")} 
                                        value={userRegDetails.schoolGradeInfo}
                                    />
                                </div>
                            )}

                            {inviteMemberRegSettings.school_program == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.participatedSchoolProgram}/>
                                    <Radio.Group
                                        className="registration-radio-group"
                                        onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "isParticipatedInSSP","userRegDetails")} 
                                        value={userRegDetails.isParticipatedInSSP}
                                        >
                                        <Radio value={1}>{AppConstants.yes}</Radio>
                                        <Radio value={0}>{AppConstants.no}</Radio>
                                    </Radio.Group>
                                </div>
                            )}
                        </div>
                    )}

                    {(userRegDetails.resgistererDetails.personRoleRefId == 2) && (
                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach}/>
                            <Radio.Group
                                className="registration-radio-group"
                                style={{flexDirection: "column"}}
                                onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value, "accreditationLevelCoachRefId","userRegDetails")} 
                                value={userRegDetails.accreditationLevelCoachRefId}
                                >
                                {(accreditationCoachList || []).map((accreditaiton,accreditationIndex) => (
                                    <Radio style={{marginBottom: "10px"}} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                ))}
                            </Radio.Group>
                            {(userRegDetails.accreditationLevelCoachRefId != 1 && userRegDetails.accreditationLevelCoachRefId != null) && (
                                <DatePicker
                                    size="large"
                                    placeholder={AppConstants.expiryDate}
                                    style={{ width: "100%",marginTop: "20px" }}
                                    onChange={(e,f) => this.dateConversion(f, "accreditationCoachExpiryDate","userRegDetails", "additionalInfo")}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={userRegDetails.accreditationCoachExpiryDate && moment(userRegDetails.accreditationCoachExpiryDate,"MM-DD-YYYY")}
                                />
                            )}
                        </div>
                    )}
                    
                    {(userRegDetails.resgistererDetails.personRoleRefId == 2) && (
                        <div>
                            <InputWithHead heading={AppConstants.workingWithChildrenCheckNumber}/>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead 
                                    placeholder={AppConstants.childrenNumber} 
                                    onChange={(e) => this.onChangeSetMemberInfoValue(e.target.value,"childrenCheckNumber","userRegDetails")} 
                                    value={userRegDetails.childrenCheckNumber}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <DatePicker
                                        size="large"
                                        placeholder={AppConstants.expiryDate}
                                        style={{ width: "100%"}}
                                        onChange={(e,f) => this.onChangeSetMemberInfoValue(f, "childrenCheckExpiryDate","userRegDetails") }
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        value={userRegDetails.childrenCheckExpiryDate && moment(userRegDetails.childrenCheckExpiryDate,"YYYY-MM-DD")}
                                    />
                                </div>
                            </div>
                        </div>  
                    )}

                    {userRegDetails.membershipProductTypeName == "Walking Netball" && (
                        <div>
                            <div className="form-heading" style={{marginTop: "40px",paddingBottom: "20px"}}>{AppConstants.walkingNetball2}</div>
                            {this.walkingNetballQuestions(getFieldDecorator)}
                            {hasAnyOneYes && (
                                <div>
                                    <InputWithHead heading={AppConstants.provideFurtherDetails}/>
                                    <Form.Item>
                                        {getFieldDecorator(`additionalInfoProvideFurtherDetails`, {
                                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                                        })(  
                                        <InputWithHead 
                                            placeholder={AppConstants.walkingNetball2} 
                                            onChange={(e) => this.onChangeSetMemberInfoValue( e.target.value,"walkingNetballInfo","userRegDetails")} 
                                            setFieldsValue={userRegDetails.walkingNetballInfo}
                                        />  
                                        )}
                                    </Form.Item>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in additionalInfoView::"+ex);
        }
    }

    additionalInformationsStepView = (getFieldDecorator) => {
        try{
            return(
                <div>
                    <div>{this.competitionDetailView()}</div>
                    <div>{this.userView()}</div>
                    <div>{this.additionalInfoView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in additionalInformationsStepView::"+ex);
        }
    }

    stepsContentView = (getFieldDecorator) => {
        try{
            return(
                <div>
                   {this.state.currentStep == 0 && 
                        <div>{this.yourDetailsStepView(getFieldDecorator)}</div>
                   } 
                   {this.state.currentStep == 1 && 
                        <div>{this.additionalInformationsStepView(getFieldDecorator)}</div>
                   }
                </div>
            )
        }catch(ex){
            console.log("Error in stepsContentView::"+ex);
        }
    }

    contentView = (getFieldDecorator) => {
        try{
            return(
                <div style={{width: "70%",margin: "auto"}}>
                    <Steps className="registration-steps" current={this.state.currentStep} onChange={this.onChangeStep}>
                        <Step status={this.state.completedSteps.includes(0) && "finish"} title={AppConstants.yourDetails}/>
                        <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && "finish"} title={AppConstants.additionalInformation}/>
                    </Steps>
                    {this.stepsContentView(getFieldDecorator)}
                </div>
            )
        }catch(ex){
            console.log("Error in contentView::"+ex);
        }
    }

    footerView = () => {
        try{
            return(
                <div style={{width: "75%",margin: "auto",paddingBottom: "50px"}}>
                    <Button 
                        htmlType="submit"
                        type="primary"
                        style={{float: "right",color: "white",textTransform: "uppercase"}}
                        className="open-reg-button">{this.state.submitButtonText}
                    </Button>
                </div>
            )
        }catch(ex){
            console.log("Error in footerView::"+ex);
        }    
    }

    render(){
        const { getFieldDecorator } = this.props.form;
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
                        onSubmit={this.saveReviewOrder}
                        noValidate="noValidate">
                        <Content>{this.contentView(getFieldDecorator)}</Content>
                        <Footer>{this.footerView()}</Footer>
                        <Loader visible={this.props.teamInviteState.inviteMemberSaveOnLoad ||
                        this.props.teamInviteState.inviteOnLoad } />
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
        getTeamRegistrationInviteAction,
        genderReferenceAction,
        getCommonRefData,
        countryReferenceAction,
        playerPositionReferenceAction,
        identificationReferenceAction,
        disabilityReferenceAction,
        favouriteTeamReferenceAction,
        firebirdPlayerReferenceAction,
        otherSportsReferenceAction,
        heardByReferenceAction,
        accreditationUmpireReferenceAction,
        accreditationCoachReferenceAction,
        walkingNetballQuesReferenceAction,
        teamInviteRegSettingsAction,
        updateInviteMemberInfoAction,
        saveInviteMemberInfoAction,
        getSchoolListAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamInviteState: state.TeamInviteState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInivteForm));