import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
import { message } from "antd";

function* failSaga(result) {
    yield put({
      type: ApiConstants.API_DE_REGISTER_FAIL,
      error: result,
      status: result.status
    });
    setTimeout(() => {
      message.error(result.result.data.message);
    }, 800);
  }
  
  function* errorSaga(error) {
    yield put({
      type: ApiConstants.API_DE_REGISTER_ERROR,
      error: error,
      status: error.status
    });
    setTimeout(() => {
      // message.error(error.result.data.message);
      message.error("Something went wrong.");
    }, 800);
  }

  
  ////// Get DeRegister Data
export function* getDeRegisterSaga(action) {
    try {
      const result = yield call(AxiosApi.getDeRegisterData, action.userId);
      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_GET_DE_REGISTRATION_SUCCESS,
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
   
  ////// Save DeRegister Data
export function* saveDeRegisterSaga(action) {
    try {
      const result = yield call(AxiosApi.saveDeRegister, action.payload);
      if (result.status === 1) {
        message.config({maxCount: 1, duration: 0.9 })
        message.success(result.result.data.message);
        yield put({
          type: ApiConstants.API_SAVE_DE_REGISTRATION_SUCCESS,
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

  
  ////// Get getTransferOrganisations
export function* getTransferOrganisationsSaga(action) {
  try {
    const result = yield call(AxiosApi.getTransferOrganisationsData, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_TRANSFER_COMPETITIONS_SUCCESS,
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

  
