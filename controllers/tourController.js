const Tour = require('../models/tourModel');

exports.topFiveTours = async (req, _, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = '5';
  req.query.fields = 'name,price,duration,difficulty,ratingsAverage,summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    //Build Query
    //1. Built a DEEP COPY of query request object
    const queryObj = { ...req.query };

    //2. Filtering Exclude special words for data fields
    const excludeSpecialWords = ['sort', 'limit', 'page', 'fields'];
    excludeSpecialWords.forEach((el) => delete queryObj[el]);

    //3. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);

    //4. Create Query
    let query = Tour.find(JSON.parse(queryStr));

    //5. Sort Data with Anchor field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      //Implement default query here.
      // query = query.sort('createdAt');
      //"-" use to sort results in descending order
    }

    //6. Select specific fields for the response
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //7.Pagination Implementation
    const page = req.query.page * 1 || 1; //setting default value if not specified
    const limit = req.query.limit * 1 || 100; //multiply string Number with 1 to convert type;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numDocs = await Tour.countDocuments();
      if (skip >= numDocs) throw new Error('This page does not exist.');
    }

    //Execute Query
    const tours = await query;
    //Executing a query Method-1
    //const tours = await Tour.find(queryObj);

    //Executing a query Method-2
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.createATour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getATour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateATour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteATour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};
