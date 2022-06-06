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

//créer une facture 
router.post("sendemail", controllerfct.factureEmail);
router.post("/create", controllerfct.create);
  // fetch all societes
  router.get("/", controllerfct.findAll);
  // Update a societe with id
  router.put("/:id", controllerfct.update);
  app.use("/api/factures", router);
};