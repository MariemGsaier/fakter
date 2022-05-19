module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define("article", {
    reference_art: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    image: {
      type: Sequelize.STRING,
    },
    nom_article: {
      type: Sequelize.STRING,
    },
    type_article: {
      type: Sequelize.STRING,
    },
    prix_vente: {
      type: Sequelize.FLOAT,
    },
    taxe_vente: {
      type: Sequelize.BIGINT,
    },
    cout: {
      type: Sequelize.FLOAT,
    },
    description: {
      type: Sequelize.STRING,
    },
  });
  return Article;
};
