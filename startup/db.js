const winston = require('winston');
const mongoose = require('mongoose');
// const config = require('config');

module.exports = function() {
//   const db = config.get('db');
  const db = 'mongodb://localhost/acewebx'
  mongoose.connect(db)
    .then(() => winston.info(`Connected to ${db}...`))
    .catch(err => console.error('could not connect ot menogo db'));
}