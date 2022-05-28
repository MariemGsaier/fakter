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
const societe = db.societe;
const Op = db.Sequelize.Op;
// Create and Save a new societe
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nom_societe) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a societe
  const ste = {
    nom_societe: req.body.nom_societe,
    logo: req.body.logo,
    numtel: req.body.numtel,
    adresse: req.body.adresse,
    courriel: req.body.courriel,
    siteweb: req.body.siteweb,
    type_societe: req.body.type_societe,
    num_rcs: req.body.num_rcs,
    timbre_fiscale: req.body.timbre_fiscale,
  };
  // Save societe in the database
  societe
    .create(ste)
    .then((data) => {
      res.send(data);
      // console.log("ajout avec succés");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the societe.",
      });
    });
};
// fetch all articles from the database.
exports.findAll = (req, res) => {
  const nom_societe = req.query.nom_societe;
  var condition = nom_societe
    ? { nom_societe: { [Op.iLike]: `%${nom_societe}%` } }
    : null;
  societe
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching societes.",
      });
    });
};

// Find a single societe with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  societe.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find societe with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving societe with id=" + id
      });
    });
};

// Update a societe by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  societe
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "societe was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update societe with id=${id}. Maybe societe was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating societe with id=" + id,
      });
    });
};
// Delete a societe with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  societe
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "societe was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete societe with id=${id}. Maybe societe was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete societe with id=" + id,
      });
    });
};
// Delete all societes from the database.
exports.deleteAll = (req, res) => {
  societe
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} societes were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all societes.",
      });
    });
};
