const db = require("../models");
const societe = db.societe;

// Create and Save a new societe
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nom_societe) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Créer une societe
  const ste = {
    id: req.body.id,
    nom_societe: req.body.nom_societe,
    numtel: req.body.numtel,
    adresse: req.body.adresse,
    courriel: req.body.courriel,
    siteweb: req.body.siteweb,
    type_societe: req.body.type_societe,
    num_rcs: req.body.num_rcs,
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
        message: err.message
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