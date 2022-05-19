const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:4200",
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

// const Role = db.role;
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to fakter application." });
});
// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/clients.routes")(app);
require("./routes/articles.routes")(app);
require("./routes/comptesbancaire.routes")(app);
require("./routes/societes.routes")(app);
require("./routes/factures.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
