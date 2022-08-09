var express = require('express');
const Validator = require('../middleware/Validator')
const auth = require('../middleware/auth.middleware')
var router = express.Router();
const controller = require("../controllers/test.controller");
router.post('/test', [auth, Validator('test')], controller.test);
module.exports = router;

