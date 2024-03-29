import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Auth, { AfterAuth } from "../Pages/Auth";
import Drawer from "../layout/DrawerLayout";
import NotFound from "../layout/NotFound";
import Mod from "../Pages/Mod";
import CampaignComponent from "../Pages/Campaign";
// import CampaignDashboardComponent from "../Pages/Campaign/Dashboard.component";
// import CampaignDetailsComponent from "../Pages/Campaign/Details.component";
// import CategoryComponent from "../Pages/Campaign/Category.component";
import Profile from "../Pages/Profile";

const BaseRoutes = () => {
  const [title, setTitle] = useState("");

  const PrivateOutlet = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  const ModeratorOutlet = ({ children }) => {
    const { isAuthenticated, isModerator, loading } = useSelector((state) => state.auth);
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated && isModerator ? children : <Navigate to="/" />;
  };

  return (
    <Routes>
      {/* Auth */}
      <Route exact path="/" element={<Auth />} />
      <Route exact path="/after_auth" element={<AfterAuth />} />
      <Route exact path="/logout" render={() => <Navigate to="/auth/logout" />} />

      {/* Moderators */}
      <Route
        path="/mod/*"
        element={
          <ModeratorOutlet>
            <Routes>
              <Route path=":slug" element={<Mod title={title} setTitle={setTitle} />} />
              <Route index element={<Mod title={title} setTitle={setTitle} />} />
            </Routes>
          </ModeratorOutlet>
        }
      />

      {/* Campaigns */}
      <Route
        path="/campaign/*"
        element={
          <PrivateOutlet>
            <Routes>
              <Route path=":slug/:category_id" element={<CampaignComponent title={title} setTitle={setTitle} />} />
              <Route path=":slug" element={<CampaignComponent title={title} setTitle={setTitle} />} />
              <Route index element={<CampaignComponent title={title} setTitle={setTitle} />} />
            </Routes>
          </PrivateOutlet>
        }
      />

      {/* Profile */}
      <Route
        exact
        path="/profile"
        element={
          <PrivateOutlet>
            <Profile title={title} setTitle={setTitle} />
          </PrivateOutlet>
        }
      />

      {/* Fallthrough */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default BaseRoutes;
