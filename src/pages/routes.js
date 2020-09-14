import React from "react";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import { Skeleton } from "antd";
import PrivateRoute from "../util/protectedRoute";
import AppRegistrationForm from "../components/registration/appRegistrationForm";
import AppRegistrationFormNew from "../components/registration/appRegistrationFormNew";
import NotFound from "./404";
import UserRegistration from "../components/userRegistration";
import Login from '../components/login';
import AppRegistrationSuccess from "../components/registration/appRegistrationSuccess";
import Stripe from "../components/stripe/stripe";
import RegistrationInvoice from "../components/stripe/registrationInvoice"

// Live Score Screesn 
import LiveScorePublicLadder from "../components/liveScore/liveScorePublicLadder"
import LiveScoreSeasonFixture from "../components/liveScore/liveScoreSeasonFixture"

import TeamRegistration from "../components/registration/teamRegistration";
import TeamRegistrationForm from "../components/registration/teamRegistrationForm";

import UserModulePersonalDetail from "../components/user/userModulePersonalDetail";
import UserProfileEdit from "../components/user/userProfileEdit"
import DeRegistration from "../components/registration/deRegistration";
import RegistrationReviewForm from '../components/registration/registrationReviewForm';
import ReviewProducts from '../components/registration/reviewProducts';
import ListProducts from "../components/shop/listProducts";
import ProductDetails from "../components/shop/productDetails";
import TeamRegistrationReview from '../components/registration/teamRegistrationReview';
import TeamReviewProducts from '../components/registration/teamReviewProducts';
import RegistrationProducts from "../components/registration/registrationProducts";


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
        <Route exact path="/" render={() => <Redirect to="/userPersonal" />} />
        <PrivateRoute
          path="/appRegistrationFormOld"
          component={lazyLoad(AppRegistrationForm)}
        />
        <PrivateRoute
          path="/appRegistrationForm"
          component={lazyLoad(AppRegistrationFormNew)}
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

        <PrivateRoute
          path="/invoice"
          component={lazyLoad(RegistrationInvoice)}
        />

        <PrivateRoute
          path="/teamRegistration"
          component={lazyLoad(TeamRegistration)}
        />

        <PrivateRoute
          path="/teamRegistrationForm"
          component={lazyLoad(TeamRegistrationForm)}
        />

        <PrivateRoute
          path="/userPersonal"
          component={lazyLoad(UserModulePersonalDetail)}
        />
        <PrivateRoute
          path="/userProfileEdit"
          component={lazyLoad(UserProfileEdit)}
        />
        <PrivateRoute
          path="/deRegistration"
          component={lazyLoad(DeRegistration)}
        />
        <PrivateRoute
          path="/listProducts"
          component={lazyLoad(ListProducts)}
        />
        <PrivateRoute
          path="/productDetails"
          component={lazyLoad(ProductDetails)}
        />
        <PrivateRoute
          path="/registrationReview"
          component={lazyLoad(RegistrationReviewForm)}
        />
        <PrivateRoute
          path="/reviewProducts"
          component={lazyLoad(ReviewProducts)}
        />

        <PrivateRoute
          path="/teamRegistrationReview"
          component={lazyLoad(TeamRegistrationReview)}
        />
        <PrivateRoute
          path="/teamRegistrationReviewProducts"
          component={lazyLoad(TeamReviewProducts)}
        />

        <PrivateRoute
          path="/registrationProducts"
          component={lazyLoad(RegistrationProducts)}
        />

        <Route path="/" component={lazyLoad(NotFound)} />
        <Redirect from="*" to="/404" />
      </Switch>
    );
  }
}
export default Routes;
