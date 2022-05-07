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
db.commande = require("../models/commande.model")(sequelize, Sequelize);
// add user id foreign key to all projects
db.commande.belongsTo(db.client, { foreignKey: 'id_client' });
db.client.hasMany(db.commande, { foreignKey: 'id_client' });

db.article = require("../models/article.model.js")(sequelize, Sequelize);
module.exports = db;
