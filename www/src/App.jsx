import React, { Fragment, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";

import Routes from "./components/routing/Routes";
import Navbar from "./components/layout/Navbar.jsx";
import Landing from "./components/layout/Landing.jsx";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router history={history}>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
