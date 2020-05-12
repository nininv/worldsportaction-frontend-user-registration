import React from "react";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import { Skeleton } from "antd";
import PrivateRoute from "../util/protectedRoute";
import AppRegistrationForm from "../components/registration/appRegistrationForm";
import NotFound from "./404";
import UserRegistration from "../components/userRegistration";
import Login from '../components/login';
import AppRegistrationSuccess from "../components/registration/appRegistrationSuccess";
import Stripe from "../components/stripe/stripe";

// Live Score Screesn 

import LiveScorePublicLadder from "../components/liveScore/liveScorePublicLadder"
import LiveScoreSeasonFixture from "../components/liveScore/liveScoreSeasonFixture"
const lazyLoad = Component => {
  const lazy = props => {
    return (
      <React.Suspense fallback={<Skeleton avatar paragraph={{ rows: 4 }} />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
  return lazy;
};

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/userRegistration" />} />
        <PrivateRoute
          path="/appRegistrationForm"
          component={lazyLoad(AppRegistrationForm)}
        />
        <PrivateRoute
          path="/login"
          component={lazyLoad(Login)}
        />
        <PrivateRoute
          path="/userRegistration"
          component={lazyLoad(UserRegistration)}
        />
        <PrivateRoute
          path="/appRegistrationSuccess"
          component={lazyLoad(AppRegistrationSuccess)}
        />
        <PrivateRoute
          path="/checkoutPayment"
          component={lazyLoad(Stripe)}
        />

        <PrivateRoute
          path="/liveScorePublicLadder"
          component={lazyLoad(LiveScorePublicLadder)}
        />

        <PrivateRoute
          path="/liveScoreSeasonFixture"
          component={lazyLoad(LiveScoreSeasonFixture)}
        />

        <Route path="/" component={lazyLoad(NotFound)} />
        <Redirect from="*" to="/404" />
      </Switch>
    );
  }
}
export default Routes;
