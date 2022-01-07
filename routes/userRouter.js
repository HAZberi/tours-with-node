const express = require('express');

const router = express.Router();
const {
  getAUser,
  getAllUsers,
  createAUser,
  updateAUser,
  deleteAUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const {
  signUp,
  logIn,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

//A separate route for signing up new user - does not follow REST protocol.
router.route('/signup').post(signUp);

//A separate route for logging in user - does not follow REST protocol.
router.route('/login').post(logIn);

//A separate route for forgotpassword - does not follow REST protocol.
router.route('/forgot-password').post(forgotPassword);

//A separate route for resetting password - does not follow REST protocol.
router.route('/reset-password/:token').patch(resetPassword);

//A middleware to provide authentication for all routes below line 39. Order of middleware is important
router.use(protect);

//A separate route for resetting password - does not follow REST protocol.
router.route('/update-password').patch(updatePassword);

router.route('/update-me').patch(updateMe);

router.route('/delete-me').delete(deleteMe);

router.route('/get-me').get(getMe, getAUser);

//A middleware to provide authentication for all routes below line 39. Order of middleware is important
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createAUser);

router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

module.exports = router;
