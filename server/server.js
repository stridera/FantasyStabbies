// App
const app = require("./app");

// App Configuration
const PORT = process.env.PORT || 5000;

/** Listen **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
