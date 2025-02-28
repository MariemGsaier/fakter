module.exports = function (app) {
  const userController = require("../controllers/user.controller");
  var router = require("express").Router();
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
// fetch all users
router.get("/", userController.findAll);
// Update a user with id
router.put("/:id", userController.update);
// Disable a user with id
router.put("/disable-user/:id", userController.disableUser);
// Enable a user with id
router.put("/enable-user/:id", userController.EnableUser);
// Update a User password with id
router.put("/pass/:id", userController.updatePassword);
// Delete a user with id
router.delete("/:id", userController.delete);
// delete all users
router.delete("/", userController.deleteAll);

// base url
app.use("/api/users", router);
};
