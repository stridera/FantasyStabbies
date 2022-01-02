import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Button } from "@material-ui/core";
import { google_books, google_books as source } from "../../../config/allowedSources";

import { throttle } from "lodash";
import Axios from "axios";
import SuggestionsList from "../../custom/SuggestionList";

const GoogleBooksSearch = ({ onClose, dialogOpen, nominate }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState("");

  const throttleSearch = useMemo(
    () =>
      throttle((request, callback) => {
        if (request.length > 2) {
          callback(request);
        }
      }, 1500),
    []
  );

  const performSearch = async (searchTerm) => {
    const res = await Axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
    if (!res.data.items) {
      return;
    }

    const suggestions = res.data.items.map((item) => {
      return {
        source: google_books.id,
        google_book_id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors?.join(","),
        publisher: item.volumeInfo.publisher,
        published_date: item.volumeInfo.publishedDate,
        published_year: item.volumeInfo.publishedDate?.split("-")[0],
        source_url: item.volumeInfo.infoLink,
        image_url: item.volumeInfo?.imageLinks?.thumbnail,
      };
    });

    setFilteredSuggestions(
      suggestions.filter((suggestion) => suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const doSearch = (event) => {
    throttleSearch(event.target.value, performSearch);
  };

  const actions = (nominate) => {
    const nominateor = (nomination) => {
      console.log("Nominating", nomination);
      return (
        <Button
          size="small"
          color="primary"
          onClick={() => {
            nominate(nomination);
          }}
        >
          Nominate
        </Button>
      );
    };
    return nominateor;
  };
  return (
    <Dialog onClose={onClose} aria-label="add nomination dialog" open={dialogOpen} fullScreen>
      <DialogTitle>Add Nomination from Google Books</DialogTitle>
      <DialogContent>
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          fullWidth
          helperText={source.helperText}
          onChange={doSearch}
        />
        <SuggestionsList suggestions={filteredSuggestions} actions={actions(nominate)} />
      </DialogContent>
    </Dialog>
  );
};

export default GoogleBooksSearch;
