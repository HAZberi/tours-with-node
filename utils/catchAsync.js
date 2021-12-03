//an example of function currying.
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};
