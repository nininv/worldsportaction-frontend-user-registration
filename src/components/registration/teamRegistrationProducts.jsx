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
import ValidationConstants from "../../themes/validationConstant";
import { captializedString } from "../../util/helpers";

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class TeamRegistrationProducts extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        try{

        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
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
                    {/* <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveReviewOrder}
                        noValidate="noValidate">
                        <Content>{this.contentView(getFieldDecorator)}</Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form> */}
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({	
    }, dispatch);

}

function mapStatetoProps(state){
    return {

    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamRegistrationProducts));