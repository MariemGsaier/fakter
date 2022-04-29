module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
      nom_client: {
        type: Sequelize.STRING,
      },
      adresse_client: {
        type: Sequelize.STRING,
      },
      numtel_client: {
        type: Sequelize.BIGINT,
      },
      courriel_client: {
        type: Sequelize.STRING,
      },
      siteweb_client: {
        type: Sequelize.STRING,
      },
      numcomptebancaire_client: {
        type: Sequelize.BIGINT,
      },
      dureepaiement_client: {
        type: Sequelize.BIGINT,
      },
    });
    return Client;
  };
  