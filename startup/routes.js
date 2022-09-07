const express = require('express');
const cors = require("cors")
const error = require('../middleware/error');


module.exports = function(app) {
    app.use(cors({ origin: '*' }));
    app.all("/*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Credentials",true);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });
    app.get("/", (req, res) => {
        res.json({ message: "Welcome to AceWebX.com application." });
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', require('../app/api'));
    app.use(error);
  }