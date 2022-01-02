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
import WarningIcon from "@material-ui/icons/Warning";

const NominationCard = ({ nomination, actions }) => {
  const useStyles = makeStyles((theme) => ({
    card: {
      display: "flex",
      width: 345,
    },
    details: {
      display: "flex",
      flexDirection: "column",
    },
    content: {
      flex: "1 0 auto",
    },
    cover: {
      width: 151,
      height: 200,
    },
    invalid: {
      color: "#ff0000",
      useNextVariants: true,
    },
  }));

  const classes = useStyles();
  return (
    <Card key={nomination.id} className={classes.card}>
      <Box className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="h5" gutterBottom>
            {nomination.title}
          </Typography>
          <Typography variant="h6" color="textSecondary" component="h6">
            {nomination.authors}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Publisher: {nomination.publisher}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Date: {nomination.published_date} {nomination.published_date?.split("-")[0] !== "2021" && <WarningIcon />}
          </Typography>
        </CardContent>
        <CardActions>{actions(nomination)}</CardActions>
      </Box>
      <CardMedia component="img" alt={nomination.title} image={nomination.image_url} className={classes.cover} />
    </Card>
  );
};

export default NominationCard;
