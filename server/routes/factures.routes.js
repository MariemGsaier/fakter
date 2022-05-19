const { facture } = require("../models");

module.exports = function (app) {
  const controllerfct = require("../controllers/facture.controller");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controllerfct.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controllerfct.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controllerfct.adminBoard
  );

  // fetch all societes
  router.get("/", controllerfct.findAll);
  // Update a societe with id
  router.put("/:id", controllerfct.update);
  app.use("/api/factures", router);
};