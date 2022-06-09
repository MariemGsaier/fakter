module.exports = (sequelize, Sequelize) => {
    const Comptebanc = sequelize.define("comptebancaire", {
      num_compte: {
        type: Sequelize.BIGINT,
        primaryKey : true
      },
      rib: {
        type: Sequelize.STRING,
        unique : true
      },
      bic: {
        type: Sequelize.STRING,
        unique : true916a1ecf8
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
  