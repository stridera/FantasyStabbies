import React, { useEffect } from "react";
import { makeStyles, Container, Grid, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const Mod = ({ setTitle }) => {
  useEffect(() => {
    setTitle("Moderator Dashboard");
  }, [setTitle]);

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={classes.paper}>Blah</Paper>
          </Grid>
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={classes.paper}>Blah</Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>Blah</Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

export default Mod;
