module.exports = function (app) {
  const controllerdev = require("../controllers/devise.controller")
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //fetch all devises
  router.get("/", controllerdev.findAll);
  // fetch all devises with dates
  router.get("/valeur", controllerdev.findAllDevises);
    // Create 
     router.post("/create", controllerdev.create);
     // Update an devise with id
     router.put("/:nom", controllerdev.update);
    // Delete  with nom
    router.delete("/:nom", controllerdev.delete);
    app.use("/api/devises", router);
  };