const db = require("../models");
const Client = db.client;
const Op = db.Sequelize.Op;
// Créer et enregistrer un client
exports.create = (req, res) => {
  if (!req.body.code_identification) {
    res.status(400).send({
      message: "contenu vide !",
    });
    return;
  }

  const clt = {
    type_identification: req.body.type_identification,
    code_identification: req.body.code_identification,
    nom: req.body.nom,
    adresse: req.body.adresse,
    numtel: req.body.numtel,
    courriel: req.body.courriel,
    siteweb: req.body.siteweb,
    archive: req.body.archive,
  };
  Client.findOne({
    where: {
      code_identification: req.body.code_identification,
    },
  }).then((client) => {
    if (client) {
      res.status(400).send({
        message: "Echec! le code d'identification entré existe déjà !",
      });
      return;
    } else {
      Client.create(clt)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    }
  });
};


// lister un seul client 
exports.findOneClient = (req, res) => {
  const id = req.params.id;
  Client.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find client with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
// Lister les clients
exports.findAll = (req, res) => {
  //The req.query property is an object containing the property for each query string parameter in the route.
  const code_identification = req.query.code_identification;
  var condition = code_identification
    ? { code_identification: { [Op.iLike]: `%${code_identification}%` } }
    : null;
  Client.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "une erreur est survenue lors de l'affichage de la liste des clients.",
      });
    });
};



// Modifier un client
exports.update = (req, res) => {
  //The req.query property is an object containing the property for each query string parameter in the route.
  const id = req.params.id;
  Client.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le client est mis à jour avec succés.",
        });
      } else {
        res.send({
          message: `erreur de mise à jour du client avec id=${id}. peut être le client est inexistant  ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur  de mise à jour du client  avec id=" + id,
      });
    });
};
// Supprimer un client avec l'id spécifié dans la requête
exports.delete = (req, res) => {
  const id = req.params.id;
  Client.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le client est supprimé avec succés!",
        });
      } else {
        res.send({
          message: `Echec de suppression du client  avec id=${id}. Peut être qu'il est inexistant !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "échec de suppression du client avec id=" + id,
      });
    });
};
