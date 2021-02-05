import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_UMPIRE_AVAILABILITY_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_UMPIRE_AVAILABILITY_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

///////////get umpire availability list
export function* getUmpireAvailabilitySaga(action) {
    const { fromTime, endTime, userId } = action;
    try {
        const result = yield call(LiveScoreAxiosApi.getUmpireAvailabilityList, userId, fromTime, endTime);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_GET_UMPIRE_AVAILABILITY_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

///////////get umpire availability list
export function* saveUmpireAvailabilitySaga(action) {
    try {
        const { postData, fromTime, endTime, userId } = action;
        const updateResult = yield call(LiveScoreAxiosApi.saveUmpireAvailabilityList, postData, userId, fromTime, endTime);

        if (updateResult.status === 1) {
            const result = yield call(LiveScoreAxiosApi.getUmpireAvailabilityList, userId, fromTime, endTime);

            if (result.status === 1) {
                yield put({
                    type: ApiConstants.API_LIVE_SCORE_SAVE_UMPIRE_AVAILABILITY_SUCCESS,
                    result: result.result.data,
                    status: result.status,
                });
                message.success('Schedule successfully updated')
            } else {
                yield call(failSaga, result);
            }
        }


    } catch (error) {
        yield call(errorSaga, error);
    }
}
