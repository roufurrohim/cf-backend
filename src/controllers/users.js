const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const _ = require("lodash");
const fs = require("fs");
const usersModel = require("../models/users_model");
const { KEY_SECRET } = require("../helpers/env");

const client = redis.createClient();
const redisAction = require("../helpers/redis");

const {
  success,
  failed,
  errLogin,
  sucLog,
} = require("../helpers/response");

const users = {
  getList: (req, res) => {
    try {
      const { query } = req;
      const search = query.search === undefined ? "" : query.search;
      const field = query.field === undefined ? "id" : query.field;
      const typeSort = query.sort === undefined ? "ASC" : query.sort;
      const limit = query.limit === undefined ? "5" : parseInt(query.limit);
      const offset =
        query.page === undefined || query.page === 1
          ? 0
          : (query.page - 1) * limit;
      client.get("users", (err, resultRedis) => {
        if (!resultRedis) {
          usersModel
            .getList(search, field, typeSort, limit, offset)
            .then(async (result) => {
              const allData = await usersModel.getAll();
              redisAction.set("users", JSON.stringify(allData));
              const response = {
                data: result,
                totalPage: Math.ceil(allData.length / limit),
                search,
                limit,
                page: req.query.page,
              };
              success(res, response, 200, "Get all users success");
            })
            .catch((error) => {
              failed(res, 404, error);
            });
        } else {
          const dataRes = JSON.parse(resultRedis);
          const dataFilter = _.filter(dataRes, (e) => e.name.includes(search));
          const pagination = _.slice(dataFilter, offset, offset + limit);
          const response = {
            data: pagination,
            totalPage: Math.ceil(dataRes.length / limit),
            search,
            limit,
            page: req.query.page,
          };
          success(res, response, 200, "Get all users success");
        }
      });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  getDetail: (req, res) => {
    try {
      const { id } = req.params;
      client.get("users", (err, resultRedis) => {
        if (!resultRedis) {
          usersModel
            .getDetail(id)
            .then((result) => {
              success(res, result, 200, "Get details user success");
            })
            .catch((error) => {
              failed(res, 404, error);
            });
        } else {
          const dataRes = JSON.parse(resultRedis);
          const dataFilter = _.filter(dataRes, (e) =>
            e.id == id ? e : undefined
          );
          success(res, dataFilter, 200, "Get details user Succes");
        }
      });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  insert: (req, res) => {
    try {
      const { body } = req;
      const hash = bcrypt.hashSync(body.password, 10);
      const image = req.file.filename;
      usersModel
        .getAll()
        .then((result) => {
          result.map((e) => {
            if (e.mail === body.mail && e.name === body.name) {
              errLogin(res, "Email or Username already in use");
            }
          });
          usersModel
            .insert(body, hash, image)
            .then((result) => {
              client.del("users");
              return success(res, result, 200, "Create data user success");
            })
            .catch((err) => {
              return failed(res, 400, err);
            });
        })
        .catch((err) => {
          failed(res, 500, err);
        });
    } catch (err) {
      failed(res, 400, err);
    }
  },
  login: (req, res) => {
    try {
      const { body } = req;
      usersModel
        .login(body)
        .then((result) => {
          if (result.length <= 0) {
            errLogin(res, "Email salah");
          } else {
            const idUser = result[0];
            const payload = {
              id: idUser.id,
              email: idUser.email,
            };
            const token = jwt.sign(payload, KEY_SECRET);
            const hash = idUser.password;
            const pwd = bcrypt.compareSync(body.password, hash);
            if (pwd === true) {
              sucLog(res, result, token, 200, "Login success");
            } else {
              errLogin(res, "Password salah");
            }
          }
        })
        .catch((err) => {
          failed(res, 400, err);
        });
    } catch (err) {
      failed(res, 400, err);
    }
  },
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const hash = bcrypt.hashSync(body.password, 10);
      const image = req.file.filename;
      usersModel.getDetail(id).then((result) => {
        const data = result.data[0];
        const nameImage = data.picture;
        fs.unlink(`./uploads/${nameImage}`, (err) => {
          if (err) {
            errLogin(res, err);
          }
        });
      });
      usersModel
        .update(id, body, hash, image)
        .then((result) => {
          client.del("users");
          success(res, result, 200, "Update data users success");
        })
        .catch((err) => {
          failed(res, 400, err);
        });
    } catch (err) {
      failed(res, 400, err);
    }
  },
  destroy: (req, res) => {
    try {
      const { id } = req.params;
      usersModel.getDetail(id).then((result) => {
        const data = result.data[0];
        const nameImage = data.picture;
        fs.unlink(`./uploads/${nameImage}`, (err) => {
          if (err) {
            errLogin(res, err);
          }
        });
      });
      usersModel
        .destroy(id)
        .then((result) => {
          client.del("users");
          success(res, result, 200, "Delete data users success");
        })
        .catch((err) => {
          failed(res, 404, err);
        });
    } catch (err) {
      failed(res, 404, err);
    }
  },
};

module.exports = users;
