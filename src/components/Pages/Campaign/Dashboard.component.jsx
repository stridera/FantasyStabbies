import React, { useEffect } from "react";
import { makeStyles, Grid, Box, Typography } from "@material-ui/core";
import { getCampaignStatus } from "../../../store/entities/campaigns.slice";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  content: {},
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.backgroundColor,
  },
  campaignBox: {
    backgroundColor: "#fff",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Dashboard = ({ campaigns, setTitle }) => {
  useEffect(() => setTitle("Campaigns"), [setTitle]);

  const classes = useStyles();
  return (
    <>
      {campaigns.entities.map((campaign) => (
        <Box borderRadius={6} variant="outlined" key={campaign.id} className={classes.campaignBox}>
          <Typography variant="h4" component="h2" align="center">
            <Link to={`/campaign/${campaign.slug}`}>{campaign.name}</Link>
          </Typography>
          <Typography variant="h5" align="center">
            {getCampaignStatus(campaign).message}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <p>Nominations Begin: {campaign.nominate_start_date}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p>Nominations End: {campaign.nominate_end_date}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p>Voting Begins: {campaign.voting_start_date}</p>
            </Grid>
            <Grid item xs={12} sm={6}>
              <p>Voting Ends: {campaign.voting_start_date}</p>
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  );
};

export default Dashboard;
