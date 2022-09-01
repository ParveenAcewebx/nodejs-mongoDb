const auth = require("../middleware/auth.middleware");

const express = require("express");
const router = express.Router();


const joiSchemas = require('../validators')
const schema = joiSchemas['user']

const validator = require('../middleware/Validator')
const controller = require("../controllers/user.controller");

router.post('/user', validator(schema['create']), controller.createUser);
router.get('/user/me', auth, controller.me);

module.exports = router;