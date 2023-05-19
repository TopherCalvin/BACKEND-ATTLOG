module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("Users", {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
  });
  return user;
};
