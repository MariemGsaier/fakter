module.exports = (sequelize, Sequelize) => {
    const Comptebanc = sequelize.define("comptebancaire", {
      num_compte: {
        type: Sequelize.BIGINT,
      },
      rib: {
        type: Sequelize.BIGINT,
      },
      tit_compte: {
        type: Sequelize.STRING,
      },
      bic: {
        type: Sequelize.STRING,
      },
      iban: {
        type: Sequelize.BIGINT,
      },
      devise: {
        type: Sequelize.STRING,
      },
      nom_banque: {
        type: Sequelize.STRING,
      },
    });
    return Comptebanc;
  };
  