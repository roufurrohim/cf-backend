const { failed, errLogin } = require('../helpers/response');
const usersModel = require('../models/users_model');

const authorization = {
  isAdmin: (req, res, next) => {
    const id = req.idUser;
    usersModel
      .getDetail(id)
      .then((result) => {
        const { level } = result.data[0];
        if (level == 1) {
          errLogin(res, 'Anda Bukan Admin');
        } else {
          next();
        }
      })
      .catch((error) => {
        failed(res, 404, error);
      });
  },
  isUser: (req, res, next) => {
    const id = req.idUser;
    usersModel
      .getDetail(id)
      .then((result) => {
        const { level } = result.data[0];
        if (level == 1) {
          next();
        } else {
          errLogin(res, 'Anda Bukan User');
        }
      })
      .catch((error) => {
        failed(res, 404, error);
      });
  },
};

module.exports = authorization;
