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
import {isArrayNotEmpty,deepCopyFunction} from '../../util/helpers';
import {getRegistrationByIdAction, deleteRegistrationProductAction, updateReviewInfoAction,
    saveRegistrationReview, getRegistrationShopPickupAddressAction, getRegParticipantAddressAction
 } from
            '../../store/actions/registrationAction/registrationProductsAction';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import {
    getCommonRefData,
    countryReferenceAction
} from '../../store/actions/commonAction/commonAction';
import Tooltip from 'react-png-tooltip';

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
            loading: false ,
            apiOnLoad: false ,
            shippingOptions: [],
            useDiffDeliveryAddressFlag: false,
            userDiffBillingAddressFlag: false,
            deliveryOrBillingAddressSelected: false,
            onlyDeliveryAddressFlag: false,
            deliveryAddressManualEnterAddressFlag: false,
            billingAddressManualEnterAddressFlag: false
        };
        this.props.getCommonRefData();
        this.props.countryReferenceAction();
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
        if(registrationProductState.onRegReviewLoad == false &&
            registrationProductState.pickupAddressLoad == false && this.state.apiOnLoad){
            this.setShippingOptions();
            this.setState({apiOnLoad: false});
        }
        // if(registrationProductState.deliveryOrBillingAddressSelected && this.state.deliveryOrBillingAddressSelected){
        //     if(this.state.useDiffDeliveryAddressFlag){
        //         this.setState({useDiffDeliveryAddressFlag: false});
        //     }else if(this.state.useDiffBillingAddressFlag){
        //         this.setState({useDiffBillingAddressFlag: false});
        //     }
        //     this.setState({deliveryOrBillingAddressSelected: false});
        // }
    }

    getApiInfo = (registrationUniqueKey) => {
        let payload = {
            registrationId: registrationUniqueKey
        }
        console.log("payload",payload);
        this.props.getRegistrationByIdAction(payload);
        this.props.getRegistrationShopPickupAddressAction(payload);
        this.props.getRegParticipantAddressAction(payload);
        this.setState({apiOnLoad: true});
    }

    // setShippingOptions = () => {
    //     try{
    //         const { registrationReviewList,shopPickupAddresses } = this.props.registrationProductState;
    //         let shopProducts = registrationReviewList != null ? isArrayNotEmpty(registrationReviewList.shopProducts) ?
    //                                                             deepCopyFunction(registrationReviewList.shopProducts) : [] : [];
    //         let filteredShippingProductsAddresses = deepCopyFunction(shopPickupAddresses).filter(x => shopProducts.some(y => y.organisationId == x.organisationId));
    //         if(filteredShippingProductsAddresses.length > 0){
    //             for(let address of filteredShippingProductsAddresses){
    //                 address["pickupOrDelivery"] = this.getShippingOptionValue(address.organisationId);
    //             }
    //             this.setState({shippingOptions: filteredShippingProductsAddresses});
    //             this.setState({onlyDeliveryAddressFlag : false});
    //         }else{
    //             this.setState({onlyDeliveryAddressFlag : true});
    //         }
    //     }catch(ex){
    //         console.log("Error in setShippingOptions"+ex);
    //     }
    // }

    setShippingOptions = () => {
        try{
            const { registrationReviewList,shopProductList,shopPickupAddresses } = this.props.registrationProductState;
            let shopProducts = registrationReviewList != null ? isArrayNotEmpty(registrationReviewList.shopProducts) ?
                                      deepCopyFunction(registrationReviewList.shopProducts) : [] : [];
            for(let item of shopProducts){
                let buyingProduct = shopProductList.find(x => x.productId == item.productId);
                if(buyingProduct){
                    buyingProduct["organisationId"] = item.organisationId;
                    let pickupAddress = shopPickupAddresses.find(x => x.organisationId == item.organisationId);
                    if(pickupAddress){
                        buyingProduct["pickupAddress"] = `${pickupAddress.address}, ${pickupAddress.suburb}, ${pickupAddress.postcode}, ${pickupAddress.state}.`;
                        buyingProduct["pickupInstruction"] = pickupAddress.pickupInstruction;
                    }
                    this.state.shippingOptions.push(buyingProduct);
                }
            }
        }catch(ex){
            console.log("Error in setShippingOptions::"+ex);
        }
    }

    goToShop = () =>{
        history.push({pathname: '/registrationShop', state: {registrationId: this.state.registrationUniqueKey}})
    }

    goToRegistrationPayments = () =>{
        history.push({pathname: '/registrationPayment', state: {registrationId: this.state.registrationUniqueKey}})
    }

    goToRegistrationProducts = () =>{
        history.push({pathname: '/registrationProducts', state: {registrationId: this.state.registrationUniqueKey}})
    }

    getPaymentOptionText = (paymentOptionRefId , isTeamRegistration) =>{
        let paymentOptionTxt =   paymentOptionRefId == 1 ? (isTeamRegistration == 1 ? AppConstants.payEachMatch : AppConstants.oneMatchOnly) :
        (paymentOptionRefId == 2 ? AppConstants.gameVoucher :
        (paymentOptionRefId == 3 ? AppConstants.allMatches :
        (paymentOptionRefId == 4 ? AppConstants.firstInstalment :
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

    getShippingOptionValue = (organisationId) => {
        try{
            const { registrationReviewList } = this.props.registrationProductState;
            let value;
            if(registrationReviewList.shippingOptions){
                let shippingOption = registrationReviewList.shippingOptions.find(x => x.organisationId == organisationId);
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

    // onChangeSetShippingOptions = (value,index) => {
    //     try{
    //         let shippingOptions = [...this.state.shippingOptions];
    //         shippingOptions[index]["pickupOrDelivery"] = value;
    //         this.setState({shippingOptions: shippingOptions});
    //         console.log(shippingOptions[index].organisationId)
    //         if(value == 1){
    //             this.props.updateReviewInfoAction(shippingOptions[index].organisationId,"add", null, "shippingOptions",null);
    //         }else{
    //             this.props.updateReviewInfoAction(shippingOptions[index].organisationId,"remove", null, "shippingOptions",null);
    //         }
    //     }catch(ex){
    //         console.log("Error in onChangeSetShippingOptions"+ex);
    //     }
    // }

    addAddress = (index,subKey) => {
        this.setState({deliveryOrBillingAddressSelected: true});
        this.props.updateReviewInfoAction(null,null, index, subKey,null);
    }

    onChangeSetAddressValue = (value,key,subKey) => {
        this.props.updateReviewInfoAction(value,key, null, subKey,null);
    }

    // checkAnyDeliveryAddress = () => {
    //     try{
    //         if(isArrayNotEmpty(this.state.shippingOptions)){
    //             let shippingOptions = [...this.state.shippingOptions];
    //             console.log(shippingOptions);
    //             let deliveryAddress = shippingOptions.find(x => x.pickupOrDelivery == 2);
    //             if(deliveryAddress != undefined){
    //                 return true;
    //             }else{
    //                 return false;
    //             }
    //         }
    //     }catch(ex){
    //         console.log("Error in checkAnyDeliveryAddress"+ex);
    //     }
    // }

    checkAnyDeliveryAddress = () => {
        try{
            if(isArrayNotEmpty(this.state.shippingOptions)){
                let shippingOptions = [...this.state.shippingOptions];
                let deliveryAddress = shippingOptions.find(x => x.deliveryType == "shipping" || x.deliveryType == "");
                if(deliveryAddress){
                    return true;
                }else{
                    return false;
                }
            }
        }catch(ex){
            console.log("Error in checkAnyDeliveryAddress"+ex);
        }
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
            <div style={{marginBottom: 23}}>
                <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.shippingOptions}</div>
                {this.state.shippingOptions != null && this.state.shippingOptions.map((item,index) => (
                    <div>
                        <div className="subtitle-text-common"
                        style={{marginTop: "20px"}}>{item.productName}</div>
                         
                        {/* {item.deliveryType != ""&&( */}
                        <div style={{marginTop:6}}>
                            <Radio.Group className="product-radio-group"
                            onChange={(e) => this.onChangeSetShippingOptions(e.target.value,index)}
                            value={item.deliveryType == "pickup" ? 1:item.deliveryType == "shipping"?2:null }>
                                <Radio disabled={(item.deliveryType == "pickup" && item.deliveryType != "") ? false : true} value={1}>{AppConstants.Pickup}</Radio>
                                <Radio disabled={(item.deliveryType == "shipping" && item.deliveryType != "") ? false : true} value={2}>{AppConstants.Delivery}</Radio>
                            </Radio.Group>
                        </div>
                        {item.deliveryType == ""&&(
                     <div className="orange-action-txt mt-2">{AppConstants.noPickupMessage}</div>

                        )}
                       {/* )} */}
                        {item.deliveryType == "pickup" && (
                            <div style={{
                                background: "var(--app-fdfdfe)",
                                border: "1px solid var(--app-f0f0f2)",
                                borderRadius: "10px",
                                padding: "15px",
                                marginTop: "10px"
                            }}>
                                <div className="subtitle-text-common">{AppConstants.pickupAddress}</div>
                                {/* <div style={{marginTop: "-5px"}}>
                                    <Tooltip placement="top">
                                        <span>{item.pickupInstruction}</span>
                                    </Tooltip>
                                </div> */}
                                <div style={{ marginTop: "5px" }}>{item.pickupAddress}</div>
                                {item.pickupInstruction && (
                                    <>
                                        <div className="subtitle-text-common" style={{ marginTop: "5px" }}>{AppConstants.pickupInstruction}</div>
                                        <div style={{ marginTop: "5px" }}>{item.pickupInstruction}</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );

    }


    // shippingOption = () =>{
    //     return(
    //         <div className="outline-style product-left-view" style={{marginRight:0}}>
    //             <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.shippingOptions}</div>
    //             {this.state.shippingOptions != null && this.state.shippingOptions.map((item,index) => (
    //                 <div>
    //                     <div className="subtitle-text-common"
    //                     style={{marginTop: "20px"}}>{item.organisationName}</div>
    //                     <div style={{marginTop:6}}>
    //                         <Radio.Group className="product-radio-group"
    //                         onChange={(e) => this.onChangeSetShippingOptions(e.target.value,index)}
    //                         value={this.getShippingOptionValue(item.organisationId)}>
    //                             <Radio value={1}>{AppConstants.Pickup}</Radio>
    //                             <Radio value={2}>{AppConstants.Delivery}</Radio>
    //                         </Radio.Group>
    //                     </div>
    //                     {item.pickupOrDelivery == 1 && (
    //                         <div style={{
    //                             background: "var(--app-fdfdfe)",
    //                             border: "1px solid var(--app-f0f0f2)",
    //                             borderRadius: "10px",
    //                             padding: "15px",
    //                             marginTop: "10px"
    //                         }}>
    //                             <div style={{display: "flex"}}>
    //                                 <div className="subtitle-text-common">{AppConstants.pickupAddress}</div>
    //                                 <div style={{marginTop: "-5px"}}>
    //                                     <Tooltip placement="top">
    //                                         <span>{item.pickupInstruction}</span>
    //                                     </Tooltip>
    //                                 </div>
    //                             </div>
    //                             <div style={{marginTop: "5px" }}>{item.address}, {item.suburb}, {item.postcode}, {item.state}</div>
    //                         </div>
    //                     )}
    //                 </div>
    //             ))}
    //         </div>
    //     );

    // }



    // deliveryAndBillingView = () =>{
    //     const { registrationReviewList,participantAddresses } = this.props.registrationProductState;
    //     let deliveryAddress = registrationReviewList ? registrationReviewList.deliveryAddress : null;
    //     let billingAddress = registrationReviewList ? registrationReviewList.billingAddress : null;
    //     return(
    //         <div className="outline-style product-left-view" style={{marginRight:0}}>
    //             <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.deliveryAndBillingAddress}</div>
    //             {this.state.useDiffDeliveryAddressFlag && (
    //                 <div style={{marginTop: "10px"}}>
    //                     <div className="body-text-common">{AppConstants.deliveryAddress}</div>
    //                     <div className="row">
    //                         {participantAddresses != null && participantAddresses.map((item,index) => (
    //                             <div className="col-sm-12 col-md-6"
    //                             onClick={() => this.addAddress(index,"deliveryAddress")}>
    //                                 <div className="address-border-box">
    //                                     <div className="headline-text-common"
    //                                     style={{fontSize:21}}>{this.getAddress(item)}</div>
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                     <div style={{marginTop: "10px"}}>
    //                         <span className="link-text-common"
    //                         onClick={() => this.setState({useDiffDeliveryAddressFlag: false})}>
    //                             {AppConstants.cancel}
    //                         </span>
    //                     </div>
    //                 </div>
    //             )}
    //              {this.state.useDiffBillingAddressFlag && (
    //                 <div style={{marginTop: "10px"}}>
    //                     <div className="body-text-common">{AppConstants.billingAddress}</div>
    //                     <div className="row">
    //                         {participantAddresses != null && participantAddresses.map((item,index) => (
    //                             <div className="col-sm-12 col-md-6"
    //                             onClick={() => this.addAddress(index,"billingAddress")}>
    //                                 <div className="address-border-box">
    //                                     <div className="headline-text-common"
    //                                     style={{fontSize:21}}>{this.getAddress(item)}</div>
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                     <div style={{marginTop: "10px"}}>
    //                         <span className="link-text-common"
    //                         onClick={() => this.setState({useDiffBillingAddressFlag: false})}>
    //                             {AppConstants.cancel}
    //                         </span>
    //                     </div>
    //                 </div>
    //             )}
    //             <div class="row">
    //                 {!this.state.useDiffDeliveryAddressFlag && (
    //                     <div class="col-sm-12 col-lg-6" style={{marginTop:25}}>
    //                         <div className="body-text-common">{AppConstants.deliveryAddress}</div>
    //                         <div className="headline-text-common" style={{paddingLeft:0,margin:"6px 0px 4px 0px"}}>{this.getAddress(deliveryAddress)}</div>
    //                         {participantAddresses.length > 1 && (
    //                             <div className="link-text-common"
    //                             onClick={() => {this.setState({useDiffDeliveryAddressFlag: true})}}>{AppConstants.useDifferentAddress}</div>
    //                         )}
    //                     </div>
    //                 )}
    //                 {!this.state.useDiffBillingAddressFlag && (
    //                      <div class="col-sm-12 col-lg-6" style={{marginTop:25}}>
    //                         <div className="body-text-common">{AppConstants.billingAddress}</div>
    //                         <div className="headline-text-common" style={{paddingLeft:0 , margin:"6px 0px 4px 0px"}}>{this.getAddress(billingAddress)}</div>
    //                         {participantAddresses.length > 1 && (
    //                             <div className="link-text-common"
    //                             onClick={() => {this.setState({useDiffBillingAddressFlag: true})}}>{AppConstants.useDifferentAddress}</div>
    //                         )}
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //     )
    // }

    getAddressDropDownValue = (address) => {
        try{
            const { participantAddresses } = this.props.registrationProductState;
            let addressTemp = participantAddresses.find(x => this.getAddress(x) == address);
            let index = null;
            if(addressTemp){
                index = participantAddresses.indexOf(addressTemp);
            }
            return index;
        }catch(ex){
            console.log("Error in getAddressDropDownValue::"+ex)
        }
    }

    showAddressSection = (addressType) => {
        try{
            if(addressType == 1){
                this.setState({billingAddressManualEnterAddressFlag: !this.state.billingAddressManualEnterAddressFlag})
            }else{
                this.setState({deliveryAddressManualEnterAddressFlag: !this.state.deliveryAddressManualEnterAddressFlag})
            }
        }catch(ex){
            console.log("Exception occured in showAddressSection::"+ex);
        }
    }


    billingManualEnterAddressView = (getFieldDecorator) => {
        try{
            const { registrationReviewList,participantAddresses } = this.props.registrationProductState;
            let billingAddress = registrationReviewList ? registrationReviewList.billingAddress : null;
            const { stateList, countryList } = this.props.commonReducerState;
            return(
                <div>
                    <div className="orange-action-txt" style={{marginBottom: "10px",marginTop: 20 }}
                    onClick={() => this.showAddressSection(1)}>{AppConstants.returnToSelectAddress}</div>
                    <div className="form-heading" style={{ paddingBottom: "0px" }}>{AppConstants.enterAddress}</div>
                    <Form.Item>
                        {getFieldDecorator(`baStreet1`, {
                            rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                        })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                onChange={(e) => this.onChangeSetAddressValue(e.target.value, "street1", "enterManualBillingAddress")}
                                //setFieldsValue={parent.street1}
                            />
                        )}
                    </Form.Item>
                    <InputWithHead
                        heading={AppConstants.addressTwo}
                        placeholder={AppConstants.addressTwo}
                        onChange={(e) => this.onChangeSetAddressValue(e.target.value, "street2", "enterManualBillingAddress")}
                        value={billingAddress.street2}
                    />
                    <InputWithHead heading={AppConstants.suburb} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`baSuburb`, {
                            rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                        })(
                            <InputWithHead
                                placeholder={AppConstants.suburb}
                                onChange={(e) => this.onChangeSetAddressValue(e.target.value, "suburb", "enterManualBillingAddress")}
                                // setFieldsValue={parent.suburb}
                            />
                        )}
                    </Form.Item>
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <InputWithHead heading={AppConstants.state} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`baStateRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.state}
                                        onChange={(e) => this.onChangeSetAddressValue(e, "stateRefId", "enterManualBillingAddress")}
                                        // setFieldsValue={parent.stateRefId}
                                        >
                                        {stateList.length > 0 && stateList.map((item) => (
                                            < Option key={item.id} value={item.id}> {item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <InputWithHead heading={AppConstants.postCode} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`baPostalCode`, {
                                    rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        placeholder={AppConstants.postcode}
                                        onChange={(e) => this.onChangeSetAddressValue(e.target.value, "postalCode", "enterManualBillingAddress")}
                                        // setFieldsValue={parent.postalCode}
                                        maxLength={4}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    <InputWithHead heading={AppConstants.country} required={"required-field"} />
                    <Form.Item >
                        {getFieldDecorator(`baCountryRefId`, {
                            rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                        })(
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.country}
                                onChange={(e) => this.onChangeSetAddressValue(e, "countryRefId", "enterManualBillingAddress")}
                                // setFieldsValue={parent.countryRefId}
                                >
                                {countryList.length > 0 && countryList.map((item) => (
                                    < Option key={item.id} value={item.id}> {item.description}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </div>
            )
        }catch(ex){
            console.log("Error in billingManualEnterAddressView::"+ex);
        }
    }

    deliveryManualEnterAddressView = (getFieldDecorator) => {
        try{
            const { registrationReviewList,participantAddresses } = this.props.registrationProductState;
            let deliveryAddress = registrationReviewList ? registrationReviewList.deliveryAddress : null;
            const { stateList, countryList } = this.props.commonReducerState;
            return(
                <div>
                    <div className="orange-action-txt" style={{marginBottom: "10px",marginTop: 20 }}
                    onClick={() => this.showAddressSection(2)}>{AppConstants.returnToSelectAddress}</div>
                    <div className="form-heading" style={{ paddingBottom: "0px" }}>{AppConstants.enterAddress}</div>
                    <Form.Item>
                        {getFieldDecorator(`baStreet1`, {
                            rules: [{ required: true, message: ValidationConstants.addressField[0] }],
                        })(
                            <InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                onChange={(e) => this.onChangeSetAddressValue(e, "countryRefId", "enterManualDeliveryAddress")}
                                //setFieldsValue={parent.street1}
                            />
                        )}
                    </Form.Item>
                    <InputWithHead
                        heading={AppConstants.addressTwo}
                        placeholder={AppConstants.addressTwo}
                        onChange={(e) => this.onChangeSetAddressValue(e.target.value, "street2",  "enterManualDeliveryAddress")}
                        value={deliveryAddress.street2}
                    />
                    <InputWithHead heading={AppConstants.suburb} required={"required-field"} />
                    <Form.Item>
                        {getFieldDecorator(`baSuburb`, {
                            rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                        })(
                            <InputWithHead
                                placeholder={AppConstants.suburb}
                                onChange={(e) => this.onChangeSetAddressValue(e.target.value, "suburb", "enterManualDeliveryAddress")}
                                // setFieldsValue={parent.suburb}
                            />
                        )}
                    </Form.Item>
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <InputWithHead heading={AppConstants.state} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`baStateRefId`, {
                                    rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                                })(
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={AppConstants.state}
                                        onChange={(e) => this.onChangeSetAddressValue(e, "stateRefId", "enterManualDeliveryAddress")}
                                        // setFieldsValue={parent.stateRefId}
                                        >
                                        {stateList.length > 0 && stateList.map((item) => (
                                            < Option key={item.id} value={item.id}> {item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <InputWithHead heading={AppConstants.postCode} required={"required-field"} />
                            <Form.Item>
                                {getFieldDecorator(`baPostalCode`, {
                                    rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                                })(
                                    <InputWithHead
                                        required={"required-field pt-0 pb-0"}
                                        placeholder={AppConstants.postcode}
                                        onChange={(e) => this.onChangeSetAddressValue(e.target.value, "postalCode", "enterManualDeliveryAddress")}
                                        // setFieldsValue={parent.postalCode}
                                        maxLength={4}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    <InputWithHead heading={AppConstants.country} required={"required-field"} />
                    <Form.Item >
                        {getFieldDecorator(`baCountryRefId`, {
                            rules: [{ required: true, message: ValidationConstants.countryField[0] }],
                        })(
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.country}
                                onChange={(e) => this.onChangeSetAddressValue(e, "countryRefId", "enterManualDeliveryAddress")}
                                // setFieldsValue={parent.countryRefId}
                                >
                                {countryList.length > 0 && countryList.map((item) => (
                                    < Option key={item.id} value={item.id}> {item.description}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </div>
            )
        }catch(ex){
            console.log("Error in billingManualEnterAddressView::"+ex);
        }
    }

    deliveryAndBillingView = (getFieldDecorator) => {
        try{
            const { registrationReviewList,participantAddresses } = this.props.registrationProductState;
            let deliveryAddress = registrationReviewList ? registrationReviewList.deliveryAddress : null;
            let billingAddress = registrationReviewList ? registrationReviewList.billingAddress : null;
            return(
                <div>
                    <div className="headline-text-common" style={{fontSize:21}}>{AppConstants.deliveryAndBillingAddress}</div>
                    <div className="body-text-common" style={{marginTop: 20}}>{AppConstants.billingAddress}</div>
                    {!this.state.billingAddressManualEnterAddressFlag ? (
                        <div>
                            <Select
                                style={{ width: "100%",marginTop: 10 }}
                                placeholder={AppConstants.select}
                                onChange={(e) => this.addAddress(e,"billingAddress")}
                                value={this.getAddressDropDownValue(this.getAddress(billingAddress))}>
                                {(participantAddresses || []).map((address,addressIndex) => (
                                    <Option key={"BillingAddress"+addressIndex} value={addressIndex}> {this.getAddress(address)}</Option>
                                ))}
                            </Select>
                            <div className="orange-action-txt" style={{marginTop: 10}}
                            onClick={() => this.showAddressSection(1)}>
                                {AppConstants.enterAddressManually}
                            </div>
                        </div>
                    ) : (
                        <div>{this.billingManualEnterAddressView(getFieldDecorator)}</div>
                    )}
                    <div className="body-text-common" style={{marginTop: 20}}>{AppConstants.deliveryAddress}</div>
                    {!this.state.deliveryAddressManualEnterAddressFlag ? (
                        <div>
                            <Select
                                style={{ width: "100%",marginTop: 10 }}
                                placeholder={AppConstants.select}
                                onChange={(e) => this.addAddress(e,"deliveryAddress")}
                                value={this.getAddressDropDownValue(this.getAddress(deliveryAddress))}>
                                {(participantAddresses || []).map((address,addressIndex) => (
                                    <Option key={"DeliveryAddress"+addressIndex} value={addressIndex}> {this.getAddress(address)}</Option>
                                ))}
                            </Select>
                            <div className="orange-action-txt" style={{marginTop: 10}}
                             onClick={() => this.showAddressSection(2)}>
                                    {AppConstants.enterAddressManually}
                            </div>
                        </div>
                    ) : (
                        <div>{this.deliveryManualEnterAddressView(getFieldDecorator)}</div>
                    )}
                </div>
            )
        }catch(ex){
            console.log("Error in deliveryAndBillingAddressView::"+ex)
        }
    }


    contentView = (getFieldDecorator) =>{
        return(
            <div class="row m-0">
                {this.shippingLeftView(getFieldDecorator)}
                {this.shippingRightView()}
            </div>
        );
    }
    shippingLeftView = (getFieldDecorator)=>{
        return(
            <div className="col-sm-12 col-md-7 col-lg-8 p-0" style={{ marginBottom: 23 }}>
                <div className="mt-0 product-left-view outline-style">
                {this.state.onlyDeliveryAddressFlag == false && (
                    <div>{this.shippingOption()}</div>
                )}
                {/* {(this.checkAnyDeliveryAddress() || this.state.onlyDeliveryAddressFlag == true) && (
                    <div>{this.deliveryAndBillingView(getFieldDecorator)}</div>
                )} */}
                </div>
            </div>
        )
    }
    shippingRightView = ()=>{
        return(
            <div className="col-lg-4 col-md-4 col-sm-12 product-right-view px-0 mt-0">
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
                    let paymentOptionTxt = this.getPaymentOptionText(item.selectedOptions.paymentOptionRefId , item.isTeamRegistration)
                    return(
                    <div style={{paddingBottom:12}} key={item.participantId}>
                       {item.isTeamRegistration == 1  ?
                            <div className = "inter-medium-w500" style={{marginTop: "17px"}}>
                                {item.teamName +' - ' + item.competitionName}
                            </div> :
                            <div className = "inter-medium-w500" style={{marginTop: "17px"}}>
                            {item.firstName + ' ' + item.lastName + ' - ' + item.competitionName}
                            </div>
                        }
                        {(item.membershipProducts || []).map((mem, memIndex) =>(
                            <div key={mem.competitionMembershipProductTypeId + "#" + memIndex}>
                                {item.isTeamRegistration == 1 ?
                                <div>
                                    <div className="subtitle-text-common mt-10" > {mem.firstName + ' ' + mem.lastName }</div>
                                    <div  className="subtitle-text-common" style={{display:"flex"}}>
                                        <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{mem.membershipTypeName  + (mem.divisionId!= null ? ' - '+ mem.divisionName : '')}</div>
                                        <div className="alignself-center pt-2" style={{marginRight:10}}>${mem.feesToPay}</div>
                                        <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId)}>
                                            <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div  className="subtitle-text-common mt-10" style={{display:"flex"}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{mem.membershipTypeName  + (mem.divisionId!= null ? ' - '+ mem.divisionName : '')}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>${mem.feesToPay}</div>
                                    <div onClick={() => this.removeProductModal("show", mem.orgRegParticipantId)}>
                                        <span className="user-remove-btn pointer" ><img class="marginIcon" src={AppImages.removeIcon} /></span>
                                    </div>
                                </div>
                                }

                                {mem.discountsToDeduct!= "0.00" &&
                                <div  className="body-text-common mr-4" style={{display:"flex"}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.discount}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>- ${mem.discountsToDeduct}</div>
                                </div>
                                }
                                {mem.childDiscountsToDeduct!= "0.00" &&
                                <div  className="body-text-common mr-4" style={{display:"flex"}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.familyDiscount}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>- ${mem.childDiscountsToDeduct}</div>
                                </div>
                                }
                                {/* <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>-$20</div>
                                </div>  */}
                            </div>
                        ))}
                        <div className="payment-option-txt">
                            {paymentOptionTxt}
                            <span className="link-text-common pointer"
                            onClick={() => this.goToRegistrationProducts()}
                            style={{margin: "0px 15px 0px 20px"}}>
                                {AppConstants.edit}
                            </span>
                        </div>
                        {item.governmentVoucherAmount != "0.00" &&
                        <div  className="product-text-common mr-4 pb-4" style={{display:"flex" , fontWeight:500 ,}}>
                            <div className="alignself-center pt-2" style={{marginRight:"auto"}}> {AppConstants.governmentSportsVoucher}</div>
                            <div className="alignself-center pt-2" style={{marginRight:10}}>- ${item.governmentVoucherAmount}</div>
                        </div>
                        }
                    </div>
                    )}
                )}
                 {(shopProducts).map((shop, index) =>(
                    <div  className="subtitle-text-common shop-detail-text-common inter-medium-w500">
                        <div className="alignself-center pt-2 image-text-view">
                            <div>
                                <img style={{width:'50px'}} src={shop.productImgUrl ? shop.productImgUrl : AppImages.userIcon}/>
                            </div>
                            <div style={{marginLeft:"6px",fontFamily:"inter-medium"}}>
                                <div>
                                    {shop.productName}
                                </div>
                                <div>{shop.optionName && `(${shop.optionName}) `}{AppConstants.qty} : {shop.quantity}</div>
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
                    <div className="alignself-center pt-2 " style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2 " style={{marginRight:10}}>${total && total.total}</div>
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
                    <Button
                        id="continue"
                        className="open-reg-button addToCart"
                        htmlType="submit"
                        type="primary"
                    >
                        {AppConstants.continue}
                    </Button>
                </div>
                <div style={{marginTop:23}}>
                    <Button
                        id="back"
                        className="back-btn-text btn-inner-view"
                        onClick={() => this.goToShop()}
                    >
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
                <Layout  className="layout-margin">
                    <Form
                        autocomplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveBilling}
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
        updateReviewInfoAction,
        saveRegistrationReview,
        getRegParticipantAddressAction,
        getRegistrationShopPickupAddressAction,
        getCommonRefData,
        countryReferenceAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        registrationProductState: state.RegistrationProductState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(RegistrationShipping));
