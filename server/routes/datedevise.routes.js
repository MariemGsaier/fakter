module.exports = function (app) {
  const controllerdev = require("../controllers/datedevise.controller");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Create
  router.post("/create", controllerdev.create);
  // fetch all devises with dates
  router.get("/", controllerdev.findAllDevises);
  // Delete  with id
  router.delete("/:id", controllerdev.delete);
  app.use("/api/datedevises", router);
};
