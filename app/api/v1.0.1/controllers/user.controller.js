const userService = require("../services/user.service");
const _ = require("lodash"); 

const { successHandler, errorHandler } = require("../../../helper/util.helper");
exports.createUser = async(req, res) => {
    try{        
        if( !await userService.isRecordExist({ email: req.body.email }) ){
            let result = await userService.add(_.pick(req.body, ["name", "email", "password"]))   
            let returnData = {
                _id: result._id,
                name: result.name,
                email: result.email,
            }
            return successHandler(res,res, returnData, 'Added user successfully')
        }else{
            throw new Error("Email is already in use.");
        }
    }catch(ex){
        return errorHandler(res,res, ex)        
    }
  };

exports.me = async(req, res) => {
    try{
        const user = await userService.findById(req.user._id);
        return successHandler(res,res, user, 'Get user info successfully')
    }catch(ex){
        return errorHandler(res,res, ex)        
    }
  }; 
