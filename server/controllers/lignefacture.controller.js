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
        message:
          err.message 
      });
    });
};

// fetch all factures from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id
    ? { id: { [Op.iLike]: `%${id}%` } }
    : null;
    lignefacture
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
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
        message: err.message
      });
    });
};

// delete a row from ligne facture
exports.delete = (req, res) => {
    const id = req.params.id;
    lignefacture
      .destroy({
        where: { id: id }
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
          message: err.message 
        });
      });
  };




