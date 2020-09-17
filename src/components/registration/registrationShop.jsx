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


class RegistrationShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCardView:false,
            registrationUniqueKey: null,          
        };
    }

    componentDidMount(){
        let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        this.setState({registrationUniqueKey: registrationUniqueKey});
    }

    componentDidUpdate(nextProps){

    }  

    getApiInfo = (registrationUniqueKey) => {
        let payload = {
            registrationId: registrationUniqueKey
        }
    }

    goToShipping = () =>{
        history.push({pathname: '/registrationShipping', state: {registrationdId: this.state.registrationUniqueKey}})
    }

    goToRegistrationProducts = () =>{
        history.push({pathname: '/registrationProducts', state: {registrationdId: this.state.registrationUniqueKey}})
    }


    

    enableExpandView = (key) =>{
        if(key == "show")
        this.setState({showCardView:true});  
        else 
        this.setState({showCardView:false}); 
    }

    headerView = () =>{
        return(
            <div style={{display:"flex" , justifyContent:"space-between" , paddingRight:0 , marginBottom: "37px",flexWrap: "wrap"}}>
                <div className="product-text-common" style={{fontSize: 22 , alignSelf:"center" , marginTop: "10px"}}> {AppConstants.merchandiseShop}</div>
                <div style={{width:"230px",marginTop: "10px"}}>
                    <Select
                        style={{ width: "100%", paddingRight: 1}}                  
                        placeholder={AppConstants.allCategories}  
                        className="custom-dropdown"                                                     
                    >
                        <Option value={1}>All categories</Option>     
                    </Select>
                </div>
            </div>
        );

    }

    cardView = () =>{
        let array = [1,2,3,4];
        return(
            <div style ={{ display: "flex" , justifyContent: "space-between" , flexWrap: "wrap"}}>
                {array.map(()=>{
                    return(
                        <div class="shop-product-text card-header-text" onClick={(e)=>this.enableExpandView("show")}>
                        <div style={{textAlign: "center"}}>
                            <img src={AppImages.userIcon}/>
                        </div>
                        <div style={{ fontFamily: "inter-medium" , fontWeight:500 ,margin:"10px 0px 10px 0px"}}>{AppConstants.vixensWarmUpShirt}</div>
                        <div>$60.00</div>
                    </div>
                    )
                })}           
            </div>
        )
    } 
  
  
    cardExpandView = () =>{
        return(
            <div class = "expand-product-text"  style={{marginTop: "23px"}}>     
                <div style={{textAlign:"right"}}>
                    <img  onClick={(e)=>this.enableExpandView("hide")} src={AppImages.crossImage}  style={{height:13 , width:13}}/>
                </div>           
                <div class="row" style={{marginTop: "17px"}}>
                    <div class="col-lg-4" style={{textAlign: "center" , marginTop: "20px"}}>
                        <img src={AppImages.userIcon}/>
                    </div>
                    <div className="col-lg-8 card-expandView-text" style={{paddingRight:"40px"}}>
                        <div style={{fontSize:23}}>{AppConstants.vixensWarmUpShirt}</div>
                        <div className ="mt-5" style={{ fontSize:15 , fontFamily: "inter-medium" , fontWeight:500}}>{AppConstants.productDescription}</div>
                        <div style={{display:"flex",justifyContent:"space-between" , flexWrap:"wrap"}}>
                            <div style={{marginTop:27}}>
                                <div>
                                    {AppConstants.selectColor}
                                </div>
                                <div style={{marginTop:7}}>
                                    <Select
                                        style={{ width: "166px", paddingRight: 1 , fontWeight: 500 ,fontSize: "17px"}}                  
                                        placeholder={AppConstants.allCategories}  
                                        className="custom-dropdown"                                                     
                                    >
                                        <Option value={1}>Blue</Option>     
                                    </Select>
                                </div>
                            </div>
                            <div style={{marginTop:27}}>
                                <div>
                                    {AppConstants.quantity}
                                </div>
                                <div style={{marginTop:7,width: "166px"}}>                                    
                                    <InputNumber  style={{fontWeight: 500 }} size="large" min={1} max={100000} defaultValue={0}  />
                                </div>
                            </div>                        
                        </div>
                        <div class = "row" style={{margin:0}}>
                            <div class = "col-lg-9 col-sm-12" style={{padding:0,marginTop:23}}>
                                <Button className="open-reg-button" style={{color:"var(--app-white)" , width:"100%", height: "53px",textTransform: "uppercase"}}>
                                    {AppConstants.addToCart}
                                </Button> 
                            </div>
                            <div class = "col-lg-3 col-sm-12" style={{padding:0,marginTop:23}}>
                                <Button className="back-btn-text" style={{boxShadow: "0px 1px 5px 0px" , width:"100%",height: "49px",textTransform: "uppercase"}}>
                                    {AppConstants.cancel}
                                </Button> 
                            </div>                       
                        </div>
                    </div>                   
                </div> 
                   
            </div>
        )
    }
    
    contentView = () =>{
        return(
            <div class="row">
                {this.shopLeftView()}
                {this.shopRightView()}                
            </div>
        );
    }

    shopLeftView = ()=>{
        return(
            <div className="col-sm-12 col-md-12 col-lg-8 product-left-view outline-style" style={{cursor:"pointer" ,padding:"26px 47px"}}>
                {this.headerView()}
                {this.cardView()}
                {this.state.showCardView &&
                    <div>
                        {this.cardExpandView()}
                    </div>                
                }
            </div>
        )
    }

    shopRightView = ()=>{
        return(
            <div className="col-lg-4 col-md-4 col-sm-12 product-right-view" style={{paddingLeft: "0px",paddingRight:0}}>
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    yourOrderView = () =>{
        return( 
        <div className="outline-style " style={{padding: "36px 20px 22px 20px"}}>
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
                    <Button className="open-reg-button" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}
                     onClick={()=> this.goToShipping()}>
                        {AppConstants.continue}
                    </Button>
                </div>                 
                <div style={{marginTop:23}}> 
                    <Button className="back-btn-text" style={{boxShadow: "0px 1px 3px 0px" , width:"100%",textTransform: "uppercase"}}
                     onClick={()=> this.goToRegistrationProducts()}>
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
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationShop));
