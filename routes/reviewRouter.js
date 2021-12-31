const express = require('express');

const router = express.Router({
  //To Allow Nested Routes with Separation of Concerns
  mergeParams: true,
});

const {
  getAllReviews,
  createReview,
  deleteAReview,
  updateAReview,
  createTourAndUserIds,
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createTourAndUserIds, createReview);

router.route('/:id').patch(updateAReview).delete(deleteAReview);

module.exports = router;
