import React, { Component } from "react";
import {
    Layout,
    Select,
    Button,
    Form,
    InputNumber,
    Pagination
} from "antd";
import "../registration/product.css";
import "../user/user.css";
import '../competition/competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { isArrayNotEmpty, feeIsNull } from '../../util/helpers';
import {
    getShopProductsAction, getShopCartAction, getShopOrganisationsAction, saveShopCartAction
} from '../../store/actions/shopAction/productAction';
import { getUserModuleRegistrationAction } from '../../store/actions/userAction/userAction';
import { bindActionCreators } from "redux";
import history from "../../util/history";
import Loader from '../../customComponents/loader';
import ShopCarousel from '../registration/shopCarousel';
import { getUserId } from "../../util/sessionStorage";

const { Content } = Layout;
const { Option } = Select;

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width:  800,
            height: 182,
            showCardView:false,
            shopUniqueKey: null,
            id: null,
            typeId: -1,
            organisationUniqueKey: -1,
            expandObj: null,
            variantOptionId: null,
            quantity: null,
            loading: false,
            shopSelectedRow: -1,
            userId: getUserId(),
            shopDataLoad: false,
        };
    }

    componentDidMount(){
        const shopUniqueKey = localStorage.getItem('shopUniqueKey') || null;
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.getApiInfo(shopUniqueKey);
    }

    componentDidUpdate() {
        const userState = this.props.userState;
        const userRegistrationList = userState.userRegistrationList;
        const { organisations } = this.props.shopProductState;
        if (userRegistrationList && organisations.length && !this.state.shopDataLoad) {
            this.getFirstShopProduct();
            this.setState({ shopDataLoad: true });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions() {
        if(window.innerWidth < 500) {
            this.setState({ width: 450, height: 102 });
        } else {
            let update_width  = window.innerWidth-100;
            let update_height = Math.round(update_width/4.4);
            this.setState({ width: update_width, height: update_height });
        }
    }

    getFirstShopProduct = () => {
        const userState = this.props.userState;
        const userRegistrationList = userState.userRegistrationList;
        const myRegistrations = userRegistrationList?.myRegistrations.registrationDetails ? userRegistrationList?.myRegistrations.registrationDetails : [];
        const childRegistrations = userRegistrationList?.childRegistrations.childRegistrationDetails ? userRegistrationList?.childRegistrations.childRegistrationDetails : [];
        const userFirstRegistration = myRegistrations[0] || childRegistrations[0];
        if (userFirstRegistration) {
            this.setState({ organisationUniqueKey: userFirstRegistration.organisationId });
            this.getShopProducts( 1, -1,userFirstRegistration.organisationId);
        } else {
            this.getShopProducts( 1, -1,-1);
        }
    }

    getApiInfo = (shopUniqueKey) => {
        const userState = this.props.userState;
        const userRegistrationList = userState.userRegistrationList;
        const { organisations } = this.props.shopProductState;
        if (!userRegistrationList) {
            this.getUserRegistrations();
        } else if(organisations.length) {
            this.getFirstShopProduct();
        }
        this.props.getShopOrganisationsAction();
        this.props.getShopCartAction({ shopUniqueKey });
    }

    getUserRegistrations = () => {
        const filter = {
            competitionId: -1,
            userId: this.state.userId,
            organisationId: null,
            yearRefId: -1,
            myRegPaging: {
                limit: 10,
                offset: 0,
            },
            otherRegPaging: {
                limit: 10,
                offset: 0,
            },
            teamRegPaging: {
                limit: 10,
                offset: 0,
            },
            childRegPaging: {
                limit: 10,
                offset: 0,
            }
        };
        this.props.getUserModuleRegistrationAction(filter);
    }

    getShopProducts = (page, typeId, organisationUniqueKey) =>{
        let payload = {
            typeId,
            organisationUniqueKey,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }
        this.props.getShopProductsAction(payload);
    }

    onChangeSetValue = (key, value) =>{
        if(key == "typeId"){
            this.setState({typeId: value});
            this.getShopProducts(1, value, this.state.organisationUniqueKey);
        }else if(key == "organisationUniqueKey"){
            this.setState({organisationUniqueKey: value});
            this.getShopProducts(1, this.state.typeId, value);
        }

        this.setState({ expandObj: null });
    }

    addToCart = (expandObj, varnt) =>{
        const { cart: { cartProducts: products }} = this.props.shopProductState;
        const newProducts = [...products]
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
            variantName: varnt.name,
            inventoryTracking: expandObj.inventoryTracking
        }
        obj.totalAmt =  feeIsNull(obj.amount) + feeIsNull(obj.tax);

        let sameProduct = newProducts.find(x => x.productId == obj.productId && x.variantOptionId == obj.variantOptionId);
        if(sameProduct){
            sameProduct.quantity += obj.quantity;
            sameProduct.tax += obj.tax;
            sameProduct.amount += obj.amount;
            sameProduct.totalAmt += obj.totalAmt;
        } else {
            newProducts.push(obj);
        }
        const cartProducts = [...newProducts];
        const shopUniqueKey = localStorage.getItem('shopUniqueKey') || null;
        this.props.saveShopCartAction({ cartProducts, shopUniqueKey });
        this.setState({showCardView:false, expandObj: null, variantOptionId: null,
            quantity: null});
    }

    removeProductFromCart = (index) => {
        const { cart: { cartProducts: products }} = this.props.shopProductState;
        const cartProducts = products.filter((elem, elemIndex) => elemIndex !== index);
        const shopUniqueKey = localStorage.getItem('shopUniqueKey') || null;
        this.props.saveShopCartAction({ cartProducts, shopUniqueKey });
    }


    saveShop = (e) =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                history.push('/shopPayment');
            }
        });
    }

    renderPrice = (item) => {
        let max=0
        let min=0
        if(!isArrayNotEmpty(item.variants)){
            let price = (item.productSKU.price + feeIsNull(item.tax)).toFixed(2);
            return `$${price}`
        }
        if(isArrayNotEmpty(item.variants)){
            max = Math.max(...item.variants.map(elem => {
                if(isArrayNotEmpty(elem.variantOptions)){
                    return Math.max(...elem.variantOptions.map(({ price }) => price));
                }
            }))
        }
        if(isArrayNotEmpty(item.variants)){
            min = Math.min(...item.variants.map(elem => {
                if(isArrayNotEmpty(elem.variantOptions)){
                    return Math.min(...elem.variantOptions.map(({ price }) => price));
                }
            }))
        }

        const price = (min + feeIsNull(item.tax)).toFixed(2);
        if (min !== max) {
            return `From  $${price}`;
        }
        return `$${price}`
    }

    getMaxVariantsQuantity = (choiceVariant, variantData, productId) => {
        const { cart: { cartProducts } } = this.props.shopProductState;
        const isNullVariants = !variantData.variantId;

        if (!isNullVariants && choiceVariant) {
            const variantOptionQuantity = variantData.variantOptions.find(item => item.variantOptionId === choiceVariant).quantity;
            const productFromOrder = cartProducts.find(item => item.variantOptionId === choiceVariant);
            return  variantOptionQuantity - (productFromOrder ? productFromOrder.quantity : 0);
        }
        const productsFromOrder = cartProducts.filter(item => item.productId === productId);

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

    enableExpandView = (key, item, index) =>{
        if(key == "show"){
            this.setState({showCardView:true, expandObj: item, variantOptionId: null, quantity: 1, shopSelectedRow: index});
        }
        else {
            this.setState({showCardView:false, expandObj: null, variantOptionId: null, shopSelectedRow: -1,
                quantity: null});
        }
    }

    headerView = () =>{
        const { organisations, types } = this.props.shopProductState;
        return(
            <div style={{display:"flex" , justifyContent:"space-between" , paddingRight:0 ,flexWrap: "wrap"}}>
                <div className="headline-text-common px-0" style={{ height: 60, display: 'flex', alignItems: 'center', marginRight: 10}}> {AppConstants.merchandiseShop}</div>
                <div className="px-0 shop-filters-wrapper">
                    <div
                        className="my-2"
                        style={{width: 'calc(50% - 7px', minWidth: 170 }}
                    >
                        <Select
                            style={{ width: "100%", paddingRight: 1}}
                            placeholder={AppConstants.all}
                            className="custom-dropdown"
                            onChange={(e) => this.onChangeSetValue("organisationUniqueKey", e)}
                            value={this.state.organisationUniqueKey}
                        >
                            <Option value={-1}>All</Option>
                            {
                                (organisations || []).map((item, index) =>(
                                    <Option key = {item.organisationUniqueKey} value={item.organisationUniqueKey}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div
                        className="my-2"
                        style={{width: 'calc(50% - 7px', minWidth: 170}}
                    >
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
                                    <Option key = {item.id} value={item.id}>{item.typeName || 'N/A'}</Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>
            </div>
        );

    }
    getShopProductList = (shopProductList) => {
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

    shopProductColumnView = (item, index) => {
        return (
            <div className="col-md-4">
                <div>
                    <div className="shop-product-text card-header-text pt-4"
                         style={{height: "240px"}}
                         onClick={(e) => this.enableExpandView("show", item, index)}>
                        <ShopCarousel item={item}/>
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
        const { products } = this.props.shopProductState;
        if (!isArrayNotEmpty(products)) {
            return <div className="card-header-text pt-4">{AppConstants.notProductByOrganisation}</div>
        }
        return(
            <div>
                {window.innerWidth < 768 ?
                    <div>
                        {(products || []).map((item, index) =>(
                            <div>
                                <div className="shop-product-text card-header-text pt-4"
                                     style={{height: "240px"}}
                                     onClick={(e) => this.enableExpandView("show", item, index)}>
                                    <ShopCarousel item={item}/>
                                    <div className="px-4">
                                        <div className="subtitle-text-common" style={{margin:"10px 0px 10px 0px",fontWeight:500}}>{item.productName}</div>
                                        <div className="subtitle-text-common">{this.renderPrice(item)}</div>
                                    </div>
                                </div>
                                {this.state.showCardView && index == this.state.expandObj.sIndex &&
                                <div>
                                    {this.state.expandObj && this.cardExpandView()}
                                </div>
                                }
                            </div>
                        ))}
                    </div> :
                    <div >
                        {(this.getShopProductList(products)  || []).map((item, index)=> (
                            <div className="row" key={index}>
                                {this.shopProductColumnView(item.shopProduct1, index)}
                                {item.shopProduct2 && this.shopProductColumnView(item.shopProduct2, index)}
                                {item.shopProduct3 && this.shopProductColumnView(item.shopProduct3, index)}
                                {this.state.showCardView && index == this.state.shopSelectedRow &&
                                <div className="col-md-12">
                                    {this.state.expandObj && this.cardExpandView()}
                                </div>
                                }
                            </div>
                        ))

                        }
                    </div>

                }
            </div>

        )
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
                        <img style={{width: "100%" , height: "180px", objectFit: "contain" }} src={!!expandObj.productImgUrl.length ? expandObj.productImgUrl[0] : expandObj.orgLogoUrl}/>
                    </div>
                    <div className="col-lg-8" style={{paddingTop:"20px"}}>
                        <div className="headline-text-common">{expandObj.productName}</div>
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
                                <div>
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
                                                <InputNumber style={{fontWeight: 500}} size="large"
                                                             min={1}
                                                             max={maxQuantity}
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
                                                    onClick={() => this.addToCart(expandObj, varnt)}>
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

    contentView = () =>{
        return(
            <div className="row mx-0">
                {this.shopLeftView()}
                {this.shopRightView()}
            </div>
        );
    }

    handlePagination = (page) => {
        let { typeId,organisationUniqueKey } = this.state

        let payload = {
            typeId: typeId,
            organisationUniqueKey: organisationUniqueKey,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }
        this.props.getShopProductsAction(payload);
    };

    shopLeftView = () => {
        const { products, productsTotalCount, productsPage } = this.props.shopProductState;
        return(
            <div className="col-sm-12 col-md-7 col-lg-8 mt-0 product-left-view outline-style registration-form-view" style={{cursor:"pointer", marginBottom: 23}}>
                {this.headerView()}
                {this.cardView()}
                <div className="d-flex justify-content-end">
                    {isArrayNotEmpty(products) && (
                        <Pagination
                            className="antd-pagination"
                            total={productsTotalCount}
                            onChange={(page) => this.handlePagination(page)}
                            current={productsPage.currentPage}
                            showSizeChanger={false}
                        />
                    )}
                </div>
            </div>
        )
    }

    shopRightView = ()=>{
        return(
            <div className="col-lg-4 col-md-3 col-sm-12 mt-0 product-right-view px-0">
                {this.yourOrderView()}
                {this.buttonView()}
            </div>
        )
    }

    yourOrderView = () =>{

        const { cart: { cartProducts } } = this.props.shopProductState;
        const total = cartProducts.reduce((sum, item) => sum + item.totalAmt, 0);
        return(
            <div className="outline-style " style={{padding: "36px 36px 22px 20px"}}>
                <div className="headline-text-common">
                    {AppConstants.yourOrder}
                </div>
                {cartProducts.map((shop, index) =>(
                    <div  className="inter-medium-w500" key={index}  style={{display:"flex" , fontWeight:500 ,borderBottom:"1px solid var(--app-e1e1f5)" , borderTop:"1px solid var(--app-e1e1f5)"}}>
                        <div className="alignself-center pt-2" style={{marginRight:"auto" , display: "flex",marginTop: "12px" , padding: "8px"}}>
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
                        <div className="alignself-center pt-5 subtitle-text-common" style={{fontWeight:600 , marginRight:10}}>${shop.totalAmt ? shop.totalAmt.toFixed(2): '0.00'}</div>
                        <div style={{paddingTop:26}} onClick ={() => this.removeProductFromCart(index)}>
                            <span className="user-remove-btn pointer" >
                                <img  className="marginIcon" src={AppImages.removeIcon} />
                            </span>
                        </div>
                    </div>
                ))}

                <div  className="subtitle-text-common mt-10 mr-4" style={{display:"flex"}}>
                    <div className="alignself-center pt-2" style={{marginRight:"auto"}}>{AppConstants.totalPaymentDue}</div>
                    <div className="alignself-center pt-2" style={{marginRight:10}}>${feeIsNull(total).toFixed(2)}</div>
                </div>
            </div>
        )
    }

    buttonView = () => {
        const { cart: { cartProducts } } = this.props.shopProductState;
        return(
            <div style={{marginTop:23}}>
                <div>
                    <Button
                        className={`open-reg-button addToCart ${!cartProducts.length ? 'out-of-stock' : ''}`}
                        style={{color:"var(--app-white) " , width:"100%",textTransform: "uppercase"}}
                        htmlType="submit"
                        type="primary"
                        disabled={!cartProducts.length}
                    >
                        {AppConstants.continue}
                    </Button>
                </div>
            </div>
        )
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { cartLoad, productsLoad, organisationsLoad } = this.props.shopProductState;
        const { userRegistrationOnLoad } = this.props.userState;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />
                <Layout className="layout-margin">
                    <Form
                        autoComplete="off"
                        scrollToFirstError={true}
                        onSubmit={this.saveShop}
                        noValidate="noValidate"
                    >
                        <Content>
                            <Loader visible={cartLoad || productsLoad || organisationsLoad || userRegistrationOnLoad} />
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
        getShopProductsAction,
        getShopCartAction,
        getShopOrganisationsAction,
        saveShopCartAction,
        getUserModuleRegistrationAction
    }, dispatch);

}

function mapStateToProps(state){
    return {
        userState: state.UserState,
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(Shop));
