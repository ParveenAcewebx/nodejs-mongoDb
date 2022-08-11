const winston = require('winston');
const mongoose = require('mongoose');


module.exports = function() {
  const db = process.env.DATABASE
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`))
    .catch(err => console.error('could not connect ot menogo db'));
}