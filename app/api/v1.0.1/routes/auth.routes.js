const express = require('express');
const router = express.Router();

const joiSchemas = require('../validators')
const schema = joiSchemas['user']
const validator = require('../middleware/Validator')

const controller = require("../controllers/auth.controller");
router.post('/auth/login', validator(schema['login']), controller.login);

module.exports = router;