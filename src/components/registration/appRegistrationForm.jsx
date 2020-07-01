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
    personRegisteringRoleReferenceAction } from '../../store/actions/commonAction/commonAction';

import { saveEndUserRegistrationAction,updateEndUserRegisrationAction, orgRegistrationRegSettingsEndUserRegAction,
    membershipProductEndUserRegistrationAction, getUserRegistrationUserInfoAction,
    clearRegistrationDataAction, updateRegistrationSettingsAction, 
    updateTeamAction, updateYourInfoAction, getTermsAndConditionsAction} from 
            '../../store/actions/registrationAction/endUserRegistrationAction';
import { getAge,deepCopyFunction} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {getOrganisationId,  getCompetitonId, getUserId, getAuthToken } from "../../util/sessionStorage";
import CSVReader from 'react-csv-reader'

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;

const papaparseOptions = {
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

const teamColumns = [
    {
        title: "Type",
        dataIndex: "competitionMembershipProductTypeId",
        key: "competitionMembershipProductTypeId",
        width: 160,
        render: (competitionMembershipProductTypeId, record, index) =>
        {
            const { getFieldDecorator } = this_Obj.props.form;
            let registrationState = this_Obj.props.endUserRegistrationState;
            let registrationDetail = registrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            let userRegistration = userRegistrations[record.index]; 
            let memProds = userRegistration!= null && userRegistration.competitionInfo!= null && 
                            userRegistration.competitionInfo.membershipProducts!= null &&  
                            userRegistration.competitionInfo.membershipProducts.filter(x=>x.allowTeamRegistrationTypeRefId!= null);
           

            return (
                <Form.Item >
                    {getFieldDecorator(`tCompetitionMembershipProductTypeId${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductIsRequired }],
                    })(
                        <Select
                            disabled = {record.isDisabled}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this_Obj.onChangeSetTeam(e, "competitionMembershipProductTypeId", record.index, "players", index )}
                            setFieldsValue={competitionMembershipProductTypeId}
                            placeholder={'Type'}>
                        {(memProds || []).map((mem, pIndex) => (
                                <Option key={mem.competitionMembershipProductTypeId} 
                                value={mem.competitionMembershipProductTypeId} >{mem.shortName}</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>
            )
        }, 
    },
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
        width: 160,
        render: (firstName, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (

                <Form.Item >
                    {getFieldDecorator(`playerFirstName${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                    })(
                        <InputWithHead
                            disabled = {record.isDisabled}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court"
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "firstName", record.index,  "players", index  )}
                            setFieldsValue={firstName}
                            placeholder={AppConstants.firstName}
                        />
                    )}
                </Form.Item>
            )
        }
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        width: 160,
        render: (lastName, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (

                <Form.Item >
                    {getFieldDecorator(`playerLastName${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                    })(
                        <InputWithHead
                            disabled = {record.isDisabled}
                            className="input-inside-table-venue-court"
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "lastName", record.index,  "players", index  )}
                            setFieldsValue={lastName}
                            placeholder={AppConstants.lastName}

                        />
                    )}
                </Form.Item>
            )
        }
    },
    // {
    //     title: "DOB",
    //     dataIndex: "dateOfBirth",
    //     key: "dateOfBirth",
    //     width: 160,
    //     render: (dateOfBirth, record, index) => {
    //         const { getFieldDecorator } = this_Obj.props.form;
    //         return (
    //                 <Form.Item >
    //                 {getFieldDecorator(`playerDateOfBirth${index}`, {
    //                     rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
    //                 })(
    //                 <DatePicker
    //                     size="large"
    //                     className="team-reg-player-dob"
    //                     style={{ width: "100%" }}
    //                     onChange={(e) => this_Obj.onChangeSetTeam(e, "dateOfBirth", record.index,  "players", index  )}
    //                     format={"DD-MM-YYYY"}
    //                     showTime={false}
    //                     name={'dateOfBirth'}
    //                 />
    //                 )}
    //                 </Form.Item>
    //         )
    //     }
    // },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 160,
        render: (email, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (
                <Form.Item >
                    {getFieldDecorator(`playerEmail${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                        <InputWithHead className="input-inside-table-venue-court"
                            disabled = {record.isDisabled}
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "email", record.index,  "players", index  )}
                            setFieldsValue={email}
                            placeholder={AppConstants.email}
                        />
                    )}
                </Form.Item>
            )
        }
    },
    {
        title: "Mobile",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
        width: 160,
        render: (mobile, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (
                <Form.Item >
                    {getFieldDecorator(`playerMobileNumber${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.contactField }],
                    })(
                        <InputWithHead className="input-inside-table-venue-court"
                            disabled = {record.isDisabled}
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "mobileNumber", record.index,  "players", index  )} 
                            setFieldsValue={mobile}
                            placeholder={AppConstants.mobile}
                        />
                    )}
                </Form.Item>
            )
        }
    },
    {
        title: "Paying for?",
        dataIndex: "payingFor",
        key: "payingFor",
        width: 100,
        render: (payingFor, record, index) => 
        {
            let registrationState = this_Obj.props.endUserRegistrationState;
            let registrationDetail = registrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            let userRegistration = userRegistrations[record.index]; 
            let registrationTypeId = 1;
            if(userRegistration!= null){
                let team = userRegistration.team;
                if(team!= null && team.registrationTypeId!= null && team.registrationTypeId!= undefined){
                    registrationTypeId = team.registrationTypeId;
                }
            }
            
            return (
                <div>
                    {(record.isPlayer == 1 || record.isPlayer == null) && 
                    <Checkbox
                        checked={registrationTypeId == 1 ? payingFor : true}
                        disabled = {record.isDisabled}
                        // disabled={registrationTypeId == 2 ? true : false}
                        className="single-checkbox mt-1 d-flex justify-content-center"
                        onChange={(e) => this_Obj.onChangeSetTeam(e.target.checked, "payingFor", record.index,  "players", index  )} 
                    ></Checkbox>}
                </div>
            )
        }
    },
    {
        title: "",
        dataIndex: "clear",
        key: "clear",
        width: 30,
        render: (clear, record, index) => (
            <span style={{ display: "flex", justifyContent: "center", width: "100%", cursor: 'pointer' }}>
                <input
                    className="dot-image"
                    src={AppImages.redCross}
                    alt=""
                    type="image"
                    width="16"
                    height="16"
                    disabled = {record.isDisabled}
                    onClick={() => this_Obj.onChangeSetTeam(null, "removePlayer", record.index,  "players", index  )} 
                />
            </span>
        )
    }
];

const teamColumnsOnBehalf = [
    {
        title: "Type",
        dataIndex: "competitionMembershipProductTypeId",
        key: "competitionMembershipProductTypeId",
        width: 160,
        render: (competitionMembershipProductTypeId, record, index) =>
        {
            const { getFieldDecorator } = this_Obj.props.form;
            let registrationState = this_Obj.props.endUserRegistrationState;
            let registrationDetail = registrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            let userRegistration = userRegistrations[record.index]; 
            let memProds = userRegistration!= null && userRegistration.competitionInfo!= null && 
                            userRegistration.competitionInfo.membershipProducts!= null &&  
                            userRegistration.competitionInfo.membershipProducts.filter(x=>x.allowTeamRegistrationTypeRefId!= null);
           

            return (
                <Form.Item >
                    {getFieldDecorator(`tCompetitionMembershipProductTypeId${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductIsRequired }],
                    })(
                        <Select
                            disabled = {record.isDisabled}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this_Obj.onChangeSetTeam(e, "competitionMembershipProductTypeId", record.index, "players", index )}
                            setFieldsValue={competitionMembershipProductTypeId}
                            placeholder={'Type'}>
                        {(memProds || []).map((mem, pIndex) => (
                                <Option key={mem.competitionMembershipProductTypeId} 
                                value={mem.competitionMembershipProductTypeId} >{mem.shortName}</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>
            )
        }, 
    },
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
        width: 160,
        render: (firstName, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (

                <Form.Item >
                    {getFieldDecorator(`playerFirstName${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                    })(
                        <InputWithHead
                            disabled = {record.isDisabled}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court"
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "firstName", record.index,  "players", index  )}
                            setFieldsValue={firstName}
                            placeholder={AppConstants.firstName}
                        />
                    )}
                </Form.Item>
            )
        }
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        width: 160,
        render: (lastName, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (

                <Form.Item >
                    {getFieldDecorator(`playerLastName${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                    })(
                        <InputWithHead
                            disabled = {record.isDisabled}
                            className="input-inside-table-venue-court"
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "lastName", record.index,  "players", index  )}
                            setFieldsValue={lastName}
                            placeholder={AppConstants.lastName}

                        />
                    )}
                </Form.Item>
            )
        }
    },
    // {
    //     title: "DOB",
    //     dataIndex: "dateOfBirth",
    //     key: "dateOfBirth",
    //     width: 160,
    //     render: (dateOfBirth, record, index) => {
    //         const { getFieldDecorator } = this_Obj.props.form;
    //         return (
    //                 <Form.Item >
    //                 {getFieldDecorator(`playerDateOfBirth${index}`, {
    //                     rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
    //                 })(
    //                 <DatePicker
    //                     size="large"
    //                     className="team-reg-player-dob"
    //                     style={{ width: "100%" }}
    //                     onChange={(e) => this_Obj.onChangeSetTeam(e, "dateOfBirth", record.index,  "players", index  )}
    //                     format={"DD-MM-YYYY"}
    //                     showTime={false}
    //                     name={'dateOfBirth'}
    //                 />
    //                 )}
    //                 </Form.Item>
    //         )
    //     }
    // },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: 160,
        render: (email, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (
                <Form.Item >
                    {getFieldDecorator(`playerEmail${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                        <InputWithHead className="input-inside-table-venue-court"
                            disabled = {record.isDisabled}
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "email", record.index,  "players", index  )}
                            setFieldsValue={email}
                            placeholder={AppConstants.email}
                        />
                    )}
                </Form.Item>
            )
        }
    },
    {
        title: "Mobile",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
        width: 160,
        render: (mobile, record, index) => {
            const { getFieldDecorator } = this_Obj.props.form;
            return (
                <Form.Item >
                    {getFieldDecorator(`playerMobileNumber${record.index}${index}`, {
                        rules: [{ required: true, message: ValidationConstants.contactField }],
                    })(
                        <InputWithHead className="input-inside-table-venue-court"
                            disabled = {record.isDisabled}
                            onChange={(e) => this_Obj.onChangeSetTeam(e.target.value, "mobileNumber", record.index,  "players", index  )} 
                            setFieldsValue={mobile}
                            placeholder={AppConstants.mobile}
                        />
                    )}
                </Form.Item>
            )
        }
    },
    {
        title: "",
        dataIndex: "clear",
        key: "clear",
        render: (clear, record, index) => (
            <span style={{ display: "flex", justifyContent: "center", width: "100%", cursor: 'pointer' }}>
                <input
                    className="dot-image"
                    src={AppImages.redCross}
                    type="image"
                    disabled = {record.isDisabled}
                    alt=""
                    width="16"
                    height="16"
                    onClick={() => this_Obj.onChangeSetTeam(null, "removePlayer", record.index,  "players", index  )} 
                />
            </span>
        )
    }
];

class AppRegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreeTerm: false,
            competitionUniqueKey: getCompetitonId(),
            organisationUniqueKey: getOrganisationId(),
            // locUserId: getUserId(),
            // locToken: getAuthToken(),
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
            getMembershipLoad: false,
            getUserLoad:false,
            csvData: null,
            uploadPlayerModalVisible: false
        };
        this_Obj = this;
     
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
        this.props.personRegisteringRoleReferenceAction();
       // this.getUserInfo();
       // this.props.clearRegistrationDataAction();
       
    }

    componentDidMount(){
        console.log("Component Did mount");
        this.getUserInfo();
        let payload = {
            competitionUniqueKey: this.state.competitionUniqueKey,
            organisationUniqueKey: this.state.organisationUniqueKey
        }

        // alert("UserId::" + this.state.locUserId);
        // alert("Token::" + this.state.locToken);

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
                    if(getUserId() != 0 ){
                        if(registrationState.userInfoOnLoad == false && this.state.getUserLoad == true){
                            this.setState({getMembershipLoad: false, getUserLoad: false})
                            this.addParticipant(0, 1);
                        }
                    }
                    else{
                        this.setState({getMembershipLoad: false})
                        this.addParticipant(0, 1);
                    }
                   
                }
        }

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

                    this.clearLocalStorage();
                    // history.push('/appRegistrationSuccess');
                }
            }
       }

       if(registrationState.populateParticipantDetails  == 1)
       {
          
           let user = registrationState.user;
           this.setFormFields(user, this.state.participantIndex);
           this.props.updateEndUserRegisrationAction(0, "populateParticipantDetails");
       }

       if(registrationState.populateYourInfo  == 1)
       {
           let userInfo = registrationState.userInfo;
           if(userInfo!= null && userInfo.length > 0){
                let user = userInfo.find(x=>x.id == getUserId());
                if(user!= null && user!= undefined){
                    this.props.updateEndUserRegisrationAction(0, "populateYourInfo");
                    this.setUserInfoFormFields(user, this.state.participantIndex);
                  
                }
           }
       }
       
       if(registrationState.refFlag === "parent")
       {
            this.props.updateEndUserRegisrationAction("", "refFlag");
            this.setParentFormFields(this.state.participantIndex);
       }

       if(registrationState.refFlag === "product")
       {
            this.props.updateEndUserRegisrationAction("", "refFlag");
            this.setProductFormFields(this.state.participantIndex);
       }

       if(registrationState.refFlag === "participant")
       {
            this.props.updateEndUserRegisrationAction("", "refFlag");
            let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            (userRegistrations || []).map((item, index) => {
                this.setFormFields(item, index);
            });
       }

       if(registrationState.setCompOrgKey == true){
           if(registrationState.registrationDetail!= null && 
            registrationState.registrationDetail.userRegistrations!= null && 
            registrationState.registrationDetail.userRegistrations.length > 0){
                if(registrationState.registrationDetail.userRegistrations[0].isPlayer!= -1 
                    ||registrationState.registrationDetail.userRegistrations[0].registeringYourself == 4)
                {
                    this.props.updateEndUserRegisrationAction(false, "setCompOrgKey");
                    this.props.form.setFieldsValue({
                        [`organisationUniqueKey0`]: this.state.organisationUniqueKey,
                        [`competitionUniqueKey0`]:  this.state.competitionUniqueKey,
                    });
                }
            }
        }

        if(registrationState.refFlag == "userInfo"){
            this.props.updateEndUserRegisrationAction("", "refFlag");
            let userInfoList = registrationState.userInfo;
            let userFilteredList = userInfoList.filter(x=>x.isDisabled == 0);
            if(userFilteredList!= null && userFilteredList!= undefined && userFilteredList.length > 0){
                let user = userFilteredList.find(x=>x);
                this.onChangeSetUserSelection( user.id, "userId", this.state.participantIndex);
            }
            
        }
        if(registrationState.refFlag == "divisionParticipant"){
            this.props.updateEndUserRegisrationAction("", "refFlag");
            this.props.form.setFieldsValue({
                [`competitionMembershipProductTypeId${this.state.participantIndex}`]:  null,
                [`competitionMembershipProductDivisionId${this.state.participantIndex}`]:  null,
            });
        }
        if(registrationState.refFlag == "divisionProduct"){
            this.props.updateEndUserRegisrationAction("", "refFlag");
            this.props.form.setFieldsValue({
                [`participantMembershipProductTypeId${this.state.participantIndex}${this.state.productIndex}`]:  null,
                [`competitionMembershipProductDivisionId${this.state.participantIndex}${this.state.productIndex}`]:  null,
            });
        }

        if(registrationState.refFlag == "players"){
            this.props.updateEndUserRegisrationAction("", "refFlag");
            this.setPlayersFormField();
        }
    }

    setPlayersFormField = () => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations.filter(x=>x.registeringYourself == 4);
       
        (userRegistrations || []).map((item, index) => {

            (item.team.players || []).map((it, pIndex) => {
                this.props.form.setFieldsValue({
                    [`tCompetitionMembershipProductTypeId${index}${pIndex}`]:  it.competitionMembershipProductTypeId,
                    [`playerFirstName${index}${pIndex}`]:  it.firstName,
                    [`playerLastName${index}${pIndex}`]: it.lastName,
                    [`playerEmail${index}${pIndex}`]: it.email,
                    [`playerMobileNumber${index}${pIndex}`]: it.mobileNumber,
                    [`playerDateOfBirth${index}${pIndex}`]: it.dateOfBirth
                });
            })
        })
    }

    getRegistrationSettings = (competitionUniqueKey, organisationUniqueKey, index, prodIndex) => {
        let payload = {
            competitionUniqueKey: competitionUniqueKey,
            organisationUniqueKey: organisationUniqueKey,
            participantIndex: index,
            prodIndex: prodIndex
        }
       // this.props.updateEndUserRegisrationAction(index, "participantIndex");
        this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
    }

    getUserInfo = () => {
        //console.log("getUserInfo::" + getUserId());
        if(getUserId() != 0)
        {
            let payload = {
                competitionUniqueKey: getCompetitonId(),
                organisationId: getOrganisationId(),
                userId: getUserId()
            }
            //console.log("payload::" + JSON.stringify(payload));
            this.setState({getUserLoad: true});
            this.props.getUserRegistrationUserInfoAction(payload);
        }
        
    }

    setImage = (data, index, key) => {
       // console.log("data**", data.files[0] + "Key::" + key)
        if (data.files[0] !== undefined) {
            let registrationState = this.props.endUserRegistrationState;
            let registrationDetail = registrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            let userRegistration = userRegistrations[index];
            if(key == "participantPhoto"){
                userRegistration[key] = data.files[0];
                userRegistration["profileUrl"] = URL.createObjectURL(data.files[0]);
                this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
            }
            else if(key == "yourInfoPhoto"){
                userRegistration["yourInfo"][key] = data.files[0];
                userRegistration["yourInfo"]["profileUrl"] = URL.createObjectURL(data.files[0]);
                this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
            }
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

    selectYourInfoImage(index) {
        const fileInput = document.getElementById('user-your-info-pic' + index);
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
       
        let participantObj = this.getParticipantObj(userRegistrations.length + 1);
       
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
                        this.getRegistrationSettings(this.state.competitionUniqueKey, this.state.organisationUniqueKey, 0);
                        this.callTermsAndConditions(this.state.organisationUniqueKey);
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

    getParticipantObj = (tempParticipantId) =>{
        let participantObj = {
           // tempParticipantId: userRegistrations.length + 1,
            tempParticipantId: tempParticipantId,competitionUniqueKey: null,organisationUniqueKey: null, 
            registeringYourself: 0,isSameParentContact: false,isLinkExistingParent: false,
            isVoucherAdded: false,whoAreYouRegistering: 0, whatTypeOfRegistration: 0,userId: null,
            competitionMembershipProductTypeId:null, competitionMembershipProductDivisionId: 0,divisionName:"",
            genderRefId: 1,dateOfBirth:"",firstName: "",middleName:"",lastName:"",mobileNumber:"",email: "",
            reEnterEmail: "", street1:"",street2:"",suburb:"",stateRefId: 1,postalCode: "",statusRefId: 0,
            emergencyContactName: "",emergencyContactNumber: "",isPlayer: -1,userRegistrationId:0,
            playedBefore: 0,playedYear: null,playedClub: "",playedGrade: "",lastCaptainName: "",
            existingMedicalCondition: "",regularMedication: "",heardByRefId: 0,heardByOther: "",
            favouriteTeamRefId: null,favouriteFireBird: null, isConsentPhotosGiven: 0, participantPhoto: null,
            profileUrl: null, voucherLink: "", isDisability: 0, disabilityCareNumber: '',
            disabilityTypeRefId: 0, playerId:0, positionId1: null, positionId2:  null,
            parentOrGuardian: [], friends: [], referFriends: [], products:[], tempParents: [],
            countryRefId: null, nationalityRefId: null,languages: "", organisationInfo: null,
            competitionInfo: null, specialNote:null, training: null, contactDetails: null,
            postalCode: "", alternativeLocation: "", registrationOpenDate: null,
            registrationCloseDate: null, venue: [], regSetting: this.getOrgSettingsObj(),
            divisions: [], team:{}, yourInfo:{firstName: "",middleName:"",lastName:"",mobileNumber:"",email: "",
            reEnterEmail: "", street1:"",street2:"",suburb:"",stateRefId: 1,postalCode: ""}			 
        }

        return participantObj;
    }

    getOrgSettingsObj = () =>{
       let obj =  {"updates":0,"daily":0,"weekly":0,"monthly":0,"played_before":0,
                    "nominate_positions":0,"last_captain":0,"play_friend":0,"refer_friend":0,
                    "attended_state_game":0,"photo_consent":0,"club_volunteer":0,"country":0,
                    "nationality":0,"language":0,"disability":0,"shop":0,"voucher":0}
        return obj;
    }

    setUserInfo = (participantObj, userInfo, userRegistrations, index) => {
       // console.log("userInfo" + JSON.stringify(userInfo));
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
                (userInfo.parentOrGuardian || []).map((item, userIndex) => {
                    this.addParent(index, userRegistrations, item);
                })
            }

           (userInfo.friends || []).map((item, fIndex) => {
               this.addFriend(index, "friend", "participant",null, item);
           });

           (userInfo.referFriends || []).map((item, fIndex) => {
            this.addFriend(index, "referFriend", "participant",null, item);
            })

            if(userInfo.additionalInfo != null){
                let addInfo = userInfo.additionalInfo;
                participantObj.countryRefId = addInfo.countryRefId;
                participantObj.disabilityCareNumber = addInfo.disabilityCareNumber
                participantObj.disabilityTypeRefId = addInfo.disabilityTypeRefId
                participantObj.existingMedicalCondition = addInfo.existingMedicalCondition
                participantObj.favouriteFireBird = addInfo.favouriteFireBird
                participantObj.favouriteTeamRefId = addInfo.favouriteTeamRefId
                participantObj.heardByOther = addInfo.heardByOther
                participantObj.heardByRefId = addInfo.heardByRefId
                participantObj.isConsentPhotosGiven = addInfo.isConsentPhotosGiven
                participantObj.isDisability = addInfo.isDisability
                participantObj.languages = addInfo.languages
                participantObj.lastCaptainName = addInfo.lastCaptainName
                participantObj.nationalityRefId = addInfo.nationality
                participantObj.playedBefore = addInfo.playedBefore
                participantObj.playedClub = addInfo.playedClub
                participantObj.playedYear = addInfo.playedYear
                participantObj.playedGrade = addInfo.playedGrade
                participantObj.regularMedication = addInfo.regularMedication
                participantObj.positionId1 = addInfo.positionId1
                participantObj.positionId2 = addInfo.positionId2
               // participantObj.voucherLink = addInfo.voucherLink
                if(addInfo.voucherLink!= null)
                    this.addVoucher(participantObj, addInfo);
            }
            if(userInfo.registrationVolunteer!= null){
                (this.state.volunteerList || []).map((info, index) => {
                    let volun = (userInfo.registrationVolunteer.find(x=>x.registrationOtherInfoRefId == info.id));
                    if(volun!= null){
                    info.isActive = true;
                    }
                })
            }
        }
    }

    existingUserPopulate =() =>{
        let registrationState = this.props.endUserRegistrationState;
        if(getUserId() != 0){
            let userInfoList = registrationState.userInfo;
           // console.log("**********" + JSON.stringify(userInfoList));
            if(userInfoList!= null && userInfoList.length == 1){
                let user = userInfoList.find(x=>x);
               
                if(user.isDisabled == 0){
                   // console.log("##########")
                    this.props.updateEndUserRegisrationAction("userInfo", "refFlag");
                }
            }
        }
    }

    setUserInfoFormFields = (userInfo, index) => {
      //  console.log("setUserInfoFormFields"+ JSON.stringify(userInfo));

        this.props.form.setFieldsValue({
            [`yFirstName${index}`]: userInfo!= null ? userInfo.firstName : "",
            [`yLastName${index}`]:  userInfo!= null ? userInfo.lastName : "",
            [`yMobileNumber${index}`]:  userInfo!= null ? userInfo.mobileNumber : "",
            [`yEmail${index}`]:  userInfo!= null ? userInfo.email : "",
            [`yReEnterEmail${index}`]:  userInfo!= null ? userInfo.email : "",
            [`yStreet1${index}`]:  userInfo!= null ? userInfo.street1 : "",
            [`ySuburb${index}`]:  userInfo!= null ? userInfo.suburb : "",
            [`yStateRefId${index}`]:  userInfo!= null ? userInfo.stateRefId : null,
            [`yPostalCode${index}`]:  userInfo!= null ? userInfo.postalCode : "",
        });
    }

    setFormFields = (userInfo, index) => {
       // console.log("setFormFields"+ JSON.stringify(userInfo));
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 

        this.props.form.setFieldsValue({
            [`organisationUniqueKey${index}`]: userInfo!= null ? userInfo.organisationUniqueKey : null,
            [`competitionUniqueKey${index}`]: userInfo!= null ? userInfo.competitionUniqueKey : null,
            [`competitionMembershipProductTypeId${index}`]: userInfo!= null ? userInfo.competitionMembershipProductTypeId : null,
            [`competitionMembershipProductDivisionId${index}`]: userInfo!= null ? userInfo.competitionMembershipProductDivisionId : null,
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
                (userInfo.parentOrGuardian || []).map((item, parentIndex) => {
                    this.setParentformFieldsValue(index, parentIndex, item);
                })
            }
        }
    }
        
    setProductFormFields = (index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
      
        (userRegistration.products || []).map((item, pIndex) => {
            this.props.form.setFieldsValue({
                [`organisationUniqueKey${index}${pIndex}`]: item.organisationUniqueKey,
                [`competitionUniqueKey${index}${pIndex}`]: item.competitionUniqueKey,
                [`participantMembershipProductTypeId${index}${pIndex}`]: item.competitionMembershipProductTypeId,
                [`competitionMembershipProductDivisionId${index}${pIndex}`]: item.competitionMembershipProductDivisionId,
               
            });
        })
       
    }

    setParentFormFields = (index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index]; 
      
        console.log("userRegistration.parentOrGuardian" + JSON.stringify(userRegistration.parentOrGuardian));
        (userRegistration.parentOrGuardian || []).map((item, parentIndex) => {
            this.setParentformFieldsValue(index, parentIndex, item);
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
            positionId1: null,
            positionId2: null,
            competitionMembershipProductTypeId: null,
            competitionMembershipProductDivisionId: null,
            friends: [],
            referFriends: [],
            divisions: []		 
        }
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = registrationDetail.userRegistrations[index];
        let products = userRegistration.products;
        products.push(product);
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    addVoucher = (participantObj, userInfo) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let vouchers = registrationDetail.vouchers;
        let voucher = {
            tempParticipantId: null,
            voucherLink: ""
        }

        if(participantObj!= null && userInfo!= null){
            voucher.tempParticipantId = participantObj.tempParticipantId;
            voucher.voucherLink = userInfo.voucherLink;
        }

        vouchers.push(voucher);
        this.props.updateEndUserRegisrationAction   (vouchers, "vouchers");
    }

    addFriend = (index, key, participantOrProduct, prodIndex, data) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
       
        let friendObj = {
            friendId: 0,firstName:"",lastName:"",email:"",mobileNumber:""
        }
        if(data!= null && data!= undefined){
            friendObj = {
                friendId: data.friendId,firstName:data.firstName,
                lastName:data.lastName,email:data.email,mobileNumber:data.mobileNumber  
            }
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
        // console.log("parentObj ::" + JSON.stringify(parentObj));
        // console.log("ParentOrGuardian" + JSON.stringify(userRegistration.parentOrGuardian));
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
            userRegistration["hasDivisionError"] = false;
            let memProd = userRegistration.competitionInfo.membershipProducts.
                find(x=>x.competitionMembershipProductTypeId === value);
            //console.log("***********" + value);
        
			let divisions = this.getDivisionByFilter(userRegistration, value, userRegistration);
            //console.log("&&&&&&&&&&" + JSON.stringify(divisions));
            if(divisions!= null && divisions!= undefined && divisions.length > 0)
            {
				userRegistration[key] = value;
                userRegistration["isPlayer"] = memProd.isPlayer;												
                if(divisions.length == 1)
                {
                    userRegistration["competitionMembershipProductDivisionId"] = 
                    divisions[0].competitionMembershipProductDivisionId;
                    userRegistration["divisionName"] =  divisions[0].divisionName;
                    userRegistration["divisions"] = [];
                }
                else{
                    userRegistration.competitionMembershipProductDivisionId = null;
                    this.props.form.setFieldsValue({
                        [`competitionMembershipProductDivisionId${index}`]:  null,
                    });
					userRegistration["divisions"] = divisions;
                }
            }
            else{
                userRegistration["divisionName"] =  null;
                userRegistration.competitionMembershipProductDivisionId = null;
                userRegistration["divisions"] = [];
                value = null;
                //console.log("^^^^^^^" + value);
            }
           
            //userRegistration["isPlayer"] = memProd.isPlayer;
            // Enable the existing one and disable the new one
            // let oldMemProd = userRegistration.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId === userRegistration.competitionMembershipProductTypeId);
            // if(oldMemProd!= null && oldMemProd!= "" && oldMemProd!= undefined)
            // {
            //     oldMemProd.isDisabled = false;
            // }
            // memProd.isDisabled = true;
        }
        else if(key === "whatTypeOfRegistration")
        {
            let userInfoLen = [];
            if(userInfo!= null && userInfo!= undefined){
                userInfoLen = userInfo.filter(x=>x);
            }
            if(getUserId()  == 0 || (userInfoLen.length <= 1)){
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
                else if(value == 2) {
                    userRegistration["isPlayer"] = 0;
                }
                this.setState({participantIndex: index});
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
            let isParentAvailable = false;
      
            (userRegistrations ||[]).map((item, index) => {
                    if(item.parentOrGuardian.length > 0){
                        isParentAvailable = true;
                    }
            });
            if(getAge(value) <= 18 && !isParentAvailable)
            {
                this.addParent(index, userRegistrations);
            }

            userRegistration[key] = value;
            this.validateDivision(userRegistration, index);
        }
        else if(key == "genderRefId"){
            userRegistration[key] = value;
            this.validateDivision(userRegistration, index);
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
           // console.log("organisationInfo::" + JSON.stringify(organisationInfo));
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
            userRegistration["hasDivisionError"] = false;
            userRegistration.venue = [];
            this.props.form.setFieldsValue({
                [`competitionUniqueKey${index}`]:  null,
                [`competitionMembershipProductTypeId${index}`]:  null,
                [`competitionMembershipProductDivisionId${index}`]:  null,
                
            });

            this.callTermsAndConditions(value);
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
            userRegistration["hasDivisionError"] = false;
            userRegistration.products = [];
            userRegistration.divisionName = null;
            this.props.form.setFieldsValue({
                [`competitionMembershipProductTypeId${index}`]:  null,
                [`competitionMembershipProductDivisionId${index}`]:  null,
            });

            this.getRegistrationSettings(competitionInfo.competitionUniqueKey, userRegistration.organisationUniqueKey, index);
           
        }
        else if(key == "whoAreYouRegistering"){
            if(value == 2){
                if(userInfo!= null && userInfo.length > 0 && index == 0){
                    let user = userInfo.find(x=>x.id == getUserId());
                    if(user!= null && user!= "" && user!= undefined)
                    {
                        user.isDisabled = 1;
                        userRegistration["yourInfo"]["userId"] = getUserId();
                        this.props.updateEndUserRegisrationAction(userInfo, "userInfo");
                        this.setState({participantIndex: index});
                        this.setYourInfo(user, userRegistration);
                    }
                }
            }
        }

        userRegistration[key] = value;
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations", key);

        if(key == "competitionMembershipProductTypeId" && value == null){
            this.setState({participantIndex: index})
            this.props.updateEndUserRegisrationAction("divisionParticipant", "refFlag");
        }
    }

    callTermsAndConditions = (organisationUniqueKey) => {
        let obj = {
            organisationUniqueKey: organisationUniqueKey
        }
        this.props.getTermsAndConditionsAction(obj);
    }

    setYourInfo = (userInfo, userRegistration) => {
        userRegistration["yourInfo"]["userId"] = getUserId();
        userRegistration["yourInfo"]["firstName"] = userInfo!= null ? userInfo.firstName : "";
        userRegistration["yourInfo"]["middleName"] = userInfo!= null ? userInfo.middleName : "";
        userRegistration["yourInfo"]["lastName"] =  userInfo!= null ? userInfo.lastName : "";
        userRegistration["yourInfo"]["mobileNumber"] =  userInfo!= null ? userInfo.mobileNumber : "";
        userRegistration["yourInfo"]["email"] =  userInfo!= null ? userInfo.email : "";
        userRegistration["yourInfo"]["reEnterEmail"] =  userInfo!= null ? userInfo.email : "";
        userRegistration["yourInfo"]["street1"] =  userInfo!= null ? userInfo.street1 : "";
        userRegistration["yourInfo"]["street2"] =  userInfo!= null ? userInfo.street2 : "";
        userRegistration["yourInfo"]["suburb"] =  userInfo!= null ? userInfo.suburb : "";
        userRegistration["yourInfo"]["stateRefId"] =  userInfo!= null ? userInfo.stateRefId : null;
        userRegistration["yourInfo"]["postalCode"] =  userInfo!= null ? userInfo.postalCode : "";
    }

    validateDivision = (userRegistration, index) => {
        if(userRegistration!= null){
            userRegistration["hasDivisionError"] = false;
            let competitionMembershipProductTypeId = userRegistration.competitionMembershipProductTypeId;
            if(competitionMembershipProductTypeId!= null){
                let divisions = this.getDivisionByFilter(userRegistration, competitionMembershipProductTypeId, userRegistration);
                let isAvailable = false;
                if(divisions!= null && divisions.length > 0){
                    (divisions || []).map((d, i) => {
                        if(d.competitionMembershipProductDivisionId == userRegistration.competitionMembershipProductDivisionId){
                            isAvailable = true;
                        }
                    })
                }
                if(!isAvailable){
                    this.props.form.setFieldsValue({
                        [`competitionMembershipProductTypeId${index}`]:  null,
                        [`competitionMembershipProductDivisionId${index}`]:  null,
                    });
                    userRegistration["divisionName"] =  null;
                    userRegistration["divisions"] = [];
                    userRegistration.competitionMembershipProductTypeId = null;
                    userRegistration.competitionMembershipProductDivisionId = null;
                    
                }
                else{
                    userRegistration["divisions"] = divisions;
                }

                if(divisions == null || divisions == undefined || divisions.length == 0){
                    userRegistration["hasDivisionError"] = true;
                }

                (userRegistration.products || []).map((item, pIndex) => {
                    if(item.competitionMembershipProductTypeId!= null){
                        let divisions = this.getDivisionByFilter(item, item.competitionMembershipProductTypeId, userRegistration);
                        let isAvailable = false;

                        if(divisions!= null && divisions.length > 0){
                            (divisions || []).map((d, i) => {
                                if(d.competitionMembershipProductDivisionId == item.competitionMembershipProductDivisionId){
                                    isAvailable = true;
                                }
                            })
                        }
                        if(!isAvailable){
                            this.props.form.setFieldsValue({
                                [`participantMembershipProductTypeId${index}${pIndex}`]:  null,
                                [`competitionMembershipProductDivisionId${index}${pIndex}`]:  null,
                            });
                            item["divisionName"] =  null;
                            item["divisions"] = [];
                            item.competitionMembershipProductTypeId = null;
                            item.competitionMembershipProductDivisionId = null;
                            item.friends = [];
                            item.referFriends = [];
                            item.positionId1 = null;
                            item.positionId2 = null;
                        }
                        else{
                            item["divisions"] = divisions;
                        }

                        if(divisions == null || divisions == undefined || divisions.length == 0){
                            userRegistration["hasDivisionError"] = true;
                        }
                        
                    }
                })
                
            }
        }
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


        userRegistration[key] = value;

        if(userRegistration.whoAreYouRegistering == 2 && index == 0){
            this.props.updateEndUserRegisrationAction(1, "populateYourInfo");
        }
        
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
        userRegistration["hasDivisionError"] = false;
        if(key == "competitionMembershipProductDivisionId"){

            product["competitionMembershipProductDivisionId"] = value;
            //product["divisionName"] = divisionName;
        }
        else if(key == "organisationUniqueKey"){
            product["organisationUniqueKey"] = value;
            product["competitionUniqueKey"] = null;
            product["competitionInfo"] = [];


            this.props.form.setFieldsValue({
                [`competitionUniqueKey${index}${prodIndex}`]:null,
                [`participantMembershipProductTypeId${index}${prodIndex}`]:  null,
                [`competitionMembershipProductDivisionId${index}${prodIndex}`]:  null,
            });
            product["competitionMembershipProductTypeId"] = null;
            product["competitionMembershipProductDivisionId"] = null;
            product["divisionName"] = null;
            product["friends"] = [];
            product["referFriends"] = [];
            product["positionId1"] = null;
            product["positionId1"] = null;

            let organisationInfo = membershipProdecutInfo.find(x=>x.organisationUniqueKey == value);
         
            product["organisationInfo"] = deepCopyFunction(organisationInfo);

            this.callTermsAndConditions(value);

        }
        else if(key == "competitionUniqueKey"){
            product["competitionUniqueKey"] = value;
            this.props.form.setFieldsValue({
                [`participantMembershipProductTypeId${index}${prodIndex}`]:  null,
                [`competitionMembershipProductDivisionId${index}${prodIndex}`]:  null,
            });
            product["competitionMembershipProductTypeId"] = null;
            product["competitionMembershipProductDivisionId"] = null;
            product["divisionName"] = null;
            product["friends"] = [];
            product["referFriends"] = [];
            product["positionId1"] = null;
            product["positionId1"] = null;
            let competitionInfo = product.organisationInfo.competitions.
                            find(x=>x.competitionUniqueKey == value);
                            console.log("competitionInfo" + JSON.stringify(competitionInfo));
            product["competitionInfo"] = deepCopyFunction(competitionInfo);
            console.log("product" + JSON.stringify(product));
            this.getRegistrationSettings(competitionInfo.competitionUniqueKey, product.organisationUniqueKey, index,prodIndex);
        }
        else{
            let memProd = product.competitionInfo.membershipProducts.
                find(x=>x.competitionMembershipProductTypeId === value);

            let divisions = this.getDivisionByFilter(product, value, userRegistration);
            //console.log("divisions::" + JSON.stringify(divisions));
            if(divisions!= null && divisions!= undefined && divisions.length > 0)
            {
                if(divisions.length == 1)
                {
                    product["competitionMembershipProductDivisionId"] = 
                    divisions[0].competitionMembershipProductDivisionId;
                    product["divisionName"] =  divisions[0].divisionName;
                    product["divisions"] = [];
                }
                else{
                    product.competitionMembershipProductDivisionId = null;
                    this.props.form.setFieldsValue({
                        [`competitionMembershipProductDivisionId${index}${prodIndex}`]:  null,
                    });
                    product["divisions"] = divisions;
                }
                product["isPlayer"] =  memProd.isPlayer;
                product["competitionMembershipProductTypeId"] = memProd.competitionMembershipProductTypeId;

                if(!memProd.isPlayer){
                    this.props.updateRegistrationSettingsAction(index, prodIndex, "nonPlayer");
                }
                else{
                    this.props.updateRegistrationSettingsAction(index, prodIndex, "player");  
                }

                if(memProd.isPlayer){
                    this.addFriend(index,"friend","product", prodIndex);
                    this.addFriend(index,"referFriend","product", prodIndex);
                }
                else{
                    product["friends"] = [];
                    product["referFriends"] = [];
                    product["positionId1"] = null;
                    product["positionId2"] = null;
                }

            }
            else{
                product["competitionMembershipProductDivisionId"] = null;
                product["divisionName"] =  null;
                product["divisions"] = [];
                value = null;
                console.log("^^^^^^^" + value);
            }
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations", key );
        if(key == "competitionMembershipProductTypeId" && value == null){
            this.setState({participantIndex: index, productIndex: prodIndex})
            this.props.updateEndUserRegisrationAction("divisionProduct", "refFlag");
        }
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
        console.log("registeringYourself" + value + "key::" + key);
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
       // let userRegistration = userRegistrations[index]; 
        let userInfo = registrationState.userInfo;
        let membershipProductInfo = registrationState.membershipProductInfo;
     
        let userInfoLen = [];
        if(userInfo!= null && userInfo!= undefined){
          userInfoLen = userInfo.filter(x=>x);
        }
        

    console.log("!!!!" + userRegistrations[index][key] + "@@@@" + value);
     let flag = false;
    if(userRegistrations[index][key]!= 0 && userRegistrations[index][key] != value ){
        let userId = userRegistrations[index].userId;
        let userRegistration1 = this.getParticipantObj( userRegistrations[index].tempParticipantId);
        userRegistrations[index] = userRegistration1;

        console.log("UserId::" + userId);
        let oldUser = userInfo.find(x=>x.id ==  userId);
        if(oldUser!= null && oldUser!= "" && oldUser!= undefined)
        {
            oldUser.isDisabled = 0;
        }

        this.props.form.setFieldsValue({
            [`organisationUniqueKey${index}`]:  null,
            [`competitionUniqueKey${index}`]:  null,
            [`competitionMembershipProductTypeId${index}`]:  null,
            [`competitionMembershipProductDivisionId${index}`]:  null,
        });
    }
     
      userRegistrations[index][key] = value;
      if(getUserId() == 0 || (userInfoLen.length <= 1))
      {
        if(value == 1){
            userRegistrations[index]["isPlayer"] = 1;
        }
        else if(value == 2){
            userRegistrations[index]["isPlayer"] = 0;
        }
        else if(value == 3){
            userRegistrations[index]["isPlayer"] = -1;
            userRegistrations[index]["profileUrl"] = null;
        }
        else if(value == 4){
            userRegistrations[index]["isPlayer"] = -1;
            userRegistrations[index]["profileUrl"] = null;
            userRegistrations[index]["team"]["index"] = index;
        } 
      }
    //  console.log("userRegistration::" + JSON.stringify(userRegistrations[index]));

    if(value == 4){
        if(userRegistrations.length == 1){
           let userReg =  userRegistrations[0];
           let compInfo = userReg.organisationInfo!= null && 
                            userReg.organisationInfo.competitions.find(x=>x.hasTeamRegistration == 1 
               && x.competitionUniqueKey == this.state.competitionUniqueKey);
           let orgInfo = membershipProductInfo.find(x=>x.hasTeamRegistration == 1 
               && x.organisationUniqueKey == this.state.organisationUniqueKey);
           if(orgInfo == null ||  orgInfo == undefined){
               userReg.organisationUniqueKey = null
           }
           if(compInfo == null  || compInfo == undefined){
               userReg.competitionUniqueKey = null;
           }
           flag = true;
        }
    }
    this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");

      if(value == 1 || value == 2){
        this.setState({participantIndex: index});
        this.existingUserPopulate();
      }

      console.log("Flag ::" + flag)
      console.log("userRegistrations ::",userRegistrations)
      if(flag){
        this.props.updateEndUserRegisrationAction(true, "setCompOrgKey");
      }
     
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
            if(message == null || message == "" || message == undefined){
                modalMessage = AppConstants.participantDeleteConfirmMsg;
            }
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
            else if(this.state.modalKey === "playerImport"){
                this.uploadTeamPlayers();
            }
        }
        this.setState({modalVisible: false});
        
    }

    removeParticipant = () => {
        console.log("Index:::::" + this.state.participantIndex);
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
        this.props.updateEndUserRegisrationAction("participant", "refFlag");

    }

    removeProduct = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex]; 
        let product = userRegistration.products[this.state.productIndex];
        userRegistration.products.splice(this.state.productIndex, 1);

         // Enable the existing one
        //  let memProd = userRegistration.competitionInfo.membershipProducts
        //         .find(x=>x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId);
        //  if(memProd!= null && memProd!= "" && memProd!= undefined)
        //  {
        //     memProd.isDisabled = false;
        //  }

         this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
         this.props.updateRegistrationSettingsAction(this.state.participantIndex, this.state.productIndex);
         this.props.updateEndUserRegisrationAction("product", "refFlag");
        
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

	getDivisionByFilter = (item, competitionMembershipProductTypeId, userRegistration) => {
        let divisionsArr = [];
        let genderRefId = userRegistration.genderRefId;
        console.log("genderRefId" + genderRefId)
        var date = moment(userRegistration.dateOfBirth, "DD/MM/YYYY");

        if(competitionMembershipProductTypeId != null && item.competitionInfo!= null &&
            item.competitionInfo!= undefined)
        {
            let divisions = item.competitionInfo.membershipProducts.find(x=>x.competitionMembershipProductTypeId == 
                competitionMembershipProductTypeId).divisions;
               // console.log("&&&&&&&&&&&&&&" + JSON.stringify(divisions));
                (divisions || []).map((div, index) => {
                    // console.log("div.genderRefId::" + div.genderRefId);
                    // console.log("div.toDate::" + div.toDate);
                    // console.log("div.fromDate::" + div.fromDate);
                    if(div.genderRefId != null && (div.fromDate == null || div.toDate == null)){
                        if(div.genderRefId == genderRefId || genderRefId == 3){
                           
                            divisionsArr.push(div);
                        }
                    }
                    else if(div.genderRefId == null && (div.fromDate != null && div.toDate != null)){
                        var startDate = moment(div.fromDate, "YYYY-MM-DD");
                        var endDate = moment(div.toDate, "YYYY-MM-DD");
                    //    console.log("#############" + startDate + "***" + endDate + "$$$" + date);
                    //     console.log("#############" + date.isBefore(endDate)  + "***" +  date.isAfter(startDate)  + "$$$" + date.isSame(endDate));
                        if (date.isBefore(endDate) 
                            && date.isAfter(startDate) 
                            || (date.isSame(startDate) || date.isSame(endDate))){
                                divisionsArr.push(div);
                            }
                    }
                    else if(div.genderRefId != null && (div.fromDate != null && div.toDate != null)){
                        var startDate = moment(div.fromDate, "YYYY-MM-DD");
                        var endDate = moment(div.toDate, "YYYY-MM-DD");
                        if ((date.isBefore(endDate) 
                            && date.isAfter(startDate) 
                            || (date.isSame(startDate) || date.isSame(endDate))) 
                            && (div.genderRefId == genderRefId || genderRefId == 3)){
                                divisionsArr.push(div);
                            }
                    }
                    else{
                        divisionsArr.push(div); 
                    }
                })
        }

        return divisionsArr;
    }

    onChangeSetTeam = (value, key, index, subKey, subIndex, item) => {

        this.props.updateTeamAction(value, index, key, subKey, subIndex);
        if(subKey == "participant"){
            if(key == "competitionUniqueKey"){
                this.props.form.setFieldsValue({
                    [`competitionMembershipProductTypeId${index}`]:  null,
                    [`competitionMembershipProductDivisionId${index}`]:  null,
                    
                });
                this.getRegistrationSettings(value, item.organisationUniqueKey, index);
            }
            else if(key == "organisationUniqueKey"){
                this.props.form.setFieldsValue({
                    [`competitionUniqueKey${index}`]:  null,
                    [`competitionMembershipProductTypeId${index}`]:  null,
                    [`competitionMembershipProductDivisionId${index}`]:  null,
                    
                });
                this.callTermsAndConditions(value);
            }
            else if(key == "competitionMembershipProductTypeId"){
                this.props.form.setFieldsValue({
                    [`competitionMembershipProductDivisionId${index}`]:  null,
                });
            }
        }
    }

    onChangeSetYourInfo = (value, key, index) => {
        this.props.updateYourInfoAction(value, index, key, "yourInfo");
    }

    showEmailValidationMsg = (item, index, key, value) =>{
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
        let userId = null;
        let isValueChanged = false;
        let modalShow = null;
        if(key == "participant"){
            userId = item.userId;
            if(value != item.reEnterEmail){
                isValueChanged = true
            }
            modalShow = item.modalShow;
        }
        else if(key == "yourInfo"){
            userId = item.yourInfo.userId;
            if(value != item.yourInfo.reEnterEmail){
                isValueChanged = true
            }
            modalShow = item.yourInfo.modalShow;
        }
        if(!modalShow && userId != null && userId!= 0 && isValueChanged){
            Modal.info({
                content: (
                  <div style={{paddingLeft:'11%'}}>
                    <p>{AppConstants.emailValidationInfo}</p>
                  </div>
                ),
                onOk() {},
              });

              if(key == "participant"){
                userRegistration["modalShow"] = 1;
              }
              else if(key == "yourInfo"){
                userRegistration["yourInfo"]["modalShow"] = 1;
              }
             
              this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
        }
        
    }

    uploadTeamPlayers = () =>{
        this.props.updateTeamAction(this.state.csvData, 
            this.state.participantIndex, "addPlayersCSV", "players");
    }

    readTeamPlayersCSV = (data, item, index) => {
         console.log("Data:: Item::", data, item, index);
        this.setState({csvData: data, participantIndex: index});
        let players = (item.team!= null && item.team.players!= null) ? item.team.players : [];
        let filteredPlayer = players.find(x=>x.isDisabled == false);
        if(filteredPlayer!= null){
            this.setState({modalVisible: true, modalKey: "playerImport", 
            modalMessage: AppConstants.playerImpMsg});
        }
        else{
            this.props.updateTeamAction(data, index, "addPlayersCSV", "players");
        }
        let e = document.getElementById("teamPlayerUpload");
        e.value = null;
    }

    saveRegistrationForm = (e) => {
        console.log("saveRegistrationForm" + e);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
                let registrationState = this.props.endUserRegistrationState;
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

                let err = false;
                userRegistrations.map((item, index) =>{
                    let membershipProductId = item.competitionMembershipProductTypeId;

                    (item.products || []).map((it, itIndex) => {
                        if(it.competitionMembershipProductTypeId == membershipProductId){
                            err = true;
                        }
                    })
                });

                if(!err){
                    let formData = new FormData();
                    let isError = false;
                    for(let x = 0; x< userRegistrations.length; x++)
                    {
                        let userRegistration = userRegistrations[x];
                        if(userRegistration.registeringYourself!= 4){
                            if(userRegistration.profileUrl == null){
                                isError = true;
                                break;
                            }
                            else{
                                formData.append("participantPhoto", userRegistration.participantPhoto);
                            }
                        }
                    }

                    // for(let x = 0; x< userRegistrations.length; x++)
                    // {
                    //     let userRegistration = userRegistrations[x];
                    //     if(userRegistration.whoAreYouRegistering == 2 && x == 0){
                    //         if(userRegistration.yourInfo!= null){
                    //             if(userRegistration.yourInfo.profileUrl == null){
                    //                 isError = true;
                    //                 break;
                    //             }
                    //             else{
                    //                 formData.append("yourInfoPhoto", userRegistration.yourInfo.participantPhoto);
                    //             }
                    //         }
                    //     }
                    // }
                    
                    if(!isError)
                    {
                        userRegistrations.map((item, index) =>{
                            if(getAge(item.dateOfBirth) > 18){
                                item.parentOrGuardian = [];
                            }
    
                            if(item.regSetting.play_friend == 0)
                            {
                                item.friends = [];
                            }
                            if(item.regSetting.refer_friend == 0)
                            {
                                item.referFriends = [];
                            }
                            let memArr = [];
                            if(item.registeringYourself == 4){
                                (item.competitionInfo.membershipProducts).map((i, ind) => {
                                    if(i.allowTeamRegistrationTypeRefId!= null){
                                        let obj = {
                                            competitionMembershipProductTypeId: i.competitionMembershipProductTypeId,
                                            name: i.shortName
                                        }
                                        memArr.push(obj);
                                    }
                                })

                                if(item.team!= null && item.team.players!= null && item.team.players.length > 0){
                                    let players = item.team.players.filter(x=> (x.isDisabled == false || x.isDisabled == null));
                                    item.team.players = (players!= null && players!= undefined) ? players : [];
                                }
                            }
                            item["membershipProducts"] = memArr;

                            if(item.whoAreYouRegistering != 2 || index > 0){
                                item.yourInfo = null;
                            }
    
                            delete item.organisationInfo;
                            delete item.competitionInfo;
                            delete item.divisions;
                        });

                        console.log("FINAL DATA" + JSON.stringify(registrationDetail));
                        formData.append("registrationDetail", JSON.stringify(registrationDetail));
    
                         this.props.saveEndUserRegistrationAction(formData);
                         this.setState({ loading: true });
                    }
                    else{
                        message.error(ValidationConstants.userPhotoIsRequired);
                    }
                }
                else{
                    message.error(ValidationConstants.membershipProductValidation); 
                }
            }
        });
    }

    clearLocalStorage = () => {
        localStorage.removeItem("isUserRegistration");
        localStorage.removeItem("registeringYourselfRefId");
        localStorage.removeItem("existingUserRefId");
        localStorage.removeItem("userRegId");
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

    registeringYourselfView = (item, index, getFieldDecorator, styles) => {
        return (
            <div className="formView content-view pt-5">
                <div style={{display:'flex'}}>
                    <div className="form-heading"> {AppConstants.registration}</div>
                    {(index  == 0 || item.isPlayer != -1 )? null :
                    <div className="transfer-image-view pointer" style={{paddingLeft: '33px', marginLeft: 'auto'}} onClick={() => 
                                            this.deleteEnableOrDisablePopup( "participant", true, index, -1, -1, AppConstants.registrationDeleteConfirmMsg)}>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                        <span className="user-remove-text">
                            {AppConstants.remove}
                        </span>
                    </div> 
                    }
                </div>
                
                <InputWithHead heading={AppConstants.areYouRegisteringYourself} required={"required-field"}></InputWithHead>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeSetRegYourself(e.target.value, "registeringYourself", index)}
                    value={item.registeringYourself}>
                    <Radio value={1}>{AppConstants.yes}</Radio>
                    {/* <Radio value={2}>{AppConstants.yesAsANonPlayer}</Radio> */}
                    <Radio value={3}>{AppConstants.registeringSomeoneElse}</Radio>
                    <Radio value={4}>{AppConstants.noRegisteringATeam}</Radio>
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
                                {/* <Radio value={3}>{AppConstants.team}</Radio> */}
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

                { (item.registeringYourself!= 0 && (userInfo!= null && userInfo.length > 1))? 
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
                        placeholder={"dd-mm-yyyy"}
                        style={{ width: "100%" }}
                        onChange={e => this.onChangeSetParticipantValue(e, "dateOfBirth", index) }
                        format={"DD-MM-YYYY"}
                        showTime={false}
                        name={'dateOfBirth'}
                    />
                    )}
                    </Form.Item>
                </div> : null}
                {item.hasDivisionError &&
                <div className="division-err">{ValidationConstants.divisionValidation}</div>
                }
            </div>
        )
    }

    membershipProductView = (item, index, getFieldDecorator) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let membershipProdecutInfo = this.props.endUserRegistrationState.membershipProductInfo;
        return (
            <div className="formView content-view pt-5" style={{backgroundColor: 'var(--app-ebf0f3)'}}>
             <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>
               
                {/* <Form.Item >
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
                    </Form.Item> */}
               
                
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
                {item.isPlayer == 1 &&
                <div>
                    <InputWithHead heading={AppConstants.registrationDivisions} required={"required-field"}/>
                    { 
                        item.divisions!= null && item.divisions!= undefined && item.divisions.length > 1 ?
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
                                    {(item.divisions!= null && item.divisions!= undefined && item.divisions || []).map((division, index) => (
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
                </div> }
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
                    {item.venue == null || item.venue.length == 0 ? AppConstants.noInformationProvided :
                    <span>
                        {(item.venue || []).map((v, vIndex) =>(
                            <span>
                                <span>{v.venueName}</span>
                                <span>{item.venue.length != (vIndex + 1) ? ', ': ''}</span>
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
                    {item.organisationInfo == null ||  item.organisationInfo == undefined ? 
                            AppConstants.noPhotosAvailable :
                    <div className="org-photos">
                        {(item.organisationInfo!= null && item.organisationInfo!= undefined &&
                                             item.organisationInfo.organisationLogoUrl!= null) ?(
                        <div>
                            <div>
                                <img src={item.organisationInfo!= null && item.organisationInfo!= undefined &&
                                             item.organisationInfo.organisationLogoUrl} alt=""height= {125} width={125}
                                    style={{ borderRadius:0, marginLeft: 0 }} name={'image'}
                                        onError={ev => {ev.target.src = AppImages.circleImage;}}
                                />
                            </div>
                            <div className="photo-type">{AppConstants.logo}</div>
                        </div>
                        ) : null 
                        }
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
                    </div>}
                </div> : null}

                
            </div>
        )
    }

    yourInfoView = (item, index, getFieldDecorator) => {
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                 <span className="form-heading"> {AppConstants.yourInfo}</span>
                 <Form.Item >
                    {getFieldDecorator(`yFirstName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.firstName}
                        placeholder={AppConstants.firstName}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "firstName",index )} 
                       // value={item.firstName}
                        setFieldsValue={item.yourInfo.firstName}
                    />
                    )}
                </Form.Item>

                <InputWithHead
                    heading={AppConstants.middleName}
                    placeholder={AppConstants.middleName}
                    onChange={(e) => this.onChangeSetYourInfo(e.target.value, "middleName", index )} 
                    value={item.yourInfo.middleName}
                />

                <Form.Item >
                    {getFieldDecorator(`yLastName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.lastName}
                        placeholder={AppConstants.lastName}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "lastName", index )} 
                        setFieldsValue={item.yourInfo.lastName}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`yMobileNumber${index}`, {
                        rules: [{ required: true, message: ValidationConstants.contactField }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.contactMobile}
                        placeholder={AppConstants.contactMobile}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "mobileNumber", index )} 
                        setFieldsValue={item.yourInfo.mobileNumber}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`yEmail${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.contactEmail}
                        placeholder={AppConstants.contactEmail}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "email", index )} 
                        onBlur = {(e) => this.showEmailValidationMsg(item, index, "yourInfo", e.target.value)}
                        setFieldsValue={item.yourInfo.email}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`yReEnterEmail${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.reenterEmail}
                        placeholder={AppConstants.reenterEmail}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "reEnterEmail", index )} 
                        setFieldsValue={item.yourInfo.reEnterEmail}
                    />
                    )}
                </Form.Item>
                {/* <InputWithHead heading={AppConstants.photo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="reg-competition-logo-view" onClick={ () => this.selectYourInfoImage(index)}>
                                <label>
                                    <img
                                        src={item.yourInfo.profileUrl == null ? AppImages.circleImage  : item.yourInfo.profileUrl}
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
                                id= {"user-your-info-pic" + index} 
                                style={{ display: 'none' }}
                                onChange={(evt) => this.setImage(evt.target, index, "yourInfoPhoto")} />

                        </div>
                    </div>
                </div> */}

                <span className="applicable-to-heading" style={{fontSize:'18px'}}>{AppConstants.address}</span>
                <Form.Item >
                    {getFieldDecorator(`yStreet1${index}`, {
                        rules: [{ required: true, message: ValidationConstants.addressField}],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "street1", index )} 
                        setFieldsValue={item.yourInfo.street1}
                    />
                    )}
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(e) => this.onChangeSetYourInfo(e.target.value, "street2", index )} 
                    value={item.yourInfo.street2}
                />
                <Form.Item >
                    {getFieldDecorator(`ySuburb${index}`, {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "suburb", index )} 
                        setFieldsValue={item.yourInfo.suburb}
                    />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
                <Form.Item >
                    {getFieldDecorator(`yStateRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                    })(
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetYourInfo(e, "stateRefId", index )}
                        setFieldsValue={item.yourInfo.stateRefId}>
                        {stateList.length > 0 && stateList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.name}</Option>
                        ))
                        }
                    </Select>
                    )}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator(`yPostalCode${index}`, {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pt-0 pb-0"}
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        onChange={(e) => this.onChangeSetYourInfo(e.target.value, "postalCode", index )} 
                        setFieldsValue={item.yourInfo.postalCode}
                    />
                    )}
                </Form.Item>

                
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
                        onBlur = {(e) => this.showEmailValidationMsg(item, index, "participant", e.target.value)}
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
        return(
            <div className="formView content-view pt-5" >
                 <span className="form-heading">
                    {AppConstants.additionalPersonalInfoReqd}
                </span>
                {item.regSetting.last_captain === 1 && (
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
                    onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex, "positionId1" )}
                    value={item.positionId1}>
                    {(playerPositionList || []).map((play1, index) => (
                        <Option key={play1.id} value={play1.id}>{play1.name}</Option>
                    ))}
                </Select>

                <InputWithHead heading={AppConstants.position2} />
                <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex,"positionId2" )}
                    value={item.positionId2}>
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

                {item.regSetting.photo_consent === 1 && (
                    <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.checked, "isConsentPhotosGiven", index )}
                        checked={item.isConsentPhotosGiven}>{AppConstants.consentForPhotos}
                    </Checkbox>
                )}

                {item.regSetting.disability === 1 && (
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
        return(
            <div className="formView content-view pt-5" >
                <span className="form-heading">
                    {AppConstants.OtherParticipantReqd}
                </span>
                {item.regSetting.country === 1 && (
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

                {item.regSetting.nationality === 1 && (
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
                {item.regSetting.language === 1 &&(
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
        let commonRegSetting = registrationState.commonRegSetting;
        return (
            <div className="formView content-view pt-5" >
                <span className="form-heading">
                    {AppConstants.OtherInfoReqd}
                </span>
                {commonRegSetting.club_volunteer === 1 && (
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
        
        return (
            <div className="formView content-view pt-5">
              <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>
              <InputWithHead heading={AppConstants.organisationName}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`organisationUniqueKey${index}${prodIndex}`, {
                        rules: [{ required: true, message: ValidationConstants.organisationRequired }],
                    })(
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex,"organisationUniqueKey")}
                       
                        >
                    {(membershipProdecutInfo || []).map((org, orgIndex) => (
                            <Option key={org.organisationUniqueKey} 
                            value={org.organisationUniqueKey}>{org.organisationName}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.competition_name} required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`competitionUniqueKey${index}${prodIndex}`, {
                        rules: [{ required: true, message: ValidationConstants.competitionRequired }],
                    })(
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex,  "competitionUniqueKey")}
                       
                        >
                    {(prod.organisationInfo!= null && prod.organisationInfo.competitions || []).map((comp, compIndex) => (
                            <Option key={comp.competitionUniqueKey} 
                            value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                 {/* <div style={{display:'flex'}} className="applicable-to-text">
                    <div>{(item.competitionInfo!= undefined && item.competitionInfo!= null)? item.competitionInfo.competitionName : null}</div>
                </div> */}

                <InputWithHead heading={AppConstants.membershipProduct} required={"required-field"}/>
                <Form.Item >
                    {getFieldDecorator(`participantMembershipProductTypeId${index}${prodIndex}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductRequired }],
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex, "competitionMembershipProductTypeId")}
                        setFieldsValue={prod.competitionMembershipProductTypeId}>
                        {(prod.competitionInfo!= undefined && prod.competitionInfo!= null && prod.competitionInfo.membershipProducts || []).map((mem, index) => (
                            <Option key={mem.competitionMembershipProductTypeId} 
                            value={mem.competitionMembershipProductTypeId} disabled={mem.isDisabled}>{mem.name}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                {/* <InputWithHead heading={AppConstants.divisions} required={"required-field"}/>
                <InputWithHead heading={prod.divisionName} /> */}
                {prod.isPlayer == 1 && 
                <div>
                    <InputWithHead heading={AppConstants.divisions} required={"required-field"}/>
                    {
                        prod.divisions.length > 1 ?
                        <Form.Item>
                        {getFieldDecorator(`competitionMembershipProductDivisionId${index}${prodIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired }],
                        })(
                        <Select
                            style={{ width: "100%", paddingRight: 1 }}
                            onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex, "competitionMembershipProductDivisionId" )}
                            setFieldsValue={prod.competitionMembershipProductDivisionId}
                            >
                            {(prod.divisions || []).map((division, index) => (
                                <Option key={division.competitionMembershipProductDivisionId} 
                                value={division.competitionMembershipProductDivisionId}>{division.divisionName}</Option>
                            ))}
                        </Select>
                    )}
                    </Form.Item> : 
                    <InputWithHead heading={prod.divisionName} /> 
                    }
                </div>
                }
            </div>
        )
    }

    dividerTextView = (text, styles, playerOrProduct, index, prodIndex, parentOrGuardian) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        return(
            <div className="form-heading formView end-user-divider-header" style={styles}>
                <div className="end-user-divider-side" style={{width:'75px'}}></div>
                <div className="end-user-divider-text">{text}</div>
                <div className="end-user-divider-side" style={{flexGrow: '1'}}></div>
                {(playerOrProduct == "parent" && parentOrGuardian.length < 2) ||
                (playerOrProduct == "participant" && userRegistrations.length < 2 ) ? null :
                <div className="transfer-image-view pointer" style={{paddingLeft: '33px'}} onClick={() => 
                                        this.deleteEnableOrDisablePopup(playerOrProduct, true, index, prodIndex, 0, "", null)}>
                    <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    <span className="user-remove-text">
                        {AppConstants.remove}
                    </span>
                </div> 
                }
            </div>
        )
    }

    removeModalView = () => {
        return (
            <div>
              <Modal
                className="add-membership-type-modal"
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

    termsAndConditionView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let membershipProductInfo = registrationState.membershipProductInfo;
        let text = '';
        let orgMap = new Map();
        userRegistrations.map((x, index) => {
            if(orgMap.get(x.organisationUniqueKey) == undefined){
                let mem = membershipProductInfo.find(y=>y.organisationUniqueKey == x.organisationUniqueKey);
                if(mem!= null){
                    text +=  mem.organisationName + ', ';
                    orgMap.set(x.organisationUniqueKey, mem.organisationName);
                }
            }

            (x.products || []).map((z, index) => {
                if(orgMap.get(z.organisationUniqueKey) == undefined){
                    let mem = membershipProductInfo.find(y=>y.organisationUniqueKey == z.organisationUniqueKey);
                    if(mem!= null){
                        text +=  mem.organisationName + ', ';
                        orgMap.set(z.organisationUniqueKey, mem.organisationName);
                    }
                }
            })
        });
        text = text.replace(/,\s*$/, "");   
        return(
            <div className="formView pb-5" style={{background: "none"}}>
                <Form.Item>
                    {getFieldDecorator(`termsAndCondition`, {
                        rules: [{ required: true, message: ValidationConstants.termsAndCondition[0] }],
                    })(  
                    <div >
                        <Checkbox
                            className="single-checkbox pt-3"
                            checked={this.state.agreeTerm}
                            onChange={e => this.setState({ agreeTerm: e.target.checked })}>
                            {AppConstants.agreeTerm.replace('(Affiliates name)', text)}
                            <span className="app-reg-terms">
                                {AppConstants.termsAndConditions}{" "}
                            </span>
                            <span className="required-field"></span>
                        </Checkbox>
                    </div>
                    )}
                </Form.Item> 
            </div>
        )
    }

    termsAndConditionsOrgView = (getFieldDecorator) => {
        let {termsAndConditionsFinal}  = this.props.endUserRegistrationState;  

        return(
            <div className="formView content-view pt-5">
            <span className="form-heading"> {AppConstants.termsAndConditions} </span>
            <div className="pt-2">
                   { (termsAndConditionsFinal || []).map((item, index) =>(
                      <div className="pb-4">
                      <a className="userRegLink" href={item.termsAndConditions} target='_blank' >
                          Terms and Conditions for {item.name}
                      </a>
                      </div>
                    ))
                   }
                </div>
            </div>
        )
    }

    teamMembershipProductView = (item, index, getFieldDecorator) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let membershipProdecutInfo = this.props.endUserRegistrationState.membershipProductInfo;
        return (
            <div className="formView content-view pt-5" style={{backgroundColor: 'var(--app-ebf0f3)'}}>
             <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>
               
               <InputWithHead heading={AppConstants.organisationName}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`organisationUniqueKey${index}`, {
                        rules: [{ required: true, message: ValidationConstants.organisationRequired }],
                    })(
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetTeam(e, "organisationUniqueKey", index, "participant" )}
                       
                        >
                    {(membershipProdecutInfo.filter(x=>x.hasTeamRegistration == 1) || []).map((org, orgIndex) => (
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
                        onChange={(e) => this.onChangeSetTeam(e, "competitionUniqueKey", index, "participant", null, item  )}
                       
                        >
                    {(item.organisationInfo!= null && (item.organisationInfo.competitions!= null && 
                        item.organisationInfo.competitions.filter(x=>x.hasTeamRegistration == 1)) || [])
                        .map((comp, compIndex) => (
                            <Option key={comp.competitionUniqueKey} 
                            value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.membershipProductTeam}  required={"required-field"}/>
                <Form.Item>
                    {getFieldDecorator(`competitionMembershipProductTypeId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.membershipProductRequired }],
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetTeam(e, "competitionMembershipProductTypeId", index, "participant"  )}
                        setFieldsValue={item.competitionMembershipProductTypeId}
                        >
                    {(item.competitionInfo!= null && 
                            (item.competitionInfo.membershipProducts!= null && 
                                item.competitionInfo.membershipProducts.filter(x=>x.isPlayer == 1)) || [])
                            .map((mem, index) => (
                            <Option key={mem.competitionMembershipProductTypeId} 
                            value={mem.competitionMembershipProductTypeId} disabled={mem.isDisabled}>{mem.name}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
                <div>
                    <InputWithHead heading={AppConstants.divisions} required={"required-field"}/>
                    { 
                        item.divisions!= null && item.divisions!= undefined && item.divisions.length > 1 ?
                        <div>
                            <Form.Item>
                                {getFieldDecorator(`competitionMembershipProductDivisionId${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.membershipProductDivisionRequired }],
                                })(
                                <Select
                                    style={{ width: "100%", paddingRight: 1 }}
                                    onChange={(e) => this.onChangeSetTeam(e, "competitionMembershipProductDivisionId", index , "participant" )}
                                    setFieldsValue={item.competitionMembershipProductDivisionId}
                                    >
                                    {(item.divisions!= null && item.divisions!= undefined && item.divisions || []).map((division, index) => (
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
                    {item.venue == null || item.venue.length == 0 ? AppConstants.noInformationProvided :
                    <span>
                        {(item.venue || []).map((v, vIndex) =>(
                            <span>
                                <span>{v.venueName}</span>
                                <span>{item.venue.length != (vIndex + 1) ? ', ': ''}</span>
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
                    {item.organisationInfo == null ||  item.organisationInfo == undefined ? 
                            AppConstants.noPhotosAvailable :
                    <div className="org-photos">
                        {(item.organisationInfo!= null && item.organisationInfo!= undefined &&
                                             item.organisationInfo.organisationLogoUrl!= null) ?(
                        <div>
                            <div>
                                <img src={item.organisationInfo!= null && item.organisationInfo!= undefined &&
                                             item.organisationInfo.organisationLogoUrl} alt=""height= {125} width={125}
                                    style={{ borderRadius:0, marginLeft: 0 }} name={'image'}
                                        onError={ev => {ev.target.src = AppImages.circleImage;}}
                                />
                            </div>
                            <div className="photo-type">{AppConstants.logo}</div>
                        </div>
                        ) : null 
                        }
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
                    </div>}
                </div> : null}

                
            </div>
        )
    }

    teamRegistrationTypeView = (item, index, getFieldDecorator) => {
        return (
            <div className="formView content-view pt-5">
                <div style={{display:'flex'}}>
                    <div className="form-heading"> {AppConstants.registrationType}</div>
                </div>
                
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeSetTeam(e.target.value, "registrationTypeId", index, "team")}
                    value={item.team.registrationTypeId}>
                    <Radio value={1}>{AppConstants.inviteIndividualTeamMember}</Radio>
                    <Radio value={2}>{AppConstants.registerOnBehalf}</Radio>
                </Radio.Group>
            </div>
        )
    }

    teamInfoView = (item, index, getFieldDecorator) => {
        const { stateList, personRegisteringRoleList } = this.props.commonReducerState;
        //console.log("TEan::::" + JSON.stringify(item.team));
        return (
            <div className="formView content-view pt-5">
                 <Form.Item >
                    {getFieldDecorator(`teamName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.teamName }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.teamName}
                        placeholder={AppConstants.teamName}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "teamName",index, "team" )} 
                       // value={item.firstName}
                        setFieldsValue={item.team.teamName}
                    />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.personRegisteringRole}   required={"required-field"}/>
                <Form.Item >
                    {getFieldDecorator(`teamPersonRole${index}`, {
                        rules: [{ required: true, message: ValidationConstants.personRegRoleRequired}],
                    })(
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.personRegisteringRole}
                        onChange={(e) => this.onChangeSetTeam(e, "personRoleRefId", index, "team" )}
                        setFieldsValue={item.team.personRoleRefId}
                        >
                        {personRegisteringRoleList.length > 0 && personRegisteringRoleList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.description}</Option>
                        ))
                        }
                    </Select>
                    )}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator(`tFirstName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.firstName}
                        placeholder={AppConstants.firstName}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "firstName",index, "team" )} 
                       // value={item.firstName}
                        setFieldsValue={item.team.firstName}
                    />
                    )}
                </Form.Item>

                <InputWithHead
                    heading={AppConstants.middleName}
                    placeholder={AppConstants.middleName}
                    onChange={(e) => this.onChangeSetTeam(e.target.value, "middleName", index, "team" )} 
                    value={item.team.middleName}
                />

                <Form.Item >
                    {getFieldDecorator(`tLastName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.lastName}
                        placeholder={AppConstants.lastName}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "lastName", index, "team" )} 
                        setFieldsValue={item.team.lastName}
                    />
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.dob}   required={"required-field"}/>
                    <Form.Item >
                    {getFieldDecorator(`tDateOfBirth${index}`, {
                        rules: [{ required: true, message: ValidationConstants.dateOfBirth}],
                    })(
                    <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        onChange={e => this.onChangeSetTeam(e, "dateOfBirth", index, "team") }
                        format={"DD-MM-YYYY"}
                        placeholder={"dd-mm-yyyy"}
                        showTime={false}
                        name={'dateOfBirth'}
                    />
                    )}
                    </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`tMobileNumber${index}`, {
                        rules: [{ required: true, message: ValidationConstants.contactField }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.contactMobile}
                        placeholder={AppConstants.contactMobile}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "mobileNumber", index, "team" )} 
                        setFieldsValue={item.team.mobileNumber}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`tEmail${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.contactEmail}
                        placeholder={AppConstants.contactEmail}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "email", index, "team" )} 
                        setFieldsValue={item.team.email}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`tReEnterEmail${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.reenterEmail}
                        placeholder={AppConstants.reenterEmail}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "reEnterEmail", index, "team" )} 
                        setFieldsValue={item.team.reEnterEmail}
                    />
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`tStreet1${index}`, {
                        rules: [{ required: true, message: ValidationConstants.addressField}],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "street1", index, "team" )} 
                        setFieldsValue={item.team.street1}
                    />
                    )}
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(e) => this.onChangeSetTeam(e.target.value, "street2", index, "team" )} 
                    value={item.team.street2}
                />
                <Form.Item >
                    {getFieldDecorator(`tSuburb${index}`, {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "suburb", index, "team" )} 
                        setFieldsValue={item.team.suburb}
                    />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.state}   required={"required-field"}/>
                <Form.Item >
                    {getFieldDecorator(`tStateRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                    })(
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetTeam(e, "stateRefId", index, "team" )}
                        setFieldsValue={item.team.stateRefId}>
                        {stateList.length > 0 && stateList.map((item) => (
                            < Option key={item.id} value={item.id}> {item.name}</Option>
                        ))
                        }
                    </Select>
                    )}
                </Form.Item>

                <Form.Item >
                    {getFieldDecorator(`tPostalCode${index}`, {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                    })(
                    <InputWithHead
                        required={"required-field pb-0"}
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        onChange={(e) => this.onChangeSetTeam(e.target.value, "postalCode", index, "team" )} 
                        setFieldsValue={item.team.postalCode}
                    />
                    )}
                </Form.Item>
                {(item.team.allowTeamRegistrationTypeRefId == 1 && item.team.personRoleRefId!= 4) && 
                <div>
                    <InputWithHead heading={AppConstants.areYouRegisteringAsPlayer} required={"required-field"}></InputWithHead>
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={ (e) => this.onChangeSetTeam(e.target.value, "registeringAsAPlayer", index, "team")}
                        value={item.team.registeringAsAPlayer}>
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={2}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div> }
            </div>
        )
    }

    teamMemberView = (item, index, getFieldDecorator) => {
        let players = (item.team!= null && item.team.players!= null) ? item.team.players : [];
        let registrationTypeId = item.team!= null && item.team.registrationTypeId!= null ? 
                                        item.team.registrationTypeId : 1;
        return (
            <div className="formView content-view pt-5" >
                <div style={{display: 'flex', marginBottom:'20px'}}>
                    <div style={{ display: 'flex' }}>
                        <span className="form-heading">
                            {item.team!= null && item.team.teamName!= null ? item.team.teamName + "- Team Members" : ""}
                        </span>
                    </div>
                    <div className="reg-add-save-button" style={{marginLeft: 'auto'}}>
                    <Button className="primary-add-comp-form" type="primary" > 
                        <div className="row">
                            <div className="col-sm">
                                <label for="teamPlayerUpload" className="csv-reader">
                                    <img src={AppImages.import}  alt="" className="export-image"/> 
                                    {AppConstants.import}
                                </label>
                                <CSVReader
                                    inputId="teamPlayerUpload"
                                    inputStyle={{display:'none'}}
                                    parserOptions={papaparseOptions}
                                    onFileLoaded={(e) => this.readTeamPlayersCSV(e, item, index)}
                                    />
                            </div>
                        </div>
                    </Button>
                        
                        {/* <Button onClick={() => this.onUploadTeamPlayerBtn()} className="primary-add-comp-form" type="primary">
                            {AppConstants.upload}
                        </Button> */}
                    </div>
                    <div className="reg-add-save-button" style={{marginLeft: '20px'}}>
                        <NavLink to="/templates/wsa-import-team-player.csv" target="_blank" download>
                                <Button className="primary-add-comp-form" type="primary">
                                    {AppConstants.downloadTemplate}
                                </Button>
                            </NavLink>
                    </div>
                </div>
                <div className="table-responsive">
                    <Table
                        className="fees-table"
                        columns={registrationTypeId === 1 ? teamColumns : teamColumnsOnBehalf}
                        dataSource={players}
                        pagination={false}
                        Divider=" false"
                    />
                    <div className="input-heading-add-another">
                        <span style={{ cursor: 'pointer' }} 
                            onClick={() => this.onChangeSetTeam(null, "addPlayer", index, "players")}>
                        + ADD TEAM MEMBERS
                        </span>
                    </div>
                    
                </div>
            </div>
        );
    };

    contentView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let commonRegSetting = registrationState.commonRegSetting;
        let userInfo = registrationState.userInfo;
        let termsAndConditionsFinal  = registrationState.termsAndConditionsFinal;  
        //console.log("userRegistrations::" + JSON.stringify(userRegistrations));
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
                            {this.registeringYourselfView(item, index, getFieldDecorator, styles)}
                        </div>
                        {item.registeringYourself != 0? 
                        <div>
                            {item.registeringYourself == 4 ? 
                             this.dividerTextView("TEAM REGISTRATION " + (index + 1), styles, "participant", index, -1) :
                             this.dividerTextView("PARTICIPANT " + (index + 1), styles, "participant", index, -1)
                            }
                            {item.registeringYourself != 4 &&
                            <div style={{marginBottom: "20px"}}>
                                {this.registrationQuestionView(item, index, getFieldDecorator)}
                            </div> 
                            }
                        </div>
                        : null }
                        {item.isPlayer != -1 ? (
                        <div>
                            <div style={{marginBottom: "20px"}}>
                                {this.membershipProductView(item, index, getFieldDecorator)}
                            </div>
                            {(item.whoAreYouRegistering == 2 && userInfo!= null && userInfo.length > 0 && index == 0) &&
                            <div style={{marginBottom: "20px"}}>
                                {this.yourInfoView(item, index, getFieldDecorator)}
                            </div> }
                            <div style={{marginBottom: "20px"}}>
                                {this.participantDetailView(item, index, getFieldDecorator)}
                            </div>
                            {(getAge(item.dateOfBirth) <= 18) ? 
                            <div style={{marginBottom: "20px"}}>
                                {this.parentGuardianView(item, index, getFieldDecorator)}
                            </div> : null
                            }

                            <div style={{marginBottom: "20px"}}>
                               {this.emergencyContactView(item, index, getFieldDecorator)} 
                            </div>
                            
                            {(item.products || []).map((prod, prodIndex) => (
                                <div key={"prod" + prodIndex}>
                                    {this.dividerTextView("PARTICIPANT " + (index + 1) + " - MEMBERSHIP " + (prodIndex + 2), stylesProd, "product", index, prodIndex)}
                                    <div>
                                        {this.membershipProductProductView(item, prod, prodIndex, index, getFieldDecorator)}
                                    </div>
                                    {prod.isPlayer && (
                                        <div>
                                            {item.regSetting.nominate_positions === 1 && (
                                                <div style={{marginBottom: "20px"}}>
                                                    {this.playerPosition(prod, index, "product", prodIndex, getFieldDecorator)}
                                                </div>
                                            )}
                                            {item.regSetting.play_friend === 1 && (
                                                <div style={{marginBottom: "20px"}}>
                                                    {this.playWithFriendView(prod, index, "product", prodIndex, getFieldDecorator)}
                                                </div>
                                            )}
                                            {item.regSetting.refer_friend === 1 && (
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
                            {(item.regSetting.country === 1 || item.regSetting.nationality === 1 || item.regSetting.language === 1) && (
                                    <div style={{marginBottom: "20px"}}>
                                        {this.otherParticipantReqInfo(item, index, getFieldDecorator)} 
                                    </div>
                            )}
                            {(item.regSetting.last_captain === 1) && (
                                <div style={{marginBottom: "20px"}}>
                                    {this.additionalPersonalInfoView(item, index, getFieldDecorator)}
                                </div>
                            )}
                            {item.isPlayer === 1 ? (
                            <div>
                                {item.regSetting.nominate_positions === 1 && (
                                    <div style={{marginBottom: "20px"}}>
                                        {this.playerPosition(item, index, "participant", index, getFieldDecorator)}
                                    </div>
                                )}
                                {item.regSetting.play_friend == 1 && (
                                    <div style={{marginBottom: "20px"}}>
                                        {this.playWithFriendView(item, index, "participant", index, getFieldDecorator)}
                                    </div>
                                )}
                                {item.regSetting.refer_friend === 1 && (
                                    <div style={{marginBottom: "10px"}}>
                                        {this.referAFriendView(item, index, "participant", index, getFieldDecorator)}
                                    </div>
                                )}
                            </div>
                            ): null}  
                            <div style={{marginBottom: "20px"}}>
                                {this.additionalInfoView(item, index, getFieldDecorator)}
                            </div>
                        </div>
                        ): null}

                        {item.registeringYourself == 4 &&
                        <div>
                            <div style={{marginBottom: "20px"}}>
                                {this.teamMembershipProductView(item, index, getFieldDecorator)}
                            </div>
                            {item.competitionMembershipProductTypeId != null && 
                            <div>
                                {item.team.allowTeamRegistrationTypeRefId == 1 && 
                                <div style={{marginBottom: "20px"}}>
                                    {this.teamRegistrationTypeView(item, index, getFieldDecorator, styles)}
                                </div>}
                                <div style={{marginBottom: "20px"}}>
                                    {this.teamInfoView(item, index, getFieldDecorator)}
                                </div>
                                {item.team.allowTeamRegistrationTypeRefId == 1 && 
                                <div style={{marginBottom: "20px"}}>
                                    {this.teamMemberView(item, index, getFieldDecorator)}
                                </div> 
                                }
                                {item.team.allowTeamRegistrationTypeRefId == 1 && 
                                <div>
                                    {(item.regSetting.country === 1 || item.regSetting.nationality === 1 || item.regSetting.language === 1) && (
                                        <div style={{marginBottom: "20px"}}>
                                            {this.otherParticipantReqInfo(item, index, getFieldDecorator)} 
                                        </div>
                                    )}
                                    {(item.regSetting.last_captain === 1) && (
                                        <div style={{marginBottom: "20px"}}>
                                            {this.additionalPersonalInfoView(item, index, getFieldDecorator)}
                                        </div>
                                    )}
                                    <div style={{marginBottom: "20px"}}>
                                        {this.additionalInfoView(item, index, getFieldDecorator)}
                                    </div>
                                </div> }
                            
                            </div>}
                        </div>
                        }

                        {(userRegistrations.length > 0 && (index + 1 == userRegistrations.length) &&
                            (userRegistrations[userRegistrations.length - 1].isPlayer != -1 || 
                                userRegistrations[userRegistrations.length - 1].registeringYourself == 4))? (
                        <div  className="formView" style={{background: "none", marginBottom: "40px"}}>
                            <span className="input-heading-add-another pointer" onClick={() => this.addParticipant(0)}>
                                + {AppConstants.addAnotherRegitration}
                            </span> 
                        </div>
                        ) : null}
                    </div>
                ))}
                {userRegistrations.length > 0 && (userRegistrations[0].isPlayer != -1) ? (
                <div>
                    {(commonRegSetting.club_volunteer === 1) && (
                        <div style={{marginBottom: "20px"}}>
                            {this.otherInfoReqdView(getFieldDecorator)}
                        </div>
                    )}
                    {commonRegSetting.shop === 1 && (
                        <div style={{marginBottom: "20px"}}>
                            {this.uniformAndMerchandise()}
                        </div>
                    )}
                    {commonRegSetting.voucher === 1 && (
                        <div>
                            {this.voucherView(getFieldDecorator)}
                        </div>
                    )}
                </div>
                ): null}
                 {(userRegistrations.length > 0 &&
                            (userRegistrations[0].isPlayer != -1 ||
                                userRegistrations[0].registeringYourself == 4))? (
                <div>
                    {this.termsAndConditionView(getFieldDecorator)}
                    {termsAndConditionsFinal!= null && termsAndConditionsFinal.length > 0 &&
                        <div>
                        {this.termsAndConditionsOrgView(getFieldDecorator)}
                        </div>}
                </div>) : null }
                {this.removeModalView()}
            </div>
        )
    }

    //////navigate to stripe payment screen
    // navigatePaymentScreen = () => {
    //     history.push("/checkoutPayment", {
    //         competitionId: this.state.competitionUniqueKey,
    //         organisationUniqueKey: this.state.organisationUniqueKey
    //     })
    // }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        return (
            <div className="fluid-width">
                {userRegistrations.length > 0 && (userRegistrations[0].isPlayer != -1 || 
                    (userRegistrations[0].registeringYourself == 4 && userRegistrations[0].competitionMembershipProductTypeId != null)) ? (
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
        clearRegistrationDataAction,
        updateRegistrationSettingsAction,
        updateTeamAction,
        personRegisteringRoleReferenceAction,
        updateYourInfoAction,
        getTermsAndConditionsAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(AppRegistrationForm));
