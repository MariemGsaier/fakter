const db = require("../models");
const devise = db.devise;
const Op = db.Sequelize.Op;
// Créer et enregistrer une devise
exports.create = (req, res) => {
  if (!req.body.nom) {
    res.status(400).send({
      message: "contenu vide !",
    });
    return;
  }
  const dev = {
    nom: req.body.nom,
    devise: req.body.devise,
    archive: req.body.archive,
  };
  devise.findOne({
    where: {
      nom: req.body.nom,
    },
  }).then((data) => {
    if (data) {
      res.status(400).send({
        message: "Echec! le nom de la devise entré existe déjà !",
      });
      return;
    } else {
      devise
        .create(dev)
        .then((data) => {
          res.send(data);
          console.log("ajout avec succés");
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "une erreur est survenue lors de la création de la devise.",
          });
        });
    }
  });
};

// Lister les devises
exports.findAll = (req, res) => {
  const nom = req.query.nom;
  var condition = nom ? { nom: { [Op.iLike]: `%${nom}%` } } : null;
  devise
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "une erreur est survenue lors de l'affichage de la liste des devises.",
      });
    });
};

// Lister les devises avec valeurs et dates
exports.findAllDevises = (req, res) => {
  const nom = req.query.nom;
  var condition = nom ? { nom: { [Op.iLike]: `%${nom}%` } } : null;
  devise
    .findAll({ where: condition, include: ["dates"] })
    .then((result) => {
      data = result.map((el) => el.get({ plain: true }));
      for (i = 0; i < data.length; i++) {
        if (data[i].dates.length == 0) continue;
        var indice = 0;
        for (j = 1; j < data[i].dates.length; j++) {
          if (data[i].dates[indice].date < data[i].dates[j].date) {
            indice = j;
          }
        }
        var latestValeur = new Array();
        latestValeur.push(data[i].dates[indice]);
        data[i].dates = [];
        latestValeur_obj = { ...latestValeur };
        data[i].dates = latestValeur_obj;
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "une erreur est survenue lors de l'affichage de la liste des devises et leur valeurs.",
      });
    });
};
// Modifier une devise avec le nom spécifié dans la requête
exports.update = (req, res) => {
  const nom = req.params.nom;
  devise
    .update(req.body, {
      where: { nom: nom },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "La devise est mise à jour avec succés.",
        });
      } else {
        res.send({
          message: `erreur de mise à jour de la devise avec nom = ${nom}. peut être la devise est inexistant ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur  de mise à jour de la devise avec nom_article = " + id,
      });
    });
};

// Delete a devise with the specified name in the request
exports.delete = (req, res) => {
  const nom = req.params.nom;
  devise
    .destroy({
      where: { nom: nom },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "la devise est supprimée avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression de la devise avec nom=${nom}. Peut être qu'elle est inexistante !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Echec de suppression de la devise avec nom=" + nom,
      });
    });
};
