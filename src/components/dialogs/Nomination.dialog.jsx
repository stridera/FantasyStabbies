import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography } from "@material-ui/core";
import allowedSources from "../../config/allowedSources";
import GoogleBooksSearch from "./search/GoogleBooksSearch";
import ManualSearch from "./search/ManualSearch";
import RedditFantasySearch from "./search/RedditFantasySearch";
import RedditUserSearch from "./search/RedditUserSearch";
import { createWork } from "../../store/entities/works.slice";
import { createNominationInCategory } from "../../store/entities/nominations.slice";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({}));

const AddNominationDialog = ({ category, dialogOpen, onClose }) => {
  const dispatch = useDispatch();
  const [source, setSource] = useState(category.source);

  const nominate = (book) => {
    dispatch(createWork(book))
      .then((data) => {
        if (data.error) {
          console.log("Error creating work: ", data.error);
          // Todo: Set error message
          return;
        }
        const work = data.payload;
        dispatch(createNominationInCategory({ category, work }))
          .then((data) => {
            if (data.error) {
              console.log("Error creating nomination: ", data.error);
              return;
            }
            onClose();
          })
          .catch((err) => {
            console.log("Error creating nomination", err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const classes = useStyles();
  switch (source) {
    case allowedSources.google_books.id:
      return <GoogleBooksSearch onClose={onClose} dialogOpen={dialogOpen} setSource={setSource} nominate={nominate} />;
    case allowedSources.manual.id:
      return <ManualSearch onClose={onClose} dialogOpen={dialogOpen} setSource={setSource} nominate={nominate} />;
    case allowedSources.fantasy_url.id:
      return (
        <RedditFantasySearch onClose={onClose} dialogOpen={dialogOpen} setSource={setSource} nominate={nominate} />
      );
    case allowedSources.reddit_user.id:
      return <RedditUserSearch onClose={onClose} dialogOpen={dialogOpen} setSource={setSource} nominate={nominate} />;
    default:
      return (
        <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen}>
          <DialogTitle>Add Nomination Error</DialogTitle>
          <DialogContent>
            <Typography>The source {source} is not supported. Please select a different source.</Typography>
          </DialogContent>
        </Dialog>
      );
  }
};

export default AddNominationDialog;
