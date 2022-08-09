var express = require('express');
const Validator = require('../middleware/Validator')
var router = express.Router();
const controller = require("../controllers/test.controller");
router.post('/test', Validator('test'), controller.test);
module.exports = router;

