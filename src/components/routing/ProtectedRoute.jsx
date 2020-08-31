import React, { useEffect, useState, useCallback } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ component: Component, layout: Layout, condition, title, computedMatch, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const campaigns = useSelector((state) => state.campaigns);

  const [loading, setLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const isAllowed = useCallback(() => {
    return condition({ auth, campaigns, computedMatch });
  }, [auth, campaigns, computedMatch, condition]);

  useEffect(() => {
    if (auth.loaded && !auth.isAuthenticated) {
      setLoginRequired(true);
      setLoading(false);
    } else if (auth.loaded && campaigns.loadingComplete) {
      setAllowed(isAllowed());
      setLoading(false);
    }
    // console.log("Protected Route Debug. Loading:", loading, "Allowed:", allowed, "Login Required:", loginRequired);
  }, [auth.loaded, auth.isAuthenticated, campaigns.loadingComplete, isAllowed]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <div>Loading...</div>;
        } else if (allowed) {
          return (
            <Layout title={title} match={computedMatch}>
              <Component {...rest} {...props} />
            </Layout>
          );
        } else if (loginRequired) {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname: "/not_found",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
