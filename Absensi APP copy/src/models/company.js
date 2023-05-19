module.exports = (sequelize, Sequelize) => {
  const company = sequelize.define("Companies", {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
  });
  return company;
};
