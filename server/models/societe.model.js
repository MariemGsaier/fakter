module.exports = (sequelize, Sequelize) => {
    const Societe = sequelize.define("societe", {
      nom_societe: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      numtel: {
        type: Sequelize.BIGINT,
      },
      adresse: {
        type: Sequelize.STRING,
      },
      courriel: {
        type: Sequelize.STRING,
      },
      siteweb: {
        type: Sequelize.STRING,
      },
      type_societe: {
        type: Sequelize.STRING,
      },
      num_rcs: {
        type: Sequelize.STRING,
      },
      timbre_fiscale: {
          type: Sequelize.BIGINT,
        },
    });
    return Societe;
  };
  