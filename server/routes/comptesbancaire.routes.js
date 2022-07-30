module.exports = function (app) {
  const controllercb = require("../controllers/comptebancaire.controller")
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
    // fetch all 
    router.get("/:num_compte", controllercb.findOneCompte);
    // Update  with id
    router.put("/:id", controllercb.update);
    // Delete  with id
    router.delete("/:num_compte", controllercb.delete);
    app.use("/api/bankaccounts", router);
  };
  