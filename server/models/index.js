const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.client = require("../models/client.model.js")(sequelize, Sequelize);
db.comptebancaire = require("../models/comptebancaire.model.js")(sequelize, Sequelize);
db.societe = require("../models/societe.model.js")(sequelize, Sequelize);
db.article = require("../models/article.model.js")(sequelize, Sequelize);
db.facture = require("../models/facture.model")(sequelize, Sequelize);
db.devise = require("../models/devise.model")(sequelize, Sequelize);
db.dateDevise = require("../models/datedevise.model")(sequelize, Sequelize);

db.comptebancaire.belongsTo(db.societe, {
  foreignKey: "num_compte",
  as: "societe"
});
db.societe.hasMany(db.comptebancaire, {
  as: "comptes"
});

db.facture.belongsTo(db.user, {
  foreignKey: "reference",
  as: "facture"
});
db.user.hasMany(db.facture, {
  as: "user"
});

db.facture.belongsToMany(db.article, {
  through: "ligne_facture",
  as: "article",
  foreignKey: "reference",
});
db.article.belongsToMany(db.facture, {
  through: "ligne_facture",
  as: "facture",
  foreignKey: "reference_art",
});

module.exports = db;
