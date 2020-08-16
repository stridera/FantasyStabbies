import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";

import Alert from "../../custom/Alert";
import { Card, CardHeader, CardContent, Button, CircularProgress } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

import Snoo from "./img/fantasy.png";
import { loadUser } from "../../../store/auth.slice";

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
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(loadUser());
    setLoading(true);
  }, [dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated) auth.isModerator ? history.push("/mod") : history.push("/vote");
    setLoading(false);
  }, [auth, history]);

  const theme = useTheme();
  const classes = useStyles(theme);

  const location = useLocation();
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
        default:
          setError("An error occured.  Please try again.");
          break;
      }
    }
  }, [location]);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader} title="Sign in to vote." />
        <CardContent>
          <img src={Snoo} style={{ width: "200px", margin: "auto", display: "block" }} alt="Loading..." />
          <Button fullWidth href="/auth/reddit/" variant="contained" color="primary" disabled={loading}>
            Login via Reddit
          </Button>
          {loading && <CircularProgress size={60} className={classes.loadingProgress} />}
        </CardContent>
      </Card>
      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
};

export default Auth;
