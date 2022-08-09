const express = require('express');
const router = express.Router();
const Validator = require('../middleware/Validator')
const controller = require("../controllers/auth.controller");
router.post('/auth/login', Validator('login'), controller.login);

module.exports = router;