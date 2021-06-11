const express = require("express");
const router = express.Router();
const {
  getATour,
  getAllTours,
  updateATour,
  deleteATour,
  createATour,
} = require("../controllers/tourController.js");

router.route("/").get(getAllTours).post(createATour);

router.route("/:id").get(getATour).patch(updateATour).delete(deleteATour);

module.exports = router;
