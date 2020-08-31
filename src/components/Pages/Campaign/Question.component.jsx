import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Box,
  Typography,
  IconButton,
  Card,
  Grid,
  CardActionArea,
  CardMedia,
  Button,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { ArrowBackIos as BackIcon } from "@material-ui/icons";
import Snoo from "../../../img/fantasy.png";

import { getCampaignStatus, statusStates } from "../../../store/entities/campaigns.slice";
import { useHistory } from "react-router";

import NominationCard from "../../custom/NominationCard";
import AddNominationDialog from "../../dialogs/AddNomination.dialog";

const useStyles = makeStyles((theme) => ({
  question: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
  },
  questionTitle: { justifyContent: "right" },
}));
const QuestionComponent = ({ setTitle, campaign, question }) => {
  const history = useHistory();
  const [status, setStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    const status = getCampaignStatus(campaign);
    setStatus(status.status);
    setStatusMsg(status.message);
  }, [campaign]);

  useEffect(() => setTitle(`Campaign: ${campaign.campaignName} | ${statusMsg}`), [setTitle, campaign, statusMsg]);

  const classes = useStyles();
  return (
    <>
      <Box borderRadius={6} variant="outlined" key={question._id} className={classes.question}>
        <IconButton
          aria-label="back to campaign"
          onClick={() => history.push(`/campaign/${campaign.slug}`)}
          className="backButton"
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h5" component="h2" className={classes.questionTitle}>
          {question.question}
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
        {question.nominations.map((nomination) => (
          <Grid item lg={3} key={nomination._id}>
            <Card className={classes.card}>
              <NominationCard nomination={nomination} />
            </Card>
          </Grid>
        ))}
      </Grid>
      <AddNominationDialog question={question} dialogOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default QuestionComponent;
