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


  
////// EndUserRegistration Save 
export function* endUserRegistrationSaveSaga(action) {
    try {
      const result = yield call(AxiosApi.saveEndUserRegistration, 
            action.payload);
      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_SAVE_END_USER_REGISTRATION_SUCCESS,
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

  ////// Org Registration Registration Settings
export function* orgRegistrationRegistrationSettings(action) {
    try {
      const result = yield call(AxiosApi.getOrgRegistrationRegistrationSettings, 
            action.payload);
      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_SUCCESS,
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

////// EndUserRegistration Membership Products 
export function* endUserRegistrationMembershipProducts(action) {
    try {
      const result = yield call(AxiosApi.getEndUserRegMembershipProducts, 
            action.payload);
      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_SUCCESS,
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

  ////// EndUserRegistration Get User Info
export function* endUserRegistrationUserInfoSaga(action) {
  try {
    const result = yield call(AxiosApi.getEndUserRegUserInfo, 
          action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_SUCCESS,
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

////// Get Invited Team Reg Info
export function* getInvitedTeamRegInfoSaga(action) {
  try {
    const result = yield call(AxiosApi.getInvitedTeamRegInfo, 
          action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_INVITED_TEAM_REG_INFO_SUCCESS,
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

 
////// Team Registration Invite Update
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


////// Get Terms and conditions 
export function* getTermsAndConditionsSaga(action) {
  try {
    const result = yield call(AxiosApi.getTermsAndConditions, action.payload);
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


////// Get Registration Product Fees
export function* getRegistrationProductFeesSaga(action) {
  try {
    const result = yield call(AxiosApi.getRegistrationProductFees, action.payload);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_GET_REGISTRATION_PRODUCT_FEES_SUCCESS,
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