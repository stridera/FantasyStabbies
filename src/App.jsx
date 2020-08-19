import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

import store from "./store/store";

import Routes from "./components/routing/Routes";
import { login } from "./store/auth.slice";
import { getCampaigns } from "./store/entities/campaigns.slice";

const App = () => {
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

  store.dispatch(login());
  store.dispatch(getCampaigns());

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Route component={Routes} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
