
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
    app.get("/api/test/all", controllercb.allAccess);
    app.get("/api/test/user", [authJwt.verifyToken], controllercb.userBoard);
    app.get(
      "/api/test/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      controllercb.adminBoard
    );
  
    // Create 
     router.post("/create", controllercb.create);
    // fetch all 
    router.get("/", controllercb.findAll);
    // Update  with id
    router.put("/:id", controllercb.update);
    // Delete  with id
    router.delete("/:id", controllercb.delete);
    // Create 
    router.delete("/", controllercb.deleteAll);
    app.use("/api/bankaccounts", router);
  };
  