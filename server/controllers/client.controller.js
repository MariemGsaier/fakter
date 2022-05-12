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
const client = db.client;
const Op = db.Sequelize.Op;
// Create and Save a new client
  exports.create = (req, res) => {
    // Validate request
    if (!req.body.nom_client) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a Tutorial
    const clt = {
      nom_client: req.body.nom_client,
      adresse_client: req.body.adresse_client,
      numtel_client: req.body.numtel_client ,
      courriel_client: req.body.courriel_client ,
      siteweb_client: req.body.siteweb_client ,
      dureepaiement_client: req.body.dureepaiement_client
    };
    // Save client in the database
    client
    .create(clt)
      .then(data => {
        res.send(data);
        console.log("ajout avec succés");
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the client."
        });
      });
};
// fetch all clients from the database.
exports.findAll = (req, res) => {
  const nom_client = req.query.nom_client;
  var condition = nom_client
    ? { nom_client: { [Op.iLike]: `%${nom_client}%` } }
    : null;
  client
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

// Update a client by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  client
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
          message: `Cannot update client with id=${id}. Maybe client was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating client with id=" + id,
      });
    });
};
// Delete a client with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  client
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "client was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete client with id=${id}. Maybe client was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete client with id=" + id,
      });
    });
};
// Delete all clients from the database.
exports.deleteAll = (req, res) => {
  client
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} clients were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all clients.",
      });
    });
};

