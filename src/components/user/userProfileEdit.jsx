import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Input,
    Radio,
    Form,
    message
} from "antd";
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { userProfileUpdateAction } from '../../store/actions/userAction/userAction'
import ValidationConstants from "../../themes/validationConstant";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getCommonRefData , countryReferenceAction ,nationalityReferenceAction ,
    genderReferenceAction, disabilityReferenceAction} from '../../store/actions/commonAction/commonAction';
import { bindActionCreators } from 'redux';
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import { setTempUserId,getUserId } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;


class UserProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            userRegistrationId:'',
            displaySection: "0",
            loadValue: false,
            saveLoad: false,
            tabKey: "4",
            userData: {genderRefId: 0,firstName: "",lastName:"",mobileNumber:"",email: "",middleName: "",
                dateOfBirth: "",street1:"",street2:"",suburb:"",stateRefId: 1,postalCode: "",statusRefId: 0,
                emergencyFirstName: "",emergencyLastName: "",emergencyContactNumber: "", existingMedicalCondition: "",regularMedication: "",
                disabilityCareNumber: '', isDisability: 0,
                disabilityTypeRefId: 0,  countryRefId: null, nationalityRefId: null,languages: "",
                parentUserId: 0,
                childUserId: 0
            },
            titleLabel:"",
            section: "",
            isSameUserEmailChanged: false
        }
        this.props.getCommonRefData();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();
        this.props.genderReferenceAction();
        this.props.disabilityReferenceAction();
    }

    async componentDidMount() {
        
        if(this.props.history.location.state)
        {
            let titleLabel="";
            let section = ""
            let data = this.props.history.location.state.userData;
            let moduleFrom = this.props.history.location.state.moduleFrom;
            console.log("moduleFrom::" + moduleFrom)
            if(moduleFrom == "1"){
                titleLabel= AppConstants.edit + ' ' +  AppConstants.address;
                section = "address";
            }else if(moduleFrom == "2"){
                titleLabel= AppConstants.edit + ' ' +  AppConstants.parentOrGuardianDetail
                section = "primary";
            }else if(moduleFrom == "3"){
                titleLabel= AppConstants.edit + ' ' +  AppConstants.emergencyContacts;
                section = "emergency";
            }else if(moduleFrom == "4"){
                titleLabel= AppConstants.edit + ' ' +  AppConstants.otherInformation;
                section = "other";
            }else if(moduleFrom == "5"){
                titleLabel= AppConstants.edit + ' ' +  AppConstants.medical;
                section = "medical";
                this.setState({tabKey:"5"});
              if(data!= null){
                  if(data.disability!= null && data.disability.length > 0){
                      data["isDisability"] = data.disability[0]["isDisability"];
                      data["disabilityTypeRefId"] = data.disability[0]["disabilityTypeRefId"];
                      data["disabilityCareNumber"] = data.disability[0]["disabilityCareNumber"];
                      delete data.disability;
                  }
              }
            }
            else if(moduleFrom == "6"){
                titleLabel= AppConstants.edit + ' ' +  AppConstants.child;
                section = "child";
            }else if (moduleFrom == "7") {
                titleLabel = AppConstants.addChild;
                section = "child";
            }
            else if (moduleFrom == "8") {
                titleLabel = AppConstants.addParent_guardian;
                section = "primary";
            }
            let userDataTemp = this.state.userData;
            if(moduleFrom == 7 || moduleFrom == 8){
                userDataTemp.userId = data.userId;
            }
            console.log("DATA:::" + JSON.stringify(data));
            await this.setState({displaySection: moduleFrom,
                userData: (moduleFrom != "7" && moduleFrom != "8") ? data : userDataTemp,
                titleLabel: titleLabel, section: section, loadValue: true})
            setTempUserId(data.userId);

        }
     }

     componentDidUpdate(nextProps){
        if(this.state.loadValue)
        {
            this.setState({loadValue: false})
            if(this.state.displaySection == "1")
                this.setAddressFormFields();
            else if(this.state.displaySection == "2")
                this.setPrimaryContactFormFields();
            else if(this.state.displaySection == "3")
                this.setEmergencyFormField();
            else if(this.state.displaySection == "4")
                this.setOtherInfoFormField();
            else if(this.state.displaySection == "6")
                this.setPrimaryContactFormFields();
           
        }
        let userState  = this.props.userState;
        if(userState.onUpUpdateLoad == false && this.state.saveLoad == true){
            this.setState({saveLoad: false})
            if(userState.status == 1){
                if (this.state.isSameUserEmailChanged) {
                    this.logout();
                }else{
                    history.push({pathname:'/userPersonal', state: {tabKey: this.state.tabKey, userId: this.state.userData.userId}});
                }
            } 
            else if(userState.status == 4){
                message.config({duration: 1.5,maxCount: 1,});
                message.error(userState.userProfileUpdate);
            }
        }
    }

    logout = () => {
        try {
            localStorage.clear();
            history.push("/login");
        } catch (error) {
           console.log("Error" + error); 
        }
       
    };

    setAddressFormFields = () => {
        let userData  = this.state.userData;
        this.props.form.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            dateOfBirth:  ((userData.dateOfBirth!= null && userData.dateOfBirth!= '') ? 
                                moment(userData.dateOfBirth, "YYYY-MM-DD") : null),
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
           
        })
    }

    setPrimaryContactFormFields = () =>{
        let userData  = this.state.userData;
        this.props.form.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode
        })
    }

    setEmergencyFormField = () => {
        let userData  = this.state.userData;
        console.log("user data",userData)
        this.props.form.setFieldsValue({
            emergencyFirstName: userData.emergencyFirstName,
            emergencyLastName: userData.emergencyLastName,
            emergencyContactNumber: userData.emergencyContactNumber,
        })
    }

    setOtherInfoFormField = () => {
        let userData  = this.state.userData;
        this.props.form.setFieldsValue({
            genderRefId: userData.genderRefId!= null ?  parseInt(userData.genderRefId) : 0
        })
    }

    onChangeSetValue = (value, key) =>{
        let data = this.state.userData;
        if(key == "isDisability"){
            if(value == 0){
                data["disabilityCareNumber"] = null;
                data["disabilityTypeRefId"] = null;
            }
        }
        else if (key == "dateOfBirth"){
            value = (moment(value).format("YYYY-MM-DD"))
        }
        else if (key == "email" && this.state.section == "address") {
            if(data.userId == getUserId()){
                this.setState({isSameUserEmailChanged: true});
            }else{
                this.setState({isSameUserEmailChanged: false});
            }
        }
        data[key] = value;
      
        this.setState({userData: data});

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
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {this.state.titleLabel}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    addressEdit = (getFieldDecorator) => {
        let userData = this.state.userData
        const { stateList } = this.props.commonReducerState;

        return (
            <div className="pt-0" >
                <div className="row">
                    <div className="col-sm" >
                        <Form.Item >
                        {getFieldDecorator('firstName', {
                            rules: [{ required: true, message: ValidationConstants.firstName}],
                            })(
                            <InputWithHead
                                required={"required-field"}
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name={'firstName'}
                                setFieldsValue={userData.firstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                            />
                        )}
                        </Form.Item>
                    </div>
                    <div className="col-sm" >
                        <Form.Item >
                        {getFieldDecorator('lastName', {
                            rules: [{ required: false }],
                        })(
                            <InputWithHead
                                required={"required-field"}
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name={'lastName'}
                                setFieldsValue={userData.lastName}
                                onChange={(e) =>  this.onChangeSetValue(e.target.value, "lastName")}

                            />
                        )}
                        </Form.Item>
                    </div>
                </div>
                <div className="row" style={{paddingTop: "11px"}}>
                    <div className="col-sm" >
                        <InputWithHead
						style={{marginTop: "9px"}}						  
                        heading={AppConstants.middleName}
                        placeholder={AppConstants.middleName}
                        onChange={(e) => this.onChangeSetValue(e.target.value, "middleName")} 
                        value={userData.middleName}
                        />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.dob} /> 
                        <DatePicker
                            size="large"
                            placeholder={"dd-mm-yyyy"}
                            style={{ width: "100%" , marginTop: "9px"}}
                            onChange={e => this.onChangeSetValue(e, "dateOfBirth") }
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'dateOfBirth'}
                            value={userData.dateOfBirth ? moment(userData.dateOfBirth) : null}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm" >
                        <Form.Item >
                            {getFieldDecorator('mobileNumber', {
                                rules: [{ required: true, message: ValidationConstants.contactField }],
                            })(
                            <InputWithHead
                                required={"required-field"}
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                name={'mobileNumber'}
                                setFieldsValue={userData.mobileNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}

                            />
                            )}
                        </Form.Item>
                    </div>
                     <div className="col-sm" >
                        <Form.Item >
                        {getFieldDecorator('email', {
                            rules: [
                                { 
                                    required: true, message: ValidationConstants.emailField[0]
                                },
                                {
                                    type: "email",
                                    pattern: new RegExp(AppConstants.emailExp),
                                    message: ValidationConstants.email_validation
                                }
                            ],
                        })(
                            <InputWithHead
                                required={"required-field"}
                                heading={AppConstants.contactEmail}
                                placeholder={AppConstants.contactEmail}
                                name={'email'}
                                setFieldsValue={userData.email}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                            />
                        )}
                        </Form.Item>
                        {(userData.userId == getUserId() && this.state.isSameUserEmailChanged) ?
                            <div className="same-user-validation">
                                {ValidationConstants.emailField[2]}
                            </div>
                        : null}
                    </div>
                </div>
                <div className='row'>
                    <div className="col-sm" style={{paddingTop: "11px"}}>
                        <InputWithHead
                            style={{marginTop: '9px'}}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            name={'street1'}
                            value={userData.street1}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street1") }
                        />  
                    </div>
                    <div className="col-sm" style={{paddingTop: "11px"}}>  
                        <InputWithHead
                            style={{marginTop: '9px'}}
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            name={'street2'}
                            value={userData.street2}
                            onChange={(e) =>  this.onChangeSetValue(e.target.value, "street2") }
                        />
				   
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" style={{paddingTop: "11px"}}>
								
												  
																								
					   
                        <InputWithHead
                            style={{marginTop: '9px'}}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            name={'suburb'}
                            value={userData.suburb}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "suburb") }
                        />
					  
								
                    </div>
                    <div className="col-sm" >
						<div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                            <InputWithHead heading={AppConstants.stateHeading}/>
                        </div> 
									
															  
																									   
							   
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182,}}
                                placeholder={AppConstants.select}
                                value={userData.stateRefId}
                                name={'stateRefId'}
                                onChange={(e) => this.onChangeSetValue(e, "stateRefId") }
                            >
                                {stateList.length > 0 && stateList.map((item) => (
                                    < Option value={item.id}> {item.name}</Option>
                                ))
                                }
                            </Select>
							  
									 
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
								
													  
																								  
					   
                        <InputWithHead
													   
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.postCode}
                            name={'postalCode'}
                            value={userData.postalCode}
                            onChange={(e) =>  this.onChangeSetValue(e.target.value, "postalCode")}
                        />
					  
								
                    </div>
                <div className="col-sm"></div>
			   
            </div>
        </div>
        );
    };

    primaryContactEdit = (getFieldDecorator) => {
        
        let userData = this.state.userData
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0" >

                <div className='row'>
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('firstName', {
                        rules: [{ required: true, message: ValidationConstants.firstName}],
                        })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            name={'firstName'}
                            setFieldsValue={userData.firstName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                        />
                    )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('lastName', {
                        rules: [{ required: false }],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.lastName}
                            placeholder={AppConstants.lastName}
                            name={'lastName'}
                            setFieldsValue={userData.lastName}
                            onChange={(e) =>  this.onChangeSetValue(e.target.value, "lastName")}

                        />
                    )}
                    </Form.Item>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-sm" style={{paddingTop: "11px"}}>			   
                        <InputWithHead
                            style={{marginTop: "9px"}}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            name={'street1'}
                            value={userData.street1}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street1") }
                            />  					 								
                    </div>
                    <div className="col-sm" style={{paddingTop: "11px"}}> 
                        <InputWithHead
                            style={{marginTop: "9px"}}
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            name={'street2'}
                            value={userData.street2}
                            onChange={(e) =>  this.onChangeSetValue(e.target.value, "street2") }
                        />
                   
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" style={{paddingTop: "11px"}}>					   
                        <InputWithHead
                            style={{marginTop: "9px"}}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            name={'suburb'}
                            value={userData.suburb}
                            onChange={(e) =>  this.onChangeSetValue(e.target.value, "suburb")}

                        />					 								
                    </div>
                    <div className="col-sm" >
                    
                        <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                            <InputWithHead heading={AppConstants.stateHeading} />
                        </div>							   
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    placeholder={AppConstants.select_state}
                                    // onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                                    value={userData.stateRefId}
                                    name={'stateRefId'}
                                    onChange={(e) =>  this.onChangeSetValue(e, "stateRefId")}
                                >
                                    {stateList.length > 0 && stateList.map((item) => (
                                        < Option value={item.id}> {item.name}</Option>
                                    ))
                                    }
                                </Select> 							  									 
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row" >
                    <div className="col-sm" style={{paddingTop: "11px"}}>						   
                        <InputWithHead
                            style={{marginTop: "9px"}}
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.enterPostCode}
                            name={'postalCode'}
                            value={userData.postalCode}
                            onChange={(e) =>  this.onChangeSetValue(e.target.value, "postalCode")}
                        />								
                    </div>
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: ValidationConstants.emailField[0]}],
                        })(
                        <InputWithHead
                            heading={AppConstants.contactEmail}
                            placeholder={AppConstants.contactEmail}
                            name={'email'}
                            setFieldsValue={userData.email}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                        />
                        )}
                    </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('mobileNumber', {
                            rules: [{ required: true, message: ValidationConstants.contactField }],
                        })(
                        <InputWithHead
                            heading={AppConstants.contactMobile}
                            placeholder={AppConstants.contactMobile}
                            name={'mobileNumber'}
                            setFieldsValue={userData.mobileNumber}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}

                        />
                        )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" ></div>
                </div>
            </div>
        );
    };

    emergencyContactEdit = (getFieldDecorator) => {
        let userData = this.state.userData

        return (
            <div className="content-view pt-0">
                <div className='row'>
                    <div className="col-sm-12 col-md-6" >
                    <Form.Item >
                        {getFieldDecorator('emergencyFirstName', {
                            rules: [{ required: true, message: ValidationConstants.emergencyContactName[0] }],
                        })(
                        <InputWithHead
                            required={"required-field "}
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            name={'emergencyFirstName'}
                            setFieldsValue={userData.emergencyFirstName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyFirstName")}

                        />
                        )}
                    </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6" >
                    <Form.Item >
                        {getFieldDecorator('emergencyLastName', {
                            rules: [{ required: true, message: ValidationConstants.emergencyContactName[1] }],
                        })(
                        <InputWithHead
                            required={"required-field "}
                            heading={AppConstants.lastName}
                            placeholder={AppConstants.lastName}
                            name={'emergencyLastName'}
                            setFieldsValue={userData.emergencyLastName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyLastName")}

                        />
                        )}
                    </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6" >
                    <Form.Item >
                        {getFieldDecorator('emergencyContactNumber', {
                            rules: [{ required: true, message: ValidationConstants.emergencyContactNumber[0] }],
                        })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.mobileNumber}
                            placeholder={AppConstants.mobileNumber}
                            name={'emergencyContactNumber'}
                            setFieldsValue={userData.emergencyContactNumber}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyContactNumber")}

                        />
                        )}
                    </Form.Item>
                    </div>
                </div>
            </div>
        );
    };

    otherInfoEdit = (getFieldDecorator) => {
        let userData = this.state.userData
        const { countryList, nationalityList, genderList} = this.props.commonReducerState;
       
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm" >
                        <div style={{paddingTop: "11px", paddingBottom: "10px"}}>
                            <InputWithHead heading={AppConstants.gender}   required={"required-field"}></InputWithHead>
                                <Form.Item >
                                {getFieldDecorator(`genderRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.genderField }],
                                })(
                                    <Radio.Group
                                        className="reg-competition-radio"
                                        onChange={ (e) => this.onChangeSetValue(e.target.value, "genderRefId")}
                                        setFieldsValue={userData.genderRefId}>
                                            {(genderList || []).map((gender, genderIndex) => (
                                                <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                                            ))}
                                    </Radio.Group>
                                )}
                                </Form.Item>
                        </div>
                    </div>
                </div>
                {userData.userRegistrationId!= null &&
                <div>
                    <div className='row'>
                        <div className="col-sm" >
                            <div style={{paddingTop: "11px", paddingBottom: "10px"}}>
                                <InputWithHead heading={AppConstants.childCountry}/>
                            </div>
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.childCountry}
                                onChange={(e) => this.onChangeSetValue(e, "countryRefId")}
                                value={userData.countryRefId}
                                name={'countryRefId'}>
                                {countryList.length > 0 && countryList.map((country, index) => (
                                    < Option key={country.id} value={country.id}> {country.description}</Option>
                                ))
                                }
                            </Select>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{paddingTop: "11px", paddingBottom: "10px"}}>
                                <InputWithHead heading={AppConstants.nationalityReference} />
                            </div>
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.nationalityReference}
                                onChange={(e) => {this.onChangeSetValue(e, "nationalityRefId")}}
                                value={userData.nationalityRefId}
                                name={"nationalityRefId"}>
                                {nationalityList.length > 0 && nationalityList.map((nation, index) => (
                                    < Option key={nation.id} value={nation.id}> {nation.description}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm" >
                            <InputWithHead
                                heading={AppConstants.childLangSpoken}
                                placeholder={AppConstants.childLangSpoken}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "languages")}
                                value={userData.languages}
                                name={'languages'}
                            />
                        </div>
                    </div>
                </div>}
            </div>
        );
    };

    medicalEdit = (getFieldDecorator) => {
        let userData = this.state.userData
        let {disabilityList} = this.props.commonReducerState;
  
        return (
            <div className="formView pt-5" style={{paddingBottom : "40px"}}>
                 {/* <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>    */}
                 <InputWithHead heading={AppConstants.existingMedConditions}/>
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                         onChange={(e) => this.onChangeSetValue(e.target.value, "existingMedicalCondition")}
                         value={userData.existingMedicalCondition}
                         allowClear
                    />

                <InputWithHead heading={AppConstants.redularMedicalConditions}/>
                <TextArea
                    placeholder={AppConstants.redularMedicalConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "regularMedication")}
                    value={userData.regularMedication}           
                    allowClear/>
                   
                <div>
                    <InputWithHead heading={AppConstants.haveDisability} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onChangeSetValue(e.target.value, "isDisability" )} 
                        value={userData.isDisability}>
                        <Radio value={1}>{AppConstants.yes}</Radio>
                            {userData.isDisability == 1 ? 
                            <div style={{marginLeft: '25px'}}>
                                <InputWithHead heading={AppConstants.disabilityCareNumber} placeholder={AppConstants.disabilityCareNumber} 
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityCareNumber" )}
                                    value={userData.disabilityCareNumber}/>
                                <InputWithHead heading={AppConstants.typeOfDisability} />
                                <Radio.Group
                                    className="reg-competition-radio"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityTypeRefId" )} 
                                    value={userData.disabilityTypeRefId}>
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
            </div>
        )
    }
    //////form content view
    contentView = (getFieldDecorator) => {
        const { displaySection } = this.state;

        return (
            <div className="content-view pt-0">
 
            {/* {this.state.displaySection=="1"?
                <div>{this.addressEdit(getFieldDecorator)}</div>
            :null} */}

            {/* {(this.state.displaySection=="2" || this.state.displaySection=="6")?
                <div>{this.primaryContactEdit(getFieldDecorator)}</div>
            :null}  */}

            {(displaySection === "1" || displaySection === "2"  || displaySection === "6" || displaySection === "7" || displaySection === "8") && <div>{this.addressEdit(getFieldDecorator)}</div>}


            {displaySection=="3"?
                <div>{this.emergencyContactEdit(getFieldDecorator)}</div>
            :null} 

            {displaySection=="4"?
                <div>{this.otherInfoEdit(getFieldDecorator)}</div>
            :null}

            {displaySection=="5"?
                <div>{this.medicalEdit(getFieldDecorator)}</div>
            :null}

            </div>
        );
    };

    onSaveClick = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) =>{
            console.log("Error: " + err);
            if(!err)
            {
                let userState = this.props.userState;
                let data =  this.state.userData;
                data["section"] = this.state.section;
                data["organisationId"] = this.state.organisationId;
                if(this.state.displaySection == 8 && !data.parentUserId){
                    data["parentUserId"] = 0;
                }
                else if(this.state.displaySection == 7 && !data.childUserId){
                    data["childUserId"] = 0;
                }
                console.log("obj"+JSON.stringify(data))
                this.props.userProfileUpdateAction(data);
                this.setState({saveLoad: true});
            }
        });
    }


    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                            <NavLink to={{ pathname: `/userPersonal`,state: {tabKey: this.state.tabKey,userId : this.state.userData.userId}}} >
                                <Button type="cancel-button">{AppConstants.cancel}</Button>
                            </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Form.Item>
                                    <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                        {AppConstants.save}
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /////main render method
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} onMenuHeadingClick ={()=>history.push("./userTextualDashboard")}/>
                {/* <InnerHorizontalMenu menu={"user"} userSelectedKey={"5"} /> */}
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.onSaveClick}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            <Loader visible={this.props.userState.onUpUpdateLoad } />
                        </Content>

                        <Footer >{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        userProfileUpdateAction,
        getCommonRefData, 
        countryReferenceAction,
        nationalityReferenceAction,
        genderReferenceAction,
        disabilityReferenceAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        userState: state.UserState,

    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(UserProfileEdit));


