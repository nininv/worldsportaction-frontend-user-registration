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
import {isArrayNotEmpty} from '../../util/helpers';
import {getRegistrationByIdAction, deleteRegistrationProductAction, updateReviewInfoAction,
    saveRegistrationReview } from 
            '../../store/actions/registrationAction/registrationProductsAction';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
let this_Obj = null;


class RegistrationShipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationUniqueKey: null, 
            productModalVisible: false ,
            id: null,
            loading: false                    
        };
    }

    componentDidMount(){
        let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        this.setState({registrationUniqueKey: registrationUniqueKey});

        this.getApiInfo(registrationUniqueKey);
    }
    componentDidUpdate(nextProps){
        let registrationProductState = this.props.registrationProductState
        if(this.state.loading == true && registrationProductState.onRegReviewLoad == false){
            if(this.state.buttonPressed == "continue"){
                this.goToRegistrationPayments();
            }
        }
    }  

    getApiInfo = (registrationUniqueKey) => {
        let payload = {
            registrationId: registrationUniqueKey
        }
        console.log("payload",payload);
        this.props.getRegistrationByIdAction(payload);
    }

    goToShop = () =>{
        history.push({pathname: '/registrationShop', state: {registrationId: this.state.registrationUniqueKey}})
    }

    goToRegistrationPayments = () =>{
        history.push({pathname: '/registrationPayment', state: {registrationId: this.state.registrationUniqueKey}})
    }

    getPaymentOptionText = (paymentOptionRefId) =>{
        let paymentOptionTxt =   paymentOptionRefId == 1 ? AppConstants.payAsYou : 
        (paymentOptionRefId == 2 ? AppConstants.gameVoucher : 
        (paymentOptionRefId == 3 ? AppConstants.payfullAmount : 
        (paymentOptionRefId == 4 ? AppConstants.weeklyInstalment : 
        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration: ""))));

        return paymentOptionTxt;
    }

    removeProductModal = (key, id) =>{
        if(key == "show"){
            this.setState({productModalVisible: true, id: id});
        }
        else if(key == "ok"){
            this.setState({productModalVisible: false});
            let payload = {
                registrationId : this.state.registrationUniqueKey,
                orgRegParticipantId: this.state.id
            }
            this.props.deleteRegistrationProductAction(payload);
            this.setState({loading: true});
        }
        else if(key == "cancel"){
            this.setState({productModalVisible: false});
        }
    }

    removeFromCart = (index, key, subKey) =>{
        this.props.updateReviewInfoAction(null,key, index, subKey,null);
    }


    saveBilling = (e) =>{
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let registrationReview = this.props.registrationProductState.registrationReviewList;
                registrationReview["registrationId"] = this.state.registrationUniqueKey;
                registrationReview["key"] = "save";
                console.log("registrationReview" + JSON.stringify(registrationReview));
                this.props.saveRegistrationReview(registrationReview);
                this.setState({loading: true, buttonPressed: "continue"});
            }
        });
    }


    shippingOption = () =>{
        return(
            <div  className="outline-style product-left-view" style={{marginRight:0}}>
                <div className="headline-text-common" style={{fontSize:21 , marginBottom : 25}}>{AppConstants.shippingOptions}</div>
                <div className="subtitle-text-common">{AppConstants.netballQueenslandMerchandise}</div>
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group">                           
                        <Radio  value={1}>{AppConstants.Pickup}</Radio>
                        <Radio  value={2}>{AppConstants.Delivery}</Radio>
                    </Radio.Group>
                </div>      
                <div className="subtitle-text-common" style={{marginTop : 25}}>{AppConstants.biloelaAssociationMerchandise}</div>
                <div style={{marginTop:6}}>
                    <Radio.Group className="product-radio-group">                           
                        <Radio  value={1}>{AppConstants.Pickup}</Radio>
                        <Radio  value={2}>{AppConstants.Delivery}</Radio>
                    </Radio.Group>
                </div>     
                       
            </div>
        );

    }

    deliveryAndBillingView = () =>{
        return(
            <div className="outline-style product-left-view" style={{marginRight:0}}>
                <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.deliveryAndBillingAddress}</div>
                <div class="row">
                    <div class="col-sm-12 col-lg-6" style={{marginTop:25}}>
                        <div className="body-text-common">{AppConstants.deliveryAddress}</div>  
                        <div className="headline-text-common" style={{paddingLeft:0,margin:"6px 0px 4px 0px"}}>100 George Street Sydney NSW 2000</div>                        
                        <div className="link-text-common">{AppConstants.useDifferentAddress}</div> 
                    </div>  
                    <div class="col-sm-12 col-lg-6" style={{marginTop:25}}>
                        <div className="body-text-common">{AppConstants.billingAddress}</div>
                        <div className="headline-text-common" style={{paddingLeft:0 , margin:"6px 0px 4px 0px"}}>100 George Street Sydney NSW 2000</div>
                        <div className="link-text-common">{AppConstants.useDifferentAddress}</div> 
                    </div>  
                </div>
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
    shippingLeftView = ()=>{
        return(
            <div className="col-sm-12 col-md-7 col-lg-8" style={{cursor:"pointer"}}>
                {this.shippingOption()}
                {this.deliveryAndBillingView()}               
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

    yourOrderView = () =>{
        const {registrationReviewList} = this.props.registrationProductState;
        let compParticipants = registrationReviewList!= null ? 
                    isArrayNotEmpty(registrationReviewList.compParticipants) ?
                    registrationReviewList.compParticipants : [] : [];
        let total = registrationReviewList!= null ? registrationReviewList.total : null;
        let shopProducts = registrationReviewList!= null ? 
                isArrayNotEmpty(registrationReviewList.shopProducts) ?
                registrationReviewList.shopProducts : [] : [];
        return(
            <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                <div className="headline-text-common">
                    {AppConstants.yourOrder}
                </div>
                {(compParticipants || []).map((item, index) => {
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
                                {/* <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                                </div>  */}
                            </div>
                        ))}
                        <div style={{color: "var(--app-bbbbc6)" , fontFamily: "inter"}}>
                            {paymentOptionTxt}
                        </div>
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
                                <div>({shop.optionName})</div>                               
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
                </div>
            </div>
        )
    }

    deleteProductModalView = () => {
        return (
            <div>
              <Modal
                className="add-membership-type-modal"
                title="Registration Product"
                visible={this.state.productModalVisible}
                onOk={() => this.removeProductModal("ok")}
                onCancel={() => this.removeProductModal("cancel")}>
                  <p>{AppConstants.deleteProductMsg}</p>
              </Modal>
            </div>
          );
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
                    <Button className="back-btn-text btn-inner-view"
                    onClick={() => this.goToShop()}>
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
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveBilling}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div>
                                {this.contentView(getFieldDecorator)}
                                {this.deleteProductModalView()}
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
        getRegistrationByIdAction,
        deleteRegistrationProductAction,
        updateReviewInfoAction,
        saveRegistrationReview 	 
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        registrationProductState: state.RegistrationProductState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationShipping));
