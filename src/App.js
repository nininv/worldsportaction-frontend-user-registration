import React from "react";
import "./App.css";
import "./customStyles/customStyles.css";
import "./customStyles/antdStyles.css";
import Routes from "./pages/routes";
import {
  MemoryRouter,
  Router,
  Route,
  Redirect,
  Switch,
  HashRouter
} from "react-router-dom";
import history from "./util/history";
import { Skeleton } from "antd";
import PrivateRoute from "./util/protectedRoute";
import Login from "./components/login";
import TeamRegistrationForm from "./components/registration/teamRegistrationForm";
import UserModulePersonalDetail from "./components/user/userModulePersonalDetail";
import AppRegistrationForm from "./components/registration/appRegistrationForm";

import { getUserId, getAuthToken, getExistingUserRefId, 
        getRegisteringYourselfRefId, getUserRegId, getIsUserRegistration } 
from "./util/sessionStorage";
import RegistrationReviewForm from "./components/registration/registrationReviewForm";


function App() {
  console.log(localStorage.getItem("token"));

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

  return (
    <div className="App">
      {/* <MemoryRouter> */}
      <Router history={history} >
        <Switch>
           <Route
            exact
            path="/"
           render={() =>
              ( 
                    ( getUserId()!= 0  && getUserId()!= null && getUserId()!= undefined && 
                      getAuthToken() != null  && getAuthToken() != undefined)? (
                      <Redirect to="/userPersonal" />
                    ) : 
                    (<Redirect to="/login" />))
            }
          /> 
          <Route path="/login" component={lazyLoad(Login)} />
          <Route path="/userPersonal" component={lazyLoad(UserModulePersonalDetail)} />
          <Route path="/registrationReviewForm" component={lazyLoad(RegistrationReviewForm)} />

          {/* <Route path="/forgotPassword" component={lazyLoad(ForgotPassword)} /> */}
          <PrivateRoute path="/" component={lazyLoad(Routes)} />
        </Switch>
      </Router>
      {/* </MemoryRouter> */}
    </div>
  );
}

export default App;
