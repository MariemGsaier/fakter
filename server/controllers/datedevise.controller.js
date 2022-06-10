const db = require("../models");
const dateDevise = db.dateDevise;
const Op = db.Sequelize.Op;

// Créer et enregistrer une date devise
exports.create = (req, res) => {
    if (!req.body.date) {
      res.status(400).send({
        message: "contenu vide !"
      });
      return;
    }
    const dateDev = {
      date: req.body.date,
      valeur: req.body.valeur,
      nom_devise: req.body.nom_devise
   };
   console.log("mmm" + dateDev);

    dateDevise
    .create(dateDev)
      .then(data => {
        res.send(data);
        console.log("ajout avec succés");
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message 
        });
      });
};

// Lister les dates devises
exports.findAll = (req, res) => {
    const  id = req.query.id;
    var condition =  id
      ? {  id: { [Op.iLike]: `%${ id}%` } }
      : null;
    dateDevise
      .findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "une erreur est survenue lors de l'affichage.",
        });
      });
  };
  // Lister les devises avec les dates et valeurs
  exports.findAllDevises = (req, res) => {
    return dateDevise
      .findAll({
        include: ["devises"],
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "une erreur est survenue lors de l'affichage de la liste des devises avec leur valeurs.",
        });
      });
  };
// Supprimer une date devise avec le nom spécifié dans la requête
exports.delete = (req, res) => {
  const id = req.params.id;
  dateDevise
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "la date devise est supprimée avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression de la date devise avec nom = ${nom}. Peut être qu'elle est inexistante !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Echec de suppression de la date devise avec nom = " + nom,
      });
    });
};
// Supprimer toutes les dates devise de la base de données
exports.deleteAll = (req, res) => {
  dateDevise
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({
        message: `${nums} Toutes les dates devises sont supprimés avec succés !`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Une erreur est survenue lors de la suppression des dates devises.",
      });
    });
};