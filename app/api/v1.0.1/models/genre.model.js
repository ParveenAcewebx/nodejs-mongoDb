const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: String,
  age:String
});

const Genre = mongoose.model('Genre', genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre; 
