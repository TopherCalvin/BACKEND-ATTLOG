const db = require("../models");

const compController = {
  getAll: async (req, res) => {
    try {
      const company = await db.Company.findAll();
      return res.send(company);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertInto: async (req, res) => {
    try {
      const { name, address } = req.body;
      await db.Company.create({
        name,
        address,
      });
      return await db.Company.findAll().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = compController;
