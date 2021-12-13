const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: [true, 'Email address must be unique.'],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'Please enter an 8 character password'],
    minlength: [8, 'Minimum password length is 8 characters.'],
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password.'],
    minlength: 8,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
