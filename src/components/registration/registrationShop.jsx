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
import {isArrayNotEmpty, feeIsNull} from '../../util/helpers';
import ValidationConstants from "../../themes/validationConstant";
import {getRegistrationByIdAction, deleteRegistrationProductAction,
    getRegistrationShopProductAction, updateReviewInfoAction,saveRegistrationReview } from 
            '../../store/actions/registrationAction/registrationProductsAction';
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
            productModalVisible: false ,
            id: null,
            typeId: -1,
            expandObj: null,
            variantOptionId: null,
            quantity: null,
            loading: false
        };
    }

    componentDidMount(){
        let registrationUniqueKey = this.props.location.state ? this.props.location.state.registrationId : null;
        this.setState({registrationUniqueKey: registrationUniqueKey});

        this.getApiInfo(registrationUniqueKey);
    }

    componentDidUpdate(nextProps){
        let registrationProductState = this.props.registrationProductState;
        let registrationReviewList = registrationProductState.registrationReviewList;
        if(this.state.loading == true && registrationProductState.onRegReviewLoad == false){
            // if(this.state.buttonPressed == "shop"){
            //     this.goToShipping();
            // }
            if(isArrayNotEmpty(registrationReviewList.shopProducts)){
                this.goToShipping();
            }else{
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
        this.getRegistrationProducts(registrationUniqueKey, 1, -1);
    }

    getRegistrationProducts = (registrationId, page, typeId) =>{
        
        let payload = {
            registrationId: registrationId,
            typeId: typeId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }

        this.props.getRegistrationShopProductAction(payload);
    }

    onChangeSetValue = (key, value) =>{
        this.setState({typeId: value});
        this.getRegistrationProducts(this.state.registrationUniqueKey , 1, value);
    }

    goToShipping = () =>{
        history.push({pathname: '/registrationShipping', state: {registrationId: this.state.registrationUniqueKey}})
    }

    goToRegistrationPayments = () =>{
        history.push({pathname: '/registrationPayment', state: {registrationId: this.state.registrationUniqueKey}})
    }

    goToRegistrationProducts = () =>{
        history.push({pathname: '/registrationProducts', state: {registrationId: this.state.registrationUniqueKey}})
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

    addToCart = (expandObj, varnt, key, subKey) =>{
        let variantOption = varnt.variantOptions.find(x=>x.variantOptionId == this.state.variantOptionId);
        let obj ={
            productId: expandObj.productId,
            productImgUrl: expandObj.productImgUrl,
            productName: expandObj.productName,
            variantId: varnt.variantId,
            variantOptionId: this.state.variantOptionId,
            optionName: variantOption ? variantOption.optionName : null,
            quantity: this.state.quantity,
            amount: variantOption ? (variantOption.price * this.state.quantity) : 0,
            tax: this.state.quantity * expandObj.tax,
            totalAmt: 0,
            organisationId: expandObj.organisationId,
            skuId: variantOption ? (variantOption.skuId) : 0,
            variantName: varnt.name
        }
        obj.totalAmt =  feeIsNull(obj.amount) + feeIsNull(obj.tax)
        this.props.updateReviewInfoAction(obj,key, null, subKey,null);
        this.setState({showCardView:false, expandObj: null, variantOptionId: null,
            quantity: null}); 
    }

    removeFromCart = (index, key, subKey) =>{
        this.props.updateReviewInfoAction(null,key, index, subKey,null);
    }


    saveShop = (e) =>{
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let registrationReview = this.props.registrationProductState.registrationReviewList;
                //if(isArrayNotEmpty(registrationReview.shopProducts)){
                    registrationReview["registrationId"] = this.state.registrationUniqueKey;
                    registrationReview["key"] = "continue";
                    this.callSaveRegistrationProducts("continue", registrationReview);
                // }
                // else{
                //     this.goToRegistrationPayments();
                // }
               
            }
        });
    }

    callSaveRegistrationProducts = (key, registrationReview) =>{
        registrationReview["key"] = key;
        console.log("registrationReview" + JSON.stringify(registrationReview));
        this.props.saveRegistrationReview(registrationReview);
        this.setState({loading: true, buttonPressed: key});
    }

    enableExpandView = (key, item) =>{
        if(key == "show"){
            this.setState({showCardView:true, expandObj: item,quantity: 1}); 
        } 
        else {
            this.setState({showCardView:false, expandObj: null, variantOptionId: null,
                quantity: null}); 
        }
    }

    headerView = () =>{
        const {shopProductsTypes} = this.props.registrationProductState;
        let types = shopProductsTypes ? shopProductsTypes : [];
        return(
            <div style={{display:"flex" , justifyContent:"space-between" , paddingRight:0 ,flexWrap: "wrap"}}>
                <div className="headline-text-common" style={{alignSelf:"center" , marginTop: "10px"}}> {AppConstants.merchandiseShop}</div>
                <div style={{width:"230px",marginTop: "10px"}}>
                    <Select
                        style={{ width: "100%", paddingRight: 1}}                  
                        placeholder={AppConstants.allCategories}  
                        className="custom-dropdown"
                        onChange={(e) => this.onChangeSetValue("typeId", e)}
                        value={this.state.typeId}                                               
                    >
                        <Option value={-1}>All categories</Option> 
                        {
                            (types || []).map((item, index) =>(
                                <Option key = {item.id} value={item.id}>{item.typeName}</Option> 
                            ))
                        }    
                    </Select>
                </div>
            </div>
        );

    }

    cardView = () =>{
        const {shopProductList} = this.props.registrationProductState;
        return(
            // <div style ={{ display: "flex" , flexWrap: "wrap"}}>
            //     {(shopProductList || []).map((item, index)=>{
            //         return(
            //             <div class="shop-product-text card-header-text" style={{marginRight: 20}} onClick={(e)=>this.enableExpandView("show", item)}>
            //                 <div style={{textAlign: "center" , height: "250px" , width: "188px"}}>
            //                     <img style={{width:"100%"}} src={item.productImgUrl ? item.productImgUrl : AppImages.userIcon}/>
            //                 </div>
            //                 <div class="subtitle-text-common" style={{margin:"10px 0px 10px 0px",fontWeight:500}}>{item.productName}</div>
            //                 <div class="subtitle-text-common">${ (feeIsNull(item.amount) +  feeIsNull(item.tax)).toFixed(2) }</div>
            //             </div>
            //         )
            //     })}           
            // </div>
            <div className="row">
                {(shopProductList || []).map((item, index)=> (
                    <div className="col-sm-12 col-md-4 ">
                        <div className="shop-product-text card-header-text"
                        style={{height: "240px"}}
                        onClick={(e)=>this.enableExpandView("show", item)}>
                            <div style={{display: "flex",justifyContent: "center"}}>
                                <img style={{height: "100px"}} src={item.productImgUrl ? item.productImgUrl : AppImages.userIcon}/>
                            </div>
                            <div class="subtitle-text-common" style={{margin:"10px 0px 10px 0px",fontWeight:500}}>{item.productName}</div>
                            <div class="subtitle-text-common">${ (feeIsNull(item.amount) +  feeIsNull(item.tax)).toFixed(2) }</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    } 
  
    cardExpandView = () =>{
        let expandObj = this.state.expandObj;
        console.log("expandObj", expandObj);
        var description = expandObj.description != null ? expandObj.description.replace(/<[^>]*>/g, ' ') : '';
        return(
            <div class = "expand-product-text"  style={{marginTop: "23px"}}>     
                <div style={{textAlign:"right"}}>
                    <img  onClick={(e)=>this.enableExpandView("hide")} src={AppImages.crossImage}  style={{height:13 , width:13}}/>
                </div>           
                <div class="row" style={{marginTop: "17px"}}>
                    <div class="col-lg-4 col-12" style={{textAlign: "center" , marginTop: "20px", width: "100px"}}>
                        <img style={{width: "100%" , height: "180px"}} src={expandObj.productImgUrl ? expandObj.productImgUrl : AppImages.userIcon}/>
                    </div>
                    <div className="col-lg-8" style={{paddingRight:"15px"}}>
                        <div class = "headline-text-common">{expandObj.productName}</div>
                        <div className ="mt-5 body-text-common">{description}</div>
                        {(expandObj.varients || []).map((varnt, vIndex) =>(
                            <div>
                            <div style={{display:"flex", flexWrap:"wrap"}}>
                                <div class="col-lg-6" style={{marginTop:27,padding:0}}>
                                    <div className="subtitle-text-common">
                                        {"Select " + varnt.name}
                                    </div>
                                    <div style={{marginTop:7}}>
                                        <Select
                                            style={{ padding:0}}                  
                                            placeholder={AppConstants.allCategories}  
                                            className="body-text-common col-lg-11" 
                                            value={this.state.variantOptionId}   
                                            onChange={(e)=> this.setState({variantOptionId: e})}                                                 
                                        >
                                            {(varnt.variantOptions || []).map((varOpt, vOptIndex) =>(
                                                <Option key={varOpt.variantOptionId} value={varOpt.variantOptionId}>
                                                    {varOpt.optionName}</Option>  
                                            ))}  
                                        </Select>
                                    </div>
                                </div>
                                <div style={{marginTop:27,padding:0}} className="col-lg-6">
                                    <div className="subtitle-text-common">
                                        {AppConstants.quantity}
                                    </div>
                                    <div style={{marginTop:7,fontFamily: "inter"}}>                                    
                                        <InputNumber  style={{fontWeight: 500 }} size="large" min={1} max={100000} defaultValue={0}
                                        onChange={(e)=> this.setState({quantity: e})}
                                        value= {this.state.quantity}
                                        className="col-lg-11 body-text-common"
                                        />
                                    </div>
                                </div>  
                            </div>
                            <div class = "row" style={{margin:0}}>
                                <div class = "col-lg-8 col-12" style={{padding:0,marginTop:23, marginRight: 22}}>
                                    <Button className="open-reg-button addToCart"
                                    disabled={this.state.quantity == null || this.state.variantOptionId == null}
                                    onClick={() => this.addToCart(expandObj, varnt,'addShopProduct', 'shopProducts')}>
                                        {AppConstants.addToCart}
                                    </Button> 
                                </div>
                                <div class = "col-lg-3 col-12" style={{padding:0,marginTop:23}}>
                                    <Button className="cancel-button-text" style={{height: "49px"}}
                                     onClick = {() => this.enableExpandView('hide')}>
                                        {AppConstants.cancel}
                                    </Button> 
                                </div>                       
                            </div> 
                            </div>
                        ))}
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
                                        <span className="user-remove-btn pointer" >
                                             <img  class="marginIcon" src={AppImages.removeIcon} />
                                        </span>
                                    </div>
                                </div>
                                
                                {mem.discountsToDeduct!= "0.00" && 
                                <div  className="body-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>(${mem.discountsToDeduct})</div>
                                </div>
                                }
                                {mem.childDiscountsToDeduct!= "0.00" && 
                                <div  className="body-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.familyDiscount}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>(${mem.childDiscountsToDeduct})</div>
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
                            <div style={{marginLeft:"6px"}}>
                                <div>
                                    {shop.productName}
                                </div>
                                <div>({shop.optionName}) {AppConstants.qty} : {shop.quantity}</div>                               
                            </div>
                        </div>
                        <div className="alignself-center pt-5" style={{fontWeight:600 , marginRight:10}}>${shop.totalAmt ? shop.totalAmt.toFixed(2): '0.00'}</div>
                        <div style={{paddingTop:26}} onClick ={() => this.removeFromCart(index,'removeShopProduct', 'shopProducts')}>
                            <span className="user-remove-btn pointer" >
                                <img  class="marginIcon" src={AppImages.removeIcon} />
                            </span>
                        </div>
                    </div>
                ))}
                 
                <div  className="subtitle-text-common mt-10 mr-4" style={{display:"flex"}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>${total && total.total}</div>
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
                    <Button className="open-reg-button addToCart" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}
                      htmlType="submit"
                      type="primary">
                        {AppConstants.continue}
                    </Button>
                </div>                 
                <div style={{marginTop:23}}> 
                    <Button className="back-btn-text btn-inner-view"
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
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveShop}
                        noValidate="noValidate"
                    >
                        <Content>
                        <Loader visible={this.props.registrationProductState.onRegReviewLoad} />
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
        getRegistrationShopProductAction,
        updateReviewInfoAction,
        saveRegistrationReview 
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        registrationProductState: state.RegistrationProductState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationShop));
