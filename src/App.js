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
import Login from "./components/login";
import { Skeleton } from "antd";
import PrivateRoute from "./util/protectedRoute";
import UserRegistration from "./components/userRegistration";

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
              <Redirect to="/userRegistration" />
            }
          /> 
          <Route path="/userRegistration" component={lazyLoad(UserRegistration)} />
          <PrivateRoute path="/" component={lazyLoad(Routes)} />
        </Switch>
      </Router>
      {/* </MemoryRouter> */}
    </div>
  );
}

export default App;
