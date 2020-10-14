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
        // message.error(error.result.data.message);
        message.error("Something went wrong.");
    }, 800);
}

export function* getInvitedTeamRegInfoSaga(action) {
    try {
        const result = yield call(AxiosApi.getInvitedTeamRegInfo, 
            action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TEAM_REGISTRATION_INVITE_INFO_SUCCESS,
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

export function* teamRegistrationInviteUpdateSaga(action) {
    try {
    const result = yield call(AxiosApi.updateTeamRegistrationInvite, 
            action.payload);
        if (result.status === 1) {
            yield put({
            type: ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_SUCCESS,
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

export function* orgTeamInviteRegistrationSettings(action) {
    try {
      const result = yield call(AxiosApi.getOrgRegistrationRegistrationSettings, 
            action.payload);
        if (result.status === 1) {
            yield put({
            type: ApiConstants.API_TEAM_INVITE_REG_SETTINGS_SUCCESS,
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

export function* getTeamInviteReviewSaga(action) {
    try {
        const result = yield call(AxiosApi.getTeamInviteReview, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TEAM_INVITE_REVIEW_SUCCESS,
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


////// Save Team Invite Review
export function* saveTeamInviteReviewSaga(action) {
    try {
      const result = yield call(AxiosApi.saveTeamInviteReview, action.payload);
      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_SAVE_TEAM_INVITE_REVIEW_SUCCESS,
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