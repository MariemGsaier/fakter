module.exports = (sequelize, Sequelize) => {
    const Comptebanc = sequelize.define("comptebancaire", {
      num_compte: {
        type: Sequelize.BIGINT,
        unique : true
      },
      rib: {
        type: Sequelize.STRING,
      },
      bic: {
        type: Sequelize.STRING,
      },
      iban: {
        type: Sequelize.STRING,
      },
      nom_banque: {
        type: Sequelize.STRING,
      },
    });
    return Comptebanc;
  };
  