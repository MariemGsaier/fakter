const { facture } = require("../models");
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






