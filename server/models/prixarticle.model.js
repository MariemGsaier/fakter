module.exports = (sequelize, Sequelize) => {
    const PrixArticle = sequelize.define("prixarticle", {
      prix: {
        type: Sequelize.FLOAT
      },
      cout: {
        type: Sequelize.FLOAT
      },
      date: {
        type: Sequelize.DATE
      }
    });
    return PrixArticle;
  };