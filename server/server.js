const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
var corsOptions = {
  origin: "http://localhost:4200",
};
const app = express();
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

// const Role = db.role;
db.sequelize.sync();


// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/clients.routes")(app);
require("./routes/articles.routes")(app);
require("./routes/comptesbancaire.routes")(app);
require("./routes/societes.routes")(app);
require("./routes/factures.routes")(app);
require("./routes/devise.routes")(app);
require("./routes/datedevise.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}.`);
});
