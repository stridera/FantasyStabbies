import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Grid, makeStyles } from "@material-ui/core";
import { throttle } from "lodash";

const useStyles = makeStyles((theme) => ({}));
const AddNominationDialog = ({ category, dialogOpen, onClose }) => {
  const type = category.source;
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const throttleSearch = useMemo(
    () =>
      throttle((request, callback) => {
        console.log("Throttled request:", request);
        callback(request);
      }, 1000),
    []
  );

  const doSearch = (event) => {
    throttleSearch(event.target.value, (results) => {
      console.log("Callback", results);
    });
  };

  useEffect(() => {
    if (inputValue.length > 2) {
      doSearch(inputValue);
    }
  }, [inputValue]);

  const classes = useStyles();
  return (
    <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen}>
      <DialogTitle>Add Nomination</DialogTitle>
      <DialogContent>
        <Grid container alignItems="center">
          <Grid item>
            <TextField
              id="search"
              label="Search"
              type="search"
              variant="outlined"
              fullWidth
              helperText="Enter search terms or URL."
              onChange={doSearch}
            />
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddNominationDialog;
