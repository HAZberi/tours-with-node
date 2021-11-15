const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');
//const mongoose = require('mongoose');
const connectDB = require('../../db');
const Tour = require('../../models/tourModel');
//const Tour = require('../../models/tourModel');

connectDB();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully imported.');
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('All documents in tour collection successfully deleted.');
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
