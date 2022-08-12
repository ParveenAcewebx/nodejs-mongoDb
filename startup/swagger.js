const swaggerUi = require('swagger-ui-express');
const swaggerAuth = require('../middleware/swaggerAuth.middleware');
const swaggerDocumentV_1_0_0 = require("../app/apidocs/apiDoc.v1.0.0.json")
const swaggerDocumentV_1_0_1 = require("../app/apidocs/apiDoc.v1.0.1.json")


module.exports = function(app) {
  let options = {}
    app.use('/v1.0.0/apidocs', swaggerAuth, swaggerUi.serveFiles(swaggerDocumentV_1_0_0, options), swaggerUi.setup(swaggerDocumentV_1_0_0));
    app.use('/v1.0.1/apidocs', swaggerAuth, swaggerUi.serveFiles(swaggerDocumentV_1_0_1, options), swaggerUi.setup(swaggerDocumentV_1_0_1));
}