import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Landing = ({ isAuthenticated, isModerator }) => {
  if (isAuthenticated) {
    return isModerator ? <Redirect to="/mod" /> : <Redirect to="/vote" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Reddit r/Fantasy Stabby Awards</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <a href="/auth/reddit/" className="btn btn-light">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  isModerator: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isModerator: state.auth.isModerator,
});

export default connect(mapStateToProps)(Landing);
