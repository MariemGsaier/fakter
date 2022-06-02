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
        reference_art: req.body.reference_art,
        nom_article: req.body.nom_article ,
        type_article: req.body.type_article ,
        prix_vente: req.body.prix_vente ,
        taxe_vente: req.body.taxe_vente ,
        cout: req.body.cout,
        description: req.body.description
      };
      // Save article in the database
      article
      .create(art)
        .then(data => {
          res.send(data);
          // console.log("ajout avec succés");
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the article."
          });
        });
  };
  // fetch all articles from the database.
  exports.findAll = (req, res) => {
    const nom_article = req.query.nom_article;
    var condition = nom_article
      ? { nom_article: { [Op.iLike]: `%${nom_article}%` } }
      : null;
    article
      .findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while fetching articles.",
        });
      });
  };
  
  // Update an article by the id in the request
  exports.update = (req, res) => {
    const id = req.params.id;
    article
      .update(req.body, {
        where: { id: id },
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
          message: "Could not delete article with id=" + id,
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
            err.message || "Some error occurred while removing all articles.",
        });
      });
  };
  
  