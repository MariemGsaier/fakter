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
const user = db.user;
const Op = db.Sequelize.Op;
// Create and Save a new Tutorial
exports.create = (req, res) => {};
// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {};
// Find a single Tutorial with an id
exports.findOne = (req, res) => {};
// Update a Tutorial by the id in the request
exports.update = (req, res) => {};
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {};
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};
// Find all published Tutorials
exports.findAllPublished = (req, res) => {};
