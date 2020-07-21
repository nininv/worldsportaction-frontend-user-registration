import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Select, Button, Radio } from 'antd';
import './product.css';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from '../../util/history'
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';
import { updateDeregistrationData } from "../../store/actions/registrationAction/deRegistrationAction"
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
            registrationOption: 0
        }
    }

    saveAPIsActionCall = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
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
        const { deRegistionOption, deRegistionOther } = this.props.deRegistrationState
        if (subItem.id == 5 && selectedOption == 5) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        placeholder={AppConstants.other}
                        value={deRegistionOther}
                        onChange={(e) => this.props.updateDeregistrationData(e.target.value, "deRegistionOther")}
                    />
                </div>
            )
        }
    }

    ////checkMainRegistrationOption
    checkMainRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const { deRegistionOption, selectedDeRegistionOption } = this.props.deRegistrationState
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
                                'selectedDeRegistionOption'
                            )
                        }
                        value={selectedDeRegistionOption}
                    >
                        {(deRegistionOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkDeRegistrationOption(
                                            item,
                                            selectedDeRegistionOption
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
        const { deRegistionOption, transferOther } = this.props.deRegistrationState
        if (subItem.id == 3 && selectedOption == 3) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        placeholder={AppConstants.other}
                        value={transferOther}
                        onChange={(e) => this.props.updateDeregistrationData(e.target.value, "transferOther")}
                    />
                </div>
            )
        }
    }

    ///checkRegistrationOption
    checkRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const { DeRegistionMainOption, selectedDeRegistionMainOption, transferOption, selectedTransferOption } = this.props.deRegistrationState
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
                                'selectedDeRegistionMainOption'
                            )
                        }

                        value={selectedDeRegistionMainOption}
                    >
                        {(DeRegistionMainOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkMainRegistrationOption(
                                            item,
                                            selectedDeRegistionMainOption
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
                                'selectedTransferOption'
                            )
                        }
                        value={selectedTransferOption}
                    >
                        {(transferOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"transferOption" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkTransferOption(
                                            item,
                                            selectedTransferOption
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
        const { registrationSelection, registrationOption, userName, email, mobileNumber } = this.props.deRegistrationState
        return (
            <div className="content-view pt-5">
                <Form.Item  >
                    {getFieldDecorator('userName', { rules: [{ required: true, message: ValidationConstants.pleaseEnterUserName }] })(
                        <InputWithHead
                            heading={AppConstants.username}
                            placeholder={AppConstants.username}
                            value={userName}
                            onChange={(e) => this.props.updateDeregistrationData(e.target.value, "userName")}
                        />
                    )}
                </Form.Item>
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
                <Form.Item  >
                    {getFieldDecorator('mobileNumber', { rules: [{ required: true, message: ValidationConstants.pleaseEnterMobileNumber }] })(
                        <InputWithHead
                            required={"pt-0"}
                            heading={AppConstants.mobileNumber}
                            placeholder={AppConstants.mobileNumber}
                            value={mobileNumber}
                            onChange={(e) => this.props.updateDeregistrationData(e.target.value, "mobileNumber")}
                        />
                    )}
                </Form.Item>
                <Form.Item  >
                    {getFieldDecorator('email', { rules: [{ required: true, message: ValidationConstants.emailField[0] }] })(
                        <InputWithHead
                            required={"pt-0"}
                            heading={AppConstants.emailAdd}
                            placeholder={AppConstants.emailAdd}
                            // value={email}
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
                                'registrationOption'
                            )
                        }

                        value={registrationOption}
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
                                            registrationOption
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
                                onClick={() => console.log("Cancel")}>{AppConstants.cancel}</Button>
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
                            <Loader visible={false} />
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
        updateDeregistrationData
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        deRegistrationState: state.DeRegistrationState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(DeRegistration));