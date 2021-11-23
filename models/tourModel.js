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
    secretTour: {
      type: Boolean,
      default: false,
    },
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

//Query Middleware for mongoDB

//Triggers before a query gets executed depends on the reqular expression or the specific keyword hook
// tourSchema.pre('find', function (next) { =========> using 'find' will only impact document.find query
tourSchema.pre(/^find/, function (next) {
  /*using regular exp to impact any query that starts with find*/ this.find({
    secretTour: { $ne: true },
  });

  this.start = Date.now();
  next();
});

//Triggers after a query is executed and returned respective results.
//**Remember arrow function in callbacks change the reference to this keyword**
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
