import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme, makeStyles } from "@material-ui/core/styles";

import { Card, CardHeader, CardContent, Button } from "@material-ui/core";

import Snoo from "./img/fantasy.png";
import { useHistory } from "react-router";

const Landing = () => {
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(auth);
    if (auth.isAuthenticated) auth.isModerator ? history.push("/mod") : history.push("/vote");
  }, [auth, history]);

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
  });

  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader} title="Sign in to vote." />
        <CardContent>
          <img src={Snoo} style={{ width: "200px", margin: "auto", display: "block" }} alt="Loading..." />
          <Button fullWidth href="/auth/reddit/" variant="contained" color="primary">
            Login via Reddit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;
