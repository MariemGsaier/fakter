module.exports = (sequelize, Sequelize) => {
    const Devise = sequelize.define("devise", {
      nom: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      devise: {
        type: Sequelize.STRING,
      },
      archive: {
        type: Sequelize.BOOLEAN,
      }
    });
    return Devise;
  };
  