const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var nodemailer = require("nodemailer");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.createUser = (req, res) => {
  // get the infos from the req and then saving the user into the db
  User.create({
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    etat_user: req.body.etat_user,
    // hashing the pw in the req on 8 salt rounds = cost factor
    //The cost factor controls how much time is needed to calculate a single BCrypt hash
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (user) {
        res.send({ message: "l'utilisateur est créé avec succés!" });
        // send email containing the username and the link to change password
        authEmail(user.email, user.username);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
// The function to send an email to change password for the first auth
async function authEmail(email, username) {
  // service that will transport the email and it's mailtrap in our case
  var transport = await nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d40e8b0694c73d",
      pass: "accfebdb847e90",
    },
  });
  var mailOptions = {
    from: `"no-reply", "noreply@hello.com"`,
    to: `<${email}>`,
    subject: "Accés Fakter ",
    html:
      "<p>Bonjour cher utilisateur, </p>  <p><strong>Bienvenue</strong>, vous pouvez accéder maintenant à votre espace chez Fakter.</p><br> <p>Votre nom d'utilisateur est : " +
      `${username}` +
      ".</p><br> Veuillez changer votre mot de passe immédiatement en raison de sécurité à travers ce   <a href='http://localhost:4200/change-pw'>lien<a>",
  };
  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}
// sending email of forgotten password containing the link to change the password
exports.forgotPw = (req, res) => {
  const email = req.body.email;
  User.findOne({
    where: { email: email },
  })
    .then((user) => {
      res.send(user);
      var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "d40e8b0694c73d",
          pass: "accfebdb847e90",
        },
      });
      var mailOptions = {
        from: `"Omar Elloumi", "noreply@hello.com"`,
        to: `<${email}>`,
        subject: "Mot de passe oublié ",
        html: "<p>Bonjour cher utilisateur,<br><br> Une réinitialisation du mot de passe a été demandée pour le compte Fakter lié à cet e-mail.<br><br> Vous pouvez changer votre mot de passe en suivant <a href='http://localhost:4200/change-forgotpw'>ce lien<a>. <br><br>Note : Si vous ne vous attendez pas à cela, vous pouvez ignorer cet e-mail.</p>",
      };
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
// changing the password for the first auth
exports.changeFirstPw = (req, res) => {
  const username = req.body.username;
  const nouvpass = req.body.password;
  if (nouvpass != null) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.update(req.body, {
      where: { username: username },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Le mot de passe est mis à jour avec succés .",
          });
        } else {
          res.send({
            message:
              "Echec de mise à jour du mot de passe . L'utilisateur est peut être inexistant ou le corps de la requête est vide!",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  }
};
// change the forgotten password depending on the user's email
exports.changeForgotPw = (req, res) => {
  const email = req.body.email;
  const nouvpass = req.body.password;
  if (nouvpass != null) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.update(req.body, {
      where: { email: email },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Le mot de passe est mis à jour avec succés .",
          });
          console.log("hh", req.body);
        } else {
          res.send({
            message:
              "Echec de mise à jour du mot de passe . L'utilisateur est peut être inexistant ou le corps de la requête est vide!",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  }
};
// siign in
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
        return res
          .status(404)
          .send({
            message:
              "L'utilisateur est inexsitant ou nom d'utilisateur est invalide!",
          });
      } else if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Le mot de passe est invalide!",
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
