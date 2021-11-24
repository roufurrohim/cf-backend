const response = {
  success: (res, data, code, message) => {
    const resp = {
      success: true,
      data,
      code,
      message,
    };
    res.status(200).json(resp);
  },
  sucLog: (res, data, tkn, code, message) => {
    const resp = {
      success: true,
      data: {...data[0], token:  tkn},
      code,
      message,
      // token,
    };
    res.status(200).json(resp);
  },
  errLogin: (res, message) => {
    const responsLog = {
      success: false,
      data: [],
      message,
      code: 400,
    };
    res.status(500).json(responsLog);
  },
  failed: (res, code, err) => {
    if (code === 400) {
      const respon = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Error on client side (input false)',
      };
      res.status(400).json(respon);
    } else if (code === 404) {
      const respons = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Data not found',
      };
      res.status(404).json(respons);
    } else if (code === 502) {
      const re = {
        success: false,
        data: null,
        code,
        error: err,
        message: 'Invalid response from another request',
      };
      res.status(502).json(re);
    }
  },
};

module.exports = response;
