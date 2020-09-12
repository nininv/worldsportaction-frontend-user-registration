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
import { updateDeregistrationData, getDeRegisterDataAction, saveDeRegisterDataAction } from "../../store/actions/registrationAction/deRegistrationAction"
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
            userId: 0,
            loading: false,
            saveLoad: false
        }
    }

    componentDidMount(){
        let userId = this.props.location.state ? this.props.location.state.userId : null;
        this.setState({userId});
        this.apiCall(userId);
    }

    componentDidUpdate(nextProps){

        let deRegisterState = this.props.deRegistrationState;
        if(this.state.loading == true && deRegisterState.onDeRegisterLoad == false){
            this.setState({loading:false});
            this.setFormFields();
        }
        if(deRegisterState.reloadFormData == 1){
          //  console.log("$$$$$$$$$$$$$4");
            this.props.updateDeregistrationData(0,'reloadFormData');
            this.setFormFields();
        }

        if(this.state.saveLoad == true && deRegisterState.onSaveLoad == false){
            history.push({pathname:'/userPersonal', state: {tabKey: "5", userId: this.state.userId}});
        }
    }

    apiCall(userId){
        this.props.getDeRegisterDataAction(userId);
        this.setState({loading: true});
    }

    setFormFields = () => {
        let deRegisterState = this.props.deRegistrationState;
        let saveData = deRegisterState.saveData;
        this.props.form.setFieldsValue({
            [`userId`]:  saveData.userId,
            [`email`]:  saveData.email,
            [`mobileNumber`]:  saveData.mobileNumber,
            [`organisationId`]: saveData.organisationId,
            [`competitionId`]:  saveData.competitionId,
            [`membershipMappingId`]: saveData.membershipMappingId,
            [ `divisionId`]: saveData.divisionId
        });
    }

    goBack = () =>{
        history.push({pathname:'/userPersonal', state: {tabKey: "5", userId: this.state.userId}});
    }

    saveAPIsActionCall = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                let deRegisterState = this.props.deRegistrationState;
                let saveData = deRegisterState.saveData;
                if(saveData.regChangeTypeRefId == 0 || saveData.regChangeTypeRefId == null){
                    message.config({ duration: 0.9, maxCount: 1 });
                    message.error(ValidationConstants.deRegisterChangeTypeRequired);
                }
                else if(saveData.deRegistrationOptionId == 2 && saveData.reasonTypeRefId == 0){
                    message.config({ duration: 0.9, maxCount: 1 });
                    message.error(ValidationConstants.deRegisterReasonRequired);
                }
                else{
                    this.props.saveDeRegisterDataAction(saveData);
                    this.setState({saveLoad: true});
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
                        onChange={(e) => this.props.updateDeregistrationData(e.target.value, "deRegisterOther", 'deRegister')}
                    />
                </div>
            )
        }
    }

    ////checkMainRegistrationOption
    checkMainRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const {saveData, deRegistionOption } = this.props.deRegistrationState
        if (subItem.id == 1 && selectedOption == 1) {
        } else if (subItem.id == 2 && selectedOption == 2) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        heading={AppConstants.reasonRegisterTitle}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
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
                        value={saveData.transafer.transferOther}
                        onChange={(e) => this.props.updateDeregistrationData(e.target.value, "transferOther", 'transfer')}
                    />
                </div>
            )
        }
    }

    ///checkRegistrationOption
    checkRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const {saveData, DeRegistionMainOption, transferOption } = this.props.deRegistrationState
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
                            this.props.updateDeregistrationData(
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
                    <InputWithHead heading={AppConstants.organisationName} required={"required-field"} />
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                    // onChange={(e) => this.onChangeSetParticipantValue(e, "competitionUniqueKey", index)}

                    >
                        {/* {(item.organisationInfo != null && item.organisationInfo.competitions || []).map((comp, compIndex) => (
                                <Option key={comp.competitionUniqueKey}
                                    value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
                            ))} */}
                    </Select>
                    <InputWithHead heading={AppConstants.competition_name} required={"required-field"} />
                    <Select
                        showSearch
                        optionFilterProp="children"
                        style={{ width: "100%", paddingRight: 1 }}
                    // onChange={(e) => this.onChangeSetParticipantValue(e, "competitionUniqueKey", index)}

                    >
                        {/* {(item.organisationInfo != null && item.organisationInfo.competitions || []).map((comp, compIndex) => (
                                <Option key={comp.competitionUniqueKey}
                                    value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
                            ))} */}
                    </Select>
                    <InputWithHead
                        required={"pt-3"}
                        heading={AppConstants.reasonForTransfer}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
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
        const { saveData, registrationSelection,deRegisterData, organisations, competitions, membershipTypes, teams, divisions } = this.props.deRegistrationState;
        let divisionList = divisions!= null ? divisions : [];
        return (
            <div className="content-view pt-5">
                 <InputWithHead heading={AppConstants.username} required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator(`userId`, {
                        rules: [{ required: true, message: ValidationConstants.userNameRequired }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "userId", "deRegister")}
                            setFieldsValue={saveData.userId}
                            placeholder={'User Name'}>
                        {(deRegisterData || []).map((user, cIndex) => (
                                <Option key={user.userId} 
                                value={user.userId} >{user.userName}</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.organisationName} required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator(`organisationId`, {
                        rules: [{ required: true, message: ValidationConstants.organisationName }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "organisationId", "deRegister")}
                            setFieldsValue={saveData.organisationId}
                            placeholder={'Organisation Name'}>
                            {(organisations || []).map((org, cIndex) => (
                                <Option key={org.organisationId} 
                                value={org.organisationId} >{org.organisationName}</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.competition_name} required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator(`competitionId`, {
                        rules: [{ required: true, message: ValidationConstants.competitionRequired }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "competitionId", "deRegister")}
                            setFieldsValue={saveData.competitionId}
                            placeholder={'Competition Name'}>
                        {(competitions || []).map((comp, cIndex) => (
                                <Option key={comp.competitionId} 
                                value={comp.competitionId} >{comp.competitionName}</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.membershipProduct} required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator(`membershipMappingId`, {
                        rules: [{ required: true, message: ValidationConstants.pleaseSelectMembershipTypes }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "membershipMappingId", "deRegister")}
                            setFieldsValue={saveData.membershipMappingId}
                            placeholder={AppConstants.membershipProduct}>
                        {(membershipTypes || []).map((mem, mIndex) => (
                                <Option key={mem.membershipMappingId} 
                                value={mem.membershipMappingId} >{mem.productName + " - " + mem.typeName }</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.division} required={(divisionList.length > 0 ? "required-field" : "")} />
                <Form.Item >
                    {getFieldDecorator(`divisionId`, {
                        rules: [{ required: (divisionList.length > 0 ? true : false), message: ValidationConstants.divisionField }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "divisionId", "deRegister")}
                            setFieldsValue={saveData.divisionId}
                            placeholder={AppConstants.divisionName}>
                        {(divisionList || []).map((div, mIndex) => (
                                <Option key={div.divisionId} 
                                value={div.divisionId} >{div.divisionName}</Option>
                            ))
                            }
                        
                        </Select>
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.teamName} />
                {/* <Form.Item >
                    {getFieldDecorator(`teamId`, {
                        rules: [{ required: true, message: ValidationConstants.teamRequired }],
                    })( */}
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "teamId", "deRegister")}
                            value={saveData.teamId}
                            placeholder={AppConstants.membershipTypes}>
                        {(teams || []).map((team, mIndex) => (
                                <Option key={team.teamId} 
                                value={team.teamId} >{team.teamName}</Option>
                            ))
                            }
                        
                        </Select>
                {/* //     )}
                // </Form.Item> */}



                <Form.Item  >
                    {getFieldDecorator('mobileNumber', { rules: [{ required: true, message: ValidationConstants.pleaseEnterMobileNumber }] })(
                        <InputWithHead
                            required={"pt-0"}
                            disabled = {true}
                            heading={AppConstants.mobileNumber}
                            placeholder={AppConstants.mobileNumber}
                            setFieldsValue={saveData.mobileNumber}
                            onChange={(e) => this.props.updateDeregistrationData(e.target.value, "mobileNumber", "deRegister")}
                        />
                    )}
                </Form.Item>
                <Form.Item  >
                    {getFieldDecorator('email', { rules: [{ required: true, message: ValidationConstants.emailField[0] }] })(
                        <InputWithHead
                            required={"pt-0"}
                            disabled = {true}
                            heading={AppConstants.emailAdd}
                            placeholder={AppConstants.emailAdd}
                             setFieldsValue={saveData.email}
                            onChange={(e) => this.props.updateDeregistrationData(e.target.value, "email")}
                        />
                    )}
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.whatRegistrationChange} />
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        style={{ overflow: "visible" }}
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
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
                                            <Radio value={item.id}>{item.value}</Radio>
                                            <div style={{ marginLeft: -20, }}>
                                                <Tooltip placement='bottom' background="#ff8237">
                                                    <span>{item.helpMsg}</span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        {this.checkRegistrationOption(
                                            item,
                                            saveData.regChangeTypeRefId
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
        saveDeRegisterDataAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        deRegistrationState: state.DeRegistrationState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(DeRegistration));