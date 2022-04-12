
module.exports = function (app) {
  const controller = require("../controllers/user.controller");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Create a new Tutorial
  // router.post("/", tutorials.create);

  // Retrieve all users
  router.get("/", controller.findAll);
  // Retrieve users by keyword
  router.get("/:term", controller.search);
  // // Retrieve a single Tutorial with id
  // router.get("/:id", tutorials.findOne);
  // Update a Tutorial with id
  router.put("/:id", controller.update);
  // Delete a Tutorial with id
  router.delete("/:id", controller.delete);
  // Create a new Tutorial
  router.delete("/", controller.deleteAll);
  app.use("/api/users", router);
};
