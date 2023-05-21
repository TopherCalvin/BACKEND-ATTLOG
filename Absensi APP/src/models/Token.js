module.exports = (sequelize, Sequelize) => {
  const token = sequelize.define(
    "Token", //nama table
    {
      token: {
        type: Sequelize.STRING,
      },
      expired: {
        type: Sequelize.DATE,
      },
      payload: {
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return token;
};
