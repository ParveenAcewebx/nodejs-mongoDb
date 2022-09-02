const express = require('express');
const router = express.Router();

const joiSchemas = require('../validators')
const schema = joiSchemas['user']
const validator = require('../middleware/Validator')

const auth = require("../middleware/auth.middleware");


const controller = require("../controllers/auth.controller");
router.post('/auth/login', validator(schema['login']), controller.login);
router.post('/auth/loginWithAccessToken', auth, controller.loginWithAccessToken);

module.exports = router;