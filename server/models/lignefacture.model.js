module.exports = (sequelize, Sequelize) => {
    const LigneFacture = sequelize.define("lignefacture", {
      id : {
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true,
      },
      quantite: {
        type: Sequelize.INTEGER,
      }
    });
    return LigneFacture;
  };
  