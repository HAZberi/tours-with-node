const express = require('express');

const router = express.Router();
const {
  getAUser,
  getAllUsers,
  createAUser,
  updateAUser,
  deleteAUser,
} = require('../controllers/userController');

const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

//A separate route for signing up new user - does not follow REST protocol.
router.route('/signup').post(signUp);

//A separate route for logging in user - does not follow REST protocol.
router.route('/login').post(logIn);

//A separate route for forgotpassword - does not follow REST protocol.
router.route('/forgot-password').post(forgotPassword);

//A separate route for resetting password - does not follow REST protocol.
router.route('/reset-password/:token').patch(resetPassword);

router.route('/').get(getAllUsers).post(createAUser);

router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

module.exports = router;
