//an example of function currying.
//This function catches error and then the error is handled through globalErrorhandler middleware.
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};
