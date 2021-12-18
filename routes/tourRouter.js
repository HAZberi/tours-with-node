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
} = require('../controllers/tourController');

const { protect, restrictTo } = require('../controllers/authController');

//router.param('id', checkId);

router.route('/top-5-tours').get(topFiveTours, getAllTours);

//Aggregation Pipeline
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(monthlyPlan);

router.route('/').get(protect, getAllTours).post(createATour);

router
  .route('/:id')
  .get(getATour)
  .patch(updateATour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

module.exports = router;
