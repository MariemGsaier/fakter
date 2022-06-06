module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define("article", {
    nom_article: {
      type: Sequelize.STRING
    },
    type_article: {
      type: Sequelize.ENUM,
      values: ['Service', 'Consommable'] 
    },
    prix_vente: {
      type: Sequelize.FLOAT
    },
    taxe_vente : {
      type: Sequelize.FLOAT
    },
    cout: {
      type: Sequelize.FLOAT
    },
    description: {
      type: Sequelize.STRING
    },
  });
  return Article;
};
