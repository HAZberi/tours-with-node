// This file contains all the application configurations and hooks up all the
// middlewares for request response pipeline.

const express = require('express');

const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

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
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'failed',
    message: `CANNOT find ${req.originalUrl} on this server.`,
  });
});

//Global Error Handling Middleware

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

//TEST Debugging
