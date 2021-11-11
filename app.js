// This file contains all the application configurations and hooks up all the
// middlewares for request response pipeline.

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();
//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code.

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

//Mongoose Schema

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A valid tour name is required'],
    unique: [true, 'Tour name must be unique'],
  },
  rating: {
    type: Number,
    defalut: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Tour price is required.'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'Bear Country',
  rating: 4.8,
  price: 497,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('OMG an Error', err));

//router middlewares
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
