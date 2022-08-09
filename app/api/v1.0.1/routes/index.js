var express = require('express');
var router = express.Router();
router.use(require('./test.routes')); 
router.use(require('./users.routes')); 
router.use(require('./auth.routes')); 

module.exports = router;