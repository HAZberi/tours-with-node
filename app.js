// This file contains all the application configurations and hooks up all the
// middlewares for request response pipeline.

const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

const app = express();

//json middleware to handle post requests
//and get access to req.body as a javaScript object
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//middlewares are not automatically hoisted to the top
//meaning - middlewares take effect depending on where they are
//defined in the code.
app.use((req, _, next) => {
  console.log("Hello from the middleware");
  next();
});
app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//router middlewares
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
