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
  const facture = db.facture;
  const Op = db.Sequelize.Op;
  
// fetch all factures from the database.
exports.findAll = (req, res) => {
  const reference = req.query.reference;
  var condition = reference
    ? { reference: { [Op.iLike]: `%${reference}%` } }
    : null;
  facture
    .findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while fetching factures.",
      });
    });
};

// Update a facture by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  facture
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "facture was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update facture with id=${id}. Maybe facture was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating facture with id=" + id,
      });
    });
};