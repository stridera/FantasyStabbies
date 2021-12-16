import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { AddLocation as VoteAddIcon } from "@material-ui/icons";
import Alert from "../custom/Alert";

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(campaignSchema),
  });

  const campaigns = useSelector((state) => state.campaigns);
  const [slugDirty, setSlugDirty] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const unwrapResult = (response) => {
    if (response.payload.error) throw response.payload.error;
    if (response.error) throw response.error;
    return response.payload;
  };

  const onSubmit = (data) => {
    setSubmitted(true);
    dispatch(createCampaign(data))
      .then(unwrapResult)
      .then(handleClose)
      .catch((err) => {
        switch (err.name) {
          case "MongoError":
            if (err.code === 11000) {
              // Duplicate Unique Key Error
              setError(`The ${Object.keys(err.keyValue)[0]} is already in use.  Please change and try again.`);
            } else {
              setError("A database error occured.  Please try again.");
            }
            break;
          case "ValidationError":
            // Todo: Shouldn't happen, but just in case, one day you should handle this.
            setError("Validation error.  Please try again.");
            break;
          default:
            setError(err.message);
        }
      })
      .finally(() => setSubmitted(false));
  };

  const closeError = () => {
    setError("");
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="-dialog-title" open={open}>
      <DialogTitle id="-dialog-title">Create New Campaign</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                {...register("name")}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Campaign Name"
                name="name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                onChange={(event) => {
                  slugDirty || setValue("slug", slugify(event.target.value, { lower: true, strict: true }));
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                {...register("public")}
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
                {...register("slug")}
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
                {...register("minAge")}
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
                {...register("nominateStart")}
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
                {...register("voteStart")}
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
                {...register("endDate")}
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
      <Backdrop className={classes.backdrop} open={submitted}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={closeError}>
        <Alert onClose={closeError} severity="error">
          {error}
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
          <VoteAddIcon />
        </ListItemIcon>
        <ListItemText primary={"Add campaign"} />
      </ListItem>
      <CampaignDialog open={open} onClose={handleClose} values={values} />
    </div>
  );
};

export default CampaignDialogHandler;
