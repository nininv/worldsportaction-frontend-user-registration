import { put, call } from "redux-saga/effects";
import ApiConstants from "../../../themes/apiConstants";
import userHttpApi from "../../http/userHttp/userAxiosApi";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_USER_FAIL });
    setTimeout(() => {
        alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_USER_ERROR,
        error: error,
        status: error.status
    });
}

export function* getRoleSaga(action) {
    try {
        const result = yield call(userHttpApi.role, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ROLE_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield put({ type: ApiConstants.API_APP_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_APP_ERROR,
            error: error,
            status: error.status
        });
    }
}

///////Ure Saga///////
export function* getUreSaga(action) {
    try {
        const result = yield call(userHttpApi.ure, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_URE_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield put({ type: ApiConstants.API_APP_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_APP_ERROR,
            error: error,
            status: error.status
        });
    }
}

//get particular user organisation 
export function* getUserOrganisationSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserOrganisation);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_USER_ORGANISATION_SUCCESS,
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


/* Get the User Module Personal Data */
export function* getUserModulePersonalDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModulePersonalData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_SUCCESS,
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

/* Get the User Module Personal by Competition Data */
export function* getUserModulePersonalByCompDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModulePersonalByCompData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_SUCCESS,
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

/* Get the User Module Medical Info */
export function* getUserModuleMedicalInfoSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleMedicalInfo, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_MEDICAL_INFO_SUCCESS,
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

/* Get the User Module Registration by Competition Data */
export function* getUserModuleRegistrationDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleRegistrationData, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_REGISTRATION_SUCCESS,
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

/* Get the User Module Activity Player */
export function* getUserModuleActivityPlayerSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityPlayer, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_SUCCESS,
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

/* Get the User Module Activity Parent */
export function* getUserModuleActivityParentSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityParent, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_SUCCESS,
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

/* Get the User Module Activity Scorer */
export function* getUserModuleActivityScorerSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityScorer, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_SUCCESS,
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

/* Get the User Module Activity Manager */
export function* getUserModuleActivityManagerSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleActivityManager, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_SUCCESS,
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


export function* updateUserProfileSaga(action) {
    try {
        const result = yield call(userHttpApi.updateUserProfile, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS,
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


/* Get the User History */
export function* getUserHistorySaga(action) {
    try {
        const result = yield call(userHttpApi.getUserHistory, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_MODULE_HISTORY_SUCCESS,
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