import React, { Component } from "react";
import { Layout, Button, Select, Form } from 'antd';
import './shop.css';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import { getProductDetailsByIdAction, clearProductReducer, addToCartAction } from "../../store/actions/shopAction/productAction"
import { isArrayNotEmpty } from "../../util/helpers";
import { currencyFormat } from "../../util/currencyFormat";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CounterInput from '../../customComponents/reactBootstrapCounter';
import AddToCartModal from "../../customComponents/addCartModal";
import ValidationConstants from "../../themes/validationConstant";

const { Content } = Layout;
const { Option } = Select;

class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartModalVisible: false,
            addToCartLoad: false,
            quantity: 1,
            skuId: null,
        }
    }


    componentDidMount() {
        this.props.clearProductReducer("productDetailData")
        window.scrollTo(0, 0)
        this.apiCalls();
    }

    componentDidUpdate() {
        let { onLoad } = this.props.shopProductState
        if (onLoad == false && this.state.addToCartLoad == true) {
            this.setState({ addToCartLoad: false, cartModalVisible: false })
            history.push("/listProducts")
        }
    }

    apiCalls = () => {
        let productId = null
        productId = this.props.location.state ? this.props.location.state.id : null
        if (productId) {
            this.props.getProductDetailsByIdAction(productId)
        }
    }

    //////add to cart post api call
    addToCartAPI = (e) => {
        let { productDetailData } = this.props.shopProductState
        let { skuId, quantity } = this.state
        let payload = {
            productId: productDetailData.id,
            skuId: skuId,
            quantity: quantity
        }
        this.props.addToCartAction(payload)
        this.setState({ addToCartLoad: true })
    }

    ////add to cart button on submit
    addToCartOnSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ cartModalVisible: true })
            }
        })
    }

    ///////////product price display logic
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

    quantityOnChange = (value) => {
        this.setState({ quantity: value })
    }

    ////////content view of the screen
    contentView = (getFieldDecorator) => {
        let { productDetailData } = this.props.shopProductState
        console.log("productDetailData", productDetailData)
        return (
            <div className="product-details-view">
                <div className="d-flex justify-content-end cart-main-view">
                        <img
                            src={AppImages.shoppingCart}
                            className="cart-img"
                            onError={ev => {
                                ev.target.src = AppImages.shoppingCart;
                            }}
                        />
                    <div className="cart-number-div">
                        <span className="cart-number-text">15</span>
                    </div>
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
                            <div className="product-description-text mt-4" dangerouslySetInnerHTML={{ __html: productDetailData.description }} />
                            <div >
                                {isArrayNotEmpty(productDetailData.variants) && <div className="shop-label-text-view mt-5">
                                    <div className="w-25 mr-small-width-mobile">
                                        <span className="product-grey-detail-text">{productDetailData.variants[0].name}</span>
                                    </div>
                                    <div className="w-75">
                                        <Form.Item>
                                            {getFieldDecorator(
                                                `skuId`,
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                ValidationConstants.variantIsRequired,
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Select
                                                    className="shop-type-select"
                                                    style={{ minWidth: 180 }}
                                                    placeholder={productDetailData.variants[0].name ? "Choose " + productDetailData.variants[0].name : "Select"}
                                                    onChange={(value) => this.setState({ skuId: value })}
                                                >
                                                    {isArrayNotEmpty(productDetailData.variants) && productDetailData.variants[0].options.map((item) => {
                                                        return (
                                                            <Option key={'options' + item.id} value={item.properties.id}>
                                                                {item.optionName}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </div>
                                </div>}
                                <div className="shop-label-text-view mt-5">
                                    <div className="w-25 mr-small-width-mobile">
                                        <span className="product-grey-detail-text">{AppConstants.quantity}</span>
                                    </div>
                                    <div className="w-75">
                                        <CounterInput
                                            value={this.state.quantity}
                                            min={1}
                                            onChange={(value) => this.quantityOnChange(value)}
                                            visible={this.state.cartModalVisible}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <AddToCartModal
                            visible={this.state.cartModalVisible}
                            onOk={() => this.addToCartAPI()}
                            onCancel={() => this.setState({ cartModalVisible: false })}
                            productItem={productDetailData}
                            quantity={this.state.quantity}
                            quantityOnChange={(value) => this.quantityOnChange(value)}
                        />
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
                <Button className="open-reg-button add-to-cart-button" type="primary" htmlType="submit">
                    {AppConstants.addToCart}
                </Button>
            </div>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" >
                <DashboardLayout />
                <InnerHorizontalMenu />
                <Layout>
                    <Form
                        onSubmit={this.addToCartOnSubmit}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView mb-5">{this.contentView(getFieldDecorator)}</div>
                        </Content>
                        <Loader
                            visible={
                                this.props.shopProductState.onLoad
                            }
                        />
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductDetailsByIdAction,
        clearProductReducer,
        addToCartAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(ProductDetails));
