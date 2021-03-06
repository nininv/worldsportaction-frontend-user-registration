import { put, call } from "redux-saga/effects";

import ApiConstants from "../../../themes/apiConstants";
import userHttpApi from "../../http/userHttp/userAxiosApi";
import registrationAxiosApi from "../../http/registrationHttp/registrationAxios";
import livescoreAxiosApi from "../../http/liveScoreHttp/liveScoreAxiosApi";
import ShopAxiosApi from "../../http/shopHttp/shopAxios";
import history from "../../../util/history";
import { message } from "antd";

function* failSaga(result) {
    yield put({ type: ApiConstants.API_USER_FAIL });
    setTimeout(() => {
        message.config({
            duration: 1.5,
            maxCount: 1,
          });
          message.error(result.result.data.message)
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

export function* getUserModuleTeamMembersDataSaga(action) {
    try {
        const result = yield call(userHttpApi.getUserModuleTeamMembersData, action.payload);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_USER_MODULE_TEAM_MEMBERS_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
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
        if (result.status === 1 || result.status === 4) {
            yield put({
                type: ApiConstants.API_USER_PROFILE_UPDATE_SUCCESS,
                result: result.status == 1 ? result.result.data : result.result.data.message,
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

// Get the User Role
export function* getUserRole(action) {
    try {
        const result = yield call(userHttpApi.getUserRoleData, action.userId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_USER_ROLE_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* getUserParentData(action) {
    try {
        const result = yield call(userHttpApi.getUserParentData, action.data);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_USER_PARENT_DATA_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

// Get the Scorer Activity Data
export function* getScorerActivitySaga(action) {
    try {
        const result = yield call(userHttpApi.getScorerActivityData, action.payload, action.roleId, action.matchStatus);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_SCORER_ACTIVITY_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

// Get the umpire Activity Data
export function* getUmpireActivityListSaga(action) {
    try {
        const result = yield call(livescoreAxiosApi.getUmpireActivityList, action.payload, action.roleId, action.userId, action.sortBy, action.sortOrder);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_UMPIRE_ACTIVITY_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}


// /////////get all the organisations without authentication and userId
export function* getAllOrganisationListSaga(action) {
    try {
        const result = yield call(userHttpApi.getAllOrganisationList, action);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_ALL_ORGANISATION_LIST_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* saveUserPhotosSaga(action) {
    try {
        const result = yield call(userHttpApi.saveUserPhoto, action.payload, action.userId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_USER_PHOTO_UPDATE_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* registrationResendEmailSaga(action){
    try {
        const result = yield call(userHttpApi.registrationResendEmail, action.teamId);

        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_REGISTRATION_RESEND_EMAIL_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* teamMembersSaveSaga(action) {
    try {
        const result = yield call(registrationAxiosApi.teamMembersSave, action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_TEAM_MEMBERS_SAVE_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* getTeamMembersSaga(action) {
    try {
        const result = yield call(registrationAxiosApi.getTeamMembers,action.teamMemberRegId);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TEAM_MEMBERS_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* getTeamMembersReviewSaga(action) {
    try {
        const result = yield call(registrationAxiosApi.getTeamMembersReview,action.payload);
        if (result.status === 1) {
            yield put({
                type: ApiConstants.API_GET_TEAM_MEMBERS_REVIEW_SUCCESS,
                result: result.result.data,
                status: result.status,
            });
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* addChildSaga(action) {
    try {
        const result = yield call(userHttpApi.addChild, action.payload);

        if (result.status === 1 || result.status === 4) {
            yield put({
                type: ApiConstants.API_ADD_CHILD_SUCCESS,
            });
            history.goBack();
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* addParentSaga(action) {
    try {
        const result = yield call(userHttpApi.addParent, action.payload);

        if (result.status === 1 || result.status === 4) {
            yield put({
                type: ApiConstants.API_ADD_PARENT_SUCCESS,
            });
            history.goBack();
        } else {
            yield call(failSaga, result);
        }
    } catch (error) {
        yield call(errorSaga, error);
    }
}

export function* updateTeamMembersSaga(action) {
    try {
      const result = yield call(registrationAxiosApi.updateTeamMembers, action.data);

      if (result.status === 1 || result.status === 4) {
        yield put({
          type: ApiConstants.API_TEAM_MEMBER_UPDATE_SUCCESS,
          result: result.status == 1 ? result.result.data : result.result.data.message,
          status: result.status,
        });
      } else {
        yield call(failSaga, result);
      }
    } catch (error) {
      yield call(errorSaga, error);
    }
  }

export function* getUsersByRoleSaga(action) {
    try {
      const result = yield call(userHttpApi.getUsersByRole, action.data);

      if (result.status === 1) {
        yield put({
          type: ApiConstants.API_GET_USERS_BY_ROLE_SUCCESS,
          result: result.result.data,
          status: result.status,
        });
      } else {
        yield call(failSaga, result);
      }
    } catch (error) {
      yield call(errorSaga, error);
    }
  }

  export function* cancelDeRegistrationSaga(action) {
    try {
        const result = yield call(registrationAxiosApi.cancelDeRegistration, action.payload);
        if (result.status === 1) {
            message.success(result.result.data.message)
            yield put({
                type: ApiConstants.API_CANCEL_DEREGISTRATION_SUCCESS,
                // result: result.result.data,
                status: result.status
            });
        } else {
            yield call(failSaga, result)
        }
    } catch (error) {
        yield call(errorSaga, error)
    }
    }

    export function* liveScorePlayersToPayRetryPaymentSaga(action) {
        try {
            const result = yield call(registrationAxiosApi.playersToPayRetryPayment, action.payload);
            if (result.status === 1) {

                yield put({
                    type: ApiConstants.API_LIVE_SCORE_PLAYERS_TO_PAY_RETRY_PAYMENT_SUCCESS,
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

    export function* registrationRetryPaymentSaga(action) {
        try {
            const result = yield call(registrationAxiosApi.registrationRetryPayment, action.payload);
            if (result.status === 1) {
                yield put({
                    type: ApiConstants.API_REGISTRATION_RETRY_PAYMENT_SUCCESS,
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

    export function* getPurchasesSaga(action) {
        try {
            const result = yield call(ShopAxiosApi.getPurchasesListing, action.payload);
            if (result.status === 1) {
                yield put({
                    type: ApiConstants.API_USER_PURCHASES_SUCCESS,
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
