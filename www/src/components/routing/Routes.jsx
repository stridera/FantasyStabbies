import React from "react";
import { Route, Switch } from "react-router-dom";
// import Alert from "../layout/Alert";
import Help from "../Help";
import Vote from "../Vote";
import Mod from "../Mod";
import NotFound from "../layout/NotFound";
import PrivateRoute from "../routing/PrivateRoute";

const Routes = (props) => {
  return (
    <section className="container">
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
