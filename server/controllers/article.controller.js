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
const article = db.article;
const prixArticle = db.prixArticle;
const Op = db.Sequelize.Op;

// Create and Save a new article
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nom_article) {
    res.status(400).send({
      message: "contenu vide !",
    });
    return;
  }
  // Create an article
  const art = {
    nom_article: req.body.nom_article,
    type_article: req.body.type_article,
    cout: req.body.cout,
    description: req.body.description,
  };
  article
    .findOne({
      where: {
        nom_article: req.body.nom_article,
      },
    })
    .then((article) => {
      if (article) {
        res.status(400).send({
          message: "Echec! le nom de l'article existe déjà !",
        });
        return;
      }
    });

  // Save article in the database
  article
    .create(art)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message ||
        "une erreur est survenue lors de la création de l'article.",
    });
    });
};
// Lister les articles
exports.findAll = (req, res) => {
  const nom_article = req.query.nom_article;
  var condition = nom_article
    ? { nom_article: { [Op.iLike]: `%${nom_article}%` } }
    : null;
  article
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message ||
        "une erreur est survenue lors de l'affichage de la liste des articles.",
      });
    });
};

// Lister les articles avec prix et dates
exports.findAllArticles = (req, res) => {
  const nom_article = req.query.nom_article;
  var condition = nom_article
    ? { nom_article: { [Op.iLike]: `%${nom_article}%` } }
    : null;
  article
    .findAll({ where: condition, include: ["prix"] })
    .then((result) => {
      data = result.map(el => el.get({ plain: true }))
      for (i = 0; i < data.length; i++) {
        if (data[i].prix.length == 0) continue
        var indice = 0;
        for (j = 1; j < data[i].prix.length; j++) {
          if (data[i].prix[indice].date < data[i].prix[j].date) {
            indice = j;
          }
        }
        var latestPrix = new Array();
        latestPrix.push(data[i].prix[indice]);
        data[i].prix = [];
        data[i].prix = latestPrix;
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message ||
        "une erreur est survenue lors de l'affichage de la liste des articles.",
      });
    });
};

// Modifier un article avec le nom spécifié dans la requête
exports.update = (req, res) => {
  const nom_article = req.params.nom_article;
  article
    .update(req.body, {
      where: { nom_article: nom_article },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "L'article est mis à jour avec succés.",
        });
      } else {
        res.send({
          message: `erreur de mise à jour de l'article avec nom = ${nom_article }. peut être l'article est inexistant ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur  de mise à jour de l'article  avec nom_article = " + nom_article,
      });
    });
};
// Supprimer un article avec le nom spécifié dans la requête
exports.delete = (req, res) => {
  const nom_article = req.params.nom_article;
  article
    .destroy({
      where: { nom_article: nom_article },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "L'article est supprimé avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression de l'article  avec nom_article = ${nom_article }. Peut être qu'il est inexistant !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
// Supprimer tous les articles de la base de données
exports.deleteAll = (req, res) => {
  article
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} Tous les articles sont supprimés avec succés !` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
