import React from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Button } from "@material-ui/core";
import { manual as source } from "../../../config/allowedSources";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { workSchema } from "../../../../src/config/validation.schema";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from "react";
const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ManualSearch = ({ onClose, dialogOpen, nominate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workSchema),
  });

  const onSubmit = (data) => {
    nominate({ source: source.id, ...data });
  };

  const classes = useStyles();
  return (
    <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen}>
      <DialogTitle>Add Nomination</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="source" value={source.id} {...register("source")} />
          <Grid container alignItems="center">
            <Grid item sm={12}>
              <TextField
                {...register("title")}
                label="Title"
                autoFocus
                variant="outlined"
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                {...register("authors")}
                required
                label="Author"
                variant="outlined"
                fullWidth
                error={!!errors.author}
                helperText={errors.author?.message}
              />
            </Grid>
            <Grid item sm={8}>
              <TextField
                {...register("publisher")}
                label="Publisher"
                variant="outlined"
                fullWidth
                error={!!errors.publisher}
                helperText={errors.publisher?.message}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                {...register("published_date")}
                label="Published Date"
                variant="outlined"
                fullWidth
                error={!!errors.published_date}
                helperText={errors.published_date?.message}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                {...register("source_url")}
                label="URL"
                variant="outlined"
                fullWidth
                required
                error={!!errors.source_url}
                helperText={errors.source_url?.message}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                {...register("image_url")}
                label="Image URL"
                variant="outlined"
                fullWidth
                error={!!errors.image_url}
                helperText={errors.image_url?.message}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField
                {...register("note")}
                label="Note"
                variant="outlined"
                fullWidth
                multiline
                row={4}
                error={!!errors.note}
                helperText={errors.note?.message}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualSearch;
