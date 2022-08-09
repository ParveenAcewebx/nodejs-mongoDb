const swaggerUi = require('swagger-ui-express');
const { sw, swUIOptions } = require("../app/config/swagger/swagger.config");


module.exports = function(app) {
    app.use(
        '/api-docs',
        (req, res, next) => {
          // let user = auths(req);
          // if (user === undefined || user['name'] !== process.env.SWAGGER_USER || user['pass'] !== process.env.SWAGGER_PASSWORD) {
          //   res.statusCode = 401;
          //   res.setHeader('WWW-Authenticate', 'Basic realm="Node"');
          //   res.end('Unauthorized');
          // } else {
          //   next();
          // }
          next();
        },
        swaggerUi.serve,
        swaggerUi.setup(sw, swUIOptions)
      );
  }