module.exports = (sequelize, Sequelize) => {
    const DateDevise = sequelize.define("datedevise", {
      date: {
        type: Sequelize.DATE,
        primaryKey: true
      },
      valeur: {
        type: Sequelize.FLOAT
      }
    });
    return DateDevise;
  };
  