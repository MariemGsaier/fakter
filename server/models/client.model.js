module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
      type_identification:{
        type: Sequelize.ENUM,
        values: ['Numéro CIN', 'Numéro Passeport', 'Identifiant Fiscal'],
      },
      code_identification:{
        type: Sequelize.BIGINT,
        unique : true
      },
      nom: {
        type: Sequelize.STRING,
      },
      adresse: {
        type: Sequelize.STRING,
      },
      numtel: {
        type: Sequelize.BIGINT,
      },
      courriel: {
        type: Sequelize.STRING,
      },
      siteweb: {
        type: Sequelize.STRING,
      },
      archive: {
        type: Sequelize.BOOLEAN,
      }
    });
    return Client;
  };
  