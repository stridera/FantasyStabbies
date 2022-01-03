import React, { useMemo, useState } from "react";
import Axios from "axios";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";

import { throttle } from "lodash";
import { fantasy_url as source } from "../../../config/allowedSources";

const RedditFantasySearch = ({ onClose, dialogOpen, nominate }) => {
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState(null);

  const performSearch = async (url) => {
    if (!url.startsWith(source.url)) {
      setError(`Invalid URL.  Must start with ${source.url}`);
      return;
    } else {
      setError(null);
    }

    const { data } = await Axios.get(url + ".json");
    const page = data?.[0]?.data?.children?.[0]?.data;

    if (!page) {
      return;
    }

    setSuggestion({
      source: source.id,
      title: page.title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"),
      authors: page.author,
      publisher: page.subreddit,
      published_date: new Date(page.created_utc * 1000).toISOString().substring(0, 10),
      source_url: page.url,
    });
  };

  const throttleSearch = useMemo(
    () =>
      throttle((request, callback) => {
        if (request.length > 2) {
          callback(request);
        }
      }, 1000),
    []
  );

  const doSearch = (event) => {
    throttleSearch(event.target.value, performSearch);
  };

  const useStyles = makeStyles((theme) => ({}));
  const classes = useStyles();
  return (
    <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen}>
      <DialogTitle>Nominate Via Reddit Fantasy URL</DialogTitle>
      <DialogContent>
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          fullWidth
          autoFocus
          helperText={source.helperText}
          onChange={doSearch}
        />
        <Typography color="error" variant="caption">
          {error}
        </Typography>
        {suggestion && (
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {suggestion.title}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Author: {suggestion.authors}
              </Typography>
              {suggestion.published_date && (
                <Typography variant="body2" color="textSecondary" component="p">
                  Date: {suggestion.published_date}{" "}
                  {suggestion.published_date?.split("-")[0] !== "2021" && <WarningIcon />}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  nominate(suggestion);
                }}
              >
                Nominate
              </Button>
            </CardActions>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RedditFantasySearch;
