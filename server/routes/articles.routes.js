
module.exports = function (app) {
  const controllerart = require("../controllers/article.controller")
  const { authJwt } = require("../middleware");
  const DIR = './uploads';
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controllerart.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controllerart.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controllerart.adminBoard
  );

  
    // Create a new article
     router.post("/create", controllerart.create);
    // fetch all article
    router.get("/", controllerart.findAll);
     // fetch all articles with dates
     router.get("/prix", controllerart.findAllArticles);
    // Update an article with id
    router.put("/:id", controllerart.update);
    // Delete an article with id
    router.delete("/:id", controllerart.delete);
    // Create a new article
    router.delete("/", controllerart.deleteAll);
    app.use("/api/articles", router);
  };
  