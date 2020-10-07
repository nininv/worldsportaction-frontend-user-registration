import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
import ShopAxiosApi from "../../http/shopHttp/shopAxios";
import { message } from "antd";


function* failSaga(result) {
    yield put({
      type: ApiConstants.API_END_USER_REGISTRATION_FAIL,
      error: result,
      status: result.status
    });
    setTimeout(() => {
      message.error(result.result.data.message);
    }, 800);
  }
  
  function* errorSaga(error) {
    yield put({
      type: ApiConstants.API_END_USER_REGISTRATION_ERROR,
      error: error,
      status: error.status
    });
    setTimeout(() => {
      // message.error(error.result.data.message);
      message.error("Something went wrong.");
    }, 800);
  }


////// Get Registration Review
export function* getRegistrationReviewSaga(action) {
  try {
    const result = yield call(AxiosApi.getRegistrationReview, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_REVIEW_SUCCESS,
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


////// Save Registration Review
export function* saveRegistrationReviewSaga(action) {
  try {
    const result = yield call(AxiosApi.saveRegistrationReview, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_SAVE_REGISTRATION_REVIEW_SUCCESS,
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

////// Delete Registration Product
export function* deleteRegistrationProductSaga(action) {
  try {
    const result = yield call(AxiosApi.deleteRegistrationProduct, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_DELETE_REGISTRATION_PRODUCT_SUCCESS,
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

////// Delete Registration Participant
export function* deleteRegistrationParticipantSaga(action) {
  try {
    const result = yield call(AxiosApi.deleteRegistrationParticipant, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_DELETE_REGISTRATION_PARTICIPANT_SUCCESS,
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

////// Get Terms and conditions 
export function* getTermsAndConditionsSaga(action) {
  try {
    const result = yield call(AxiosApi.getTermsAndConditions, action.payload);
    console.log('result.status ' + result.status );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_TERMS_AND_CONDITION_SUCCESS,
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


////// Get Registration By Id
export function* getRegistrationByIdSaga(action) {
  try {
    const result = yield call(AxiosApi.getRegistrationById, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_BY_ID_SUCCESS,
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


////// Get Registration Shop Products
export function* getRegistrationShopProductsSaga(action) {
  try {
    const result = yield call(ShopAxiosApi.getRegistrationShopProducts, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_SHOP_PRODUCTS_SUCCESS,
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


////// Get Registration By Id
export function* getRegParticipantUsersSaga(action) {
  try {
    const result = yield call(AxiosApi.getRegParticipantUsers, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_PARTICIPANT_USERS_SUCCESS,
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


////// Get Registration Particants Address
export function* getRegParticipantAddressSaga(action) {
  try {
    const result = yield call(AxiosApi.getRegParticipantAddress, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_PARTICIPANT_ADDRESS_SUCCESS,
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

////// Get Registration Shop Pickup Address
export function* getRegistrationShopPickupAddressSaga(action) {
  try {
    const result = yield call(ShopAxiosApi.getRegistrationShopPickupAddress, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_SHOP_PICKUP_ADDRESS_SUCCESS,
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
