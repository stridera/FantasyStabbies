import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";
import _ from "lodash";

import {
  makeStyles,
  Container,
  Box,
  Typography,
  Grid,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
import Alert from "../../custom/Alert";
import { red } from "@material-ui/core/colors";

import { logout } from "../../../store/auth.slice";
import { getCampaignBySlug } from "../../../store/entities/campaigns.slice";
import { getQuestionsForCampaign, deleteQuestionFromCampaign } from "../../../store/entities/questions.slice";
import AddQuestion from "../../dialogs/AddQuestion.dialog";

const useStyles = makeStyles((theme) => ({
  content: {},
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.backgroundColor,
  },
  modActions: {
    backgroundColor: red[200],
    marginBottom: 15,
  },
  campaignState: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.backgroundColor,
  },
  card: {
    minWidth: 275,
  },
  cardTitle: {
    fontSize: 14,
  },
  cardAction: {
    display: "flex",
    justifyContent: "right",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const CampaignDetailsComponent = ({ setTitle, match }) => {
  const { slug } = match.params;
  const auth = useSelector((state) => state.auth);
  const campaign = useSelector((state) => getCampaignBySlug(slug)(state));
  const questions = useSelector((state) => state.questions);
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const closeError = () => {
    setError("");
  };

  const deleteQuestion = (id) => {
    dispatch(deleteQuestionFromCampaign({ campaignId: campaign._id, questionId: id }));
  };

  const editQuestion = (id) => {
    // dispatch(editQuestionFromCampaign(campaign._id, id));
  };

  const updateStatus = useCallback(() => {
    const now = new moment();
    var diff;

    console.log(campaign.nominateStart, campaign.voteStart, campaign.endDate);

    diff = moment(campaign.nominateStart).diff(now);
    if (diff > 0) {
      return setStatus(`Nominations starts in ${moment.duration(diff).humanize()}.`);
    }

    diff = moment(campaign.voteStart).diff(now);
    if (diff > 0) {
      return setStatus(`Taking nominations.  Voting starts in ${moment.duration(diff).humanize()}.`);
    }

    diff = moment(campaign.endDate).diff(now);
    if (diff > 0) {
      return setStatus(`Voting Ends in ${moment.duration(diff).humanize()}.`);
    }

    setStatus(`Voting ended ${moment.duration(diff).humanize()} ago.`);
  }, [setStatus, campaign]);

  const updateQuestions = useCallback(() => {
    dispatch(getQuestionsForCampaign(campaign._id)).then((data) => {
      if (data.error) {
        if (data.error.message === "Request failed with status code 403") {
          dispatch(logout());
          return history.push("/");
        }
        setError(data.error.message);
      }
    });
  }, [dispatch, campaign._id, history]);

  useEffect(() => {
    updateQuestions();
    const interval = setInterval(() => {
      updateQuestions();
    }, 60000);
    return () => clearInterval(interval);
  }, [updateQuestions]);

  useEffect(() => {
    setTitle(`Campaign: ${campaign.campaignName}`);
  }, [setTitle, campaign]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus, campaign]);

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <Container maxWidth="lg" className={classes.container}>
        <Box borderRadius={6} variant="outlined" className={classes.campaignState}>
          <Typography variant="h5" component="h2" align="center">
            {status}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {_.map(questions.entities, (question) => (
            <Grid item xs={3} key={question._id}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.cardTitle} gutterBottom>
                    Question:
                  </Typography>
                  <Typography className={classes.cardContent} vatiant="h5" component="h2">
                    {question.question}
                  </Typography>
                </CardContent>
                {auth.isModerator && (
                  <CardActions disableSpacing className={classes.cardAction}>
                    <IconButton aria-label="edit question" onClick={() => editQuestion(question._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete question" onClick={() => deleteQuestion(question._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          <Typography>Unable to grab questions for campaign. {error}</Typography>
        </Alert>
      </Snackbar>
      {auth.isModerator && <AddQuestion campaign={campaign._id} />}
      <Backdrop className={classes.backdrop} open={questions.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </main>
  );
};

export default CampaignDetailsComponent;
