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
import ForgotPassword from "./components/forgotPassword";
import { getUserId, getAuthToken, getExistingUserRefId,
        getRegisteringYourselfRefId, getUserRegId, getIsUserRegistration }
from "./util/sessionStorage";
import ErrorBoundary from "./components/emptyComponent/errorBoundary";

function App() {
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
      <ErrorBoundary>
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
          <Route path="/forgotPassword" component={lazyLoad(ForgotPassword)} />
          <PrivateRoute path="/" component={lazyLoad(Routes)} />
        </Switch>
      </Router>
      {/* </MemoryRouter> */}
      </ErrorBoundary>
    </div>
  );
}

export default App;
