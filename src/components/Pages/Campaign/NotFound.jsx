import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    minWidth: 350,
    maxWidth: 450,
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

const NotFound = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader} title="Campaign not found." />
        <CardContent>
          <Typography>
            The campaign you select can't be found. It might have been deleted or the link might be wrong.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
