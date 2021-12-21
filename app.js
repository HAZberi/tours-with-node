// This file contains all the application configurations and hooks up all the
// middlewares for request response pipeline.

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code. "Order Matters"

//Set HTTP security header as a middleware
app.use(helmet());

//json middleware to handle post requests
//and get access to req.body as a javaScript object
//Body-parser
app.use(express.json());

//Data Sanitization middleware to prevent NOSQL query injections
app.use(mongoSanitize());

//Data Sanitization middleware to prevent HTML/XML injection
app.use(xss());

//use express.static as middleware to serve static files
app.use(express.static(`${__dirname}/public`));

//use morgan middleware to get descriptive information on every API request
//in the console.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Express Rate Limiter middleware creation to limit number of request from an IP
const limiter = rateLimit({
  max: 100,
  //Time window for max requests, in milliseconds
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in one hour.',
});
//Use Express limiter function as middleware on all routes with /api
app.use('/api', limiter);

//A naive example of middleware.
app.use((req, _, next) => {
  console.log('Hello from the middleware');
  //console.log(req.headers);
  next();
});

//One way to add timestamp on every API request.
app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//router middlewares
//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code. "Order Matters"
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//if user hits an undefined route
app.all('*', (req, res, next) => {
  //if we pass an argument to the next(), it will short circuit the
  //request-response cycle and treat it as an error automatically
  next(new AppError(`CANNOT find ${req.originalUrl} on this server.`, 404));
});

//Global Error Handling Middleware
//we can use next(err) in our controllers to direct all the errors to globalErrorHandler
//this is an advanced use case
app.use(globalErrorHandler);

module.exports = app;
