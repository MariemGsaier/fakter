module.exports = function (app) {
  const controllerste = require("../controllers/societe.controller");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Créer une société
  router.post("/create", controllerste.create);
  // fetch d'une société par id
  router.get("/:id", controllerste.findOne);
  // Update a societe with id
  router.put("/:id", controllerste.update);
  app.use("/api/societes", router);
};
