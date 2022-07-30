module.exports = function (app) {
  const controllerfct = require("../controllers/facture.controller");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

//envoyer  facture 
router.post("/sendemail", controllerfct.factureEmail);
// créer facture
router.post("/create", controllerfct.create);
  // fetch all factures
  router.get("/", controllerfct.findAll);
  // fetch detailed factures
  router.get("/detailed", controllerfct.findAllDetails);
  // fetch facture of client
  router.get("/client/:id_client", controllerfct.findOneArticle);
  // fetch facture of account
  router.get("/compte/:num_compte", controllerfct.findOneAccount);
  // fetch facture of devise
  router.get("/devise/:nom_devise", controllerfct.findOneDevise);
  // fetch facture of user
  router.get("/user/:id_user", controllerfct.findOneUser);
  // Update a societe with id
  router.put("/:id", controllerfct.update);
  router.get("/articles",controllerfct.findAllArticles)
  // supprimer une facture
  router.delete("/:id",controllerfct.delete)
  app.use("/api/factures", router);
};