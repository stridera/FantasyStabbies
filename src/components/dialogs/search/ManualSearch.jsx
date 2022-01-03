import React from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Button } from "@material-ui/core";
import { manual as source } from "../../../config/allowedSources";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { manualEntrySchema } from "../../../../src/config/validation.schema";
import { makeStyles } from "@material-ui/core/styles";
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
    resolver: yupResolver(manualEntrySchema),
  });

  const onSubmit = (data) => {
    nominate({ source: source.id, ...data });
  };
  const classes = useStyles();

  return (
    <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen}>
      <DialogTitle>Add Nomination from Google Books</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Manual Entry
              </Typography>
            </Grid>
            <Grid item sm={12}>
              <TextField
                {...register("title")}
                label="Title"
                variant="outlined"
                fullWidth
                required
                error={!!errors.title}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField {...register("author")} label="Author" variant="outlined" fullWidth error={!!errors.author} />
            </Grid>
            <Grid item sm={8}>
              <TextField
                {...register("publisher")}
                label="Publisher"
                variant="outlined"
                fullWidth
                error={!!errors.publisher}
              />
            </Grid>
            <Grid item sm={4}>
              <TextField
                {...register("published date")}
                label="Published Date"
                variant="outlined"
                fullWidth
                error={!!errors.published_date}
              />
            </Grid>
            <Grid item sm={12}>
              <TextField {...register("url")} label="URL" variant="outlined" fullWidth required error={!!errors.url} />
            </Grid>
            <Grid item sm={12}>
              <TextField
                {...register("image_url")}
                label="Image URL"
                variant="outlined"
                fullWidth
                error={!!errors.image_url}
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
