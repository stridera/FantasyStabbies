import React from "react";
import { Route, Switch } from "react-router-dom";

import Navbar from "../layout/Navbar.jsx";
import NotFound from "../layout/NotFound";
import PrivateRoute from "./PrivateRoute";

// import Alert from "../layout/Alert";
import Help from "../Pages/Help";
import Mod from "../Pages/Mod";
import Vote from "../Pages/Vote";

const Routes = () => {
  return (
    <section className="container">
      <Navbar />

      {/* <Alert /> */}
      <Switch>
        <Route exact path="/help" component={Help} />
        <PrivateRoute exact path="/mod" component={Mod} />
        <PrivateRoute exact path="/vote" component={Vote} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
