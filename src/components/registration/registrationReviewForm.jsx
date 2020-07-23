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
import InputWithHead from '../../customComponents/InputWithHead';



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
            <div className="header-view form-review" style = {{paddingLeft:0,marginBottom : 40}}>
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "flex-start",
                        padding:0
                        
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
               <div style={{backgroundColor: "#f7fafc", marginBottom: 40}}>
                    {this.individualView(getFieldDecorator)}
               </div>
               <div style={{ marginBottom: 40}}>
                    {this.teamView(getFieldDecorator)}
               </div>
               <div style={{ marginBottom: 40}}>
                    {this.charityView(getFieldDecorator)}
               </div>
            </div>
        )
    }

    individualView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        {AppConstants.individualRegistration}
                        {AppConstants.hyphen}
                        {AppConstants.participantName}
                        {AppConstants.hyphen}
                        {AppConstants.competitionName}     
                    </div>
                    <div>
                        $120
                    </div>
                </div>
                <div className='membership-text'>
                    <div>
                        {AppConstants.membershipProduct} 1
                    </div>
                    <div>
                        $120
                    </div>
                </div>
                <div className='membership-text' style={{marginTop:0}}>
                    <div>
                        <span className="number-text-style" style={{fontWeight:500}}>{AppConstants.less}</span>
                        <span>{":"+" "}</span>
                        <span>{AppConstants.discount}</span>
                    </div>
                    <div className="number-text-style">
                        ($20)
                    </div>
                </div>
                <div className='membership-text'>
                    <div style={{marginBottom:32}}>
                        {AppConstants.membershipProduct} 2
                    </div>
                    <div>
                        $120
                    </div>
                </div>
                <div className='membership-text' style={{marginTop:0}}>
                    <div>
                        <span className="number-text-style">{AppConstants.less}</span>
                        <span>{":"+" "}</span>
                        <span>{AppConstants.governmentSportVouchers}</span>
                    </div>
                    <div className="number-text-style">
                        ($20)
                    </div>
                </div> 
                <div className='membership-text' style={{marginTop:4 , marginBottom:31}}>
                    <div>
                    <span className="number-text-style">{AppConstants.less}</span>                    
                    <span>{":"+" "}</span>                       
                    <span>{AppConstants.hardshipPlayer}</span>
                    </div>
                    <div className="number-text-style">
                        ($20)
                    </div>
                </div>               
                <Radio.Group className="reg-competition-radio" style={{marginBottom:10}}>
                    <Radio value={"1"}>{AppConstants.payAsYou}</Radio>                    
                </Radio.Group> 
                <Radio.Group className="reg-competition-radio">
                    <Radio value={"1"}>{AppConstants.gameVoucher}</Radio>
                    <Radio.Group className="reg-competition-radio" style={{marginLeft:30}}>
                        <Radio value={"2"}>3</Radio>  
                        <Radio value={"3"}>5</Radio>
                        <Radio value={"4"}>10</Radio>
                    </Radio.Group>  
                </Radio.Group>                
                <div style={{marginTop:15}}>
                    <Radio.Group className="reg-competition-radio" style={{marginBottom:10}}>
                        <Radio value={"1"}>{AppConstants.payfullAmount}</Radio>
                    </Radio.Group>  
                    <Radio.Group className="reg-competition-radio"> 
                        <Radio value={"2"}>{AppConstants.weeklyInstalment}</Radio>
                    </Radio.Group>   
                </div>               
                <div className="heading-instalmentdate">
                    <div className="text-instalmentdate">{AppConstants.instalmentDates}</div>
                    <div>17/8/2020</div>
                </div>   
                <div style={{marginTop:5}}>
                    <Radio.Group className="reg-competition-radio">
                        <Radio value={"1"}>{AppConstants.schoolRegistration}</Radio>
                    </Radio.Group>   
                </div>
                <div style={{marginLeft: 7,marginTop: 10}}>
                  <Checkbox className="single-checkbox mt-3" style={{color: "inherit"}}>
                    Discount Code
                  </Checkbox>
                </div>
                <div className="inputfield-style">                    
                    <div className="row" style={{marginLeft: 26 , marginTop: 12}}>
                        <div className="col-sm">
                            <InputWithHead placeholder={AppConstants.code}/>
                        </div>
                        <div className="col-sm" style={{alignSelf:"center"}}>
                        <a href="#" className='text-codelink'>Apply Code</a>
                        </div>    
                    </div>                   
                </div>
                <div style={{marginLeft: 7,marginTop: 10}}>
                  <Checkbox className="single-checkbox mt-3" style={{color: "inherit"}}>
                   {AppConstants.governmentSportsVoucher}
                  </Checkbox>
                </div>
                <div className="row" style={{marginLeft: 26 , marginTop: 12}}>
                    <div className="col-sm">
                        <InputWithHead required="pt-0" heading={'Type'} />
                        <Select
                            style={{
                                width: '100%',
                                paddingRight: 1,
                                minWidth: 182,
                            }}
                            placeholder="Select"                       
                            >                       
                            <Option  key={'disType'}  value={1}>
                                General
                            </Option>
                            <Option  key={'discode'}  value={2}>
                                Discount code
                            </Option>
                        </Select>
                    </div>
                    <div className="col-sm">
                        <InputWithHead placeholder={"code"} required="pt-0" heading={'code'} />
                    </div>    
                </div>
            </div>
        )
    }

    teamView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        {AppConstants.individualRegistration}
                        {AppConstants.hyphen}
                        {AppConstants.participantName} 2
                        {AppConstants.hyphen}
                        {AppConstants.competitionName} 2    
                    </div>
                    <div>
                        $120
                    </div>
                </div>
                <div className='membership-text' style={{marginBottom:20}}>
                    <div>
                        {AppConstants.membershipProduct} 1
                    </div>
                    <div>
                        $120
                    </div>
                </div>   
                <Radio.Group className="reg-competition-radio" style={{marginBottom:12}}>
                    <Radio value={"1"}>{AppConstants.payAsYou}</Radio>
                </Radio.Group> 
                <Radio.Group className="reg-competition-radio">
                    <Radio value={"1"}>{AppConstants.gameVoucher}</Radio>
                    <Radio.Group className="reg-competition-radio" style={{marginLeft:30}}>
                        <Radio value={"2"}>3</Radio>  
                        <Radio value={"3"}>5</Radio>
                        <Radio value={"4"}>10</Radio>
                    </Radio.Group>  
                </Radio.Group>          
            </div>
        )
    }

    charityView = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        {AppConstants.support}
                        {AppConstants.hyphen}
                        {AppConstants.confidentGirlsFoundation}  
                    </div>                    
                </div>
                <div style={{marginTop:12}}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo aliquam vero veritatis consequuntur odit, 
                    alias, perferendis temporibus 
                    libero possimus ad fuga recusandae ipsam debitis hic quis sequi, eveniet esse doloribus?
                </div>
                <div style={{marginTop:10}}>
                    <Radio.Group className="reg-competition-radio">
                        <Radio value={"1"}>RoundUp atleast 2$</Radio>  
                        <Radio value={"2"}>RoundUp atleast 3$</Radio>
                        <Radio value={"3"}>RoundUp atleast 10$</Radio>
                    </Radio.Group>  
                </div>                           
            </div>
        )
    }

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view" style={{padding:0}}>
                    <div className="comp-buttons-view">
                        <Button className="save-draft-text" type="save-draft-text"
                            onClick={() => this.setState({ buttonPressed: "save" })}>
                            {AppConstants.saveAsDraft}
                        </Button>
                        <Button
                            className="open-reg-button"
                            htmlType="submit"
                            type="primary"
                            disabled={isSubmitting}
                            onClick={() => this.setState({ buttonPressed: "save" })}>
                            {AppConstants.next}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" >
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{ paddingLeft : 35 ,paddingRight : 35}}>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveReviewForm}
                        noValidate="noValidate"
                        className="form-review">
                        <Content>
                            <div>
                                {this.contentView(getFieldDecorator)}
                            </div>
                         <Loader visible={this.props.endUserRegistrationState.onLoad } />
                        </Content>
                        <Footer style={{paddingRight:2}}>{this.footerView()}</Footer>
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
