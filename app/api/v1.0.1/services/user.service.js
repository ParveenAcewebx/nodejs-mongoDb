const { User } = require("../models/user.model");
const _ = require("lodash");
const bcrypt = require("bcrypt");


const createItem = async(data) =>{
    return new Promise(async (resolve,reject) => {
        try {
            let user = new User(data);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            resolve(_.pick(user, ["_id", "name", "email"]));
        } catch(err) {
            console.log(err);
            reject({message:"Unable to add user", "error":{error:err.message}});
        }
    })
}


 const findOne = async(whereData) =>{
    return new Promise(async(resolve,reject) => {
        try {
            let user = await User.findOne(whereData);
            if(user){
                reject({message:"User already registered."});
            }else{
                resolve({message:"User is not registered."});
            }
            
         } catch(err){
            reject({message:{errorss:err.message}});
         }
    })
}
 const findById = async(id) =>{
    return new Promise(async(resolve,reject) => {
        try {
            let user = await User.findById(id).select("-password");
            resolve(user);            
         } catch(err){
            reject({message:{errorss:err.message}});
         }
    })
}

module.exports = { findOne, createItem, findById }
