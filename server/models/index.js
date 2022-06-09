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
db.prixArticle = require("../models/prixarticle.model")(sequelize, Sequelize);
db.lignefacture = require("../models/lignefacture.model")(sequelize, Sequelize);

db.prixArticle.belongsTo(db.article,{
  foreignKey: "nom_article",
  as: "articles"
})
db.article.hasMany(db.prixArticle,{
  foreignKey: "nom_article",
  as: "prix"
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
  through: db.lignefacture,
  as: "article",
  foreignKey: "id_facture",
});
db.article.belongsToMany(db.facture, {
  through: db.lignefacture,
  as: "facture",
  foreignKey: "nom_article",
});


db.facture.belongsTo(db.comptebancaire,{
  foreignKey: "num_compte",
  as: "compte"
})

db.comptebancaire.hasMany(db.facture,{
  foreignKey: "num_compte",
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
