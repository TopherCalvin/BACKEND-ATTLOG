const db = require("../models");
const { Op } = require("sequelize");

const userController = {
  insertUser: async (req, res) => {
    try {
      const { name, address, email, password, company_id } = req.body;
      await db.User.create({
        name,
        address,
        email,
        password,
        company_id,
      });
      return await db.User.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const { emna, password } = req.query;
      return await db.User.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  name: emna,
                },
                {
                  email: emna,
                },
              ],
            },
            {
              password: password,
            },
          ],
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = userController;
