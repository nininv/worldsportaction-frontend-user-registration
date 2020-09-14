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
    Steps
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
    personRegisteringRoleReferenceAction 
} from '../../store/actions/commonAction/commonAction';
import { 
    getUserRegistrationUserInfoAction,
    updateUserRegistrationObjectAction,
    selectParticipantAction,
    membershipProductEndUserRegistrationAction
} from '../../store/actions/registrationAction/userRegistrationAction';
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {getOrganisationId,  getCompetitonId, getUserId, getAuthToken, getSourceSystemFlag } from "../../util/sessionStorage";
import CSVReader from 'react-csv-reader'
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const registrationSteps = [
    {
      title: AppConstants.participantDetails,
    },
    {
      title: AppConstants.selectCompetition,
    },
    {
      title: AppConstants.additionalInformation,
    },
];

const checkboxList = [
    { label: 'Player', value: 'Player' },
    { label: 'Coach', value: 'Coach' },
    { label: 'Umpire', value: 'Umpire' },
  ];

class AppRegistrationFormNew extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            submitButtonText: AppConstants.addPariticipant,
            searchAddressError: null,
            competitionUniqueKey: getCompetitonId(),
            organisationUniqueKey: getOrganisationId(),
        } 
        this.props.getCommonRefData();
        this.props.genderReferenceAction();
        this.props.countryReferenceAction();
    }

    componentDidUpdate(){
        let { registrationObj } = this.props.userRegistrationState;
        if(registrationObj != null && registrationObj.refFlag == "participant"){
            this.props.form.setFieldsValue({
                [`participantFirstName`]:  registrationObj.firstName,
                [`participantLastName`]:  registrationObj.lastName,
                [`genderRefId`]:  registrationObj.genderRefId,
                [`dateOfBirth`]:  registrationObj.dateOfBirth,
                [`participantEmail`]:  registrationObj.email,
                [`participantMobileNumber`]:  registrationObj.mobileNumber,
            });  
            this.props.updateUserRegistrationObjectAction(null,"refFlag")   
        }
    }

    componentDidMount(){
        this.getUserInfo();
        let payload = {
            competitionUniqueKey: this.state.competitionUniqueKey,
            organisationUniqueKey: this.state.organisationUniqueKey
        }
        this.props.membershipProductEndUserRegistrationAction(payload);
    }

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

    // changeStep = (current) => {
    //     this.setState({currentStep: current})
    // }

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    setImage = (data,key) => {
        let { registrationObj } = this.props.userRegistrationState;
        if(data.files[0] !== undefined){
            if(key == "participantPhoto"){
                let profileUrl = URL.createObjectURL(data.files[0]);
                this.props.updateUserRegistrationObjectAction(profileUrl, "profileUrl");
            }
        }
    }

    addOrSelectParticipant = (userId) => {
        this.props.selectParticipantAction(userId,"userId");
    }

    getParentObj = () => {
        let parentObj = {
			"tempParentId": null,
			"firstName": null,
			"lastName": null,
			"mobileNumber": null,
			"email": null,
			"street1": null,
			"street2": null,
			"suburb": null,
			"stateRefId": null,
            "postalCode": null,
            "isSameAddress": false,
            "manualEnterAddressFlag": false
        }
        return parentObj;
    }

    onChangeSetParticipantValue = (value,key) => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        // if(key == "dateOfBirth"){
        //     if(registrationObj.parentOrGuardian.length == 0){
        //         this.props.updateUserRegistrationObjectAction(value,key);
        //         if(getAge(value) <= 18){
        //             let parentObj = this.getParentObj();
        //             registrationObj.parentOrGuardian.push(parentObj);
        //             key = "registrationObj";
        //             value = registrationObj;
        //         }else{
        //             registrationObj.parentOrGuardian = null;
        //             key = "registrationObj";
        //             value = registrationObj; 
        //         }
        //     }
        // }
        // if(key == "registeringYourself" && value == 2){
        //     if(registrationObj.parentOrGuardian.length == 0){
        //         this.props.updateUserRegistrationObjectAction(value,key);
        //         let parentObj = this.getParentObj();
        //         registrationObj.parentOrGuardian.push(parentObj);
        //         key = "registrationObj";
        //         value = registrationObj;
        //     } 
        // }
        this.props.updateUserRegistrationObjectAction(value,key)
    }

    addParent = (key,parentIndex) => {
        try{
            const { registrationObj } = this.props.userRegistrationState;
            if(key == "add"){
                let parentObj = this.getParentObj();
                parentObj.tempParentId = registrationObj.parentOrGuardian.length + 1; 
                registrationObj.parentOrGuardian.push(parentObj);
            }
            if(key == "remove"){
                registrationObj.parentOrGuardian.splice(parentIndex);
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
                    registrationObj.parentOrGuardian[parentIndex]["street1"] = null;
                    registrationObj.parentOrGuardian[parentIndex]["street2"] = null;
                    registrationObj.parentOrGuardian[parentIndex]["suburb"] = null;
                    registrationObj.parentOrGuardian[parentIndex]["stateRefId"] = null;
                    registrationObj.parentOrGuardian[parentIndex]["countryRefId"] = null;
                    registrationObj.parentOrGuardian[parentIndex]["postalCode"] = null;
                }
            }
            this.props.updateUserRegistrationObjectAction(registrationObj,"registrationObj");
        }catch(ex){
            console.log("Exception occured in onChangeSetParentValue"+ex);
        }

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

    saveRegistrationForm = (e) => {
        try{
            e.preventDefault();
            const { registrationObj } = this.props.userRegistrationState;
            console.log("final save::",registrationObj);
            this.props.form.validateFieldsAndScroll((err, values) => {
                this.setState({currentStep: this.state.currentStep + 1});
                setTimeout(() => {
                    this.setState({
                        submitButtonText: this.state.currentStep == 2 ? 
                        AppConstants.addCompetitionAndMembership : 
                        AppConstants.signupToCompetition});
                },100);
                if(!err){
                    
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
        );
    };

    participantDetailsStepView = (getFieldDecorator) => {
        let { registrationObj } = this.props.userRegistrationState;
        return(
            <div>
                {registrationObj != null && 
                registrationObj.registeringYourself ? 
                    <div>
                        {registrationObj.userId == -1 || registrationObj.userId == -2 ? 
                            <div>{this.addedParticipantView()}</div>
                        : 
                            <div>{this.addedParticipantWithProfileView()}</div>
                        }
                        <div>{this.participantDetailView(getFieldDecorator)}</div>
                        {(getAge(registrationObj.dateOfBirth) <= 18 || 
                        registrationObj.registeringYourself == 2) && (
                            <div>{this.parentOrGuardianView(getFieldDecorator)}</div>
                        )}
                    </div>
                : 
                    <div>{this.addOrSelectParticipantView()}</div> 
                }
            </div>
        );
    }

    addOrSelectParticipantView = () => {
        let userRegistrationstate = this.props.userRegistrationState;
        let userInfo = userRegistrationstate.userInfo;
        let registrationObj = userRegistrationstate.registrationObj;
        return(
            <div className="registration-form-view">
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

                {registrationObj != null  ?
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
        );
    }

    addedParticipantView = () => {
        return(
            <div className="registration-form-view">
                <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.participant}</div>
                <div style={{display: "flex",flexWrap: "wrap"}}>
                    <div className="form-heading" style={{textAlign: "start"}}>{AppConstants.addNewParticipant}</div>
                    <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "5px"}}>{AppConstants.selectAnother}</div>
                </div>
                <div style={{fontWeight: "600",marginTop: "-5px"}}>Child</div>
            </div>
        );
    }

    participantDetailView = (getFieldDecorator) => {
        let userRegistrationstate = this.props.userRegistrationState;
        let registrationObj = userRegistrationstate.registrationObj;
        const { genderList,stateList,countryList } = this.props.commonReducerState;
		const state = stateList.length > 0 && registrationObj.stateRefId > 0
            ? stateList.find((state) => state.id === registrationObj.stateRefId).name
            : null;

        let defaultAddress = '';
        if(registrationObj.street1 && registrationObj.suburb && state){
            defaultAddress = `${ registrationObj.street1 ? `${registrationObj.street1},` : '' } 
                ${ registrationObj.suburb ? `${registrationObj.suburb},` : '' } 
                ${ state ? `${state},` : '' } 
                ${ registrationObj.postalCode ? `${registrationObj.postalCode},` : ``} Australia`;
        }

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
            
                <div className="row">
                    <div className="col-sm-6">
                    <Form.Item >
                        {getFieldDecorator(`participantFirstName`, {
                            rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                        })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.participant_firstName}
                                placeholder={AppConstants.participant_firstName}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "firstName")} 
                                setFieldsValue={registrationObj.firstName}
                            />
                        )}
                    </Form.Item>
                    </div>
                    <div className="col-sm-6">
                        <Form.Item >
                            {getFieldDecorator(`participantLastName`, {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.participant_lastName}
                                placeholder={AppConstants.participant_lastName}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastName")} 
                                setFieldsValue={registrationObj.lastName}
                            />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-6">
                        <Form.Item >
                            {getFieldDecorator(`participantMobileNumber`, {
                                rules: [{ required: true, message: ValidationConstants.contactField }],
                            })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "mobileNumber")} 
                                setFieldsValue={registrationObj.mobileNumber}
                            />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-6">
                        <Form.Item >
                            {getFieldDecorator(`participantEmail`, {
                                rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                            })(
                                <InputWithHead
                                    required={"required-field pt-0 pb-0"}
                                    disabled={registrationObj.userId == getUserId()}
                                    heading={AppConstants.contactEmail}
                                    placeholder={AppConstants.contactEmail}
                                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "email")} 
                                    setFieldsValue={registrationObj.email}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <InputWithHead heading={AppConstants.photo}/>
                {registrationObj.profileUrl ? 
                    <img
                        src={registrationObj.profileUrl}
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
                {!registrationObj.addNewAddressFlag ? 
                    <div>
                        <div className="form-heading" style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.address}</div>
                        <div className="orange-action-txt" style={{marginTop: "10px"}}
                        onClick={() => this.onChangeSetParticipantValue(true,"addNewAddressFlag")}
                        >+ {AppConstants.addNewAddress}</div>	
                    </div>
                :
                    <div>
                        <div className="form-heading" style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.findAddress}</div>
                        <Form.Item name="addressSearch">
                            <PlacesAutocomplete
                                defaultValue={defaultAddress}
                                heading={AppConstants.addressSearch}
                                required
                                error={this.state.searchAddressError}
                                onBlur={() => { this.setState({searchAddressError: ''})}}
                                onSetData={(e)=>this.handlePlacesAutocomplete(e,"participant")}
                            />
                        </Form.Item>
                        {registrationObj.manualEnterAddressFlag ? 
                            <div>
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
                                                placeholder={AppConstants.select}
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
                                        placeholder={AppConstants.select}
                                        onChange={(e) => this.onChangeSetParticipantValue(e, "countryRefId")}
                                        setFieldsValue={registrationObj.countryRefId}>
                                        {countryList.length > 0 && countryList.map((item) => (
                                            < Option key={item.id} value={item.id}> {item.description}</Option>
                                        ))}
                                    </Select>
                                    )}
                                </Form.Item>
                            </div>
                        : 
                            <div className="orange-action-txt" style={{marginTop: "10px"}}
                            onClick={() => this.onChangeSetParticipantValue(true,"manualEnterAddressFlag")}
                            >{AppConstants.enterAddressManually}</div>	                    
                        } 
                    </div>
                }	
            </div>
        );
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
                    const state = stateList.length > 0 && parent.stateRefId > 0
                    ? stateList.find((state) => state.id === parent.stateRefId).name
                    : null;

                    let defaultAddress = '';
                    if(parent.street1 && parent.suburb && state){
                    defaultAddress = `${ parent.street1 ? `${parent.street1},` : '' } 
                        ${ parent.suburb ? `${parent.suburb},` : '' } 
                        ${ state ? `${state},` : '' } 
                        ${ parent.postalCode ? `${parent.postalCode},` : ``} Australia`;
                    }

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
                                <div className="col-sm-6">
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
                                <div className="col-sm-6">
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
                                        {getFieldDecorator(`parentContactField${parentIndex}`, {
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
                                <div>
                                    {!parent.manualEnterAddressFlag ? 
                                        <div>
                                            <div className="form-heading"  style={{
                                            marginTop: "15px",
                                            marginBottom: "-20px"}}>{AppConstants.findAddress}</div>
                                            <Form.Item name="addressSearch">
                                                <PlacesAutocomplete
                                                    defaultValue={defaultAddress}
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
                                            </Form.Item>
                                            <div className="orange-action-txt" style={{marginTop: "10px"}}
                                            onClick={() => {this.onChangeSetParentValue(true,"manualEnterAddressFlag",parentIndex)}}
                                            >{AppConstants.enterAddressManually}</div>
                                        </div>
                                    : 
                                        <div>
                                            <div className="orange-action-txt" 
                                            style={{marginTop: "20px"}}
                                            onClick={() => {this.onChangeSetParentValue(false,"manualEnterAddressFlag",parentIndex)}}
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
                                                            placeholder={AppConstants.select}
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
                                                {getFieldDecorator(`parentCountryRefId`, {
                                                    rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                                                })(
                                                <Select
                                                    style={{ width: "100%" }}
                                                    placeholder={AppConstants.select}
                                                    onChange={(e) => this.onChangeSetParentValue(e, "countryRefId", parentIndex)}
                                                    setFieldsValue={registrationObj.countryRefId}>
                                                    {countryList.length > 0 && countryList.map((item) => (
                                                        < Option key={item.id} value={item.id}> {item.description}</Option>
                                                    ))}
                                                </Select>
                                                )}
                                            </Form.Item>
                                        </div>
                                    }		
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="orange-action-txt" style={{marginTop: "10px"}}
                onClick={() => {this.addParent("add")}}
                >+ {AppConstants.addNewParentGaurdian}</div>	
            </div>
        );
    }

    selectCompetitionStepView = () => {
        return(
            <div>
               <div>{this.addedParticipantWithProfileView()}</div> 
                <div>{this.findAnotherCompetitionView()}</div>
                <div>{this.addCompetitionView()}</div>
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
                        src={registrationObj.profileUrl != null && registrationObj.profileUrl}/> 
                    </div>
                    <div className="col">
                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.participant}</div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            <div className="form-heading" style={{textAlign: "start"}}>{registrationObj.firstName} {registrationObj.lastName}</div>
                            <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "5px"}}>{AppConstants.selectAnother}</div>
                        </div>
                        <div style={{fontWeight: "600",marginTop: "-5px"}}>{registrationObj.genderRefId == 1 ? 'Male' : 'Female'}, {moment(registrationObj.dateOfBirth).format("DD/MM/YYYY")}</div>
                    </div>
                </div>
            </div>
        );
    }

    findAnotherCompetitionView = () => {
        return(
            <div className="registration-form-view">
                <div style={{display: "flex",alignItems: "center" }}>
                    <div className="form-heading">{AppConstants.findACompetition}</div>
                    <div className="orange-action-txt" style={{marginLeft: "auto",paddingBottom: "7.5px"}}>{AppConstants.cancel}</div>
                </div>

                <div className="light-grey-border-box">
                    <InputWithHead heading={AppConstants.organisationName}/>
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        >
                    </Select>
                </div>

                <div className="row" style={{marginTop: "30px"}}>
                    <div className="col-md-6 col-sm-12" style={{marginBottom: "20px"}}>
                        <div style={{border:"1px solid var(--app-f0f0f2)",borderRadius: "10px",padding: "20px"}}>
                            <div style={{height: "150px",background: "grey",borderRadius: "10px 10px 0px 0px",margin: "-20px -20px -0px -20px"}}></div>
                            <div className="form-heading" style={{marginTop: "20px"}}>NWA Winter 2020</div>
                            <div style={{fontWeight: "600"}}>&#128198; 25/10/2020 - 02/11/2020</div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12" style={{marginBottom: "20px"}}>
                        <div style={{border:"1px solid var(--app-f0f0f2)",borderRadius: "10px",padding: "20px"}}>
                            <div style={{height: "150px",background: "grey",borderRadius: "10px 10px 0px 0px",margin: "-20px -20px -0px -20px"}}></div>
                            <div className="form-heading" style={{marginTop: "20px"}}>NWA Winter 2020</div>
                            <div style={{fontWeight: "600"}}>&#128198; 25/10/2020 - 02/11/2020</div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12" style={{marginBottom: "20px"}}>
                        <div style={{border:"1px solid var(--app-f0f0f2)",borderRadius: "10px",padding: "20px"}}>
                            <div style={{height: "150px",background: "grey",borderRadius: "10px 10px 0px 0px",margin: "-20px -20px -0px -20px"}}></div>
                            <div className="form-heading" style={{marginTop: "20px"}}>NWA Winter 2020</div>
                            <div style={{fontWeight: "600"}}>&#128198; 25/10/2020 - 02/11/2020</div>
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-12" style={{marginBottom: "20px"}}>
                        <div style={{border:"1px solid var(--app-f0f0f2)",borderRadius: "10px",padding: "20px"}}>
                            <div style={{height: "150px",background: "grey",borderRadius: "10px 10px 0px 0px",margin: "-20px -20px -0px -20px"}}></div>
                            <div className="form-heading" style={{marginTop: "20px"}}>NWA Winter 2020</div>
                            <div style={{fontWeight: "600"}}>&#128198; 25/10/2020 - 02/11/2020</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    addCompetitionView = () => {
        return(
            <div className="registration-form-view">
                <div className="map-style"></div>
                <div className="row" style={{marginTop: "30px",marginLeft: "0px",marginRight: "0px"}}>
                    <div className="col-sm-1.5">
                        <img style={{height: "60px",borderRadius: "50%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/> 
                    </div>
                    <div className="col">
                        <div style={{fontWeight: "600",marginBottom: "5px"}}>competition</div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            <div className="form-heading" style={{textAlign: "start"}}>NWA Winter 2020</div>
                            <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "8px"}}>{AppConstants.findAnotherCompetition}</div>
                        </div>
                        <div style={{fontWeight: "600",marginTop: "-5px"}}>&#128198; 25/10/2020 - 02/11/2020</div>
                    </div>
                </div>
                <div className="light-grey-border-box">
                    <InputWithHead heading={AppConstants.chooseMembershipProducts}/>
                    <Checkbox.Group options={checkboxList} defaultValue={['Player']}  />
                    <InputWithHead heading={AppConstants.registrationDivisions}/>
                    <Form.Item>
                        {/* {getFieldDecorator(`competitionMembershipProductDivisionId${index}`, {
                            rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired }],
                        })( */}
                            <Select
                                style={{ width: "100%", paddingRight: 1 }}
                                // onChange={(e) => this.onChangeSetParticipantValue(e, "competitionMembershipProductDivisionId", index )}
                                // setFieldsValue={item.competitionMembershipProductDivisionId}
                                >
                                {/* {(item.divisions!= null && item.divisions!= undefined && item.divisions || []).map((division, index) => (
                                    <Option key={division.competitionMembershipProductDivisionId} 
                                    value={division.competitionMembershipProductDivisionId}>{division.divisionName}</Option>
                                ))} */}
                            </Select>
                        {/* )} */}
                    </Form.Item>
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
                        <div style={{fontFamily: "inter-medium",fontSize: "13px"}}>No information Provided</div>
                        <InputWithHead heading={AppConstants.specialNotes}/>
                        <div style={{fontFamily: "inter-medium",fontSize: "13px"}}>No information Provided</div>
                        <InputWithHead heading={AppConstants.venue}/>
                        <div style={{fontFamily: "inter-medium",fontSize: "13px"}}>No information Provided</div>
                        <InputWithHead heading={AppConstants.contactDetails}/>
                        <div style={{fontFamily: "inter-medium",fontSize: "13px"}}>No information Provided</div>
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
                
                <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.indicatePreferredPlayerPosition}</div>
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.position1} />
                        <Select
                            style={{ width: "100%", paddingRight: 1 }}
                            // onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex, "positionId1" )}
                            // value={item.positionId1}
                            >
                            {/* {(playerPositionList || []).map((play1, index) => (
                                <Option key={play1.id} value={play1.id}>{play1.name}</Option>
                            ))} */}
                        </Select>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <InputWithHead heading={AppConstants.position2} />
                        <Select
                            style={{ width: "100%", paddingRight: 1 }}
                            // onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex,"positionId2" )}
                            // value={item.positionId2}
                            >
                            {/* {(playerPositionList || []).map((play2, index) => (
                                <Option key={play2.id} value={play2.id}>{play2.name}</Option>
                            ))} */}
                        </Select>
                    </div>
                </div>

                <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.playWithFriend}</div>
                <div className="inter-medium-font">{AppConstants.playWithFriendSubtitle}</div>
                <div className="light-grey-border-box">
                    <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.friend}</div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead 
                                heading={AppConstants.firstName} 
                                placeholder={AppConstants.firstName} 
                                // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "firstName" )} 
                                // value={friend.firstName}
                                />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead 
                                heading={AppConstants.lastName} 
                                placeholder={AppConstants.lastName} 
                                // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "lastName" )} 
                                // value={friend.lastName}
                            />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email} 
                                // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "email" )} 
                                // value={friend.email}
                            />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.mobile} placeholder={AppConstants.mobile} 
                                // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "mobileNumber" )} 
                                // value={friend.mobileNumber}
                            />
                        </div>
                    </div>  
                    <div className="orange-action-txt" style={{marginTop: "20px"}}>&#43; {AppConstants.addfriend}</div>	      
                </div>

                <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.referfriend}</div>
                <div className="inter-medium-font">{AppConstants.referFriendSubTitle}</div>
                <div className="light-grey-border-box">
                    <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.friend}</div>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.firstName} placeholder={AppConstants.firstName} 
                            // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "firstName" )} 
                            // value={friend.firstName}
                            />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.lastName} placeholder={AppConstants.lastName} 
                            // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "lastName" )} 
                            // value={friend.lastName}
                            />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.email} placeholder={AppConstants.email} 
                            // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "email" )} 
                            // value={friend.email}
                            />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.mobile} placeholder={AppConstants.mobile} 
                                // onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "mobileNumber" )} 
                                // value={friend.mobileNumber}
                            />
                        </div>
                    </div>  
                    <div className="orange-action-txt" style={{marginTop: "20px"}}>&#43; {AppConstants.addfriend}</div>	      
                </div>

                <div className="orange-action-txt" style={{marginTop: "20px"}}>&#43; {AppConstants.addAnotherCompetition}</div>
            </div>
        );
    }

    additionalInfoStepView = () => {
        return(
            <div>
                <div>{this.addedParticipantWithProfileView()}</div> 
                <div>{this.additionalInfoAddCompetitionView()}</div>
                <div>{this.additionalPersonalInfoView()}</div>
            </div>
        )
    }

    additionalInfoAddCompetitionView = () => {
        return(
            <div className="registration-form-view">
                <div className="row" style={{marginLeft: "0px",marginRight: "0px"}}>
                    <div className="col-sm-1.5">
                        <img style={{height: "60px",borderRadius: "50%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/> 
                    </div>
                    <div className="col">
                        <div style={{fontWeight: "600",marginBottom: "5px"}}>competition</div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            <div className="form-heading" style={{textAlign: "start"}}>NWA Winter 2020</div>
                            <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "8px"}}>{AppConstants.edit}</div>
                        </div>
                        <div style={{fontWeight: "600",marginTop: "-5px"}}>Player, Coach</div>
                    </div>
                </div>
                <div className="orange-action-txt" style={{marginTop: "20px"}}>&#43; {AppConstants.addAnotherCompetition}</div>
            </div>
        );
    }

    additionalPersonalInfoView = () => {
        return(
            <div className="registration-form-view">
                <div className="form-heading">{AppConstants.additionalPersonalInformation}</div>
                <InputWithHead heading={AppConstants.haveYouEverPlayed}/>
                <Radio.Group
                    className="registration-radio-group"
                    // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedBefore", index )}
                    // value={item.playedBefore}
                    >
                    <Radio value={1}>{AppConstants.yes}</Radio>
                    {/* {item.playedBefore == true && (
                        <div className=" pl-5 pb-5">
                            <InputWithHead heading={AppConstants.year} placeholder={AppConstants.year}
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedYear", index )} 
                            value={item.playedYear!= null ? parseInt(item.playedYear) : item.playedYear} 
                            maxLength={4}/>

                            <InputWithHead heading={AppConstants.clubOther} placeholder={AppConstants.clubOther} 
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedClub", index )} 
                            value={item.playedClub}/>

                            <InputWithHead heading={AppConstants.grade} placeholder={AppConstants.grade} 
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedGrade", index )} 
                            value={item.playedGrade}/>

                                {item.regSetting.last_captain === 1 && (
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
                    )} */}
                    <Radio value={0}>{AppConstants.no}</Radio>
                </Radio.Group>

                <div className="form-heading" style={{marginTop: "30px"}}>{AppConstants.additionalInformation}</div>
                <InputWithHead heading={AppConstants.emergencyContact}/>
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    >  
                </Select>
                <InputWithHead heading={AppConstants.existingMedConditions}/>
                <TextArea
                    placeholder={AppConstants.existingMedConditions}
                    // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "existingMedicalCondition", index )} 
                    // value={item.existingMedicalCondition}
                    allowClear
                />
                <InputWithHead heading={AppConstants.redularMedicalConditions}  />
                <TextArea
                    placeholder={AppConstants.redularMedicalConditions}
                    // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "regularMedication", index )} 
                    // value={item.regularMedication}
                    allowClear
                />
                <InputWithHead heading={AppConstants.hearAbouttheCompition} />
                <Radio.Group
                    className="registration-radio-group"
                    // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "heardByRefId", index )} 
                    // value={item.heardByRefId}
                    >
                        {/* {(heardByList || []).map((heard, index) => (
                            <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                        ))} */}
                        <Radio>Friend</Radio>
                </Radio.Group>
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <InputWithHead heading={AppConstants.favouriteTeam}/>
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            // onChange={(e) => this.onChangeSetParticipantValue(e, "favouriteTeamRefId", index )}
                            // value={item.favouriteTeamRefId}
                            >  
                            {/* {(favouriteTeamsList || []).map((fav, index) => (
                                <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                            ))} */}
                        </Select>
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <InputWithHead heading={AppConstants.who_fav_bird} />
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            // onChange={(e) => this.onChangeSetParticipantValue(e, "favouriteFireBird", index )}
                            // value={item.favouriteFireBird}
                            >  
                            {/* {(firebirdPlayerList || []).map((fire, index) => (
                                <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                            ))} */}
                        </Select>
                    </div>
                </div>
                <Checkbox
                    className="single-checkbox pt-3"
                    // onChange={(e) => this.onChangeSetParticipantValue(e.target.checked, "isConsentPhotosGiven", index )}
                    // checked={item.isConsentPhotosGiven}
                    >
                        {AppConstants.consentForPhotos}
                </Checkbox>

                <InputWithHead heading={AppConstants.doYouHaveDisablity} />
                <Radio.Group
                    className="registration-radio-group"
                    // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "isDisability", index )} 
                    // value={item.isDisability}
                    >
                    <Radio value={1}>{AppConstants.yes}</Radio>
                        {/* {item.isDisability == 1 ? 
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
                        } */}
                    <Radio value={0}>{AppConstants.no}</Radio>
                </Radio.Group>
            </div>
        );
    }

    stepsContentView = (getFieldDecorator) => {
        return(
            <div>
               {this.state.currentStep == 0 && 
                    <div>{this.participantDetailsStepView(getFieldDecorator)}</div>
               } 
               {this.state.currentStep == 1 && 
                    <div>{this.selectCompetitionStepView()}</div>
               }
               {this.state.currentStep == 2 && 
                    <div>{this.additionalInfoStepView()}</div>
               }
            </div>
        );
    }

    contentView = (getFieldDecorator) => {
        return(
            <div className="pt-0" style={{width: "70%",margin: "auto"}}>
                <Steps className="registration-steps" current={this.state.currentStep} onChange={this.changeStep}>
                    {registrationSteps.map((item,index) => (
                        <Step key={item.title} title={item.title}/>
                    ))} 
                </Steps>
                {this.stepsContentView(getFieldDecorator)}
            </div>
        );
    }

    footerView = () => {
        return(
            <div style={{width: "75%",margin: "auto",marginBottom: "50px"}}>
                <Button 
                htmlType="submit"
                type="primary"
                style={{float: "right",color: "white"}} 
                className="open-reg-button">{this.state.submitButtonText}</Button>
            </div>
        );
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
                        <Content>
                        <div>
                            {this.contentView(getFieldDecorator)}
                        </div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
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
        membershipProductEndUserRegistrationAction						 
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userRegistrationState: state.UserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppRegistrationFormNew));