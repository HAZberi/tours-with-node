const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is required.'],
    unique: [true, 'Tour name must be unique.'],
    trim: true,
    maxlength: [40, 'Tour name cannot exceed 40 characters.'],
    minlength: [8, 'Tour name must have atleast 8 characters.'],
  },

  email: {
    type: String,
    required: [true, 'Email address is required.'],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
  },

  confirmPassword: {
    type: String,
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
