const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token){
    let returnData = {
      status:false,
      message:'Access denied. No token provided.'
    }
    return res.status(401).send(returnData);
  } 

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    let returnData = {
      status:false,
      message:'Invalid token.'
    }
    return res.status(400).send(returnData);
  }
};