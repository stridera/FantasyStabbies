import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router";

import Alert from "../../custom/Alert";
import { Card, CardHeader, CardContent, Button, CircularProgress } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

import Snoo from "../../../img/fantasy.png";

const useStyles = makeStyles({
  root: {
    width: 350,
    height: "auto",
    position: "absolute",
    top: "15%",
    left: 0,
    right: 0,
    margin: "auto",
  },
  card: {
    padding: 20,
    overflow: "auto",
  },
  cardHeader: {
    textAlign: "center",
    paddingBottom: 0,
  },
  loadingProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -30,
  },
});

const Auth = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [error, setError] = useState("");

  const location = useLocation();
  useEffect(() => {
    if (auth.isAuthenticated) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(location.state.from.pathname);
      } else {
        auth.isModerator ? navigate("/mod") : navigate("/campaign");
      }
    }
  }, [auth, navigate, location.state]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "auth_error":
          setError("There was an error signing in.  Please try again.");
          break;
        case "auth_failed":
          setError("Authorization failed.  Please try again.");
          break;
        case "signed_out":
          setError("You've been signed out.  Please sign in again.");
          break;
        default:
          setError("An error occured.  Please try again.");
          break;
      }
    }
  }, [location]);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader} title="Sign in to vote." />
        <CardContent>
          <img src={Snoo} style={{ width: "200px", margin: "auto", display: "block" }} alt="Loading..." />
          <Button fullWidth href="/auth/reddit/" variant="contained" color="primary" disabled={auth.loading}>
            Login via Reddit
          </Button>
          {auth.loading && <CircularProgress size={60} className={classes.loadingProgress} />}
        </CardContent>
      </Card>
      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
};

export default Auth;
