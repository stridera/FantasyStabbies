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
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
import { ArrowBackIos as BackIcon } from "@material-ui/icons";
import { useNavigate } from "react-router";

import NominationCard from "../../custom/NominationCard";
import AddNominationDialog from "../../dialogs/Nomination.dialog";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignStatus, statusStates } from "../../../store/entities/campaigns.slice";
import {
  getNominationsForCategory,
  removeVoteForNomination,
  voteForNomination,
} from "../../../store/entities/nominations.slice";

const refreshInterval = 60000;

const useStyles = makeStyles((theme) => ({
  category: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
  },
  categoryTitle: {},
  actionBlock: { display: "flex" },
  actions: { marginRight: "auto" },
  modActions: { marginLeft: "auto", backgroundColor: "#ff0000" },
}));

const NominationComponent = ({ campaign, category, setTitle, setError }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const nominations = useSelector((state) => state.nominations.entities);
  const auth = useSelector((state) => state.auth);

  // useEffect(() => campaign && setTitle(`Campaign: ${campaign.name} | ${statusMsg}`), [setTitle, campaign, statusMsg]);

  const updateNominations = useCallback(() => {
    if (campaign && category && campaign.id === category.campaign) {
      dispatch(getNominationsForCategory(category)).then((data) => {
        if (data.error) {
          if (data.error.message === "Request failed with code 403") {
            dispatch(logout());
            return navigate("/");
          }
          setError(data.error.message);
        }
      });
    }
  }, [dispatch, campaign, category, navigate]);

  useEffect(() => {
    const { status, message } = getCampaignStatus(campaign);
    setStatus(status);
    setStatusMsg(message);
    const interval = setInterval(() => {
      updateNominations();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [updateNominations]);

  const deleteNomination = (nomination) => {
    dispatch(deleteNomination(nomination.id)).then((data) => {
      if (data.error) {
        if (data.error.message === "Request failed with code 403") {
          dispatch(logout());
          return navigate("/");
        }
        setError(data.error.message);
      }
    });
  };

  const addVote = (nomination) => {
    dispatch(voteForNomination({ category, nomination })).then((data) => {
      if (data.error) {
        if (data.error.message === "Request failed with code 403") {
          dispatch(logout());
          return navigate("/");
        }
        setError(data.error.message);
      }
    });
  };

  const deleteVote = (nomination) => {
    dispatch(removeVoteForNomination({ category, nomination })).then((data) => {
      if (data.error) {
        if (data.error.message === "Request failed with code 403") {
          dispatch(logout());
          return navigate("/");
        }
        setError(data.error.message);
      }
    });
  };

  const actions = (nomination) => {
    return (
      <Box className={classes.actionBlock}>
        {(auth.isModerator || status === statusStates.voting) && (
          <Box className={classes.actions}>
            {nomination.voted ? (
              <Button size="small" color="primary" onClick={() => deleteVote(nomination)}>
                Voted!
              </Button>
            ) : (
              <Button size="small" color="primary" onClick={() => addVote(nomination)}>
                Vote
              </Button>
            )}
          </Box>
        )}
        {auth.isModerator && (
          <Box className={classes.modActions}>
            {/* <IconButton aria-label="edit nomination" onClick={() => editNomination(nominationId)}>
            <EditIcon />
          </IconButton> */}
            <IconButton aria-label="delete nomination" onClick={() => deleteNomination(nomination.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  const classes = useStyles();
  return campaign && category ? (
    <>
      <Box borderRadius={6} variant="outlined" key={category.id} className={classes.category}>
        <IconButton
          aria-label="back to campaign"
          onClick={() => navigate(`/campaign/${campaign.slug}`)}
          className="backButton"
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h5" component="h2" className={classes.categoryTitle}>
          {category ? category.title : "Loading.."}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item lg={6}>
          {(auth.isModerator || status === statusStates.nominating) && (
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
          )}
        </Grid>
        {nominations &&
          nominations.map((nomination) => (
            <Grid item sm={12} md={6} lg={4} key={nomination.id}>
              <NominationCard nomination={nomination} actions={actions} />
            </Grid>
          ))}
      </Grid>
      <AddNominationDialog category={category} dialogOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  ) : (
    <Box>Loading...</Box>
  );
};

export default NominationComponent;
