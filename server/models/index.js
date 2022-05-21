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

db.facture.belongsTo(db.comptebancaire,{
  foreignKey: "id_compte",
  as: "compte"
})

db.comptebancaire.hasMany(db.facture,{
  foreignKey: "id_compte",
  as: "factures"
})
db.facture.belongsTo(db.devise,{
  foreignKey: "nom_devise",
  as: "devise"
})
db.devise.hasMany(db.facture,{
  foreignKey: "nom_devise",
  as: "factures"

})
db.comptebancaire.belongsTo(db.devise,{
  foreignKey: "nom_devise",
  as: "devise"
})
db.devise.hasMany(db.comptebancaire,{
  foreignKey: "nom_devise",
  as: "comptes bancaires"

})

module.exports = db;
