const userModel = require("../models/user.model");
const _ = require("lodash"); 
const bcrypt = require("bcrypt");
module.exports = {      
    async getByProperty(obj) {
    let user = await userModel.findOne(obj);
      try{
          return user;
      }catch(error){
          return {};
      }
                   
    },     
    async isRecordExist(obj) {        
        return ( await userModel.findOne(obj) ) ? true:false
    },  
    async add(user) {  
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return await userModel.create( user )
    },
    async findById(id) {  
        return await userModel.findById(id).select("-password");
    }
}
