const mongoose = require('mongoose');
const validator = require('validator');

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
    validate: [validator.isEmail, 'Please enter a valid email address.'],
    lowercase: true,
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'Please enter an eight character password'],
    minlength: [8, 'Minimum password length is 8 characters.'],
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password.'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
