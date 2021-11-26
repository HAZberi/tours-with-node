// This file contains all the application configurations and hooks up all the
// middlewares for request response pipeline.

const express = require('express');

const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code. "Order Matters"

//json middleware to handle post requests
//and get access to req.body as a javaScript object
app.use(express.json());

//use express.static as middleware to serve static files
app.use(express.static(`${__dirname}/public`));

//use morgan middleware to get descriptive information on every API request
//in the console.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//A naive example of middleware.
app.use((req, _, next) => {
  console.log('Hello from the middleware');
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

app.use(globalErrorHandler);

module.exports = app;
