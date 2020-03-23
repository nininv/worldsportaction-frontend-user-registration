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


/* Get the Affiliates Listing  */
export function* getAffiliatesListingSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliatesListing, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATES_LISTING_SUCCESS,
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

/* Save the Affilaite Saga */
export function* saveAffiliateSaga(action) {
    try {
        const result = yield call(
            userHttpApi.saveAffiliate,
            action.payload
        );
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_SAVE_AFFILIATE_SUCCESS,
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

/* Get the Affiliate by Organisation Id  */
export function* getAffiliateByOrganisationIdSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateByOrganisationId, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_BY_ORGANISATION_SUCCESS,
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

/* Get the Affiliate Our Organisation Id  */
export function* getAffiliateOurOrganisationIdSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateByOrganisationId, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_OUR_ORGANISATION_SUCCESS,
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

/* Get the AffiliatedToOrganisation  */
export function* getAffiliatedToOrganisationSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateToOrganisation, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_TO_ORGANISATION_SUCCESS,
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

// getOrganisationForVenueSaga 
export function* getOrganisationForVenueSaga(action) {
    try {
        const result = yield call(userHttpApi.getVenueOrganisation);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_ORGANISATION_SUCCESS,
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

/* Delete Affiliate  */
export function* deleteAffiliateSaga(action) {
    try {
        const result = yield call(userHttpApi.affiliateDelete, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_AFFILIATE_DELETE_SUCCESS,
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