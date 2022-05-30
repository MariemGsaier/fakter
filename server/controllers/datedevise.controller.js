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

  // Modifier la date et valeur d'une devise
exports.update = (req, res) => {
  const nom = req.params.nom;

  devise
    .update(
      {
        date: req.body.date,
        valeur: req.body.valeur,
        nom_devise: req.body.nom_devise
      },
      {
        where: { nom: nom },
      }
    )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "La devise est mise à jour avec succés.",
        });
      } else {
        res.send({
          message: `erreur de mise à jour due la devise avec nom=${nom}. peut etre la devise est inexistante ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating devise with nom=" + nom,
      });
    });
};