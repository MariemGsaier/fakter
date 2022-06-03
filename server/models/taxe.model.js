module.exports = (sequelize, Sequelize) => {
    const Taxe = sequelize.define("taxe", {
      taxe: {
        type: Sequelize.FLOAT,
        defaultValue: 0.13,
        primaryKey: true
      }
    });
    return Taxe;
  };