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
  const article = db.article;
  const prixArticle = db.prixArticle;
  const Op = db.Sequelize.Op;


  // Create and Save a new article
    exports.create = (req, res) => {
      // Validate request
      if (!req.body.nom_article) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
      // Create an article                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      const art = {
        nom_article: req.body.nom_article ,
        type_article: req.body.type_article ,
        cout: req.body.cout,
        description: req.body.description,
      };
      article.findOne({
        where: {
          nom_article: req.body. nom_article,
        },
      })
      .then((article) => {
        if (article) {
          res.status(400).send({
            message: "Echec! le nom de l'article existe déjà !"
          });
          return;

        } })
      
          // Save article in the database
      article
      .create(art)
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
    const nom_article = req.query.nom_article;
    var condition = nom_article
      ? { nom_article: { [Op.iLike]: `%${nom_article}%` } }
      : null;
    article
      .findAll({ where: condition,})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
        });
      });
  };

  // Lister les articles avec prix et dates
  exports.findAllArticles = (req, res) => {
    const nom_article = req.query.nom_article;
    var condition = nom_article
      ? { nom_article: { [Op.iLike]: `%${nom_article}%` } }
      : null;
      article
      .findAll({ where: condition,
      include: ["prix"] })
      .then((data) => {
       prixArt = prixArticle.findAll({
          limit: 1,
          order: [ [ 'createdAt', 'DESC' ]]
        });
        console.log(prixArt);
        data.prix = prixArt;
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message
        });
      });
  };
  
  // Update an article by the id in the request
  exports.update = (req, res) => {
    const nom_article = req.params.nom_article;
    article
      .update(req.body, {
        where: { nom_article: nom_article },
      })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "article was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update article with id=${id}. Maybe article was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating article with id=" + id,
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
  
  