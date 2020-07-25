import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Modal, Pagination } from 'antd';
import './shop.css';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import ShopSingleProductComponent from "../../customComponents/shopSingleProductComponent";
import { getProductListingAction, getTypesOfProductAction } from "../../store/actions/shopAction/productAction"
import { isArrayNotEmpty } from "../../util/helpers";

const { Footer, Content } = Layout;
const { confirm } = Modal;
const { Option } = Select;

class ListProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            limit: 8,
            productType: 0,
            organisationUniqueKeys: [],
        }
    }


    componentDidMount() {
        let organisationUniqueKeys = ["dcdbaae5-e48b-4411-b7be-5803920a9a3d", "b6eb9c7b-6c74-4657-bc6d-e2222b23c965"]
        this.props.getTypesOfProductAction()
        window.scrollTo(0, 0)
        const widthWindow = window.innerWidth;
        let windowLimit = Math.round(widthWindow / 270) * 2
        let limit = windowLimit < 6 ? 6 : windowLimit
        this.setState({ limit, organisationUniqueKeys })
        let { offset, productType } = this.state
        this.props.getProductListingAction(organisationUniqueKeys, offset, limit, productType)
    }


    // on change product type filter
    onChangeType = (value) => {
        this.setState({ productType: value })
        let { organisationUniqueKeys, limit } = this.state
        this.setState({ offset: 0 })
        this.props.getProductListingAction(organisationUniqueKeys, 0, limit, value)
    }


    ///////view for screen heading
    headerView = () => {
        let { typesProductList } = this.props.shopProductState
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div
                        className="col-sm d-flex align-items-center"
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.shop}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm d-flex align-items-center justify-content-end shop-add-product-btn-div mr-5">
                        <div className="com-year-select-heading-view mr-5">
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(value) => this.onChangeType(value)}
                                placeholder="Select"
                                value={this.state.productType == 0 ? "All Categories" : this.state.productType}
                            >
                                {isArrayNotEmpty(typesProductList) && typesProductList.map(
                                    (item, index) => {
                                        return (
                                            <Option
                                                key={'productType' + item.id + index}
                                                value={item.id}
                                            >
                                                {item.typeName}
                                            </Option>
                                        );
                                    }
                                )}
                            </Select>

                        </div>
                        <div>
                            <img
                                src={AppImages.shoppingCart}
                                className="cart-img"
                                onError={ev => {
                                    ev.target.src = AppImages.shoppingCart;
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    handlePagination = (page) => {
        let offset = page ? (this.state.limit) * (page - 1) : 0;
        this.setState({ offset })
        let { organisationUniqueKeys, limit, productType } = this.state
        this.props.getProductListingAction(organisationUniqueKeys, offset, limit, productType)
    };

    ////////content view of the screen
    contentView = () => {
        let { productListingData, productListingTotalCount, productListingCurrentPage } = this.props.shopProductState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="shop-product-content-div">
                    {productListingData.length > 0 && productListingData.map((item, index) => {
                        return (
                            <div key={"productListingData" + index}>
                                <ShopSingleProductComponent
                                    productItem={item}
                                    productOnClick={() => history.push("/productDetails", { id: item.id })}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="d-flex justify-content-end">
                    {isArrayNotEmpty(productListingData) &&
                        <Pagination
                            className="antd-pagination"
                            total={productListingTotalCount}
                            onChange={(page) => this.handlePagination(page)}
                            pageSize={this.state.limit}
                            current={productListingCurrentPage}
                        />
                    }
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
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
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
        getProductListingAction,
        getTypesOfProductAction,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ListProducts));
