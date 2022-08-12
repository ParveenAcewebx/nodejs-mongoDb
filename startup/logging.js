// Reff: https://stackoverflow.com/questions/10045891/multiple-log-files-with-winston
var winston = require('winston');

const { combine, splat, timestamp, printf } = winston.format;
const format = winston.format;

const errorStackTracerFormat = winston.format(info => {
  if (info.meta && info.meta instanceof Error) {
      info.message = `${info.message} ${info.meta.stack}`;
  }
  return info;
});
const enumerateErrorFormat = format(info => {
  if (info.message instanceof Error) {
    info.message = Object.assign({
      message: info.message.message,
      stack: info.message.stack
    }, info.message);
  }

  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack
    }, info);
  }

  return info;
});
const myFormat = printf( ({ level, message, timestamp, err, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} ${err} `  
  if(metadata) {
      //returns 0 if empty or an integer > 0 if non-empty
      if( Object.keys(metadata).length ){
          msg += JSON.stringify(metadata)
      } 
  }
  return msg
});


const myFormat1 = printf(info => {
  return `${info.timestamp}: ${info.level}: ${info.message}: ${info.err}`;
});

var debug = winston.createLogger({
  levels: {
    debug: 0
  },
  transports: [
    new (winston.transports.File)({ filename: 'logs/debug.log', level: 'debug'}),
    new (winston.transports.Console)({level: 'debug'})
  ]
});

var info = winston.createLogger({
  levels: {
    info: 1
  },
  transports: [
    new (winston.transports.File)({ filename: 'logs/info.log', level: 'info'}),
    new (winston.transports.Console)({level: 'info'})
  ]
});

var warn = winston.createLogger({
  levels: {
    warn: 2
  },
  transports: [
    new (winston.transports.File)({ filename: 'logs/warn.log', level: 'warn'}),
    new (winston.transports.Console)({level: 'warn'})
  ]
});

var error = winston.createLogger({
  levels: {
    error: 3
  },
  format: combine(timestamp(), enumerateErrorFormat()),
  transports: [
    new (winston.transports.File)({ filename: 'logs/error.log', level: 'error'}),
    new (winston.transports.Console)({level: 'error'})
  ]
});

let access = winston.createLogger({
  level: 'http',
  format: combine(
    splat(),
    timestamp(),
    myFormat,
    winston.format.splat(), // Necessary to produce the 'meta' property
        errorStackTracerFormat(),
        winston.format.simple()
  ),
  transports: [
    new (winston.transports.File)({ filename: 'logs/http.log', level: 'http'}),
    new (winston.transports.Console)({level: 'http'})
  ]
});

var exports = {
  debug: function(msg){
    debug.debug(msg);
  },
  info: function(msg){
    info.info(msg);
  },
  warn: function(msg){
    warn.warn(msg);
  },
  error: function(msg){
    error.error(msg);
  },
  http: function(msg){
    access.http(msg);
  }
};

module.exports = exports;

module.exports.loggerStream  = {
  write: function(message, encoding){
      access.http(message);
  }
};