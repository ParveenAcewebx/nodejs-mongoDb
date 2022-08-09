const express = require('express');
const error = require('../middleware/error');


module.exports = function(app) {
    app.get("/", (req, res) => {
        res.json({ message: "Welcome to AceWebX.com application." });
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', require('../app/api'));
    app.use(error);
  }