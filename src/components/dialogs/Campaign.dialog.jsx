import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import slugify from "slugify";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Grid,
  Button,
  DialogContent,
  Switch,
  FormControlLabel,
  Snackbar,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import Alert from "../custom/Alert";
import { useSelector, useDispatch } from "react-redux";
import { createCampaign } from "../../store/entities/campaigns.slice";
import { campaignSchema } from "../../config/validation.schema";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CampaignDialog = ({ open, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { register, handleSubmit, setValue, errors } = useForm({
    resolver: yupResolver(campaignSchema),
  });

  const campaigns = useSelector((state) => state.campaigns);
  const [slugDirty, setSlugDirty] = useState(false);
  const [errorShowing, showError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSubmit = (data) => {
    setSubmitted(true);
    dispatch(createCampaign(data));
  };

  const closeError = () => {
    showError(false);
  };

  useEffect(() => {
    if (submitted) {
      if (campaigns.modifyError) {
        showError(true);
      } else {
        handleClose();
      }
      setSubmitted(false);
    }
  }, [campaigns, handleClose, submitted]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="-dialog-title" open={open}>
      <DialogTitle id="-dialog-title">Create New Campaign</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                inputRef={register}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="campaignName"
                label="Campaign Name"
                name="campaignName"
                autoComplete="campaignName"
                autoFocus
                error={!!errors.campaignName}
                helperText={errors.campaignName?.message}
                onChange={(event) => {
                  slugDirty || setValue("slug", slugify(event.target.value, { lower: true, strict: true }));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                inputRef={register}
                variant="outlined"
                control={<Switch />}
                id="public"
                name="public"
                label="Public"
                labelPlacement="top"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                inputRef={register}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="slug"
                label="URL Slug"
                name="slug"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.slug}
                helperText={errors.slug?.message}
                onChange={() => {
                  setSlugDirty(true);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                inputRef={register}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="minAge"
                name="minAge"
                label="Minimum Account Age (Days)"
                error={!!errors.minAge}
                helperText={errors.minAge?.message}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                inputRef={register}
                variant="outlined"
                id="nominateStart"
                name="nominateStart"
                label="Nomination Start Date"
                type="date"
                required
                fullWidth
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.nominateStart}
                helperText={errors.nominateStart?.message}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                inputRef={register}
                variant="outlined"
                id="voteStart"
                name="voteStart"
                label="Voting Start Date"
                type="date"
                required
                fullWidth
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.voteStart}
                helperText={errors.voteStart?.message}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                inputRef={register}
                variant="outlined"
                id="endDate"
                name="endDate"
                label="Voting End Date"
                type="date"
                required
                fullWidth
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.endDate}
                helperText={errors.endDate?.message}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={campaigns.loading}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
      <Snackbar open={errorShowing} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {campaigns.modifyError}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

const CampaignDialogHandler = ({ values }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ListItem button key="add_campaign" onClick={handleClickOpen}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary={"Add campaign"} />
      </ListItem>
      <CampaignDialog open={open} onClose={handleClose} values={values} />
    </div>
  );
};

export default CampaignDialogHandler;
