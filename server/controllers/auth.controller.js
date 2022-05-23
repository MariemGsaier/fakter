const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
// const Role = db.role;
// const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (user) {
        res.send({ message: "User was registered successfully!" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      if (!user) {
        return res.status(404).send({ message: "User Not found or username is invalid!" });
      } else if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      } else {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          accessToken: token,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
