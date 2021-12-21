import React, { useCallback, useEffect, useState } from "react";
import {
  makeStyles,
  Box,
  Typography,
  IconButton,
  Card,
  Grid,
  CardActionArea,
  Button,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { ArrowBackIos as BackIcon } from "@material-ui/icons";
import { getCampaignStatus, statusStates } from "../../../store/entities/campaigns.slice";
import { useHistory } from "react-router";

import NominationCard from "../../custom/NominationCard";
import AddNominationDialog from "../../dialogs/Nomination.dialog";
import { useDispatch, useSelector } from "react-redux";
import { getNominationsForCategory } from "../../../store/entities/nominations.slice";

const refreshInterval = 60000;

const useStyles = makeStyles((theme) => ({
  category: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
  },
  categoryTitle: { justifyContent: "right" },
}));
const CategoryComponent = ({ setTitle, campaign, category }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const nominations = useSelector((state) => state.nominations.entities);

  useEffect(() => {
    const status = getCampaignStatus(campaign);
    setStatus(status.status);
    setStatusMsg(status.message);
  }, [campaign]);

  const updateNominations = useCallback(() => {
    if (campaign && category) {
      console.log({ campaign, category });
      dispatch(getNominationsForCategory({ campaignId: campaign.id, categoryId: category.id })).then((data) => {
        if (data.error) {
          if (data.error.message === "Request failed with status code 403") {
            dispatch(logout());
            return history.push("/");
          }
          setError(data.error.message);
        }
      });
    }
  }, [dispatch, campaign, category, history]);

  useEffect(() => {
    updateNominations();
    const interval = setInterval(() => {
      updateNominations();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [updateNominations]);

  useEffect(() => setTitle(`Campaign: ${campaign.name} | ${statusMsg}`), [setTitle, campaign, statusMsg]);

  useEffect(() => {
    console.log(nominations);
  }, [nominations]);

  console.log(nominations);
  const classes = useStyles();
  return (
    <>
      <Box borderRadius={6} variant="outlined" key={category.id} className={classes.category}>
        <IconButton
          aria-label="back to campaign"
          onClick={() => history.push(`/campaign/${campaign.slug}`)}
          className="backButton"
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h5" component="h2" className={classes.categoryTitle}>
          {category.title}
        </Typography>
      </Box>
      <Box borderRadius={6} variant="outlined" className={classes.category}>
        <Typography variant="h6" component="h2" className={classes.categoryTitle}>
          {category.description}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item lg={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Add a nomination.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  This is your chance to nominate your favorite.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick={() => setDialogOpen(true)}>
                Add Nomination
              </Button>
            </CardActions>
          </Card>
        </Grid>
        {nominations &&
          nominations.map((nomination) => (
            <Grid item lg={3} key={nomination.id}>
              <Card className={classes.card}>
                <NominationCard nomination={nomination} />
              </Card>
            </Grid>
          ))}
      </Grid>
      <AddNominationDialog category={category} dialogOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default CategoryComponent;
