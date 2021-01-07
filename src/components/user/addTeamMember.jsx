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
import {
    getCommonRefData, countryReferenceAction, nationalityReferenceAction,
    genderReferenceAction, disabilityReferenceAction
} from '../../store/actions/commonAction/commonAction';
import { bindActionCreators } from 'redux';
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import { setTempUserId, getUserId } from "../../util/sessionStorage";
import { regexNumberExpression } from '../../util/helpers';
import PlacesAutocomplete from "../registration/elements/PlaceAutoComplete";
import { getAge, deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString } from '../../util/helpers';


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;


class AddTeamMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamMembers: [
                {
                    "genderRefId": null,
                    "email": null,
                    "lastName": null,
                    "firstName": null,
                    "middleName": null,
                    "dateOfBirth": null,
                    "mobileNumber":null,
                    "payingFor": 0,
                    "membershipProductTypes": [
                        {
                            "competitionMembershipProductId": null,
                            "competitionMembershipProductTypeId": null,
                            "isPlayer": null,
                            "productTypeName": null,
                            "isChecked": null
                        }
                    ],
                    "parentOrGuardian": [
                        {
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
                        }
                    ]
                }
            ]
        }
        this.formRef = React.createRef();
        this.props.genderReferenceAction();
    }

    componentDidMount() {
    }

    componentDidUpdate(nextProps) {
    }

    dateConversion = (f, key, referenceKey, teamMemberIndex) => {
        try {
            let date = moment(f, "DD-MM-YYYY").format("MM-DD-YYYY");
           
        } catch (ex) {
            console.log("Error in dateConversion::" + ex)
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
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.addTeamMembers}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    teamMemberParentOrGuardianView = (parent, parentIndex, teamMember, teamMemberIndex, getFieldDecorator) => {
        try {
            return (
                <div>
                    <div key={"parent" + parentIndex} className="light-grey-border-box">
                        {(teamMember.parentOrGuardian.length != 1) && (
                            <div className="orange-action-txt" style={{ marginTop: "30px" }}
                                onClick={() => { this.addTeamMemberParent("remove", teamMemberIndex, parentIndex) }}
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
                                            // onChange={(e) => this.onChangeSetTeamMemberParentValue(captializedString(e.target.value), "firstName", parentIndex, teamMemberIndex)}
                                            // setFieldsValue={parent.firstName}
                                            // onBlur={(i) => this.props.form.setFieldsValue({
                                            //     [`teamMemberParentFirstName${teamMemberIndex}${parentIndex}`]: captializedString(i.target.value)
                                            // })}
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
                                            // onChange={(e) => this.onChangeSetTeamMemberParentValue(captializedString(e.target.value), "middleName", parentIndex, teamMemberIndex)}
                                            // setFieldsValue={parent.middleName}
                                            // onBlur={(i) => this.props.form.setFieldsValue({
                                            //     [`teamMemberParentMiddleName${teamMemberIndex}${parentIndex}`]: captializedString(i.target.value)
                                            // })}
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
                                            // onChange={(e) => this.onChangeSetTeamMemberParentValue(captializedString(e.target.value), "lastName", parentIndex, teamMemberIndex)}
                                            // setFieldsValue={parent.lastName}
                                            // onBlur={(i) => this.props.form.setFieldsValue({
                                            //     [`teamMemberParentLastName${teamMemberIndex}${parentIndex}`]: captializedString(i.target.value)
                                            // })}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-6">
                                <Form.Item >
                                    {getFieldDecorator(`teamMemberParentMobileNumber${teamMemberIndex}${parentIndex}`, {
                                        rules: [{ required: true, message: ValidationConstants.contactField }],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0 pb-0"}
                                            heading={AppConstants.mobile}
                                            placeholder={AppConstants.mobile}
                                            // onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "mobileNumber", parentIndex, teamMemberIndex)}
                                            // setFieldsValue={parent.mobileNumber}
                                            maxLength={10}
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
                                            //onChange={(e) => this.onChangeSetTeamMemberParentValue(e.target.value, "email", parentIndex, teamMemberIndex)}
                                            //setFieldsValue={parent.email}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } catch (ex) {
            console.log("Error in teamMemberParentGuardianView::" + ex)
        }
    }

    teamMemberView = (teamMember,teamMemberIndex,getFieldDecorator) => {
        try{
            const { genderList } = this.props.commonReducerState;
            return(
                <div className="light-grey-border-box mt-0">
                    <div style={{ display: "flex", marginTop: "30px" }}>
                        <div className="form-heading">{AppConstants.teamMember}</div>
                        {teamMemberIndex != 0 && (
                            <img
                                onClick={() => { this.onChangeSetTeamValue(teamMemberIndex, "removeTeamMember") }}
                                style={{ marginLeft: "auto", width: "25px" }}
                                src={AppImages.removeIcon} />
                        )}
                    </div>
                    <InputWithHead heading={AppConstants.type} required={"required-field"} />
                    {/* {(membershipProductTypes || []).map((product, productIndex) => (
                        <Checkbox
                            className="py-2"
                            checked={product.isChecked}
                            key={product.competitionMembershipProductTypeId}
                            onChange={(e) => {
                                let prodIndexTemp = teamMember.membershipProductTypes.findIndex(x => x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId && x.competitionMembershipProductId === product.competitionMembershipProductId);
                                this.onChangeTeamMemberValue(e.target.checked, "membershipProductTypes", teamMemberIndex, prodIndexTemp)
                            }}>
                            {product.productTypeName}
                        </Checkbox>
                    ))} */}
                    {/* {this.showMemberTypeValidation(teamMember) && this.state.buttonSubmitted && (
                        <div style={{ color: "var(--app-red)" }}>
                            {ValidationConstants.memberTypeIsRequired}
                        </div>
                    )} */}

                    <InputWithHead heading={AppConstants.gender} required={"required-field"} />
                    <Form.Item >
                        {getFieldDecorator(`teamMemberGenderRefId${teamMemberIndex}`, {
                            rules: [{ required: true, message: ValidationConstants.genderField }],
                        })(
                            <Radio.Group
                                className="registration-radio-group"
                                // onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "genderRefId", teamMemberIndex)}
                                // setFieldsValue={teamMember.genderRefId}
                            >
                                {(genderList || []).map((gender, genderIndex) => (
                                    <Radio key={gender.id} value={gender.id}>{gender.description}</Radio>
                                ))}
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <div className="row">
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.firstName} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`teamMemberFirstName${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.firstName}
                                        // onChange={(e) => this.onChangeTeamMemberValue(captializedString(e.target.value), "firstName", teamMemberIndex)}
                                        // setFieldsValue={teamMember.firstName}
                                        // onBlur={(i) => this.props.form.setFieldsValue({
                                        //     [`teamMemberFirstName${teamMemberIndex}`]: captializedString(i.target.value)
                                        // })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.middleName} />
                            <Form.Item >
                                {getFieldDecorator(`teamMemberMiddleName${teamMemberIndex}`, {
                                    rules: [{ required: false }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.middleName}
                                        // onChange={(e) => this.onChangeTeamMemberValue(captializedString(e.target.value), "middleName", teamMemberIndex)}
                                        // setFieldsValue={teamMember.middleName}
                                        // onBlur={(i) => this.props.form.setFieldsValue({
                                        //     [`teamMemberMiddleName${teamMemberIndex}`]: captializedString(i.target.value)
                                        // })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.lastName} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`teamMemberLastName${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.lastName}
                                        // onChange={(e) => this.onChangeTeamMemberValue(captializedString(e.target.value), "lastName", teamMemberIndex)}
                                        // setFieldsValue={teamMember.lastName}
                                        // onBlur={(i) => this.props.form.setFieldsValue({
                                        //     [`teamMemberLastName${teamMemberIndex}`]: captializedString(i.target.value)
                                        // })}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.dob} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`teamMemberDateOfBirth${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.dateOfBirth }],
                                })(
                                    <DatePicker
                                        size="large"
                                        placeholder={"dd-mm-yyyy"}
                                        style={{ width: "100%" }}
                                        onChange={(e, f) => this.dateConversion(f, "dateOfBirth", "teamMember", teamMemberIndex)}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        name={'dateOfBirth'}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.phone} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`teamMemberMobileNumber${teamMemberIndex}`, {
                                    rules: [{ required: true, message: ValidationConstants.contactField }],
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.phone}
                                        // onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "mobileNumber", teamMemberIndex)}
                                        // setFieldsValue={teamMember.mobileNumber}
                                        maxLength={10}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <InputWithHead heading={AppConstants.email} required={"required-field"} />
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
                                        // onChange={(e) => this.onChangeTeamMemberValue(e.target.value, "email", teamMemberIndex)}
                                        // setFieldsValue={teamMember.email}
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
                                this.teamMemberAddingProcess(teamMember.dateOfBirth, e.target.checked ? 1 : 0, teamMemberIndex)
                            }}>
                            {AppConstants.payingForMember}
                        </Checkbox>
                    )}
                    {isArrayNotEmpty(teamMember.parentOrGuardian) && (
                        <div>
                            <div className="form-heading" style={{ paddingBottom: "0px", marginTop: 20 }}>{AppConstants.parentOrGuardianDetail}</div>
                                    <div>
                                        {(teamMember.parentOrGuardian || []).slice(1, teamMember.parentOrGuardian.length).map((parent, parentIndex) => (
                                            <div>{this.teamMemberParentOrGuardianView(parent, parentIndex + 1, teamMember, teamMemberIndex, getFieldDecorator)}</div>
                                        ))}
                                    </div>
                            {/* <div className="orange-action-txt" style={{ marginTop: "10px" }}
                                onClick={() => { this.addTeamMemberParent("add", teamMemberIndex) }}
                            >+ {AppConstants.addNewParentGaurdian}</div> */}
                        </div>
                    )}

                    {getAge(moment(teamMember.dateOfBirth).format("MM-DD-YYYY")) > 18 && teamMember.payingFor == 1 && (
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

    //////form content view
    contentView = (getFieldDecorator) => {
        return (
            <div className="content-view">
                {(this.state.teamMembers || []).map((teamMember,teamMemberIndex) => {
                    return(
                        <div>{this.teamMemberView(teamMember,teamMemberIndex,getFieldDecorator)}</div>
                    )
                })}
                <div className="orange-action-txt"
                    style={{ marginTop: "25px" }}
                    // onClick={() => {this.onChangeSetTeamValue(null, "addTeamMember")}}
                    ><span className="add-another-button-border">+ {AppConstants.addTeamMember}</span></div>
            </div>
        );
    };

   
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to={{ pathname: `/userPersonal`}} >
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
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user}/>
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.onSaveClick}
                        noValidate="noValidate"
                        ref={this.formRef}
                    >
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            <Loader visible={this.props.userState.onUpUpdateLoad || this.props.commonReducerState.onLoad} />
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
        genderReferenceAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        userState: state.UserState,

    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(AddTeamMember));


