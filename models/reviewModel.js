const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty.'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating cannot be less than 1.'],
      max: [5, 'Rating cannot be more than 5.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong a user.'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong a tour.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } //a virtual "id" field will be created as well automatically.
);

//Query Middleware

reviewSchema.pre(/^find/, function (next) {
  //Populate both user and tour when querying reviews -- inefficient
  // this.populate({ path: 'tour', select: 'name' }).populate({
  //   path: 'user',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

//Assign a static function on the schema to calculate/aggregate/ something from the collection.
//DONOT USE ARROW FUNCTION here, it messes up with the value of 'this'
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //'this' refers to the Model here
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log(stats);

  //Update the Tour properties to incoporate new aggregations
  if (stats[0]) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  }
};

//Triggers once the doucment is saved to the database.
reviewSchema.post('save', (doc, next) => {
  //Since calcAverageRatings is defined on the model and not on the document.
  //In order to call calcAverageRatings, access to the model object is required.
  //Direct access to the model is not available but statics will be available on the constructor that created this document.

  //Data and methods required to calculate average ratings on the tour.
  // console.log(doc.constructor);
  // console.log(doc.tour);

  doc.constructor.calcAverageRatings(doc.tour);
  next();
});

//Triggers whenever a document/review is edited and deleted
//Ex: findByIdAndUpdate findByIdAndDelete
//We donot have document middleware for findByIdAndUpdate/Delete.
//So use Query middleware with regex "findOneAnd" to calculate stats.
//REFER to LECTURE 169 Questions to get a detailed overview.
reviewSchema.post(/^findOneAnd/, (doc, next) => {
  doc.constructor.calcAverageRatings(doc.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
