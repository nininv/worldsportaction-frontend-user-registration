import { put, call } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
    setTimeout(() => {
        alert(result.message);
    }, 800);
}

function* errorSaga(error) {
    yield put({
        type: ApiConstants.API_COMMON_SAGA_ERROR,
        error: error,
        status: error.status
    });
}

////get the common year list reference
export function* getCommonDataSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonData);
        console.log(result, 'CommonResult')
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_COMMON_REF_DATA_SUCCESS,
                result: result.result.data,
                status: result.status
            });
        } else {
            yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
            setTimeout(() => {
                alert(result.data.message);
            }, 800);
        }
    } catch (error) {
        yield put({
            type: ApiConstants.API_COMMON_SAGA_ERROR,
            error: error,
            status: error.status
        });
    }
}

///////get the grades reference data 
export function* gradesReferenceListSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.gradesReferenceList);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GRADES_REFERENCE_LIST_SUCCESS,
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

// Get the favourite Team
export function* favouriteTeamReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.favouriteTeamReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_FAVOURITE_TEAM_REFERENCE_SUCCESS,
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

// Get the Firebird Player List
export function* firebirdPlayerReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.firebirdPlayer);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_SUCCESS,
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

// Get the Registration Other Info List
export function* registrationOtherInfoReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.registrationOtherInfo);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_SUCCESS,
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

// Get the Country List
export function* countryReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.countryReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_COUNTRY_REFERENCE_SUCCESS,
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

// Get the Nationality Reference List
export function* nationalityReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.nationalityReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_NATIONALITY_REFERENCE_SUCCESS,
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

// Get the HeardBy Reference List
export function* heardByReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.heardByReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_HEARDBY_REFERENCE_SUCCESS,
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

// Get the Player Position Saga
export function* playerPositionReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.playerPosition);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_PLAYER_POSITION_REFERENCE_SUCCESS,
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


// Get the Gender Reference Saga
export function* genderReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.gender);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GENDER_REFERENCE_SUCCESS,
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



