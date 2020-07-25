import React, { Component } from "react";
import { Layout, Button, Breadcrumb, Input, Icon, Select, Modal, Pagination } from 'antd';
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
import { getProductDetailsByIdAction } from "../../store/actions/shopAction/productAction"
import { isArrayNotEmpty } from "../../util/helpers";
import { currencyFormat } from "../../util/currencyFormat";

const { Footer, Content } = Layout;
const { confirm } = Modal;

class ProductDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {


        }
    }


    componentDidMount() {
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
            <div className="content-view pt-4 mt-5">
                <div className="row">
                    <div className="col-sm">

                    </div>
                    <div className="col-sm">
                        <div className="product-text-view">
                            <span className="product-name">{productDetailData.productName}</span>
                            <span className="product-price-text-style">
                                {isArrayNotEmpty(productDetailData.variants) ? " From " + this.productItemPriceCheck(productDetailData) : this.productItemPriceCheck(productDetailData)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        console.log("shopProductState", this.props.shopProductState)
        return (
            <div className="fluid-width" >
                <DashboardLayout />
                <InnerHorizontalMenu />
                <Layout>
                    <Content>
                        <div className="formView">{this.contentView()}</div>
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
        getProductDetailsByIdAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ProductDetails));
