const dotenv = require('dotenv');

dotenv.config();

const fs = require('fs');
//const mongoose = require('mongoose');
const connectDB = require('../../db');
//const Tour = require('../../models/tourModel');

connectDB();

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

console.log(tours);
