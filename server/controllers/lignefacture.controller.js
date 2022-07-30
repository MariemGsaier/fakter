const db = require("../models");
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

exports.findAll = (req, res) => {

  lignefacture.findAll({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
        });
    });
};

