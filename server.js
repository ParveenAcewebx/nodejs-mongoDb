const express = require("express")
const app = express();

//require("./startup/swagger")(app);
require("./startup/db")();
require("./startup/routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// https://github.com/bezkoder