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
db.taxe = require("../models/taxe.model")(sequelize, Sequelize);

db.article.belongsTo(db.client,{
  foreignKey: "id_taxe",
  as: "taxe"
})
db.taxe.hasMany(db.article,{
  foreignKey: "id_taxe",
  as: "article"
})

db.facture.belongsTo(db.client,{
  foreignKey: "id_client",
  as: "client"
})
db.client.hasMany(db.facture,{
  foreignKey: "id_client",
  as: "factures"
})

db.comptebancaire.belongsTo(db.societe, {
  foreignKey: "id_societe",
  as: "societe"
});
db.societe.hasMany(db.comptebancaire, {
  foreignKey: "id_societe",
  as: "comptes"
});

db.facture.belongsTo(db.user, {
  foreignKey: "id_user",
  as: "user"
});
db.user.hasMany(db.facture, {
  foreignKey: "id_user",
  as: "factures"
});

db.facture.belongsToMany(db.article, {
  through: "ligne_facture",
  as: "article",
  foreignKey: "reference",
});
db.article.belongsToMany(db.facture, {
  through: "ligne_facture",
  as: "facture",
  foreignKey: "id",
});


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

db.dateDevise.belongsTo(db.devise, {
  foreignKey: "nom_devise",
  as: "devises",
});

db.devise.hasMany(db.dateDevise, {
  foreignKey: "nom_devise",
  as: "dates",

});


module.exports = db;
