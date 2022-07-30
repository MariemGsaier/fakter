const db = require("../models");
const user = db.user;
const Op = db.Sequelize.Op;
var nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");

// fetch all user from the database.
exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username
    ? { username: { [Op.iLike]: `%${username}%` } }
    : null;
  user
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching users.",
      });
    });
};

// Update a user by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  user
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "user was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// Disable a user by the id in the request
exports.disableUser = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const newPass = bcrypt.hashSync(data.password, 8);
  req.body.password = newPass;
  user
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "user was disabled and updated successfully.",
        });
        disabledEmail(req.body.email, req.body.username);
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// The function to send an email to inform that user has been disabled
async function disabledEmail(email, username) {
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
    subject: "Changement de statut Fakter ",
    html:
      "<p>Bonjour " +
      `${username},` +
      "</p>  Cet email vous a été envoyé pour vous informer que votre compte chez Fakter est maintenant désactivé.<br>Vous ne pouvez plus y accéder.</p><br> S'il s'agit d'un comportement inhabituel, veuillez contacter votre super administrateur pour vérifier toute erreur commise.",
  };
  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

// Enable a user by the id in the request
exports.EnableUser = (req, res) => {
  const id = req.params.id;
  user
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "user was enabled and updated successfully.",
        });
        enabledEmail(req.body.email, req.body.username);
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// The function to send an email to inform that user has been disabled
async function enabledEmail(email, username) {
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
      "<p>Bonjour cher"+  `${username},` +", </p>  <p>Votre compte est maintenant activé !</p><br><p> Vous pouvez accéder de nouveau à votre espace chez Fakter.</p><br> <p>Votre nom d'utilisateur est : " +
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

// Update a user's password by the id in the request
exports.updatePassword = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  // console.log(data);
  user
    .findOne({
      where: {
        id: id,
      },
    })
    .then((user) => {
      var passwordIsValid = bcrypt.compareSync(
        data.currentPassword,
        user.password
      );

      if (passwordIsValid) {
        const newPass = bcrypt.hashSync(data.password, 8);
        const updatedPassword = { password: newPass };

        user
          .update(updatedPassword, {
            where: { id: id },
          })
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "user was updated successfully.",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating user with id=" + id,
            });
          });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  user
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "user was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
      });
    });
};
// Delete all users from the database.
exports.deleteAll = (req, res) => {
  user
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};
