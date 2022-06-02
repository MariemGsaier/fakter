module.exports = function (app) {
  const userController = require("../controllers/user.controller");
  const { authJwt } = require("../middleware");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", userController.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  );
// fetch all users
router.get("/", userController.findAll);
// Update a user with id
router.put("/:id", userController.update);
// Update a User password with id
router.put("/pass/:id", userController.updatePassword);
// Delete a user with id
router.delete("/:id", userController.delete);
// delete all users
router.delete("/", userController.deleteAll);

// base url
app.use("/api/users", router);
};
