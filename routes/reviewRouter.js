const express = require('express');

const router = express.Router({
  //To Allow Nested Routes with Separation of Concerns
  mergeParams: true,
});

const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
