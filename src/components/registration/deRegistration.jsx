import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Select, Button, Radio, message } from 'antd';
import './product.css';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from '../../util/history'
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';
import {
    updateDeregistrationData, getDeRegisterDataAction, saveDeRegisterDataAction,
    getTransferCompetitionsAction
} from "../../store/actions/registrationAction/deRegistrationAction"
import ValidationConstants from "../../themes/validationConstant";
import Tooltip from 'react-png-tooltip'

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_Obj = null;

class DeRegistration extends Component {
    constructor(props) {
        super(props);
        this_Obj = this;
        this.state = {
            registrationOption: 0,
            regChangeTypeRefId: 0,
            userId: 0,
            loading: false,
            saveLoad: false,
            regData: null,
            personal: null,
            membershipMappingId: null
        }
    }

    componentDidMount() {
        let userId = this.props.location.state ? this.props.location.state.userId : null;
        let regChangeTypeRefId = this.props.location.state ? this.props.location.state.regChangeTypeRefId : null;
        let regData = this.props.location.state ? this.props.location.state.regData : null;
        let personal = this.props.location.state ? this.props.location.state.personal : null;
        let payload = {};
        if (personal) {
            this.setState({ userId: personal.userId });
        }
        this.setState({ regData, personal });
        console.log("regChangeTypeRefId::", regChangeTypeRefId)
        this.setState({ userId, regChangeTypeRefId });
        if(this.props.location.state.sourceFrom == AppConstants.ownRegistration){
            payload = {
                userId: personal.userId,
                teamId: 0,
                registrationId: regData.registrationId,
                competitionId: regData.competitionId,
                organisationId: regData.organisationId,
                division: regData.divisionId,
                membershipMappingId: regData.membershipMappingId
            }
        } else if(this.props.location.state.sourceFrom == AppConstants.teamRegistration){
            payload = {
                userId: 0,
                teamId: regData.teamId,
                registrationId: regData.registrationUniqueKey,
                competitionId: null,
                organisationId: null,
                division: 0,
                membershipMappingId: 0
            }
        } else if(this.props.location.state.sourceFrom == AppConstants.teamMembers){
            payload = {
                userId: regData.userId,
                teamId: regData.teamId,
                registrationId: regData.registrationUniqueKey,
                competitionId: regData.competitionId,
                organisationId: regData.organisationId,
                division: 0,
                membershipMappingId: 0
            }
        }
        this.apiCall(payload);
    }

    componentDidUpdate(nextProps) {

        let deRegisterState = this.props.deRegistrationState;
        if (this.state.loading == true && deRegisterState.onDeRegisterLoad == false) {
            this.setState({ loading: false });
            this.updateDeregistrationData(this.state.regChangeTypeRefId, "regChangeTypeRefId", "deRegister");
            this.setFormFields();

        }
        if (deRegisterState.reloadFormData == 1) {
            //  console.log("$$$$$$$$$$$$$4");
            this.props.updateDeregistrationData(0, 'reloadFormData');
            this.setFormFields();
        }

        if (this.state.saveLoad == true && deRegisterState.onSaveLoad == false) {
            history.push({ pathname: '/userPersonal', state: { tabKey: "5", userId: this.state.userId } });
        }
    }

    apiCall(payload) {
        this.props.getDeRegisterDataAction(payload);
        this.setState({ loading: true });
    }

    setFormFields = () => {
        let deRegisterState = this.props.deRegistrationState;
        let saveData = deRegisterState.saveData;
        this.props.form.setFieldsValue({
            [`userId`]: saveData.userId,
            [`email`]: saveData.email,
            [`mobileNumber`]: saveData.mobileNumber,
            [`organisationId`]: saveData.organisationId,
            [`competitionId`]: saveData.competitionId,
            [`membershipMappingId`]: saveData.membershipMappingId,
            [`divisionId`]: saveData.divisionId,
            [`transferOrganisationId`]: saveData.transfer.organisationId,
            [`transferCompetitionId`]: saveData.transfer.competitionId,
        });
    }

    goBack = () => {
        history.push({ pathname: '/userPersonal', state: { tabKey: "5", userId: this.state.userId } });
    }

    updateDeregistrationData = (value, key, subKey) => {
        const { saveData } = this.props.deRegistrationState;
        if (key == "regChangeTypeRefId") {
            if (value == 2) {
                this.getTransferOrgData();
            }
        }
        if (key == "membershipMappingId") {
            if (saveData.regChangeTypeRefId == 2) {
                this.getTransferOrgData();
            }
        }
        this.props.updateDeregistrationData(value, key, subKey)
    }

    getTransferOrgData = () => {
        let regData = this.state.regData;
        let payload = {
            competitionId: regData.competitionId,
            membershipMappingId: regData.membershipMappingId
        }
        this.props.getTransferCompetitionsAction(payload);
        }
    

    saveAPIsActionCall = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error(AppConstants.pleaseReview)
                return false
            }
            if (!err) {
                let deRegisterState = this.props.deRegistrationState;
                let saveData = deRegisterState.saveData;
                let deRegisterData = deRegisterState.deRegisterData
                if (saveData.regChangeTypeRefId == 0 || saveData.regChangeTypeRefId == null) {
                    message.config({ duration: 0.9, maxCount: 1 });
                    message.error(ValidationConstants.deRegisterChangeTypeRequired);
                }
                else if (saveData.deRegistrationOptionId == 2 && saveData.reasonTypeRefId == 0) {
                    message.config({ duration: 0.9, maxCount: 1 });
                    message.error(ValidationConstants.deRegisterReasonRequired);
                }
                else {
                    let regData = this.state.regData;
                    let personal = this.state.personal
                    if(this.props.location.state.sourceFrom != AppConstants.teamRegistration){
                    saveData["isTeam"] = 0;
                    saveData["userId"] = deRegisterData.userId;
                    saveData["organisationId"] = regData.organisationId;
                    saveData["competitionId"] = regData.competitionId;
                    saveData["membershipMappingId"] = this.props.location.state.sourceFrom == AppConstants.teamMembers ? this.state.membershipMappingId : deRegisterData.membershipMappingId;
                    saveData["teamId"] = regData.teamId;
                    saveData["divisionId"] = deRegisterData.divisionId;
                    saveData["registrationId"] = this.props.location.state.sourceFrom == AppConstants.teamMembers ? regData.registrationUniqueKey : regData.registrationId;
                    this.props.saveDeRegisterDataAction(saveData);
                    this.setState({ saveLoad: true });
                    }
                    else{
                        saveData["isTeam"] = 1;
                        saveData["userId"] = 0;
                        saveData["teamId"] = regData.teamId;
                        saveData["registrationId"] = regData.registrationUniqueKey;
                        this.props.saveDeRegisterDataAction(saveData);
                        this.setState({ saveLoad: true });
                    }
                }
            }
        })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.registrationChange}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }
    ///checkDeRegistrationOption
    checkDeRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const { saveData, deRegistionOther } = this.props.deRegistrationState
        if (subItem.id == 5 && selectedOption == 5) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        placeholder={AppConstants.other}
                        value={saveData.deRegisterOther}
                        onChange={(e) => this.updateDeregistrationData(e.target.value, "deRegisterOther", 'deRegister')}
                    />
                </div>
            )
        }
    }

    ////checkMainRegistrationOption
    checkMainRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const { saveData, deRegistionOption } = this.props.deRegistrationState
        // if (subItem.id == 1 && selectedOption == 1) {
        // }
        if ((subItem.id == 1 && selectedOption == 1) || (subItem.id == 2 && selectedOption == 2)) {
            return (
                <div className="ml-5 pt-3">
                    <InputWithHead
                        required={"pt-0"}
                        heading={AppConstants.reasonRegisterTitle}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'reasonTypeRefId',
                                'deRegister'
                            )
                        }
                        value={saveData.reasonTypeRefId}
                    >
                        {(deRegistionOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkDeRegistrationOption(
                                            item,
                                            saveData.reasonTypeRefId
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>

                </div>
            )
        }
    }

    //checkTransferOption
    checkTransferOption = (subItem, selectedOption) => {
        const { saveData, transferOther } = this.props.deRegistrationState
        if (subItem.id == 3 && selectedOption == 3) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        placeholder={AppConstants.other}
                        value={saveData.transfer.transferOther}
                        onChange={(e) => this.updateDeregistrationData(e.target.value, "transferOther", 'transfer')}
                    />
                </div>
            )
        }
    }

    ///checkRegistrationOption
    checkRegistrationOption = (subItem, selectedOption, getFieldDecorator) => {
        //console.log(subItem, selectedOption)
        const { saveData, DeRegistionMainOption, transferOption, transferOrganisations,
            transferCompetitions } = this.props.deRegistrationState
        if (subItem.id == 1 && selectedOption == 1) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        heading={AppConstants.takenCourtforTraining}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'deRegistrationOptionId',
                                'deRegister'
                            )
                        }

                        value={saveData.deRegistrationOptionId}
                    >
                        {(DeRegistionMainOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkMainRegistrationOption(
                                            item,
                                            saveData.deRegistrationOptionId
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>

                </div>
            )
        }
        else if (subItem.id == 2 && selectedOption == 2) {
            return (
                <div className="ml-5">
                    <InputWithHead heading={AppConstants.organisationNameTransferTo} required={"required-field"} />
                    <Form.Item >
                        {getFieldDecorator(`transferOrganisationId`, {
                            rules: [{ required: true, message: ValidationConstants.organisationName }],
                        })(
                            <Select
                                showSearch
                                optionFilterProp="children"
                                style={{ width: "100%", paddingRight: 1 }}
                                required={"required-field pt-0 pb-0"}
                                className="input-inside-table-venue-court team-mem_prod_type"
                                onChange={(e) => this.updateDeregistrationData(e, "organisationId", "transfer")}
                                setFieldsValue={saveData.transfer.organisationId}
                                placeholder={'Organisation Name'}>
                                {(transferOrganisations || []).map((org, cIndex) => (
                                    <Option key={org.organisationId}
                                        value={org.organisationId} >{org.organisationName}</Option>
                                ))
                                }

                            </Select>
                        )}
                    </Form.Item>
                    <InputWithHead heading={AppConstants.competitionNameTransferTo} required={"required-field"} />
                    <Form.Item >
                        {getFieldDecorator(`transferCompetitionId`, {
                            rules: [{ required: true, message: ValidationConstants.competitionRequired }],
                        })(
                            <Select
                                showSearch
                                optionFilterProp="children"
                                style={{ width: "100%", paddingRight: 1 }}
                                required={"required-field pt-0 pb-0"}
                                className="input-inside-table-venue-court team-mem_prod_type"
                                onChange={(e) => this.updateDeregistrationData(e, "competitionId", "transfer")}
                                setFieldsValue={saveData.transfer.competitionId}
                                placeholder={'Competition Name'}>
                                {(transferCompetitions || []).map((comp, cIndex) => (
                                    <Option key={comp.competitionId}
                                        value={comp.competitionId} >{comp.competitionName}</Option>
                                ))
                                }

                            </Select>
                        )}
                    </Form.Item>
                    <InputWithHead
                        required={"pt-3"}
                        heading={AppConstants.reasonForTransfer}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'reasonTypeRefId',
                                'transfer'
                            )
                        }
                        value={saveData.transfer.reasonTypeRefId}
                    >
                        {(transferOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"transferOption" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkTransferOption(
                                            item,
                                            saveData.transfer.reasonTypeRefId
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>

                </div>
            )
        }

    }

    ////////form content view
    contentView = (getFieldDecorator) => {
        const { saveData, registrationSelection, deRegisterData} = this.props.deRegistrationState;
        let regData = this.state.regData;
        let personal = this.state.personal;
        let sourceFrom = this.props.location.state.sourceFrom
        return (
            <div className="content-view pt-5">
                {sourceFrom != AppConstants.teamRegistration &&
                <InputWithHead
                    disabled
                    heading={AppConstants.userName}
                    style={{ width: "100%", paddingRight: 1 }}
                    required="pb-1"
                    className="input-inside-table-venue-court team-mem_prod_type"
                    value={deRegisterData ? (deRegisterData.firstName + ' ' + deRegisterData.lastName) : ""}
                    placeholder={'User Name'} />
                }

                <InputWithHead
                    disabled
                    heading={AppConstants.organisationName}
                    style={{ width: "100%", paddingRight: 1 }}
                    required="pb-1"
                    className="input-inside-table-venue-court team-mem_prod_type"
                    value={deRegisterData ? deRegisterData.organisationName : ''}
                    placeholder={'Organisation Name'} />

                <InputWithHead
                    disabled
                    heading={AppConstants.competition_name}
                    style={{ width: "100%", paddingRight: 1 }}
                    required="pb-1"
                    className="input-inside-table-venue-court team-mem_prod_type"
                    value={deRegisterData ? deRegisterData.competitionName : ''}
                    placeholder={'Competition Name'} />
                {sourceFrom == AppConstants.ownRegistration &&
                <InputWithHead
                    disabled
                    style={{ width: "100%", paddingRight: 1 }}
                    heading={AppConstants.membershipProduct}
                    required="pb-1"
                    className="input-inside-table-venue-court team-mem_prod_type"
                    value={(deRegisterData ? deRegisterData.membershipProduct : '') + ' - ' + (deRegisterData ? deRegisterData.membershipType : '')}
                    placeholder={AppConstants.membershipProduct} />
                }
                {sourceFrom == AppConstants.teamMembers &&
                    <div>
                        <InputWithHead heading={AppConstants.membershipProduct} required={"required-field"} />
                        <Form.Item>
                        {getFieldDecorator(`membershipProduct`, {
                            rules: [{ required: true, message: ValidationConstants.pleaseSelectMembershipProduct }],
                        })(
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.select}
                                className="input-inside-table-venue-court team-mem_prod_type"
                                onChange={(e) => this.setState({membershipMappingId: e})}
                                >
                                {(deRegisterData?.membershipTypes || []).map((item) => (
                                    < Option key={item.membershipMappingId} value={item.membershipMappingId}> {item.membershipProduct + ' - ' + item.membershipType}</Option>
                                ))
                                }
                            </Select>
                        )}

                        </Form.Item>
                    </div>
                }

                <InputWithHead
                    disabled
                    heading={AppConstants.division}
                    style={{ width: "100%", paddingRight: 1 }}
                    required="pb-1"
                    className="input-inside-table-venue-court team-mem_prod_type"
                    value={deRegisterData ? deRegisterData.divisionName : ''}
                    placeholder={AppConstants.divisionName} />
                            
                {/* {saveData.isTeam == 1 &&
                    <div>
                        <InputWithHead heading={AppConstants.teamMember} style={{ paddingBottom: '0px' }} />
                        <Select
                            showSearch
                            mode="multiple"
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.updateDeregistrationData(e, "teamMembers", "deRegister")}
                            value={saveData.teamMembers}
                            placeholder={AppConstants.teamMember}>
                            {(teamMembers || []).map((user, mIndex) => (
                                <Option key={user.userId}
                                    value={user.userId} >{user.firstName + ' ' + user.lastName}</Option>
                            ))
                            }

                        </Select>
                    </div>
                } */}

                <InputWithHead
                        required="pb-1"
                        disabled={true}
                        heading={AppConstants.teamName}
                        placeholder={AppConstants.teamName}
                        value={deRegisterData ? deRegisterData.teamName : ''}
                />
                {sourceFrom != AppConstants.teamRegistration &&
                <InputWithHead
                    required="pb-1"
                    disabled={true}
                    heading={AppConstants.mobileNumber}
                    placeholder={AppConstants.mobileNumber}
                    value={deRegisterData ? (deRegisterData.mobileNumber) : ''}
                />
                 }
                {sourceFrom != AppConstants.teamRegistration &&
                <InputWithHead
                    required="pb-1"
                    disabled={true}
                    heading={AppConstants.emailAdd}
                    placeholder={AppConstants.emailAdd}
                    value={deRegisterData ? (deRegisterData.email) : ''}
                />
                }
                <InputWithHead
                    heading={AppConstants.whatRegistrationChange} />
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        style={{ overflow: "visible" }}
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'regChangeTypeRefId',
                                'deRegister'
                            )
                        }

                        value={saveData.regChangeTypeRefId}
                    >
                        {(registrationSelection || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <div className="contextualHelp-RowDirection" >
                                            <Radio value={item.id} disabled={item.id == 2 && saveData.isTeam}>{item.value}</Radio>
                                            <div style={{ marginLeft: -20, }}>
                                                <Tooltip placement='bottom' background="#ff8237">
                                                    <span>{item.helpMsg}</span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        {this.checkRegistrationOption(
                                            item,
                                            saveData.regChangeTypeRefId,
                                            getFieldDecorator
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>
                </div>

            </div >
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <Button
                                type="cancel-button"
                                onClick={() => this.goBack()}>{AppConstants.cancel}</Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button" type="primary"
                                htmlType="submit">
                                {AppConstants.confirm}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <Layout>
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        <Content>
                            <Loader visible={this.props.deRegistrationState.onLoad ||
                                this.props.deRegistrationState.onDeRegisterLoad ||
                                this.props.deRegistrationState.onSaveLoad} />
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView(getFieldDecorator)}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateDeregistrationData,
        getDeRegisterDataAction,
        saveDeRegisterDataAction,
        getTransferCompetitionsAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        deRegistrationState: state.DeRegistrationState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(DeRegistration));
