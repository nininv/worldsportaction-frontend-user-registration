import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import AxiosApi from "../../http/registrationHttp/registrationAxios";
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
        message.error("Something went wrong.");
    }, 800);
}

export function* orgTeamRegistrationSettings(action) {
    try {
      const result = yield call(AxiosApi.getOrgRegistrationRegistrationSettings, 
            action.payload);
      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_ORG_TEAM_REGISTRATION_SETTINGS_SUCCESS,
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

export function* saveTeamData(action) {
    try {
        const result = yield call(AxiosApi.saveParticipantData,action.payload);
        if (result.status === 1) {
        yield put({
            type: ApiConstants.API_SAVE_TEAM_SUCCESS,
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

export function* getTeamDataById(action) {
    try {
        const result = yield call(AxiosApi.getParticipantDataById,action.participantKey,action.registrationKey);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TEAM_BY_ID_SUCCESS,
                result: result.result.data,
                participantId: action.participantKey,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        console.log("error in saga",error);
        yield call(errorSaga, error)
    }
}

export function* getExistingTeamDataById(action) {
    try {
        const result = yield call(AxiosApi.getExistingTeamDataById,action.participantKey);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_EXISTING_TEAM_BY_ID_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        console.log("error in saga",error);
        yield call(errorSaga, error)
    }
}

