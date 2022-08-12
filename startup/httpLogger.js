const morganBody = require("morgan-body")
const httpLog = require("../middleware/httpLog.middleware");
module.exports = function(app) {
    morganBody(app);
    app.use(httpLog)
}