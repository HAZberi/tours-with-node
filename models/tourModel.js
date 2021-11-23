const mongoose = require('mongoose');
const slugify = require('slugify');
//Mongoose Schema

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A valid tour name is required'],
      unique: [true, 'Tour name must be unique'],
      trim: true,
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      defalut: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required.'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } //a virtual "id" field will be created as well automatically.
);

tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//Document Middleware for mongoDB

//Triggers before save() and create() but NOT after insertMany();
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', (next) => {
//   console.log('Saving the requested document to DB........');
//   next();
// });

// //Triggers after save() and create() but NOT after insertMany();
// tourSchema.post('save', (doc, next) => {
//   console.log('The following document is successfully saved to the Database.');
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
