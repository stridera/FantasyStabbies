import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { makeStyles, Container, Typography, Snackbar, Backdrop, CircularProgress, Box } from "@material-ui/core";
import Alert from "../../custom/Alert";

import { getCampaignBySlug, getCampaignStatus } from "../../../store/entities/campaigns.slice";
import { getCategoriesForCampaign, getCategoryById } from "../../../store/entities/categories.slice";
import { logout } from "../../../store/auth.slice";

import DrawerLayout from "../../layout/DrawerLayout";
import Dashboard from "./Dashboard.component";
import CategoriesComponent from "./Categories.component";
import NominationComponent from "./Nominations.component";
import CampaignNotFound from "./NotFound";
import { getNominationsForCategory } from "../../../store/entities/nominations.slice";

const refreshInterval = 60000;
const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    backgroundColor: theme.backgroundColor,
  },
  campaignBox: {
    backgroundColor: "#fff",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const CampaignsComponent = ({ title, setTitle }) => {
  const dispatch = useDispatch();
  const { slug, categoryID } = useParams();

  const campaigns = useSelector((state) => state.campaigns);
  const campaign = useSelector((state) => getCampaignBySlug(slug)(state));
  const categories = useSelector((state) => state.categories);
  const category = useSelector((state) => getCategoryById(parseInt(categoryID))(state));

  const [campaignStatus, setCampaignStatus] = useState("");
  const [error, setError] = useState("");
  const closeError = () => setError("");

  useEffect(() => {
    if (campaign) {
      dispatch(getCategoriesForCampaign(campaign.id));
      setCampaignStatus(getCampaignStatus(campaign).message);
    }
  }, [slug, campaign]);

  useEffect(() => {
    campaign && category && dispatch(getNominationsForCategory({ campaignId: campaign.id, categoryId: category.id }));
  }, [campaign, category]);

  let renderComponent;

  if (slug) {
    if (campaign) {
      if (categoryID) {
        renderComponent = category ? (
          <NominationComponent setTitle={setTitle} campaign={campaign} category={category} setError={setError} />
        ) : (
          <h2>Category not found.</h2>
        );
      } else {
        renderComponent = (
          <CategoriesComponent setTitle={setTitle} campaign={campaign} categories={categories} setError={setError} />
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
        <DrawerLayout title={title} campaigns={campaigns}>
          {campaign && (
            <Box borderRadius={6} variant="outlined" key={campaign.id} className={classes.campaignBox}>
              <Typography variant="h4" component="h2" align="center">
                {campaign.name}
              </Typography>
              <Typography variant="h5" align="center">
                {campaignStatus}
              </Typography>
            </Box>
          )}
          {renderComponent}
        </DrawerLayout>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={closeError}>
          <Alert onClose={closeError} severity="error">
            <Typography>Unable to grab categories for campaign. {error}</Typography>
          </Alert>
        </Snackbar>
        <Backdrop className={classes.backdrop} open={campaigns.loading || categories.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </main>
  );
};

export default CampaignsComponent;
