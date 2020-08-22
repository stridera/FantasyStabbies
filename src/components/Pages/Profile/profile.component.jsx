import React, { useEffect } from "react";

const Profile = ({ setTitle }) => {
  useEffect(() => {
    setTitle("Profile");
  }, [setTitle]);

  return <h1>Profile page will be here... someday.</h1>;
};

export default Profile;
