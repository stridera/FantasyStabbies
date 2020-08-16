import React from "react";
import { Route, Redirect } from "react-router-dom";

const ModRoute = ({ component: Component, auth, layout: Layout, title, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.isModerator) {
          return (
            <Layout title={title}>
              <Component {...rest} {...props} />
            </Layout>
          );
        } else {
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
        }
      }}
    />
  );
};

export default ModRoute;
