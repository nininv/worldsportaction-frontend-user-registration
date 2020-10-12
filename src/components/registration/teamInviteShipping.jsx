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
import { 
    getInviteTeamReviewProductAction
} from '../../store/actions/registrationAction/teamInviteAction';

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class TeamInviteShipping extends Component{
    constructor(props){
        super(props);
        this.state = {
            userRegId: null
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

    shippingSave = (e) => {
        try{
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){

                }
            });
        }catch(ex){
            console.log("Error in ");
        }
    }

    headerView = () => {
        try{
            return(
                <div style={{display:"flex",flexWrap: "wrap" , width:"105%"}}>
                    <div className="headline-text-common col-lg-6" style={{padding:0,marginLeft: "20px"}}> {AppConstants.participant}</div>
                </div>
            );
        }catch(ex){
            console.log("Error in headerView::"+ex);
        }
    }

    shippingOption = () =>{
        return(
            <div className="outline-style product-left-view" style={{marginRight:0}}>
                <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.shippingOptions}</div>
                {/* {this.state.shippingOptions != null && this.state.shippingOptions.map((item,index) => (
                    <div>
                        <div className="subtitle-text-common"
                        style={{marginTop: "20px"}}>{item.organisationName}</div>
                        <div style={{marginTop:6}}>
                            <Radio.Group className="product-radio-group"
                            onChange={(e) => this.onChangeSetShippingOptions(e.target.value,index)}
                            value={this.getShippingOptionValue(item.organisationId)}>                           
                                <Radio value={1}>{AppConstants.Pickup}</Radio>
                                <Radio value={2}>{AppConstants.Delivery}</Radio>
                            </Radio.Group>
                        </div>  
                        {item.pickupOrDelivery == 1 && (
                            <div style={{
                                background: "var(--app-fdfdfe)",
                                border: "1px solid var(--app-f0f0f2)",
                                borderRadius: "10px",
                                padding: "15px",
                                marginTop: "10px"
                            }}>
                                <div className="subtitle-text-common">{AppConstants.pickupAddress}</div>
                                <div style={{marginTop: "5px" }}>{item.address}, {item.suburb}, {item.postcode}, {item.state}</div>
                            </div>    
                        )}
                    </div>
                ))} */}
            </div>
        );

    }

    checkAnyDeliveryAddress = () => {
        try{
            // if(isArrayNotEmpty(this.state.shippingOptions)){
            //     let shippingOptions = [...this.state.shippingOptions];
            //     let deliveryAddress = shippingOptions.find(x => x.pickupOrDelivery == 2);
            //     if(deliveryAddress != undefined){
            //         return true;
            //     }else{
            //         return false;
            //     }
            // }
        }catch(ex){
            console.log("Error in checkAnyDeliveryAddress"+ex);
        }
    }

    deliveryAndBillingView = () =>{
        return(
            <div className="outline-style product-left-view" style={{marginRight:0}}>
                <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.deliveryAndBillingAddress}</div>
                {/* {this.state.useDiffDeliveryAddressFlag && (
                    <div style={{marginTop: "10px"}}>
                        <div className="body-text-common">{AppConstants.deliveryAddress}</div>  
                        <div className="row">
                            {participantAddresses != null && participantAddresses.map((item,index) => (
                                <div className="col-sm-12 col-md-6" 
                                onClick={() => this.addAddress(index,"deliveryAddress")}>
                                    <div className="address-border-box">
                                        <div className="headline-text-common" 
                                        style={{fontSize:21}}>{this.getAddress(item)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{marginTop: "10px"}}>
                            <span className="link-text-common"
                            onClick={() => this.setState({useDiffDeliveryAddressFlag: false})}>
                                {AppConstants.cancel}
                            </span>
                        </div>
                    </div>
                )}
                 {this.state.useDiffBillingAddressFlag && (
                    <div style={{marginTop: "10px"}}>
                        <div className="body-text-common">{AppConstants.billingAddress}</div>  
                        <div className="row">
                            {participantAddresses != null && participantAddresses.map((item,index) => (
                                <div className="col-sm-12 col-md-6" 
                                onClick={() => this.addAddress(index,"billingAddress")}>
                                    <div className="address-border-box">
                                        <div className="headline-text-common" 
                                        style={{fontSize:21}}>{this.getAddress(item)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{marginTop: "10px"}}>
                            <span className="link-text-common"
                            onClick={() => this.setState({useDiffBillingAddressFlag: false})}>
                                {AppConstants.cancel}
                            </span>
                        </div>
                    </div>
                )}
                <div class="row">
                    {!this.state.useDiffDeliveryAddressFlag && (
                        <div class="col-sm-12 col-lg-6" style={{marginTop:25}}>
                            <div className="body-text-common">{AppConstants.deliveryAddress}</div>  
                            <div className="headline-text-common" style={{paddingLeft:0,margin:"6px 0px 4px 0px"}}>{this.getAddress(deliveryAddress)}</div>   
                            {participantAddresses.length > 1 && (
                                <div className="link-text-common"
                                onClick={() => {this.setState({useDiffDeliveryAddressFlag: true})}}>{AppConstants.useDifferentAddress}</div> 
                            )}   
                        </div>  
                    )}
                    {!this.state.useDiffBillingAddressFlag && (
                         <div class="col-sm-12 col-lg-6" style={{marginTop:25}}>
                            <div className="body-text-common">{AppConstants.billingAddress}</div>
                            <div className="headline-text-common" style={{paddingLeft:0 , margin:"6px 0px 4px 0px"}}>{this.getAddress(billingAddress)}</div>
                            {participantAddresses.length > 1 && (
                                <div className="link-text-common"
                                onClick={() => {this.setState({useDiffBillingAddressFlag: true})}}>{AppConstants.useDifferentAddress}</div> 
                            )}   
                        </div>  
                    )}
                </div> */}
            </div>
        )
    } 

    shippingLeftView = ()=>{
        return(
            <div className="col-sm-12 col-md-7 col-lg-8" style={{cursor:"pointer"}}>
                {this.shippingOption()}
                {this.checkAnyDeliveryAddress() && (
                    <div>{this.deliveryAndBillingView()}</div> 
                )}               
            </div>
        )
    }

    yourOrderView = () =>{
        return(
            <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                <div className="headline-text-common">
                    {AppConstants.yourOrder}
                </div>
                {/* {(compParticipants || []).map((item, index) => {
                    let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId)
                    return(
                    <div style={{paddingBottom:12}} key={item.participantId}>
                        <div className = "body-text-common" style={{marginTop: "17px"}}>
                            {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                        </div>
                        {(item.membershipProducts || []).map((mem, memIndex) =>(
                            <div key={mem.competitionMembershipProductTypeId + "#" + memIndex}>
                                <div  className="subtitle-text-common mt-10" style={{display:"flex"}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{mem.membershipTypeName  + (mem.divisionId!= null ? ' - '+ mem.divisionName : '')}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>${mem.feesToPay}</div>
                                    <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId)}>
                                        <span className="user-remove-btn pointer">
                                            <img class="marginIcon" src={AppImages.removeIcon} />
                                        </span>
                                    </div>
                                </div>
                                
                                {mem.discountsToDeduct!= "0.00" && 
                                <div  className="body-text-common mr-4" style={{display:"flex"}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                                    <div className="alignself-center pt-2 number-text-style" style={{marginRight:10}}>(${mem.discountsToDeduct})</div>
                                </div>
                                }
                                {mem.childDiscountsToDeduct!= "0.00" && 
                                <div  className="body-text-common mr-4" style={{display:"flex"}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.familyDiscount}</div>
                                    <div className="alignself-center pt-2 number-text-style" style={{marginRight:10}}>(${mem.childDiscountsToDeduct})</div>
                                </div>
                                }
                            </div>
                        ))}
                        <div style={{color: "var(--app-bbbbc6)" , fontFamily: "inter"}}>
                            {paymentOptionTxt}
                            <span className="link-text-common pointer" 
                            onClick={() => this.goToRegistrationProducts()}
                            style={{margin: "0px 15px 0px 10px"}}>
                                {AppConstants.edit}
                            </span>
                        </div>
                        {item.governmentVoucherAmount != "0.00" && 
                        <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>(${item.governmentVoucherAmount})</div>
                        </div> 
                        }
                    </div> 
                    )}
                )}
                 {(shopProducts).map((shop, index) =>(
                    <div  className="subtitle-text-common shop-detail-text-common">
                        <div className="alignself-center pt-2 image-text-view">
                            <div>
                                <img style={{width:'50px'}} src={shop.productImgUrl ? shop.productImgUrl : AppImages.userIcon}/>
                            </div>
                            <div style={{marginLeft:"6px",fontFamily:"inter-medium"}}>
                                <div>
                                    {shop.productName}
                                </div>
                                <div>({shop.optionName}) {AppConstants.qty} : {shop.quantity}</div>                               
                            </div>
                        </div>
                        <div className="alignself-center pt-5" style={{fontWeight:600 , marginRight:10}}>${shop.totalAmt ? shop.totalAmt.toFixed(2): '0.00'}</div>
                        <div style={{paddingTop:26}} onClick ={() => this.removeFromCart(index,'removeShopProduct', 'shopProducts')}>
                            <span className="user-remove-btn pointer">
                                <img class="marginIcon" src={AppImages.removeIcon}/>
                            </span>
                        </div>
                    </div>
                ))}
                <div  className="subtitle-text-common mt-10 mr-4" style={{display:"flex"}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.targetValue}</div>
                </div> */}
            </div>
        )
    }

    buttonView = () =>{
        return(
            <div style={{marginTop:23}}>
                <div>
                    <Button className="open-reg-button addToCart"
                     htmlType="submit"
                     type="primary">
                        {AppConstants.continue}
                    </Button>
                </div>                 
                <div style={{marginTop:23}}> 
                    <Button className="back-btn-text btn-inner-view">
                        {AppConstants.back}
                    </Button> 
                </div>     
            </div>
            
        )
    }

    shippingRightView = ()=>{
        return(
            <div className="col-lg-4 col-md-4 col-sm-12 product-right-view">
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    contentView = () =>{
        return(
            <div class="row">
                {this.shippingLeftView()}
                {this.shippingRightView()}                
            </div>
        );
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
                <Layout style={{margin: "32px 40px 10px 40px"}}>
                    {this.headerView()}
                    <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.shippingSave}
                        noValidate="noValidate">
                        <Content>{this.contentView(getFieldDecorator)}</Content>
                    </Form>
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
        teamInviteState: state.teamInviteState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInviteShipping));