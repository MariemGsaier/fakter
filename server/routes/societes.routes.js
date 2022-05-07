const { societe } = require("../models");

module.exports = function (app) {
  const controllerste = require("../controllers/societe.controller");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controllerste.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controllerste.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controllerste.adminBoard
  );

  // Create a new societe
  router.post("/create", controllerste.create);
  // fetch all societes
  router.get("/", controllerste.findAll);
  // Retrieve a single societe with id
  router.get("/:id", controllerste.findOne);
  // Update a societe with id
  router.put("/:id", controllerste.update);
  // Delete a societe with id
  router.delete("/:id", controllerste.delete);
  // Create a new societe
  router.delete("/", controllerste.deleteAll);
  app.use("/api/societes", router);
};
