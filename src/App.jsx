import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

import store from "./store/store";

import BaseRoutes from "./components/routing/BaseRoutes";
import { login } from "./store/auth.slice";
import { getCampaigns } from "./store/entities/campaigns.slice";

const App = () => {
  const theme = createTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary: blueGrey,
      // type: "dark",
      background: { default: "#000" },
    },
  });

  store.dispatch(login()).then(() => {
    store.dispatch(getCampaigns());
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <React.StrictMode>
            <BaseRoutes />
          </React.StrictMode>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
