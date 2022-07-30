
module.exports = function (app) {
const controllerart = require("../controllers/article.controller")
var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  
    // Create a new article
     router.post("/create", controllerart.create);
    // fetch all article
    router.get("/", controllerart.findAll);
     // fetch all articles with recent prix and dates
     router.get("/prix", controllerart.findAllArticles);
     // fetch all articles with all prix and dates
     router.get("/allPrix", controllerart.findAllArticlesPrix);
    // Update an article with id
    router.put("/:nom_article", controllerart.update);
    // Delete an article with id
    router.delete("/:nom_article", controllerart.delete);
    app.use("/api/articles", router);
  };
  