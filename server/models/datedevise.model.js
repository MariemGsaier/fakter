module.exports = (sequelize, Sequelize) => {
    const DateDevise = sequelize.define("datedevise", {
      date: {
        type: Sequelize.DATE
      },
      valeur: {
        type: Sequelize.FLOAT
      }
    });
    return DateDevise;
  };
  