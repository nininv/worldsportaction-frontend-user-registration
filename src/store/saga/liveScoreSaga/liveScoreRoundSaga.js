import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_LIVE_SCORE_CREATE_ROUND_FAIL });
    setTimeout(() => {
        message.error(result.message)
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_CREATE_ROUND_ERROR,
        error: error,
        status: error.status
    });
    message.error("Something went wrong.")
}

export function* liveScoreRoundSaga(action) {

    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCreateRound,
            action.roundName, action.sequence, action.competitionID, action.divisionId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_CREATE_ROUND_SUCCESS,
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

export function* liveScoreRoundListSaga(action) {

    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreRound, action.competitionID);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ROUND_LIST_SUCCESS,
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