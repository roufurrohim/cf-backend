const sizeModel = require('../models/size_model');
const { success, failed } = require('../helpers/response');

const size = {
  getList: (req, res) => {
    try {
      const { query } = req;
      const search = query.search === undefined ? '' : query.search;
      const field = query.field === undefined ? 'id' : query.field;
      const typeSort = query.sort === undefined ? 'ASC' : query.sort;
      const limit = query.limit === undefined ? '5' : query.limit;
      const offset = query.page === undefined || query.page === 1 ? 0 : (query.page - 1) * limit;
      sizeModel.getList(search, field, typeSort, limit, offset).then(async (result) => {
        const allData = await sizeModel.getAll();
        const response = {
          data: result,
          totalPage: Math.ceil(allData.length / limit),
          search,
          limit,
          page: req.query.page,
        };
        success(res, response, 200, 'Get all products success');
      });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  getDetail: (req, res) => {
    try {
      const { id } = req.params;
      sizeModel
        .getDetail(id)
        .then((result) => {
          success(res, result, 200, 'Get details product success');
        })
        .catch((err) => {
          failed(res, 404, err);
        });
    } catch (err) {
      failed(res, 404, err);
    }
  },
  insert: (req, res) => {
    try {
      const { body } = req;
      sizeModel
        .insert(body)
        .then((result) => {
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
      sizeModel
        .update(id, body)
        .then((result) => {
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
      sizeModel
        .destroy(id)
        .then((result) => {
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

module.exports = size;
