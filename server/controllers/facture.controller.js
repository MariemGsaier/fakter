const db = require("../models");
const facture = db.facture;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.reference) {
    res.status(400).send({
      message: "contenu vide !",
    });
    return;
  }
  const fact = {
    reference: req.body.reference,
    vendeur: req.body.vendeur,
    date_facturation: req.body.date_facturation,
    date_echeance: req.body.date_echeance,
    etat_facture: req.body.courriel,
    etat_echeance: req.body.etat_echeance,
    total_ht: req.body.etat_echeance,
    total_chiffres:req.body.etat_echeance,
    total_lettres:req.body.etat_echeance,
    total_devise:req.body.etat_echeance,
  };

  facture
    .create(fact)
    .then((data) => {
      res.send(data);
      console.log("ajout avec succés");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "une erreur est survenue lors de la création du client.",
      });
    });
};

// fetch all factures from the database.
exports.findAll = (req, res) => {
  const reference = req.query.reference;
  var condition = reference
    ? { reference: { [Op.iLike]: `%${reference}%` } }
    : null;
  facture
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching factures.",
      });
    });
};

// Update a facture by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  facture
    .update(req.body, {
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
        message: "Error updating facture with id=" + id,
      });
    });
};
