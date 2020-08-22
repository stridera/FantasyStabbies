import React, { useEffect } from "react";

import { makeStyles, Container, Box, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

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

const CampaignsComponent = ({ setTitle }) => {
  // const campaigns = useSelector((state) => state.campaigns);

  useEffect(() => {
    setTitle("Campaigns");
  }, [setTitle]);

  const classes = useStyles();

  return (
    <main className={classes.content}>
      <Container maxWidth="lg" className={classes.container}>
        <Box borderRadius={6} variant="outlined" className={classes.campaignState}>
          <Typography variant="h5" component="h2" align="center">
            Campaigns
          </Typography>
        </Box>
      </Container>
    </main>
  );
};

export default CampaignsComponent;
