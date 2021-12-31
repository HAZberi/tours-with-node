const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteADoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndDelete(id);

    if (!doc) return next(new AppError(`No document found with ID:${id}`, 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
