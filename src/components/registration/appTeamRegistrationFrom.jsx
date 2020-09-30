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
    Pagination
} from "antd";
import { connect } from "formik";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import { bindActionCreators } from "redux";
const { Header, Footer, Content } = Layout;
class appTeamRegistrationForm extends Component{
    constructor(props){
        super(props);
        // this.state = {

        // }  
    }

    componentDidMount(){

    }

    componentDidUpdate(){

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
                                {AppConstants.signupToCompetition}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Header>
                </div>
            )
        }catch(ex){
            console.log("Error in headerView::"+ex);
        }
    }

    contentView = (getFieldDecorator) => {
        try{

        }catch(ex){
            console.log("Error in contentView::"+ex);
        }
    }

    footerView = (getFieldDecorator) => {
        try{

        }catch(ex){
            console.log("Error in footerView::"+ex);
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
                <Form
                    autoComplete="off"
                    scrollToFirstError={true}
                    onSubmit={this.saveRegistrationForm}
                    noValidate="noValidate">
                    <Content>{this.contentView(getFieldDecorator)}</Content>
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

    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userRegistrationState: state.UserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps) (Form.create(appTeamRegistrationForm));