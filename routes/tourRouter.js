const express = require('express');

const router = express.Router();
const {
  getATour,
  getAllTours,
  topFiveTours,
  updateATour,
  deleteATour,
  createATour,
} = require('../controllers/tourController');

//router.param('id', checkId);

router.route('/top-5-tours').get(topFiveTours, getAllTours);

router.route('/').get(getAllTours).post(createATour);

router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour);

module.exports = router;
