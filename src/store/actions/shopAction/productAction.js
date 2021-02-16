import ApiConstants from "../../../themes/apiConstants";

//products shop get API
const getShopProductsAction = (payload) => ({
    type: ApiConstants.API_GET_SHOP_PRODUCTS_LOAD,
    payload
})

//organisations shop get API
const getShopOrganisationsAction = () => ({
    type: ApiConstants.API_GET_SHOP_ORGANISATIONS_LOAD
})

//cart shop get API
const getShopCartAction = (payload) => ({
    type: ApiConstants.API_GET_SHOP_CART_LOAD,
    payload
})

//cart shop save API
const saveShopCartAction = (payload) => ({
    type: ApiConstants.API_SAVE_SHOP_CART_LOAD,
    payload
})

//product listing get API
function getProductListingAction(organisationUniqueKeys, offset, limit, productType) {
    const action = {
        type: ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD,
        organisationUniqueKeys, offset, limit, productType
    };
    return action;
}

////get reference type in the add product screen
function getTypesOfProductAction() {
    const action = {
        type: ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD,
    };
    return action;
}

//product details on id API
function getProductDetailsByIdAction(productId) {
    const action = {
        type: ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD,
        productId
    };
    return action;
}

//////clearing particular reducer data
function clearProductReducer(dataName) {
    const action = {
        type: ApiConstants.SHOP_PRODUCT_CLEARING_REDUCER_DATA,
        dataName
    };
    return action;
}

//////add to cart post api
function addToCartAction(payload) {
    const action = {
        type: ApiConstants.API_SHOP_POST_ADD_TO_CART_LOAD,
        payload
    };
    return action;
}

export {
    getShopProductsAction,
    getShopOrganisationsAction,
    getShopCartAction,
    saveShopCartAction,
    getProductListingAction,
    getTypesOfProductAction,
    getProductDetailsByIdAction,
    clearProductReducer,
    addToCartAction,
}
