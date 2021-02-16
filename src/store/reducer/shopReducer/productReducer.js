import ApiConstants from "../../../themes/apiConstants";
import { isArrayNotEmpty } from "../../../util/helpers";

// dummy object of product detail
const defaultProductObject = {
    productName: "",
    description: "",
    price: 0,
    cost: 0,
    tax: 0,
    quantity: 0,
    deliveryType: "",
    variants: [],
    images: [],
    organisationUniqueKey: 0,
}
const initialState = {
    onLoad: false,
    error: null,
    result: null,
    cartLoad: false,
    productsLoad: false,
    organisationsLoad: false,
    status: 0,
    products: [],
    productsPage: 1,
    productsTotalCount: 1,
    cart: {
        cartProducts: [],
        securePaymentOptions: []
    },
    organisations: [],
    types: [],
    productListingData: [],
    productListingTotalCount: 1,
    productListingCurrentPage: 1,
    typesProductList: [],
    productDetailData: defaultProductObject,
};


function shopProductState(state = initialState, action) {
    switch (action.type) {

        case ApiConstants.API_SHOP_PRODUCT_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_SHOP_PRODUCT_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_GET_SHOP_PRODUCTS_LOAD:
            return {
                ...state,
                productsLoad: true,
            };

        case ApiConstants.API_GET_SHOP_PRODUCTS_SUCCESS:
            const { products, page, types } = action.result;
            return {
                ...state,
                productsLoad: false,
                products,
                productsPage: page,
                productsTotalCount: page.totalCount,
                types,
            };


        case ApiConstants.API_GET_SHOP_PRODUCTS_ERROR:
            return {
                ...state,
                error: action.error,
                productsLoad: false,
            };

        case ApiConstants.API_GET_SHOP_ORGANISATIONS_LOAD:
            return {
                ...state,
                organisationsLoad: true,
            };

        case ApiConstants.API_GET_SHOP_ORGANISATIONS_SUCCESS:
            return {
                ...state,
                organisationsLoad: false,
                organisations: action.result,
            };

        case ApiConstants.API_GET_SHOP_ORGANISATIONS_ERROR:
            return {
                ...state,
                organisationsLoad: false,
                error: action.error,
            };

        case ApiConstants.API_GET_SHOP_CART_LOAD:
        case ApiConstants.API_SAVE_SHOP_CART_LOAD:
            return {
                ...state,
                cartLoad: true,
            };

        case ApiConstants.API_GET_SHOP_CART_SUCCESS:
        case ApiConstants.API_SAVE_SHOP_CART_SUCCESS:
            return {
                ...state,
                cart: action.result,
                cartLoad: false,
            };

        case ApiConstants.API_GET_SHOP_CART_ERROR:
        case ApiConstants.API_SAVE_SHOP_CART_ERROR:
            return {
                ...state,
                cartLoad: false,
                error: action.error,
            };

        /////////product listing get API
        case ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_SHOP_PRODUCT_LISTING_SUCCESS:
            return {
                ...state,
                productListingData: isArrayNotEmpty(action.result.result) ? action.result.result : [],
                productListingTotalCount: action.result.page ? action.result.page.totalCount : 1,
                productListingCurrentPage: action.result.page ? action.result.page.currentPage : 1,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////get reference type in the add product screen
        case ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_SUCCESS:
            let productTypes = JSON.parse(JSON.stringify(isArrayNotEmpty(action.result) ? action.result : []))
            let typeObject = {
                typeName: "All categories",
                id: 0
            }
            productTypes.unshift(typeObject)
            state.typesProductList = productTypes
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////////////product details on id API
        case ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD:
            return { ...state, onLoad: true, getDetailsLoad: true, error: null };

        case ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_SUCCESS:
            state.productDetailData = action.result
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///clearing particular reducer data
        case ApiConstants.SHOP_PRODUCT_CLEARING_REDUCER_DATA:
            if (action.dataName === "productDetailData") {
                // dummy object of product detail
                const defaultProductObject = {
                    productName: "",
                    description: "",
                    price: 0,
                    cost: 0,
                    tax: 0,
                    quantity: 0,
                    deliveryType: "",
                    variants: [],
                    images: [],
                    organisationUniqueKey: 0,
                }
                state.productDetailData = defaultProductObject
            }
            return {
                ...state, error: null
            };

        /////////////add to cart post api
        case ApiConstants.API_SHOP_POST_ADD_TO_CART_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SHOP_POST_ADD_TO_CART_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        default:
            return state;
    }
}

export default shopProductState;
