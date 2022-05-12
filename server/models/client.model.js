module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
      code_identifcation:{
        type: Sequelize.STRING,
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
      créé_par: {
        type: Sequelize.STRING,
      }
    });
    return Client;
  };
  