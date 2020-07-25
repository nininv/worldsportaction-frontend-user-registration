import React, { Component } from "react";
import {
    Layout,Breadcrumb,Input,Select,Checkbox,Button, Table,DatePicker,Radio, Form, Modal, message
} from "antd";
import {
    CardElement,
    Elements,
    useElements,
    useStripe, AuBankAccountElement,
} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


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
const stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');


class ReviewProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
        this.getReferenceData();
    }

    componentDidMount() {
        this.getApiInfo();
    }

    componentDidUpdate(nextProps){
        // let registrationState = this.props.endUserRegistrationState;
       
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
               <div style={{ marginBottom: 40}}>
                    {this.reviewProducts(getFieldDecorator)}
               </div>
               <div style={{ marginBottom: 40}}>
                    {this.securePaymentOption(getFieldDecorator)}
               </div>
            </div>
        )
    }



    reviewProducts = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        {AppConstants.reviewProducts}  
                    </div>                    
                </div>
                <div className='product-text'>
                    <div style={{marginRight:"auto"}}>
                        {AppConstants.membershipProduct} 1
                    </div>
                    <div className='dolar-text'>
                        <div style={{fontWeight: 600 , fontFamily:"inter-medium"}}>
                            $120.00
                        </div>
                        <div>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </div> 
                    </div>  
                </div>   
                <div className='membership-text' style={{marginTop:5,color: "inherit"}}>
                    <div>
                        {AppConstants.participantName}
                        {AppConstants.hyphen}
                        {AppConstants.competitionName}
                        {AppConstants.hyphen}
                        {AppConstants.divisionName}
                    </div>
                </div>  
                <div className='membership-text' style={{marginTop:2}}>
                    <div>
                        <span className="number-text-style">{AppConstants.less}</span>
                        <span>{":"+" "}</span>
                        <span>{AppConstants.discount}</span>
                    </div>                   
                    <div className='dolar-text'>
                        <div className="number-text-style">
                            $20.00
                        </div>
                    </div>  
                </div>    
                <div className='edit-header-main'>
                    <div className="text-editsection">
                        {AppConstants.payAsYou}
                    </div>
                    <div style={{ cursor: 'pointer' , textDecoration:"underline"}} className="user-remove-text mr-0 mb-1">
                        {AppConstants.edit}
                    </div>
                </div> 
                <div className='product-text'>
                    <div style={{marginRight:"auto"}}>
                        {AppConstants.membershipProduct} 2
                    </div>
                    <div className='dolar-text'>
                        <div style={{fontWeight: 600 , fontFamily:"inter-medium"}}>
                            $120.00
                        </div>
                        <div>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </div> 
                    </div>  
                </div>   
                <div className='membership-text' style={{marginTop:5,color: "inherit"}}>
                    <div>
                        {AppConstants.participantName}
                        {AppConstants.hyphen}
                        {AppConstants.competitionName}
                        {AppConstants.hyphen}
                        {AppConstants.divisionName}
                    </div>
                </div>  
                <div className='edit-header-main'>
                    <div className="text-editsection">
                        {AppConstants.gameVoucher}X3
                    </div>
                    <div style={{ cursor: 'pointer' , textDecoration:"underline"}} className="user-remove-text mr-0 mb-1">
                        {AppConstants.edit}
                    </div>
                </div>  
                <div className='text-common-spacing'>
                    <div className='review-product-membership-text' style={{marginTop:0}}>
                        <div>
                            <span className="number-text-style">{AppConstants.less}</span>
                            <span>{":"+" "}</span>
                            <span>{AppConstants.governmentSportVouchers}</span>
                        </div>
                        <div className="number-text-style">
                            $20
                        </div>
                    </div> 
                    <div className='review-product-membership-text' style={{marginTop:4}}>
                        <div>
                            <span className="number-text-style">{AppConstants.less}</span>                    
                            <span>{":"+" "}</span>                       
                            <span>{AppConstants.hardshipPlayer}</span>
                        </div>
                        <div className="number-text-style">
                            $20
                        </div>
                    </div> 
                </div>
                <div className='text-common-spacing'>
                    <div className='review-product-membership-text' style={{marginTop:0}}>
                        <div>
                            <span>{AppConstants.subTotal}</span>
                        </div>
                        <div>
                            $183.00
                        </div>
                    </div>
                    <div className='review-product-membership-text' style={{marginTop:0 , paddingTop:5}}>
                        <div>
                            <span>{AppConstants.shipping}</span>
                        </div>
                        <div>
                            $0.00
                        </div>
                    </div>  
                    <div className='review-product-membership-text' style={{marginTop:4,paddingTop:5}}>
                        <div>              
                            <span>{AppConstants.gst}</span>
                        </div>
                        <div>
                            $18.00
                        </div>
                    </div> 
                    <div className='review-product-membership-text' style={{marginTop:4 , paddingTop:5}}>
                        <div>       
                            <span>{AppConstants.charityRoundUp}</span>
                        </div>
                        <div>
                            $185.00
                        </div>
                    </div>
                </div> 
                <div className='product-text' style={{width: "97%"}}>
                    <div style={{marginRight:"auto"}}>
                        {AppConstants.totalPaymentDue} 
                    </div>
                    <div>
                        <div style={{fontWeight: 600 , fontFamily:"inter-medium"}}>
                            $120.00
                        </div>
                    </div>  
                </div>                                  
            </div>
        )
    }
    securePaymentOption = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div className = "individual-reg-view">
                <div className = "individual-header-view">
                    <div>
                        {AppConstants.securePaymentOptions}  
                    </div>                    
                </div> 
                <div style={{marginTop:30}}>
                    <Radio.Group className="reg-competition-radio" style={{marginBottom:10}}>
                        <Radio value={"1"}>{AppConstants.credit}/{AppConstants.debitCard}</Radio>   
                            <div className="card-outer-element">
                                <Elements stripe={stripePromise}>
                                    <form className='form-element'>
                                        <CardElement
                                            id="card-element"
                                            // options={CARD_ELEMENT_OPTIONS}
                                            // onChange={handleChange}
                                            className='StripeElement'
                                        />
                                    </form>       
                                </Elements>             
                            </div>
                    </Radio.Group>  
                    <Radio.Group className="reg-competition-radio" style={{marginBottom:10}}>
                        <Radio value={"1"}>{AppConstants.debitCard}</Radio>                    
                    </Radio.Group> 
                    <Radio.Group className="reg-competition-radio" style={{marginBottom:10}}>
                        <Radio value={"1"}>{AppConstants.credit}/{AppConstants.debitCard}</Radio>                    
                    </Radio.Group>   
                </div>                                                  
            </div>
        )
    }

    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view" style={{padding:0}}>
                    <div style={{display:"flex" , justifyContent:"space-between"}}>
                        <Button className="save-draft-text" type="save-draft-text"
                            onClick={() => this.setState({ buttonPressed: "save" })}>
                            {AppConstants.previous}
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
                        <Footer style={{padding:0}}>{this.footerView()}</Footer>
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

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(ReviewProducts));
