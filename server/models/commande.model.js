module.exports = (sequelize, Sequelize) => {
    const Commande = sequelize.define("commande", {
      date_cmd: {
        type: Sequelize.DATE,
      }
    });
    return Commande;
  };
  