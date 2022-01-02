import React, { useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
import { fantasyUrl as source } from "../../../config/allowedSources";

const RedditFantasySearch = () => {
  const throttleSearch = useMemo(
    () =>
      throttle((request, callback) => {
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

  return <></>;
};

export default RedditFantasySearch;
