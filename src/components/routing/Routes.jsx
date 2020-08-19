import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import ModRoute from "./ModRoute";
import ProtectedRoute from "./ProtectedRoute";

import Drawer from "../layout/DrawerLayout";
import NotFound from "../layout/NotFound";

import Mod from "../Pages/Mod";
import Vote from "../Pages/Campaign";
import Profile from "../Pages/Profile";
import Auth, { AfterAuth } from "../Pages/Auth";

const Routes = () => {
  const auth = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");

  return (
    <Switch>
      <Route exact path="/" component={Auth} />
      <Route exact path="/after_auth" component={AfterAuth} />
      <Route exact path="/logout">
        <Redirect to="/auth/logout" />
      </Route>

      <ModRoute exact path="/mod" auth={auth} layout={Drawer} title={title} setTitle={setTitle} component={Mod} />
      <ProtectedRoute
        path="/campaign/:slug"
        auth={auth}
        layout={Drawer}
        title={title}
        setTitle={setTitle}
        component={Vote}
      />

      <ProtectedRoute
        exact
        path="/profile"
        auth={auth}
        layout={Drawer}
        title={title}
        setTitle={setTitle}
        component={Profile}
      />
      <NotFound />
    </Switch>
  );
};

export default Routes;
