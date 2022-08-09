var commonHelper = require('./common.helper');
var loggerV1 = require('../../../config/winston.v1');

module.exports = {
  async sendMqttCommand( option) {
    // var mqttClient = req.app.mqttClient;
    var toTopic = option.toTopic;
    var toPayload = option.toPayload.toString();
    var fromTopic = option.fromTopic;
    var fromErrorTopic = option.fromErrorTopic;
    var fromPayload = option.fromPayload;
    var waitTime = (option.waitTime)?option.waitTime:'20';
    return new Promise((resolve, reject) => {
      let timeout = setTimeout(reject, (waitTime*1000), 'Device not responding');
      mqttClient.publish(toTopic, toPayload);
      mqttClient.subscribe(fromTopic);

      if( fromErrorTopic != '' && typeof fromErrorTopic != "undefined" ){
        mqttClient.subscribe(fromErrorTopic);
      }

      mqttClient.on("message", (topic, details) => {
        if (fromTopic == topic) {
          clearTimeout(timeout);

          mqttClient.unsubscribe(fromTopic);
          let returnData = "";
          if (commonHelper.isJson(details)) {
            returnData = JSON.parse(details)
          } else {
            returnData = details.toString()
          }
          resolve({
            status: true,
            data: returnData,
            message: returnData,
            topic: topic
          });
        }
      }); // End Message

      mqttClient.on("error", (err) => {
        loggerV1.errorLog.log('error', commonHelper.parseErrorRespose( {data: err}) )
        mqttClient.unsubscribe(fromTopic);
        reject({
          status: false,
          data: "Device not responding",
        });
      });
    }).catch((err) => {
      loggerV1.errorLog.log('error', commonHelper.parseErrorRespose( {data: err}) )

      return {
        status: false,
        data: ( typeof err == "undefined" ) ? 'Unknown server error':err,
      };
    });
  },

  async publishMqttCommand(req, option) {
    var mqttClient = req.app.mqttClient;
    var toTopic = option.toTopic;
    var toPayload = option.toPayload;
    mqttClient.publish(toTopic, toPayload);
  }
};
