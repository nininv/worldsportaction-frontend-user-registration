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
    Pagination
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
    membershipProductTeamRegistrationAction,
    selectTeamAction,
    updateTeamRegistrationObjectAction,
    updateTeamRegistrationStateVarAction,
    updateRegistrationTeamMemberAction,
    orgteamRegistrationRegSettingsAction,
    saveTeamInfoAction	, 
    updateTeamAdditionalInfoAction
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
            showFindAnotherCompetitionview: false,
            postalCode: null,
            organisations: [],
            competitions: [],
            allCompetitions: [],
            allCompetitionsByOrgId: [],
            competitionsCountPerPage: 6,
            competitionsCurrentPage: 1
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
            this.props.membershipProductTeamRegistrationAction({});  
            this.setState({getMembershipLoad: true});
        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            let teamRegistrationState = this.props.teamRegistrationState;

            if(!teamRegistrationState.onMembershipLoad && this.state.getMembershipLoad){
                this.props.selectTeamAction();
                this.setState({organisations: teamRegistrationState.membershipProductInfo});
                this.setAllCompetitions(teamRegistrationState.membershipProductInfo);
                this.setState({getMembershipLoad: false});
            }

            if(teamRegistrationState.hasTeamSelected){
                this.setState({showFindAnotherCompetitionview: true});
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
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    onChangeStep = (current) => {
        try{
            if(this.state.enabledSteps.includes(current)){
                this.setState({currentStep: current});
                this.scrollToTop();
            }
            if(current == 0){
                this.setState({submitButtonText: AppConstants.signupToCompetition})
            }else if(current == 1){
                if(this.state.enabledSteps.includes(1)){
                    this.setState({submitButtonText: AppConstants.addPariticipant});
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

    onChangeSetAdditionalInfo = (value,key) => {
        this.props.updateTeamAdditionalInfoAction(key,value);
    }

    getFilteredTeamRegisrationObj = (teamRegistrationObj) => {
        try{
            teamRegistrationObj["existingUserId"] = getUserId() ? Number(getUserId()) : null;
            teamRegistrationObj.registeringYourself = 4;
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
            let { teamRegistrationObj,membershipProductInfo } = this.props.teamRegistrationState;
            let organisationInfo = membershipProductInfo.find(x => x.organisationUniqueKey == this.state.organisationId);
            return(
                <div className="registration-form-view">
                    <div style={{display: "flex",alignItems: "center" }}>
                        <div className="form-heading">{AppConstants.findACompetition}</div>
                        {teamRegistrationObj?.competitionInfo && (
                            <div className="orange-action-txt" 
                            style={{marginLeft: "auto",paddingBottom: "7.5px"}}
                            onClick={() => this.setState({showFindAnotherCompetitionview: false})}>{AppConstants.cancel}</div>
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
                                    <div style={{marginLeft: "20px"}}><img style={{height: "20px",width: "20px",marginRight: "15px"}} src={AppImages.callAnswer}/>{organisationInfo.mobileNumber}</div>
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
                                        <img style={{height: "149px",borderRadius: "10px 10px 0px 0px"}} src={competition.heroImageUrl}/>
                                    </div>
                                    <div className="form-heading" style={{marginTop: "20px",textAlign: "start"}}>{competition.competitionName}</div>
                                    {this.state.organisationId == null && (
                                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{competition.organisationName}</div>
                                    )}
                                    <div style={{fontWeight: "600"}}><img style={{height: "15px",width: "15px",marginRight: "5px"}} src={AppImages.calendar}/> {competition.registrationOpenDate} - {competition.registrationCloseDate}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination 
                        onChange={(e) => this.pagingCompetitions(e)}
                        pageSize={this.state.competitionsCountPerPage}
                        current={this.state.competitionsCurrentPage}
                        style={{textAlign: "center"}} 
                        total={this.state.organisationId == null ? this.state.allCompetitions.length : this.state.allCompetitionsByOrgId.length} 
                        itemRender={this.paginationItems}/>
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
            return(
                <div className="registration-form-view">
                    {competitionInfo.heroImageUrl && (
                        <div className="map-style">
                            <img style={{height: "249px",borderRadius: "10px 10px 0px 0px"}} src={competitionInfo.heroImageUrl}/>
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
                                <div style={{fontWeight: "600",marginTop: "-5px"}}><img style={{height: "15px",width: "15px",marginRight: "5px"}} src={AppImages.calendar}/> {competitionInfo.registrationOpenDate} - {competitionInfo.registrationCloseDate}</div>
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
    
                        <div className="row" style={{marginTop: "30px"}}>
                            <div className="col-xl-6 col-sm-12 col-md-6 col-lg-6">
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
                            <div className="col-xl-3 col-sm-12 col-md-6 col-lg-6">
                                <InputWithHead heading={AppConstants.venue}/>
                                <img style={{height: "65%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/>
                            </div>
                            <div className="col-xl-3 col-sm-12 col-md-6 col-lg-6">
                                <InputWithHead heading={AppConstants.uniform}/>
                                <img style={{height: "65%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/>
                            </div>
                        </div>  
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in competitionDetailView::"+ex);
        }
    }

    selectCompetitionStepView = (getFieldDecorator) => {
        const { teamRegistrationObj } = this.props.teamRegistrationState;
        try{
            return(
                <div>
                    {this.state.showFindAnotherCompetitionview ?
                        <div>{this.findAnotherCompetitionView()}</div>
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
                                <img style={{height: "15px",width: "15px",marginRight: "5px"}} src={AppImages.calendar}/> 
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
                                        //defaultValue={this.getAddress(registrationObj)}
                                        heading={AppConstants.addressSearch}
                                        required
                                        error={this.state.searchAddressError}
                                        onBlur={() => { this.setState({searchAddressError: ''})}}
                                        onSetData={(e)=>this.handlePlacesAutocomplete(e,"participant")}
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
                                {getFieldDecorator(`participantCountryRefId`, {
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
                                value={teamRegistrationObj.personRoleRefId}>
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
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "firstName")} 
                                        setFieldsValue={teamRegistrationObj.firstName}
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
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "middleName")} 
                                        setFieldsValue={teamRegistrationObj.middleName}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.lastName} required={"required-field"}/>
                            <Form.Item >
                                {getFieldDecorator(`participantLastName`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.lastName}
                                        onChange={(e) => this.onChangeSetTeamValue(e.target.value, "lastName")} 
                                        setFieldsValue={teamRegistrationObj.lastName}
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
                    teamRegistrationObj.personRoleRefId != 4) ? 
                    <div>
                        <InputWithHead heading={AppConstants.areYouRegisteringAsPlayer} required={"required-field"}></InputWithHead>
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetTeamValue(e.target.value, "registeringAsAPlayer")}
                            value={teamRegistrationObj.registeringAsAPlayer}>
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={2}>{AppConstants.no}</Radio>
                        </Radio.Group>
                    </div> : null}
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
                        {getFieldDecorator(`teamGenderRefId${teamMemberIndex}`, {
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
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "firstName", teamMemberIndex)} 
                                        setFieldsValue={teamMember.firstName}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.middleName}/>
                            <Form.Item >
                                {getFieldDecorator(`teamMemberMiddleName`, {
                                    rules: [{ required: false }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.middleName}
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "middleName", teamMemberIndex)} 
                                        setFieldsValue={teamMember.middleName}
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
                                        onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "lastName", teamMemberIndex)} 
                                        setFieldsValue={teamMember.lastName}
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
                    <Checkbox
                        className="single-checkbox"
                        checked={teamMember.payingFor == 1 ? true : false}
                        onChange={e => this.onChangeTeamMemberValue(e.target.checked ? 1 : 0, "payingFor", teamMemberIndex)} >
                        {AppConstants.payingForMember}
                    </Checkbox>
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
                            <Button 
                                style={{float: "right",textTransform: "uppercase"}}
                                className="white-button">{AppConstants.importTeam}
                            </Button>
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
                    
                    {(teamRegistrationObj.teamMembers || []).map((teamMember,teamMemberIndex) => (
                        <div>{this.teamMemberView(teamMember,teamMemberIndex,getFieldDecorator)}</div>
                    ))}
                    
                    <div className="orange-action-txt" 
                    style={{marginTop: "10px"}}
                    onClick={() => {
                        this.onChangeSetTeamValue(null,"addTeamMember");
                    }}>+ {AppConstants.addTeamMember}</div>

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
                    {teamRegistrationObj.allowTeamRegistrationTypeRefId == 1 && (
                        <div>{this.teamDetailsView(getFieldDecorator)}</div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in participantDetailsStepView::"+ex);
        }
    }

    additionalPersonalInfoView = (getFieldDecorator) => {
        try{
            const { teamRegistrationObj } = this.props.teamRegistrationState;
            const { countryList, identifyAsList,disabilityList,favouriteTeamsList,
                firebirdPlayerList,otherSportsList,heardByList,accreditationUmpireList,accreditationCoachList,walkingNetballQuesList } = this.props.commonReducerState;
            let yearsOfPlayingList = ['1','2','3','4','5','6','7','8','9','10+'];
            return(
                <div className="registration-form-view"> 
                    <div className="form-heading">{AppConstants.additionalPersonalInformation}</div>
                    <InputWithHead heading={AppConstants.whichCountryWereBorn}/>
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e,"countryRefId")}
                        value={teamRegistrationObj.additionalInfo.countryRefId}>
                        {countryList.length > 0 && countryList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))}
                    </Select>
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
                    <InputWithHead heading={AppConstants.anyExistingMedicalCondition}/>
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "existingMedicalCondition")} 
                        value={teamRegistrationObj.additionalInfo.existingMedicalCondition}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.anyRedularMedicalConditions}  />
                    <TextArea
                        placeholder={AppConstants.redularMedicalConditions}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "regularMedication")} 
                        value={teamRegistrationObj.additionalInfo.regularMedication}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.injury}/>
                    <TextArea
                        placeholder={AppConstants.anyInjury}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "injuryInfo")} 
                        value={teamRegistrationObj.additionalInfo.injuryInfo}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.alergy}/>
                    <TextArea
                        placeholder={AppConstants.anyAlergies}
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "allergyInfo")} 
                        value={teamRegistrationObj.additionalInfo.allergyInfo}
                        allowClear
                    />
                    <InputWithHead heading={AppConstants.haveDisability} />
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
                            <InputWithHead 
                            heading={AppConstants.disabilityCareNumber} 
                            placeholder={AppConstants.disabilityCareNumber} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "disabilityCareNumber")}
                            value={teamRegistrationObj.additionalInfo.disabilityCareNumber}/>
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
                            <InputWithHead heading={AppConstants.teamYouFollow}/>
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
                                <InputWithHead heading={AppConstants.who_fav_bird} />
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

                    {teamRegistrationObj.registeringYourself == 2 && (
                        <InputWithHead heading={AppConstants.childPlayingOtherParticipantSports} />
                    )}
                    {teamRegistrationObj.registeringYourself == 1 && (
                        <InputWithHead heading={AppConstants.playingOtherParticipantSports} />
                    )}
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
                    <InputWithHead heading={AppConstants.hearAbouttheCompition} />
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
                    <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetAdditionalInfo(e.target.checked, "isConsentPhotosGiven")}
                        checked={teamRegistrationObj.additionalInfo.isConsentPhotosGiven}>{AppConstants.consentForPhotos}
                    </Checkbox>

                    {teamRegistrationObj.regSetting.netball_experience == 1 && (
                        <div>
                            <InputWithHead heading={AppConstants.firstYearPlayingNetball} />
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "yearsPlayed")} 
                                value={teamRegistrationObj.additionalInfo.yearsPlayed}
                                >
                                <Radio value={1}>{AppConstants.yes}</Radio>
                                <Radio value={0}>{AppConstants.no}</Radio>
                            </Radio.Group>
                            {teamRegistrationObj.additionalInfo.yearsPlayed == 0 && (
                                <Select
                                    placeholder={AppConstants.yearsOfPlaying}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182,marginTop: "20px" }}
                                    onChange={(e) => this.onChangeSetAdditionalInfo(e, "yearsPlayed")}
                                    value={teamRegistrationObj.additionalInfo.yearsPlayed}
                                    >  
                                    {(yearsOfPlayingList || []).map((years, index) => (
                                        <Option key={years} value={years}>{years}</Option>
                                    ))}
                                </Select> 
                            )}
                        </div>
                    )}

                    {(getAge(teamRegistrationObj.dateOfBirth) < 18) && (
                        <div>
                            {teamRegistrationObj.regSetting.school_standard == 1 && (
                                <div>
                                    <InputWithHead heading={AppConstants.schoolYouAttend} />
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
                                <InputWithHead 
                                heading={(AppConstants.yourSchoolGrade)} 
                                placeholder={AppConstants.schoolGrade} 
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"schoolGradeInfo")} 
                                value={teamRegistrationObj.additionalInfo.schoolGradeInfo}
                                />
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

                    {(teamRegistrationObj.personRoleRefId == 3) && (
                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelCoach}/>
                            <Radio.Group
                                className="registration-radio-group"
                                onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value, "accreditationLevelCoachRefId")} 
                                value={teamRegistrationObj.additionalInfo.accreditationLevelCoachRefId}
                                >
                                {(accreditationCoachList || []).map((accreditaiton,accreditationIndex) => (
                                <Radio key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
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
                    
                    {(teamRegistrationObj.personRoleRefId == 3) && (
                        <div>
                            <InputWithHead 
                            heading={AppConstants.workingWithChildrenCheckNumber}
                            placeholder={AppConstants.childrenNumber} 
                            onChange={(e) => this.onChangeSetAdditionalInfo(e.target.value,"childrenCheckNumber")} 
                            value={teamRegistrationObj.additionalInfo.childrenCheckNumber}
                            />
                            <DatePicker
                                size="large"
                                placeholder={AppConstants.checkExpiryDate}
                                style={{ width: "100%",marginTop: "20px" }}
                                onChange={e => this.onChangeSetAdditionalInfo(e, "childrenCheckExpiryDate") }
                                format={"DD-MM-YYYY"}
                                showTime={false}
                                value={teamRegistrationObj.additionalInfo.childrenCheckExpiryDate && moment(teamRegistrationObj.additionalInfo.childrenCheckExpiryDate,"YYYY-MM-DD")}
                            />
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
                        <Loader visible={this.props.teamRegistrationState.onMembershipLoad} />
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
        membershipProductTeamRegistrationAction,
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
        updateTeamAdditionalInfoAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamRegistrationState: state.TeamRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppTeamRegistrationForm));