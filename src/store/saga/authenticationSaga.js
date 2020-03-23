import { put, call } from "redux-saga/effects";
import ApiConstants from "../../themes/apiConstants";
import userAxiosApi from "../http/userHttp/userAxiosApi";
import { message } from "antd";
import AppConstants from "../../themes/appConstants";


export function* loginApiSaga(action) {
  try {
    const result = yield call(userAxiosApi.Login, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_LOGIN_SUCCESS,
        result: result.result.data,
        status: result.status,
        loginData: action
      });
      // setTimeout(() => {
      //   message.success(result.result.data.message);
      // }, 800);
    } else {
      yield put({ type: ApiConstants.API_LOGIN_FAIL });
      setTimeout(() => {
        alert(result.data.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.API_LOGIN_ERROR,
      error: error,
      status: error.status
    });
    message.error(AppConstants.usernamePasswordIncorrect, 0.8);
    // alert(error.result);
  }
}
