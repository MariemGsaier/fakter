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
const prixArticle = db.prixArticle;
const Op = db.Sequelize.Op;

// Créer et sauvegarder un nouveau prix article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.prix) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Créer prix
  const prx = {
    prix: req.body.prix,
    date: req.body.date,
    nom_article: req.body.nom_article,
  };
  prixArticle
    .findOne({
      where: {
        prix: req.body.prix,
      },
    })
    .then((prix) => {
      if (prix) {
        res.status(400).send({
          message: "Echec! le prix de l'article existe déjà !",
        });
        return;
      }
    });

  // Sauvegarder prix article dans la base de données
  prixArticle
    .create(prx)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Supprimer un prix article avec l'id spécifié dans la requête
exports.delete = (req, res) => {
  const id = req.params.id;
  article
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "prix article a été supprimé avec succès!",
        });
      } else {
        res.send({
          message: `Cannot delete article with id = ${id}. Maybe article was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
// Supprimer tous les prix articles de la base de données
exports.deleteAll = (req, res) => {
  article
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} article were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
