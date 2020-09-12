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
    Radio, Form, Modal, message, Steps
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
import {getUreAction} from 
                "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { getCommonRefData,  favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction, heardByReferenceAction,playerPositionReferenceAction,
    genderReferenceAction, disabilityReferenceAction,
    personRegisteringRoleReferenceAction }
    from '../../store/actions/commonAction/commonAction';

import { saveEndUserRegistrationAction,updateEndUserRegisrationAction, orgRegistrationRegSettingsEndUserRegAction,
    membershipProductEndUserRegistrationAction, getUserRegistrationUserInfoAction,
    clearRegistrationDataAction, updateRegistrationSettingsAction, 
    updateTeamAction, updateYourInfoAction, getTermsAndConditionsAction,
    getRegistrationProductFeesAction, getRegistrationByIdAction, teamNameValidationAction, clearUserRegistrationAction} from 
            '../../store/actions/registrationAction/endUserRegistrationAction';
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
            currentStep: 1,
            submitButtonText: null
        } 
    }

    componentDidMount(){
        this.setState({submitButtonText: AppConstants.addPariticipant});
    }

    changeStep = (current) => {
        this.setState({currentStep: current})
    }

    selectImage(index) {
        const fileInput = document.getElementById('user-pic' + index);
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
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
                            {AppConstants.signupToCompetition}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>

            </div>
        );
    };

    participantDetailsStepView = (index) => {
        let participantSelected = false;
        return(
            <div>
                {!participantSelected ? 
                    <div>
                        <div>{this.addedParticipantView()}</div>
                        <div>{this.participantDetailView()}</div>
                        <div>{this.parentOrGuardianView()}</div>
                    </div>
                : 
                    <div>{this.addOrSelectParticipantView()}</div> 
                }
            </div>
        );
    }

    addOrSelectParticipantView = (index) => {
        let active = false;
        return(
            <div className="registration-form-view">
                <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.addPariticipant}</div>
                <div className="row">
                    <div className='col-sm-6'>
                        <div className={active ? 'new-participant-button-active' : 'new-participant-button-inactive'}>{AppConstants.newParticipant}</div>
                    </div>
                    <div className='col-sm-6'>
                        <div className={active ? 'new-participant-button-active' : 'new-participant-button-inactive'}>{AppConstants.newParticipant}</div>
                    </div>
                    <div className='col-sm-6'>
                        <div className={active ? 'new-participant-button-active' : 'new-participant-button-inactive'}>
                            <img style={{height: "60px",borderRadius: "50%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/> 
                            <div style={{width: "75%",paddingLeft: "15px"}}>
                                <div>Participant name</div>
                                <div style={{fontSize: "15px"}}>Male,02/09/2020</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="question">{AppConstants.areYouRegisteringYourself}</div>
                <Radio.Group
                    className="registration-radio-group"
                    onChange={(e) => this.onChangeSetRegYourself(e.target.value, "registeringYourself", index)}
                    // value={item.registeringYourself}
                    >
                    {/* {index == 0 &&  */}
                        <Radio value={1}>{AppConstants.yes}</Radio>
                    {/* } */}
                    <Radio value={3}>{AppConstants.registeringSomeoneElse}</Radio>
                    <Radio value={4}>{AppConstants.noRegisteringATeam}</Radio>
                </Radio.Group>

                <div className="question">{AppConstants.whoAreYouRegistering}</div>
                <Form.Item >
                    {/* {getFieldDecorator(`whoAreYouRegistering${index}`, {
                        rules: [{ required: true, message: ValidationConstants.whoAreYouRegistering }],
                    })( */}
                        <Radio.Group
                            className="registration-radio-group"
                            onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "whoAreYouRegistering", index)}
                            // setFieldsValue={item.whoAreYouRegistering}
                            >
                            <Radio value={1}>{AppConstants.child}</Radio>
                            <Radio value={2}>{AppConstants.other}</Radio>
                            {/* <Radio value={3}>{AppConstants.team}</Radio> */}
                        </Radio.Group>
                    {/* )} */}
                </Form.Item>
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

    participantDetailView = (index) => {
        return(
            <div className="registration-form-view">
                <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.participantDetails}</div>
                <InputWithHead heading={AppConstants.gender}   required={"required-field"}></InputWithHead>
                <Form.Item >
                    {/* {getFieldDecorator(`genderRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.genderField }],
                    })( */}
                        <Radio.Group
                            className="reg-competition-radio"
                            // onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "genderRefId", index)}
                            // setFieldsValue={item.genderRefId}
                            >
                            {/* {(genderList || []).map((gender, genderIndex) => (
                                <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                            ))} */}
                            <Radio>Male</Radio>
                        </Radio.Group>
                    {/* )} */}
                </Form.Item>

                <InputWithHead heading={AppConstants.dob}   required={"required-field"}/>
                <Form.Item >
                    {/* {getFieldDecorator(`dateOfBirth${index}`, {
                        rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
                    })( */}
                    <DatePicker
                        size="large"
                        placeholder={"dd-mm-yyyy"}
                        style={{ width: "100%" }}
                        //onChange={e => this.onChangeSetParticipantValue(e, "dateOfBirth", index) }
                        format={"DD-MM-YYYY"}
                        showTime={false}
                        name={'dateOfBirth'}
                    />
                    {/* )} */}
                </Form.Item>
            
                <div className="row">
                    <div className="col-sm-6">
                    <Form.Item >
                        {/* {getFieldDecorator(`participantFirstName${index}`, {
                            rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                        })( */}
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.participant_firstName}
                                placeholder={AppConstants.participant_firstName}
                                // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "firstName",index )} 
                                //setFieldsValue={item.firstName}
                            />
                        {/* )} */}
                    </Form.Item>
                    </div>
                    <div className="col-sm-6">
                        <Form.Item >
                            {/* {getFieldDecorator(`participantLastName${index}`, {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })( */}
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.participant_lastName}
                                placeholder={AppConstants.participant_lastName}
                                // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastName", index )} 
                                // setFieldsValue={item.lastName}
                            />
                            {/* )} */}
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                    <Form.Item >
                        {/* {getFieldDecorator(`participantMobileNumber${index}`, {
                            rules: [{ required: true, message: ValidationConstants.contactField }],
                        })( */}
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.contactMobile}
                            placeholder={AppConstants.contactMobile}
                            // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "mobileNumber", index )} 
                            // setFieldsValue={item.mobileNumber}
                        />
                        {/* )} */}
                    </Form.Item>
                    </div>
                    <div className="col-sm-6">
                        <Form.Item >
                            {/* {getFieldDecorator(`participantEmail${index}`, {
                                rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                            })( */}
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                //disabled={item.userId == getUserId()}
                                heading={AppConstants.contactEmail}
                                placeholder={AppConstants.contactEmail}
                                // onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "email", index )} 
                                // onBlur = {(e) => this.showEmailValidationMsg(item, index, "participant", e.target.value)}
                                // setFieldsValue={item.email}
                            />
                            {/* )} */}
                        </Form.Item>
                    </div>
                </div>

                <InputWithHead heading={AppConstants.photo}/>
                <div className="orange-action-txt" onClick={ () => this.selectImage(index)}>&#43; {AppConstants.upload}</div>
                {/* <div className="reg-competition-logo-view" onClick={ () => this.selectImage(index)}>
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
                </div> */}
                <input
                    type="file"
                    id= {"user-pic" + index} 
                    style={{ display: 'none' }}
                    //onChange={(evt) => this.setImage(evt.target, index, "participantPhoto")} 
                />

                <div className="form-heading" style={{paddingBottom: "0px",marginTop: "30px"}}>{AppConstants.address}</div>
                <Form.Item name="addressSearch">
                    <PlacesAutocomplete
                        //defaultValue={defaultAddress}
                        heading={AppConstants.selectAddress}
                        required
                        //error={this.state.searchAddressError}
                        // onBlur={() => {this.setState({searchAddressError: ''})}}
                        // onSetData={(e)=>this.handlePlacesAutocomplete(e,index,-1,"participant")}
                    />
                </Form.Item>	
                <div className="orange-action-txt" style={{marginTop: "10px"}}>&#43; {AppConstants.addNewAddress}</div>	
            </div>
        );
    } 

    parentOrGuardianView = () => {
        return(
            <div className="registration-form-view">
                <div className="form-heading" style={{paddingBottom: "0px"}}>{AppConstants.parentOrGuardianDetail}</div>
                <Select
                    mode="multiple"
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    //onChange={(e) => this.onChangeTempParent(index, e)}
                    // value={item.tempParents}
                    >
                    {/* {(filteredRegistrations).map((reg, regIndex) => (
                        (reg.parentOrGuardian).map((tParent, tpIndex) => (
                            <Option key={tParent.tempParentId + tpIndex} 
                                value={tParent.tempParentId}>
                                {tParent.firstName + " " + tParent.lastName} 
                            </Option>
                        ))
                    ))}   */}
                </Select>

                {/* {(item.parentOrGuardian || []).map((parent, parentIndex) => {
                    const state = stateList.length > 0 && parent.stateRefId > 0
                    ? stateList.find((state) => state.id === parent.stateRefId).name
                    : null;
                    
                    let defaultAddress = '';
                    if(parent.street1 && parent.suburb && state){
                        defaultAddress = `${
                            parent.street1 ? `${parent.street1},` : ''
                            } ${
                                parent.suburb ? `${parent.suburb},` : ''
                            } ${
                            state ? `${state},` : ''
                            } Australia`;
                    }

                    return(
                        <div key={"parent"+parentIndex}>
                        {this.dividerTextView("PARENT " + (parentIndex + 1), styles, "parent", index, parentIndex, item.parentOrGuardian)}
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
                                             onSetData={(e)=>this.handlePlacesAutocomplete(e,index,parentIndex,"parent")}
                                         />
                                     </Form.Item>																
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
                    );
                })} */}

                <div className="orange-action-txt" style={{marginTop: "10px"}}>&#43; {AppConstants.addNewParentGaurdian}</div>	
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
        return(
            <div className="registration-form-view">
                <div className="row">
                    <div className="col-sm-1.5">
                        <img style={{height: "80px",borderRadius: "50%"}} src="https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/registration%2Fu0_1593859839913.jpg?generation=1593859840553144&alt=media"/> 
                    </div>
                    <div className="col">
                        <div style={{fontWeight: "600",marginBottom: "5px"}}>{AppConstants.participant}</div>
                        <div style={{display: "flex",flexWrap: "wrap"}}>
                            <div className="form-heading" style={{textAlign: "start"}}>{AppConstants.addNewParticipant}</div>
                            <div className="orange-action-txt" style={{marginLeft: "auto",alignSelf: "center",marginBottom: "5px"}}>{AppConstants.selectAnother}</div>
                        </div>
                        <div style={{fontWeight: "600",marginTop: "-5px"}}>Child</div>
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

    stepsContentView = () => {
        return(
            <div>
               {this.state.currentStep == 0 && 
                    <div>{this.participantDetailsStepView()}</div>
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

    contentView = () => {
        return(
            <div className="pt-0" style={{width: "70%",margin: "auto"}}>
                <Steps className="registration-steps" current={this.state.currentStep} onChange={this.changeStep}>
                    {registrationSteps.map((item,index) => (
                        <Step key={item.title} title={item.title}/>
                    ))} 
                </Steps>
                {this.stepsContentView()}
            </div>
        );
    }

    footerView = () => {
        return(
            <div style={{width: "75%",margin: "auto",marginBottom: "50px"}}>
                <Button style={{float: "right",color: "white"}} className="open-reg-button">{this.state.submitButtonText}</Button>
            </div>
        );
    }

    render(){
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
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveRegistrationForm}
                        noValidate="noValidate">
                        <Content>
                        <div>
                            {this.contentView()}
                        </div>
                         <Loader visible={this.props.endUserRegistrationState.onLoad || 
                                this.props.endUserRegistrationState.onRegLoad} />
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
        clearRegistrationDataAction,
        updateRegistrationSettingsAction,
        updateTeamAction,
        personRegisteringRoleReferenceAction,
        updateYourInfoAction,
        getTermsAndConditionsAction,
        getRegistrationProductFeesAction,
        getRegistrationByIdAction,
		teamNameValidationAction,
        clearUserRegistrationAction								 
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppRegistrationFormNew));