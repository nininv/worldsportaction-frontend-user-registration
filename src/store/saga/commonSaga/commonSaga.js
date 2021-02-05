import { put, call, takeEvery } from 'redux-saga/effects'
import ApiConstants from "../../../themes/apiConstants";
import CommonAxiosApi from "../../http/commonHttp/commonAxios";
import RegistrationAxiosApi from "../../http/registrationHttp/registrationAxios";
import CompetitionAxiosApi from "../../http/competitionHttp/competitionAxiosApi";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { message } from "antd";
import AppConstants from "../../../themes/appConstants";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_COMMON_SAGA_FAIL });
    setTimeout(() => {
        message.error(result.result.data.message);
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

// Get the Disability Reference Saga
export function* disabilityReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.disability);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_DISABILITY_REFERENCE_SUCCESS,
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


// Get the Person Registering Role Reference Saga
export function* personRegisteringRoleReferenceSaga(action) {
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.personRegRoleRef);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_PERSON_REGISTERING_ROLE_REFERENCE_SUCCESS,
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

export function* identificationReferenceSaga(action){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.identifyAs);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_IDENTIFICATION_REFERENCE_SUCCESS,
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

export function* otherSportsReferenceSaga(action){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.otherSports);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_OTHER_SPORTS_REFERENCE_SUCCESS,
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

export function* accreditationUmpireReferenceSaga(action){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.accreditationUmpire);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ACCREDITATION_UMPIRE_REFERENCE_SUCCESS,
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

export function* accreditationCoachReferenceSaga(action){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.accreditationCoach);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ACCREDITATION_COACH_REFERENCE_SUCCESS,
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

export function* walkingNetballQuesReferenceSaga(action){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.walkingNetball);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_WALKING_NETBALL_QUES_REFERENCE_SUCCESS,
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

export function* getSchoolsSaga(action){
    try {
        const result = yield call(CommonAxiosApi.getSchools,action.stateRefId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_SCHOOLS_SUCCESS,
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

export function* validateRegistrationCapSaga(action){
    try {
        const result = yield call(RegistrationAxiosApi.validateRegistrationCap,action.payload);
        if (result.status === 1 || result.status === 4) {
            yield put({
                type: ApiConstants.API_VALIDATE_REGISTRATION_CAP_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        }else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
}

export function* netSetGoTshirtSizeSaga(){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference,AppConstants.tShirtSizeList);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_NETSETGO_TSHIRT_SIZE_SUCCESS,
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

export function* accreditationUmpireCoachReferenceSaga() {
    try {
        const result = yield call(CommonAxiosApi.getCombinedUmpireCoachAccreditationReference);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ACCREDITATION_UMPIRE_COACH_COMBINED_REFERENCE_SUCCESS,
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

export function* getRefereeOffenceListSaga(){
    try {
        const result = yield call(CommonAxiosApi.getCommonReference, AppConstants.refereeOffence);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REFEREE_OFFENCE_LIST_LOAD_SUCCESS,
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
