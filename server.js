const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });

const app = require("./app");

console.log(process.env);

app.listen(process.env.PORT, () => {
  console.log(`Listening requests on port ${process.env.PORT}.... `);
});
