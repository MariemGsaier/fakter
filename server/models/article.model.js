module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define("article", {
    nom_article: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    type_article: {
      type: Sequelize.ENUM,
      values: ['Service', 'Consommable'] 
    },
    description: {
      type: Sequelize.STRING
    },
    archive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Article;
};
