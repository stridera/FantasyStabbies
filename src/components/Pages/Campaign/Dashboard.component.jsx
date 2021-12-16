import React, { useEffect } from "react";
import { makeStyles, Box, Typography } from "@material-ui/core";

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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Dashboard = ({ setTitle, campaigns }) => {
  useEffect(() => setTitle("Campaigns"), [setTitle]);

  const classes = useStyles();
  return (
    <>
      {campaigns.entities.map((campaign) => (
        <Box borderRadius={6} variant="outlined" key={campaign.id} className={classes.campaignBox}>
          <Typography variant="h5" component="h2" align="center">
            {campaign.campaignName}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default Dashboard;
