import { combineReducers } from "redux";
import LoginState from "./authenticationReducer";
import MenuNavigationState from "./menuNavigationReducer";
import AppState from "./appReducer";

////Year and Competition
import CommonAppState from './appReducer'
import CommonReducerState from "./commonReducer/commonReducer";
import EndUserRegistrationState from "./registrationReducer/endUserRegistrationReducer";
import UserState from "./userReducer/userReducer";

import LiveScoreFixturCompState from './liveScoreReducer/liveScoreFixtureCompetitionReducer';
import LiveScoreLadderState from './liveScoreReducer/liveScoreLadderReducer'
import LiveScoreRoundState from './liveScoreReducer/liveScoreRound';
import StripeState from "./stripeReducer/stripeReducer";

const rootReducer = combineReducers({
  LoginState,
  MenuNavigationState,
  AppState,
  CommonAppState,
  UserState,
  EndUserRegistrationState,
  CommonReducerState,
  LiveScoreFixturCompState,
  LiveScoreLadderState,
  LiveScoreRoundState,
  StripeState,
});

export default rootReducer;
