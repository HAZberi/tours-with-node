const express = require("express");
const router = express.Router();
const {
  getAUser,
  getAllUsers,
  createAUser,
  updateAUser,
  deleteAUser,
} = require("../controllers/userController.js");

router.route("/").get(getAllUsers).post(createAUser);

router.route("/:id").get(getAUser).patch(updateAUser).delete(deleteAUser);

module.exports = router;
