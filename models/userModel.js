const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },

  changedPasswordAt: {
    type: Date,
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

  role: {
    type: String,
    enum: {
      values: ['admin', 'user', 'guide', 'lead-guide'],
    },
    default: 'user',
  },

  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpiresAt: {
    type: Date,
  },
});

//It is important to encrypt passwords before saving to the database, this can be done via mongoose pre middleware

userSchema.pre('save', async function (next) {
  //The pre save hook should only run if the password is modified. Gaurd clause as follows.
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

//Instance Methods can be created on schema so they can called over in controller and provide us an opportunity to keep all data related operation in models.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  encryptedUserPassword
) {
  //This function will compare entered password with encrypted password and return a boolean
  return await bcrypt.compare(candidatePassword, encryptedUserPassword);
};

//Instance Method to check if the password is changed after the JWT token is issued.
userSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.changedPasswordAt) {
    const passwordChangeTimestamp = this.changedPasswordAt.getTime() / 1000;
    return passwordChangeTimestamp > JWTTimestamp; //returns true if password is changed after token issue.
  }

  //False means changedPasswordAt doesnot exist
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //Creating Reset Token
  const resetToken = crypto.randomBytes(32).toString('hex');

  //Storing in Database after encryption
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  //Storing in Database
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

  //returning the newly created reset token
  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
