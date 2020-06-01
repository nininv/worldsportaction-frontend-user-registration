import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/stripeHttp/stripeAxios";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_STRIPE_API_FAIL,
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
    yield put({
        type: ApiConstants.API_STRIPE_API_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1
        })
        message.error("Something went wrong.");
    }, 800);
}


//get invoice saga
export function* getInvoiceSaga(action) {
    try {
        const result = yield call(AxiosApi.getInvoice, action.registrationid);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_INVOICE_SUCCESS,
                result: result.result.data,
                status: result.result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}
