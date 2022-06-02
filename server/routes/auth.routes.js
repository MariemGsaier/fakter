const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  }); 
  app.put ("/api/auth",controller.changeFirstPw);
  app.post ("/api/auth",controller.forgotPw);
  app.post("/api/auth/changeforgotpw",controller.changeForgotPw);
  app.post(
    "/api/auth/create",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,

    ],)
  app.post("/api/auth/signin", controller.signin);
};
