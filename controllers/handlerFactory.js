const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

exports.getADoc = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    //populating references/reference ids
    // const doc = await Tour.findById(id).populate({
    //   path: 'guides',
    //   select: '-__v -changedPasswordAt',
    // });

    //To handle undefined mongoDB ID
    //Example: 619281f6d87eab1c837dba77 will return null but 619281f6d87eab1c837dbb77 will return a doc
    if (!doc) return next(new AppError(`No doc found with ID:${id}`, 404));

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAllDocs = (Model) =>
  catchAsync(async (req, res, next) => {
    //Allow Nested Route GET Reviews on a Tour
    //Beware populating filter object like this is really a hack. A better approch is to create a separate middleware
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });
