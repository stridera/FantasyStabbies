import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { makeStyles, Container, Typography, Snackbar, Backdrop, CircularProgress } from "@material-ui/core";
import Alert from "../../custom/Alert";

import { getCampaignBySlug } from "../../../store/entities/campaigns.slice";
import { getQuestionsForCampaign, getQuestionById } from "../../../store/entities/questions.slice";
import { logout } from "../../../store/auth.slice";

import Dashboard from "./Dashboard.component";
import CampaignNotFound from "./NotFound";
import CampaignDetailsComponent from "./Details.component";
import QuestionComponent from "./Question.component";

const refreshInterval = 60000;
const useStyles = makeStyles((theme) => ({
  content: {},
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.backgroundColor,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const CampaignsComponent = ({ setTitle, match }) => {
  const { slug, questionID } = match.params;
  const history = useHistory();
  const dispatch = useDispatch();

  const campaigns = useSelector((state) => state.campaigns);

  const campaign = useSelector((state) => getCampaignBySlug(slug)(state));
  const questions = useSelector((state) => state.questions);
  const question = useSelector((state) => getQuestionById(questionID)(state));

  const [error, setError] = useState("");
  const closeError = () => setError("");

  const updateQuestions = useCallback(() => {
    if (campaign) {
      dispatch(getQuestionsForCampaign(campaign._id)).then((data) => {
        if (data.error) {
          if (data.error.message === "Request failed with status code 403") {
            dispatch(logout());
            return history.push("/");
          }
          setError(data.error.message);
        }
      });
    }
  }, [dispatch, campaign, history]);

  useEffect(() => {
    updateQuestions();
    const interval = setInterval(() => {
      updateQuestions();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [updateQuestions]);

  let renderComponent;

  if (slug) {
    if (campaign) {
      if (questionID && question) {
        renderComponent = (
          <QuestionComponent setTitle={setTitle} campaign={campaign} question={question} setError={setError} />
        );
      } else {
        renderComponent = (
          <CampaignDetailsComponent setTitle={setTitle} campaign={campaign} questions={questions} setError={setError} />
        );
      }
    } else {
      renderComponent = <CampaignNotFound />;
    }
  } else {
    renderComponent = <Dashboard setTitle={setTitle} campaigns={campaigns} />;
  }

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <Container maxWidth="lg" className={classes.container}>
        {renderComponent}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={closeError}>
          <Alert onClose={closeError} severity="error">
            <Typography>Unable to grab questions for campaign. {error}</Typography>
          </Alert>
        </Snackbar>
        <Backdrop className={classes.backdrop} open={questions.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </main>
  );
};

export default CampaignsComponent;
