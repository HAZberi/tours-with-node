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

exports.updateADoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError(`No doc found with ID:${id}`, 404));

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createADoc = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        doc: newDoc,
      },
    });
  });
