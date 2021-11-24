const redis = require('redis');
const _ = require('lodash');
const fs = require('fs');
const productsModel = require('../models/products_model');
const { success, failed } = require('../helpers/response');

const client = redis.createClient();
const redisAction = require('../helpers/redis');

const { errLogin } = require('../helpers/response');

const products = {
  getList: (req, res) => {
    try {
      const { query } = req;
      const search = query.search === undefined ? '' : query.search;
      const field = query.field === undefined ? 'id' : query.field;
      const typeSort = query.sort === undefined ? 'ASC' : query.sort;
      const limit = query.limit === undefined ? '50' : query.limit;
      const offset = query.page === undefined || query.page === 1 ? 0 : (query.page - 1) * limit;
      client.get('products', (err, resultRedis) => {
        if (!resultRedis) {
          productsModel.getList(search, field, typeSort, limit, offset).then(async (result) => {
            const allData = await productsModel.getAll();
            redisAction.set('products', JSON.stringify(allData));
            const response = {
              data: result,
              totalPage: Math.ceil(allData.length / limit),
              search,
              limit,
              page: req.query.page,
            };
            success(res, response, 200, 'Get all products success');
          });
        } else {
          const dataRes = JSON.parse(resultRedis);
          const dataSearch = search.toLowerCase()
          const dataFilter = _.filter(dataRes, (e) => (e.name_product.toLowerCase().includes(dataSearch)));
          const sort = _.sortBy(dataFilter, typeSort);
          const pagination = _.slice(sort, offset, offset + limit);
          const response = {
            data: pagination,
            totalPage: Math.ceil(dataRes.length / limit),
            search,
            limit,
            page: req.query.page,
          };
          success(res, response, 200, 'Get all Products success');
        }
      });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  getDetail: (req, res) => {
    try {
      const { id } = req.params;
      client.get('products', (err, resultRedis) => {
        if (!resultRedis) {
          productsModel
            .getDetail(id)
            .then((result) => {
              success(res, result, 200, 'Get details product success');
            })
            .catch((error) => {
              failed(res, 404, error);
            });
        } else {
          const dataRes = JSON.parse(resultRedis);
          // eslint-disable-next-line no-unused-expressions
          // eslint-disable-next-line eqeqeq
          const dataFilter = _.filter(dataRes, (e) => (e.id == id ? e : undefined));
          success(res, dataFilter, 200, 'Get details product Succes');
        }
      });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  insert: (req, res) => {
    try {
      const { body } = req;
      const image = req.file.filename;
      productsModel
        .insert(body, image)
        .then((result) => {
          client.del('products');
          success(res, result, 201, 'Insert data product success');
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
      const image = req.file.filename;
      productsModel
        .getDetail(id)
        .then((result) => {
          const img = result[0].image;
          fs.unlink(`./uploads/${img}`, (err) => {
            if (err) {
              errLogin(res, err);
            }
          });
        });
      productsModel
        .update(id, body, image)
        .then((result) => {
          client.del('products');
          success(res, result, 200, 'Update data product success');
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
      productsModel.getDetail(id)
        .then((result) => {
          const data = result[0];
          const nameImage = data.image;
          fs.unlink(`./uploads/${nameImage}`, (err) => {
            if (err) {
              errLogin(res, err);
            }
          });
        });
      productsModel
        .destroy(id)
        .then((result) => {
          client.del('products');
          success(res, result, 200, 'Delete data product success');
        })
        .catch((err) => {
          failed(res, 404, err);
        });
    } catch (err) {
      failed(res, 404, err);
    }
  },
};

module.exports = products;
