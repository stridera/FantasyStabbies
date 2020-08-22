import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Drawer from "../layout/DrawerLayout";
import NotFound from "../layout/NotFound";

import Mod from "../Pages/Mod";
import { CampaignsComponent, CampaignDetailsComponent } from "../Pages/Campaign";
import Profile from "../Pages/Profile";
import Auth, { AfterAuth } from "../Pages/Auth";

const Routes = () => {
  const [title, setTitle] = useState("");

  const isAuthenticated = ({ auth }) => {
    return auth.isAuthenticated;
  };

  const isMod = ({ auth }) => {
    return auth.isModerator;
  };

  const slugExists = ({ campaigns, computedMatch }) => {
    const { slug } = computedMatch.params;
    if (!slug) return false;
    const campaign = campaigns.entities.find((c) => c.slug === slug);
    console.log("test", slug, campaign);
    return !!campaign;
  };

  return (
    <Switch>
      {/* Auth */}
      <Route exact path="/" component={Auth} />
      <Route exact path="/after_auth" component={AfterAuth} />
      <Route exact path="/logout">
        <Redirect to="/auth/logout" />
      </Route>

      {/* Moderators */}
      <ProtectedRoute
        exact
        path="/mod"
        condition={isMod}
        layout={Drawer}
        title={title}
        setTitle={setTitle}
        component={Mod}
      />

      {/* Campaigns */}
      <ProtectedRoute
        exact
        path="/campaign"
        condition={isAuthenticated}
        layout={Drawer}
        title={title}
        setTitle={setTitle}
        component={CampaignsComponent}
      />
      <ProtectedRoute
        path="/campaign/:slug"
        condition={slugExists}
        layout={Drawer}
        title={title}
        setTitle={setTitle}
        component={CampaignDetailsComponent}
      />

      {/* Profile */}
      <ProtectedRoute
        exact
        path="/profile"
        condition={isAuthenticated}
        layout={Drawer}
        title={title}
        setTitle={setTitle}
        component={Profile}
      />

      {/* Fallthrough */}
      <NotFound />
    </Switch>
  );
};

export default Routes;
