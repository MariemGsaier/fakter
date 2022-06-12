module.exports = (sequelize, Sequelize) => {
  const Facture = sequelize.define("facture", {
    reference: {
      type: Sequelize.STRING,
      unique : true
    },
    num_boncommande :{
      type: Sequelize.STRING,
      unique : true
    },
    date_facturation: {
      type: Sequelize.DATE,
    },
    date_echeance: {
      type: Sequelize.DATE,
    },
    date_paiement : {
      type : Sequelize.DATE
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
    total_ttc: {
      type: Sequelize.FLOAT,
    },
    total_devise: {
      type: Sequelize.FLOAT,
    },
    archive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Facture;
};
