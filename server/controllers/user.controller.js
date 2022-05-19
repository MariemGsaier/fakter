exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content."); // try to modify it to console.log()
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

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  user.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find user with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
};

// Update a user by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  // const pass = req.body.password
  // console.log('check body for pass', pass)
  // // if (pass != null) {
  // //   pass: bcrypt.hashSync(req.body.password, 8),
  // // }
  console.log('id', id)
  console.log('rrr', req.body)
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
      console.log('errror', err)
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });

};

exports.passCheck = (req, res) => {
  console.log('ttt', req.params)
  console.log('ttt', req.body)
  user.findOne({
    where: {
      id: (req.params.id),
    },
  })
    .then((user) => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(200).send({
          message: false,
        });
      } else {
        return res.status(200).send({
          message: true,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
exports.search = (req, res) => {
  const { term }  = req.params;
  // term = term.toLowerCase();
  user
    .findAll({ where: { username: { [Op.like]: `%${term}%` } } })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching users.",
      });
    });
};




