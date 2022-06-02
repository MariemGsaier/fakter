exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content."); // try to modify it to // console.log()
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const db = require("../models");
const user = db.user;
const Op = db.Sequelize.Op;
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

// Update a user's password by the id in the request
exports.updatePassword = (req, res) => {
  const id = req.params.id;
  const data = req.body
  console.log(data)
  user.findOne({
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
    const newPass = bcrypt.hashSync(data.password, 8)
    const updatedPassword = {password : newPass}

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
})
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





