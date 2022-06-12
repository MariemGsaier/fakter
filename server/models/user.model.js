module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    role: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    etat_user: {
      type: Sequelize.BOOLEAN,
    }
  });
  return User;
};
