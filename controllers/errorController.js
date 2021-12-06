const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //if the error is operational => Trusted Error, send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //if the error is a programming error then send a generic error to the client
    //1. Log Error to the console
    console.error('ERROR:', err);

    //2. Send a very generic message to the client
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //FIX for unexpected Error Object behavior
    //1. destructure the name of the Error directly from err object !!very important!!
    const { name } = err;
    //console.log(name);
    //2. create a deep copy of err object
    let error = { ...err };
    //3. add destructured name from step 1 to newly created error object
    error.name = name;

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    sendErrorProd(error, res);
  }
};
