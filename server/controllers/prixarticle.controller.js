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
    const prixArticle = db.prixArticle;
    const Op = db.Sequelize.Op;
  
  
    // Create and Save a new prix article
      exports.create = (req, res) => {
        // Validate request
        if (!req.body.prix) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
          return;
        }
        // Create a prix                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        const prx = {
          prix: req.body.prix ,
          date: req.body.date ,
          nom_article: req.body.nom_article,
        };
        prixArticle.findOne({
          where: {
            prix: req.body.prix,
          },
        })
        .then((prix) => {
          if (prix) {
            res.status(400).send({
              message: "Echec! le prix de l'article existe déjà !"
            });
            return;
  
          } })
        
            // Save prix article in the database
        prixArticle
        .create(prx)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message 
            });
          }); 
    };

    // Lister les articles
    exports.findAll = (req, res) => {
      const id = req.query.id;
      var condition = id
        ? { id: { [Op.iLike]: `%${id}%` } }
        : null;
        prixArticle
        .findAll({ where: condition,
        include: ["articles"] })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message
          });
        });
    };
    
    // Delete an article with the specified id in the request
    exports.delete = (req, res) => {
      const id = req.params.id;
      article
        .destroy({
          where: { id: id },
        })
        .then((num) => {
          if (num == 1) {
            res.send({
              message: "article was deleted successfully!",
            });
          } else {
            res.send({
              message: `Cannot delete article with id=${id}. Maybe article was not found!`,
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message
          });
        });
    };
    // Delete all articles from the database.
    exports.deleteAll = (req, res) => {
      article
        .destroy({
          where: {},
          truncate: false,
        })
        .then((nums) => {
          res.send({ message: `${nums} article were deleted successfully!` });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message 
          });
        });
    };
    
    