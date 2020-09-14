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
    Radio, Form, Modal, InputNumber
} from "antd";
 import "./product.css";
 import "../user/user.css";
 import '../competition/competition.css';
 import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import ValidationConstants from "../../themes/validationConstant";
import { getAge,deepCopyFunction, isArrayNotEmpty, isNullOrEmptyString} from '../../util/helpers';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;


class RegistrationPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCardView:false           
        };
    }

    componentDidMount(){

    }
    componentDidUpdate(nextProps){

    }  
    
    contentView = () =>{
        return(
            <div style={{display:"flex"}}>
                {this.paymentLeftView()}
                {this.paymentRighttView()}                
            </div>
        );
    }
    paymentLeftView = ()=>{
        return(
            <div className="col-sm-8 product-left-view outline-style">              
                <div className="product-text-common" style={{fontSize:22}}>
                    {AppConstants.securePaymentOptions}
                </div>               
            </div>
        )
    }
    paymentRighttView = ()=>{
        return(
            <div className="product-right-view">
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    yourOrderView = () =>{
        return( 
        <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
            <div className="product-text-common" style={{fontSize: 21}}>
                {AppConstants.yourOrder}
            </div>
            <div style={{paddingBottom:12}}>
                <div className = "product-text-common" style={{fontWeight:500 , marginTop: "17px"}}>
                    John Smith - NWA Winter 2020 - AR1
                </div>
                <div  className="product-text-common mt-10" style={{display:"flex",fontSize:17}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.player}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>$123.00</div>
                    <div>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>
                </div>
                <div  className="product-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discounts}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                </div>
                <div style={{color: "var(--app-bbbbc6)"}}>
                    {AppConstants.payAsYou}
                </div>
                <div  className="product-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                </div>
                <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                </div>  
                <div  className="product-text-common" style={{display:"flex" , fontWeight:500 ,borderBottom:"1px solid var(--app-e1e1f5)" , borderTop:"1px solid var(--app-e1e1f5)"}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto" , display: "flex",marginTop: "12px" , padding: "8px"}}>
                        <div>
                            <img src={AppImages.userIcon}/>
                        </div>
                        <div style={{marginLeft:"6px",fontFamily:"inter-medium"}}>
                            <div>
                                {AppConstants.vixensWarmUpShirt}
                            </div>
                            <div>(X1)</div>                               
                        </div>
                    </div>
                    <div className="alignself-center pt-5" style={{fontWeight:600 , marginRight:10}}>-$20</div>
                    <div style={{paddingTop:26}}>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>
                </div>               
            </div>
            <div  className="product-text-common mt-10 mr-4" style={{display:"flex" , fontSize:17}}>
                <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                <div className="alignself-center pt-2" style={{marginRight:10}}>$123.00</div>
            </div>
        </div>
        )
    }
    buttonView = () =>{
        return(
            <div style={{marginTop:23}}>
                <div>
                    <Button className="open-reg-button" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}>
                        {AppConstants.continue}
                    </Button>
                </div>                 
                <div style={{marginTop:23}}> 
                    <Button className="back-btn-text" style={{boxShadow: "0px 1px 3px 0px" , width:"100%",textTransform: "uppercase"}}>
                        {AppConstants.back}
                    </Button> 
                </div>     
            </div>            
        )
    }
    
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout style={{margin: "32px 40px 10px 40px"}}>
                    <Form
                        // autocomplete="off"
                        // scrollToFirstError={true}
                        // onSubmit={this.saveRegistrationForm}
                        // noValidate="noValidate"
                    >
                        <Content>
                            <div>
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>
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
        
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationPayment));
