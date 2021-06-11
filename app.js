const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

const app = express();

//json middleware to handle post requests
//and get access to req.body as a javaScript object
app.use(express.json());
app.use(morgan("dev"));

//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code.
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//router middlewares
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

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
