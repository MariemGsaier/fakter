const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var nodemailer = require("nodemailer");
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
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then((user) => {
      if (user) {
        authEmail( user.email , user.username,user.password);
        res.send({ message: "User was registered successfully!" });
        
  
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
async function authEmail( email,username,password){
  var transport = await nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d40e8b0694c73d", 
      pass: "accfebdb847e90" 
    }
  });
  var mailOptions = {
    from: `"Mariem Gsaier", "mariem@gmail.com"`,
  to: `<${email}>`,
  subject: "Accés Fakter ",
  html: "<h4>Vous pouvez accéder maintenant à cotre espace cher utilisateur</h4> <br> <p>Ci-dessous, vous trouverez vos données d'authentification : <br> Nom d'utilisateur : " + `${username}` + " <br> Mot de passe : " + `${password}` +"</p><br> Veuillez changer votre mot de passe immédiatement en raison de sécurité à travers le lien ci-dessous : ",
};
await transport.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
}
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
