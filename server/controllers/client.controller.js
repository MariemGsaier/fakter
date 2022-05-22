const db = require("../models");
const client = db.client;
const Op = db.Sequelize.Op;
// Créer et enregistrer un client
  exports.create = (req, res) => {
    if (!req.body.code_identification) {
      res.status(400).send({
        message: "contenu vide !"
      });
      return;
    }
    const clt = {
      code_identification: req.body.code_identification,
      nom: req.body.nom,
      adresse: req.body.adresse,
      numtel: req.body.numtel,
      courriel: req.body.courriel ,
      siteweb: req.body.siteweb 
   };

    client
    .create(clt)
      .then(data => {
        res.send(data);
        console.log("ajout avec succés");
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "une erreur est survenue lors de la création du client."
        });
      });
};
// Lister les clients
exports.findAll = (req, res) => {
  const  code_identification = req.query. code_identification;
  var condition =  code_identification
    ? {  code_identification: { [Op.iLike]: `%${ code_identification}%` } }
    : null;
  client
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

// Modifier un client
exports.update = (req, res) => {
  const code_identification  = req.params.code_identification ;
 
  client
    .update(req.body, {
      where: { code_identification : code_identification  },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le client est mis à jour avec succés." 
        });
      } else {
        res.send({
          message: `erreur de mise à jour du client avec codeid=${code_identification }. peut etre le client est inexistant  ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating client with id=" + code_identification ,
      });
    });
};
// Delete a client with the specified id in the request
exports.delete = (req, res) => {
  const code_identification = req.params.code_identification ;
  client
    .destroy({
      where: { code_identification : code_identification  },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le client est supprimé avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression du client  avec codeid=${code_identification }. Peut être qu'il est inexistant !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Echec de suppression du client avec codeid=" + code_identification ,
      });
    });
};
// Delete all clients from the database.
exports.deleteAll = (req, res) => {
  client
    .destroy({
      where: {},
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} Tous les clients sont supprimés avec succés !` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Une erreur est survenue lors de la suppression des clients.",
      });
    });
};

