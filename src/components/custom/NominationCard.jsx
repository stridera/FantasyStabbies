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
      width: 310,
    },
    details: {
      display: "flex",
      flexDirection: "column",
      width: 131,
    },
    content: {
      flex: "1 0 auto",
      paddingRight: 0,
    },
    cover: {
      width: 151,
      height: 200,
      padding: theme.spacing(2),
      paddingRight: 0,
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
          <Typography variant="h6" gutterBottom>
            {nomination.title}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            {nomination.authors}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {nomination.publisher.split(" ")[0]}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {nomination.published_date} {nomination.published_date?.split("-")[0] !== "2021" && <WarningIcon />}
          </Typography>
        </CardContent>
        <CardActions>{actions(nomination)}</CardActions>
      </Box>
      <CardMedia component="img" alt={nomination.title} image={nomination.image_url} className={classes.cover} />
    </Card>
  );
};

export default NominationCard;
