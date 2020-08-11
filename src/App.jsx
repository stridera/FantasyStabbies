import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

import Landing from "./components/Pages/Landing";
import Routes from "./components/routing/Routes";

import { Provider } from "react-redux";
import store from "./store/store";
import { loadUser } from "./store/auth";
import setAuthToken from "./utils/setAuthToken";

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }, []);

  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: blueGrey,
      // type: "dark",
      background: { default: "#000" },
    },
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
