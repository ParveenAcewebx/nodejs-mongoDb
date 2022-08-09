const _ = require("lodash");
const {findOne, createItem, findById} = require("../services/user.service");
const { successHandler, errorHandler } = require("../../../helper/util.helper");
exports.createUser = async(req, res) => {
    try{
        await findOne({ email: req.body.email });
        let result = await createItem(_.pick(req.body, ["name", "email", "password"]))   
        return successHandler(res,res, result, 'Added user successfully')
    }catch(ex){
        return errorHandler(res,res, ex)        
    }
  };

exports.me = async(req, res) => {
    try{
        const user = await findById(req.user._id);
        return successHandler(res,res, user, 'Get user info successfully')
    }catch(ex){
        return errorHandler(res,res, ex)        
    }
  };
