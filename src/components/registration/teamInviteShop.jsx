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
    InputNumber
} from "antd";
import { connect } from 'react-redux';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import { bindActionCreators } from "redux";
import "./product.css";
import "../user/user.css";
import '../competition/competition.css';
import Loader from '../../customComponents/loader';
import { getAge,deepCopyFunction, isArrayNotEmpty, feeIsNull} from '../../util/helpers';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";
import ShopCarousel from "./shopCarousel";
import AppImages from "../../themes/appImages";
import PlacesAutocomplete from "./elements/PlaceAutoComplete/index";
import {getOrganisationId,  getCompetitionId, getUserId, getAuthToken, getSourceSystemFlag, getUserRegId,getExistingUserRefId } from "../../util/sessionStorage";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import { captializedString } from "../../util/helpers";
import { updateTeamInviteAction, saveTeamInviteReviewAction} from
            '../../store/actions/registrationAction/teamInviteAction';
import {getRegistrationByIdAction, getRegistrationShopProductAction } from
            '../../store/actions/registrationAction/registrationProductsAction';

const { Header, Footer, Content } = Layout;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

class TeamInviteShop extends Component{
    constructor(props){
        super(props);
        this.state = {
            showCardView:false,
            registrationUniqueKey: null,
            productModalVisible: false ,
            id: null,
            typeId: -1,
            organisationUniqueKey: -1,
            expandObj: null,
            variantOptionId: null,
            quantity: null,
            loading: false,
            userRegId: null,
            shopSelectedRow: -1
        }
    }

    componentDidMount(){
        try{
            let userRegId = this.props.location.state ? this.props.location.state.userRegId : null;
            console.log("Shop::(((((((((((((((" + userRegId)
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
            if(this.state.loading == true && teamInviteState.onTeamInviteReviewLoad == false){
                console.log("***********", teamInviteReviewList.shopProducts)
                if(isArrayNotEmpty(teamInviteReviewList.shopProducts)){
                    this.goToShipping();
                }else{
                    this.goToTeamInvitePayments();
                }
            }
        }catch(ex){
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
        this.getRegistrationShopProducts(1, -1, userRegId,-1);
    }

    getRegistrationShopProducts = (page, typeId, userRegId,organisationUniqueKey) =>{
        let registrationId = this.props.teamInviteState.registrationId;
        let payload = {
            registrationId: registrationId,
            userRegId: userRegId,
            typeId: typeId,
            organisationUniqueKey: organisationUniqueKey,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }

        this.props.getRegistrationShopProductAction(payload);
    }

    onChangeSetValue = (key, value) =>{
        if(key == "typeId"){
            this.setState({typeId: value});
            this.getRegistrationShopProducts(1, value, this.state.userRegId,this.state.organisationUniqueKey);
        }else if(key == "organisationUniqueKey"){
            this.setState({organisationUniqueKey: value});
            this.getRegistrationShopProducts(1, this.state.typeId, this.state.userRegId,value);
        }
        this.setState({showCardView:false, expandObj: null, variantOptionId: null, shopSelectedRow: -1,
            quantity: null});
    }

    getOrganisationFilterList = () => {
        try{
            const {registrationReviewList} = this.props.registrationProductState;
            let compParticipants = registrationReviewList!= null ?
                        isArrayNotEmpty(registrationReviewList.compParticipants) ?
                        registrationReviewList.compParticipants : [] : [];
            let organisationList = Array.from(new Set(compParticipants.map(a => a.organisationUniqueKey))).
                map(organisationUniqueKey => {
                    return compParticipants.find(a => a.organisationUniqueKey === organisationUniqueKey)
                });
            return organisationList;
        }catch(ex){
            console.log("Error in getOrganisationList::"+ex)
        }
    }

    goToShipping = () =>{
        history.push({pathname: '/teamInviteShipping', state: {userRegId: this.state.userRegId}})
    }

    goToTeamInvitePayments = () =>{
        history.push({pathname: '/teamInvitePayment', state: {userRegId: this.state.userRegId}})
    }

    goToTeamInviteProducts = () =>{
        let {teamInviteReviewList, registrationId} = this.props.teamInviteState;
        if(teamInviteReviewList){
            teamInviteReviewList["registrationId"] = registrationId;
            teamInviteReviewList["userRegId"] = this.state.userRegId;
            teamInviteReviewList["key"] = "shop";
            this.callSaveRegistrationProducts("shop", teamInviteReviewList);
        }
        setTimeout(() => {
            history.push({pathname: '/teamInviteProductsReview', state: {userRegId: this.state.userRegId}})
        }, 300)
    }

    getPaymentOptionText = (paymentOptionRefId) =>{
        let paymentOptionTxt =   paymentOptionRefId == 1 ? AppConstants.payEachMatch :
        (paymentOptionRefId == 2 ? AppConstants.gameVoucher :
        (paymentOptionRefId == 3 ? AppConstants.payfullAmount :
        (paymentOptionRefId == 4 ? AppConstants.firstInstalment :
        (paymentOptionRefId == 5 ? AppConstants.schoolRegistration: ""))));

        return paymentOptionTxt;
    }

    enableExpandView = (key, item,index) =>{
        if(key == "show"){
            this.setState({showCardView:true, expandObj: item, variantOptionId: null, quantity: 1, shopSelectedRow: index});
        }
        else {
            this.setState({showCardView:false, expandObj: null, variantOptionId: null, shopSelectedRow: -1,
                quantity: null});
        }
    }

    addToCart = (expandObj, varnt, key, subKey) =>{
        let variantOption = varnt.variantOptions.find(x=>x.variantOptionId == this.state.variantOptionId);
        let obj ={
            productId: expandObj.productId,
            productImgUrl: !!expandObj.productImgUrl.length ? expandObj.productImgUrl[0] : expandObj.orgLogoUrl,
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
            variantName: varnt.name,
            inventoryTracking: expandObj.inventoryTracking
        }
        obj.totalAmt =  feeIsNull(obj.amount) + feeIsNull(obj.tax)
        this.props.updateTeamInviteAction(obj,key, null, subKey,null);
        this.setState({showCardView:false, expandObj: null, variantOptionId: null,
            quantity: null});
    }

    removeFromCart = (index, key, subKey) =>{
        this.props.updateTeamInviteAction(null,key, index, subKey,null);
    }


    saveShop = (e) => {
        try{
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if(!err){
                    let {teamInviteReviewList, registrationId} = this.props.teamInviteState;
                    teamInviteReviewList["registrationId"] = registrationId;
                    teamInviteReviewList["userRegId"] = this.state.userRegId;
                    teamInviteReviewList["key"] = "shop";
                    console.log("teamInviteReviewList", teamInviteReviewList);
                    this.callSaveRegistrationProducts("shop", teamInviteReviewList);
                }
            });
        }catch(ex){
            console.log("Error in saveShop");
        }
    }

    callSaveRegistrationProducts = (key, teamInviteReviewList) =>{
        teamInviteReviewList["key"] = key;
        console.log("registrationReview" + JSON.stringify(teamInviteReviewList));
        this.props.saveTeamInviteReviewAction(teamInviteReviewList);
        this.setState({loading: true, buttonPressed: key});
    }

    renderPrice = (item) => {
        const max = Math.max(...item.variants.map(elem => {
            return Math.max(...elem.variantOptions.map(({ price }) => price));
        }))
        const min = Math.min(...item.variants.map(elem => {
            return Math.min(...elem.variantOptions.map(({ price }) => price));
        }))

        const price = (min + feeIsNull(item.tax)).toFixed(2);
        if (min !== max) {
            return `From  $${price}`;
        }
        return `$${price}`
    }

    getMaxVariantsQuantity = (choiceVariant, variantData, productId) => {
        const { registrationReviewList } = this.props.registrationProductState;
        const isNullVariants = !variantData.variantId;

        if (!isNullVariants && choiceVariant) {
            const variantOptionQuantity = variantData.variantOptions.find(item => item.variantOptionId === choiceVariant).quantity;
            const productFromOrder = registrationReviewList.shopProducts.find(item => item.variantOptionId === choiceVariant);
            return  variantOptionQuantity - (productFromOrder ? productFromOrder.quantity : 0);
        }
        const productsFromOrder = registrationReviewList.shopProducts.filter(item => item.productId === productId);

        if (!isNullVariants && !choiceVariant) {
            return Math.min(...variantData.variantOptions.map((option) => {
                const product = productsFromOrder.find(item => item.variantOptionId === option.variantOptionId);
                if (product) {
                    return option.quantity - product.quantity;
                }
                return option.quantity
            }));
        }
        const quantityFromStore = Math.min(...variantData.variantOptions.map(({ quantity }) => quantity));
        return quantityFromStore - (productsFromOrder[0] ? productsFromOrder[0].quantity : 0);
    }

    getShopProductList =(shopProductList) =>{
        try {
            let shopProductListTemp = [];
            for (let i = 0; i < shopProductList.length; i=i+3) {
                let obj = {
                    shopProduct1: shopProductList[i] ,
                    shopProduct2:shopProductList[i+1]&& shopProductList[i+1],
                    shopProduct3:shopProductList[i+2]&& shopProductList[i+2]
                }
                shopProductListTemp.push(obj);
            }
            return shopProductListTemp;
        } catch (ex) {
            console.log("Error in getOrganisationPhotos::" + ex);
        }
    }

    headerView = () =>{
        const {shopProductsTypes} = this.props.registrationProductState;
        let types = shopProductsTypes ? shopProductsTypes : [];
        return(
            <div style={{display:"flex" , justifyContent:"space-between" , paddingRight:0 ,flexWrap: "wrap"}}>
                <div className="headline-text-common" style={{alignSelf:"center" , marginTop: "10px", marginRight: 10}}> {AppConstants.merchandiseShop}</div>
                <div style={{display:"flex", flexWrap: "wrap"}}>
                    <div style={{width:"230px",marginTop: "10px",marginRight: "15px"}}>
                        <Select
                            id="merchandise-categories"
                            style={{ width: "100%", paddingRight: 1}}
                            placeholder={AppConstants.all}
                            className="custom-dropdown"
                            onChange={(e) => this.onChangeSetValue("organisationUniqueKey", e)}
                            value={this.state.organisationUniqueKey}
                        >
                            <Option value={-1}>All</Option>
                            {
                                (this.getOrganisationFilterList() || []).map((item, index) =>(
                                    <Option id={"merchandise-category-" + index} key = {item.organisationUniqueKey} value={item.organisationUniqueKey}>{item.organisationName}</Option>
                                ))
                            }
                        </Select>
                    </div>
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
            </div>
        );

    }

    shopProductColumnView = (item, index) => {
        return (
            <div className="col-md-4">
                    <div>
                        <div className="shop-product-text card-header-text"
                        style={{height: "240px"}}
                        onClick={(e) => this.enableExpandView("show", item, index)}>
                            <div style={{display: "flex", justifyContent:"center", overflow:"hidden"}}>
                                <ShopCarousel item={item}/>
                            </div>
                            <div className="px-4">
                                <div className="subtitle-text-common" style={{margin:"10px 0px 10px 0px",fontWeight:500}}>{item.productName}</div>
                                <div className="subtitle-text-common">{this.renderPrice(item)}</div>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }

    cardView = () =>{
        const {shopProductList} = this.props.registrationProductState;
        (shopProductList || []).map((item, index) =>{
            item["sIndex"] = index;
        });
        let shopProductListTemp = this.getShopProductList(shopProductList);
        return(
            <div>
                {window.innerWidth < 768 ?
                    <div>
                        {(shopProductList || []).map((item, index) =>(
                            <div>
                                <div className="shop-product-text card-header-text"
                                style={{height: "240px"}}
                                onClick={(e) => this.enableExpandView("show", item, index)}>
                                    <div style={{display: "flex", justifyContent:"center"}}>
                                        <ShopCarousel item={item}/>
                                    </div>
                                    <div className="subtitle-text-common" style={{margin:"10px 0px 10px 0px",fontWeight:500}}>{item.productName}</div>
                                    <div className="subtitle-text-common">{this.renderPrice(item)}</div>
                                </div>
                                {this.state.showCardView && index == this.state.expandObj.sIndex &&
                                    <div>
                                        {this.cardExpandView()}
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                :
                    <div >
                        {(shopProductListTemp  || []).map((item, index)=> (
                            <div className="row">
                                {this.shopProductColumnView(item.shopProduct1, index)}
                                {item.shopProduct2 && this.shopProductColumnView(item.shopProduct2, index)}
                                {item.shopProduct3 && this.shopProductColumnView(item.shopProduct3, index)}
                                {this.state.showCardView && index == this.state.shopSelectedRow &&
                                    <div className="col-md-12">
                                        {this.cardExpandView()}
                                    </div>
                                }
                             </div>
                         ))}
                    </div>
                }
            </div>
        )


        // return(
        //     <div className="row">
        //         {(shopProductList || []).map((item, index)=> (
        //             <div className="col-sm-12 col-md-4 ">
        //                 <div className="shop-product-text card-header-text"
        //                 style={{height: "240px"}}
        //                 onClick={(e)=>this.enableExpandView("show", item)}>
        //                     <div style={{display: "flex",justifyContent: "center"}}>
        //                         <img style={{height: "100px"}} src={item.productImgUrl ? item.productImgUrl : AppImages.userIcon}/>
        //                     </div>
        //                     <div className="subtitle-text-common" style={{margin:"10px 0px 10px 0px",fontWeight:500}}>{item.productName}</div>
        //                     <div className="subtitle-text-common">{this.renderPrice(item)}</div>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // )
    }

    cardExpandView = () =>{
        let expandObj = this.state.expandObj;
        var description = expandObj.description != null ? expandObj.description.replace(/<[^>]*>/g, ' ') : '';
        const isNullVariants = !expandObj.variants[0].variantId;
        return(
            <div class = "expand-product-text"  style={{marginTop: "23px"}}>
                <div style={{textAlign:"right"}}>
                    <img  onClick={(e)=>this.enableExpandView("hide")} src={AppImages.crossImage}  style={{height:13 , width:13}}/>
                </div>
                <div className="row" style={{marginTop: "17px"}}>
                    <div className="col-lg-4 col-12" style={{textAlign: "center" , marginTop: "20px", width: "100px"}}>
                        <ShopCarousel item={expandObj}/>
                    </div>
                    <div className="col-lg-8" style={{paddingTop:"20px"}}>
                        <div class = "headline-text-common">{expandObj.productName}</div>
                        <div className ="mt-5 body-text-common">{description}</div>
                        {(expandObj.variants || []).map((varnt, vIndex) => {
                            let maxQuantity = this.getMaxVariantsQuantity(this.state.variantOptionId, varnt, expandObj.productId);
                            let isOutOfStock = false;
                            if (isNullVariants && maxQuantity === 0 && expandObj.inventoryTracking && !expandObj.availableIfOutOfStock) {
                                isOutOfStock = true;
                            }
                            if (!isNullVariants && maxQuantity === 0 && this.state.variantOptionId && expandObj.inventoryTracking && !expandObj.availableIfOutOfStock) {
                                isOutOfStock = true;
                            }
                            if (!expandObj.inventoryTracking || expandObj.availableIfOutOfStock) {
                                maxQuantity = 100000;
                            }

                            return (
                                <div key={vIndex}>
                                    <div style={{display: "flex", flexWrap: "wrap"}}>
                                        {!isNullVariants && <div className="col-lg-6" style={{marginTop: 27, padding: 0}}>
                                            <div className="subtitle-text-common">
                                                {"Select " + varnt.name}
                                            </div>
                                            <div style={{marginTop: 7}}>
                                                <Select
                                                    style={{padding: 0}}
                                                    placeholder={AppConstants.allCategories}
                                                    className="body-text-common col-lg-11"
                                                    value={this.state.variantOptionId}
                                                    onChange={(e) => this.setState({variantOptionId: e})}
                                                >
                                                    {(varnt.variantOptions || []).map((varOpt, vOptIndex) => (
                                                        <Option key={varOpt.variantOptionId}
                                                                value={varOpt.variantOptionId}>
                                                            {varOpt.optionName}</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>}
                                        <div style={{marginTop: 27, padding: 0}} className="col-lg-6">
                                            <div className="subtitle-text-common">
                                                {AppConstants.quantity}
                                            </div>
                                            <div style={{marginTop: 7, fontFamily: "inter"}}>
                                                <InputNumber style={{fontWeight: 500}} size="large" min={1} max={maxQuantity}
                                                             defaultValue={0}
                                                             onChange={(e) => this.setState({quantity: e})}
                                                             value={this.state.quantity}
                                                             className="col-lg-11 body-text-common"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{margin: 0}}>
                                        <div className="col-lg-8 col-12"
                                             style={{padding: 0, marginTop: 23, marginRight: 22}}>
                                            <Button className={`open-reg-button addToCart ${isOutOfStock ? 'out-of-stock' : ''}`}
                                                    disabled={this.state.quantity == null || (this.state.variantOptionId == null && !isNullVariants) || maxQuantity === 0}
                                                    onClick={() => this.addToCart(expandObj, varnt, 'addShopProduct', 'shopProducts')}>
                                                {isOutOfStock ? AppConstants.outOfStock : AppConstants.addToCart}
                                            </Button>
                                        </div>
                                        <div className="col-lg-3 col-12" style={{padding: 0, marginTop: 23}}>
                                            <Button className="cancel-button-text" style={{height: "49px"}}
                                                    onClick={() => this.enableExpandView('hide')}>
                                                {AppConstants.cancel}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        )
    }

    shopLeftView = ()=>{
        return(
            <div className="col-sm-12 col-md-12 col-lg-8 product-left-view outline-style registration-form-view" style={{cursor:"pointer"}}>
                {this.headerView()}
                {this.cardView()}
                {/* {this.state.showCardView &&
                    <div>
                        {this.cardExpandView()}
                    </div>
                } */}
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
                                    <div className="alignself-center pt-2" style={{marginRight:10}}>- ${mem.discountsToDeduct}</div>
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
                            <div className="alignself-center pt-2" style={{marginRight:10}}>- ${item.governmentVoucherAmount}</div>
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
                                <div>{shop.optionName && `(${shop.optionName}) `}{AppConstants.qty} : {shop.quantity}</div>
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
                    <div className="alignself-center pt-2" style={{marginRight:10}}>${total && feeIsNull(total.total).toFixed(2)}</div>
                </div>
            </div>
        )
    }

    buttonView = () =>{
        return(
            <div style={{marginTop:23}}>
                <div>
                    <Button
                        id="back"
                        className="open-reg-button addToCart" style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}
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
                        onClick={()=> this.goToTeamInviteProducts()}
                    >
                        {AppConstants.back}
                    </Button>
                </div>
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

    contentView = (getFieldDecorator) =>{
        return(
            <div className="row" style={{margin:0}}>
                {this.shopLeftView(getFieldDecorator)}
                {this.shopRightView(getFieldDecorator)}
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
                    <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveShop}
                        noValidate="noValidate">
                        <Content>
                        <Loader visible={this.props.teamInviteState.onTeamInviteReviewLoad} />
                            {this.contentView(getFieldDecorator)}</Content>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        getRegistrationByIdAction,
        getRegistrationShopProductAction,
        saveTeamInviteReviewAction,
        updateTeamInviteAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        teamInviteState: state.TeamInviteState,
        registrationProductState: state.RegistrationProductState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(TeamInviteShop));
