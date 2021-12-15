const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
  const { name, email, photo, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    photo,
    password,
    confirmPassword,
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
