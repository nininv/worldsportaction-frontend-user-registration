import React, { Component } from "react";
import { Layout, Button, Input, Icon, Select, InputNumber } from 'antd';
import './shop.css';
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import { getProductDetailsByIdAction, clearProductReducer } from "../../store/actions/shopAction/productAction"
import { isArrayNotEmpty } from "../../util/helpers";
import { currencyFormat } from "../../util/currencyFormat";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CounterInput from '../../customComponents/reactBootstrapCounter';

const { Content } = Layout;
const { Option } = Select;

class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {


        }
    }


    componentDidMount() {
        this.props.clearProductReducer("productDetailData")
        window.scrollTo(0, 0)
        this.apiCalls();
    }

    apiCalls = () => {
        let productId = null
        productId = this.props.location.state ? this.props.location.state.id : null
        if (productId) {
            this.props.getProductDetailsByIdAction(productId)
        }
    }

    productItemPriceCheck = (productDetailData) => {
        let price = 0
        let variantOptions = isArrayNotEmpty(productDetailData.variants) ? productDetailData.variants[0].options : []
        if (isArrayNotEmpty(variantOptions)) {
            price = Math.min.apply(null, variantOptions.map(function (item) {
                return item.properties.price;
            }))
        } else {
            price = productDetailData.price
        }
        return productDetailData.tax > 0 ? currencyFormat(price + productDetailData.tax) + " (inc GST)" : currencyFormat(price)
    }

    ////////content view of the screen
    contentView = () => {
        let { productDetailData } = this.props.shopProductState
        console.log("productDetailData", productDetailData)
        return (
            <div className="product-details-view">
                <div className="d-flex justify-content-end">
                    <img
                        src={AppImages.shoppingCart}
                        className="cart-img"
                        onError={ev => {
                            ev.target.src = AppImages.shoppingCart;
                        }}
                    />
                </div>
                <div className="row mt-5">
                    <div className="col-sm pt-4">
                        <div >
                            <Carousel
                                showStatus={false}
                                showThumbs={false}
                                infiniteLoop={true}
                                showArrows={true}
                            >
                                {isArrayNotEmpty(productDetailData.images) && productDetailData.images.map(
                                    (item, index) => {
                                        return (
                                            <div className="carousel-div">
                                                <img src={item.url} className="carousel-img" />
                                            </div>
                                        );
                                    }
                                )}

                            </Carousel>
                        </div>
                    </div>
                    <div className="col-sm pt-4">
                        <div className="product-text-view pl-0 pt-0">
                            <span className="product-name" style={{ fontSize: 16 }}>{productDetailData.productName}</span>
                            <span className="product-price-text-style">
                                {isArrayNotEmpty(productDetailData.variants) ? " From " + this.productItemPriceCheck(productDetailData) : this.productItemPriceCheck(productDetailData)}
                            </span>
                            {/* <span className="product-description-text mt-4">{htmlToDraft(productDetailData.description)}</span> */}
                            <div className="product-description-text mt-4" dangerouslySetInnerHTML={{__html: productDetailData.description}} />
                            <div >
                                {isArrayNotEmpty(productDetailData.variants) && <div className="shop-label-text-view mt-5">
                                    <div className="w-25 mr-small-width-mobile">
                                        <span className="product-grey-detail-text">{productDetailData.variants[0].name}</span>
                                    </div>
                                    <div className="w-75">
                                        <Select
                                            className="shop-type-select"
                                            style={{ minWidth: 180 }}
                                            placeholder={"Choose " + productDetailData.variants[0].name}
                                        >
                                            {isArrayNotEmpty(productDetailData.variants) && productDetailData.variants[0].options.map((item) => {
                                                return (
                                                    <Option key={'options' + item.id} value={item.optionName}>
                                                        {item.optionName}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </div>
                                </div>}
                                <div className="shop-label-text-view mt-5">
                                    <div className="w-25 mr-small-width-mobile">
                                        <span className="product-grey-detail-text">{AppConstants.quantity}</span>
                                    </div>
                                    <div className="w-75">
                                        <CounterInput
                                            value={1}
                                            min={1}
                                            onChange={(value) => { console.log(value) }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                    </div>
                    <div className="col-sm">
                        {this.footerView()}
                    </div>
                </div>
            </div>
        );
    };

    footerView = () => {
        return (
            <div className="shop-details-button-view" >
                <div>
                    <Button
                        type="cancel-button"
                        onClick={() => history.push("/listProducts")}>{AppConstants.cancel}</Button>
                </div>
                <Button className="open-reg-button add-to-cart-button" type="primary">
                    {AppConstants.addToCart}
                </Button>
            </div>
        )
    }

    render() {
        console.log("shopProductState", this.props.shopProductState)
        return (
            <div className="fluid-width" >
                <DashboardLayout />
                <InnerHorizontalMenu />
                <Layout>
                    <Content>
                        <div className="formView mb-5">{this.contentView()}</div>
                    </Content>
                    <Loader
                        visible={
                            this.props.shopProductState.onLoad
                        }
                    />
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductDetailsByIdAction,
        clearProductReducer,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ProductDetails));
