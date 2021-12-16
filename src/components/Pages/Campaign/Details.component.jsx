import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";

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

import AddCategory from "../../dialogs/AddCategory.dialog";
import { deleteCategoryFromCampaign } from "../../../store/entities/categories.slice";
import { getCampaignStatus, statusStates } from "../../../store/entities/campaigns.slice";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
  },
  cardTitle: {
    fontSize: 14,
  },
  modActions: { display: "flex", marginLeft: "auto" },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const CampaignDetailsComponent = ({ setTitle, campaign, categories, setError }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const deleteCategory = (id) => dispatch(deleteCategoryFromCampaign({ campaignId: campaign.id, categoryId: id }));
  // const editCategory = (id) => dispatch(editCategoryFromCampaign(campaign.id, id));

  useEffect(() => setTitle(`Campaign: ${campaign.name} | ${statusMsg}`), [setTitle, campaign, statusMsg]);

  useEffect(() => {
    const status = getCampaignStatus(campaign);
    setStatus(status.status);
    setStatusMsg(status.message);
  }, [campaign]);

  const classes = useStyles();

  return (
    <>
      <Box borderRadius={6} variant="outlined" className={classes.campaignState}>
        <Typography variant="h5" component="h2" align="center">
          {statusMsg}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {_.map(categories.entities, (category) => (
          <Grid item lg={3} key={category.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.cardTitle} gutterBottom>
                  Category:
                </Typography>
                <Typography className={classes.cardContent} vatiant="h5" component="h2">
                  {category.category}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                {status === statusStates.nominating && (
                  <Button size="small" component={Link} to={`/campaign/${campaign.slug}/${category.id}`}>
                    Nominations
                  </Button>
                )}
                {status === statusStates.voting && (
                  <Button size="small" component={Link} to={`/campaign/${campaign.slug}/${category.id}`}>
                    Vote
                  </Button>
                )}
                {auth.isModerator && (
                  <Box className={classes.modActions}>
                    {/* <IconButton aria-label="edit category" onClick={() => editCategory(category.id)}>
                        <EditIcon />
                      </IconButton> */}
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
      {auth.isModerator && <AddCategory campaign={campaign.id} />}
    </>
  );
};

export default CampaignDetailsComponent;
