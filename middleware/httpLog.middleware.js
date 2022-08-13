const apiLogService = require("../app/api/v1.0.1/services/apiLog.service");
module.exports = httplogger = async (req, res, next) => {
  try {
    const reqUrl = req.url
    res.on("finish", async () => {
      let postLogData = {
        uri: reqUrl,
        method: req.method,
        params: req.body,
        ipAddress: req.ip,
        response: res.__morgan_body_response,
      }
      // infoLogger.info(JSON.stringify(postLogData))
      await apiLogService.add(postLogData)
    });
    next()

  } catch (err) {
    errorLogger.error('http Logger', err)
    next()
    return false
  }
}

