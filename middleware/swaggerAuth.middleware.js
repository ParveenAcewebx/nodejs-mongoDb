const auths = require('basic-auth');
  module.exports = function(req, res, next){
    let user = auths(req);
    if (user === undefined || user['name'] !== process.env.SWAGGER_USER || user['pass'] !== process.env.SWAGGER_PASSWORD) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="example"')
      res.end('Access denied')
    } else {
      next();
    }
  }