import React, { Component } from "react";
import {
    Layout,Breadcrumb,Input,Select,Checkbox,Button, Table,DatePicker,Radio, Form, Modal, message
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import AppConstants from "../../themes/appConstants";
import "../../pages/layout.css";
import { getInvitedTeamRegInfoAction, orgRegistrationRegSettingsEndUserRegAction, 
    updateTeamParentInfoAction,updateTeamRegSettingAction, updateTeamRegistrationInvite } 
    from '../../store/actions/registrationAction/endUserRegistrationAction';
import { getCommonRefData, nationalityReferenceAction, heardByReferenceAction,
    disabilityReferenceAction, countryReferenceAction, firebirdPlayerReferenceAction,
    favouriteTeamReferenceAction, registrationOtherInfoReferenceAction} 
    from '../../store/actions/commonAction/commonAction';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import ValidationConstants from "../../themes/validationConstant";
import {getUserId, getUserRegId, getExistingUserRefId, getRegisteringYourselfRefId } 
from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

class TeamRegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onInvLoad: false,
            buttonPressed: "",
            loading: false,
        }
        console.log("*****************************************");
        this.getReferenceData();
    }

    componentDidMount() {
        this.getApiInfo();
    }

    componentDidUpdate(nextProps){
        let registrationState = this.props.endUserRegistrationState;

        if(registrationState.onLoad == false && this.state.loading === true)
        {
                this.setState({ loading: false });
                if(!registrationState.error)
                {
                    if (this.state.buttonPressed == "save" ) {
                        let registrationId=registrationState.registrationId
                        console.log("registrationId",registrationId)
                        history.push("/invoice", {
                            registrationId: registrationId,
                            paymentSuccess: false					 
                        })
                        // history.push('/appRegistrationSuccess');
                    }
                }
        }
        if(registrationState.onInvLoad == false && this.state.onInvLoad == true)
        {
            this.setState({onInvLoad: false})
            if(registrationState.invCompetitionDetails!= null)
            {
                let compDetail = registrationState.invCompetitionDetails;
                this.getRegistrationSettings(compDetail.competitionUniqueKey, 
                                        compDetail.organisationUniqueKey);
            }
            if(registrationState.invUserInfo!= null){
                let existingUserRefId = getExistingUserRefId();
                let registeringYourselfRefId = getRegisteringYourselfRefId();
                if(existingUserRefId == 1 && registeringYourselfRefId == 2){
                    this.setParentFormFields();
                }
            }
        }
    }

    getApiInfo = () => {
        let existingUserRefId = getExistingUserRefId();
        let registeringYourselfRefId = getRegisteringYourselfRefId();

        let payload = {
            userRegId : getUserRegId(),
            userId: existingUserRefId == 1 ? getUserId() : 0
        }

        this.props.getInvitedTeamRegInfoAction(payload);
        this.setState({onInvLoad: true});
    }

    getRegistrationSettings = (competitionUniqueKey, organisationUniqueKey) => {
        let payload = {
            competitionUniqueKey: competitionUniqueKey,
            organisationUniqueKey: organisationUniqueKey,
            participantIndex: null,
            prodIndex: null
        }
        this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
    }

    getReferenceData = () => {
        this.props.getCommonRefData();
        this.props.firebirdPlayerReferenceAction();
        this.props.favouriteTeamReferenceAction();
        this.props.registrationOtherInfoReferenceAction();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();
        this.props.heardByReferenceAction();
        this.props.disabilityReferenceAction();
    }

    setParentFormFields = () =>{
        let registrationState = this.props.endUserRegistrationState;
        let item = registrationState.invUserInfo != null ? registrationState.invUserInfo : {};
        
        this.props.form.setFieldsValue({
            [`parentFirstName`]: item.firstName,
            [`parentLastName`]: item.lastName,
            [`parentContactField`]: item.mobileNumber,
            [`parentEmail`]: item.email,
            [`parentReEnterEmail`]: item.email,
            [`parentStreet1`]: item.street1,
            [`parentSuburb`]: item.suburb,
            [`parentStateRefId`]: item.stateRefId,
            [`parentPostalCode`]: item.postalCode,
        });
    }

    onChangeSetParentValue = (value, key) =>{
        this.props.updateTeamParentInfoAction(value, key);
    }

    onChangeSetRegSettingValue = (value, key) =>{
        this.props.updateTeamRegSettingAction(value, key);
    }

    saveRegistrationForm = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
                let registrationState = this.props.endUserRegistrationState;
                let parentInfo = registrationState.invUserInfo
                let regSetting = registrationState.invUserRegDetails;
                let registeringYourselfRefId = getRegisteringYourselfRefId();
                if(parentInfo.userId == undefined || parentInfo.userId == null){
                    parentInfo.userId = 0
                }
                parentInfo["invUserId"] = regSetting.userId;
                let obj = {
                    parentInfo: registeringYourselfRefId == 2 ? parentInfo : null,
                    userRegistrationSetting: regSetting
                }
                console.log("Final Data::" + JSON.stringify(obj));
                this.props.updateTeamRegistrationInvite(obj);
                this.setState({ loading: true });
            }
        });
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

    membershipProductView = () => {
        let compDetails = this.props.endUserRegistrationState.invCompetitionDetails
        let item = compDetails!= null ? compDetails : {};
        return (
            <div className="formView content-view pt-5" style={{backgroundColor: 'var(--app-ebf0f3)'}}>
             <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>
               
               <InputWithHead heading={AppConstants.organisationName} />
               <div className="applicable-to-text">
                    {item.organisationName == null || item.organisationName == "" ? AppConstants.noInformationProvided : 
                    item.organisationName}
                </div>
 
                <InputWithHead heading={AppConstants.competition_name} />
                <div className="applicable-to-text">
                    {item.competitionName == null || item.competitionName == "" ? AppConstants.noInformationProvided : 
                    item.competitionName}
                </div>
                
                {/* <InputWithHead heading={AppConstants.membershipProduct} />
                <div className="applicable-to-text">
                    {item.membershipProductName == null || item.membershipProductName == "" ? AppConstants.noInformationProvided : 
                    item.membershipProductName}
                </div> */}

                <InputWithHead heading={AppConstants.divisions}/>
                <div className="applicable-to-text">
                    {item.divisionName == null || item.divisionName == "" ? AppConstants.noInformationProvided : 
                    item.divisionName}
                </div>

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
                    {item.venues == null || item.venues.length == 0 ? AppConstants.noInformationProvided :
                    <span>
                        {(item.venues || []).map((v, vIndex) =>(
                            <span>
                                <span>{v.venueName}</span>
                                <span>{item.venues.length != (vIndex + 1) ? ', ': ''}</span>
                            </span>
                        ))}</span>
                    }
                    <InputWithHead heading={AppConstants.specialNotes}/>
                        <div className="applicable-to-text">
                            {item.specialNote == null || item.specialNote == "" ? AppConstants.noInformationProvided : 
                            item.specialNote}
                        </div>
                    <InputWithHead heading={AppConstants.training} />
                        <div className="applicable-to-text">
                            {item.training == null || item.training == "" ? AppConstants.noInformationProvided : 
                            item.training}
                        </div>
                    <InputWithHead heading={AppConstants.contactDetails}/>
                        <span className="applicable-to-text">
                            {item.contactDetails == null || item.contactDetails == "" ? AppConstants.noInformationProvided : 
                            item.contactDetails}
                        </span>
                    <InputWithHead heading={AppConstants.photos}/>
                    {item.organisationPhotos == null ||  item.organisationPhotos == undefined ? 
                            AppConstants.noPhotosAvailable :
                    <div className="org-photos">
                        {(item.organisationLogoUrl!= null && item.organisationLogoUrl!= undefined) ?(
                        <div>
                            <div>
                                <img src={item.organisationLogoUrl!= null && item.organisationLogoUrl!= undefined &&
                                             item.organisationLogoUrl} alt=""height= {125} width={125}
                                    style={{ borderRadius:0, marginLeft: 0 }} name={'image'}
                                        onError={ev => {ev.target.src = AppImages.circleImage;}}
                                />
                            </div>
                            <div className="photo-type">{AppConstants.logo}</div>
                        </div>
                        ) : null 
                        }
                        {((item.organisationPhotos!=null && item.organisationPhotos) || [] )
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
                    </div>}
                </div> 
            </div>
        )
    }

    registeredUserView = () => {
        let userRegDetail = this.props.endUserRegistrationState.invUserRegDetails;
        let item = (userRegDetail!= null && userRegDetail.resgistererDetails!= null) ? 
                        userRegDetail.resgistererDetails : {};
        
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">
                    {AppConstants.registeringPerson}
                </span>
               <InputWithHead heading={AppConstants.teamName} />
               <div className="applicable-to-text">
                    {item.teamName == null || item.teamName == "" ? AppConstants.noInformationProvided : 
                    item.teamName}
                </div>

                <InputWithHead heading={AppConstants.personRegisteringRole}/>
                <div className="applicable-to-text">
                    {item.personRole == null || item.personRole == "" ? AppConstants.noInformationProvided : 
                    item.personRole}
                </div>

                <InputWithHead heading={AppConstants.firstName}/>
                <div className="applicable-to-text">
                    {item.firstName == null || item.firstName == "" ? AppConstants.noInformationProvided : 
                    item.firstName}
                </div>

                <InputWithHead heading={AppConstants.middleName}/>
                <div className="applicable-to-text">
                    {item.middleName == null || item.middleName == "" ? AppConstants.noInformationProvided : 
                    item.middleName}
                </div>
                
                <InputWithHead heading={AppConstants.lastName}/>
                <div className="applicable-to-text">
                    {item.lastName == null || item.lastName == "" ? AppConstants.noInformationProvided : 
                    item.lastName}
                </div>
               
                <InputWithHead heading={AppConstants.dob} />
                <div className="applicable-to-text">
                    {item.dateOfBirth == null || item.dateOfBirth == "" ? AppConstants.noInformationProvided : 
                    item.dateOfBirth}
                </div>

                <InputWithHead heading={AppConstants.contactMobile} /> 
                <div className="applicable-to-text">
                    {item.mobileNumber == null || item.mobileNumber == "" ? AppConstants.noInformationProvided : 
                    item.mobileNumber}
                </div>

                <InputWithHead heading={AppConstants.contactEmail} /> 
                <div className="applicable-to-text">
                    {item.email == null || item.email == "" ? AppConstants.noInformationProvided : 
                    item.email}
                </div>

                <InputWithHead heading={AppConstants.addressOne} /> 
                <div className="applicable-to-text">
                    {item.street1 == null || item.street1 == "" ? AppConstants.noInformationProvided : 
                    item.street1}
                </div>
               
                <InputWithHead heading={AppConstants.addressTwo} /> 
                <div className="applicable-to-text">
                    {item.street2 == null || item.street2 == "" ? AppConstants.noInformationProvided : 
                    item.street2}
                </div>

                <InputWithHead heading={AppConstants.suburb} /> 
                <div className="applicable-to-text">
                    {item.suburb == null || item.suburb == "" ? AppConstants.noInformationProvided : 
                    item.suburb}
                </div>

                <InputWithHead heading={AppConstants.state}/>
                <div className="applicable-to-text">
                    {item.state == null || item.state == "" ? AppConstants.noInformationProvided : 
                    item.state}
                </div>

                <InputWithHead heading={AppConstants.postcode}/>
                <div className="applicable-to-text">
                    {item.postalCode == null || item.postalCode == "" ? AppConstants.noInformationProvided : 
                    item.postalCode}
                </div>
            </div>
        )
    }

    invitedUserView = () => {
        let userRegDetail = this.props.endUserRegistrationState.invUserRegDetails;
        let item = (userRegDetail!= null) ?  userRegDetail : {};
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">
                    {AppConstants.invitedTeamMember}
                </span>
                <InputWithHead heading={AppConstants.membershipTypeName} />
                <div className="applicable-to-text">
                    {item.membershipProductName == null || item.membershipProductName == "" ? AppConstants.noInformationProvided : 
                    item.membershipProductName}
                </div>
                {/* <InputWithHead heading={AppConstants.firstName}/>
                <div className="applicable-to-text">
                    {item.firstName == null || item.firstName == "" ? AppConstants.noInformationProvided : 
                    item.firstName}
                </div> */}
                <InputWithHead heading={AppConstants.firstName}/>
                <div className="applicable-to-text">
                    {item.firstName == null || item.firstName == "" ? AppConstants.noInformationProvided : 
                    item.firstName}
                </div>
                
                <InputWithHead heading={AppConstants.lastName}/>
                <div className="applicable-to-text">
                    {item.lastName == null || item.lastName == "" ? AppConstants.noInformationProvided : 
                    item.lastName}
                </div>
               
                <InputWithHead heading={AppConstants.contactMobile} /> 
                <div className="applicable-to-text">
                    {item.mobileNumber == null || item.mobileNumber == "" ? AppConstants.noInformationProvided : 
                    item.mobileNumber}
                </div>

                <InputWithHead heading={AppConstants.contactEmail} /> 
                <div className="applicable-to-text">
                    {item.email == null || item.email == "" ? AppConstants.noInformationProvided : 
                    item.email}
                </div>
            </div>
        )
    }

    parentGuardianView = (getFieldDecorator) => {
        const { stateList } = this.props.commonReducerState;
        let registrationState = this.props.endUserRegistrationState;
        let parent = registrationState.invUserInfo != null ? registrationState.invUserInfo : {};
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading">
                    {AppConstants.parents_guardians}
                </span>
                
                <Form.Item>
                    {getFieldDecorator(`parentFirstName`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                    })(
                    <InputWithHead 
                    required={"required-field pt-0 pb-0"}
                    heading={AppConstants.firstName} 
                    placeholder={AppConstants.firstName} 
                    onChange={(e) => this.onChangeSetParentValue(e.target.value, "firstName")} 
                    setFieldsValue={parent.firstName}/>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator(`parentLastName`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                    })(
                    <InputWithHead 
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.lastName} 
                        placeholder={AppConstants.lastName} 
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "lastName")} 
                        setFieldsValue={parent.lastName}/>
                        )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator(`parentContactField`, {
                        rules: [{ required: true, message: ValidationConstants.contactField }],
                    })(
                    <InputWithHead 
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.mobile} 
                        placeholder={AppConstants.mobile} 
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "mobileNumber" )} 
                        setFieldsValue={parent.mobileNumber}
                    />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator(`parentEmail`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead 
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.email} 
                        placeholder={AppConstants.email} 
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "email")} 
                        setFieldsValue={parent.email}
                    />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator(`parentReEnterEmail`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead 
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.reenterEmail}
                        placeholder={AppConstants.reenterEmail} 
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "reEnterEmail")} 
                        setFieldsValue={parent.reEnterEmail}/>
                        )}
                </Form.Item>
                           
                <Form.Item>
                    {getFieldDecorator(`parentStreet1`, {
                        rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "street1")} 
                        setFieldsValue={parent.street1}
                    />
                    )}
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(e) => this.onChangeSetParentValue(e.target.value, "street2")} 
                    value={parent.street2}
                />

                <Form.Item>
                    {getFieldDecorator(`parentSuburb`, {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "suburb")} 
                        setFieldsValue={parent.suburb}
                    />
                    )}
                </Form.Item> 
                            
                <InputWithHead heading={AppConstants.state}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`parentStateRefId`, {
                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                    })(
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetParentValue(e, "stateRefId")}
                        setFieldsValue={parent.stateRefId}>
                        {stateList.length > 0 && stateList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.name}</Option>
                        ))
                        }
                    </Select>
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator(`parentPostalCode`, {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "postalCode")} 
                        setFieldsValue={parent.postalCode}
                        maxLength={4}
                    />
                )}
                </Form.Item>
            </div>
        )
    }

    otherParticipantReqInfo = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let item = registrationState.invUserRegDetails != null ? registrationState.invUserRegDetails : {};
        const { countryList, nationalityList} = this.props.commonReducerState;
        let regSetting = registrationState.registrationSetting;
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
                        onChange={(e) => this.onChangeSetRegSettingValue(e, "countryRefId" )}
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
                            onChange={(e) =>  this.onChangeSetRegSettingValue(e, "nationalityRefId")}
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
                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "languages")}
                    value={item.languages}/>
                )}
            </div>
        )
    }

    additionalPersonalInfoView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSetting;
        let item = registrationState.invUserRegDetails != null ? registrationState.invUserRegDetails : {};
        return(
            <div className="formView content-view pt-5" >
                 <span className="form-heading">
                    {AppConstants.additionalPersonalInfoReqd}
                </span>
                {regSetting.last_captain === 1 && (
                    <div>
                        <span className="applicable-to-heading">
                            {" "}
                            {AppConstants.haveYouEverPlayed}{" "}
                        </span>
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "playedBefore" )}
                            value={item.playedBefore}>
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            {item.playedBefore == true && (
                                <div className=" pl-5 pb-5">
                                    <InputWithHead heading={AppConstants.year} placeholder={AppConstants.year}
                                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "playedYear" )} 
                                    value={item.playedYear} 
                                    maxLength={4}/>

                                    <InputWithHead heading={AppConstants.clubOther} placeholder={AppConstants.clubOther} 
                                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "playedClub" )} 
                                    value={item.playedClub}/>

                                    <InputWithHead heading={AppConstants.grade} placeholder={AppConstants.grade} 
                                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "playedGrade" )} 
                                    value={item.playedGrade}/>

                                     {regSetting.last_captain === 1 && (
                                        <div>
                                            <span className="applicable-to-heading">
                                                {AppConstants.lastCaptainName}
                                            </span>
                                            <InputWithHead heading={AppConstants.fullName} placeholder={AppConstants.lastCaptainName}
                                                onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "lastCaptainName" )} 
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
    
    additionalInfoView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSetting;
        let item = registrationState.invUserRegDetails != null ? registrationState.invUserRegDetails : {};
        const {favouriteTeamsList, firebirdPlayerList, heardByList, disabilityList} = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                 <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>   
                 <InputWithHead heading={AppConstants.existingMedConditions}/>
                <TextArea
                    placeholder={AppConstants.existingMedConditions}
                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "existingMedicalCondition" )} 
                    value={item.existingMedicalCondition}
                    allowClear
                />
                <InputWithHead heading={AppConstants.redularMedicalConditions}  />
                <TextArea
                    placeholder={AppConstants.redularMedicalConditions}
                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "regularMedication" )} 
                    value={item.regularMedication}
                    allowClear/>
                <InputWithHead heading={AppConstants.hearAbouttheCompition} />
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "heardByRefId" )} 
                    value={item.heardByRefId}>
                        {(heardByList || []).map((heard, index) => (
                            <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                        ))}
                </Radio.Group>
                {item.heardByRefId == 4 && (
                    <div className="pl-5 pr-5">
                        <InputWithHead placeholder={AppConstants.other} 
                         onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "heardByOther" )}
                         value={item.heardByOther}/>
                    </div>
                )}

                <InputWithHead heading={AppConstants.favouriteTeam}/>
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={(e) => this.onChangeSetRegSettingValue(e, "favouriteTeamRefId" )}
                        value={item.favouriteTeamRefId}>  
                        {(favouriteTeamsList || []).map((fav, index) => (
                            <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                        ))}
                    </Select>

                {item.favouriteTeamRefId === 6?(
                    <div>
                        <InputWithHead heading={AppConstants.who_fav_bird} />
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(e) => this.onChangeSetRegSettingValue(e, "favouriteFireBird" )}
                            value={item.favouriteFireBird}>  
                            {(firebirdPlayerList || []).map((fire, index) => (
                                <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                            ))}
                        </Select>
                 </div>
                ) : null}

                {regSetting.photo_consent === 1 && (
                    <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetRegSettingValue(e.target.checked, "isConsentPhotosGiven" )}
                        checked={item.isConsentPhotosGiven}>{AppConstants.consentForPhotos}
                    </Checkbox>
                )}

                {regSetting.disability === 1 && (
                    <div>
                        <InputWithHead heading={AppConstants.haveDisability} />
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "isDisability" )} 
                            value={item.isDisability}>
                            <Radio value={1}>{AppConstants.yes}</Radio>
                                {item.isDisability == 1 ? 
                                <div style={{marginLeft: '25px'}}>
                                    <InputWithHead heading={AppConstants.disabilityCareNumber} placeholder={AppConstants.disabilityCareNumber} 
                                        onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "disabilityCareNumber" )}
                                        value={item.disabilityCareNumber}/>
                                    <InputWithHead heading={AppConstants.typeOfDisability} />
                                    <Radio.Group
                                        className="reg-competition-radio"
                                        onChange={(e) => this.onChangeSetRegSettingValue(e.target.value, "disabilityTypeRefId" )} 
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

    contentView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSetting;
        let existingUserRefId = getExistingUserRefId();
        let registeringYourselfRefId = getRegisteringYourselfRefId();
        return (
            <div>
               <div style={{marginBottom: "20px"}}>
                    {this.membershipProductView()}
                </div>
                {registeringYourselfRefId == 2 && 
                <div style={{marginBottom: "20px"}}>
                    {this.parentGuardianView(getFieldDecorator)}
                </div>}
                <div style={{marginBottom: "20px"}}>
                    {this.registeredUserView()}
                </div>
                <div style={{marginBottom: "20px"}}>
                    {this.invitedUserView()}
                </div>
                <div>
                    {(regSetting.country === 1 || regSetting.nationality === 1 || regSetting.language === 1) && (
                        <div style={{marginBottom: "20px"}}>
                            {this.otherParticipantReqInfo(getFieldDecorator)} 
                        </div>
                    )}
                    {(regSetting.last_captain === 1) && ( 
                        <div style={{marginBottom: "20px"}}>
                            {this.additionalPersonalInfoView(getFieldDecorator)}
                        </div>
                    )}
                    <div style={{marginBottom: "20px"}}>
                        {this.additionalInfoView(getFieldDecorator)}
                    </div>
                </div>
            </div>
        )
    }

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                {/* <Button className="save-draft-text" type="save-draft-text"
                                    onClick={() => this.navigatePaymentScreen()}>
                                    {AppConstants.pay}
                                </Button> */}
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
                         <Loader visible={this.props.endUserRegistrationState.onInvLoad || 
                                    this.props.endUserRegistrationState.onLoad } />
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
        getCommonRefData,
        nationalityReferenceAction, heardByReferenceAction,
        disabilityReferenceAction, countryReferenceAction, firebirdPlayerReferenceAction,
        favouriteTeamReferenceAction, registrationOtherInfoReferenceAction,
        getInvitedTeamRegInfoAction, orgRegistrationRegSettingsEndUserRegAction,
        updateTeamParentInfoAction,updateTeamRegSettingAction, updateTeamRegistrationInvite
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamRegistrationForm));
