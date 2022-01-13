import React, { useEffect } from "react";
import { makeStyles, Container, Grid, Link, Box, Typography } from "@material-ui/core";
import DrawerLayout from "../../layout/DrawerLayout";
import axios from "axios";
import { getCampaignStatus } from "../../../store/entities/campaigns.slice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  campaignBox: {
    backgroundColor: "#fff",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4),
  },
  grid: {
    padding: theme.spacing(2),
  },
}));

const Mod = ({ setTitle }) => {
  const { slug } = useParams();

  const campaigns = useSelector((state) => state.campaigns);
  const [dashData, setDashData] = useState([]);

  useEffect(() => {
    axios.get(`/api/dashboard/${slug || ""}`).then((res) => {
      setDashData(res.data);
    });
  }, [slug]);

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <Container maxWidth="lg" className={classes.container}>
        <DrawerLayout title={"Moderator Dashboard"} campaigns={campaigns}>
          {dashData.map((campaign) => (
            <Box borderRadius={6} variant="outlined" key={campaign.id} className={classes.campaignBox}>
              <Typography variant="h4" component="h2" align="center">
                {campaign.name}
                {/* <Link to={`/campaign/${campaign.slug}`}>{campaign.name}</Link> */}
              </Typography>
              <Typography variant="h5" align="center">
                {getCampaignStatus(campaign).message}
              </Typography>
              <Grid container className={classes.grid}>
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
                <Grid item xs={6} sm={4}>
                  <p>Categories: {campaign.categories}</p>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <p>Nominations: {campaign.nominations}</p>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <p>Votes: {campaign.votes}</p>
                </Grid>
              </Grid>
            </Box>
          ))}
        </DrawerLayout>
      </Container>
    </main>
  );
};

export default Mod;
