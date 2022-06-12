module.exports = (sequelize, Sequelize) => {
    const Comptebanc = sequelize.define("comptebancaire", {
      num_compte: {
        type: Sequelize.BIGINT,
        primaryKey : true
      },
      rib: {
        type: Sequelize.BIGINT,
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
      archive: {
        type: Sequelize.BOOLEAN,
      }
    });
    return Comptebanc;
  };
  