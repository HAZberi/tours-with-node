const express = require("express");
const fs = require("fs");

const app = express();

//json middleware to handle post requests
//and get access to req.body
app.use(express.json());

const tours = JSON.parse(
  //readfileSync is NOT asynchronous
  //dont use Sync operations in the callbacks
  //it blocks the event loop
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
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
      res.status(200).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

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
