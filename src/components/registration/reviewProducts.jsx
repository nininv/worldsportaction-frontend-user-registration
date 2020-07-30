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
import history from "../../util/history";

import AppConstants from "../../themes/appConstants";
import "../../pages/layout.css";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Loader from '../../customComponents/loader';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppImages from "../../themes/appImages";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');


class ReviewProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationUniqueKey: null
        }
        this.getReferenceData();
    }

    componentDidMount() {
        let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        //let registrationUniqueKey = "1f8a3975-9b3f-498c-bd0b-b9414d8c68e3";
        this.setState({registrationUniqueKey: registrationUniqueKey});
        this.getApiInfo();
    }

    componentDidUpdate(nextProps){
        // let registrationState = this.props.endUserRegistrationState;
       
    }

    getApiInfo = () => {
    }
  
    getReferenceData = () => {
    }

    previousCall = () =>{
        this.setState({ buttonPressed: "previous" });
        history.push("/registrationReview", {
            registrationId: this.state.registrationUniqueKey
        })
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
                    {this.totalPaymentDue(getFieldDecorator)}
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
                    <div style = {{fontWeight:600}}>
                        {AppConstants.reviewProducts}  
                    </div>                    
                </div>
                <div className='individual-header-view' style={{marginTop:40}}>
                    <div>
                        {AppConstants.individualRegistration}
                        {AppConstants.hyphen}
                        {AppConstants.participantName}
                        {AppConstants.hyphen}
                        {AppConstants.competitionName}
                    </div>
                </div>  
                <div className='product-text'>
                    <div style={{marginRight:"auto"}}>
                        {AppConstants.membershipProduct} 1
                    </div>
                    <div className='dolar-text'>
                        <div style={{fontWeight: 600 , fontFamily:"inter-medium",marginRight:20}}>
                            $120
                        </div>
                        <div>
                            <img
                                src={AppImages.removeIcon}
                                height="18"
                                width="14"
                                name={'image'}                              
                            />
                        </div> 
                    </div>  
                </div>   
                <div className='membership-text' style={{marginTop:2}}>
                    <div>
                        <span className="number-text-style">{AppConstants.less}</span>
                        <span>{":"+" "}</span>
                        <span>{AppConstants.discount}</span>
                    </div>                   
                    <div className='dolar-text'>
                        <div className="number-text-style" style={{marginRight:34}}>
                        ($20)
                        </div>
                    </div>  
                </div>    
                <div className='product-text'>
                    <div style={{marginRight:"auto"}}>
                        {AppConstants.membershipProduct} 2
                    </div>
                    <div className='dolar-text'>
                        <div style={{fontWeight: 600 , fontFamily:"inter-medium",marginRight:20}}>
                            $40
                        </div>
                        <div>
                            <img
                                src={AppImages.removeIcon}
                                // onClick={createPdf}
                                // style={{marginTop:12,cursor:"pointer"}}
                                height="18"
                                width="14"
                                name={'image'}
                                // onError={ev => {
                                //      ev.target.src = AppImages.printImage;
                                // }}    
                            />
                        </div> 
                    </div>  
                </div>   
                <div className='membership-text' style={{marginTop:5,color: "inherit"}}>
                </div>  
                <div className='edit-header-main'>
                    <div className="text-editsection">
                        {AppConstants.payAsYou}
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
            </div>
        )
    }
    
    totalPaymentDue = (getFieldDecorator) => {
        let registrationState = this.props.endUserRegistrationState;
        return (
            <div className = "individual-reg-view"> 
             <div className = "individual-header-view">
                    <div>
                        {AppConstants.total}  
                    </div>                    
                </div>            
                <div className='text-common-spacing' style={{borderBottom: "1.5px solid var(--app-4b4c6d)"}}>
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
                <div className='product-text' style={{width: "97%",marginTop: 22,marginBottom:22}}>
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
                <div style={{marginTop:40}}>
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
                            onClick={() => this.previousCall()}>
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
