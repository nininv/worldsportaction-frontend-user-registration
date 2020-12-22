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
    Carousel,
    Spin
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
    teamRegistrationExpiryCheckAction,
    getSeasonalAndCasualFees,
    teamNameValidationAction
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
    walkingNetballQuesReferenceAction ,
    getSchoolListAction,
    validateRegistrationCapAction
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
import { NavLink } from "react-router-dom";
import CSVReader from 'react-csv-reader';
import { nearByOrganisations } from "../../util/geocode";
import commonReducerState from "../../store/reducer/commonReducer/commonReducer";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const parseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header =>
      header
        .toLowerCase()
        .replace(/\W/g, '_'),
    complete: function(results, file) {
        console.log("Parsing complete:", results, file);
    }
}

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
            // allCompetitions: [],
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
            showExpiredRegistrationView: false,
            buttonSubmitted: false,
            validateRegistrationCapBySubmit: false,
            registrationCapModalVisible: false,
            validateRegistrationCapOnLoad: false
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

    setUser = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let userInfoList = this.props.userRegistrationstate.userInfo;
            let userId = getUserId();
            let user = userInfoList.find((x) => x.id == userId);
            if(user){
                teamRegistrationObj.firstName = user.firstName;
                teamRegistrationObj.lastName = user.lastName;
                teamRegistrationObj.middleName = user.middleName;
                teamRegistrationObj.mobileNumber = user.mobileNumber;
                teamRegistrationObj.email = user.email;
                teamRegistrationObj.dateOfBirth = user.dateOfBirth ? moment(user.dateOfBirth).format("MM-DD-YYYY") : null;
                teamRegistrationObj.genderRefId = user.genderRefId;
                teamRegistrationObj.street1 = user.street1;
                teamRegistrationObj.street2 = user.street2;
                teamRegistrationObj.postalCode = user.postalCode;
                teamRegistrationObj.suburb = user.suburb;
                teamRegistrationObj.stateRefId = user.stateRefId;
                teamRegistrationObj.countryRefId = user.countryRefId;
                teamRegistrationObj.addNewAddressFlag = true;
                teamRegistrationObj.selectAddressFlag = false;
                teamRegistrationObj.manualEnterAddressFlag = false;
                teamRegistrationObj.emergencyContactNumber = user.emergencyContactNumber;
                teamRegistrationObj.emergencyFirstName = user.emergencyFirstName;
                teamRegistrationObj.emergencyLastName = user.emergencyLastName;
                teamRegistrationObj.additionalInfo.countryRefId = user.additionalInfo.countryRefId;
                teamRegistrationObj.additionalInfo.existingMedicalCondition = user.additionalInfo.existingMedicalCondition;
                teamRegistrationObj.additionalInfo.regularMedication = user.additionalInfo.regularMedication;
                teamRegistrationObj.additionalInfo.injuryInfo = user.additionalInfo.injuryInfo;
                teamRegistrationObj.additionalInfo.allergyInfo = user.additionalInfo.allergyInfo;
                teamRegistrationObj.additionalInfo.favouriteTeamRefId = user.additionalInfo.favouriteTeamRefId;
                teamRegistrationObj.additionalInfo.identifyRefId = user.additionalInfo.identifyRefId;
                teamRegistrationObj.additionalInfo.otherSportsInfo = user.additionalInfo.otherSportsInfo ? user.additionalInfo.otherSportsInfo : [];
                teamRegistrationObj.additionalInfo.isDisability = user.additionalInfo.isDisability;
                teamRegistrationObj.additionalInfo.disabilityCareNumber = user.additionalInfo.disabilityCareNumber;
                teamRegistrationObj.additionalInfo.heardByRefId = user.additionalInfo.heardByRefId;
                teamRegistrationObj.additionalInfo.isYearsPlayed = user.additionalInfo.isYearsPlayed;
                console.log("team",teamRegistrationObj)
                this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj,"teamRegistrationObj")
            }
        }catch(ex){
            console.log("Error in setUser::"+ex)
        }
    }

    componentDidUpdate(nextProps){
        try{
            let teamRegistrationState = this.props.teamRegistrationState;

            if(!teamRegistrationState.onMembershipLoad && this.state.getMembershipLoad){
                this.initialSetting();
                this.setState({getMembershipLoad: false});
            }

            if(teamRegistrationState.hasTeamSelected){
                if(getOrganisationId() == null && getCompetitonId() == null){
                    this.setState({showFindAnotherCompetitionview: true});
                }else{
                    let membershipProductInfo = teamRegistrationState.membershipProductInfo;
                    let organisatinInfoTemp = membershipProductInfo.find(x => x.organisationUniqueKey == getOrganisationId());
                    if(organisatinInfoTemp){
                        let competitionInfoTemp = organisatinInfoTemp.competitions.find(x => x.competitionUniqueKey == getCompetitonId());
                        if(competitionInfoTemp == undefined){
                            this.setState({showFindAnotherCompetitionview: true});
                        }
                    }else{
                        this.setState({showFindAnotherCompetitionview: true});
                    }
                }
                this.setUser()
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
                setTimeout(() => {
                    this.setSelectCompetitionStepFormFields();
                },300);
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
                this.setState({onExistingTeamInfoByIdLoad: false})
                if(getOrganisationId() == null && getCompetitonId() == null){
                    this.setState({showFindAnotherCompetitionview: true});
                }else{
                    let membershipProductInfo = teamRegistrationState.membershipProductInfo;
                    let organisatinInfoTemp = membershipProductInfo.find(x => x.organisationUniqueKey == getOrganisationId());
                    if(organisatinInfoTemp){
                        let competitionInfoTemp = organisatinInfoTemp.competitions.find(x => x.competitionUniqueKey == getCompetitonId());
                        if(competitionInfoTemp == undefined){
                            this.setState({showFindAnotherCompetitionview: true});
                        }
                    }else{
                        this.setState({showFindAnotherCompetitionview: true});
                    }
                }
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

            if(teamRegistrationState.enableSeasonalAndCasualService){
                this.props.getSeasonalAndCasualFees(teamRegistrationState.seasionalAndCasualFeesInputObj);
                this.props.updateTeamRegistrationStateVarAction(false,"enableSeasonalAndCasualService");
            }

            if(teamRegistrationState.teamCompetitionNotExist == true){
                this.setState({organisationId: null,competitionId: null});
                this.props.updateTeamRegistrationStateVarAction(false,"teamCompetitionNotExist");
            }

            //Below 2 conditions for Registration cap validation
            if(teamRegistrationState.enableValidateRegistrationCapService == true){
                this.props.validateRegistrationCapAction(teamRegistrationState.registrationCapValidateInputObj);
                this.setState({validateRegistrationCapOnLoad: true})
                this.props.updateTeamRegistrationStateVarAction(false,"enableValidateRegistrationCapService")
            }

            if(this.props.commonReducerState.onLoad == false && this.state.validateRegistrationCapOnLoad == true){
                if(this.props.commonReducerState.status == 4){
                    this.setState({registrationCapModalVisible: true})
                }else{
                    if(this.state.validateRegistrationCapBySubmit == true){
                        this.stepNavigation();
                        this.setState({validateRegistrationCapBySubmit: false});
                    }
                }
                this.setState({validateRegistrationCapOnLoad: false})
            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    isExistTeamRegCompetition = () => {
        try{
            const { membershipProductInfo } = this.props.teamRegistrationState;
            if(getOrganisationId() && getCompetitonId()){
                let organisation = membershipProductInfo.find(x => x.organisationUniqueKey == getOrganisationId());
                if(organisation){
                    let competition = organisation.competitions.find(x => x.competitionUniqueKey == getCompetitonId());
                    if(competition == undefined){
                        this.setState({organisationId: null,competitionId: null})
                    }
                }else{
                    this.setState({organisationId: null,competitionId: null})
                }
            }
        }catch(ex){
            console.log("Error in isExistTeamRegCompetition::"+ex);
        }
    }


    initialSetting = () => {
        try{
            let participantId = this.props.location.state ? this.props.location.state.participantId : null;
            let registrationId = this.props.location.state ? this.props.location.state.registrationId : null;
            let existingTeamParticipantId = this.props.location.state ? this.props.location.state.existingTeamParticipantId : null;
            this.setState({participantId: participantId,registrationId: registrationId,existingTeamParticipantId: existingTeamParticipantId});
            // console.log("registrationid",registrationId)
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
            this.isExistTeamRegCompetition();
            // this.setAllCompetitions(teamRegistrationState.membershipProductInfo);
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

    setYourDetailsParentAddressFormFields = (parent, pIndex) => {
        try {
            this.props.form.setFieldsValue({
                [`parentStreet1${pIndex}`]: parent.street1,
                [`parentSuburb${pIndex}`]: parent.suburb,
                [`parentStateRefId${pIndex}`]: parent.stateRefId,
                [`parentCountryRefId${pIndex}`]: parent.countryRefId,
                [`parentPostalCode${pIndex}`]: parent.postalCode,
            });
        } catch (ex) {
            console.log("Error in setParticipantDetailStepParentAddressFormFields" + ex);
        }
    }

    // setTeamMemberAddressFormFields = (key,member,mIndex) => {
    //     try{
    //         if(key == "manualEnterAddressFlag"){
    //             this.props.form.setFieldsValue({
    //                 [`teamMemberStreet1${mIndex}`]: member.street1,
    //                 [`teamMemberSuburb${mIndex}`]: member.suburb,
    //                 [`teamMemberStateRefId${mIndex}`]: member.stateRefId,
    //                 [`teamMemberPostalCode${mIndex}`]: member.postalCode,
    //                 [`teamMemberCountryRefId${mIndex}`]: member.countryRefId
    //             }); 
    //         }
    //     }catch(ex){
    //         console.log("Error in setTeamMemberAddressFormFields::"+ex)
    //     }
    // }

    // setTeamMemberParentAddressFormFields = (mIndex,mParent,mParentIndex) => {
    //     try{
    //         this.props.form.setFieldsValue({
    //             [`teamMemberParentStreet1${mIndex}${mParentIndex}`]: mParent.street1,
    //             [`teamMemberParentSuburb${mIndex}${mParentIndex}`]: mParent.suburb,
    //             [`teamMemberParentStateRefId${mIndex}${mParentIndex}`]: mParent.stateRefId,
    //             [`teamMemberParentCountryRefId${mIndex}${mParentIndex}`]: mParent.countryRefId,
    //             [`teamMemberParentPostalCode${mIndex}${mParentIndex}`]: mParent.postalCode,
    //         });
    //     }catch(ex){
    //         console.log("Error in setTeamMemberParentAddressFormFields"+ex);
    //     }
    // }

    setParticipantDetailStepFormFields = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            console.log("date",teamRegistrationObj.dateOfBirth);
            if(teamRegistrationObj){
                this.props.form.setFieldsValue({
                    [`yourDetailsPersonRoleRefId`]: teamRegistrationObj.personRoleRefId,
                    [`yourDetailsgenderRefId`]: teamRegistrationObj.genderRefId,
                    [`yourDetailsFirstName`]: teamRegistrationObj.firstName,
                    [`yourDetailsMiddleName`]: teamRegistrationObj.middleName,
                    [`yourDetailsLastName`]: teamRegistrationObj.lastName,
                    [`yourDetailsdateOfBirth`]: teamRegistrationObj.dateOfBirth ? moment(teamRegistrationObj.dateOfBirth, "MM-DD-YYYY") : null,
                    [`yourDetailsMobileNumber`]: teamRegistrationObj.mobileNumber,
                    [`yourDetailsEmail`]: teamRegistrationObj.email,
                    [`teamName`]: teamRegistrationObj.teamName,
                    [`emergencyFirstName`]: teamRegistrationObj.emergencyFirstName,
                    [`emergencyLastName`]: teamRegistrationObj.emergencyLastName,
                    [`emergencyContactNumber`]: teamRegistrationObj.emergencyContactNumber,
                });
                if(teamRegistrationObj.manualEnterAddressFlag){
                    this.setParticipantDetailStepAddressFormFields("manualEnterAddressFlag");
                }
                {(teamRegistrationObj.parentOrGuardian || []).map((parent,parentIndex) => {
                    this.props.form.setFieldsValue({
                        [`parentFirstName${parentIndex}`]: parent.firstName,
                        [`parentMiddleName${parentIndex}`]: parent.middleName,
                        [`parentLastName${parentIndex}`]: parent.lastName,
                        [`parentDateOfBirth${parentIndex}`]: parent.dateOfBirth ? moment(parent.dateOfBirth, "MM-DD-YYYY") : null,
                        [`parentMobileNumber${parentIndex}`]:  parent.mobileNumber,
                        [`parentEmail${parentIndex}`]:  parent.email,
                    });
                    this.setYourDetailsParentAddressFormFields(parent,parentIndex)
                })}
                if(teamRegistrationObj.allowTeamRegistrationTypeRefId == 1){
                    {(teamRegistrationObj.teamMembers || []).map((member,mIndex) =>{
                        this.props.form.setFieldsValue({
                            [`teamMemberGenderRefId${mIndex}`]: member.genderRefId,
                            [`teamMemberFirstName${mIndex}`]: member.firstName,
                            [`teamMemberMiddleName${mIndex}`]: member.middleName,
                            [`teamMemberLastName${mIndex}`]: member.lastName,
                            [`teamMemberDateOfBirth${mIndex}`]: member.dateOfBirth ? moment(member.dateOfBirth, "MM-DD-YYYY") : null,
                            [`teamMemberMobileNumber${mIndex}`]:  member.mobileNumber,
                            [`teamMemberEmail${mIndex}`]:  member.email,
                            [`teamMemberEmergencyFirstName${mIndex}`]:  member.emergencyFirstName,
                            [`teamMemberEmergencyLastName${mIndex}`]:  member.emergencyLastName,
                            [`teamMemberEmergencyContactNumber${mIndex}`]:  member.emergencyContactNumber,
                        });
                        // if(member.manualEnterAddressFlag){
                        //     this.setTeamMemberAddressFormFields("manualEnterAddressFlag",member,mIndex);
                        // }
                        {(member.parentOrGuardian || []).map((mParent,mParentIndex) => {
                            this.props.form.setFieldsValue({
                                [`teamMemberParentFirstName${mIndex}${mParentIndex}`]: mParent.firstName,
                                [`teamMemberParentMiddleName${mIndex}${mParentIndex}`]: mParent.middleName,
                                [`teamMemberParentLastName${mIndex}${mParentIndex}`]: mParent.lastName,
                                [`teamMemberParentDateOfBirth${mIndex}${mParentIndex}`]: mParent.dateOfBirth ? moment(mParent.dateOfBirth, "MM-DD-YYYY") : null,
                                [`teamMemberParentMobileNumber${mIndex}${mParentIndex}`]:  mParent.mobileNumber,
                                [`teamMemberParentEmail${mIndex}${mParentIndex}`]:  mParent.email,
                            });
                            // this.setTeamMemberParentAddressFormFields(mIndex,mParent,mParentIndex)
                        })}
                    })}
                } 
            }
        }catch(ex){
            console.log("Error in setParticipantDetailStepFormFields::"+ex);
        }
    }

    setParticipantAdditionalInfoStepFormFields = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let additionalInfo = teamRegistrationObj.additionalInfo;
            if(teamRegistrationObj){
                this.props.form.setFieldsValue({
                    [`additionalInfoCountryRefId`]: additionalInfo.countryRefId,
                    [`additionalInfoAnyExistingMedialCondition`]: additionalInfo.existingMedicalCondition,
                    [`additionalInfoAnyRedularMedicalConditions`]: additionalInfo.regularMedication,
                    [`additionalInfoInjury`]: additionalInfo.injuryInfo,
                    [`additionalInfoAllergies`]: additionalInfo.allergyInfo,
                    [`additionalInfoTeamYouFollow`]: additionalInfo.favouriteTeamRefId,
                    [`additionalInfoPlayingOtherParticipantSports`]: additionalInfo.otherSportsInfo ? additionalInfo.otherSportsInfo : [],
                    [`additionalInfoFavoriteBird`]: additionalInfo.favouriteTeamRefId,
                    [`additionalInfoDisablityCareNumber`]:additionalInfo.disabilityCareNumber,
                    [`additionalInfoHeartTrouble`]:additionalInfo.walkingNetball.heartTrouble,
                    [`additionalInfoChestPain`]:additionalInfo.walkingNetball.chestPain,
                    [`additionalInfoFaintOrSpells`]:additionalInfo.walkingNetball.faintOrSpells,
                    [`additionalInfoBloodPressure`]:additionalInfo.walkingNetball.bloodPressure,
                    [`additionalInfoJointOrBoneProblem`]:additionalInfo.walkingNetball.jointOrBoneProblem,
                    [`additionalInfoPhysicalActivity`]:additionalInfo.walkingNetball.physicalActivity,
                    [`additionalInfoPregnant`]:additionalInfo.walkingNetball.pregnant,
                    [`additionalInfoLowerBackProblem`]:additionalInfo.walkingNetball.lowerBackProblem,
                    [`additionalInfoProvideFurtherDetails`]:additionalInfo.walkingNetballInfo
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
                this.setState({submitButtonText: AppConstants.signupToCompetition});
                setTimeout(() => {
                    this.setSelectCompetitionStepFormFields();
                },300);
            }else if(current == 1){
                if(this.state.enabledSteps.includes(1)){
                    this.setState({submitButtonText: AppConstants.next});
                    setTimeout(() => {
                        this.setParticipantDetailStepFormFields();
                    },300);
                }
            }else{
                if(this.state.enabledSteps.includes(2)){
                    this.setState({submitButtonText: AppConstants.signupToCompetition});
                    setTimeout(() => {
                        this.setParticipantAdditionalInfoStepFormFields();
                    },300);
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
                // let filteredOrganisation = deepCopyFunction(membershipProductInfo).filter(x => x.postalCode?.toLowerCase().indexOf(this.state.postalCode) > -1);
                // this.setState({organisations: filteredOrganisation});
                //this.setAllCompetitions(filteredOrganisation);
                const nearByOrganisationsData = nearByOrganisations(membershipProductInfo, this.state.postalCode, 20);
                this.setState({organisations: nearByOrganisationsData});
                let selectedOrganisationExistInList = nearByOrganisationsData.find(x => x.organisationUniqueKey == this.state.organisationId);
                if(selectedOrganisationExistInList == undefined){
                    this.setState({competitions: null,organisationId: null})
                }
            }else{
                this.setState({organisations: membershipProductInfo});
                // this.setAllCompetitions(membershipProductInfo);
            }
        }catch(ex){
            console.log("Error in searchOrganisationByPostalCode"+ex);
        }
    }

    // setAllCompetitions = (membershipProductInfo) => {
    //     try{
    //         let allCompetitionsTemp = [];
    //         for(let org of membershipProductInfo){
    //             allCompetitionsTemp.push.apply(allCompetitionsTemp,org.competitions);
    //         }
    //         this.setState({allCompetitions: allCompetitionsTemp});
    //         this.setState({competitions: allCompetitionsTemp.slice(0,this.state.competitionsCountPerPage)});
    //     }catch(ex){
    //         console.log("Error in setAllCompetitions"+ex);
    //     }
    // }

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
        // if(this.state.organisationId == null){
        //     this.setState({competitions: this.state.allCompetitions.slice(startIndex,endIndex)});
        // }else{
            this.setState({competitions: this.state.allCompetitionsByOrgId.slice(startIndex,endIndex)});
        //}
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

    getSchoolList = (stateRefId) => {
        this.onChangeSetAdditionalInfo(null, "schoolId");
        this.props.getSchoolListAction(stateRefId);
    }

    onChangeSetTeamValue = (value,key) => {
        try{
            this.props.updateTeamRegistrationObjectAction(value,key);
            if(key == "stateRefId"){
                this.getSchoolList(value);
            }
        }catch(ex){
            console.log("Error in onChangeSetTeamValue::"+ex);
        }
    }

    showTeamNameValidation= (value) =>{
        const { teamRegistrationObj } = this.props.teamRegistrationState;
        if(value!= null && value.length > 0){
            let obj = {     
                competitionId:  teamRegistrationObj.competitionId,
                organisationId: teamRegistrationObj.organisationId,  
                competitionMembershipProductDivisionId: teamRegistrationObj.competitionMembershipProductDivisionId,
                teamName: value,           
            }
            this.props.teamNameValidationAction(obj);
        }
    }	

    scrollToTop = () => {
        window.scrollTo(0, 0);
    }

    setRegistererDetailsAsParentInFirstPos = (isRegistererAsParent,teamMemberIndex) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let teamMember = teamRegistrationObj.teamMembers[teamMemberIndex];
            if(isRegistererAsParent == 1){
                // console.log("teamMember.parentOrGuardian.length",teamMember.parentOrGuardian.length)
                if(teamMember.parentOrGuardian.length > 0 && teamMember.parentOrGuardian[0].email){
                    for(let i=(teamMember.parentOrGuardian.length-1); i >= 0;i--){
                        teamMember.parentOrGuardian[i+1] = teamMember.parentOrGuardian[i];
                    }
                }
                // console.log("teamMember.parentOrGuardian.length",teamMember.parentOrGuardian.length)
                let parentTemp = deepCopyFunction(this.getParentObj());
                parentTemp.firstName = teamRegistrationObj.firstName;
                parentTemp.middleName = teamRegistrationObj.middleName;
                parentTemp.lastName = teamRegistrationObj.lastName;
                parentTemp.mobileNumber = teamRegistrationObj.mobileNumber;
                parentTemp.email = teamRegistrationObj.email;
                teamMember.parentOrGuardian[0] = parentTemp;
            }else{
                // console.log("teamMember.parentOrGuardian[0]",teamMember.parentOrGuardian[0])
                teamMember.parentOrGuardian.splice(0,1);
            }
            // console.log("teamRegistrationObj",teamRegistrationObj)
            this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
            setTimeout(() => {
                this.setParticipantDetailStepFormFields();
            },200)
        }catch(ex){
            console.log("Error in setRegistererDetailsAsParentInFirstPos::"+ex);
        }
    }

    onChangeTeamMemberValue = (value,key,index,subIndex) => {
        // console.log("value,key,index,subIndex",value,key,index,subIndex)
        this.props.updateRegistrationTeamMemberAction(value,key,index,subIndex);
        if(key == "isRegistererAsParent"){
            this.setRegistererDetailsAsParentInFirstPos(value,index)
        }
    }

    showMemberTypeValidation = (teamMember) => {
        try{
            let error = false;
            if(teamMember.membershipProductTypes.find(x => x.isChecked == true)){
                error = false;
            }else{
                error = true;
            }
            return error;
        }catch(ex){
            console.log("Error in showMemberTypeValidation::"+ex)
        }
    }

    onChangeSetAdditionalInfo = (value,key,subKey) => {
        this.props.updateTeamAdditionalInfoAction(key,value,subKey);
    }

    readTeamPlayersCSV = (teamMemberList) => {
        console.log("csv data",teamMemberList);
        this.props.updateTeamRegistrationObjectAction(teamMemberList,"teamMemberList");
        setTimeout(() => {
            this.setParticipantDetailStepFormFields();
        },300)
        let e = document.getElementById("teamPlayerUpload");
        e.value = null;
    }

    getFilteredTeamRegisrationObj = (teamRegistrationObj) => {
        try{
            teamRegistrationObj["existingUserId"] = getUserId() ? Number(getUserId()) : null;
            teamRegistrationObj.registeringYourself = 4;
            teamRegistrationObj.participantId = this.state.participantId != null ? this.state.participantId : null;
            teamRegistrationObj.registrationId = this.state.registrationId != null ? this.state.registrationId : null; 
            // teamRegistrationObj.dateOfBirth = teamRegistrationObj.dateOfBirth ? moment(teamRegistrationObj.dateOfBirth,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
            // for(let teamMember of teamRegistrationObj.teamMembers){
            //     teamMember.dateOfBirth = teamMember.dateOfBirth ? moment(teamMember.dateOfBirth,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
            // }
            // teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate = teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate ? 
            //                             moment(teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate,"DD-MM-YYYY").format("MM-DD-YYYY") : null;
            // teamRegistrationObj.additionalInfo.childrenCheckExpiryDate = teamRegistrationObj.additionalInfo.childrenCheckExpiryDate ? 
            //                             moment(teamRegistrationObj.additionalInfo.childrenCheckExpiryDate,"DD-MM-YYYY").format("MM-DD-YYYY") : null;

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

    handlePlacesAutocomplete = (addressData,key,parentIndex) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const address = addressData;
            const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address?.state).id : null;
            const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address?.country).id : null;
            if(address){
                if(key == "yourDetails"){
                    this.onChangeSetTeamValue(address.addressOne, "street1");
                    this.onChangeSetTeamValue(address.suburb, "suburb");
                    this.onChangeSetTeamValue(address.postcode, "postalCode");
                    this.onChangeSetTeamValue(countryRefId ? countryRefId : null, "countryRefId");
                    this.onChangeSetTeamValue(stateRefId ? stateRefId : null, "stateRefId");
                    if(stateRefId){
                        this.getSchoolList(stateRefId);
                    }
                }else if(key == "parent"){
                    this.onChangeSetParentValue(stateRefId ? stateRefId : null, "stateRefId", parentIndex);
                    this.onChangeSetParentValue(address.addressOne, "street1", parentIndex);
                    this.onChangeSetParentValue(address.suburb, "suburb", parentIndex);
                    this.onChangeSetParentValue(address.postcode, "postalCode", parentIndex);
                    this.onChangeSetParentValue(countryRefId ? countryRefId : null, "countryRefId", parentIndex);
                }
            }
        }catch(ex){
            console.log("Error in handlePlacesAutoComplete::"+ex);
        }
    }

    teamMemberAddressAutoComplete = (addressData,key,teamMemberIndex,teamMemberParentIndex) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const address = addressData;
            const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address?.state).id : null;
            const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address?.country).id : null;
            if(address){
                if(key == "teamMember"){
                    this.onChangeTeamMemberValue(address.addressOne, "street1",teamMemberIndex);
                    this.onChangeTeamMemberValue(address.suburb, "suburb",teamMemberIndex);
                    this.onChangeTeamMemberValue(address.postcode, "postalCode",teamMemberIndex);
                    this.onChangeTeamMemberValue(countryRefId ? countryRefId : null, "countryRefId",teamMemberIndex);
                    this.onChangeTeamMemberValue(stateRefId ? stateRefId : null, "stateRefId",teamMemberIndex);
                }else if(key == "teamMemberParent"){
                    this.onChangeSetTeamMemberParentValue(stateRefId ? stateRefId : null, "stateRefId", teamMemberParentIndex,teamMemberIndex);
                    this.onChangeSetTeamMemberParentValue(address.addressOne, "street1", teamMemberParentIndex,teamMemberIndex);
                    this.onChangeSetTeamMemberParentValue(address.suburb, "suburb", teamMemberParentIndex,teamMemberIndex);
                    this.onChangeSetTeamMemberParentValue(address.postcode, "postalCode", teamMemberParentIndex,teamMemberIndex);
                    this.onChangeSetTeamMemberParentValue(countryRefId ? countryRefId : null, "countryRefId", teamMemberParentIndex,teamMemberIndex);
                }
            }
        }catch(ex){
            console.log("Error in teamMemberAddressAutoComplete::"+ex);
        }
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
            // "selectAddressFlag": true,
            "addNewAddressFlag": true,
            "manualEnterAddressFlag": false
        }
        return parentObj;
    }

    onChangeSetParentValue = (value, key, parentIndex) => {
        try {
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            if (key == "isSameAddress") {
                teamRegistrationObj.parentOrGuardian[parentIndex][key] = value;
                if (value) {
                    teamRegistrationObj.parentOrGuardian[parentIndex]["street1"] = teamRegistrationObj.street1;
                    teamRegistrationObj.parentOrGuardian[parentIndex]["street2"] = teamRegistrationObj.street2;
                    teamRegistrationObj.parentOrGuardian[parentIndex]["suburb"] = teamRegistrationObj.suburb;
                    teamRegistrationObj.parentOrGuardian[parentIndex]["stateRefId"] = teamRegistrationObj.stateRefId;
                    teamRegistrationObj.parentOrGuardian[parentIndex]["countryRefId"] = teamRegistrationObj.countryRefId;
                    teamRegistrationObj.parentOrGuardian[parentIndex]["postalCode"] = teamRegistrationObj.postalCode;
                    this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
                } else {
                    this.clearParentAddress(teamRegistrationObj, parentIndex);
                }
            } else {
                teamRegistrationObj.parentOrGuardian[parentIndex][key] = value;
                this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
            }
        } catch (ex) {
            console.log("Exception occured in onChangeSetParentValue" + ex);
        }
    }

    onChangeSetTeamMemberParentValue = (value, key, parentIndex, teamMemberIndex) => {
        try {
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let teamMember = teamRegistrationObj.teamMembers[teamMemberIndex]
            if (key == "isSameAddress") {
                teamMember.parentOrGuardian[parentIndex][key] = value;
                if (value) {
                    teamMember.parentOrGuardian[parentIndex]["street1"] = teamMember.street1;
                    teamMember.parentOrGuardian[parentIndex]["street2"] = teamMember.street2;
                    teamMember.parentOrGuardian[parentIndex]["suburb"] = teamMember.suburb;
                    teamMember.parentOrGuardian[parentIndex]["stateRefId"] = teamMember.stateRefId;
                    teamMember.parentOrGuardian[parentIndex]["countryRefId"] = teamMember.countryRefId;
                    teamMember.parentOrGuardian[parentIndex]["postalCode"] = teamMember.postalCode;
                    this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
                } else {
                    this.clearTeamMemberParentAddress(parentIndex,teamMemberIndex);
                }
            } else {
                teamMember.parentOrGuardian[parentIndex][key] = value;
                this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
            }
        } catch (ex) {
            console.log("Exception occured in onChangeSetParentValue" + ex);
        }
    }

    clearParentAddress = (teamRegistrationObj, parentIndex) => {
        teamRegistrationObj.parentOrGuardian[parentIndex]["street1"] = null;
        teamRegistrationObj.parentOrGuardian[parentIndex]["street2"] = null;
        teamRegistrationObj.parentOrGuardian[parentIndex]["suburb"] = null;
        teamRegistrationObj.parentOrGuardian[parentIndex]["stateRefId"] = null;
        teamRegistrationObj.parentOrGuardian[parentIndex]["countryRefId"] = null;
        teamRegistrationObj.parentOrGuardian[parentIndex]["postalCode"] = null;
        this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
    }

    clearTeamMemberParentAddress = (parentIndex,teamMemberIndex) => {
        const { teamRegistrationObj } = this.props.teamRegistrationState;
        let teamMember = teamRegistrationObj.teamMembers[teamMemberIndex];
        teamMember.parentOrGuardian[parentIndex]["street1"] = null;
        teamMember.parentOrGuardian[parentIndex]["street2"] = null;
        teamMember.parentOrGuardian[parentIndex]["suburb"] = null;
        teamMember.parentOrGuardian[parentIndex]["stateRefId"] = null;
        teamMember.parentOrGuardian[parentIndex]["countryRefId"] = null;
        teamMember.parentOrGuardian[parentIndex]["postalCode"] = null;
        this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj");
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

    addressSearchValidation = () => {
        try{
            let error = false;
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            if(teamRegistrationObj.addNewAddressFlag && 
                teamRegistrationObj.stateRefId == null){
                error = true;
            }
            return error;
        }catch(ex){
            console.log("Error in addressSearchValidation"+ex);
        }
    }

    // checkDivisionRestriction = (filteredTeamRegistrationObj) => {
    //     try{
    //         let personNames = [];
    //         let errorTypes = [];
    //         let errorMessage = '';
    //         let selectedDivision = filteredTeamRegistrationObj.divisions.find(x => x.competitionMembershipProductDivisionId == filteredTeamRegistrationObj.competitionMembershipProductDivisionId);
    //         if(filteredTeamRegistrationObj.personRoleRefId == 4 || (filteredTeamRegistrationObj.personRoleRefId != 4 && filteredTeamRegistrationObj.registeringAsAPlayer == 1)){
    //             let genderRefId = filteredTeamRegistrationObj.genderRefId;
    //             let dob = moment(filteredTeamRegistrationObj.dateOfBirth).format("YYYY-MM-DD");
    //             if(selectedDivision.genderRefId){
    //                 if(genderRefId != selectedDivision.genderRefId){
    //                     errorTypes.push("Gender");
    //                     let name = filteredTeamRegistrationObj.firstName + ' ' + filteredTeamRegistrationObj.lastName;
    //                     personNames.push(name)
    //                 }
    //             }
    //             if(selectedDivision.fromDate && selectedDivision.toDate){
    //                 if(!(moment(dob).isAfter(selectedDivision.fromDate) && moment(dob).isBefore(selectedDivision.toDate))){
    //                     errorTypes.push("DOB");
    //                     let name = filteredTeamRegistrationObj.firstName + ' ' + filteredTeamRegistrationObj.lastName;
    //                     let filteredNames = personNames.filter(x => x != name);
    //                     personNames = filteredNames;
    //                     personNames.push(name)
    //                 }
    //             }
    //         }
    //         // console.log("names","array",errorTypes,personNames)
    //         if(isArrayNotEmpty(filteredTeamRegistrationObj.teamMembers)){
    //             for(let member of filteredTeamRegistrationObj.teamMembers){
    //                 let isPlayer = this.checkIsPlayer(member.membershipProductTypes);
    //                 if(isPlayer){
    //                     let genderRefId = member.genderRefId;
    //                     let dob = moment(member.dateOfBirth).format("YYYY-MM-DD");
    //                     if(selectedDivision.genderRefId){
    //                         if(genderRefId != selectedDivision.genderRefId){
    //                             let filteredErrorTypes = errorTypes.filter(x => x != "Gender");
    //                             // console.log("member geder",filteredErrorTypes)
    //                             errorTypes = filteredErrorTypes;
    //                             errorTypes.push("Gender");
    //                             let name = member.firstName + ' ' + member.lastName;
    //                             let filteredNames = personNames.filter(x => x != name);
    //                             personNames = filteredNames;
    //                             personNames.push(name)
    //                         }
    //                     }
    //                     if(selectedDivision.fromDate && selectedDivision.toDate){
    //                         if(!(moment(dob).isAfter(selectedDivision.fromDate) && moment(dob).isBefore(selectedDivision.toDate))){
    //                             let filteredErrorTypes = errorTypes.filter(x => x != "DOB");
    //                             errorTypes = filteredErrorTypes;
    //                             errorTypes.push("DOB");
    //                             let name = member.firstName + ' ' + member.lastName;
    //                             let filteredNames = personNames.filter(x => x != name);
    //                             personNames = filteredNames;
    //                             personNames.push(name)
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         if(isArrayNotEmpty(personNames) && isArrayNotEmpty(errorTypes)){
    //             let personsString = '';
    //             for(let i in personNames){
    //                 personsString += personNames[i] + (personNames.length - 1 != i ? ' and ' : ' ');
    //             }
    //             errorMessage += personsString + 'do not meet the restriction of ';
    //             let errorTypesString = '';
    //             for(let i in errorTypes){
    //                 errorTypesString += errorTypes[i] + (errorTypes.length - 1 != i ? ' and ' : ' ');
    //             }
    //             errorMessage += errorTypesString + '. It should be updated.';
    //         }
    //         return errorMessage;
    //     }catch(ex){
    //         console.log("Error in checkDivisionRestriction::"+ex)
    //     }
    // }

    checkGenderDivisionRestriction = (filteredTeamRegistrationObj) => {
        try{
            const { membershipProductInfo } = this.props.teamRegistrationState;
            let competitionName = '';
            for(let org of membershipProductInfo){
                let competition = org.competitions.find(x => x.competitionUniqueKey == filteredTeamRegistrationObj.competitionId);
                if(competition){
                    competitionName = competition.competitionName;
                }
            }
            let selectedDivision = filteredTeamRegistrationObj.divisions.find(x => x.competitionMembershipProductDivisionId == filteredTeamRegistrationObj.competitionMembershipProductDivisionId);
            let gender = selectedDivision.genderRefId == 1 ? "Female" : selectedDivision.genderRefId == 2 ? "Male" : "Non-binary";
            let personNames = [];
            let errorMessage = '';
            if(filteredTeamRegistrationObj.personRoleRefId == 4 || (filteredTeamRegistrationObj.personRoleRefId != 4 && filteredTeamRegistrationObj.registeringAsAPlayer == 1)){
                let genderRefId = filteredTeamRegistrationObj.genderRefId;
                if(selectedDivision.genderRefId){
                    if(genderRefId != selectedDivision.genderRefId){
                        let name = filteredTeamRegistrationObj.firstName + ' ' + filteredTeamRegistrationObj.lastName;
                        personNames.push(name)
                    }
                }
            }
            if(isArrayNotEmpty(filteredTeamRegistrationObj.teamMembers)){
                for(let member of filteredTeamRegistrationObj.teamMembers){
                    let isPlayer = this.checkIsPlayer(member.membershipProductTypes);
                    if(isPlayer){
                        let genderRefId = member.genderRefId;
                        if(selectedDivision.genderRefId){
                            if(genderRefId != selectedDivision.genderRefId){
                                let name = member.firstName + ' ' + member.lastName;
                                let filteredNames = personNames.filter(x => x != name);
                                personNames = filteredNames;
                                personNames.push(name)
                            }
                        }
                    }
                }
            }
            // console.log("personName",personNames)
            if(isArrayNotEmpty(personNames)){
                let personsString = '';
                for(let i in personNames){
                    personsString += personNames[i] + (personNames.length - 1 != i ? ' and ' : ' ');
                }
                errorMessage = competitionName + " is a " + gender + " only competition." + personsString + " is not allowed to register to this competition."
            }
            // console.log("errr",errorMessage)
            return errorMessage;
        }catch(ex){
            console.log("Error in checkGenderDivisionRestriction::"+ex);
        }
    }

    checkDobDivisionRestriction = (filteredTeamRegistrationObj) => {
        try{
            const { membershipProductInfo } = this.props.teamRegistrationState;
            let competitionName = '';
            for(let org of membershipProductInfo){
                let competition = org.competitions.find(x => x.competitionUniqueKey == filteredTeamRegistrationObj.competitionId);
                if(competition){
                    competitionName = competition.competitionName;
                }
            }
            let selectedDivision = filteredTeamRegistrationObj.divisions.find(x => x.competitionMembershipProductDivisionId == filteredTeamRegistrationObj.competitionMembershipProductDivisionId);
            let personNames = [];
            let errorMessage = '';
            if(filteredTeamRegistrationObj.personRoleRefId == 4 || (filteredTeamRegistrationObj.personRoleRefId != 4 && filteredTeamRegistrationObj.registeringAsAPlayer == 1)){
                let dob = moment(filteredTeamRegistrationObj.dateOfBirth).format("YYYY-MM-DD");
                if(selectedDivision.fromDate && selectedDivision.toDate){
                    if(!(moment(dob).isAfter(selectedDivision.fromDate) && moment(dob).isBefore(selectedDivision.toDate))){
                        let name = filteredTeamRegistrationObj.firstName + ' ' + filteredTeamRegistrationObj.lastName;
                        personNames.push(name)
                    }
                }
            }
            if(isArrayNotEmpty(filteredTeamRegistrationObj.teamMembers)){
                for(let member of filteredTeamRegistrationObj.teamMembers){
                    let isPlayer = this.checkIsPlayer(member.membershipProductTypes);
                    if(isPlayer){
                        let dob = moment(member.dateOfBirth).format("YYYY-MM-DD");
                        if(selectedDivision.fromDate && selectedDivision.toDate){
                            if(!(moment(dob).isAfter(selectedDivision.fromDate) && moment(dob).isBefore(selectedDivision.toDate))){
                                let name = member.firstName + ' ' + member.lastName;
                                let filteredNames = personNames.filter(x => x != name);
                                personNames = filteredNames;
                                personNames.push(name)
                            }
                        }
                    }
                }
            }
            // console.log("personName2",personNames)
            if(isArrayNotEmpty(personNames)){
                let fromDate = moment(selectedDivision.fromDate).format("DD-MM-YYYY");
                let toDate = moment(selectedDivision.toDate).format("DD-MM-YYYY"); 
                let personsString = '';
                for(let i in personNames){
                    personsString += personNames[i] + (personNames.length - 1 != i ? ' and ' : ' ');
                }
                errorMessage = competitionName + " has a DOB restriction of " + fromDate + " to " + toDate + "." + personsString + " is not allowed to register to this competition."
            }
            // console.log("errr2",errorMessage)
            return errorMessage;
        }catch(ex){
            console.log("Error in checkGenderDivisionRestriction::"+ex);
        }
    }

    addParent = (key, parentIndex) => {
        try {
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            if (key == "add") {
                let parentObj = deepCopyFunction(this.getParentObj());
                parentObj.tempParentId = teamRegistrationObj.parentOrGuardian.length + 1;
                teamRegistrationObj.parentOrGuardian.push(parentObj);
            }
            if (key == "remove") {
                teamRegistrationObj.parentOrGuardian.splice(parentIndex, 1);
            }
            if (key == "removeAllParent") {
                teamRegistrationObj.parentOrGuardian = [];
            }
            this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj")
        } catch (ex) {
            console.log("Exception occured in addParent" + ex);
        }
    }

    addTeamMemberParent = (key,teamMemberIndex,teamMemberParentIndex) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let teamMember = teamRegistrationObj.teamMembers[teamMemberIndex];
            if (key == "add") {
                let parentObj = deepCopyFunction(this.getParentObj());
                parentObj.tempParentId = teamMember.parentOrGuardian.length + 1;
                teamMember.parentOrGuardian.push(parentObj);
            }
            if (key == "remove") {
                teamMember.parentOrGuardian.splice(teamMemberParentIndex, 1);
            }
            if (key == "removeAllParent") {
                teamMember.parentOrGuardian = [];
            }
            console.log("teamREg",teamMember)
            this.props.updateTeamRegistrationStateVarAction(teamRegistrationObj, "teamRegistrationObj")
        }catch(ex){
            console.log("Error in addTeamMemberParent::"+ex)
        }
    }

    dateConversion = (f, key, referenceKey, teamMemberIndex) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let date = moment(f,"DD-MM-YYYY").format("MM-DD-YYYY");
            console.log("Date",date)
            if(referenceKey == "team"){
                this.onChangeSetTeamValue(date, key);
                if(getAge(date) < 18){
                    if (!isArrayNotEmpty(teamRegistrationObj.parentOrGuardian)) {
                        this.addParent("add")
                    }
                }else{
                    this.addParent("removeAllParent")
                }
            }else if(referenceKey == "teamMember"){
                this.onChangeTeamMemberValue(date,key, teamMemberIndex);
                this.teamMemberAddingProcess(date,teamRegistrationObj.teamMembers[teamMemberIndex].payingFor,teamMemberIndex)
            }else if(referenceKey == "additionalInfo"){
                this.onChangeSetAdditionalInfo(f, key)
            }
        }catch(ex){
            console.log("Error in dateConversion::"+ex)
        }
    }

    teamMemberAddingProcess = (dob,payingFor,teamMemberIndex) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            if(getAge(dob) < 18 && payingFor == 1){
                if(!isArrayNotEmpty(teamRegistrationObj.teamMembers[teamMemberIndex].parentOrGuardian)){
                    this.addTeamMemberParent("add",teamMemberIndex)
                } 
            }else{
                this.addTeamMemberParent("removeAllParent",teamMemberIndex)
            }
        }catch(ex){
            console.log("Error in teamMemberAddingProcess::"+ex)
        }
    }

    selectAnother = () => {
        try{
            this.props.updateTeamRegistrationObjectAction(null,"teamRegistrationObj")
            history.push({pathname:'/appRegistrationForm'});
        }catch(ex){
            console.log("Error in selectAnother::"+ex)
        }
    }

    stepNavigation = () => {
        try{
            let nextStep = this.state.currentStep + 1;
            this.scrollToTop();
            if(nextStep == 1){
                this.state.enabledSteps.push(0,nextStep);
                setTimeout(() => {
                    this.setParticipantDetailStepFormFields();
                },300);
            }else{
                this.state.enabledSteps.push(nextStep);
                if(nextStep == 2){
                    setTimeout(() => {
                        this.setParticipantAdditionalInfoStepFormFields();
                    },300);
                }
            }
            this.state.completedSteps.push(this.state.currentStep);
            this.setState({currentStep: nextStep,
            enabledSteps: this.state.enabledSteps,
            completedSteps: this.state.completedSteps});
            this.setState({submitButtonText: nextStep == 1 ? 
                AppConstants.next : AppConstants.signupToCompetition});
        }catch(ex){
            console.log("Error in stepNavigation::"+ex)
        }
    }

    saveRegistrationForm = (e) => {
        try{
            e.preventDefault();
            const { teamRegistrationObj } = this.props.teamRegistrationState; 
            console.log("teamRegis final",teamRegistrationObj)
            let saveTeamRegistrationObj = JSON.parse(JSON.stringify(teamRegistrationObj));
            let filteredTeamRegistrationObj = this.getFilteredTeamRegisrationObj(saveTeamRegistrationObj)
            if(this.state.currentStep == 1){
                this.setState({buttonSubmitted: true});
                for(let teamMember of teamRegistrationObj.teamMembers){
                    if(this.showMemberTypeValidation(teamMember)){
                        return;
                    }
                }
            }
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                    if(this.state.currentStep == 0){
                        // let productAdded = this.productValidation();
                        // if(!productAdded){
                        //     message.error(ValidationConstants.fillMembershipProductInformation);
                        //     return;
                        // } 
                        this.props.validateRegistrationCapAction(this.props.teamRegistrationState.registrationCapValidateInputObj);
                        this.setState({validateRegistrationCapBySubmit: true,validateRegistrationCapOnLoad: true});
                        return;
                    }
                    if(this.state.currentStep == 1){
                        let addressSearchError = this.addressSearchValidation();
                        if(addressSearchError){
                            message.error(ValidationConstants.addressDetailsIsRequired);
                            return;
                        }
                        let isGenderDivisionRestrictionError = this.checkGenderDivisionRestriction(filteredTeamRegistrationObj);
                        if(isGenderDivisionRestrictionError != ''){
                            message.error(isGenderDivisionRestrictionError);
                            return;
                        }
                        let isDobDivisionRestrictionError = this.checkDobDivisionRestriction(filteredTeamRegistrationObj);
                        if(isDobDivisionRestrictionError != ''){
                            message.error(isDobDivisionRestrictionError);
                            return;
                        }
                    }
                    if(this.state.currentStep != 2){
                       this.stepNavigation();
                    }

                    if(this.state.currentStep == 2){
                        let formData = new FormData();
                        formData.append("participantDetail", JSON.stringify(filteredTeamRegistrationObj));
                        this.props.saveTeamInfoAction(formData);
                    }
                }
            });
        }catch(ex){
            console.log("Error in saveRegistrationForm::"+ex);
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
                                    this.setState({showFindAnotherCompetitionview: false,organisationId: null});
                                    setTimeout(() => {
                                        this.setSelectCompetitionStepFormFields();
                                    },300)
                                }
                            }}>{AppConstants.cancel}</div>
                        )}
                    </div>
    
                    <div className="light-grey-border-box">
                        <div className="row">
                            <div className="col post-code-input" >
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
                                    onClick={() => this.searchOrganisationByPostalCode()}
                                    className="open-reg-button postal-code-button">{AppConstants.search}</Button>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.organisationName}/>
                        <Select
                            showSearch
                            optionFilterProp="children"
                            onChange={(e) => this.onChangeSetOrganisation(e)}
                            style={{ width: "100%", paddingRight: 1 }}
                            value={this.state.organisationId ? this.state.organisationId : -1}>
                            {(this.state.organisationId == null || this.state.organisationId == undefined) && (
                                < Option key={"Please select"} value={-1}> {AppConstants.pleaseSelect}</Option>
                            )}    
                            {(this.state.organisations || []).map((item) => (
                                < Option key={item.organisationUniqueKey} value={item.organisationUniqueKey}> {item.organisationName}</Option>
                            ))}
                        </Select>
                        {organisationInfo && (
                            <div className="organisation-info-wrapper">
                                {organisationInfo.organisationLogoUrl?
                                <img className="profile-img" src={organisationInfo.organisationLogoUrl}/>
                                :
                                <img className="profile-img" style={{borderRadius:"20%"}} src={AppImages.compDefaultIcon}/>
                                }
                                <div style={{width: "170px"}}>{organisationInfo.street1} {organisationInfo.street2} {organisationInfo.suburb} {organisationInfo.state} {organisationInfo.postalCode}</div>
                                {organisationInfo.mobileNumber && (
                                    <div style={{ minWidth: 120 }}><img className="icon-size-20" style={{marginRight: "15px"}} src={AppImages.callAnswer}/>{organisationInfo.mobileNumber}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="row" style={{marginTop: "30px"}}>
                        {(this.state.competitions || []).map((competition,competitionIndex) => (
                            <div
                                className="col-md-6 col-sm-12 pointer"
                                onClick={() => this.addAnotherCompetition(competition)}
                                key={competition.competitionUniqueKey} 
                                style={{marginBottom: "20px"}}
                            >
                                <div style={{border:"1px solid var(--app-f0f0f2)",borderRadius: "10px",padding: "20px", height: '100%'}}>
                                    <div 
                                        style={{
                                            height: "150px",
                                            display: "flex",
                                            justifyContent: "center",
                                            borderRadius: "10px 10px 0px 0px",
                                            margin: "-20px -20px -0px -20px",
                                            borderBottom: "1px solid var(--app-f0f0f2)"
                                        }}
                                    >
                                        <img
                                            style={{
                                                height: 149,
                                                width: '100%',
                                                borderRadius: "10px 10px 0px 0px",
                                                overflow: "hidden", 
                                                objectFit: 'contain'
                                                }}
                                            src={competition.heroImageUrl}
                                        />
                                    </div>
                                    <div className="form-heading" style={{marginTop: "20px",textAlign: "start", paddingBottom:"3.5px"}}>{competition.competitionName}</div>
                                    {this.state.organisationId == null && (
                                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{competition.organisationName}</div>
                                    )}
                                    <div style={{fontWeight: "600", marginBottom:"10px"}}>{competition.compOrgName}</div>
                                    <div style={{fontWeight: "600", display: 'flex', alignItems: 'center' }}>
                                        <img className="icon-size-25" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/>
                                        <div>{competition.registrationOpenDate} - {competition.registrationCloseDate}</div>
                                    </div>
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
                            //total={this.state.organisationId == null ? this.state.allCompetitions.length : this.state.allCompetitionsByOrgId.length} 
                            total={this.state.allCompetitionsByOrgId.length} 
                            itemRender={this.paginationItems}/>
                        ) : 
                        (
                            <div>
                                {this.state.organisationId && (
                                    <div className="form-heading" style={{fontSize: "20px",justifyContent: "center"}}>{AppConstants.noCompetitionsForOrganisations}</div>
                                )}
                            </div> 
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
            let organisaionInfo = teamRegistrationObj.organisationInfo;
            let contactDetails = competitionInfo.replyName || competitionInfo.replyPhone || competitionInfo.replyEmail ?
                            competitionInfo.replyName + ' ' + competitionInfo.replyPhone + ' ' + competitionInfo.replyEmail : ''; 
            let organisationPhotos = this.getOrganisationPhotos(teamRegistrationObj.organisationInfo.organisationPhotos);
            return(
                <div className="registration-form-view">
                    {competitionInfo.heroImageUrl && (
                        <div className="map-style">
                            <img style={{height: "249px", width: "100%", borderRadius: "10px 10px 0px 0px", objectFit: 'contain' }} src={competitionInfo.heroImageUrl}/>
                        </div>
                    )}
                    <div>
                        <div className="row" style={competitionInfo.heroImageUrl ? {marginTop: "30px",marginLeft: "0px",marginRight: "0px"} : {marginLeft: "0px",marginRight: "0px"}}>
                            <div className="col-sm-1.5 mr-4" style={{ display: "flex", alignItems: 'center' }}>
                                {organisaionInfo.organisationLogoUrl?
                                <img className="profile-img" src={organisaionInfo.organisationLogoUrl}/>
                                :
                                <img className="profile-img" style={{borderRadius:"20%"}} src={AppImages.compDefaultIcon}/>
                                }
                            </div>
                            <div className="col" style={{ padding: 0 }}>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div className="form-heading">{competitionInfo.organisationName}</div>
                                        <div style={{textAlign: "start",fontWeight: "600",marginRight: 10, marginBottom: 5}}>{competitionInfo.stateOrgName} - {competitionInfo.competitionName}</div>
                                        <div style={{fontWeight: "600",display: 'flex', alignItems: 'center' }}>
                                            <img className="icon-size-25" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> 
                                            <div>{competitionInfo.registrationOpenDate} - {competitionInfo.registrationCloseDate}</div>
                                        </div>
                                    </div>

                                    <div className="orange-action-txt" style={{margin: "5px 0"}}
                                        onClick={() => {
                                            this.onChangeSetPostalCode('');
                                            this.setState({showFindAnotherCompetitionview: true,organisationId: null,competitions: null});
                                        }}
                                    >
                                        {AppConstants.findAnotherCompetition}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="light-grey-border-box">
                            <div className="form-heading" style={{marginTop:'20px'}}>{AppConstants.membershipDetails}</div>
                            <div className="competition-specifics-headings required-field" style={{paddingTop:'6px'}}>{AppConstants.registeringTeamTo}</div>
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
                                    <InputWithHead heading={AppConstants.registrationDivisions} required={"required-field"}/>
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
                                <div className="col-sm-12 col-lg-4">
                                    <div className="input-style-bold">{AppConstants.totalsinglegamefees}</div>
                                    <div className="form-heading">{!this.props.teamRegistrationState.getSeasonalCasualFeesOnLoad ? ('$'+(teamRegistrationObj.fees.totalCasualFee)) : (<div style={{textAlign: "center"}}><Spin /></div>)}
                                        <span style={{fontSize: "12px",alignSelf: "flex-end",marginBottom: "5px"}}>&#8199;incl.GST</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-lg-4">
                                    <div className="input-style-bold">{AppConstants.feeDueAtRegistration}</div>
                                    <div className="form-heading">{!this.props.teamRegistrationState.getSeasonalCasualFeesOnLoad ? ('$'+(this.props.teamRegistrationState.feesInfo?.teamRegChargeTypeRefId == 1 ? teamRegistrationObj.fees.totalSeasonalFee : "0.00")) : (<div style={{textAlign: "center"}}><Spin /></div>)}
                                        <span style={{fontSize: "12px",alignSelf: "flex-end",marginBottom: "5px"}}>&#8199;incl.GST</span>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-lg-4">
                                    <div className="input-style-bold">{AppConstants.feeDueAtMatch}</div>
                                    <div className="form-heading">{!this.props.teamRegistrationState.getSeasonalCasualFeesOnLoad ? ('$'+(this.props.teamRegistrationState.feesInfo?.teamRegChargeTypeRefId == 2 ? teamRegistrationObj.fees.totalSeasonalFee : "0.00")) : (<div style={{textAlign: "center"}}><Spin /></div>)}
                                        <span style={{fontSize: "12px",alignSelf: "flex-end",marginBottom: "5px"}}>&#8199;incl.GST</span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-style-bold pt-1 pb-0">{AppConstants.dueAtRegistration}</div>
                        </div>
                        <div className="competition-specifics">{AppConstants.competitionSpecifics}</div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <div className="col-sm-12 col-lg-4">
                                {/* <InputWithHead heading={AppConstants.training}/> */}
                                <div className="input-style-bold" style={{paddingTop:'0px'}}>{AppConstants.training}</div>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionInfo.training ? 
                                    competitionInfo.training : 
                                    AppConstants.noInformationProvided}
                                </div>
                                {/* <InputWithHead heading={AppConstants.specialNotes}/> */}
                                <div className="input-style-bold">{AppConstants.specialNotes}</div>
                                <div 
                                className="inter-medium-font" 
                                style={{fontSize: "13px"}}>{competitionInfo.specialNote ? 
                                    competitionInfo.specialNote : 
                                    AppConstants.noInformationProvided}
                                </div>                                    
                                {/* <InputWithHead heading={AppConstants.venue}/> */}
                                <div className="input-style-bold">{AppConstants.competitionVenue}</div>
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
                                {/* <InputWithHead heading={AppConstants.contactDetails}/> */}
                                <div className="input-style-bold">{AppConstants.contactDetails}</div>
                                <div  className="inter-medium-font" style={{fontSize: "13px"}}>{contactDetails ? contactDetails : 
                                    AppConstants.noInformationProvided}
                                </div> 
                            </div>
                            <div className="col-sm-12 col-lg-8 mt-5">
                                <Carousel autoplay
                                    style={{marginTop: "16px",
                                    height: "160px",
                                    borderRadius: "10px",
                                    display: "flex"}}>
                                {(organisationPhotos || []).map((photo,photoIndex) => (
                                        <div>
                                            <div className="registration-competition-venue-form-wrapper">
                                                <div style={{marginRight: "25px", marginBottom: "10px"}}>
                                                    <div className="font-bold-carosal" style={{marginBottom: "10px"}}>{photo.photoType1}</div>
                                                    <img style={{height: "158px",margin: "auto",fontWeight: "500"}} src={photo.photoUrl1}/>
                                                </div>
                                                <div>
                                                    <div className="font-bold-carosal" style={{marginBottom: "10px"}}>{photo?.photoType2}</div>
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
                            <div style={{fontWeight: "600",marginTop: "5px", display: 'flex', alignItems: 'center' }}>
                                <img className="icon-size-25" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/>
                                <div>{expiredRegistration.registrationOpenDate} - {expiredRegistration.registrationCloseDate}</div>
                            </div>
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
                        <div className="col-sm-1.5" style={{ display: "flex", alignItems: 'center' }}>
                            <img style={{height: "60px",borderRadius: "50%"}} src={competitionInfo.compLogoUrl}/> 
                        </div>
                        <div className="col">
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div className="form-heading">{competitionInfo.organisationName}</div>
                                    <div style={{textAlign: "start",fontWeight: "600", marginRight: 10, marginBotoom: 5}}>{competitionInfo.stateOrgName} - {competitionInfo.competitionName}</div>
                                    <div style={{fontWeight: "600",display: "flex",alignItems: "center"}}>
                                        <img className="icon-size-25" style={{marginRight: "5px"}} src={AppImages.calendarGrey}/> 
                                        <div>{competitionInfo.registrationOpenDate} - {competitionInfo.registrationCloseDate}</div>
                                    </div>
                                </div>

                                <div className="orange-action-txt" style={{margin: "5px 0"}}
                                        onClick={() => {
                                            this.setState({currentStep: 0});
                                            setTimeout(() => {
                                                this.setSelectCompetitionStepFormFields();
                                            },300);
                                        }}>{AppConstants.edit}</div>
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
                            <InputWithHead heading={AppConstants.suburb} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsSuburb`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                    <InputWithHead
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
                                        onChange={(e,f) => this.dateConversion(f, "dateOfBirth","team")}
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
                                    rules: [{ required: true, message: ValidationConstants.emailField[0] },
                                    {
                                        type: "email",
                                        pattern: new RegExp(AppConstants.emailExp),
                                        message: ValidationConstants.email_validation
                                    }],
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

    // teamMemberAddressView = (teamMember,teamMemberIndex,getFieldDecorator) => {
    //     try{
    //         const { stateList, countryList } = this.props.commonReducerState;
    //         return(
    //             <div>   
    //                 {teamMember.addNewAddressFlag && (
    //                     <div>
    //                         <div className="form-heading" 
    //                         style={{paddingBottom: "0px",marginBottom: "-20px",marginTop: "20px"}}>{AppConstants.findAddress}</div>
    //                         <div>
    //                             <Form.Item name="addressSearch">
    //                                 <PlacesAutocomplete
    //                                     defaultValue={this.getAddress(teamMember)}
    //                                     heading={AppConstants.addressSearch}
    //                                     required
    //                                     error={this.state.searchAddressError}
    //                                     onBlur={() => { this.setState({searchAddressError: ''})}}
    //                                     onSetData={(e)=>this.teamMemberAddressAutoComplete(e,"teamMember",teamMemberIndex)}
    //                                 />
    //                             </Form.Item> 
    //                             <div className="orange-action-txt" style={{marginTop: "10px"}}
    //                             onClick={() => {
    //                                 this.onChangeTeamMemberValue(true, "manualEnterAddressFlag", teamMemberIndex)
    //                                 this.onChangeTeamMemberValue(false,"addNewAddressFlag",teamMemberIndex);
    //                             }}
    //                             >{AppConstants.enterAddressManually}</div>	 
    //                         </div> 
    //                     </div>
    //                 )}

    //                 {teamMember.manualEnterAddressFlag && (
    //                     <div>
    //                         <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
    //                         onClick={() => {
    //                             this.onChangeTeamMemberValue(false, "manualEnterAddressFlag", teamMemberIndex)
    //                             this.onChangeTeamMemberValue(true,"addNewAddressFlag",teamMemberIndex);
    //                         }}
    //                         >{AppConstants.returnToAddressSearch}</div>
    //                         <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.enterAddress}</div>
    //                         <Form.Item >
    //                             {getFieldDecorator(`teamMemberStreet1${teamMemberIndex}`, {
    //                                 rules: [{ required: true, message: ValidationConstants.addressField}],
    //                             })(
    //                                 <InputWithHead
    //                                     required={"required-field pt-0 pb-0"}
    //                                     heading={AppConstants.addressOne}
    //                                     placeholder={AppConstants.addressOne}
    //                                     onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "street1",teamMemberIndex)} 
    //                                     setFieldsValue={teamMember.street1}
    //                                 />
    //                             )}
    //                         </Form.Item>
    //                         <InputWithHead
    //                             heading={AppConstants.addressTwo}
    //                             placeholder={AppConstants.addressTwo}
    //                             onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "street2",teamMemberIndex)} 
    //                             value={teamMember.street2}
    //                         />
    //                         <InputWithHead heading={AppConstants.suburb} required={"required-field"}/>
    //                         <Form.Item >
    //                             {getFieldDecorator(`teamMemberSuburb${teamMemberIndex}`, {
    //                                 rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
    //                             })(
    //                                 <InputWithHead
    //                                     placeholder={AppConstants.suburb}
    //                                     onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "suburb",teamMemberIndex)} 
    //                                     setFieldsValue={teamMember.suburb}
    //                                 />
    //                             )}
    //                         </Form.Item>
    //                         <div className="row">
    //                             <div className="col-sm-12 col-md-6">
    //                                 <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
    //                                 <Form.Item >
    //                                     {getFieldDecorator(`teamMemberStateRefId${teamMemberIndex}`, {
    //                                         rules: [{ required: true, message: ValidationConstants.stateField[0] }],
    //                                     })(
    //                                         <Select
    //                                             style={{ width: "100%" }}
    //                                             placeholder={AppConstants.state}
    //                                             onChange={(e) => this.onChangeTeamMemberValue(e, "stateRefId",teamMemberIndex)}
    //                                             setFieldsValue={teamMember.stateRefId}>
    //                                             {stateList.length > 0 && stateList.map((item) => (
    //                                                 < Option key={item.id} value={item.id}> {item.name}</Option>
    //                                             ))}
    //                                         </Select>
    //                                     )}
    //                                 </Form.Item>
    //                             </div>
    //                             <div className="col-sm-12 col-md-6">
    //                                 <InputWithHead heading={AppConstants.postCode}   required={"required-field"}/>
    //                                 <Form.Item >
    //                                     {getFieldDecorator(`teamMemberPostalCode${teamMemberIndex}`, {
    //                                         rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
    //                                     })(
    //                                         <InputWithHead
    //                                             required={"required-field pt-0 pb-0"}
    //                                             placeholder={AppConstants.postcode}
    //                                             maxLength={4}
    //                                             onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "postalCode",teamMemberIndex)} 
    //                                             setFieldsValue={teamMember.postalCode}
    //                                         />
    //                                     )}
    //                                 </Form.Item>
    //                             </div>
    //                         </div>
    //                         <InputWithHead heading={AppConstants.country}   required={"required-field"}/>
    //                         <Form.Item >
    //                             {getFieldDecorator(`teamMemberCountryRefId${teamMemberIndex}`, {
    //                                 rules: [{ required: true, message: ValidationConstants.countryField[0] }],
    //                             })(
    //                             <Select
    //                                 style={{ width: "100%" }}
    //                                 placeholder={AppConstants.country}
    //                                 onChange={(e) => this.onChangeTeamMemberValue(e, "countryRefId",teamMemberIndex)}
    //                                 setFieldsValue={teamMember.countryRefId}>
    //                                 {countryList.length > 0 && countryList.map((item) => (
    //                                     < Option key={item.id} value={item.id}> {item.description}</Option>
    //                                 ))}
    //                             </Select>
    //                             )}
    //                         </Form.Item>
    //                     </div>
    //                 )} 
    //             </div>
    //         )
    //     }catch(ex){
    //         console.log("Error in teamMemberAddressView::"+ex)
    //     }
    // }

    // teamMemberParentOrGuardianAddressView = (parent, parentIndex, getFieldDecorator,teamMemberIndex) => {
    //     try{
    //         const { stateList, countryList } = this.props.commonReducerState;
    //         return(
    //             <div>   
    //                 {parent.addNewAddressFlag && (
    //                     <div>
    //                         <div className="form-heading" 
    //                         style={{paddingBottom: "0px",marginBottom: "-20px",marginTop: "20px"}}>{AppConstants.findAddress}</div>
    //                         <div>
    //                             <Form.Item name="addressSearch">
    //                                 <PlacesAutocomplete
    //                                     defaultValue={this.getAddress(parent)}
    //                                     heading={AppConstants.addressSearch}
    //                                     required
    //                                     error={this.state.searchAddressError}
    //                                     onBlur={() => { this.setState({searchAddressError: ''})}}
    //                                     onSetData={(e)=>this.teamMemberAddressAutoComplete(e,"teamMemberParent",teamMemberIndex,parentIndex)}
    //                                 />
    //                             </Form.Item> 
    //                             <div className="orange-action-txt" style={{marginTop: "10px"}}
    //                             onClick={() => {
    //                                 this.onChangeSetTeamMemberParentValue(true, "manualEnterAddressFlag",parentIndex, teamMemberIndex)
    //                                 this.onChangeSetTeamMemberParentValue(false,"addNewAddressFlag",parentIndex,teamMemberIndex);
    //                             }}
    //                             >{AppConstants.enterAddressManually}</div>	 
    //                         </div> 
    //                     </div>
    //                 )}

    //                 {parent.manualEnterAddressFlag && (
    //                     <div>
    //                         <div className="orange-action-txt" style={{marginTop: "20px",marginBottom: "10px"}}
    //                         onClick={() => {
    //                             this.onChangeSetTeamMemberParentValue(false, "manualEnterAddressFlag",parentIndex, teamMemberIndex)
    //                             this.onChangeSetTeamMemberParentValue(true,"addNewAddressFlag",parentIndex,teamMemberIndex);
    //                         }}
    //                         >{AppConstants.returnToAddressSearch}</div>
    //                         <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.enterAddress}</div>
    //                         <Form.Item >
    //                             {getFieldDecorator(`teamMemberParentStreet1${teamMemberIndex}${parentIndex}`, {
    //                                 rules: [{ required: true, message: ValidationConstants.addressField}],
    //                             })(
    //                                 <InputWithHead
    //                                     required={"required-field pt-0 pb-0"}
    //                                     heading={AppConstants.addressOne}
    //                                     placeholder={AppConstants.addressOne}
    //                                     onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "street1",parentIndex,teamMemberIndex)} 
    //                                     setFieldsValue={parent.street1}
    //                                 />
    //                             )}
    //                         </Form.Item>
    //                         <InputWithHead
    //                             heading={AppConstants.addressTwo}
    //                             placeholder={AppConstants.addressTwo}
    //                             onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "street2",parentIndex,teamMemberIndex)} 
    //                             value={parent.street2}
    //                         />
    //                         <InputWithHead heading={AppConstants.suburb} required={"required-field"}/>
    //                         <Form.Item >
    //                             {getFieldDecorator(`teamMemberParentSuburb${teamMemberIndex}${parentIndex}`, {
    //                                 rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
    //                             })(
    //                                 <InputWithHead
    //                                     placeholder={AppConstants.suburb}
    //                                     onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "suburb",parentIndex,teamMemberIndex)} 
    //                                     setFieldsValue={parent.suburb}
    //                                 />
    //                             )}
    //                         </Form.Item>
    //                         <div className="row">
    //                             <div className="col-sm-12 col-md-6">
    //                                 <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
    //                                 <Form.Item >
    //                                     {getFieldDecorator(`teamMemberParentStateRefId${teamMemberIndex}${parentIndex}`, {
    //                                         rules: [{ required: true, message: ValidationConstants.stateField[0] }],
    //                                     })(
    //                                         <Select
    //                                             style={{ width: "100%" }}
    //                                             placeholder={AppConstants.state}
    //                                             onChange={(e) => this.onChangeSetTeamMemberParentValue(e, "stateRefId",parentIndex,teamMemberIndex)}
    //                                             setFieldsValue={parent.stateRefId}>
    //                                             {stateList.length > 0 && stateList.map((item) => (
    //                                                 < Option key={item.id} value={item.id}> {item.name}</Option>
    //                                             ))}
    //                                         </Select>
    //                                     )}
    //                                 </Form.Item>
    //                             </div>
    //                             <div className="col-sm-12 col-md-6">
    //                                 <InputWithHead heading={AppConstants.postCode}   required={"required-field"}/>
    //                                 <Form.Item >
    //                                     {getFieldDecorator(`teamMemberParentPostalCode${teamMemberIndex}${parentIndex}`, {
    //                                         rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
    //                                     })(
    //                                         <InputWithHead
    //                                             required={"required-field pt-0 pb-0"}
    //                                             placeholder={AppConstants.postcode}
    //                                             maxLength={4}
    //                                             onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "postalCode",parentIndex,teamMemberIndex)} 
    //                                             setFieldsValue={parent.postalCode}
    //                                         />
    //                                     )}
    //                                 </Form.Item>
    //                             </div>
    //                         </div>
    //                         <InputWithHead heading={AppConstants.country}   required={"required-field"}/>
    //                         <Form.Item >
    //                             {getFieldDecorator(`teamMemberParentCountryRefId${teamMemberIndex}${parentIndex}`, {
    //                                 rules: [{ required: true, message: ValidationConstants.countryField[0] }],
    //                             })(
    //                             <Select
    //                                 style={{ width: "100%" }}
    //                                 placeholder={AppConstants.country}
    //                                 onChange={(e) => this.onChangeSetTeamMemberParentValue(e, "countryRefId",parentIndex,teamMemberIndex)}
    //                                 setFieldsValue={parent.countryRefId}>
    //                                 {countryList.length > 0 && countryList.map((item) => (
    //                                     < Option key={item.id} value={item.id}> {item.description}</Option>
    //                                 ))}
    //                             </Select>
    //                             )}
    //                         </Form.Item>
    //                     </div>
    //                 )} 
    //             </div>
    //         )
    //     }catch(ex){
    //         console.log("Error in teamMemberParentOrGuardianAddressView::"+ex);
    //     }
    // }

    teamMemberParentOrGuardianView = (parent,parentIndex,teamMember,teamMemberIndex,getFieldDecorator) => {
        try{
            return(
                <div>
                    <div key={"parent" + parentIndex} className="light-grey-border-box">
                        {(teamMember.parentOrGuardian.length != 1) && (
                            <div className="orange-action-txt" style={{ marginTop: "30px" }}
                                onClick={() => { this.addTeamMemberParent("remove", teamMemberIndex, parentIndex ) }}
                            >{AppConstants.cancel}
                            </div>
                        )}
                        <div className="form-heading"
                            style={(teamMember.parentOrGuardian.length != 1) ?
                                { paddingBottom: "0px", marginTop: "10px" } :
                                { paddingBottom: "0px", marginTop: "30px" }}>
                            {AppConstants.newParentOrGuardian}
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <Form.Item>
                                    {getFieldDecorator(`teamMemberParentFirstName${teamMemberIndex}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.firstName}
                                            placeholder={AppConstants.firstName}
                                            onChange={(e) => this.onChangeSetTeamMemberParentValue(captializedString(e.target.value), "firstName", parentIndex, teamMemberIndex)}
                                            setFieldsValue={parent.firstName}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                [`teamMemberParentFirstName${teamMemberIndex}${parentIndex}`]: captializedString(i.target.value)
                                            })}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <Form.Item>
                                    {getFieldDecorator(`teamMemberParentMiddleName${teamMemberIndex}${parentIndex}`, {
                                        rules: [{ required: false }],
                                    })(
                                        <InputWithHead
                                            required={"pt-0 pb-0"}
                                            heading={AppConstants.middleName}
                                            placeholder={AppConstants.middleName}
                                            onChange={(e) => this.onChangeSetTeamMemberParentValue(captializedString(e.target.value), "middleName", parentIndex,teamMemberIndex)}
                                            setFieldsValue={parent.middleName}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                [`teamMemberParentMiddleName${teamMemberIndex}${parentIndex}`]: captializedString(i.target.value)
                                            })}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-12 col-md-12">
                                <Form.Item>
                                    {getFieldDecorator(`teamMemberParentLastName${teamMemberIndex}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.lastName}
                                            placeholder={AppConstants.lastName}
                                            onChange={(e) => this.onChangeSetTeamMemberParentValue(captializedString(e.target.value), "lastName", parentIndex, teamMemberIndex)}
                                            setFieldsValue={parent.lastName}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                [`teamMemberParentLastName${teamMemberIndex}${parentIndex}`]: captializedString(i.target.value)
                                            })}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-6">
                                <Form.Item>
                                    {getFieldDecorator(`teamMemberParentMobileNumber${teamMemberIndex}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.contactField }],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.mobile}
                                            placeholder={AppConstants.mobile}
                                            onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "mobileNumber", parentIndex,teamMemberIndex)}
                                            setFieldsValue={parent.mobileNumber}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-6">
                                <Form.Item>
                                    {getFieldDecorator(`teamMemberParentEmail${teamMemberIndex}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.emailField[0] },
                                        {
                                            type: "email",
                                            pattern: new RegExp(AppConstants.emailExp),
                                            message: ValidationConstants.email_validation
                                        }],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.email}
                                            placeholder={AppConstants.email}
                                            onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "email", parentIndex,teamMemberIndex)}
                                            setFieldsValue={parent.email}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        {/* <Checkbox
                            className="single-checkbox"
                            checked={parent.isSameAddress}
                            onChange={e => this.onChangeSetTeamMemberParentValue(e.target.checked, "isSameAddress", parentIndex,teamMemberIndex)} >
                            {AppConstants.sameAddressAsTeamMember}
                        </Checkbox>
                        {!parent.isSameAddress && (
                            <div>{this.teamMemberParentOrGuardianAddressView(parent, parentIndex, getFieldDecorator,teamMemberIndex)}</div>
                        )} */}
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in teamMemberParentGuardianView::"+ex)
        }
    }

    teamMemberView = (teamMember,teamMemberIndex,getFieldDecorator) => {
        const { teamRegistrationObj } = this.props.teamRegistrationState;
        const { genderList } = this.props.commonReducerState;
        let membershipProductTypes = teamMember.membershipProductTypes.filter(x => x.competitionMembershipProductId == teamRegistrationObj.competitionMembershipProductId);
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
                    {(membershipProductTypes || []).map((product, productIndex) => (
                        <Checkbox 
                        className="py-2"
                        checked={product.isChecked}
                        key={product.competitionMembershipProductTypeId}
                        onChange={(e) => {
                            let prodIndexTemp = teamMember.membershipProductTypes.findIndex(x => x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId && x.competitionMembershipProductId === product.competitionMembershipProductId);
                            this.onChangeTeamMemberValue(e.target.checked,"membershipProductTypes",teamMemberIndex,prodIndexTemp)
                        }}>
                            {product.productTypeName}
                        </Checkbox>
                    ))}
                    {this.showMemberTypeValidation(teamMember) && this.state.buttonSubmitted && (
                            <div style={{color:"var(--app-red)"}}>
                                {ValidationConstants.memberTypeIsRequired}
                            </div>   
                        )                           
                    }
                  
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
                                        onChange={(e,f) => this.dateConversion(f, "dateOfBirth","teamMember",teamMemberIndex)}
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
                                    rules: [{ required: true, message: ValidationConstants.emailField[0] },
                                    {
                                        type: "email",
                                        pattern: new RegExp(AppConstants.emailExp),
                                        message: ValidationConstants.email_validation
                                    }],
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
                    {teamMember.membershipProductTypes.find(x => x.isChecked == true) && (
                        <Checkbox
                            className="single-checkbox"
                            checked={teamMember.payingFor == 1 ? true : false}
                            onChange={e => {
                                this.onChangeTeamMemberValue(e.target.checked ? 1 : 0, "payingFor", teamMemberIndex)
                                this.teamMemberAddingProcess(teamMember.dateOfBirth,e.target.checked ? 1 : 0,teamMemberIndex)
                            }}>
                            {AppConstants.payingForMember}
                        </Checkbox>
                    )}
                    {/* <div>{this.teamMemberAddressView(teamMember,teamMemberIndex,getFieldDecorator)}</div> */}
                    {isArrayNotEmpty(teamMember.parentOrGuardian) && (
                        <div>
                            <div className="form-heading" style={{ paddingBottom: "0px",marginTop: 20 }}>{AppConstants.parentOrGuardianDetail}</div>
                            {getAge(teamRegistrationObj.dateOfBirth) >= 18 && 
                                <Checkbox
                                    className="single-checkbox"
                                    checked={teamMember.isRegistererAsParent == 1 ? true : false}
                                    onChange={e => this.onChangeTeamMemberValue(e.target.checked ? 1 : 0, "isRegistererAsParent", teamMemberIndex)}>
                                        {AppConstants.teamMemberParentCheck}
                                </Checkbox>
                            }
                            {teamMember.isRegistererAsParent == 0 ? (
                                <div>
                                    {(teamMember.parentOrGuardian || []).map((parent,parentIndex) => (
                                        <div>{this.teamMemberParentOrGuardianView(parent,parentIndex,teamMember,teamMemberIndex,getFieldDecorator)}</div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {(teamMember.parentOrGuardian || []).slice(1,teamMember.parentOrGuardian.length).map((parent,parentIndex) => (
                                        <div>{this.teamMemberParentOrGuardianView(parent,parentIndex+1,teamMember,teamMemberIndex,getFieldDecorator)}</div>
                                    ))}
                                </div>
                            )}
                            <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                    onClick={() => { this.addTeamMemberParent("add",teamMemberIndex) }}
                                >+ {AppConstants.addNewParentGaurdian}</div>
                        </div>
                    )}

                    {getAge(moment(teamMember.dateOfBirth).format("MM-DD-YYYY")) >= 18 && teamMember.payingFor == 1 &&(
                            <div>
                            {teamMember.dateOfBirth && (
                                <div>{this.teamMemberEmergencyContactView(teamMemberIndex, getFieldDecorator)}</div>
                            )}
                        </div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in teamMemberView::"+ex);
        }
    }

    parentOrGuardianAddressView = (parent, parentIndex, getFieldDecorator) => {
        try {
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            const { stateList, countryList } = this.props.commonReducerState;
            // const { userInfo } = this.props.userRegistrationState;
            // let user = deepCopyFunction(userInfo).find(x => x.id == registrationObj.userId);
            // let selectAddressDropDownList = user && this.getSelectAddressDropdown(user);
            //let selectAddressDropDownUser = selectAddressDropDownList && selectAddressDropDownList.find(x => x.userId == parent.userId);
            // let newUser = (registrationObj.userId == -1 || registrationObj.userId == -2 || registrationObj.userId == null) ? true : false;
            // let hasAddressForExistingUserFlag = (selectAddressDropDownUser?.stateRefId) ? true : false;
            return (
                <div>
                    {/* {parent.selectAddressFlag && (
                        <div>
                            <div className="form-heading"
                                style={{ paddingBottom: "0px", marginTop: "30px" }}>{AppConstants.address}</div>
                            <InputWithHead heading={AppConstants.selectAddress} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`parentSelectAddress${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.selectAddressRequired }],
                                })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.select}
                                        onChange={(e) => this.onChangeSetParentValue(e, "addOrRemoveAddressBySelect", parentIndex)}
                                        setFieldsValue={this.getAddress(user)}>
                                        {(selectAddressDropDownList || []).map((item) => (
                                            <Option key={item.userId} value={item.userId}> {this.getAddress(item)}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParentValue(true, "addNewAddressFlag", parentIndex)
                                    this.onChangeSetParentValue(false, "selectAddressFlag", parentIndex);
                                    this.onChangeSetParentValue(null, "addOrRemoveAddressBySelect", parentIndex)
                                }}
                            >+ {AppConstants.addNewAddress}</div>
                        </div>
                    )} */}
                    {parent.addNewAddressFlag && (
                        <div>
                            {/* {!newUser && hasAddressForExistingUserFlag && (
                                <div className="orange-action-txt" style={{ marginTop: "20px", marginBottom: "10px" }}
                                    onClick={() => {
                                        this.onChangeSetParentValue(true, "selectAddressFlag", parentIndex);
                                        this.onChangeSetParentValue(false, "addNewAddressFlag", parentIndex);
                                        setTimeout(() => {
                                            this.setYourDetailsParentAddressFormFields("selectAddressFlag", parent, parentIndex);
                                        }, 300)
                                    }}
                                >{AppConstants.returnToSelectAddress}</div>
                            )} */}
                            <div 
                            className="form-heading"
                            style={{ marginTop: "20px", marginBottom: "-20px" }}>{AppConstants.findAddress}</div>
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
                                    onSetData={(e) => this.handlePlacesAutocomplete(e, "parent", parentIndex)}
                                />
                            </Form.Item>
                            <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParentValue(true, "manualEnterAddressFlag", parentIndex);
                                    this.onChangeSetParentValue(false, "addNewAddressFlag", parentIndex);
                                    setTimeout(() => {
                                        this.setYourDetailsParentAddressFormFields("manualEnterAddressFlag", parent, parentIndex)
                                    }, 300);
                                }}
                            >{AppConstants.enterAddressManually}</div>
                        </div>
                    )}
                    {parent.manualEnterAddressFlag && (
                        <div>
                            <div className="orange-action-txt"
                                style={{ marginTop: "20px", marginBottom: "10px" }}
                                onClick={() => {
                                    this.onChangeSetParentValue(false, "manualEnterAddressFlag", parentIndex);
                                    this.onChangeSetParentValue(true, "addNewAddressFlag", parentIndex);
                                    setTimeout(() => {
                                        this.setYourDetailsParentAddressFormFields("addNewAddressFlag", parent, parentIndex)
                                    }, 300);
                                }}
                            >{AppConstants.returnToAddressSearch}</div>
                            <div className="form-heading"
                                style={{ paddingBottom: "0px" }}>{AppConstants.enterAddress}</div>
                            <Form.Item>
                                {getFieldDecorator(`parentStreet1${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.addressOne}
                                        placeholder={AppConstants.addressOne}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "street1", parentIndex)}
                                        setFieldsValue={parent.street1}
                                    />
                                )}
                            </Form.Item>
                            <InputWithHead
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "street2", parentIndex)}
                                value={parent.street2}
                            />
                            <InputWithHead heading={AppConstants.suburb} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`parentSuburb${parentIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                    <InputWithHead
                                        // required={"required-field pt-0 pb-0"}
                                        // heading={AppConstants.suburb}
                                        placeholder={AppConstants.suburb}
                                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "suburb", parentIndex)}
                                        setFieldsValue={parent.suburb}
                                    />
                                )}
                            </Form.Item>
                            <div className="row">
                                <div className="col-sm-12 col-lg-6">
                                    <InputWithHead heading={AppConstants.state} required={"required-field"} />
                                    <Form.Item>
                                        {getFieldDecorator(`parentStateRefId${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                        })(
                                            <Select
                                                style={{ width: "100%" }}
                                                placeholder={AppConstants.state}
                                                onChange={(e) => this.onChangeSetParentValue(e, "stateRefId", parentIndex)}
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
                                    <InputWithHead heading={AppConstants.postCode} required={"required-field"} />
                                    <Form.Item>
                                        {getFieldDecorator(`parentPostalCode${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                placeholder={AppConstants.postcode}
                                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "postalCode", parentIndex)}
                                                setFieldsValue={parent.postalCode}
                                                maxLength={4}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <InputWithHead heading={AppConstants.country} required={"required-field"} />
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

        } catch (ex) {
            console.log("Error in parentOrGuardianAddressView" + ex);
        }
    }

    parentOrGuardianView = (getFieldDecorator) => {
        const { teamRegistrationObj } = this.props.teamRegistrationState;
        return (
            <div className="registration-form-view">
                <div className="form-heading" style={{ paddingBottom: "0px" }}>{AppConstants.parentOrGuardianDetail}</div>
                {/* {isArrayNotEmpty(parents) && (
                    <div>
                        <InputWithHead heading={AppConstants.selectParentOrGuardian} />
                        <Select
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(e) => this.onChangeSetParticipantValue(e, "tempParents")} >
                            {parents.length > 0 && parents.map((tParent, tpIndex) => (
                                <Option key={tParent.email} value={tParent.email}>
                                    {tParent.firstName + " " + tParent.lastName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )} */}

                {(teamRegistrationObj.parentOrGuardian || []).map((parent, parentIndex) => {
                    return (
                        <div key={"parent" + parentIndex} className="light-grey-border-box">
                            {(teamRegistrationObj.parentOrGuardian.length != 1) && (
                                <div className="orange-action-txt" style={{ marginTop: "30px" }}
                                    onClick={() => { this.addParent("remove", parentIndex) }}
                                >{AppConstants.cancel}
                                </div>
                            )}
                            <div className="form-heading"
                                style={(teamRegistrationObj.parentOrGuardian.length != 1) ?
                                    { paddingBottom: "0px", marginTop: "10px" } :
                                    { paddingBottom: "0px", marginTop: "30px" }}>
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
                                                onChange={(e) => this.onChangeSetParentValue(captializedString(e.target.value), "firstName", parentIndex)}
                                                setFieldsValue={parent.firstName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    [`parentFirstName${parentIndex}`]: captializedString(i.target.value)
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
                                                onChange={(e) => this.onChangeSetParentValue(captializedString(e.target.value), "middleName", parentIndex)}
                                                setFieldsValue={parent.middleName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    [`parentMiddleName${parentIndex}`]: captializedString(i.target.value)
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
                                                onChange={(e) => this.onChangeSetParentValue(captializedString(e.target.value), "lastName", parentIndex)}
                                                setFieldsValue={parent.lastName}
                                                onBlur={(i) => this.props.form.setFieldsValue({
                                                    [`parentLastName${parentIndex}`]: captializedString(i.target.value)
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
                                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "mobileNumber", parentIndex)}
                                                setFieldsValue={parent.mobileNumber}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-sm-6">
                                    <Form.Item>
                                        {getFieldDecorator(`parentEmail${parentIndex}`, {
                                            rules: [{ required: true, message: ValidationConstants.emailField[0] },
                                            {
                                                type: "email",
                                                pattern: new RegExp(AppConstants.emailExp),
                                                message: ValidationConstants.email_validation
                                            }],
                                        })(
                                            <InputWithHead
                                                required={"required-field pt-0 pb-0"}
                                                heading={AppConstants.email}
                                                placeholder={AppConstants.email}
                                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "email", parentIndex)}
                                                setFieldsValue={parent.email}
                                            />
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                            <Checkbox
                                className="single-checkbox"
                                checked={parent.isSameAddress}
                                onChange={e => this.onChangeSetParentValue(e.target.checked, "isSameAddress", parentIndex)} >
                                {AppConstants.sameAddress}
                            </Checkbox>
                            {!parent.isSameAddress && (
                                <div>{this.parentOrGuardianAddressView(parent, parentIndex, getFieldDecorator)}</div>
                            )}
                        </div>
                    );
                })}
                <div className="orange-action-txt" style={{ marginTop: "10px" }}
                    onClick={() => { this.addParent("add") }}
                >+ {AppConstants.addNewParentGaurdian}</div>
            </div>
        )
    }

    emergencyContactView = (getFieldDecorator) => {
        try {
            let { teamRegistrationObj } = this.props.teamRegistrationState;
            return (
                <div className="registration-form-view">
                    <div className="form-heading">{AppConstants.emergencyContact}</div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`emergencyFirstName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.firstName}
                                        placeholder={AppConstants.firstName}
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "emergencyFirstName")}
                                        setFieldsValue={teamRegistrationObj.emergencyFirstName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`emergencyFirstName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`emergencyLastName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.lastName}
                                        placeholder={AppConstants.lastName}
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "emergencyLastName")}
                                        setFieldsValue={teamRegistrationObj.emergencyLastName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`emergencyLastName`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`emergencyContactNumber`, {
                                    rules: [{ required: true, message: ValidationConstants.pleaseEnterMobileNumber }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.mobileNumber}
                                        placeholder={AppConstants.mobileNumber}
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "emergencyContactNumber")}
                                        setFieldsValue={teamRegistrationObj.emergencyContactNumber}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`emergencyContactNumber`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>
            )
        } catch (ex) {
            console.log("Error in emergencyContactView::" + ex)
        }
    }

    teamMemberEmergencyContactView = (teamMemberIndex,getFieldDecorator) => {
        try {
            let { teamRegistrationObj } = this.props.teamRegistrationState;
            return (
                <div className="registration-form-view">
                    <div className="form-heading">{AppConstants.emergencyContact}</div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`teamMemberEmergencyFirstName${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.firstName}
                                        placeholder={AppConstants.firstName}
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "emergencyFirstName", teamMemberIndex)}
                                        setFieldsValue={teamRegistrationObj.emergencyFirstName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`teamMemberEmergencyFirstName${teamMemberIndex}`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`teamMemberEmergencyLastName${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.lastName}
                                        placeholder={AppConstants.lastName}
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "emergencyLastName", teamMemberIndex)}
                                        setFieldsValue={teamRegistrationObj.emergencyLastName}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`teamMemberEmergencyLastName${teamMemberIndex}`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <Form.Item>
                                {getFieldDecorator(`teamMemberEmergencyContactNumber${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.pleaseEnterMobileNumber }],
                                })(
                                    <InputWithHead
                                        required={"required-field"}
                                        heading={AppConstants.mobileNumber}
                                        placeholder={AppConstants.mobileNumber}
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "emergencyContactNumber", teamMemberIndex)}
                                        setFieldsValue={teamRegistrationObj.emergencyContactNumber}
                                        onBlur={(i) => this.props.form.setFieldsValue({
                                            [`teamMemberEmergencyContactNumber${teamMemberIndex}`]: captializedString(i.target.value)
                                        })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>
            )
        } catch (ex) {
            console.log("Error in emergencyContactView::" + ex)
        }
    }


    teamDetailsView = (getFieldDecorator) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            console.log("teamRegistrationObj",teamRegistrationObj)
            return(
                <div className="registration-form-view">
                    <div className="row mx-0">
                        <div className="col-sm-12 col-lg-4 pl-0" style={{ display: 'flex', alignItems: 'center'}}>
                            <div className="form-heading">{AppConstants.teamDetails}</div>
                        </div>
                        <div className="col-sm-12 col-lg-8" style={{ padding: 0 }}>
                            {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (
                                <div className="team-details-actions">
                                    <NavLink to="/templates/wsa-import-team-player.csv" target="_blank" download>
                                        <Button 
                                            style={{marginRight: "15px",marginBottom: 10, textTransform: "uppercase"}}
                                            className="white-button">{AppConstants.downloadTemplate}
                                        </Button>
                                    </NavLink>
                                    <label 
                                        for={"teamPlayerUpload"}
                                        style={{textTransform: "uppercase",padding: '12px'}}
                                        className="white-button">{AppConstants.importTeam}
                                    </label>
                                    <CSVReader
                                        inputId={"teamPlayerUpload"}
                                        inputStyle={{display:'none'}}
                                        parserOptions={parseOptions}
                                        onFileLoaded={(e) => this.readTeamPlayersCSV(e)}
                                    />
                                </div>  
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
                                onBlur = {(e) => this.showTeamNameValidation(e.target.value)}
                            />
                        )}
                    </Form.Item>
                    {this.props.teamRegistrationState.teamNameValidationResultCode == 2 &&                
                        <div style={{color:"var(--app-red)"}}>
                            {AppConstants.teamAlreadyExists}
                        </div>                         
                    }
                    
                    {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (teamRegistrationObj.teamMembers || []).map((teamMember,teamMemberIndex) => (
                        <div>{this.teamMemberView(teamMember,teamMemberIndex,getFieldDecorator)}</div>
                    ))}
                    {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (
                         <div className="orange-action-txt" 
                         style={{marginTop: "25px"}}
                         onClick={() => {
                             this.onChangeSetTeamValue(null,"addTeamMember");
                         }}><span className="add-another-button-border">+ {AppConstants.addTeamMember}</span></div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in teamDetailsView::"+ex);
        }
    }

    participantDetailsStepView = (getFieldDecorator) => {
        const { teamRegistrationObj } = this.props.teamRegistrationState; 
        // console.log("teamRe",teamRegistrationObj)
        try{
            return(
                <div>
                    <div>{this.addedCompetitionView()}</div>
                    <div>{this.yourDetailsView(getFieldDecorator)}</div>
                    {(getAge(teamRegistrationObj.dateOfBirth) < 18) ? (
                        <div>{this.parentOrGuardianView(getFieldDecorator)}</div>
                    ) : (
                        <div>
                            {teamRegistrationObj.dateOfBirth && (
                                <div>{this.emergencyContactView(getFieldDecorator)}</div>
                            )}
                        </div>
                    )}
                    <div>{this.teamDetailsView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in participantDetailsStepView::"+ex);
        }
    }

    walkingNetballQuestions = (getFieldDecorator) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            return(
                <div>
                    <InputWithHead required={"pt-0 required-field"} heading={AppConstants.haveHeartTrouble}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoHeartTrouble`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"heartTrouble","walkingNetball")} 
                                setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.heartTrouble}
                                >
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                         )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.havePainInHeartOrChest} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoChestPain`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "chestPain","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.chestPain}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.haveSpellsOfServerDizziness} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoFaintOrSpells`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "faintOrSpells","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.faintOrSpells}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.hasBloodPressureHigh} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoBloodPressure`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "bloodPressure","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.bloodPressure}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.hasBoneProblems} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoJointOrBoneProblem`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "jointOrBoneProblem","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.jointOrBoneProblem}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.whyShouldNotTakePhysicalActivity} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPhysicalActivity`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "physicalActivity","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.physicalActivity}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.pregnentInLastSixMonths} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoPregnant`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "pregnant","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.pregnant}
                            >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.sufferAnyProblems} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoLowerBackProblem`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                        })(  
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "lowerBackProblem","walkingNetball")} 
                            setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetball.lowerBackProblem}
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

    teamInfoView = () => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            let totalPlayer =  teamRegistrationObj.teamMembers.length
            if(teamRegistrationObj.registeringAsAPlayer == 1 || teamRegistrationObj.personRoleRefId == 4 || teamRegistrationObj.personRoleRefId == 2){
                 totalPlayer = teamRegistrationObj.teamMembers.length + 1
            }
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
                                {AppConstants.team},{totalPlayer} {AppConstants.members}
                            </div>
                        </div>
                        <div className="orange-action-txt" style={{marginLeft: "auto"}}
                            onClick={() => this.selectAnother()}>{AppConstants.selectAnotherTeam}</div>
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
                firebirdPlayerList,otherSportsList,heardByList,accreditationUmpireList,accreditationCoachList,walkingNetballQuesList,schoolList } = this.props.commonReducerState;
            let yearsOfPlayingList = [{years: '2'},{years: '3'},{years: '4'},{years: '5'},{years: '6'},{years: '7'},{years: '8'},{years: '9'},{years: '10+'}];
            let hasOtherParticipantSports = teamRegistrationObj.additionalInfo.otherSportsInfo.find(x => x == "14");
            let walkingNetballQuesKeys = Object.keys(teamRegistrationObj.additionalInfo.walkingNetball);
            let hasAnyOneYes = walkingNetballQuesKeys.find(key => teamRegistrationObj.additionalInfo.walkingNetball[key] == 1);
            let childrenCheckExpiryDate = teamRegistrationObj.additionalInfo.childrenCheckExpiryDate ? moment(teamRegistrationObj.additionalInfo.childrenCheckExpiryDate,"MM-DD-YYYY") : null;
            let accreditationCoachExpiryDate = teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate ? moment(teamRegistrationObj.additionalInfo.accreditationCoachExpiryDate,"MM-DD-YYYY") : null;
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
                            onChange={(e) => this.onChangeSetAdditionalInfo(e,"countryRefId")}
                            setFieldsValue={teamRegistrationObj.additionalInfo.countryRefId}>
                            {countryList.length > 0 && countryList.map((item) => (
                                < Option key={item.id} value={item.id}> {item.description}</Option>
                            ))}
                        </Select>
                      )}
                      </Form.Item>
                    <InputWithHead heading={AppConstants.doYouIdentifyAs}/>
                    <Radio.Group
                        className="registration-radio-group"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"identifyRefId")}
                        value={teamRegistrationObj.additionalInfo.identifyRefId}
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
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "existingMedicalCondition")} 
                                setFieldsValue={teamRegistrationObj.additionalInfo.existingMedicalCondition}
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
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "regularMedication")} 
                                setFieldsValue={teamRegistrationObj.additionalInfo.regularMedication}
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
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "injuryInfo")} 
                                setFieldsValue={teamRegistrationObj.additionalInfo.injuryInfo}
                                allowClear
                            />
                        )}
                    </Form.Item>   
                    {/* <InputWithHead heading={AppConstants.alergy} required={"required-field"}/>
                    <Form.Item>
                        {getFieldDecorator(`additionalInfoAllergies`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[4] }],
                        })( 
                            <TextArea
                                placeholder={AppConstants.anyAllergies}
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "allergyInfo")} 
                                setFieldsValue={teamRegistrationObj.additionalInfo.allergyInfo}
                                allowClear
                            />
                        )}
                    </Form.Item>    */}
                    <InputWithHead heading={AppConstants.haveDisability} required={"required-field"}/>
                    {/* <Form.Item>
                        {getFieldDecorator(`additionalInfoHaveDisablity`, {
                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[5] }],
                        })(  */}
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isDisability")} 
                                value={teamRegistrationObj.additionalInfo.isDisability}
                                >
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                        {/* )}
                    </Form.Item>   */}
                    {teamRegistrationObj.additionalInfo.isDisability == 1 ? 
                        <div>
                            <InputWithHead heading={AppConstants.disabilityCareNumber}/>
                            <Form.Item>
                                {getFieldDecorator(`additionalInfoDisablityCareNumber`, {
                                    rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[5] }],
                                })( 
                                    <InputWithHead  
                                    placeholder={AppConstants.disabilityCareNumber} 
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityCareNumber")}
                                    setFieldsValue={teamRegistrationObj.additionalInfo.disabilityCareNumber}
                                    style={{marginBottom:'15px'}}/>
                                )}
                            </Form.Item>   
                            <InputWithHead heading={AppConstants.typeOfDisability} />
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
                            <InputWithHead heading={AppConstants.teamYouFollow} required={"required-field"}/>
                            <Form.Item>
                                {getFieldDecorator(`additionalInfoTeamYouFollow`, {
                                    rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                                })(  
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182,paddingBottom: "10px" }}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteTeamRefId")}
                                        setFieldsValue={teamRegistrationObj.additionalInfo.favouriteTeamRefId}
                                        >  
                                        {(favouriteTeamsList || []).map((fav, index) => (
                                            <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        {teamRegistrationObj.additionalInfo.favouriteTeamRefId == 6 && (
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.who_fav_bird} />
                                <Form.Item>
                                    {getFieldDecorator(`additionalInfoFavoriteBird`, {
                                        rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[7] }],
                                    })(
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182,paddingBottom: "10px" }}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "favouriteFireBird")}
                                        setFieldsValue={teamRegistrationObj.additionalInfo.favouriteFireBird}
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
                            onChange={(e) => this.onChangeSetAdditionalInfo(e,"otherSportsInfo")}
                            setFieldsValue={teamRegistrationObj.additionalInfo.otherSportsInfo}>
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
                                onChange={(e) => this.onChangeSetAdditionalInfo( e.target.value,"otherSports")} 
                                value={teamRegistrationObj.additionalInfo.otherSports}
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
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByRefId")} 
                                value={teamRegistrationObj.additionalInfo.heardByRefId}
                                >
                                {(heardByList || []).map((heard, index) => (
                                    <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                                ))}
                            </Radio.Group>
                        {/* )}
                    </Form.Item>    */}
                    {teamRegistrationObj.additionalInfo.heardByRefId == 6 && (
                        <div style={{marginTop: "10px"}}>
                            <InputWithHead 
                            placeholder={AppConstants.other} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "heardByOther")}
                            value={teamRegistrationObj.additionalInfo.heardByOther}/>
                        </div>
                    )}

                    {teamRegistrationObj.regSetting.netball_experience == 1 && (
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <InputWithHead heading={AppConstants.firstYearPlayingNetball} />
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "isYearsPlayed")} 
                                    value={teamRegistrationObj.additionalInfo.isYearsPlayed}
                                    >
                                    <Radio value={1}>{AppConstants.yes}</Radio>
                                    <Radio value={0}>{AppConstants.no}</Radio>
                                </Radio.Group>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                {teamRegistrationObj.additionalInfo.isYearsPlayed == 0 && (
                                    <div>
                                        <InputWithHead heading={AppConstants.yearsOfPlayingNetball} />
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
                        </div>
                    )}

                    {(getAge(teamRegistrationObj.dateOfBirth) < 18) && (
                        <div>
                            {teamRegistrationObj.regSetting.school_standard == 1 && (
                                <div>
                                  <InputWithHead heading={AppConstants.schoolYouAttend} />
                                  <Select
                                        showSearch
                                        optionFilterProp="children"
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182}}
                                        onChange={(e) => this.onChangeSetAdditionalInfo(e, "schoolId")}
                                        value={teamRegistrationObj.additionalInfo.schoolId}>  
                                        {(schoolList || []).map((school, index) => (
                                            <Option key={school.id} value={school.id}>{school.name}</Option>
                                        ))}
                                    </Select> 
                                </div>
                            )}

                            {teamRegistrationObj.regSetting.school_grade == 1 && (
                                <div>
                                  <InputWithHead heading={AppConstants.yourSchoolGrade} />
                                  <InputWithHead 
                                     placeholder={AppConstants.schoolGrade} 
                                     onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"schoolGradeInfo")} 
                                         value={teamRegistrationObj.additionalInfo.schoolGradeInfo}
                                     />

                                </div>
                              
                            )}

                            {teamRegistrationObj.regSetting.school_program == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.participatedSchoolProgram}/>
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
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach}/>
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
                            {(teamRegistrationObj.additionalInfo.accreditationLevelCoachRefId != 1 && teamRegistrationObj.additionalInfo.accreditationLevelCoachRefId != null) && (
                                <DatePicker
                                    size="large"
                                    placeholder={AppConstants.expiryDate}
                                    style={{ width: "100%",marginTop: "20px" }}
                                    onChange={(e,f) => this.dateConversion(f, "accreditationCoachExpiryDate","additionalInfo")}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={accreditationCoachExpiryDate}
                                />
                            )}
                        </div>
                    )}
                    
                    {(teamRegistrationObj.personRoleRefId == 2) && (
                        <div>
                            <InputWithHead heading={AppConstants.workingWithChildrenCheckNumber}/>
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
                                        onChange={(e,f) => this.dateConversion(f, "childrenCheckExpiryDate","additionalInfo")}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        value={childrenCheckExpiryDate}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {teamRegistrationObj.walkingNetballFlag == 1 && (
                        <div>
                            <div className="form-heading" style={{marginTop: "40px",paddingBottom: "20px"}}>{AppConstants.walkingNetball2}</div>
                            {this.walkingNetballQuestions(getFieldDecorator)}
                            {hasAnyOneYes && (
                                <div>
                                    <InputWithHead heading={AppConstants.provideFurtherDetails} required={"required-field"}/>
                                    <Form.Item>
                                        {getFieldDecorator(`additionalInfoProvideFurtherDetails`, {
                                            rules: [{ required: true, message: ValidationConstants.additionalInfoQuestions[6] }],
                                        })(  
                                            <InputWithHead 
                                                placeholder={AppConstants.walkingNetball2} 
                                                onChange={(e) => this.onChangeSetAdditionalInfo( e.target.value,"walkingNetballInfo")} 
                                                setFieldsValue={teamRegistrationObj.additionalInfo.walkingNetballInfo}
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
                <div className="registration-form-wrapper">
                    <Steps className="registration-steps" current={this.state.currentStep} onChange={this.onChangeStep}>
                        <Step status={this.state.completedSteps.includes(0) && "finish"} title={AppConstants.selectCompetition}/>
                        <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && "finish"} title={AppConstants.participantDetails}/>
                        <Step status={this.state.completedSteps.includes(0) && this.state.completedSteps.includes(1) && this.state.completedSteps.includes(2) &&"finish"} title={AppConstants.additionalInformation}/>
                    </Steps>
                    {this.stepsContentView(getFieldDecorator)}
                    {this.singleCompModalView()}
                    {this.registrationCapValidationModal()}
                </div>
            )
        }catch(ex){
            console.log("Error in contentView::"+ex);
        }
    }

    footerView = () => {
        try{
            return(
                <div className="form-registration-action">
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

    singleCompModalView = () => {
        let { saveValidationErrorMsg } = this.props.teamRegistrationState;
        let { saveValidationErrorCode } = this.props.teamRegistrationState;
        let errorMsg = saveValidationErrorMsg != null ? saveValidationErrorMsg : [];
        let title = saveValidationErrorCode == 1 ? AppConstants.singleCompetition : AppConstants.userDetailsInvalid;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={title}
                    visible={this.state.singleCompModalVisible}
                    onCancel={() => this.setState({ singleCompModalVisible: false })}
                    footer={[
                        <Button onClick={() => this.setState({ singleCompModalVisible: false })}>
                            {AppConstants.ok}
                        </Button>
                    ]}
                >
                    {(errorMsg || []).map((item, index) => (
                        <p key={index}> {item}</p>
                    ))}
                </Modal>
            </div>
        )
    }

    registrationCapValidationModal = () => {
        const { registrationCapValidationMessage } = this.props.commonReducerState;
        return (
            <div>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.warning}
                    visible={this.state.registrationCapModalVisible}
                    onCancel={() => this.setState({ registrationCapModalVisible: false })}
                    footer={[
                        <Button onClick={() => this.setState({ registrationCapModalVisible: false })}>
                            {AppConstants.ok}
                        </Button>
                    ]}
                >
                     <p> { registrationCapValidationMessage }</p>
                </Modal>
            </div>
        )
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
                        <div>{this.footerView()}</div>
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
        teamRegistrationExpiryCheckAction,
        getSeasonalAndCasualFees,
        getSchoolListAction,
        teamNameValidationAction,
        validateRegistrationCapAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamRegistrationState: state.TeamRegistrationState,
        commonReducerState: state.CommonReducerState,
        userRegistrationstate: state.UserRegistrationState,
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppTeamRegistrationForm));