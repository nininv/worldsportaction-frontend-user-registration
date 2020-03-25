import { takeEvery, takeLatest } from "redux-saga/effects";
import { loginApiSaga } from "./authenticationSaga";

import ApiConstants from "../../themes/apiConstants";

import {
  getCommonDataSaga, gradesReferenceListSaga, countryReferenceSaga,
  registrationOtherInfoReferenceSaga, firebirdPlayerReferenceSaga, favouriteTeamReferenceSaga,
  nationalityReferenceSaga, heardByReferenceSaga, playerPositionReferenceSaga,
  genderReferenceSaga
} from "./commonSaga/commonSaga";

// UserSaga
import * as userSaga from '../saga/userSaga/userSaga';
// EndUserRegistrationSaga
import * as endUserRegSaga from '../saga/registrationSaga/endUserRegistrationSaga';


export default function* root_saga() {
  yield takeEvery(ApiConstants.API_LOGIN_LOAD, loginApiSaga);
  yield takeEvery(ApiConstants.API_ROLE_LOAD, userSaga.getRoleSaga);
  yield takeEvery(ApiConstants.API_URE_LOAD, userSaga.getUreSaga);
  
  yield takeEvery(ApiConstants.API_GET_COMMON_REF_DATA_LOAD, getCommonDataSaga)
  /// Favourite Team Reference Saga
  yield takeEvery(ApiConstants.API_FAVOURITE_TEAM_REFERENCE_LOAD, favouriteTeamReferenceSaga)

  /// Firebird Player Reference Saga
  yield takeEvery(ApiConstants.API_FIREBIRD_PLAYER_REFERENCE_LOAD, firebirdPlayerReferenceSaga)

  /// Registration Other Info Reference Saga
  yield takeEvery(ApiConstants.API_REGISTRATION_OTHER_INFO_REFERENCE_LOAD, registrationOtherInfoReferenceSaga)

  /// Country Reference Saga
  yield takeEvery(ApiConstants.API_COUNTRY_REFERENCE_LOAD, countryReferenceSaga)

  /// Nationality Reference Saga
  yield takeEvery(ApiConstants.API_NATIONALITY_REFERENCE_LOAD, nationalityReferenceSaga)

  /// HeardBy Reference Saga
  yield takeEvery(ApiConstants.API_HEARDBY_REFERENCE_LOAD, heardByReferenceSaga)

  /// Player Position Saga
  yield takeEvery(ApiConstants.API_PLAYER_POSITION_REFERENCE_LOAD, playerPositionReferenceSaga)

  //EndUserRegistrationSave
  yield takeEvery(ApiConstants.API_SAVE_END_USER_REGISTRATION_LOAD, endUserRegSaga.endUserRegistrationSaveSaga)

  //get particular user organisation 
  yield takeEvery(ApiConstants.API_GET_USER_ORGANISATION_LOAD, userSaga.getUserOrganisationSaga)

  //EndUserRegistration Registration Settings
  yield takeEvery(ApiConstants.API_ORG_REGISTRATION_REG_SETTINGS_LOAD, endUserRegSaga.orgRegistrationRegistrationSettings)

  //EndUserRegistration Membership Products
  yield takeEvery(ApiConstants.API_MEMBERSHIP_PRODUCT_END_USER_REG_LOAD, endUserRegSaga.endUserRegistrationMembershipProducts)

  /// Gender Reference Saga
  yield takeEvery(ApiConstants.API_GENDER_REFERENCE_LOAD, genderReferenceSaga)

   /// Gender Reference Saga
   yield takeEvery(ApiConstants.API_USER_REGISTRATION_GET_USER_INFO_LOAD, endUserRegSaga.endUserRegistrationUserInfoSaga)

  

}