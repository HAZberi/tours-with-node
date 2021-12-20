const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObject = require('../utils/filterReqBody');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if the user POST password data
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password endpoint.',
        400
      )
    );

  //2 Filter out unwanted field name that are not allowed.
  const filteredBody = filterObject(req.body, 'name', 'email', 'photo');
  //3) Update the document data only where the fields are changed.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    //new option will return the updated object
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createAUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Request to this route is not defined',
  });
};

exports.getAUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Request to this route is not defined',
  });
};

exports.updateAUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Request to this route is not defined',
  });
};

exports.deleteAUser = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Request to this route is not defined',
  });
};
