import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

import {
  makeStyles,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
} from "@material-ui/core";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";

import AddCategory from "../../dialogs/Category.dialog";
import { deleteCategoryFromCampaign, getCategoriesForCampaign } from "../../../store/entities/categories.slice";
import { getCampaignBySlug, getCampaignStatus, statusStates } from "../../../store/entities/campaigns.slice";
import { getNominations } from "../../../services/api.service";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
  },
  cardTitle: {
    fontSize: 14,
  },
  box: {
    backgroundColor: "#fff",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  modActions: { display: "flex", marginLeft: "auto", color: "#ff0000" },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const CategoriesComponent = ({ setTitle, campaign, categories, setError }) => {
  const auth = useSelector((state) => state.auth);
  const [status, setStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const deleteCategory = (id) => dispatch(deleteCategoryFromCampaign({ campaignId: campaign.id, categoryId: id }));
  const editCategory = (id) => dispatch(editCategoryFromCampaign(campaign.id, id));

  useEffect(() => {
    const { status, message } = getCampaignStatus(campaign);
    setTitle(`Campaign: ${campaign.name} | ${message}`);
    setStatus(status);
    setStatusMsg(message);
  }, [campaign]);

  const classes = useStyles();

  return (
    <>
      {categories.entities.length > 0 ? (
        <Grid container spacing={2}>
          {_.map(categories.entities, (category) => (
            <Grid item lg={3} key={category.id}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.cardTitle} gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography className={classes.cardContent} vatiant="h5" component="h2">
                    {category.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {(auth.isModerator || status === statusStates.nominating) && (
                    <Button size="small" component={Link} to={`/campaign/${campaign.slug}/${category.id}`}>
                      Nominations
                    </Button>
                  )}
                  {(auth.isModerator || status === statusStates.voting) && (
                    <Button size="small" component={Link} to={`/campaign/${campaign.slug}/${category.id}`}>
                      Vote
                    </Button>
                  )}
                  {auth.isModerator && (
                    <Box className={classes.modActions}>
                      <IconButton aria-label="edit category" onClick={() => editCategory(category.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete category" onClick={() => deleteCategory(category.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box borderRadius={6} variant="outlined" className={classes.box}>
          <Typography variant="h5" component="h2" align="center">
            No Categories Added! Moderators must add some to start the campaign.
          </Typography>
        </Box>
      )}

      {auth.isModerator && campaign && <AddCategory campaign={campaign.id} />}
    </>
  );
};

export default CategoriesComponent;