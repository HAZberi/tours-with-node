const express = require('express');

const router = express.Router();
const {
  getATour,
  getAllTours,
  topFiveTours,
  getTourStats,
  updateATour,
  deleteATour,
  createATour,
  monthlyPlan,
  toursWithin,
} = require('../controllers/tourController');

const { protect, restrictTo } = require('../controllers/authController');

//For Simple Nested Routing
// const { createReview } = require('../controllers/reviewController');

const reviewRouter = require('./reviewRouter');

//router.param('id', checkId);

router.route('/top-5-tours').get(topFiveTours, getAllTours);

//Aggregation Pipeline
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), monthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createATour);

router
  .route('/:id')
  .get(getATour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateATour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

//For GeoSpatial Queries
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursWithin);

// Simple nested routing implememtation
// router.route('/:tourId/review').post(protect, restrictTo('user'), createReview);

// Nested Routing Advanced Implementation
router.use('/:tourId/review', reviewRouter);

module.exports = router;
