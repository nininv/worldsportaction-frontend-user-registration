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
import history from "../../util/history";
import { updateTeamInviteAction, saveTeamInviteReviewAction} from 
            '../../store/actions/registrationAction/teamInviteAction';
import {getRegistrationByIdAction,getRegistrationShopPickupAddressAction, getRegParticipantAddressAction} 
        from '../../store/actions/registrationAction/registrationProductsAction';
import { getCommonRefData, countryReferenceAction} from '../../store/actions/commonAction/commonAction';

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class TeamInviteShipping extends Component{
    constructor(props){
        super(props);
        this.state = {
            userRegId: null,
            registrationUniqueKey: null, 
            productModalVisible: false ,
            id: null,
            loading: false ,
            apiOnLoad: false ,
            shippingOptions: null,
            useDiffDeliveryAddressFlag: false,
            userDiffBillingAddressFlag: false,
            deliveryOrBillingAddressSelected: false    
        }

        this.props.getCommonRefData();
        this.props.countryReferenceAction();
    }

    componentDidMount(){
        try{
            let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
            console.log("Shipping::(((((((((((((((" + userRegId)
            this.setState({userRegId: userRegId});
            this.getApiInfo(userRegId);
        }catch(ex){
            console.log("Error in componentDidMount::"+ex);
        }
    }

    componentDidUpdate(){
        try{
            let teamInviteState = this.props.teamInviteState;
            let teamInviteReviewList = teamInviteState.teamInviteReviewList;
            let registrationProductState = this.props.registrationProductState
            if(this.state.loading == true && teamInviteState.onTeamInviteReviewLoad == false){
                if(this.state.buttonPressed == "continue"){
                    this.goToTeamInvitePayments();
                }
            }
            if(teamInviteState.onTeamInviteReviewLoad == false && 
                registrationProductState.pickupAddressLoad == false && this.state.apiOnLoad){
                this.setShippingOptions();
                this.setState({apiOnLoad: false});
            }
            if(teamInviteState.deliveryOrBillingAddressSelected && this.state.deliveryOrBillingAddressSelected){
                if(this.state.useDiffDeliveryAddressFlag){
                    this.setState({useDiffDeliveryAddressFlag: false});
                }else if(this.state.useDiffBillingAddressFlag){
                    this.setState({useDiffBillingAddressFlag: false});
                }
                this.setState({deliveryOrBillingAddressSelected: false});
            }
        }
        catch(ex){
            console.log("Error in componentDidUpdate::"+ex);
        }
    }

    getApiInfo = (userRegId) => {
        let registrationId = this.props.teamInviteState.registrationId;
        let payload = {
            registrationId: registrationId,
            userRegId: userRegId
        }
        console.log("payload",payload);
        this.props.getRegistrationByIdAction(payload);
        this.props.getRegistrationShopPickupAddressAction(payload);
        this.props.getRegParticipantAddressAction(payload);
        this.setState({apiOnLoad: true});
    }

    removeFromCart = (index, key, subKey) =>{
        this.props.updateReviewInfoAction(null,key, index, subKey,null);
    }

    getAddress = (addressObject) => {
        try{
            if(addressObject){
                const { stateList,countryList } = this.props.commonReducerState;
                const state = stateList.length > 0 && addressObject.stateRefId > 0
                    ? stateList.find((state) => state.id === addressObject.stateRefId).name
                    : null;
                const country = countryList.length > 0 && addressObject.countryRefId > 0
                ? countryList.find((country) => country.id === addressObject.countryRefId).name
                : null;
    
                let defaultAddress = '';
                if(addressObject.street1 && addressObject.suburb && state){
                    defaultAddress = (addressObject.street1 ? addressObject.street1 + ', ': '') + 
                    (addressObject.suburb ? addressObject.suburb + ', ': '') +
                    (addressObject.postalCode ? addressObject.postalCode + ', ': '') + 
                    (state ? state + ', ': '') +
                    (country ? country + '.': '');
                }
                return defaultAddress;
            }
        }catch(ex){
            console.log("Error in getAddress"+ex);
        }
    }


    setShippingOptions = () => {
        try{
            const {teamInviteReviewList} = this.props.teamInviteState;
            const { shopPickupAddresses } = this.props.registrationProductState;
            let shopProducts = teamInviteReviewList != null ? isArrayNotEmpty(teamInviteReviewList.shopProducts) ?
                                                                deepCopyFunction(teamInviteReviewList.shopProducts) : [] : [];
            let filteredShippingProductsAddresses = deepCopyFunction(shopPickupAddresses).filter(x => shopProducts.some(y => y.organisationId == x.organisationId));
            for(let address of filteredShippingProductsAddresses){
                address["pickupOrDelivery"] = this.getShippingOptionValue(address.organisationId);
            }
            this.setState({shippingOptions: filteredShippingProductsAddresses})
        }catch(ex){
            console.log("Error in setShippingOptions"+ex);
        }
    }

    getShippingOptionValue = (organisationId) => {
        try{
            const {teamInviteReviewList} = this.props.teamInviteState;
            let value;
            if(teamInviteReviewList.shippingOptions){
                let shippingOption = teamInviteReviewList.shippingOptions.find(x => x.organisationId == organisationId);
                if(shippingOption != undefined){
                    value = 1;
                }else{
                    value = 2;
                }
            }else{
                value = 2;
            }
            return value;
        }catch(ex){
            console.log("Error in getShippingOptionValue"+ex);
        }
    }

    onChangeSetShippingOptions = (value,index) => {
        try{
            let shippingOptions = [...this.state.shippingOptions];
            shippingOptions[index]["pickupOrDelivery"] = value;
            this.setState({shippingOptions: shippingOptions});
            console.log(shippingOptions[index].organisationId)
            if(value == 1){
                this.props.updateTeamInviteAction(shippingOptions[index].organisationId,"add", null, "shippingOptions",null);
            }else{
                this.props.updateTeamInviteAction(shippingOptions[index].organisationId,"remove", null, "shippingOptions",null);
            }
        }catch(ex){
            console.log("Error in onChangeSetShippingOptions"+ex);
        }
    }

    addAddress = (index,subKey) => {
        this.setState({deliveryOrBillingAddressSelected: true});
        this.props.updateTeamInviteAction(null,null, index, subKey,null);
    }

    checkAnyDeliveryAddress = () => {
        try{
            if(isArrayNotEmpty(this.state.shippingOptions)){
                let shippingOptions = [...this.state.shippingOptions];
                console.log(shippingOptions);
                let deliveryAddress = shippingOptions.find(x => x.pickupOrDelivery == 2);
                if(deliveryAddress != undefined){
                    return true;
                }else{
                    return false;
                }
            }
        }catch(ex){
            console.log("Error in checkAnyDeliveryAddress"+ex);
        }
    }


    shippingSave = (e) =>{
        console.log("*****************");
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let {teamInviteReviewList, registrationId} = this.props.teamInviteState;
                teamInviteReviewList["registrationId"] = registrationId;
                teamInviteReviewList["userRegId"] = this.state.userRegId;
                teamInviteReviewList["key"] = "save";
                console.log("teamInviteReviewList" + JSON.stringify(teamInviteReviewList));
                this.props.saveTeamInviteReviewAction(teamInviteReviewList);
                this.setState({loading: true, buttonPressed: "continue"});
            }
        });
    }
      

    goToShop = () =>{
        history.push({pathname: '/teamInviteShop', state: {userRegId: this.state.userRegId}})
    }

    goToTeamInvitePayments = () =>{
        history.push({pathname: '/teamInvitePayment', state: {userRegId: this.state.userRegId}})
    }

    goToTeamInviteProducts = () =>{
        history.push({pathname: '/teamInviteProductsReview', state: {userRegId: this.state.userRegId}})
    }

    getPaymentOptionText = (paymentOptionRefId) =>{
        let paymentOptionTxt =   paymentOptionRefId == 1 ? AppConstants.payAsYou : 
        (paymentOptionRefId == 2 ? AppConstants.gameVoucher : 
        (paymentOptionRefId == 3 ? AppConstants.payfullAmount : 
        (paymentOptionRefId == 4 ? AppConstants.firstInstalment : 
        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration: ""))));

        return paymentOptionTxt;
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
                {this.state.shippingOptions != null && this.state.shippingOptions.map((item,index) => (
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
                ))}
            </div>
        );

    }

    deliveryAndBillingView = () =>{
        const { registrationReviewList,participantAddresses } = this.props.registrationProductState;
        let deliveryAddress = registrationReviewList ? registrationReviewList.deliveryAddress : null;
        let billingAddress = registrationReviewList ? registrationReviewList.billingAddress : null;
        return(
            <div className="outline-style product-left-view" style={{marginRight:0}}>
                <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.deliveryAndBillingAddress}</div>
                {this.state.useDiffDeliveryAddressFlag && (
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
                </div>
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
        const {teamInviteReviewList} = this.props.teamInviteState;
        let compParticipants = teamInviteReviewList!= null ? 
                    isArrayNotEmpty(teamInviteReviewList.compParticipants) ?
                    teamInviteReviewList.compParticipants : [] : [];
        let total = teamInviteReviewList!= null ? teamInviteReviewList.total : null;
        let shopProducts = teamInviteReviewList!= null ? 
                isArrayNotEmpty(teamInviteReviewList.shopProducts) ?
                teamInviteReviewList.shopProducts : [] : [];
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
                                </div>
                                
                                {mem.discountsToDeduct!= "0.00" && 
                                <div  className="body-text-common mr-4" style={{display:"flex" , fontWeight:500}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>(${mem.discountsToDeduct})</div>
                                </div>
                                }
                            </div>
                        ))}
                        <div className="payment-option-txt">
                            {paymentOptionTxt}
                            <span className="link-text-common pointer" 
                            onClick={() => this.goToTeamInviteProducts()}
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
        saveTeamInviteReviewAction,
        updateTeamInviteAction,
        getRegistrationByIdAction,
        getRegistrationShopPickupAddressAction,
        getCommonRefData,
        countryReferenceAction,
        getRegParticipantAddressAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamInviteState: state.TeamInviteState,
        registrationProductState: state.RegistrationProductState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInviteShipping));