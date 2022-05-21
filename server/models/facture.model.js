module.exports = (sequelize, Sequelize) => {
  const Facture = sequelize.define("facture", {
    reference: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    vendeur: {
      type: Sequelize.STRING,
    },
    date_facturation: {
      type: Sequelize.DATE,
    },
    date_echeance: {
      type: Sequelize.DATE,
    },
    etat_facture: {
      type: Sequelize.BOOLEAN,
    },
    etat_echeance: {
      type: Sequelize.BOOLEAN,
    },
    total_ht: {
      type: Sequelize.FLOAT,
    },
    total_chiffres: {
      type: Sequelize.FLOAT,
    },
    total_lettres: {
      type: Sequelize.STRING,
    },
    total_devise: {
      type: Sequelize.FLOAT,
    }
  });
  return Facture;
};
