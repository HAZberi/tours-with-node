const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

//Refactor Token generation
const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.signUp = catchAsync(async (req, res, next) => {
  //The following code creates a user based on req.body but any user can also create admin user by this technique.
  //https://www.mongodb.com/features/mongodb-authentication
  //https://www.guru99.com/mongodb-create-user.html
  //Anyone can manipulate the req.body to assign admin roles which is a security issue.
  //const newUser = await User.create(req.body);

  //Avoid a potential breach by creating user in a more specific way as follows, so no one can assign roles in req.body
  const {
    name,
    email,
    photo,
    password,
    confirmPassword,
    changedPasswordAt,
    role,
  } = req.body;

  const newUser = await User.create({
    name,
    email,
    photo,
    password,
    confirmPassword,
    changedPasswordAt,
    role,
  });

  //Generate a jwt token for the client as follows
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if the email and password is provided by the client.
  if (!email || !password) {
    return next(
      new AppError('Please provide both email and password to log in.', 400)
    );
  }

  //2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    //A vague error message is good because we dont want hacker to know whether email or password is incorrect. 401 is unauthorized access code.
    return next(new AppError('Incorrect email or password', 401));
  }

  //3. If everything is ok sign the token and send the token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting the token and check if its there.
  const { authorization } = req.headers;

  let token = '';

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  //2. Verify the token and promisfy the result.
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  //3. For advanced security check if the user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError('The user belongs to this token no longer exists.', 401)
    );

  //4. Check if user changed the password after the token is issued.
  if (currentUser.changedPassword(decoded.iat)) {
    return next(
      new AppError(
        'You have changed the password recently. Please log in again.',
        401
      )
    );
  }

  //protect is a middleware function so if all conditions are statisfied we set the current user and call next
  //Granted access to current user to browse protected routes.
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1. Get the user based on the Posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError('There is no user with the email address provided.', 404)
    );
  }
  //2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  //"validateBeforeSave" bypasses the validation step before saving
  await user.save({ validateBeforeSave: false });

  //3. Send the random token to user email

  //1) Create a reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  //2) create a reset message
  const message = `Forgot your password? Submit a PATCH request with your new password and confirm password to the following URL:\n ${resetUrl}\n If you have not forgot the password, please ignore this email.`;

  try {
    //Send the email with options
    await sendEmail({
      email: user.email,
      subject: 'You password reset token (valid for 10 mins)',
      message,
    });

    //send the final response
    res.status(200).json({
      status: 'success',
      message: 'Token has been sent to the email.',
    });
  } catch (err) {
    //send reset token fields in the database to undefined
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;

    await user.save({ validateBeforeSave: false });

    //send error to the client
    return next(
      new AppError(
        'There was an error sending the email. Please try again later!',
        500
      )
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token
  //2) Check if the user exists and token is not expired, set the new password
  //3) Update the changedPasswordAt property for the user
  //4) Log the user and send the JWT token
});
