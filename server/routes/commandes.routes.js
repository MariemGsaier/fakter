
module.exports = function (app) {
    const controllercmd = require("../controllers/client.controller")
    const { authJwt } = require("../middleware");
    var router = require("express").Router();
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    app.get("/api/test/all", controllercmd.allAccess);
    app.get("/api/test/user", [authJwt.verifyToken], controllercmd.userBoard);
    app.get(
      "/api/test/admin",
      [authJwt.verifyToken, authJwt.isAdmin],
      controllercmd.adminBoard
    );
  
    // Create a new client
     router.post("/create", controllercmd.create);
    // fetch all clients
    router.get("/", controllercmd.findAll);
    // Update a client with id
    router.put("/:id", controllercmd.update);
    // Delete a client with id
    router.delete("/:id", controllercmd.delete);
    // Create a new client
    router.delete("/", controllercmd.deleteAll);
    app.use("/api/commandes", router);
  };
  