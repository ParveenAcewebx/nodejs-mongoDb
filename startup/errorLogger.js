// Reff: https://www.bloggernepal.com/2022/01/all-about-logging-in-nodejs-with-winston.html
const winston = require('winston');

const myFormat = winston.format.printf(({
  message,
  level,
  timestamp,
  stack,
  ...meta
}) => {
  let obj;

  for (let key in meta) {
      if (!obj) {
          obj = {}
      }
      obj[key] = meta[key];
  }
  return `${timestamp} [${level}]: ${message} ${obj?'\n\t'+ JSON.stringify(obj):''} ${stack?'\n'+stack:''}`;
});


const errorLogger = winston.createLogger({
  level: 'error',
  transports: [
      new winston.transports.File({
          filename: 'logs/error.log',
          format: winston.format.combine(
            winston.format.errors({
                stack: true
            }),
            winston.format.timestamp({
                format: 'dd MMM, YYYY hh:mm:ss a Z'
            }),
            myFormat,
        )
      }),
      new winston.transports.Console({
          format: winston.format.combine(
              winston.format.colorize(),
              winston.format.errors({
                  stack: true
              }),
              winston.format.timestamp({
                  format: 'dd MMM, YYYY hh:mm:ss a Z'
              }),
              myFormat,
          )
      })
  ]
})

module.exports = errorLogger