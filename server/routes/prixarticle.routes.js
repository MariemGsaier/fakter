module.exports = function (app) {
  const controllerprx = require("../controllers/prixarticle.controller");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Créer prix article
  router.post("/create", controllerprx.create);
  // fetch all dates with articles
  router.get("/", controllerprx.findAllArticles);
  // Delete an article with id
  router.delete("/:id", controllerprx.delete);
  app.use("/api/prix", router);
};
