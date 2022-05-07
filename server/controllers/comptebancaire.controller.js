exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content."); // try to modify it to console.log()
  };
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  const db = require("../models");
  const comptebancaire = db.comptebancaire;
  const Op = db.Sequelize.Op;
  // Create 
    exports.create = (req, res) => {
      // Validate request
      if (!req.body.num_compte) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
      
      const compteb = {
        num_compte: req.body.num_compte,
        rib: req.body.rib,
        tit_compte: req.body.tit_compte ,
        bic: req.body.bic ,
        iban: req.body.iban ,
        devise: req.body.devise ,
        nom_banque: req.body.nom_banque
      };
      // Save 
      comptebancaire
      .create(compteb)
        .then(data => {
          res.send(data);
          console.log("ajout avec succés");
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "une erreur est survenue lors de la création du compte bancaire."
          });
        });
  };
  // fetch 
  exports.findAll = (req, res) => {
    const num_compte = req.query.num_compte;
    var condition = num_compte
      ? { num_compte: { [Op.iLike]: `%${num_compte}%` } }
      : null;
      comptebancaire
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
  
  // Update 
  exports.update = (req, res) => {
    const id = req.params.id;
    comptebancaire
      .update(req.body, {
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Compte bancaire mis à jour avec succés.",
          });
        } else {
          res.send({
            message: `erreur de mise à jour de du compte d' id=${id}. peut etre le compte n'existe pas ou le corps de la requête est vide!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Erreur de mise à jour du compte d' id=" + id,
        });
      });
  };
  // Delete 
  exports.delete = (req, res) => {
    const id = req.params.id;
    comptebancaire
      .destroy({
        where: { id: id },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "le Compte bancaire est supprimé avec succés!",
          });
        } else {
          res.send({
            message: `Cannot delete client with id=${id}. Maybe client was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete client with id=" + id,
        });
      });
  };
  // Delete all 
  exports.deleteAll = (req, res) => {
    comptebancaire
      .destroy({
        where: {},
        truncate: false,
      })
      .then((nums) => {
        res.send({ message: `${nums} clients were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all clients.",
        });
      });
  };
  
  