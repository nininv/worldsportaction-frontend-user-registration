import React, { Component } from "react";
import {
    Layout,Breadcrumb,Input,Select,Checkbox,Button, Table,DatePicker,Radio, Form, Modal, message
} from "antd";

import AppConstants from "../../themes/appConstants";
import "../../pages/layout.css";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

class RegistrationReviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onInvLoad: false,
            buttonPressed: "",
            loading: false,
        }
        this.getReferenceData();
    }

    componentDidMount() {
        this.getApiInfo();
    }

    componentDidUpdate(nextProps){
        let registrationState = this.props.endUserRegistrationState;
       
    }

    getApiInfo = () => {
    }
  
    getReferenceData = () => {
    }

    saveReviewForm = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("Error: " + err);
            if(!err)
            {
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

    contentView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div>
               <div>
                    {this.individualView(getFieldDecorator)}
               </div>
               <div>
                    {this.teamView(getFieldDecorator)}
               </div>
               <div>
                    {this.charityView(getFieldDecorator)}
               </div>
            </div>
        )
    }

    individualView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div>
               
            </div>
        )
    }

    teamView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div>
               
            </div>
        )
    }

    charityView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div>
               
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
                        onSubmit={this.saveReviewForm}
                        noValidate="noValidate">
                        <Content>
                            <div>
                                {this.contentView(getFieldDecorator)}
                            </div>
                         <Loader visible={this.props.endUserRegistrationState.onLoad } />
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
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        endUserRegistrationState: state.EndUserRegistrationState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationReviewForm));
