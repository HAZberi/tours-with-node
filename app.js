const express = require("express");
const fs = require("fs");

const app = express();

//json middleware to handle post requests
//and get access to req.body
app.use(express.json());

const tours = JSON.parse(
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
    console.log(req.body);
    res.send("Done")
})

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
