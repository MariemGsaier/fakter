module.exports = (sequelize, Sequelize) => {
    const LigneFacture = sequelize.define("lignefacture", {
      quantite: {
        type: Sequelize.INTEGER,
      }
    });
    return LigneFacture;
  };
  