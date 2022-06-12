const db = require("../models");
const Op = db.Sequelize.Op;
const lignefacture = db.lignefacture;
exports.create = (req, res) => {
  if (!req.body.quantite) {
    res.status(400).send({
      message: "contenu vide !",
    });
    return;
  }
  const ligneFact = {
    id_facture: req.body.id_facture,
    quantite: req.body.quantite,
    nom_article: req.body.nom_article,
  };

  lignefacture
    .create(ligneFact)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Find a single ligne facture with an id
exports.findOne = (req, res) => {
  const nom_article = req.params.nom_article;
  lignefacture
    .findOne({
      where: { nom_article: nom_article },
    })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(201).send({
          message: `Cannot find ligne facture with nom =${nom_article}.`,
          status : 201
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving ligne facture with =" + nom_article,
      });
    });
};

// Update a facture by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  lignefacture
    .update(req.body.quantite, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "facture was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update facture with id=${id}. Maybe facture was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// delete a row from ligne facture
exports.delete = (req, res) => {
  const id = req.params.id;
  lignefacture
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "la ligne  est supprimée avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression de la ligne avec id=${id}. Peut être qu'elle est inexistante !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
