import { put, call } from "redux-saga/effects";
import ApiConstants from "../../themes/apiConstants";
import AxiosApi from "../http/axiosApi";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import RegistrationAxiosApi from "../http/registrationHttp/registrationAxios";
import CommonAxiosApi from "../http/commonHttp/commonAxios";
// import UserAxiosApi from "../http/userHttp/userAxiosApi.js";
////get the common year list reference
export function* getOnlyYearListSaga(action) {
  try {
    const result = isArrayNotEmpty(action.yearsArray) ? { status: 1, result: { data: action.yearsArray } } : yield call(AxiosApi.getYearList, action);
    if (result.status === 1) {


      yield put({
        type: ApiConstants.API_ONLY_YEAR_LIST_SUCCESS,
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

////get the common year list reference
export function* getYearListSaga(action) {
  try {
    const result = yield call(AxiosApi.getYearList, action);
    if (result.status === 1) {
      const resultCompetition = yield call(
        RegistrationAxiosApi.getCompetitionTypeList,
        result.result.data[0].id
      );
      if (resultCompetition.status === 1) {
        yield put({
          type: ApiConstants.API_YEAR_LIST_SUCCESS,
          result: result.result.data,
          competetionListResult: resultCompetition.result.data,
          status: result.status
        });
        if (isArrayNotEmpty(resultCompetition.result.data)) {
          const resultMembershipProduct = yield call(
            RegistrationAxiosApi.getMembershipProductList,
            resultCompetition.result.data[0].competitionId
          );
          if (resultMembershipProduct.status === 1) {
            const getRegistrationFormData = yield call(
              RegistrationAxiosApi.getRegistrationForm,
              result.result.data[0].id,
              resultCompetition.result.data[0].competitionId
            );
            if (getRegistrationFormData.status === 1) {
              yield put({
                type: ApiConstants.API_GET_REG_FORM_SUCCESS,
                MembershipProductList: resultMembershipProduct.result.data,
                result: getRegistrationFormData.status === 1 ? getRegistrationFormData.result.data : [],
                status: result.status
              });
            }
          }
        }
      }
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


/////get the common membership product validity type list reference
export function* getProductValidityListSaga(action) {
  try {
    const result = yield call(AxiosApi.getProductValidityList, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_PRODUCT_VALIDITY_LIST_SUCCESS,
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

/////get the common Competition type list reference
export function* getCompetitionTypeListSaga(action) {
  try {
    const result = yield call(RegistrationAxiosApi.getCompetitionTypeList, action.year);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_COMPETITION_TYPE_LIST_SUCCESS,
        result: result.result.data,
        status: result.status
      });
      if (isArrayNotEmpty(result.result.data)) {
        const resultMembershipProduct = yield call(
          RegistrationAxiosApi.getMembershipProductList,
          result.result.data[0].competitionId
        );
        if (resultMembershipProduct.status === 1) {
          const getRegistrationFormData = yield call(
            RegistrationAxiosApi.getRegistrationForm,
            action.year,
            result.result.data[0].competitionId
          );
          // if (getRegistrationFormData.status === 1) {
          yield put({
            type: ApiConstants.API_GET_REG_FORM_SUCCESS,
            MembershipProductList: resultMembershipProduct.result.data,
            result: getRegistrationFormData.status === 1 ? getRegistrationFormData.result.data : [],
            status: result.status
          });
          // }
        }
      }
    } else {
      yield put({ type: ApiConstants.API_APP_FAIL });
      setTimeout(() => {
        // alert(result.data.message);
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


////
// export function* getRoleSaga(action) {
//   try {
//     const result = yield call(UserAxiosApi.role, action);
//     if (result.status === 1) {
//       yield put({
//         type: ApiConstants.API_ROLE_SUCCESS,
//         result: result.result.data,
//         status: result.status
//       });
//     } else {
//       yield put({ type: ApiConstants.API_APP_FAIL });
//       setTimeout(() => {
//         alert(result.data.message);
//       }, 800);
//     }
//   } catch (error) {
//     yield put({
//       type: ApiConstants.API_APP_ERROR,
//       error: error,
//       status: error.status
//     });
//   }
// }

// ///////Ure Saga///////
// export function* getUreSaga(action) {
//   try {
//     const result = yield call(UserAxiosApi.ure, action);
//     if (result.status === 1) {
//       yield put({
//         type: ApiConstants.API_URE_SUCCESS,
//         result: result.result.data,
//         status: result.status
//       });
//     } else {
//       yield put({ type: ApiConstants.API_APP_FAIL });
//       setTimeout(() => {
//         alert(result.data.message);
//       }, 800);
//     }
//   } catch (error) {
//     yield put({
//       type: ApiConstants.API_APP_ERROR,
//       error: error,
//       status: error.status
//     });
//   }
// }

export function* getVenuesTypeSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.getVenue, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_FORM_VENUE_SUCCESS,
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

export function* getRegFormAdvSettings(action) {
  try {
    const result = yield call(AxiosApi.getRegFormSetting, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_FORM_SETTINGS_SUCCESS,
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

export function* getRegFormMethod(action) {
  try {
    const result = yield call(AxiosApi.getRegFormMethod, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_REG_FORM_METHOD_SUCCESS,
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


/////get the common Membership Product Fees Type
export function* getMembershipProductFeesTypeSaga(action) {
  try {
    const result = yield call(AxiosApi.getMembershipProductFeesType, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_COMMON_MEMBERSHIP_PRODUCT_FEES_TYPE_SUCCESS,
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

////get commom reference discount type
export function* getCommonDiscountTypeTypeSaga(action) {
  try {
    const result = yield call(AxiosApi.getCommonDiscountTypeType, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_COMMON_DISCOUNT_TYPE_SUCCESS,
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

///////competition format types in the competition fees section from the reference table
export function* getCompetitionFeeInitSaga(action) {
  try {
    const competitionType = yield call(CommonAxiosApi.getTypesOfCompetition, action);
    const competitionFormat = yield call(CommonAxiosApi.getCompetitionFormatTypes, action);
    const inviteesResult = yield call(CommonAxiosApi.getRegistrationInvitees, action);
    const paymentOptionResult = yield call(CommonAxiosApi.getPaymentOption, action);

    if (competitionType.status === 1) {
      yield put({
        type: ApiConstants.API_REG_COMPETITION_FEE_INIT_SUCCESS,
        compeitionTypeResult: competitionType.result.data,
        competitionFormat: competitionFormat.result.data,
        inviteesResult: inviteesResult.result.data,
        paymentOptionResult: paymentOptionResult.result.data,

        status: competitionType.status
      });
    } else {
      yield put({ type: ApiConstants.API_APP_FAIL });
      setTimeout(() => {
        alert(competitionType.data.message);
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

export function* getMatchTypesSaga(action) {
  try {
    const result = yield call(CommonAxiosApi.getMatchTypes, action);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.API_MATCH_TYPES_SUCCESS,
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
export function* getCompetitionTypesSaga(action) {
  try {
    const competitionType = yield call(CommonAxiosApi.getTypesOfCompetition, action);

    if (competitionType.status === 1) {
      yield put({
        type: ApiConstants.API_COMPETITION_TYPES_SUCCESS,
        result: competitionType.result.data,
        status: competitionType.status
      });
    } else {
      yield put({ type: ApiConstants.API_APP_FAIL });
      setTimeout(() => {
        alert(competitionType.data.message);
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

export function* getCompetitionFormatTypesSaga(action) {
  try {
    const competitionFormat = yield call(CommonAxiosApi.getCompetitionFormatTypes, action);

    if (competitionFormat.status === 1) {
      yield put({
        type: ApiConstants.API_COMPETITION_FORMAT_TYPES_SUCCESS,
        result: competitionFormat.result.data,
        status: competitionFormat.status
      });
    } else {
      yield put({ type: ApiConstants.API_APP_FAIL });
      setTimeout(() => {
        alert(competitionFormat.data.message);
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

////get the common year list reference
export function* getOnlyYearAndCompetitionListSaga(action) {
  console.log(action, 'YearSaga')
  try {
    const result = isArrayNotEmpty(action.yearData) ? { status: 1, result: { data: action.yearData } } : yield call(CommonAxiosApi.getYearList, action);
    if (result.status === 1) {
      let yearId = action.yearId == null ? result.result.data[0].id : action.yearId
      const resultCompetition = yield call(RegistrationAxiosApi.getCompetitionTypeList, yearId);
      if (resultCompetition.status === 1) {
        yield put({
          type: ApiConstants.API_GET_YEAR_COMPETITION_SUCCESS,
          yearList: result.result.data,
          competetionListResult: resultCompetition.result.data,
          status: result.status,
          selectedYearId: yearId,
          key: action.key
        });
      }
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
