const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/User');
const ErrorResponse = require('../util/errorResponse');

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  //Create users
  const user = await User.create({
    name,
    email,
    password,
  });
  sendToken(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and Password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credential', 401));
  }

  //check if Password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credential', 401));
  }
  sendToken(user, 200, res);
});

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
