const fs = require("fs");
const tours = JSON.parse(
  //readfileSync is NOT asynchronous
  //dont use Sync operations in the callbacks
  //it blocks the event loop
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkId = (_, res, next, val) => {
  if (val >= tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "Requested tour not found.",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "failed",
      message: "Insufficient Data to create a tour",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.createATour = (req, res) => {
  //Normally Ids are automatically generated by the database.
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId, ...req.body });

  //wrtieFileSync will block the event loop
  //dont use it in the callbacks

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) return console.log("Cannot write to the file.");
      console.log("Added a new Tour successfully");
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getATour = (req, res) => {
  const { id } = req.params;
  //Normally Ids are automatically generated by the database.
  //Ids are string so remember to convert them to numbers for manipulation
  const requestedTour = tours.find((tour) => tour.id === +id);
  res.status(200).json({
    status: "success",
    data: {
      tour: requestedTour,
    },
  });
};

exports.updateATour = (req, res) => {
  //Not a complete implementation of PATCH HTTP Method
  //A complete implementation will require us to change the local files
  const { id } = req.params;
  //Normally Ids are automatically generated by the database.
  //Ids are string so remember to convert them to numbers for manipulation

  res.status(200).json({
    status: "success",
    data: {
      updatedTourData: req.body,
      tour: tours[id],
    },
  });
};

exports.deleteATour = (req, res) => {
  //Not a complete implementation of DELETE HTTP Method
  const { id } = req.params;
  //Normally Ids are automatically generated by the database.
  //Ids are string so remember to convert them to numbers for manipulation

  res.status(204).json({
    status: "success",
    data: null,
  });
};
