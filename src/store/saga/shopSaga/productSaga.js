import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/shopHttp/shopAxios";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    console.log("failSaga", result.result.data.message)
    yield put({
        type: ApiConstants.API_SHOP_PRODUCT_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    console.log("errorSaga", error)
    yield put({
        type: ApiConstants.API_SHOP_PRODUCT_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error(AppConstants.somethingWentWrong);
    }, 800);
}

export function * getShopProductSaga(action) {
    try {
        const result = yield call(AxiosApi.getShopProduct, action.payload);
        yield put({
            type: ApiConstants.API_GET_SHOP_PRODUCTS_SUCCESS,
            result: result.result.data,
        });
    } catch (error) {
        yield put({
            type: ApiConstants.API_GET_SHOP_PRODUCTS_ERROR,
            error
        })
    }
}

export function * getShopOrganisationSaga() {
    try {
        const result = yield call(AxiosApi.getShopOrganisations);

        yield put({
            type: ApiConstants.API_GET_SHOP_ORGANISATIONS_SUCCESS,
            result: result.result.data
        })
    } catch (error) {
        yield put({
            type: ApiConstants.API_GET_SHOP_ORGANISATIONS_ERROR,
            error
        })
    }
}

export function * getShopCartSaga(action) {
    try {
        const result = yield call(AxiosApi.getShopCart, action.payload);
        const { shopUniqueKey, ...data } = result.result.data;
        localStorage.setItem('shopUniqueKey', shopUniqueKey);
        yield put({
            type: ApiConstants.API_GET_SHOP_CART_SUCCESS,
            result: data
        })
    } catch (error) {
        yield put({
            type: ApiConstants.API_GET_SHOP_CART_ERROR,
            error
        })
    }
}

export function * saveShopCartSaga(action) {
    try {
        const result = yield call(AxiosApi.saveShopCart, action.payload);
        const { shopUniqueKey, ...data } = result.result.data;
        yield put({
            type: ApiConstants.API_SAVE_SHOP_CART_SUCCESS,
            result: data
        })
    } catch (error) {
        yield put({
            type: ApiConstants.API_SAVE_SHOP_CART_ERROR,
            error
        })
    }
}

//////////product listing get API
export function* getProductListingSaga(action) {
    try {
        const result = yield call(AxiosApi.getProductListing, action.organisationUniqueKeys, action.offset, action.limit, action.productType);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_SHOP_PRODUCT_LISTING_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

//////////get reference type in the add product screen
export function* getTypesOfProductSaga(action) {
    try {
        const result = yield call(AxiosApi.getTypesOfProduct);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

///////////////////product details on id API
export function* getProductDetailsByIdSaga(action) {
    try {
        const result = yield call(AxiosApi.getProductDetailsById, action.productId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

/////////////////////add to cart post api
export function* addToCartSaga(action) {
    try {
        const result = yield call(AxiosApi.addToCart, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SHOP_POST_ADD_TO_CART_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            message.success(AppConstants.addedToCart);
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}
