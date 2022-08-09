const {Genre, validate} = require('../models/genre.model');
const commonHelper = require('../helper/common.helper');
exports.test = async(req, res) => {
  try{
    let data = req.body
    let genre = new Genre(data);
    let re = await genre.save();
    console.log('xxxxxxxxx', req.body);
    res.status(200).json({ name: "API From v1_0_1", re });
  }catch(ex){
    res.status(200).json({ error:ex.message});
  }
};
