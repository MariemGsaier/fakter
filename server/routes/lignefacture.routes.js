const { facture } = require("../models");

module.exports = function (app) {
  const controllerlignefct = require("../controllers/lignefacture.controller");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

// créer une ligne facture
router.post("/", controllerlignefct.create);
  // fetch all societes
  router.get("/", controllerlignefct.findAll);
  // Update a societe with id
  router.put("/:id", controllerlignefct.update);
  app.use("/api/lignefacture", router);
};