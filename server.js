// This file contains all the configuration about running the nodeJS
// server and import appropriate environmental variables

//configure donenv before requiring app module otherwise
//process.env custom config will not be available in app module.
const dotenv = require('dotenv');

dotenv.config({ path: `./config.env` });

const connectDB = require('./db');

connectDB();

const app = require('./app');

//console.log(process.env);

app.listen(process.env.PORT, () => {
  console.log(`Listening requests on port ${process.env.PORT}.... `);
});
