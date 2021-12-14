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
    //Validator method only works for .create and .save methods. !important.
    validate: {
      //We cannot use the arrow function here because we need to use the 'this' reference keyword.
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
});

//It is important to encrypt passwords before saving to the database, this can be done via mongoose pre middleware

userSchema.pre('save', function (next) {
  //The pre save hook should only run if the password is modified. Gaurd clause as follows.
  if (!this.isModified('password')) return next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
