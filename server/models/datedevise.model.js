module.exports = (sequelize, Sequelize) => {
    const DateDevise = sequelize.define("Datedevise", {
      date: {
        type: Sequelize.DATE,
      }
    });
    return DateDevise;
  };
  