module.exports = (sequelize, Sequelize) => {
    const Comptebanc = sequelize.define("comptebancaire", {
      num_compte: {
        type: Sequelize.BIGINT,
        unique : true
      },
      rib: {
        type: Sequelize.STRING,
        unique : true
      },
      bic: {
        type: Sequelize.STRING,
        unique : true
      },
      iban: {
        type: Sequelize.STRING,
        unique : true
      },
      nom_banque: {
        type: Sequelize.STRING,
      },
    });
    return Comptebanc;
  };
  