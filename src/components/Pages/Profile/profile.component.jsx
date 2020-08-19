import React from "react";
import DrawerLayout from "../../layout/DrawerLayout";

const Profile = ({ setTitle }) => {
  setTitle("Moderator");

  return (
    <DrawerLayout title="Profile">
      <h1>Profile</h1>
    </DrawerLayout>
  );
};

export default Profile;
