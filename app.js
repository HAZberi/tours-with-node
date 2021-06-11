const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log(req);
  res.status(200).json({
    message: "Hello from the server side...",
    appName: "tours with node",
  });
});

app.post("/", (req, res) => {
  res.send("You can post the data to this endpoint.");
});

const port = 4000;

app.listen(port, () => {
  console.log(`Listening requests on port ${port}.... `);
});
