const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const user = require("../models/user");

const attlogController = {
  getAll: async (req, res) => {
    try {
      const { user_id } = req.query;
      await db.Attendancelog.findAll({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              deletedAt: null,
            },
          ],
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getToday: async (req, res) => {
    try {
      const { user_id } = req.query;
      const attLog = await db.Attendancelog.findOne({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              [Op.and]: [
                {
                  createdAt: {
                    [Op.gt]: moment("00:00:00", "hh:mm:ss").format(),
                  },
                },
                {
                  createdAt: {
                    [Op.lt]: moment("00:00:00", "hh:mm:ss")
                      .add(1, "days")
                      .format(),
                  },
                },
              ],
            },
            {
              deletedAt: null,
            },
          ],
        },
      });
      console.log(attLog);
      res.send(attLog);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertAttlog: async (req, res) => {
    try {
      const { user_id } = req.query;
      const attLog = await db.Attendancelog.findOne({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              [Op.and]: [
                {
                  createdAt: {
                    [Op.gt]: moment("00:00:00", "hh:mm:ss").format(),
                  },
                },
                {
                  createdAt: {
                    [Op.lt]: moment("00:00:00", "hh:mm:ss")
                      .add(1, "days")
                      .format(),
                  },
                },
              ],
            },
          ],
        },
      });
      if (!attLog) {
        await db.Attendancelog.create({
          clock_in: moment().format(),
          user_id: user_id,
        }).then((result) => res.send(result));
      } else {
        res.send("clock in sudah ada");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  editAttlog: async (req, res) => {
    try {
      const { user_id } = req.query;
      const attLog = await db.Attendancelog.findOne({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              [Op.and]: [
                {
                  createdAt: {
                    [Op.gt]: moment("00:00:00", "hh:mm:ss").format(),
                  },
                },
                {
                  createdAt: {
                    [Op.lt]: moment("00:00:00", "hh:mm:ss")
                      .add(1, "days")
                      .format(),
                  },
                },
              ],
            },
          ],
        },
      });
      console.log(attLog);
      if (attLog) {
        if (!attLog.dataValues.clock_out) {
          await db.Attendancelog.update(
            {
              clock_out: moment().format(),
            },
            {
              where: {
                id: attLog.id,
              },
            }
          );
          await db.Attendancelog.findOne({
            where: {
              id: attLog.id,
            },
          }).then((result) => res.send(result));
        } else {
          res.send("you have already clock out stupid!");
        }
      } else {
        res.send("clock in aja belum tolol!");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  deleteAttlog: async (req, res) => {
    try {
      const { id } = req.params;
      await db.Attendancelog.destroy({
        where: {
          id: id,
        },
      }).then((result) => res.send(result));
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = attlogController;
