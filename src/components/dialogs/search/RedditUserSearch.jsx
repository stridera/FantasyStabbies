import React, { useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
import allowedSources from "../../../config/allowedSources";

const RedditUserSearch = () => {
  const throttleSearch = useMemo(
    () =>
      throttle((request, callback) => {
        callback(request);
      }, 1000),
    []
  );

  return <></>;
};

export default RedditUserSearch;
