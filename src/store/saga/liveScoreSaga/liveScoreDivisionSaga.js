import { put, call } from '../../../../node_modules/redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import LiveScoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import { message } from "antd";
import history from "../../../util/history";

function* failSaga(result) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_FAIL,
        error: result,
        status: result.status
    });
    setTimeout(() => {
        message.error(result.result.data.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_ERROR,
        error: error,
        status: error.status
    });
    setTimeout(() => {
        message.error(error ? error.error ? error.error : "Something went wrong." : "Something went wrong.");
    }, 800);
}

//////get the competition fee list in registration
export function* liveScoreDivisionsaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreGetDivision, action.competitionID, action.compKey);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_SUCCESS,
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

export function* liveScoreCreateDivisionsaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreCreateDivision,
            action.name,
            action.divisionName,
            action.gradeName,
            action.competitionId,
            action.divisionId);
        console.log(result)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_CREATE_DIVISION_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
            history.push("/liveScoreDivisionList")
            message.success("Division created successfully")

        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}


//// Delete Team Saga
export function* liveScoreDeleteDivisionSaga(action) {

    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreDeleteDivision, action.divisionId);
        console.log(action.divisionId, "action")
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_DELETE_DIVISION_SUCCESS,
                status: result.status,
            });
            history.push('/liveScoreDivisionList')
            message.success('Division Deleted Successfully.')
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* liveScoreDivisionImportSaga(action) {
    try {
        const result = yield call(LiveScoreAxiosApi.liveScoreDivisionImport, action.payload)
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_LIVE_SCORE_DIVISION_IMPORT_SUCCESS
            });
            history.push('/liveScoreDivisionList')
            message.success('Division Imported Successfully.')
        }
        else {
            yield call(failSaga, result)
        }
    } catch (e) {
        yield call(errorSaga, e)
    }

}

