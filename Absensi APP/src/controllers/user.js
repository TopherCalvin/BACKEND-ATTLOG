const db = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../lib/mailer");
const sharp = require("sharp");
const private_key = process.env.private_key;
const url = process.env.url;
const url_image = process.env.URL_IMAGE;

const userController = {
  insertUser: async (req, res) => {
    try {
      const { name, address, email, password, company_id } = req.body;
      // const salt = bcrypt.gemSalt(10);

      const hashPassword = await bcrypt.hash(password, 10);

      await db.User.create({
        name,
        address,
        email,
        password: hashPassword,
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
      const user = await db.User.findOne({
        where: {
          [Op.or]: [
            {
              name: emna,
            },
            {
              email: emna,
            },
          ],
        },
      });
      if (user) {
        const match = await bcrypt.compare(password, user.dataValues.password);
        if (match) {
          const payload = {
            id: user.dataValues.id,
          };
          const token = jwt.sign(payload, private_key, {
            expiresIn: "1d",
          });
          return res.send({
            message: "login berhasil",
            value: user,
            token: token,
          });
        } else {
          throw new Error("login gagal password salah");
        }
      } else {
        return res.send({
          message: "login gagal email/username belum terdaftar",
        });
      }
    } catch (err) {
      console.log(err);
      return res.send({
        message: err.message,
      });
    }
  },
  getUser2: async (req, res) => {
    try {
      const { emna, password } = req.query;
      const user = await db.User.findOne({
        where: {
          [Op.or]: [
            {
              name: emna,
            },
            {
              email: emna,
            },
          ],
        },
      });
      if (user) {
        const match = await bcrypt.compare(password, user.dataValues.password);
        if (match) {
          const payload = {
            id: user.dataValues.id,
          };
          const token = await db.Token.create({
            expired: moment().add(1, "days").format(),
            token: nanoid(),
            payload: JSON.stringify(payload),
            valid: true,
          });
          return res.send({
            message: "login berhasil",
            value: user,
            token: token.dataValues.token,
          });
        } else {
          throw new Error("login gagal");
        }
      } else {
        return res.send({
          message: "login gagal",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  getByToken: async (req, res) => {
    try {
      const { token } = req.query;
      let user = jwt.verify(token, private_key);
      user = await db.User.findOne({
        where: {
          id: user.id,
        },
      });
      delete user.dataValues.password;
      res.send(user);
    } catch (error) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  getByToken2: async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      let p = await db.Token.findOne({
        where: {
          [Op.and]: [
            {
              token,
            },
            {
              expired: {
                [Op.gt]: moment("00:00:00", "hh:mm:ss").format(),
                [Op.lte]: moment().add(1, "d").format(),
              },
            },
          ],
        },
      });
      if (!p) {
        throw new Error("token has expired");
      }
      user = await db.User.findOne({
        where: {
          id: JSON.parse(p?.dataValues?.payload).id,
        },
      });
      delete user.dataValues.password;
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  getUserByToken: async (req, res) => {
    try {
      res.send(req.user);
    } catch (error) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  forgetPass: async (req, res) => {
    try {
      const { emna } = req.query;
      const user = await db.User.findOne({
        where: {
          email: emna,
        },
      });
      if (user.dataValues) {
        await db.Token.update(
          {
            valid: false,
          },
          {
            where: {
              payload: JSON.stringify({ id: user.dataValues.id }),
              status: "FORGOT-PASSWORD",
            },
          }
        );
        const payload = {
          id: user.dataValues.id,
        };
        const generateToken = nanoid();
        const token = await db.Token.create({
          expired: moment().add(1, "d").format(),
          token: generateToken,
          payload: JSON.stringify(payload),
          status: "FORGOT-PASSWORD",
        });

        await mailer({
          subject: "hello",
          to: "", //email untuk forget password
          text: url + generateToken,
        });

        return res.send({
          message: "silahkan check email anda",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  changePass: async (req, res) => {
    try {
      const { token } = req.query;
      const { password } = req.body;
      const { id } = req.user;
      const hashPassword = await bcrypt.hash(password, 10);
      await db.User.update(
        {
          password: hashPassword,
        },
        {
          where: {
            id,
          },
        }
      );
      await db.Token.update(
        {
          valid: false,
        },
        {
          where: {
            token,
          },
        }
      );
      await db.User.findOne({
        where: {
          id,
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
  uploadAvatar: async (req, res) => {
    try {
      const { filename } = req.file;
      await db.User.update(
        {
          avatar_url: url_image + filename,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      await db.User.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => res.send(result));
    } catch (error) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  uploadAvatar2: async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize(250, 250)
        .png()
        .toBuffer();

      var fulUrl =
        req.protocol +
        "://" +
        req.get("host") +
        "/Users/image/render/" +
        req.params.id;

      await db.User.update(
        {
          avatar_url: fulUrl,
          // avatar_url: url + "Users/image/render" + req.params.id,
          avatar_blob: buffer,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      res.send("berhasil upload");
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  renderAvatar: async (req, res) => {
    try {
      await db.User.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        console.log(result.data);
        res.set("Content-type", "image/png");
        res.send(result.dataValues.avatar_blob);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = userController;
