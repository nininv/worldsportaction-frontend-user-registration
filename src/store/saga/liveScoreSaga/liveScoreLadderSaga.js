import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error("Something went wrong.");
    }, 800);
}

//////get the competition fee list in registration
export function* liveScoreLaddersDivisionsaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreLadderDivision, action.competitionID);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_LADDERS_DIVISION_SUCCESS,
                result: result.result.data,
                status: result.status,
            });

            let divisionId = result.result.data[0]
            // yield console.log('wo', divisionId)
            const listResult = yield call(LiveScoreAxiosApi.liveScoreLadderList, divisionId);
            if (listResult.status === 1) {
                yield put({
                    type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_SUCCESS,
                    result: listResult.result.data,
                    status: listResult.status,
                });
            } else {
                yield put({
                    type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_FAIL
                });
                setTimeout(() => {
                    alert(result.data.message)
                }, 800);
            }
        } else {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_LADDERS_DIVISION_FAIL
            });
            setTimeout(() => {
                alert(result.data.message)
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_LIVE_SCORE_LADDERS_DIVISION_ERROR,
            error: error,
            status: error.status
        });
    }

}

export function* liveScoreLaddersListSaga(action) {
    try {

        const result = yield call(LiveScoreAxiosApi.liveScoreLadderList, action.divisionID, action.competitionID, action.compKey);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_LADDERS_LIST_SUCCESS,
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