import React from "react";
import {
  makeStyles,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  CardActions,
} from "@material-ui/core";
import NominationCard from "./NominationCard";

const SuggestionsList = ({ suggestions, actions }) => {
  const useStyles = makeStyles((theme) => ({}));

  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.container}>
      {suggestions &&
        suggestions.map((suggestion) => (
          <Grid item sm={12} md={6} lg={3}>
            <NominationCard nomination={suggestion} actions={actions} />
          </Grid>
        ))}
    </Grid>
  );
};

export default SuggestionsList;
