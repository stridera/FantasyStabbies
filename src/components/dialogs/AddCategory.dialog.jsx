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
import allowedSources from "../../config/sources";
import { createCategoryForCampaign } from "../../store/entities/categories.slice";
import { categorieschema } from "../../config/validation.schema";

const CategoryDialog = ({ campaign, open, onClose }) => {
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
    const data = { campaignId: campaign, category: form.category, source: form.source };
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
    resolver: yupResolver(categorieschema),
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
                inputRef={register}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="category"
                label="Category Title"
                name="category"
                autoComplete="category"
                autoFocus
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth className={classes.formControl}>
                <InputLabel>Source</InputLabel>
                <Controller
                  as={
                    <Select>
                      {_.map(allowedSources, (value, key) => (
                        <MenuItem id={key} key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="source"
                  control={control}
                  required
                />
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

const AddCategory = ({ campaign, values }) => {
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  return (
    <>
      <Fab color="secondary" aria-label="Add Category" className={classes.addCategoryFab} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <CategoryDialog campaign={campaign} open={open} onClose={handleClose} values={values} />
    </>
  );
};

export default AddCategory;
