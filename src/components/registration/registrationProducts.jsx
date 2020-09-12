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
    Radio, Form, Modal, message
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


class RegistrationProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    componentDidMount(){

    }
    componentDidUpdate(nextProps){

    }   
    headerView = () =>{
        return(
            <div className="col-sm-8" style={{display:"flex" , justifyContent:"space-between" , paddingRight:0}}>
                <div className="product-text-common" style={{fontSize: 21}}> {AppConstants.participants}</div>
                <div style={{padding: 7}}>
                    <span className="btn-text-common pointer" style={{marginRight:0}}>
                        + {AppConstants.addAnotherParticipant}
                    </span>
                </div>
            </div>
        );

    }
    participantDetailView = () =>{
        return(
            <div>
                {this.userInfoView()}
                {this.playerView()}
                {this.coachView()}
                {this.discountcodeView()}
                {this.governmentVoucherView()}
            </div>
        )
    } 
    userInfoView = () =>{
        return(
            <div>
                <div style={{display:"flex"}}>
                    <div>
                        <img src={AppImages.userIcon}/>                
                    </div>
                    <div style={{marginLeft:10}}>
                        <div className="product-text-common" style={{fontSize:21}}>John Smith</div>
                        <div className="product-text-common" style={{fontWeight:500}}>Male, 24/01/2001</div>
                    </div>
                    <div className="transfer-image-view pointer" style={{marginLeft: 'auto'}}>                   
                        <span className="btn-text-common">
                            {AppConstants.edit}
                        </span>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div> 
                    <div className="transfer-image-view pointer" style={{paddingLeft: '15px',}}>                   
                        <span className="btn-text-common">
                            {AppConstants.remove}
                        </span>
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div> 
                </div>
                <div style={{display:"flex" , marginTop:30}}>
                     <div>
                        <img src={AppImages.userIcon}/>                
                    </div>
                    <div style={{marginLeft:10}}>
                        <div className="product-text-common" style={{fontWeight:500}}>Competition</div>
                        <div className="product-text-common" style={{fontSize:21}}>NWA Winter 2020</div>
                    </div>
                </div>               
            </div>
        )
    }
    playerView = () =>{
        return(
            <div className="innerview-outline">
                <div className = "product-text-common" style={{fontWeight:500}}>
                    {AppConstants.membershipProduct}
                </div>
                <div className="product-text-common" style={{fontSize: 21 ,marginTop: "5px"}}>
                    {AppConstants.player}
                </div>
                <div className="product-text-common" style={{fontFamily: "inherit" ,marginTop: "8px"}}>
                    {AppConstants.wouldYouLikeTopay}
                </div>
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group">
                            <Radio  value={1}>{AppConstants.payAsYou}</Radio>
                            <Radio  value={2}>{AppConstants.gameVoucher}</Radio>
                            <Radio  value={3}>{AppConstants.payfullAmount}</Radio>
                            <Radio  value={4}>{AppConstants.weeklyInstalment}</Radio>
                            <Radio  value={5}>{AppConstants.schoolRegistration}</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }
    coachView = () =>{
        return(
            <div className="innerview-outline">
                <div className = "product-text-common" style={{fontWeight:500}}>
                    {AppConstants.membershipProduct}
                </div>
                <div className="product-text-common" style={{fontSize: 21 ,marginTop: "5px"}}>
                    {AppConstants.coach}
                </div>
                <div className="product-text-common" style={{fontFamily: "inherit" ,marginTop: "8px"}}>
                    {AppConstants.wouldYouLikeTopay}
                </div>
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group">
                            <Radio  value={1}>{AppConstants.payAsYou}</Radio>
                            <Radio  value={2}>{AppConstants.gameVoucher}</Radio>
                            <Radio  value={3}>{AppConstants.payfullAmount}</Radio>
                            <Radio  value={4}>{AppConstants.weeklyInstalment}</Radio>
                            <Radio  value={5}>{AppConstants.schoolRegistration}</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }
    discountcodeView = () =>{
        return(
            <div>
                <div className="product-text-common" style={{fontSize: 21 , marginTop: "5px"}}>
                    {AppConstants.discountCode}
                </div>
                <div style={{display:"flex" , marginTop: "15px" , justifyContent:"space-between"}}>
                    <div style={{ width: "100%"}}>
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            placeholder={AppConstants.discountCode}                       
                        />
                    </div>
                    <div className="transfer-image-view pointer" style={{paddingLeft: '15px',}}>                   
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>                    
                </div>
                <div style={{marginTop: "13px"}}>
                    <span className="btn-text-common pointer" style={{paddingTop: 7}}>
                        + {AppConstants.addDiscountCode}
                    </span>
                </div>                
            </div>
        )
    }
    governmentVoucherView = () =>{
        return(
            <div>
                <div className="product-text-common" style={{fontSize: 21 , marginTop: "30px"}}>
                    {AppConstants.governmentVouchers}
                </div>
                <div style={{display:"flex" , marginTop: "15px" , justifyContent:"space-between"}}>
                    <div style={{ width: "100%" , marginRight: "30px"}}>
                        <div className="product-text-common" style={{fontFamily:"inherit" , marginBottom:7}}>{AppConstants.favouriteTeam}</div>
                        <div>
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}                  
                                placeholder={AppConstants.selectVenue}                               
                            >
                                <Option value={1}>1</Option>     
                            </Select>
                        </div>
                    </div>                   
                    <div style={{ width: "100%"}}>
                        <div className="product-text-common" style={{fontFamily:"inherit" , marginBottom:7}}>{AppConstants.code}</div>
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            placeholder={AppConstants.discountCode}                       
                        />
                    </div>
                    <div className="transfer-image-view pointer" style={{paddingLeft: '15px',paddingTop:26}}>                   
                        <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>                    
                </div>
                <div style={{marginTop: "13px"}}>
                    <span className="btn-text-common pointer" style={{paddingTop: 7}}>
                        + {AppConstants.addGovernmentVoucher}
                    </span>
                </div>                
            </div>
        )
    }
    supportConfidentView = () =>{
        return(
            <div style={{marginTop: "23px"}}>                
                <div className="product-text-common" style={{fontSize: 21 ,marginTop: "5px"}}>
                    {AppConstants.supportGirlsFoundation}
                </div>
                <div className = "product-text-common" style={{fontWeight:500 ,  marginTop: "8px" ,width: "92%" }}>
                    {AppConstants.girlsFoundationDescription}
                </div>
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group">
                        <Radio  value={1}>{AppConstants.RoundUpAtLeast + " " +"$2"}</Radio>
                        <Radio  value={2}>{AppConstants.RoundUpAtLeast + " " +"$8"}</Radio>
                        <Radio  value={3}>{AppConstants.RoundUpAtLeast + " " +"$10"}</Radio>
                        <Radio  value={4}>{AppConstants.SorryNotAtTheMoment}</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }
    otherinfoView = () =>{
        return(
            <div style={{marginTop: "23px"}}>                  
            <div className="product-text-common" style={{fontSize: 21 ,marginTop: "5px"}}>
                {AppConstants.otherInformation}
            </div>
            <div className = "product-text-common" style={{fontWeight:500 ,  marginTop: "8px" ,width: "92%" , textAlign: "left"}}>
                {AppConstants.continuedSuccessOfOurClub}
            </div>
            <div style={{marginTop:6}}>
            <Checkbox className="single-checkbox">
                {AppConstants.coach}
            </Checkbox>
            </div>
        </div>
        )
    }
    contentView = () =>{
        return(
            <div style={{display:"flex"}}>
                {this.productLeftView()}
                {this.productRightView()}                
            </div>
        );
    }
    productLeftView = ()=>{
        return(
            <div className="col-sm-8 product-left-view outline-style">
                {this.participantDetailView()}
                {this.supportConfidentView()}
                {this.otherinfoView()}
            </div>
        )
    }
    productRightView = ()=>{
        return(
            <div className="product-right-view">
                {this.yourOrderView()}
                {this.termsAndConditionsView()}
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
                <div style={{borderBottom:"1px solid var(--app-e1e1f5)" , paddingBottom:12}}>
                    <div className = "product-text-common" style={{fontWeight:500 , marginTop: "17px"}}>
                        John Smith - NWA Winter 2020 - AR1
                    </div>
                    <div  className="product-text-common mt-10" style={{display:"flex"}}>
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
                    <div  className="product-text-common mr-4" style={{display:"flex" , fontWeight:500 ,}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                        <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                    </div>               
                </div>
                <div  className="product-text-common mt-10 mr-4" style={{display:"flex"}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>$123.00</div>
                </div>
            </div>
        )
    }
    termsAndConditionsView = () =>{
        return(
            <div className="termsView-main outline-style" style={{padding: "36px 20px 36px 20px"}}>
                <span className="form-heading" style={{textAlign: "left"}}> {AppConstants.termsAndConditionsHeading} </span>
                <div className="pt-2">                  
                    <div className="pb-4 btn-text-common">
                    <a  target='_blank' >
                        {AppConstants.ConditionsForNetballQLD}
                    </a>
                    </div>                   
                </div>                           
                <div className="single-checkbox mt-0" style={{display:"flex"}}>
                    <div>
                        <Checkbox></Checkbox>
                    </div>
                    <span style={{marginLeft:"5px"}}> {AppConstants.agreeTerm}</span>                   
                </div>                      
            </div>
        )
    }
    buttonView = () =>{
        return(
            <div style={{marginTop:23}}>
                 <Button className="open-reg-button" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}>
                    {AppConstants.continue}
                </Button>     
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
                    {this.headerView()}
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
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationProducts));
