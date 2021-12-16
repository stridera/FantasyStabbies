// App
const app = require("./app");

// App Configuration
const PORT = process.env.PORT || 5000;

// Log requests
app.use(morgan("combined", { stream: winston.stream }));

/** Listen **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
