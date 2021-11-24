const redis = require("redis");
const _ = require("lodash");
const transactionModel = require("../models/transaction_model");
const { success, failed } = require("../helpers/response");

const client = redis.createClient();
const redisAction = require("../helpers/redis");

const transaction = {
  getList: (req, res) => {
    try {
      const { id } = req.params;
      const { query } = req;
      // const search = query.search === undefined ? '' : query.search;
      const field = query.field === undefined ? "transaction.id" : query.field;
      const typeSort = query.sort === undefined ? "ASC" : query.sort;
      const limit = query.limit === undefined ? "5" : query.limit;
      const offset =
        query.page === undefined || query.page === 1
          ? 0
          : (query.page - 1) * limit;
      client.get("transaction", (err, resultRedis) => {
        if (!resultRedis) {
          transactionModel
            .getList(field, typeSort, limit, offset, id)
            .then(async (result) => {
              redisAction.set("transaction", JSON.stringify(result));
              const response = {
                data: result,
                totalPage: Math.ceil(result.length / limit),
                // search,
                limit,
                page: req.query.page,
              };
              success(res, response, 200, "Get all transaction success");
            });
        } else {
          const dataRes = JSON.parse(resultRedis);
          const filter = _.filter(dataRes, (e) => (e.user_id == id ? e : null));
          if (filter.length === 0) {
            transactionModel
              .getList(field, typeSort, limit, offset, id)
              .then(async (result) => {
                // redisAction.set('transaction', JSON.stringify(result));
                const response = {
                  data: result,
                  totalPage: Math.ceil(result.length / limit),
                  // search,
                  limit,
                  page: req.query.page,
                };
                success(res, response, 200, "Get all transaction success");
              });
          } else {
            const sort = _.sortBy(filter, typeSort);
            const pagination = _.slice(sort, offset, offset + limit);

            const response = {
              data: pagination,
              totalPage: Math.ceil(dataRes.length / limit),
              // search,
              limit,
              page: req.query.page,
            };
            success(res, response, 200, "Get all Transaction success");
          }
        }
      });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  getDetail: (req, res) => {
    try {
      const { id } = req.params;
      transactionModel
        .getDetails(id)
        .then(async (result) => {
          // const allData = await transactionModel.getAll();
          // redisAction.set('transaction', JSON.stringify(allData));
          success(res, result, 200, "Get details Transaction success");
        })
        .catch((error) => {
          failed(res, 404, error);
        });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  insert: (req, res) => {
    try {
      const { body } = req;
      transactionModel
        .insert(body)
        .then((result) => {
          client.del("transaction");
          success(res, result, 200, "Insert data Transaction success");
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
      transactionModel
        .update(id, body)
        .then((result) => {
          client.del("transaction");
          success(res, result, 200, "Update data Transaction success");
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
      transactionModel
        .destroy(id)
        .then((result) => {
          client.del("transaction");
          success(res, result, 200, "Delete data Transaction success");
        })
        .catch((err) => {
          failed(res, 404, err);
        });
    } catch (err) {
      failed(res, 404, err);
    }
  },
};

module.exports = transaction;
