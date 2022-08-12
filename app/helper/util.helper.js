  const isEmptyObject = (obj) => {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }


const successHandler = (req, res, data = '', successMsg = '') => {
  let statusCode = 200
  if (req.method === 'GET' || (req.method === 'POST' && req?.url?.includes("search"))) {
    statusCode = 200
  } else if (req.method === "POST") {
    statusCode = 201
  } else if (req.method === "PATCH") {
    statusCode = 200
  } else if (req.method === "DELETE") {
    statusCode = 202
  }
  let returnData = {}
  returnData.status = true
  returnData.message = successMsg
  if (typeof data == 'string') {
    returnData.data = {}
  } else {
    returnData.data = data
  }
  return res.status(statusCode).send(returnData)
}
const errorHandler = (req, res, exception) => {
  var returnData = {}
  returnData.status = false
  returnData.message = exception.message
  returnData.data = { errors: [] }
  return res.status(400).send(returnData)
}
  
   
  module.exports = {
    isEmptyObject,
    errorHandler,
    successHandler
  }
  