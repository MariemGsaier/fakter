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

//envoyer  facture 
router.post("sendemail", controllerfct.factureEmail);
// créer facture
router.post("/create", controllerfct.create);
  // fetch all factures
  router.get("/", controllerfct.findAll);
  // fetch detailed factures
  router.get("/detailed", controllerfct.findAllDetails);
  // Update a societe with id
  router.put("/:id", controllerfct.update);
  router.get("/articles",controllerfct.findAllArticles)
  app.use("/api/factures", router);
};