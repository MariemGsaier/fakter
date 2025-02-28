const db = require("../models");
const comptebancaire = db.comptebancaire;
// Créer et enregistrer un compte bancaire
exports.create = (req, res) => {
  // console.log(req.body);
  if (!req.body.num_compte) {
    res.status(400).send({
      message: "Contenu vide !",
    });
    return;
  }

  const compteb = {
    num_compte: req.body.num_compte,
    rib: req.body.rib,
    bic: req.body.bic,
    iban: req.body.iban,
    nom_banque: req.body.nom_banque,
    archive: req.body.archive,
    nom_devise: req.body.nom_devise,
    id_societe : 1
  };
  comptebancaire.findOne({
    where: {
      num_compte: req.body.num_compte,
      rib: req.body.rib,
      bic: req.body.bic,
      iban: req.body.iban,
    },
  })
  .then((comptebancaire) => {
    if (comptebancaire) {
      res.status(400).send({
        message: "Echec! les informations du compte entrées existent déjà !"
      });
      return;

    } })

  comptebancaire
    .create(compteb)
    .then((data) => {
      res.send(data);
      console.log("ajout avec succés");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "une erreur est survenue lors de la création du compte bancaire.",
      });
    });
};



exports.findOneCompte = (req, res) => {
  comptebancaire.findOne({
    where: {
      num_compte: req.params.num_compte,
    },
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving compte bancaire."
      });
    });
};
// Lister les comptes bancaires
exports.findAll = (req, res) => {
  comptebancaire
    .findAll({
      include: ["devise"],
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

// Modifier un compte bancaire
exports.update = (req, res) => {
  const num_compte = req.body.num_compte;
  comptebancaire
    .update(req.body, {
      where: { num_compte: num_compte },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le compte bancaire est mis à jour avec succés.",
        });
      } else {
        res.send({
          message: `erreur de mise à jour de du compte avec numCompte=${num_compte}. peut etre le compte est inexistant  ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur de mise à jour du compte avec numéro de compte=" + num_compte,
      });
    });
};
// Supprimer un compte bancaire
exports.delete = (req, res) => {
  const num_compte = req.params.num_compte;
  console.log('???????',num_compte);
  comptebancaire
    .destroy({
      where: { num_compte: num_compte },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "le Compte bancaire est supprimé avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression du compte bancaire avec numCompte=${num_compte}. Peut être qu'il est inexistant !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
        
      });
    });
};

