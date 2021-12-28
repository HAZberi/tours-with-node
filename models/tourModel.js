const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
//Mongoose Schema

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A valid tour name is required.'],
      unique: [true, 'Tour name must be unique.'],
      trim: true,
      maxlength: [40, 'Tour name cannot exceed 40 characters.'],
      minlength: [8, 'Tour name must have atleast 8 characters.'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'Difficulty level can only be [easy], [medium] or [difficult].',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings Average cannot be less than 1.'],
      max: [5, 'Ratings Average cannot be more than 5.'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required.'],
      min: [100, 'Price must be greater than 100.'],
      max: [10000, 'Price must not be more than $10000.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; //100 < 200
        },
        message: 'Discount price ({VALUE}) should be blow regular price.',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description.'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
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
    startLocation: {
      //GeoJSON Format
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], //longitude[0], latitude[1]
      },
      address: {
        type: String,
      },
      description: {
        type: String,
      },
    },
    locations: [
      //An Array of locations in GeoJSON format
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
        address: {
          type: String,
        },
        description: {
          type: String,
        },
        day: {
          type: Number,
        },
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
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

//Embedding User documentes in Tour Model Schema -- Check lecture 150 NodeJS for details
// tourSchema.pre('save', async function (next) {
//   const arrayOfPromises = this.guides.map(
//     async (id) => await User.findById(id)
//   );
//   //Directly assign the array to guides property.
//   this.guides = await Promise.all(arrayOfPromises);
//   next();
// });

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

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
