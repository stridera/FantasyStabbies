import React, { useEffect, useMemo, useState } from "react";
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
import { throttle } from "lodash";
import { reddit_user as source } from "../../../config/allowedSources";

const RedditUserSearch = ({ onClose, dialogOpen, nominate }) => {
  const [suggestion, setSuggestion] = useState("");

  const performSearch = async (username) => {
    const url = `https://www.reddit.com/user/${username}/about`;
    const { data } = await Axios.get(url + ".json");
    const user = data?.data;

    if (!user?.name) {
      return;
    }

    setSuggestion({
      source: source.id,
      title: `/user/${user.name}`,
      authors: user.name,
      source_url: url,
      image_url: user.snoovatar_img,
    });
  };

  const throttleSearch = useMemo(
    () =>
      throttle((request, callback) => {
        if (request.length > 2) {
          callback(request);
        }
      }, 2000),
    []
  );

  const doSearch = (event) => {
    throttleSearch(event.target.value, performSearch);
  };

  const useStyles = makeStyles((theme) => ({
    img: {
      width: "auto",
      height: 154,
      margin: "auto",
    },
  }));
  const classes = useStyles();
  return (
    <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen}>
      <DialogTitle>Nominate Reddit User</DialogTitle>
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
        {suggestion && (
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={suggestion.image_url}
              alt="Reddit Snoo"
              className={classes.img}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {suggestion.title}
              </Typography>
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

export default RedditUserSearch;
