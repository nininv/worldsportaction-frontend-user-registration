import React from "react";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import { Skeleton } from "antd";
import PrivateRoute from "../util/protectedRoute";
// import AppRegistrationForm from "../components/registration/appRegistrationForm";
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

import UserModulePersonalDetail from "../components/user/userModulePersonalDetail";
import UserProfileEdit from "../components/user/userProfileEdit"
import DeRegistration from "../components/registration/deRegistration";
// import RegistrationReviewForm from '../components/registration/registrationReviewForm';
// import ReviewProducts from '../components/registration/reviewProducts';
import ListProducts from "../components/shop/listProducts";
import ProductDetails from "../components/shop/productDetails";
import TeamRegistrationReview from '../components/registration/teamRegistrationReview';
import TeamReviewProducts from '../components/registration/teamReviewProducts';
import RegistrationProducts from "../components/registration/registrationProducts";
import RegistrationShop from "../components/registration/registrationShop";
import RegistrationPayment from "../components/registration/registrationPayment";
import RegistrationShipping from "../components/registration/registrationShipping";
import AppTeamRegistrationForm from "../components/registration/appTeamRegistrationForm";
import TeamInviteForm from "../components/registration/teamInviteForm";
import TeamInviteProducts from "../components/registration/teamInviteProducts";
import TeamInviteShop from "../components/registration/teamInviteShop";
import TeamInvitePayment from "../components/registration/teamInvitePayment";
import TeamInviteShipping from "../components/registration/teamInviteShipping";


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
        {/* <PrivateRoute
          path="/appRegistrationFormOld"
          component={lazyLoad(AppRegistrationForm)}
        /> */}
        <PrivateRoute
          path="/appRegistrationForm"
          component={lazyLoad(AppRegistrationFormNew)}
        />
        <PrivateRoute
          path="/appTeamRegistrationForm"
          component={lazyLoad(AppTeamRegistrationForm)}
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
          component={lazyLoad(TeamInviteForm)}
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
        {/* <PrivateRoute
          path="/registrationReview"
          component={lazyLoad(RegistrationReviewForm)}
        />
        <PrivateRoute
          path="/reviewProducts"
          component={lazyLoad(ReviewProducts)}
        /> */}

        {/* <PrivateRoute
          path="/teamRegistrationReview"
          component={lazyLoad(TeamRegistrationReview)}
        /> */}

        <PrivateRoute
          path="/teamInvitePayment"
          component={lazyLoad(TeamInvitePayment)}
        />

        <PrivateRoute
          path="/teamInviteProductsReview"
          component={lazyLoad(TeamInviteProducts)}
        /> 

        <PrivateRoute
          path="/teamInviteShop"
          component={lazyLoad(TeamInviteShop)}
        /> 

        <PrivateRoute
          path='/teamInviteShipping'
          component={lazyLoad(TeamInviteShipping)}
        />

        <PrivateRoute
          path="/registrationProducts"
          component={lazyLoad(RegistrationProducts)}
        />

        <PrivateRoute
          path="/registrationShop"
          component={lazyLoad(RegistrationShop)}
        />

        <PrivateRoute
          path="/registrationPayment"
          component={lazyLoad(RegistrationPayment)}
        />

        <PrivateRoute
          path="/registrationShipping"
          component={lazyLoad(RegistrationShipping)}
        />

        <Route path="/" component={lazyLoad(NotFound)} />
        <Redirect from="*" to="/404" />
      </Switch>
    );
  }
}
export default Routes;
