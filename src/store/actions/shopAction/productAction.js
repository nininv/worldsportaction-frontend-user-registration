import ApiConstants from "../../../themes/apiConstants";

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

export {
    getProductListingAction,
    getTypesOfProductAction,
    getProductDetailsByIdAction,
}
