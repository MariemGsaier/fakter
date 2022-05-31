module.exports = function (app) {
    const controllerclt = require("../controllers/client.controller")
    const { authJwt } = require("../middleware");
    var router = require("express").Router();
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    // Create a new client
     router.post("/create", controllerclt.create);
    // fetch all clients
    router.get("/", controllerclt.findAll);
    // Update a client with id
    router.put("/:id", controllerclt.update);
    // Delete a client with id
    router.delete("/:id", controllerclt.delete);
    // Create a new client
    router.delete("/", controllerclt.deleteAll);
    app.use("/api/clients", router);
  };
  