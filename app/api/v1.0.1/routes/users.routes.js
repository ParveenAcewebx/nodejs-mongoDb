const auth = require("../middleware/auth.middleware");

const express = require("express");
const router = express.Router();

const Validator = require('../middleware/Validator')
const controller = require("../controllers/user.controller");

router.post('/user', Validator('user'), controller.createUser);
router.get('/user/me', auth, controller.me);

module.exports = router;