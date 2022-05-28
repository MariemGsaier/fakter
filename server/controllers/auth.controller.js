const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var nodemailer = require("nodemailer");
// const Role = db.role;
// const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { error } = require("console");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      // var transporter = nodemailer.createTransport({
      //   host: "smtp.gmail.com",
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: "gsaiermeriem24@gmail.com",
      //     pass: "000000",
      //   },
      // });
      // var mailoptions = {
      //   from: "gsaiermeriem24@gmail.com",
      //   to: req.body.email,
      //   subject: "Authentification email",
      //   html: "You can sign in now !",
      // };
      // transporter.sendMail(mailoptions, function (error, info) {
      //   if (error) {
      //     // console.log(error);
      //     res.send("sending email failed");
      //   } else {
      //     // console.log("email sent" +info.response);
      //     res.send("email sent successfully !");
      //   }
      // });

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
      var passwordIsValid  = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      if (!user) {
        return res
          .status(404)
          .send({ message: "User Not found or username is invalid!" });
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
