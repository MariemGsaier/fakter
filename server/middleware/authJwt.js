const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "Super Administrateur") {
      next();
      return;
    }
    res.status(403).send({
      message: "Il faut un rôle de Super Administrateur!",
    });
    return;
  });
};

isObserver = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === "Observateur") {
      next();
      return;
    }
    res.status(403).send({
      message: "Il faut un rôle d'Observateur !",
    });
    return;
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isObserver: this.isObserver,
};
module.exports = authJwt;
