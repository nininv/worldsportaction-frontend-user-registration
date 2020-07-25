import { takeEvery, takeLatest } from "redux-saga/effects";
import { loginApiSaga } from "./authenticationSaga";

import ApiConstants from "../../themes/apiConstants";

import { getOnlyYearListSaga} from "./appSaga";

import {
  getCommonDataSaga, gradesReferenceListSaga, countryReferenceSaga,
  registrationOtherInfoReferenceSaga, firebirdPlayerReferenceSaga, favouriteTeamReferenceSaga,
  nationalityReferenceSaga, heardByReferenceSaga, playerPositionReferenceSaga,
  genderReferenceSaga, disabilityReferenceSaga, personRegisteringRoleReferenceSaga
} from "./commonSaga/commonSaga";

// UserSaga
import * as userSaga from '../saga/userSaga/userSaga';
// EndUserRegistrationSaga
import * as endUserRegSaga from '../saga/registrationSaga/endUserRegistrationSaga';

//Live Score
import { getLiveScoreFixtureCompSaga } from "./liveScoreSaga/liveScoreFixtureCompSaga";
import { liveScoreLaddersListSaga } from './liveScoreSaga/liveScoreLadderSaga';
import * as divisionsaga from "../saga/liveScoreSaga/liveScoreDivisionSaga"
import { liveScoreRoundSaga, liveScoreRoundListSaga } from './liveScoreSaga/liveScoreRoundSaga';
import * as stripeSaga from "../saga/stripeSaga/stripeSaga"
import * as shopProductSaga from "../saga/shopSaga/productSaga";

export default function* root_saga() {
  yield takeEvery(ApiConstants.API_LOGIN_LOAD, loginApiSaga);
  yield takeEvery(ApiConstants.API_ROLE_LOAD, userSaga.getRoleSaga);
  yield takeEvery(ApiConstants.API_URE_LOAD, userSaga.getUreSaga);

  yield takeEvery(ApiConstants.API_ONLY_YEAR_LIST__LOAD, getOnlyYearListSaga);

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

  /// Disability Reference Saga
  yield takeEvery(ApiConstants.API_DISABILITY_REFERENCE_LOAD, disabilityReferenceSaga)

  // Live Score

  yield takeEvery(ApiConstants.API_LIVE_SCORE_GET_FIXTURE_COMP_LOAD, getLiveScoreFixtureCompSaga)

  yield takeEvery(ApiConstants.API_LIVE_SCORE_LADDERS_LIST_LOAD, liveScoreLaddersListSaga)

  // liveScore division saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ONLY_DIVISION_LOAD, divisionsaga.liveScoreDivisionsaga)

  //// Round List Saga
  yield takeEvery(ApiConstants.API_LIVE_SCORE_ROUND_LIST_LOAD, liveScoreRoundListSaga)

  /////API_GET_INVOICE data
  yield takeEvery(ApiConstants.API_GET_INVOICE_LOAD, stripeSaga.getInvoiceSaga)

  ////////invoice save post api
  yield takeEvery(ApiConstants.API_SAVE_INVOICE_LOAD, stripeSaga.saveInvoiceSaga)

  ////////invoice save post api
  yield takeEvery(ApiConstants.API_GET_INVOICE_STATUS_LOAD, stripeSaga.getInvoiceStatusSaga)

  /// Person Registering Role Reference Saga
   yield takeEvery(ApiConstants.API_PERSON_REGISTERING_ROLE_REFERENCE_LOAD, personRegisteringRoleReferenceSaga)

  //EndUserRegistration Membership Products
  yield takeEvery(ApiConstants.API_GET_INVITED_TEAM_REG_INFO_LOAD, endUserRegSaga.getInvitedTeamRegInfoSaga)

  //Update Team Registration Invite
  yield takeEvery(ApiConstants.API_UPDATE_TEAM_REGISTRATION_INIVTE_LOAD, endUserRegSaga.teamRegistrationInviteUpdateSaga)

  
  //UserModule Personal Info
  yield takeEvery(ApiConstants.API_USER_MODULE_PERSONAL_DETAIL_LOAD, userSaga.getUserModulePersonalDataSaga)

  //UserModule Personal Info by competition
  yield takeEvery(ApiConstants.API_USER_MODULE_PERSONAL_BY_COMPETITION_LOAD, userSaga.getUserModulePersonalByCompDataSaga)

  //UserModule Registration
  yield takeEvery(ApiConstants.API_USER_MODULE_REGISTRATION_LOAD, userSaga.getUserModuleRegistrationDataSaga)

 // User Module Activity Player
 yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_PLAYER_LOAD, userSaga.getUserModuleActivityPlayerSaga)

 // User Module Activity Parent
 yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_PARENT_LOAD, userSaga.getUserModuleActivityParentSaga)

 // User Module Activity Scorer
 yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_SCORER_LOAD, userSaga.getUserModuleActivityScorerSaga)

 // User Module Activity Manager
 yield takeEvery(ApiConstants.API_USER_MODULE_ACTIVITY_MANAGER_LOAD, userSaga.getUserModuleActivityManagerSaga)

  // User Module Medical Info
  yield takeEvery(ApiConstants.API_USER_MODULE_MEDICAL_INFO_LOAD, userSaga.getUserModuleMedicalInfoSaga)

  yield takeEvery(ApiConstants.API_USER_PROFILE_UPDATE_LOAD, userSaga.updateUserProfileSaga)

  //Terms and Conditions
  yield takeEvery(ApiConstants.API_GET_TERMS_AND_CONDITION_LOAD, endUserRegSaga.getTermsAndConditionsSaga)

  //Terms and Conditions
  yield takeEvery(ApiConstants.API_GET_REGISTRATION_PRODUCT_FEES_LOAD, endUserRegSaga.getRegistrationProductFeesSaga)
  
  // user history
  yield takeEvery(ApiConstants.API_USER_MODULE_HISTORY_LOAD, userSaga.getUserHistorySaga)
  
  //////shop product listing
  yield takeEvery(ApiConstants.API_GET_SHOP_PRODUCT_LISTING_LOAD, shopProductSaga.getProductListingSaga)

  ////////////get reference type in the add product screen
  yield takeEvery(ApiConstants.API_GET_TYPES_LIST_IN_ADD_PROUCT_LOAD, shopProductSaga.getTypesOfProductSaga)

   ///////////////////product details on id API
   yield takeEvery(ApiConstants.API_SHOP_GET_PRODUCT_DETAILS_BY_ID_LOAD, shopProductSaga.getProductDetailsByIdSaga)
}
