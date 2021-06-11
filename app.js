const express = require("express");
const fs = require("fs");

const app = express();

//json middleware to handle post requests
//and get access to req.body as a javaScript object
app.use(express.json());

//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code.
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tours = JSON.parse(
  //readfileSync is NOT asynchronous
  //dont use Sync operations in the callbacks
  //it blocks the event loop
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
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

const createATour = (req, res) => {
  //Normally Ids are automatically generated by the database.
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newTourId, ...req.body });

  //wrtieFileSync will block the event loop
  //dont use it in the callbacks

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const getATour = (req, res) => {
  const { id } = req.params;
  //Normally Ids are automatically generated by the database.
  //Ids are string so remember to convert them to numbers for manipulation
  if (id >= tours.length) {
    res.status(404).json({
      status: "failed",
      message: "Requested tour not found.",
    });
    return console.log("Requested tour not found");
  }
  const requestedTour = tours.find((tour) => tour.id === +id);
  res.status(200).json({
    status: "success",
    data: {
      tour: requestedTour,
    },
  });
};

const updateATour = (req, res) => {
  //Not a complete implementation of PATCH HTTP Method
  //A complete implementation will require us to change the local files
  const { id } = req.params;
  //Normally Ids are automatically generated by the database.
  //Ids are string so remember to convert them to numbers for manipulation
  if (id >= tours.length) {
    res.status(404).json({
      status: "failed",
      message: "Requested tour not found.",
    });
    return console.log("Requested tour not found");
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedTourData: req.body,
      tour: tours[id],
    },
  });
};

const deleteATour = (req, res) => {
  //Not a complete implementation of DELETE HTTP Method
  const { id } = req.params;
  //Normally Ids are automatically generated by the database.
  //Ids are string so remember to convert them to numbers for manipulation
  if (id >= tours.length) {
    res.status(404).json({
      status: "failed",
      message: "Requested tour not found.",
    });
    return console.log("Requested tour not found");
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

app.route("/api/v1/tours").get(getAllTours).post(createATour);

app
  .route("/api/v1/tours/:id")
  .get(getATour)
  .patch(updateATour)
  .delete(deleteATour);

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createATour);
// app.get("/api/v1/tours/:id", getATour);
// app.patch("/api/v1/tours/:id", updateATour);
// app.delete("/api/v1/tours/:id", deleteATour);

// app.get("/", (req, res) => {
//   console.log(req);
//   res.status(200).json({
//     message: "Hello from the server side...",
//     appName: "tours with node",
//   });
// });

// app.post("/", (req, res) => {
//   res.send("You can post the data to this endpoint.");
// });

const port = 4000;

app.listen(port, () => {
  console.log(`Listening requests on port ${port}.... `);
});
