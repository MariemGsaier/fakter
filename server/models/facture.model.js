module.exports = (sequelize, Sequelize) => {
  const Facture = sequelize.define("facture", {
    reference: {
      type: Sequelize.STRING,
    },
    créé_par: {
      type: Sequelize.STRING,
    },
    date_facturation: {
      type: Sequelize.DATE,
    },
    date_echeance: {
      type: Sequelize.DATE,
    },
    etat_facture: {
      type: Sequelize.STRING,
    },
    etat_echeance: {
      type: Sequelize.BOOLEAN,
    },
    total_ht: {
      type: Sequelize.FLOAT,
    },
    total_ttc: {
      type: Sequelize.FLOAT,
    },
    total_devise: {
      type: Sequelize.FLOAT,
    }
  });
  return Facture;
};
