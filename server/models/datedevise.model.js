module.exports = (sequelize, Sequelize) => {
    const DateDevise = sequelize.define("datedevise", {
      date: {
        type: Sequelize.DATE,
        primaryKey: true
        
      }
    });
    return DateDevise;
  };
  