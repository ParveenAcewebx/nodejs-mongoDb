errorLogger = require("./startup/errorLogger");
infoLogger = require("./startup/infoLogger"); 


const express = require("express");
require("dotenv").config();
const app = express();

// Log All req, response parms
require("./startup/httpLogger")(app);

require("./startup/swagger")(app);
require("./startup/db")();
require("./startup/routes")(app);




// set port, listen for requests
const PORT = process.env.PORT || 8444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// https://github.com/bezkoder

// ## Readme file genrator //

// https://readme.so/editor 
// https://rahuldkjain.github.io/gh-profile-readme-generator/