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

    dateDevise
    .create(dateDev)
      .then(data => {
        res.send(data);
        console.log("ajout avec succés");
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "une erreur est survenue lors de la création de la date devise."
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
          message: err.message || "une erreur est survenue lors de l'affichage.",
        });
      });
  };

 // Modifier une date devise
exports.update = (req, res) => {
  const id = req.params.id;

  dateDevise
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "La date devise est mise à jour avec succés.",
        });
      } else {
        res.send({
          message: `erreur de mise à jour due la date devise avec id=${id}. peut être la date devise est inexistante ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating date devise with id=" + id,
      });
    });
};

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
          message: `Echec de suppression de la date devise avec id=${id}. Peut être qu'elle est inexistante !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Echec de suppression de la date devise avec id=" + id,
      });
    });
};
// Delete all devises from the database.
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