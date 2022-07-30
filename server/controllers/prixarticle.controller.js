const db = require("../models");
const prixArticle = db.prixArticle;


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
    cout: req.body.cout,
    date: req.body.date,
    nom_article: req.body.nom_article,
  };

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

exports.findAllArticles = (req, res) => {
  return prixArticle
    .findAll({
      include: ["articles"],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "une erreur est survenue lors de l'affichage de la liste des articles avec leurs prix.",
      });
    });
};

// Supprimer un prix article avec l'id spécifié dans la requête
exports.delete = (req, res) => {
  const id = req.params.id;
  prixArticle
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
