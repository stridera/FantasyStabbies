import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  TextField,
  Grid,
  Button,
  DialogContent,
  Snackbar,
  Fab,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import Alert from "../custom/Alert";
import { useSelector, useDispatch } from "react-redux";
import allowedSources from "../../config/allowedSources";
import { createCategoryForCampaign } from "../../store/entities/categories.slice";
import { categorySchema } from "../../config/validation.schema";

const CategoryDialog = ({ campaign_id, open, onClose }) => {
  const useStyles = makeStyles((theme) => ({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    addCategoryFab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();

  const campaigns = useSelector((state) => state.campaigns);
  const [errorShowing, showError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onSubmit = (form) => {
    setSubmitted(true);
    const data = { campaign_id: campaign_id, ...form };
    console.log("Submitting", data);
    dispatch(createCategoryForCampaign(data)).then((data) => {
      console.log("Request complete.", data);
      setSubmitted(false);
    });
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: { source: "" },
  });

  return (
    <Dialog onClose={handleClose} aria-labelledby="category-dialog-title" open={open}>
      <DialogTitle id="category-dialog-title">Add Category To Campaign</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register("title")}
                required
                fullWidth
                label="Category Title"
                name="title"
                autoComplete="title"
                autoFocus
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("description")}
                required
                fullWidth
                label="Category Description"
                name="description"
                autoComplete="description"
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth className={classes.formControl} error={!!errors.source}>
                <InputLabel>Source</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select {...field}>
                      {_.map(allowedSources, (value, key) => (
                        <MenuItem id={key} key={key} value={key}>
                          {value.text}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name="source"
                  control={control}
                  required
                />
                {errors.source && <span>{errors.source.message}</span>}
              </FormControl>
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

const CategoryDialogHelper = ({ campaign_id, values }) => {
  const useStyles = makeStyles((theme) => ({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    addCategoryFab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    console.log("Opening!");
  };

  const handleClose = () => {
    setOpen(false);
    console.log("Closing!");
  };

  const classes = useStyles();
  return (
    <>
      <Fab color="secondary" aria-label="Add Category" className={classes.addCategoryFab} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <CategoryDialog campaign_id={campaign_id} open={open} onClose={handleClose} values={values} />
    </>
  );
};

export default CategoryDialogHelper;
