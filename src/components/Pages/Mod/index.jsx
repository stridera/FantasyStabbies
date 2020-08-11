import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Mod = () => {
  return (
    <Fragment>
      <h1>Moderator Page</h1>
      <Link to="/vote">
        <i className="fas fa-user" /> <span className="hide-sm">Vote</span>
      </Link>
    </Fragment>
  );
};

export default Mod;
