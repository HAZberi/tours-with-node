const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //Allow Nested Route Data Handling
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createTourAndUserIds = (req, res, next) => {
  //Allow Nested Routes and Data Handling
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAReview = factory.getADoc(Review);

exports.createReview = factory.createADoc(Review);

exports.updateAReview = factory.updateADoc(Review);

exports.deleteAReview = factory.deleteADoc(Review);
