const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.createTourAndUserIds = (req, res, next) => {
  //Allow Nested Routes and Data Handling
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAllDocs(Review);

exports.getAReview = factory.getADoc(Review);

exports.createReview = factory.createADoc(Review);

exports.updateAReview = factory.updateADoc(Review);

exports.deleteAReview = factory.deleteADoc(Review);
