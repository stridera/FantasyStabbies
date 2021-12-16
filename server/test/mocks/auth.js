module.exports = (is_moderator = false, user_id = 10001, age = 9999) => {
  const token = `Bearer ${process.env.DEV_TOKEN}`;

  // Get date age days ago
  const date = new Date();
  date.setDate(date.getDate() - age);
  const date_age_ago = date.toISOString();

  return {
    Authorization: token,
    "x-user-id": user_id,
    "x-is-moderator": is_moderator,
    "x-reddit-created": date_age_ago,
  };
};
