const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = (_, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Request to this route is not defined',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if the user POST password data
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password endpoint.',
        400
      )
    );
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
