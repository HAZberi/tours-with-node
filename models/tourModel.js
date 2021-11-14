const mongoose = require('mongoose');

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

module.exports = Tour;
