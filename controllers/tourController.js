const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');

exports.topFiveTours = async (req, _, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,price,duration,difficulty,ratingsAverage,summary';
  next();
};

exports.getAllTours = factory.getAllDocs(Tour);

exports.getATour = factory.getADoc(Tour, { path: 'reviews' });

exports.createATour = factory.createADoc(Tour);

exports.updateATour = factory.updateADoc(Tour);

exports.deleteATour = factory.deleteADoc(Tour);

// exports.deleteATour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   const tour = await Tour.findByIdAndDelete(id);

//   if (!tour) return next(new AppError(`No tour found with ID:${id}`, 404));

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: null, //----> for entire collection
        totalTours: { $sum: 1 },
        totalRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        avgDuration: { $avg: '$duration' },
        minDuration: { $min: '$duration' },
        maxDuration: { $max: '$duration' },
      },
    },
    {
      $sort: { minPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        totalTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { totalTours: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
