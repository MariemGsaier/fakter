module.exports = function (app) {
  const controllercb = require("../controllers/comptebancaire.controller")
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
     router.post("/create", controllercb.create);
    // fetch all 
    router.get("/", controllercb.findAll);
    // Update  with id
    router.put("/:id", controllercb.update);
    // Delete  with id
    router.delete("/:id", controllercb.delete);
    app.use("/api/bankaccounts", router);
  };
  