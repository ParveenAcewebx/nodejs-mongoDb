var appRoot = require('app-root-path');
var config = require('../../../config/common.config');
var compareVersions = require('compare-versions');
var loggerV1 = require('../../../config/winston.v1');
var db = require("../models");
const axios = require('axios')

module.exports = {
    isWifHub: function (deviceId) {
        if (deviceId.startsWith("13")) {
            return true
        }
        return false
    },
    isKeyValueExist(obj, key, val, returnKey) {
        obj.some(function (o) {
            if (o[key] === val) {
                console.log('ddddddd', o[returnKey])
                return true
            }
            return false
        })
    },
    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    getHubId(topic) {
        let topicObj = topic.split('/')
        return topicObj[1]
    },
    getDeviceId(topic) {
        let topicObj = topic.split('/')
        return topicObj[2]
    },
    getSuffixes(oemSerialNumber, char){
        return oemSerialNumber.substr(oemSerialNumber.length - char); 
    }, 
    getDeviceType(deviceId) {
        let deviceIdPrefix = deviceId.substr(0, 2)
        let getPrefixInfix = deviceId.substr(0, 4)

        let doorSensorArray = ['2200', '2201']

        if( doorSensorArray.includes(getPrefixInfix)  )
        {
            return 'door_sensor'
        }else{
            let returnValue = ''
            switch (deviceIdPrefix) {
                case constant.HMS_DEVICE_TYPE_BASIC_HUB:
                case constant.HMS_DEVICE_TYPE_HUB:
                case constant.HMS_DEVICE_TYPE_BASIC_PLUS:
                case constant.HMS_DEVICE_TYPE_WIFI_HUB:
                case constant.HMS_DEVICE_TYPE_HUB_15:
                    returnValue = 'hub'
                    break;
                case constant.HMS_DEVICE_TYPE_CAMERA:
                    returnValue = 'camera'
                    break;
                case constant.HMS_DEVICE_TYPE_DOOR_SENSOR:
                    returnValue = 'door_sensor'
                    break;
                case constant.HMS_DEVICE_TYPE_THERMOSTAT:
                    returnValue = 'thermostat'
                    break;
                case constant.HMS_DEVICE_TYPE_OUTLET:
                    returnValue = 'wifi_outlet'
                    break;
                case constant.HMS_DEVICE_TYPE_OUTLET_MERROS:
                    returnValue = 'wifi_outlet'
                    break;
                case constant.HMS_DEVICE_TYPE_DOOR_CONTROLLER:
                    returnValue = 'door_control'
                    break;
                case constant.HMS_DEVICE_TYPE_BORDER_ROUTER:
                    returnValue = 'border_router'
                    break;
                case constant.HMS_DEVICE_TYPE_SUPER_SENSOR:
                    returnValue = 'super_sensor'
                    break;
                default:
                    returnValue = 'other'
            }
            return returnValue
        }
    },
    getPrefix(deviceId) {
        return deviceId.substr(0, 2);
    },
    getPrefixOneChar(deviceId) {
        return deviceId.substr(0, 1);
    },
    getPrefixInfix(deviceId) {
        return deviceId.substr(0, 4);
    },
    isTwoButtonDoor(deviceId) {
        var devicePrefixInfix = this.getPrefixInfix(deviceId)
        if (devicePrefixInfix == '7102' || devicePrefixInfix == '7103' || devicePrefixInfix == '7105') {
            return true
        } else {
            return false
        }
    },
    isCellularHub(hubId) {
        let prefix = hubId.substr(0, 2);
        if (
            prefix == constant.HMS_DEVICE_TYPE_HUB ||
            prefix == constant.HMS_DEVICE_TYPE_BASIC_HUB ||
            prefix == constant.HMS_DEVICE_TYPE_BASIC_PLUS) {
            return true;
        }
        return false;
    },
    isAuxiliaryDoorsensor(deviceId) {
        let prefix = deviceId.substr(0, 4);
        if (
            prefix == '2101') {
            return true;
        }
        return false;
    },
    async sendIosPushNotificationV1(message, deviceToken) { 
        // Sample Data: {"aps":{"alert":"DEMO","badge":1,"sound":"note","type":"DEMO","data":[{"message":"MSG"}]}} 
        // {"aps":{"content-available":1},"type":"UPDATE_DASHBOARD"} 
 
        var apn = require('@parse/node-apn'); 
        var options = { 
            token: { 
                key: `${appRoot}/keys/AuthKey.p8`, 
                keyId: config.IOS_PUSH_NOTIFICATION_API_KEY_ID, 
                teamId: config.IOS_PUSH_NOTIFICATION_API_TEAM_ID, 
            }, 
            production: true 
        }; 
 
        var apnProvider = new apn.Provider(options); 
        const notification = new apn.Notification() 
        notification.expiry = Math.floor(Date.now() / 1000) + 3600 
        notification.pushType = "alert" 
        try { 
 
            const json = JSON.parse(message) 
            notification.rawPayload = json 
 
            // If `content-available` equals 1 and `aps` dictionary doesn't contain any other keys (except `category`), the notification is silent/background. 
            // `apns-push-type` must be set to `background` for iOS 13+. 
            // `category` key is an exeption to the rule 
            const aps = json["aps"] 
            if (aps && aps["content-available"] === 1) { 
                const maxKeysNumber = aps.hasOwnProperty("category") ? 2 : 1 
 
                let size = 0, key 
                for (key in aps) { 
                    size++ 
                } 
 
                if (size === maxKeysNumber) { 
                    notification.pushType = "background" 
                    notification.priority = 5 
                } 
            } 
            notification.topic = config.IOS_PUSH_NOTIFICATION_API_BUNDLE_ID; 
 
            var pushNotificationResponse = await apnProvider.send(notification, deviceToken) 
            if (pushNotificationResponse.failed.length !== 0) { 
                loggerV1.errorLog.log('error', `CommonHelper.sendIosPushNotificationV1 ${JSON.stringify(pushNotificationResponse)}`) 
                return { 
                    status: false, 
                    error: pushNotificationResponse.failed[0].response 
                } 
            } else { 
                loggerV1.infoLog.log('info', `CommonHelper.sendIosPushNotificationV1 : Response : ${JSON.stringify(pushNotificationResponse)}`) 
 
                return { 
                    status: true,
                    response: pushNotificationResponse 
                } 
            } 
        } catch (err) { 
            loggerV1.errorLog.log('error', 'CommonHelper.sendIosPushNotificationV1 : ' + commonHelper.customizeCatchMsg(err)) 
 
        } 
    }, 
    sendIosPushNotification(message, deviceToken) {
        var apn = require('@parse/node-apn');
        var options = {
            token: {
                key: `${appRoot}/keys/AuthKey.p8`,
                keyId: config.IOS_PUSH_NOTIFICATION_API_KEY_ID,
                teamId: config.IOS_PUSH_NOTIFICATION_API_TEAM_ID,
            },
            production: true
        };

        var apnProvider = new apn.Provider(options);
        const notification = new apn.Notification()
        notification.expiry = Math.floor(Date.now() / 1000) + 3600
        notification.pushType = "alert"
        try {
            /* const json = JSON.parse(`{
                "aps": {
                "content-available": 1
                },
            "type": "UPDATE_DASHBOARD"
            }`) */
            const json = JSON.parse(message)
            notification.rawPayload = json

            // If `content-available` equals 1 and `aps` dictionary doesn't contain any other keys (except `category`), the notification is silent/background.
            // `apns-push-type` must be set to `background` for iOS 13+.
            // `category` key is an exeption to the rule
            const aps = json["aps"]
            if (aps && aps["content-available"] === 1) {
                const maxKeysNumber = aps.hasOwnProperty("category") ? 2 : 1

                let size = 0, key
                for (key in aps) {
                    size++
                }

                if (size === maxKeysNumber) {
                    notification.pushType = "background"
                    notification.priority = 5
                }
            }
        } catch (e) {
            loggerV1.errorLog.log('error', this.customizeCatchMsg(e))
        }


        notification.topic = config.IOS_PUSH_NOTIFICATION_API_BUNDLE_ID;
        apnProvider.send(notification, deviceToken).then((result) => {
            if (result.hasOwnProperty('failed')) {
                loggerV1.errorLog.log('error', 'CommonHelper.sendIosPushNotification start')
                loggerV1.errorLog.log('error', result.failed)
                loggerV1.errorLog.log('error', 'CommonHelper.sendIosPushNotification End')
            }
            // see documentation for an explanation of result
        });
    },
    compareFirmwareVersion(currentFirmwareVersion, latestFirmware, op = '>=') {
        currentFirmwareVersion = currentFirmwareVersion.split("-dev");
        currentFirmwareVersion = currentFirmwareVersion[0].toLowerCase()
        currentFirmwareVersion = currentFirmwareVersion.replace('v', '')


        latestFirmware = latestFirmware.split("-dev");
        latestFirmware = latestFirmware[0].toLowerCase()
        latestFirmware = latestFirmware.replace('v', '')
        return compareVersions.compare(currentFirmwareVersion, latestFirmware, op);
    },
    replaceTextRowfromObj(rowData) {
        let jsonString = JSON.stringify(rowData)
        jsonString = jsonString.replace("TextRow ", "");
        return JSON.parse(jsonString);
    },
    // Reff: https://www.codegrepper.com/code-examples/javascript/javascript+get+first+property+of+object
    getObjFirstValue(obj) {
        if (typeof obj == 'object') {
            return obj[Object.keys(obj)[0]];
        } else {
            return false;
        }
    },
    // Reff: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    customizeCatchMsg(errorMsg) {
        return `${errorMsg.name} : ${errorMsg.message} ${errorMsg.stack}`
    },
    parseErrorRespose(errorMsg) {
        var returnData = {}
        returnData.status = false
        returnData.message = this.getObjFirstValue(errorMsg)
        returnData.data = { errors: errorMsg }
        return returnData
    },
    parseSuccessRespose(data = '', successMsg = '') {
        var returnData = {}
        returnData.status = true
        returnData.message = successMsg
        if (typeof data == 'string') {
            returnData.data = {}
        } else {
            returnData.data = data
        }
        return returnData
    },
    groupArrayByKey(array = [], key = '') {
        return array.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    },
    getHubVersionFromPayload(payload) {
        let fwversion = payload.split('hbos-').pop().split('-r0')[0];
        return fwversion.toLowerCase();
    },
    convertArrayToQuery(array) {
        let qry = ` where 1=1 `

        for (const [k, v] of Object.entries(array)) {
            qry += `and ${k} = '${v}' `
        }

        return qry
    },
    async firebasePushNotification(userToken, title, message, postlink = '', alert = '', silent = false) {
        // reff: https://firebase.google.com/docs/cloud-messaging/http-server-ref
        var firebaseUrl = "https://fcm.googleapis.com/fcm/send"
        var firebaseApi = config.FIREBASE_KEY_ANDROID
        if(alert == 'silent'){
            var requestData = `{"to":"${userToken}","data":{"title":"${title}","body":"${message}","alert":"${alert}","click_action":"${postlink}","silent":${silent}}}`
        }else{
            var requestData = `{"to":"${userToken}","notification":{"title":"${title}","body":"${message}"},"data":{"title":"${title}","body":"${message}","alert":"${alert}","click_action":"${postlink}","silent":${silent}}}`
        } 
        loggerV1.infoLog.log('info', 'firebasePushNotification request Data - ' + requestData)

        try {
            var getData = {
                method: 'post',
                url: `${firebaseUrl}`,
                data: requestData,
                headers: {
                    'Authorization': `key=${firebaseApi}`,
                    'Content-Type': 'application/json'
                }
            }
            let firefaseRes = await axios(getData)
            loggerV1.infoLog.log('info', 'firebasePushNotification - ' + JSON.stringify(firefaseRes.data))
        } catch (error) {
            loggerV1.infoLog.log('info', 'firebasePushNotification - ' + this.customizeCatchMsg(error))
        }
    },
    async extractNumber(string) {
        try {
            let numberPattern = /[-+.\d]+/g;
            newValue = string.match(numberPattern)
            if (newValue != null){
                return newValue['0']
            }else{
                return '0'
            }
        } catch (error) {
            loggerV1.errorLog.log('error', 'extractNumber - ' + this.customizeCatchMsg(error))
        }
    },
    async millivoltsToVolts(data) {
        try {
            return (data/1000).toFixed(1)
        } catch (error) {
            loggerV1.errorLog.log('error', 'millivoltsToVolts - ' + this.customizeCatchMsg(error))
        }
    },
    async voltsToMillivolts(data) {
        try {
            return data * 1000
        } catch (error) {
            loggerV1.errorLog.log('error', 'voltsToMillivolts - ' + this.customizeCatchMsg(error))
        }
    },
    async sleep(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
          });
    }
}