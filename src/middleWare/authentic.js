const jwt = require('jsonwebtoken');
const { failed, errLogin } = require('../helpers/response');
const { KEY_SECRET } = require('../helpers/env');

// Untuk mengecek token

const authentic = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (token === undefined) {
      errLogin(res, 'Anda Harus Login');
    } else {
      jwt.verify(token, KEY_SECRET, (err, decode) => {
        if (err) {
          errLogin(res, 'Anda Harus Login');
        } else {
          req.idUser = decode.id;
          next();
        }
      });
    }
  } catch (error) {
    failed(res, 502, error);
  }
};

module.exports = authentic;
