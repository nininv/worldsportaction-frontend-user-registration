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
    getTeamRegistrationInviteAction
} from '../../store/actions/registrationAction/teamRegistrationAction';
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
import ValidationConstants from "../../themes/validationConstant";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class TeamRegistrationForm extends Component{
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
        }
        this.props.genderReferenceAction();
        this.props.getCommonRefData();
        this.props.countryReferenceAction();
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
            let teamRegistrationState = this.props.teamRegistrationState;
            if(!teamRegistrationState.inviteOnLoad && this.state.inviteOnLoad){
                this.setYourDetailsValue();
                this.setState({inviteOnLoad: false});
            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    setYourDetailsValue = () => {
        try{
            const { iniviteMemberInfo } = this.props.teamRegistrationState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            let resgistererDetails = userRegDetails.resgistererDetails;
            this.props.form.setFieldsValue({
                [`yourDetailsgenderRefId`]: resgistererDetails.genderRefId,
                [`yourDetailsFirstName`]: resgistererDetails.firstName,
                [`yourDetailsMiddleName`]: resgistererDetails.middleName,
                [`yourDetailsLastName`]: resgistererDetails.lastName,
                [`yourDetailsdateOfBirth`]: resgistererDetails.dateOfBirth && moment(resgistererDetails.dateOfBirth, "YYYY-MM-DD"),
                [`yourDetailsMobileNumber`]: resgistererDetails.mobileNumber,
                [`yourDetailsEmail`]: resgistererDetails.email
            });
        }catch(ex){
            console.log("Error in setYourDetailsValue::"+ex);
        }
    }

    onChangeStep = (current) => {
        try{

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

    handlePlacesAutocomplete = (addressData,key) => {
        try{
            const { stateList,countryList } = this.props.commonReducerState;
            const address = addressData;
            const stateRefId = stateList.length > 0 && address.state ? stateList.find((state) => state.name === address.state).id : null;
            const countryRefId = countryList.length > 0 && address.country ? countryList.find((country) => country.name === address.country).id : null;
            if(address){
                if(key == "yourDetails"){
                    this.onChangeSetYourDetailsValue(address.addressOne, "street1");
                    this.onChangeSetYourDetailsValue(address.suburb, "suburb");
                    this.onChangeSetYourDetailsValue(address.postcode, "postalCode");
                    this.onChangeSetYourDetailsValue(countryRefId, "countryRefId");
                    this.onChangeSetYourDetailsValue(stateRefId, "stateRefId");
                }
            }
        }catch(ex){
            console.log("Error in handlePlacesAutoComplete::"+ex);
        }
    }

    onChangeSetYourDetailsValue = (value,key) => {
        try{
            
        }catch(ex){
            console.log("Error in onChangeSetYourDetailsValue::"+ex);
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
        const { iniviteMemberInfo } = this.props.teamRegistrationState;
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
                                <img style={{height: "15px",width: "15px",marginRight: "5px"}} src={AppImages.calendar}/> 
                                <div style={{fontWeight: "600"}}>{competitionDetails.registrationOpenDate} - {competitionDetails.registrationCloseDate}</div>
                                <img style={{height: "15px",width: "15px",marginRight: "5px",marginLeft: "40px"}} src={AppImages.calendar}/> 
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
            const { iniviteMemberInfo } = this.props.teamRegistrationState;
            let userRegDetails = iniviteMemberInfo?.userRegDetails;
            let resgistererDetails = userRegDetails.resgistererDetails;
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
                                        defaultValue={this.getAddress(resgistererDetails)}
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
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "street1")} 
                                        setFieldsValue={resgistererDetails.street1}
                                    />
                                )}
                            </Form.Item>
                            <InputWithHead
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "street2")} 
                                value={resgistererDetails.street2}
                            />
                            <Form.Item >
                                {getFieldDecorator(`yourDetailsSuburb`, {
                                    rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        heading={AppConstants.suburb}
                                        placeholder={AppConstants.suburb}
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "suburb")} 
                                        setFieldsValue={resgistererDetails.suburb}
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
                                                onChange={(e) => this.onChangeSetYourDetailsValue(e, "stateRefId")}
                                                setFieldsValue={resgistererDetails.stateRefId}>
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
                                                onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "postalCode")} 
                                                setFieldsValue={resgistererDetails.postalCode}
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
                                    onChange={(e) => this.onChangeSetYourDetailsValue(e, "countryRefId")}
                                    setFieldsValue={resgistererDetails.countryRefId}>
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
            const { iniviteMemberInfo } = this.props.teamRegistrationState;
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
                                onChange={ (e) => this.onChangeSetYourDetailsValue(e.target.value, "genderRefId")}
                                setFieldsValue={resgistererDetails.genderRefId}
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
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "firstName")} 
                                        setFieldsValue={resgistererDetails.firstName}
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
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "middleName")} 
                                        setFieldsValue={resgistererDetails.middleName}
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
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "lastName")} 
                                        setFieldsValue={resgistererDetails.lastName}
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
                                        onChange={e => this.onChangeSetYourDetailsValue(e, "dateOfBirth") }
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
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "mobileNumber")} 
                                        setFieldsValue={resgistererDetails.mobileNumber}
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
                                        onChange={(e) => this.onChangeSetYourDetailsValue(e.target.value, "email")} 
                                        setFieldsValue={resgistererDetails.email}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    <div>{this.yourDetailsAddressView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in yourDetailsView::"+ex);
        }
    }

    yourDetailsStepView = (getFieldDecorator) => {
        try{
            return(
                <div>
                    <div>{this.competitionDetailView()}</div>
                    <div>{this.yourDetailsView(getFieldDecorator)}</div>
                </div>
            )
        }catch(ex){
            console.log("Error in yourDetailsStepView::"+ex);
        }
    }

    userView = () => {
        try{

        }catch(ex){
            console.log("Error in userView::"+ex);
        }
    }

    additionalInfoView = () => {
        try{

        }catch(ex){
            console.log("Error in additionalInfoView::"+ex);
        }
    }

    additionalInformationsStepView = () => {
        try{
            return(
                <div>
                    <div>{this.competitionDetailView()}</div>
                    <div>{this.userView()}</div>
                    <div>{this.additionalInfoView()}</div>
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
                        <div>{this.additionalInformationsStepView()}</div>
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
                        onSubmit={this.save}
                        noValidate="noValidate">
                        <Content>{this.contentView(getFieldDecorator)}</Content>
                        <Footer>{this.footerView()}</Footer>
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
        countryReferenceAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamRegistrationState: state.TeamRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamRegistrationForm));