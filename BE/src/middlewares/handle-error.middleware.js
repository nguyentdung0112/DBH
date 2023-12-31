const loggerErrorMiddleware = (err, req, res, next) => {
  console.log(`❌ Error is : ${err.message}`);

  next(err);
};

const errorResponseMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message),
    });
  } else if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message),
    });
  } else {
    return res.status(status).json({
      status,
      message: err.message,
    });
  }
};

module.exports = {
  loggerErrorMiddleware,
  errorResponseMiddleware,
};
