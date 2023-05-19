const db = require("../models");
const { Op } = require("sequelize");

const attlogController = {
  getAll: async (req, res) => {
    try {
      const { user_id, deleted } = req.query;
      const attendancelog = await db.Attendancelog.findAll({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              deleted: deleted,
            },
          ],
        },
      });
      return res.send(attendancelog);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getToday: async (req, res) => {
    try {
      const { user_id, createdAt } = req.query;
      return await db.Attendancelog.findOne({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              createdAt: createdAt,
            },
          ],
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
  insertAttlog: async (req, res) => {
    // kasih proteksi supaya tidak bisa post lagi jika clockin != Null
    try {
      const { createdAt } = req.query;
      const { clock_in, user_id } = req.body;
      await db.attendancelog.create({
        clock_in,
        user_id,
      });
      return await db.Attendancelog.findOne({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              createdAt: createdAt,
            },
          ],
        },
      }).then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  editAttlog: async (req, res) => {
    //kasih protecsi jika clock out != null
    try {
      const { user_id, createdAt } = req.query;
      const { clock_out } = req.body;
      await db.Attendancelog,
        update(
          {
            clock_out,
          },
          {
            where: {
              [Op.and]: [
                {
                  user_id: user_id,
                },
                {
                  createdAt: createdAt,
                },
              ],
            },
          }
        );

      return db.Attendancelog.findOne({
        where: {
          [Op.and]: [
            {
              user_id: user_id,
            },
            {
              createdAt: createdAt,
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
  deleteAttlog: async (req, res) => {
    try {
      const { user_id, createdAt } = req.query;
      const { deleted } = req.body;
      await db.Attendancelog.update(
        {
          deleted,
        },
        {
          where: {
            [Op.and]: [
              {
                user_id: user_id,
              },
              {
                createdAt: createdAt,
              },
            ],
          },
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = attlogController;
