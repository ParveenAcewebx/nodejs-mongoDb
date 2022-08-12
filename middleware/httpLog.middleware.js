const logger = require("../startup/errorLogger");
  module.exports = function(req, res, next){
    try {
        const reqUrl = req.url
        res.on("finish", () => {
            let postLogData = {   
            uri: reqUrl,
            method: req.method,
            params: JSON.stringify(req.body),
            ip_address: '',
            time: 1,
            rtime: 1.2,
            response: JSON.stringify(res.__morgan_body_response),
            log_type: 1,
            api_request_from: 'nodejs',
        }
        logger.http(JSON.stringify(postLogData))
        console.log('postLogDatapostLogDatapostLogData', postLogData)
    });
    next()
    
} catch (err) {
        logger.error('http Logger', err)
        next()
        return false
      }
  }

