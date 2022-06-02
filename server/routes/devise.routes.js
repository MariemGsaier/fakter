module.exports = function (app) {
    const controllerdev = require("../controllers/devise.controller")
    const { authJwt } = require("../middleware");
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
    // Update  with nom
    router.put("/:nom", controllerdev.update);
    // Delete  with nom
    router.delete("/:nom", controllerdev.delete);
    // Delete all 
    router.delete("/", controllerdev.deleteAll);
    app.use("/api/devises", router);
  };