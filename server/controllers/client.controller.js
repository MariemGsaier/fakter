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
   client.findOne({
    where: {
      code_identification: req.body.code_identification,
    },
  })
  .then((client) => {
    if (client) {
      res.status(400).send({
        message: "Echec! le code d'identification entré existe déjà !"
      });
      return;

    } else{
      client
      .create(clt)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message 
          });
        });

    }
   })


};
// Lister les clients
exports.findAll = (req, res) => {
  //The req.query property is an object containing the property for each query string parameter in the route.
  const  code_identification = req.query.code_identification;
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
        message: err.message
      });
    });
};

// Modifier un client
exports.update = (req, res) => {
  //The req.query property is an object containing the property for each query string parameter in the route.
  const id = req.params.id;
  client
    .update(req.body, {
      where: {id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le client est mis à jour avec succés." 
        });
      } else {
        res.send({
          message: `erreur de mise à jour du client avec id=${id }. peut être le client est inexistant  ou le corps de la requête est vide!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Erreur  de mise à jour du client  avec id=" + id ,
      });
    });
};
// Delete a client with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  client
    .destroy({
      where: { id: id  },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Le client est supprimé avec succés!",
        });
      } else {
        res.send({
          message: `échec de suppression du client  avec id=${id }. Peut être qu'il est inexistant !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "échec de suppression du client avec id=" + id ,
      });
    });
};
// Delete all clients from the database.
exports.deleteAll = (req, res) => {

  client
    .destroy({
      where: {},
      // truncate is set to true to ignore the where option
      truncate: false,
    })
    .then((nums) => {
      res.send({ message: `${nums} Tous les clients sont supprimés avec succés !` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message 
      });
    });
};

