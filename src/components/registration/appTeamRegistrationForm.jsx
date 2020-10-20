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
import { 
    selectTeamAction,
    updateTeamRegistrationObjectAction,
    updateTeamRegistrationStateVarAction,
    updateRegistrationTeamMemberAction,
    orgteamRegistrationRegSettingsAction,
    saveTeamInfoAction	, 
    updateTeamAdditionalInfoAction,
    getTeamInfoById,
    getExistingTeamInfoById,
    membershipProductTeamRegistrationAction,
    teamRegistrationExpiryCheckAction
} from '../../store/actions/registrationAction/teamRegistrationAction';
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
import { isEmptyArray } from "formik";
import Loader from '../../customComponents/loader';
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import {getOrganisationId,  getCompetitonId, getUserId, getAuthToken, getSourceSystemFlag } from "../../util/sessionStorage";
import history from "../../util/history";
import { captializedString } from "../../util/helpers";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class AppTeamRegistrationForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            getMembershipLoad: false,
            currentStep: 0,
            enabledSteps: [],
            completedSteps: [],
            submitButtonText: AppConstants.signupToCompetition,
            organisationId: null,
            competitionId: null,
            showFindAnotherCompetitionview: false,
            postalCode: null,
            organisations: [],
            competitions: [],
            allCompetitions: [],
            allCompetitionsByOrgId: [],
            competitionsCountPerPage: 6,
            competitionsCurrentPage: 1,
            participantId: null,
            registrationId: null,
            getTeamInfoByIdLoad: false,
            singleCompModalVisible: false,
            existingTeamParticipantId: null,
            onExistingTeamInfoByIdLoad: false,
            onExpiredRegistrationCheckLoad: false,
            showExpiredRegistrationView: false
        }
        this.props.getCommonRefData();
        this.props.countryReferenceAction();
        this.props.genderReferenceAction();
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
            if(getOrganisationId() != null && getCompetitonId() != null){
                this.setState({organisationId: getOrganisationId(),
                competitionId: getCompetitonId()});
            }

            if(isArrayNotEmpty(this.props.teamRegistrationState.membershipProductInfo)){
                this.initialSetting();
            }else{
                this.props.membershipProductTeamRegistrationAction({});
                this.setState({getMembershipLoad: true});
            }  
        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            let teamRegistrationState = this.props.teamRegistrationState;

            if(!teamRegistrationState.onMembershipLoad && this.state.getMembershipLoad){
                this.initialSetting();
                this.setState({getMembershipLoad: false});
            }

            if(teamRegistrationState.hasTeamSelected){
                if(getOrganisationId() == null && getCompetitonId() == null){
                    this.setState({showFindAnotherCompetitionview: true});
                }
                this.props.updateTeamRegistrationStateVarAction(false,"hasTeamSelected");
            }

            if(teamRegistrationState.hasCompetitionSelected){
                let payload = {
                    "organisationUniqueKey": teamRegistrationState.teamRegistrationObj.organisationId,
                    "competitionUniqueKey": teamRegistrationState.teamRegistrationObj.competitionId
                }
                this.props.orgteamRegistrationRegSettingsAction(payload);
                this.setState({showFindAnotherCompetitionview: false});
                this.props.updateTeamRegistrationStateVarAction(false,"hasCompetitionSelected");
            }

            if(!teamRegistrationState.onTeamInfoByIdLoad && this.state.getTeamInfoByIdLoad){
                if(this.state.participantId != null){
                    this.state.completedSteps = [0,1,2];
                    this.state.enabledSteps = [0,1,2];
                    this.setState({getTeamInfoByIdLoad: false,
                        completedSteps: this.state.completedSteps,
                        enabledSteps: this.state.enabledSteps});
                    setTimeout(() => {
                        this.setSelectCompetitionStepFormFields();
                    },300);
                }
            }

            if(!teamRegistrationState.onExistingTeamInfoByIdLoad && this.state.onExistingTeamInfoByIdLoad){
                this.setState({onExistingTeamInfoByIdLoad: false,showFindAnotherCompetitionview: true})
            }

            if(teamRegistrationState.isSavedTeam){
                this.props.updateTeamRegistrationStateVarAction(false,"isSavedTeam");
                if(teamRegistrationState.saveValidationErrorMsg!= null && teamRegistrationState.saveValidationErrorMsg.length > 0){
                    this.setState({singleCompModalVisible: true});
                }else{
                    history.push("/registrationProducts", {
                        registrationId: teamRegistrationState.registrationId,
                        paymentSuccess: false					 
                    })
                }
            }

            if(teamRegistrationState.expiredRegistrationFlag){
                if(getOrganisationId() && getCompetitonId()){
                    let payload = {
                        organisationId: getOrganisationId(),
                        competitionId: getCompetitonId()
                    }
                    this.props.teamRegistrationExpiryCheckAction(payload);
                }
                this.setState({onExpiredRegistrationCheckLoad: true});
                this.props.updateTeamRegistrationStateVarAction(false,"expiredRegistrationFlag"); 
            }

            if(!teamRegistrationState.onExpiredRegistrationCheckLoad && this.state.onExpiredRegistrationCheckLoad){
                this.setState({showFindAnotherCompetitionview: true});
                this.setState({onExpiredRegistrationCheckLoad: false});
                this.setState({showExpiredRegistrationView: true});
            }

            if(teamRegistrationState.divisionsChanged){
                this.props.form.setFieldsValue({
                    [`competitionMembershipProductDivisionId`]: null
                });
                this.props.updateTeamRegistrationStateVarAction(false,"divisionsChanged"); 
            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    initialSetting = () => {
        try{
            let participantId = this.props.location.state ? this.props.location.state.participantId : null;
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            let existingTeamParticipantId = this.props.location.state ? this.props.location.state.existingTeamParticipantId : null;
            this.setState({participantId: participantId,registrationId: registrationId,existingTeamParticipantId: existingTeamParticipantId});

            let teamRegistrationState = this.props.teamRegistrationState;
            if(participantId && registrationId){
                this.props.getTeamInfoById(participantId,'');
                this.setState({getTeamInfoByIdLoad: true})
            }else if(existingTeamParticipantId){
                this.props.getExistingTeamInfoById(existingTeamParticipantId);
                this.setState({onExistingTeamInfoByIdLoad: true})
            }else{
                this.props.selectTeamAction();
            }
            this.setState({organisations: teamRegistrationState.membershipProductInfo});
            this.setAllCompetitions(teamRegistrationState.membershipProductInfo);
        }catch(ex){
            console.log("Error in initialSetting::"+ex);
        }
    }

    goToRegistrationProducts = () =>{
        history.push({pathname: '/registrationProducts', state: {registrationId: this.state.registrationId}})
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

    setSelectCompetitionStepFormFields = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            if(teamRegistrationObj){
                this.props.form.setFieldsValue({
                    [`competitionMembershipProductTypeId`]: teamRegistrationObj.competitionMembershipProductTypeId,
                    [`competitionMembershipProductDivisionId`]: teamRegistrationObj.competitionMembershipProductDivisionId,
                });
            }
        }catch(ex){
            console.log("Error in setSelectCompetitionStepFormFields::"+ex);
        }
    }

    setParticipantDetailStepAddressFormFields = (key) => {
        try{
            const { teamRegistrationObj,userInfo } = this.props.teamRegistrationState;
            if(key == "manualEnterAddressFlag"){
                this.props.form.setFieldsValue({
                    [`yourDetailsStreet1`]: teamRegistrationObj.street1,
                    [`yourDetailsSuburb`]: teamRegistrationObj.suburb,
                    [`yourDetailsStateRefId`]: teamRegistrationObj.stateRefId,
                    [`yourDetailsPostalCode`]: teamRegistrationObj.postalCode,
                    [`yourDetailsCountryRefId`]: teamRegistrationObj.countryRefId
                }); 
            }
        }catch(ex){
            console.log("Error in setParticipantDetailStepAddressFormFields"+ex);
        }
    }

    setParticipantDetailStepFormFields = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            if(teamRegistrationObj){
                this.props.form.setFieldsValue({
                    [`yourDetailsPersonRoleRefId`]: teamRegistrationObj.personRoleRefId,
                    [`yourDetailsgenderRefId`]: teamRegistrationObj.genderRefId,
                    [`yourDetailsFirstName`]: teamRegistrationObj.firstName,
                    [`yourDetailsMiddleName`]: teamRegistrationObj.middleName,
                    [`yourDetailsLastName`]: teamRegistrationObj.lastName,
                    [`yourDetailsdateOfBirth`]: teamRegistrationObj.dateOfBirth && moment(teamRegistrationObj.dateOfBirth, "YYYY-MM-DD"),
                    [`yourDetailsMobileNumber`]: teamRegistrationObj.mobileNumber,
                    [`yourDetailsEmail`]: teamRegistrationObj.email,
                    [`teamName`]: teamRegistrationObj.teamName
                });
                if(teamRegistrationObj.manualEnterAddressFlag){
                    this.setParticipantDetailStepAddressFormFields("manualEnterAddressFlag");
                }
                if(teamRegistrationObj.allowTeamRegistrationTypeRefId == 1){
                    {(teamRegistrationObj.teamMembers || []).map((member,mIndex) =>{
                        this.props.form.setFieldsValue({
                            [`teamMemberGenderRefId${mIndex}`]: member.genderRefId,
                            [`teamMemberFirstName${mIndex}`]: member.firstName,
                            [`teamMemberMiddleName${mIndex}`]: member.middleName,
                            [`teamMemberLastName${mIndex}`]: member.lastName,
                            [`teamMemberDateOfBirth${mIndex}`]: member.dateOfBirth && moment(member.dateOfBirth, "YYYY-MM-DD"),
                            [`teamMemberMobileNumber${mIndex}`]:  member.mobileNumber,
                            [`teamMemberEmail${mIndex}`]:  member.email,
                        });
                    })}
                } 
            }
        }catch(ex){
            console.log("Error in setParticipantDetailStepFormFields::"+ex);
        }
    }

    onChangeStep = (current) => {
        try{
            if(this.state.enabledSteps.includes(current)){
                this.setState({currentStep: current});
                this.scrollToTop();
            }
            if(current == 0){
                this.setState({submitButtonText: AppConstants.signupToCompetition});
                setTimeout(() => {
                    this.setSelectCompetitionStepFormFields();
                },300);
            }else if(current == 1){
                if(this.state.enabledSteps.includes(1)){
                    this.setState({submitButtonText: AppConstants.addPariticipant});
                    setTimeout(() => {
                        this.setParticipantDetailStepFormFields();
                    },300);
                }
            }else{
                if(this.state.enabledSteps.includes(2)){
                    this.setState({submitButtonText: AppConstants.signupToCompetition});
                }
            }
        }catch(ex){
            console.log("Error in onChangeStep::"+ex);
        }
    }

    onChangeSetPostalCode = (postalCode) => {
        try{
            this.setState({postalCode: postalCode});
            setTimeout(() => {
                if(postalCode == ''){
                    this.searchOrganisationByPostalCode();
                } 
            },300);
        }catch(ex){
            console.log("Error in searchOrganisationByPostalCode"+ex);
        }
    }

    searchOrganisationByPostalCode = () => {
        try{
            let { membershipProductInfo } = this.props.teamRegistrationState;
            if(this.state.postalCode){
                let filteredOrganisation = deepCopyFunction(membershipProductInfo).filter(x => x.postalCode?.toLowerCase().indexOf(this.state.postalCode) > -1);
                this.setState({organisations: filteredOrganisation});
                this.setAllCompetitions(filteredOrganisation);
            }else{
                this.setState({organisations: membershipProductInfo});
                this.setAllCompetitions(membershipProductInfo);
            }
        }catch(ex){
            console.log("Error in searchOrganisationByPostalCode"+ex);
        }
    }

    setAllCompetitions = (membershipProductInfo) => {
        try{
            let allCompetitionsTemp = [];
            for(let org of membershipProductInfo){
                allCompetitionsTemp.push.apply(allCompetitionsTemp,org.competitions);
            }
            this.setState({allCompetitions: allCompetitionsTemp});
            this.setState({competitions: allCompetitionsTemp.slice(0,this.state.competitionsCountPerPage)});
        }catch(ex){
            console.log("Error in setAllCompetitions"+ex);
        }
    }

    onChangeSetOrganisation = (organisationId) => {
        try{
            let { membershipProductInfo } = this.props.teamRegistrationState;
            this.setState({organisationId : organisationId,
            competitionsCurrentPage: 1});
            let organisationInfo = deepCopyFunction(membershipProductInfo).find(x => x.organisationUniqueKey == organisationId);
            if(organisationInfo){
                this.setState({allCompetitionsByOrgId: organisationInfo.competitions,
                    competitions: organisationInfo.competitions.slice(0,this.state.competitionsCountPerPage)});
            }
        }catch(ex){
            console.log("Error in onChangeSetOrganisation"+ex);
        }
    }

    paginationItems = (current, type, originalElement) => {
        if (type === 'prev') {
          return <a style={{color: "var(--app-color)",fontWeight: "700"}}>Prev</a>;
        }
        if (type === 'next') {
          return <a style={{color: "var(--app-color)",fontWeight: "700"}}>Next</a>;
        }
        return originalElement;
    }

    pagingCompetitions = (current) => {
        let startIndex = (current - 1 ) * this.state.competitionsCountPerPage;
        let endIndex = current * this.state.competitionsCountPerPage;
        this.setState({competitionsCurrentPage: current});
        if(this.state.organisationId == null){
            this.setState({competitions: this.state.allCompetitions.slice(startIndex,endIndex)});
        }else{
            this.setState({competitions: this.state.allCompetitionsByOrgId.slice(startIndex,endIndex)});
        }
    }

    addAnotherCompetition = (competitionInfo) => {
        try{
            this.setState({competitionId: competitionInfo.competitionUniqueKey});
            let { membershipProductInfo } = this.props.teamRegistrationState;
            let organisationInfo = deepCopyFunction(membershipProductInfo).find(x => x.organisationUniqueKey == competitionInfo.organisationUniqueKey);
            if(organisationInfo){
                let organisation = {
                    organisationInfo : organisationInfo,
                    competitionInfo: competitionInfo
                }
                this.props.updateTeamRegistrationObjectAction(organisation,"competitionDetail");
            } 
        }catch(ex){
            console.log("Error in addAnotherCompetition::"+ex);
        }
    }

    onChangeSetTeamValue = (value,key) => {
        try{
            this.props.updateTeamRegistrationObjectAction(value,key);
        }catch(ex){
            console.log("Error in onChangeSetTeamValue::"+ex);
        }
    }

    scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    onChangeTeamMemberValue = (value,key,index,subIndex) => {
        this.props.updateRegistrationTeamMemberAction(value,key,index,subIndex)
    }

    onChangeSetAdditionalInfo = (value,key,subKey) => {
        this.props.updateTeamAdditionalInfoAction(key,value,subKey);
    }

    getFilteredTeamRegisrationObj = (teamRegistrationObj) => {
        try{
            teamRegistrationObj["existingUserId"] = getUserId() ? Number(getUserId()) : null;
            teamRegistrationObj.registeringYourself = 4;
            teamRegistrationObj.participantId = this.state.participantId != null ? this.state.participantId : null;
            teamRegistrationObj.registrationId = this.state.registrationId != null ? this.state.registrationId : null; 
            let memArr = [];
            (teamRegistrationObj.competitionInfo.membershipProducts).map((i, ind) => {
                if(i.allowTeamRegistrationTypeRefId != null && teamRegistrationObj.competitionMembershipProductId == 
                    i.competitionMembershipProductId){
                    let obj = {
                        competitionMembershipProductTypeId: i.competitionMembershipProductTypeId,
                        name: i.shortName,
                        isPlayer: i.isPlayer
                    }
                    memArr.push(obj);
                }
            });
            teamRegistrationObj.membershipProducts = memArr;
            teamRegistrationObj.organisationInfo = null;
            teamRegistrationObj.competitionInfo = null;
            return teamRegistrationObj;
        }catch(ex){
            console.log("Error in getFilteredTeamRegisrationObj::"+ex);
        }
    }

    handlePlacesAutocomplete = (addressData,key) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const address = addressData;
            const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address.state).id : null;
            const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address.country).id : null;
            if(address){
                if(key == "yourDetails"){
                    this.onChangeSetTeamValue(address.addressOne, "street1");
                    this.onChangeSetTeamValue(address.suburb, "suburb");
                    this.onChangeSetTeamValue(address.postcode, "postalCode");
                    this.onChangeSetTeamValue(countryRefId, "countryRefId");
                    this.onChangeSetTeamValue(stateRefId, "stateRefId");
                }
            }
        }catch(ex){
            console.log("Error in handlePlacesAutoComplete::"+ex);
        }
    }

    getOrganisationPhotos = (organisationPhotos) => {
        try{
            let organisationPhotosTemp = [];
            for(let i=0;i<organisationPhotos.length;i++){
                if((i % 2) == 0){
                    let obj = {
                        photoUrl1: organisationPhotos[i].photoUrl,
                        photoType1: organisationPhotos[i].photoType,
                        photoUrl2: organisationPhotos[i+1]?.photoUrl,
                        photoType2: organisationPhotos[i+1]?.photoType,
                    }
                    organisationPhotosTemp.push(obj);
                }
            }
            return organisationPhotosTemp;
        }catch(ex){
            console.log("Error in getOrganisationPhotos::"+ex);
        }
    }

    checkIsPlayer = (membershipProductTypes) => {
        try{
            let exist = false;
            let isPlayer = membershipProductTypes.find(x => x.isPlayer == 1 && x.isChecked == true);
            if(isPlayer){
                exist = true;
            }
            return exist;
        }catch(ex){
            console.log("Error in checkIsPlayer::"+ex);
        }
    }

    saveRegistrationForm = (e) => {
        try{
            e.preventDefault();
            const { teamRegistrationObj } = this.props.teamRegistrationState; 
            let saveTeamRegistrationObj = JSON.parse(JSON.stringify(teamRegistrationObj));
            let filteredTeamRegistrationObj = this.getFilteredTeamRegisrationObj(saveTeamRegistrationObj)
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                    if(this.state.currentStep == 0){
                        // let productAdded = this.productValidation();
                        // if(!productAdded){
                        //     message.error(ValidationConstants.fillMembershipProductInformation);
                        //     return;
                        // } 
                    }
                    if(this.state.currentStep != 2){
                        let nextStep = this.state.currentStep + 1;
                        this.scrollToTop();
                        if(nextStep == 1){
                            this.state.enabledSteps.push(0,nextStep);
                            setTimeout(() => {
                                this.setParticipantDetailStepFormFields();
                            },300);
                        }else{
                            this.state.enabledSteps.push(nextStep);
                        }
                        this.state.completedSteps.push(this.state.currentStep);
                        this.setState({currentStep: nextStep,
                        enabledSteps: this.state.enabledSteps,
                        completedSteps: this.state.completedSteps});
                        this.setState({submitButtonText: nextStep == 1 ? 
                            AppConstants.addPariticipant : AppConstants.signupToCompetition});
                    }

                    if(this.state.currentStep == 2){
                        let formData = new FormData();
                        formData.append("participantDetail", JSON.stringify(filteredTeamRegistrationObj));
                        this.props.saveTeamInfoAction(formData);
                    }
                }
            });
        }catch(ex){
            console.log("Error in saveTeamRegistratonForm::"+ex);
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
                                {AppConstants.signupToCompetition}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Header>
                </div>
            )
        }catch(ex){
            console.log("Error in headerView::"+ex);
        }
    }

    findAnotherCompetitionView = () => {
        try{
            let { teamRegistrationObj,membershipProductInfo,expiredRegistration } = this.props.teamRegistrationState;
            let organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == this.state.organisationId);
            return(
                <div className="registration-form-view">
                    <div style={{display: "flex",alignItems: "center" }}>
                        <div className="form-heading">{AppConstants.findACompetition}</div>
                        {(teamRegistrationObj?.competitionInfo || expiredRegistration != null) && (
                            <div className="orange-action-txt" 
                            style={{marginLeft: "auto",paddingBottom: "7.5px"}}
                            onClick={() => {
                                if(expiredRegistration != null){
                                    this.setState({showExpiredRegistrationView: true,showFindAnotherCompetitionview: true,organisationId:null});
                                }else{
                                    this.setState({showFindAnotherCompetitionview: false,organisationId: null})
                                }
                            }}>{AppConstants.cancel}</div>
                        )}
                    </div>
    
                    <div className="light-grey-border-box">
                        <div className="row">
                            <div className="col">
                                <InputWithHead 
                                    allowClear 
                                    heading={AppConstants.postCode} 
                                    value={this.state.postalCode}
                                    placeholder={AppConstants.postCode} 
                                    onChange={(e) => this.onChangeSetPostalCode(e.target.value)} 
                                />
                            </div>
                            <div className="col" style={{alignSelf: "center"}}>
                                <Button 
                                    type="primary"
                                    style={{color: "white",textTransform: "uppercase",
                                    marginTop: "45px",float: "right",
                                    paddingLeft: "50px",paddingRight: "50px"}}
                                    onClick={() => this.searchOrganisationByPostalCode()}
                                    className="open-reg-button">{AppConstants.search}</Button>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.organisationName}/>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            onChange={(e) => this.onChangeSetOrganisation(e)}
                            style={{ width: "100%", paddingRight: 1 }}>
                            {(this.state.organisations || []).map((item) => (
                                < Option key={item.organisationUniqueKey} value={item.organisationUniqueKey}> {item.organisationName}</Option>
                            ))}
                        </Select>
                        {organisationInfo && (
                            <div style={{display: "flex",alignItems: "center",marginTop: "20px"}}>
                                <img className="profile-img" src={organisationInfo.organisationLogoUrl}/>
                                <div style={{width: "170px",marginLeft: "20px"}}>{organisationInfo.street1} {organisationInfo.street2} {organisationInfo.suburb} {organisationInfo.state} {organisationInfo.postalCode}</div>
                                {organisationInfo.mobileNumber && (
                                    <div style={{marginLeft: "20px"}}><img className="icon-size-20" style={{marginRight: "15px"}} src={AppImages.callAnswer}/>{organisationInfo.mobileNumber}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="row" style={{marginTop: "30px"}}>
                        {(this.state.competitions || []).map((competition,competitionIndex) => (
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
                                        <img style={{height: "149px",borderRadius: "10px 10px 0px 0px",overflow: "hidden"}} src={competition.heroImageUrl}/>
                                    </div>
                                    <div className="form-heading" style={{marginTop: "20px",textAlign: "start"}}>{competition.competitionName}</div>
                                    {this.state.organisationId == null && (
                                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{competition.organisationName}</div>
                                    )}
                                    <div style={{fontWeight: "600"}}><img className="icon-size-15" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> {competition.registrationOpenDate} - {competition.registrationCloseDate}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {this.state.competitions?.length > 0 ? 
                        (
                            <Pagination 
                            onChange={(e) => this.pagingCompetitions(e)}
                            pageSize={this.state.competitionsCountPerPage}
                            current={this.state.competitionsCurrentPage}
                            style={{textAlign: "center"}} 
                            total={this.state.organisationId == null ? this.state.allCompetitions.length : this.state.allCompetitionsByOrgId.length} 
                            itemRender={this.paginationItems}/>
                        ) : 
                        (
                            <div className="form-heading" style={{fontSize: "20px",justifyContent: "center"}}>{AppConstants.noCompetitionsForOrganisations}</div>
                        )
                    }
                </div>
            )
        }catch(ex){
            console.log("Error in findAnotherCompetitionView::"+ex);
        }
    }

    competitionDetailView = (teamRegistrationObj,getFieldDecorator) => {
        try{
            let competitionInfo = teamRegistrationObj.competitionInfo;
            let contactDetails = competitionInfo.replyName || competitionInfo.replyPhone || competitionInfo.replyEmail ?
                            competitionInfo.replyName + ' ' + competitionInfo.replyPhone + ' ' + competitionInfo.replyEmail : ''; 
            let organisationPhotos = this.getOrganisationPhotos(teamRegistrationObj.organisationInfo.organisationPhotos);
            return(
                <div className="registration-form-view">
                    {competitionInfo.heroImageUrl && (
                        <div className="map-style">
                            <img style={{height: "249px",borderRadius: "10px 10px 0px 0px",width: "100%"}} src={competitionInfo.heroImageUrl}/>
                        </div>
                    )}
                    <div>
                        <div className="row" style={competitionInfo.heroImageUrl ? {marginTop: "30px",marginLeft: "0px",marginRight: "0px"} : {marginLeft: "0px",marginRight: "0px"}}>
                            <div className="col-sm-1.5">
                                <img className="profile-img" src={competitionInfo.compLogoUrl}/> 
                            </div>
                            <div className="col">
                                <div className="form-heading" style={{paddingBottom: "0px"}}>{competitionInfo.organisationName}</div>
                                <div style={{display: "flex",flexWrap: "wrap"}}>
                                    <div style={{textAlign: "start",fontWeight: "600",marginTop: "-5px"}}>{competitionInfo.stateOrgName} - {competitionInfo.competitionName}</div>
                                    <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "8px"}}
                                    onClick={() => this.setState({showFindAnotherCompetitionview: true})}>{AppConstants.findAnotherCompetition}</div>
                                </div>
                                <div style={{fontWeight: "600",marginTop: "-5px"}}><img className="icon-size-15" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> {competitionInfo.registrationOpenDate} - {competitionInfo.registrationCloseDate}</div>
                            </div>
                        </div>
                        <div className="light-grey-border-box">
                            <InputWithHead heading={AppConstants.registeringAs}/>
                            <Form.Item>
                                {getFieldDecorator(`competitionMembershipProductTypeId`, {
                                    rules: [{ required: true, message: ValidationConstants.membershipProductIsRequired}],
                                })(
                                    <Select
                                        setFieldsValue={teamRegistrationObj.competitionMembershipProductTypeId}
                                        style={{ width: "100%", paddingRight: 1 }}
                                        onChange={(e) => this.onChangeSetTeamValue(e, "competitionMembershipProductTypeId")}
                                        >
                                        {(teamRegistrationObj.membershipProductList || []).map((product, productIndex) => (
                                            <Option key={product.competitionMembershipProductTypeId} 
                                            value={product.competitionMembershipProductTypeId}>
                                                    {product.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            {isArrayNotEmpty(teamRegistrationObj.divisions) && (
                                <div>
                                    <InputWithHead heading={AppConstants.registrationDivisions}/>
                                    <Form.Item>
                                        {getFieldDecorator(`competitionMembershipProductDivisionId`, {
                                            rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired}],
                                        })(
                                            <Select
                                                setFieldsValue={teamRegistrationObj.competitionMembershipProductDivisionId}
                                                style={{ width: "100%", paddingRight: 1 }}
                                                onChange={(e) => this.onChangeSetTeamValue(e, "competitionMembershipProductDivisionId")}
                                                >
                                                {(teamRegistrationObj.divisions || []).map((division, divisionIndex) => (
                                                    <Option key={division.competitionMembershipProductDivisionId} 
                                                    value={division.competitionMembershipProductDivisionId}>{division.divisionName}</Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                            )}
    
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
    
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-sm-12 col-md-4">
                                <InputWithHead heading={AppConstants.training}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionInfo.training ? 
                                    competitionInfo.training : 
                                    AppConstants.noInformationProvided}
                                </div>
                                <InputWithHead heading={AppConstants.specialNotes}/>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionInfo.specialNote ? 
                                    competitionInfo.specialNote : 
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
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in competitionDetailView::"+ex);
        }
    }

    expiredRegistrationView = () => {
        try{
            const { expiredRegistration } = this.props.teamRegistrationState;
            return(
                <div className="registration-form-view">
                    {expiredRegistration.heroImageUrl && (
                        <div className="map-style">
                            <img style={{height: "249px",borderRadius: "10px 10px 0px 0px"}} src={expiredRegistration.heroImageUrl}/>
                        </div>
                    )}
                    <div className="row" style={expiredRegistration.heroImageUrl ? 
                    {marginTop: "30px",marginLeft: "0px",marginRight: "0px"} : 
                    {marginLeft: "0px",marginRight: "0px"}}>
                        <div className="col-sm-1.5">
                            <img style={{height: "60px",width: "60px",borderRadius: "50%"}} 
                            src={expiredRegistration.compLogoUrl ? expiredRegistration.compLogoUrl : AppImages.defaultUser}/> 
                        </div>
                        <div className="col">
                            <div className="form-heading" style={{paddingBottom: "0px"}}>{expiredRegistration.organisationName}</div>
                            <div style={{fontWeight: "600",color: "black"}}>{expiredRegistration.stateOrgName} - {expiredRegistration.competitionName}</div>
                            <div style={{fontWeight: "600",marginTop: "5px"}}><img className="icon-size-15" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> {expiredRegistration.registrationOpenDate} - {expiredRegistration.registrationCloseDate}</div>
                        </div>
                    </div>
                    <div className="light-grey-border-box" style={{textAlign: "center"}}>
                        <div className="form-heading" 
                        style={{marginTop: "30px",justifyContent:"center",marginBottom: "5px"}}>{expiredRegistration.validateMessage}</div>
                        <Button 
                        type="primary"
                        style={{color: "white",textTransform: "uppercase"}}
                        onClick={() => {
                            this.setState({showFindAnotherCompetitionview: true,showExpiredRegistrationView: false});
                            this.setState({organisationId: null});
                        }}
                        className="open-reg-button">{AppConstants.findAnotherCompetition}</Button>
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in expiredRegistrationView::"+ex);
        }
    }

    selectCompetitionStepView = (getFieldDecorator) => {
        const { teamRegistrationObj,expiredRegistration } = this.props.teamRegistrationState;
        try{
            return(
                <div>
                    {this.state.showFindAnotherCompetitionview ?
                        <div>
                            {this.state.showExpiredRegistrationView ?
                                <div>{this.expiredRegistrationView()}</div>
                            : 
                                <div>{this.findAnotherCompetitionView()}</div>
                            } 
                        </div> 
                    : 
                        <div>
                            {teamRegistrationObj?.competitionInfo && (
                                <div>{this.competitionDetailView(teamRegistrationObj,getFieldDecorator)}</div> 
                            )}
                        </div>
                    }
                </div>
            )
        }catch(ex){
            console.log("Error in selectCompetitonStepView::"+ex);
        }
    }

    addedCompetitionView = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let competitionInfo = teamRegistrationObj.competitionInfo;
            return(
                <div className="registration-form-view">
                    <div className="row" style={{marginLeft: "0px",marginRight: "0px"}}>
                        <div className="col-sm-1.5">
                            <img style={{height: "60px",borderRadius: "50%"}} src={competitionInfo.compLogoUrl}/> 
                        </div>
                        <div className="col">
                            <div className="form-heading" style={{paddingBottom: "0px"}}>{competitionInfo.organisationName}</div>
                            <div style={{display: "flex",flexWrap: "wrap"}}>
                                <div style={{textAlign: "start",fontWeight: "600"}}>{competitionInfo.stateOrgName} - {competitionInfo.competitionName}</div>
                                <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "8px"}}
                                onClick={() => this.setState({currentStep: 1})}>{AppConstants.edit}</div>
                            </div>
                            <div style={{fontWeight: "600",display: "flex",alignItems: "center"}}>
                                <img className="icon-size-15" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> 
                                {competitionInfo.registrationOpenDate} - {competitionInfo.registrationCloseDate} 
                            </div>
                        </div>
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in addedCompetitionView::"+ex);
        }
    }

    yourDetailsAddressView = (getFieldDecorator) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
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
                        
                    {teamRegistrationObj.addNewAddressFlag && (
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
                                        defaultValue={this.getAddress(teamRegistrationObj)}
                                        heading={AppConstants.addressSearch}
                                        required
                                        error={this.state.searchAddressError}
                                        onBlur={() => { this.setState({searchAddressError: ''})}}
                                        onSetData={(e)=>this.handlePlacesAutocomplete(e,"yourDetails")}
                                    />
                                </Form.Item> 
                                <div className="orange-action-txt" style={{marginTop: "10px"}}
                                onClick={() => {
                                    this.onChangeSetTeamValue(true,"manualEnterAddressFlag");
                                    this.onChangeSetTeamValue(false,"addNewAddressFlag");
                                }}
                                >{AppConstants.enterAddressManually}</div>	 
                            </div> 
                        </div>
                    )}

                    {teamRegistrationObj.manualEnterAddressFlag && (
                        <div>
                            <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
                            onClick={() => {
                                this.onChangeSetTeamValue(false,"manualEnterAddressFlag");
                                this.onChangeSetTeamValue(true,"addNewAddressFlag");
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
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "street1")} 
                                        setFieldsValue={teamRegistrationObj.street1}
                                    />
                                )}
                            </Form.Item>
                            <InputWithHead
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                onChange={(e) => this.onChangeSetTeamValue(e.target.value, "street2")} 
                                value={teamRegistrationObj.street2}
                            />
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsSuburb`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.suburb}
                                        placeholder={AppConstants.suburb}
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "suburb")} 
                                        setFieldsValue={teamRegistrationObj.suburb}
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
                                                onChange={(e) => this.onChangeSetTeamValue(e, "stateRefId")}
                                                setFieldsValue={teamRegistrationObj.stateRefId}>
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
                                                onChange={(e) => this.onChangeSetTeamValue(e.target.value, "postalCode")} 
                                                setFieldsValue={teamRegistrationObj.postalCode}
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
                                    onChange={(e) => this.onChangeSetTeamValue(e, "countryRefId")}
                                    setFieldsValue={teamRegistrationObj.countryRefId}>
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
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            console.log(teamRegistrationObj);
            return(
                <div className="registration-form-view">
                    <div className="form-heading" 
                    style={{paddingBottom: "0px"}}>{AppConstants.yourDetails}</div>
                    <InputWithHead heading={AppConstants.personRegisteringRole} required={"required-field"}/>
                    <Form.Item >
                        {getFieldDecorator(`yourDetailsPersonRoleRefId`, {
                                rules: [{ required: true, message: ValidationConstants.personRegRoleRequired }],
                            })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetTeamValue(e.target.value,"personRoleRefId")}
                                setFieldsValue={teamRegistrationObj.personRoleRefId}>
                                <Radio value={1}>{AppConstants.admin}</Radio>
                                <Radio value={2}>{AppConstants.coach}</Radio>
                                <Radio value={3}>{AppConstants.manager}</Radio>
                                <Radio value={4}>{AppConstants.player}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.gender} required={"required-field"}/>
                    <Form.Item >
                        {getFieldDecorator(`yourDetailsgenderRefId`, {
                            rules: [{ required: true, message: ValidationConstants.genderField }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={ (e) => this.onChangeSetTeamValue(e.target.value, "genderRefId")}
                                setFieldsValue={teamRegistrationObj.genderRefId}
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
                                        onChange={(e) => this.onChangeSetTeamValue(captializedString(e.target.value), "firstName")} 
                                        setFieldsValue={teamRegistrationObj.firstName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            'yourDetailsFirstName': captializedString(i.target.value)
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
                                        onChange={(e) => this.onChangeSetTeamValue(captializedString(e.target.value), "middleName")} 
                                        setFieldsValue={teamRegistrationObj.middleName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            'yourDetailsMiddleName': captializedString(i.target.value)
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
                                        onChange={(e) => this.onChangeSetTeamValue(captializedString(e.target.value), "lastName")} 
                                        setFieldsValue={teamRegistrationObj.lastName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            'yourDetailsLastName': captializedString(i.target.value)
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
                                        onChange={e => this.onChangeSetTeamValue(e, "dateOfBirth") }
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
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "mobileNumber")} 
                                        setFieldsValue={teamRegistrationObj.mobileNumber}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.email} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsEmail`, {
                                    rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.email}
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "email")} 
                                        setFieldsValue={teamRegistrationObj.email}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    <div>{this.yourDetailsAddressView(getFieldDecorator)}</div>
                    {(teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && 
                    teamRegistrationObj.personRoleRefId != 4) && (
                        <div>
                            <InputWithHead heading={AppConstants.areYouRegisteringAsPlayer} required={"required-field"}></InputWithHead>
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={(e) => this.onChangeSetTeamValue(e.target.value, "registeringAsAPlayer")}
                                value={teamRegistrationObj.registeringAsAPlayer}>
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={2}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        </div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in yourDetailsView::"+ex);        }
    }

    teamMemberView = (teamMember,teamMemberIndex,getFieldDecorator) => {
        const { genderList } = this.props.commonReducerState;
        try{
            return(
                <div className="light-grey-border-box">
                    <div style={{display: "flex",marginTop: "30px"}}>
                        <div className="form-heading">{AppConstants.teamMember}</div>
                        {teamMemberIndex != 0 && (
                            <img 
                            onClick={() => {this.onChangeSetTeamValue(teamMemberIndex,"removeTeamMember")}}
                            style={{marginLeft: "auto",width: "25px"}} 
                            src={AppImages.removeIcon}/>
                        )}
                    </div>
                    <InputWithHead heading={AppConstants.type} required={"required-field"}/>
                    {(teamMember.membershipProductTypes || []).map((product, productIndex) => (
                        <Checkbox 
                        checked={product.isChecked}
                        key={product.competitionMembershipProductTypeId}
                        onChange={(e) => this.onChangeTeamMemberValue(e.target.checked,"membershipProductTypes",teamMemberIndex,productIndex)}>
                            {product.productTypeName}
                        </Checkbox>
                    ))}
                    <InputWithHead heading={AppConstants.gender} required={"required-field"}/>
                    <Form.Item >
                        {getFieldDecorator(`teamMemberGenderRefId${teamMemberIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.genderField }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={ (e) => this.onChangeTeamMemberValue(e.target.value, "genderRefId", teamMemberIndex)}
                                setFieldsValue={teamMember.genderRefId}
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
                                {getFieldDecorator(`teamMemberFirstName${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.firstName}
                                        onChange={(e) => this.onChangeTeamMemberValue(captializedString(e.target.value), "firstName", teamMemberIndex)} 
                                        setFieldsValue={teamMember.firstName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`teamMemberFirstName${teamMemberIndex}`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>   
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.middleName}/>
                            <Form.Item >
                                {getFieldDecorator(`teamMemberMiddleName${teamMemberIndex}`, {
                                    rules: [{ required: false }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.middleName}
                                        onChange={(e) => this.onChangeTeamMemberValue(captializedString(e.target.value), "middleName", teamMemberIndex)} 
                                        setFieldsValue={teamMember.middleName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`teamMemberMiddleName${teamMemberIndex}`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.lastName} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`teamMemberLastName${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.lastName}
                                        onChange={(e) => this.onChangeTeamMemberValue(captializedString(e.target.value), "lastName", teamMemberIndex)} 
                                        setFieldsValue={teamMember.lastName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`teamMemberLastName${teamMemberIndex}`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.dob}   required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`teamMemberDateOfBirth${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
                                })(
                                    <DatePicker
                                        size="large"
                                        placeholder={"dd-mm-yyyy"}
                                        style={{ width: "100%" }}
                                        onChange={e => this.onChangeTeamMemberValue(e, "dateOfBirth", teamMemberIndex) }
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
                                {getFieldDecorator(`teamMemberMobileNumber${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.contactField }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.phone}
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "mobileNumber", teamMemberIndex)} 
                                        setFieldsValue={teamMember.mobileNumber}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.email} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`teamMemberEmail${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.email}
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "email", teamMemberIndex)} 
                                        setFieldsValue={teamMember.email}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    {this.checkIsPlayer(teamMember.membershipProductTypes) && (
                        <Checkbox
                            className="single-checkbox"
                            checked={teamMember.payingFor == 1 ? true : false}
                            onChange={e => this.onChangeTeamMemberValue(e.target.checked ? 1 : 0, "payingFor", teamMemberIndex)} >
                            {AppConstants.payingForMember}
                        </Checkbox>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in teamMemberView::"+ex);
        }
    }

    teamDetailsView = (getFieldDecorator) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            return(
                <div className="registration-form-view">
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <div className="form-heading">{AppConstants.teamDetails}</div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (
                                <Button 
                                    style={{float: "right",textTransform: "uppercase"}}
                                    className="white-button">{AppConstants.importTeam}
                                </Button>
                            )}
                        </div>
                    </div>
                    <InputWithHead heading={AppConstants.teamName} required={"required-field"}/>
                    <Form.Item >
                        {getFieldDecorator(`teamName`, {
                            rules: [{ required: true, message: ValidationConstants.teamName }],
                        })(
                            <InputWithHead
                                placeholder={AppConstants.teamName}
                                onChange={(e) => this.onChangeSetTeamValue(e.target.value, "teamName")} 
                                setFieldsValue={teamRegistrationObj.teamName}
                            />
                        )}
                    </Form.Item>
                    
                    {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (teamRegistrationObj.teamMembers || []).map((teamMember,teamMemberIndex) => (
                        <div>{this.teamMemberView(teamMember,teamMemberIndex,getFieldDecorator)}</div>
                    ))}
                    {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (
                         <div className="orange-action-txt" 
                         style={{marginTop: "10px"}}
                         onClick={() => {
                             this.onChangeSetTeamValue(null,"addTeamMember");
                         }}>+ {AppConstants.addTeamMember}</div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in teamDetailsView::"+ex);
        }
    }

    participantDetailsStepView = (getFieldDecorator) => {
        const { teamRegistrationObj } = this.props.teamRegistrationState; 
        try{
            return(
                <div>
                    <div>{this.addedCompetitionView()}</div>
                    <div>{this.yourDetailsView(getFieldDecorator)}</div>
                    <div>{this.teamDetailsView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in participantDetailsStepView::"+ex);
        }
    }

    walkingNetballQuestions = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            return(
                <div>
                    <InputWithHead
                    required={"pt-0"}
                    heading={AppConstants.haveHeartTrouble}/>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"haveHeartTrouble","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.haveHeartTrouble}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.havePainInHeartOrChest}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "havePainInHeartOrChest","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.havePainInHeartOrChest}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.haveSpellsOfServerDizziness}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "haveSpellsOfServerDizziness","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.haveSpellsOfServerDizziness}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.hasBloodPressureHigh}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "hasBloodPressureHigh","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.hasBloodPressureHigh}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.hasBoneProblems}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "hasBoneProblems","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.hasBoneProblems}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.whyShouldNotTakePhysicalActivity}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "whyShouldNotTakePhysicalActivity","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.whyShouldNotTakePhysicalActivity}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.pregnentInLastSixMonths}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "pregnentInLastSixMonths","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.pregnentInLastSixMonths}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    <div className="input-style">{AppConstants.sufferAnyProblems}</div>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "sufferAnyProblems","walkingNetball")} 
                        value={teamRegistrationObj.additionalInfo.walkingNetball.sufferAnyProblems}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>
            )
        }catch(ex){
            console.log("Error in walkingNetballQuestions::"+ex);
        }
    }

    teamInfoView = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            return(
                <div className="registration-form-view">
                    <div style={{display: "flex",alignItems:"center"}}>
                        <div className="defualt-team-logo-style">
                            <img src={AppImages.teamLoadDefualtWhite}/>
                        </div> 
                        <div style={{marginLeft: "20px"}}>
                            <div className="form-heading"  style={{paddingBottom: "0px"}}>{teamRegistrationObj.teamName}</div>
                            <div className="inter-medium-font" 
                            style={{fontSize: "13px"}}>
                                {AppConstants.team},{teamRegistrationObj.teamMembers.length} {AppConstants.members}
                            </div>
                        </div>
                        <div className="orange-action-txt" style={{marginLeft: "auto"}}
                            onClick={() => this.onChangeStep(1)}>{AppConstants.selectAnother}</div>
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in teamInfoView::"+ex);
        }
    }

    additionalPersonalInfoView = (getFieldDecorator) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            const { countryList, identifyAsList,disabilityList,favouriteTeamsList,
                firebirdPlayerList,otherSportsList,heardByList,accreditationUmpireList,accreditationCoachList,walkingNetballQuesList } = this.props.commonReducerState;
            let yearsOfPlayingList = [{years: '2'},{years: '3'},{years: '4'},{years: '5'},{years: '6'},{years: '7'},{years: '8'},{years: '9'},{years: '10+'}];
            let hasOtherParticipantSports = teamRegistrationObj.additionalInfo.otherSportsInfo.find(x => x == "14");
            let walkingNetballQuesKeys = Object.keys(teamRegistrationObj.additionalInfo.walkingNetball);
            let hasAnyOneYes = walkingNetballQuesKeys.find(key => teamRegistrationObj.additionalInfo.walkingNetball[key] == 1);
            return(
                <div className="registration-form-view"> 
                    <div className="form-heading">{AppConstants.additionalPersonalInformation}</div>
                    <div className="input-style">{AppConstants.whichCountryWereBorn}</div>
                    {/* <InputWithHead heading={AppConstants.whichCountryWereBorn}/> */}
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e,"countryRefId")}
                        value={teamRegistrationObj.additionalInfo.countryRefId}>
                        {countryList.length > 0 && countryList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))}
                    </Select>
                    <div className="input-style">{AppConstants.doYouIdentifyAs}</div>
                    {/* <InputWithHead heading={AppConstants.doYouIdentifyAs}/> */}
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"identifyRefId")}
                        value={teamRegistrationObj.additionalInfo.identifyRefId}
                        >
                        {(identifyAsList || []).map((identification, identificationIndex) => (
                            <Radio key={identification.id} value={identification.id}>{identification.description}</Radio>
                        ))}
                    </Radio.Group>
                    <div className="input-style">{AppConstants.anyExistingMedicalCondition}</div>
                    {/* <InputWithHead heading={AppConstants.anyExistingMedicalCondition}/> */}
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "existingMedicalCondition")} 
                        value={teamRegistrationObj.additionalInfo.existingMedicalCondition}
                        allowClear
                    />
                    <div className="input-style">{AppConstants.anyRedularMedicalConditions}</div>
                    {/* <InputWithHead heading={AppConstants.anyRedularMedicalConditions}  /> */}
                    <TextArea
                        placeholder={AppConstants.redularMedicalConditions}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "regularMedication")} 
                        value={teamRegistrationObj.additionalInfo.regularMedication}
                        allowClear
                    />
                    <div className="input-style">{AppConstants.injury}</div>
                    {/* <InputWithHead heading={AppConstants.injury}/> */}
                    <TextArea
                        placeholder={AppConstants.anyInjury}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "injuryInfo")} 
                        value={teamRegistrationObj.additionalInfo.injuryInfo}
                        allowClear
                    />
                    <div className="input-style">{AppConstants.alergy}</div>
                    {/* <InputWithHead heading={AppConstants.alergy}/> */}
                    <TextArea
                        placeholder={AppConstants.anyAlergies}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "allergyInfo")} 
                        value={teamRegistrationObj.additionalInfo.allergyInfo}
                        allowClear
                    />
                    <div className="input-style">{AppConstants.haveDisability}</div>
                    {/* <InputWithHead heading={AppConstants.haveDisability} /> */}
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isDisability")} 
                        value={teamRegistrationObj.additionalInfo.isDisability}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                    {teamRegistrationObj.additionalInfo.isDisability == 1 ? 
                        <div>
                            <div className="input-style">{AppConstants.disabilityCareNumber}</div>
                            <InputWithHead 
                            // heading={AppConstants.disabilityCareNumber} 
                            placeholder={AppConstants.disabilityCareNumber} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityCareNumber")}
                            value={teamRegistrationObj.additionalInfo.disabilityCareNumber}/>
                            <div className="input-style">{AppConstants.typeOfDisability}</div>
                            {/* <InputWithHead heading={AppConstants.typeOfDisability} /> */}
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityTypeRefId")} 
                                value={teamRegistrationObj.additionalInfo.disabilityTypeRefId}>
                                    {(disabilityList || []).map((dis, disIndex) => (
                                    <Radio key={dis.id} value={dis.id}>{dis.description}</Radio>
                                ))}
                            </Radio.Group>
                        </div> 
                        : null
                    }
                    <div className="row">
                        <div className="col-md-6 col-sm-12">
                            <div className="input-style">{AppConstants.teamYouFollow}</div>
                            {/* <InputWithHead heading={AppConstants.teamYouFollow}/> */}
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteTeamRefId")}
                                value={teamRegistrationObj.additionalInfo.favouriteTeamRefId}
                                >  
                                {(favouriteTeamsList || []).map((fav, index) => (
                                    <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                                ))}
                            </Select>
                        </div>
                        {teamRegistrationObj.additionalInfo.favouriteTeamRefId == 6 && (
                            <div className="col-md-6 col-sm-12">
                                <div className="input-style">{AppConstants.who_fav_bird}</div>                            <div className="input-style">{AppConstants.teamYouFollow}</div>
                                {/* <InputWithHead heading={AppConstants.who_fav_bird} /> */}
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteFireBird")}
                                    value={teamRegistrationObj.additionalInfo.favouriteFireBird}
                                    >  
                                    {(firebirdPlayerList || []).map((fire, index) => (
                                        <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="input-style">{AppConstants.playingOtherParticipantSports}</div>
                    {/* <InputWithHead heading={AppConstants.playingOtherParticipantSports} /> */}
                    <Select
                        mode="multiple"
                        showArrow
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e,"otherSportsInfo")}
                        defaultValue={teamRegistrationObj.additionalInfo.otherSportsInfo}>
                        {otherSportsList.length > 0 && otherSportsList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))}
                    </Select>
                    {hasOtherParticipantSports && (
                        <div style={{marginTop: "20px"}}>
                            <InputWithHead 
                                placeholder={AppConstants.pleaseSpecify} 
                                onChange={(e) => this.onChangeSetAdditionalInfo( e.target.value,"otherSports")} 
                                value={teamRegistrationObj.additionalInfo.otherSports}
                            />
                        </div>
                    )}
                    <div className="input-style">{AppConstants.hearAbouttheCompition}</div>
                    {/* <InputWithHead heading={AppConstants.hearAbouttheCompition} /> */}
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByRefId")} 
                        value={teamRegistrationObj.additionalInfo.heardByRefId}
                        >
                        {(heardByList || []).map((heard, index) => (
                            <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                        ))}
                    </Radio.Group>
                    {teamRegistrationObj.additionalInfo.heardByRefId == 6 && (
                        <div style={{marginTop: "10px"}}>
                            <InputWithHead 
                            placeholder={AppConstants.other} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByOther")}
                            value={teamRegistrationObj.additionalInfo.heardByOther}/>
                        </div>
                    )}

                    {teamRegistrationObj.regSetting.netball_experience == 1 && (
                        <div>
                            <div className="input-style">{AppConstants.firstYearPlayingNetball}</div>
                            {/* <InputWithHead heading={AppConstants.firstYearPlayingNetball} /> */}
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isYearsPlayed")} 
                                value={teamRegistrationObj.additionalInfo.isYearsPlayed}
                                >
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                            {teamRegistrationObj.additionalInfo.isYearsPlayed == 0 && (
                                <div>
                                     <div class="input-style">{AppConstants.yearsOfPlayingNetball}</div>
                                    <Select
                                        placeholder={AppConstants.yearsOfPlaying}
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182}}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "yearsPlayed")}
                                        value={teamRegistrationObj.additionalInfo.yearsPlayed ? teamRegistrationObj.additionalInfo.yearsPlayed : '2'}
                                        >  
                                        {(yearsOfPlayingList || []).map((item, index) => (
                                            <Option key={item.years} value={item.years}>{item.years}</Option>
                                        ))}
                                    </Select> 
                                </div>
                            )}
                        </div>
                    )}

                    {(getAge(teamRegistrationObj.dateOfBirth) < 18) && (
                        <div>
                            {teamRegistrationObj.regSetting.school_standard == 1 && (
                                <div>
                                  <div className="input-style">{AppConstants.schoolYouAttend}</div>
                                  {/* <InputWithHead heading={AppConstants.schoolYouAttend} /> */}
                                  <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182}}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "schoolId")}
                                        value={teamRegistrationObj.additionalInfo.schoolId}
                                        >  
                                        {/* {(yearsOfPlayingList || []).map((years, index) => (
                                            <Option key={years} value={years}>{years}</Option>
                                        ))} */}
                                    </Select> 
                                </div>
                            )}

                            {teamRegistrationObj.regSetting.school_grade == 1 && (
                                <div>
                                  <div className="input-style">{AppConstants.yourSchoolGrade}</div>
                                  <InputWithHead 
                                    // heading={(AppConstants.yourSchoolGrade)} 
                                     placeholder={AppConstants.schoolGrade} 
                                     onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"schoolGradeInfo")} 
                                         value={teamRegistrationObj.additionalInfo.schoolGradeInfo}
                                     />

                                </div>
                              
                            )}

                            {teamRegistrationObj.regSetting.school_program == 1 && (
                                <div>
                                    <div className="input-style">{AppConstants.participatedSchoolProgram}</div>
                                    {/* <InputWithHead heading={AppConstants.participatedSchoolProgram}/> */}
                                    <Radio.Group
                                        className="registration-radio-group"
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isParticipatedInSSP")} 
                                        value={teamRegistrationObj.additionalInfo.isParticipatedInSSP}
                                        >
                                        <Radio value={1}>{AppConstants.yes}</Radio>
                                        <Radio value={0}>{AppConstants.no}</Radio>
                                    </Radio.Group>
                                </div>
                            )}
                        </div>
                    )}

                    {(teamRegistrationObj.personRoleRefId == 2) && (
                        <div>
                            <div className="input-style">{AppConstants.nationalAccreditationLevelCoach}</div>
                            {/* <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach}/> */}
                            <Radio.Group
                                className="registration-radio-group"
                                style={{flexDirection: "column"}}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "accreditationLevelCoachRefId")} 
                                value={teamRegistrationObj.additionalInfo.accreditationLevelCoachRefId}
                                >
                                {(accreditationCoachList || []).map((accreditaiton,accreditationIndex) => (
                                    <Radio style={{marginBottom: "10px"}} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                ))}
                            </Radio.Group>
                            {(teamRegistrationObj.additionalInfo.accreditationLevelCoachRefId != null) && (
                                <DatePicker
                                    size="large"
                                    placeholder={AppConstants.checkExpiryDate}
                                    style={{ width: "100%",marginTop: "20px" }}
                                    onChange={e => this.onChangeSetAdditionalInfo(e, "accreditationCoachExpiryDate") }
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate && moment(teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate,"YYYY-MM-DD")}
                                />
                            )}
                        </div>
                    )}
                    
                    {(teamRegistrationObj.personRoleRefId == 2) && (
                        <div>
                            <div className="input-style">{AppConstants.workingWithChildrenCheckNumber}</div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <InputWithHead 
                                    placeholder={AppConstants.childrenNumber} 
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"childrenCheckNumber")} 
                                    value={teamRegistrationObj.additionalInfo.childrenCheckNumber}
                                    />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <DatePicker
                                        size="large"
                                        placeholder={AppConstants.expiryDate}
                                        style={{ width: "100%"}}
                                        onChange={e => this.onChangeSetAdditionalInfo(e, "childrenCheckExpiryDate") }
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        value={teamRegistrationObj.additionalInfo.childrenCheckExpiryDate && moment(teamRegistrationObj.additionalInfo.childrenCheckExpiryDate,"YYYY-MM-DD")}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {teamRegistrationObj.walkingNetballFlag == 1 && (
                        <div>
                            <div className="form-heading" style={{marginTop: "40px",paddingBottom: "20px"}}>{AppConstants.walkingNetball2}</div>
                            {this.walkingNetballQuestions()}
                            {hasAnyOneYes && (
                                <div>
                                    <div className="input-style">{AppConstants.provideFurtherDetails}</div>
                                    <InputWithHead 
                                        placeholder={AppConstants.walkingNetball2} 
                                        onChange={(e) => this.onChangeSetAdditionalInfo( e.target.value,"walkingNetballInfo")} 
                                        value={teamRegistrationObj.additionalInfo.walkingNetballInfo}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in additionalPersonalInfoView"+ex);
        }
    }

    additionalInfoStepView = (getFieldDecorator) => {
        try{
            return(
                <div>
                    <div>{this.addedCompetitionView()}</div>
                    <div>{this.teamInfoView()}</div>
                    <div>{this.additionalPersonalInfoView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in additionalInfoStepView::"+ex);
        }
    } 

    stepsContentView = (getFieldDecorator) => {
        try{
            return(
                <div>
                   {this.state.currentStep == 0 && 
                        <div>{this.selectCompetitionStepView(getFieldDecorator)}</div>
                   } 
                   {this.state.currentStep == 1 && 
                        <div>{this.participantDetailsStepView(getFieldDecorator)}</div>
                   }
                   {this.state.currentStep == 2 && 
                        <div>{this.additionalInfoStepView(getFieldDecorator)}</div>
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
                        <Step status={this.state.completedSteps.includes(0) && "finish"} title={AppConstants.selectCompetition}/>
                        <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && "finish"} title={AppConstants.participantDetails}/>
                        <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && this.state.completedSteps.includes(2) &&"finish"} title={AppConstants.additionalInformation}/>
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
                    {!this.state.showFindAnotherCompetitionview && (
                        <Button 
                            htmlType="submit"
                            type="primary"
                            style={{float: "right",color: "white",textTransform: "uppercase"}}
                            className="open-reg-button">{this.state.submitButtonText}
                        </Button>
                    )}
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
                        onSubmit={this.saveRegistrationForm}
                        noValidate="noValidate">
                        <Content>{this.contentView(getFieldDecorator)}</Content>
                        <Footer>{this.footerView()}</Footer>
                        <Loader visible={this.props.teamRegistrationState.onTeamInfoByIdLoad || 
                        this.props.teamRegistrationState.onMembershipLoad} />
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
        selectTeamAction,
        updateTeamRegistrationObjectAction,
        updateTeamRegistrationStateVarAction,
        genderReferenceAction,
        getCommonRefData,
        countryReferenceAction,
        updateRegistrationTeamMemberAction,
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
        orgteamRegistrationRegSettingsAction,
        saveTeamInfoAction	,
        updateTeamAdditionalInfoAction,
        getTeamInfoById,
        getExistingTeamInfoById,
        membershipProductTeamRegistrationAction,
        teamRegistrationExpiryCheckAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamRegistrationState: state.TeamRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppTeamRegistrationForm));