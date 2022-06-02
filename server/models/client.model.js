module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
      code_identification:{
        type: Sequelize.STRING,
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
      }
    });
    return Client;
  };
  