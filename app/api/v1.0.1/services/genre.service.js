const dbModel = require("../models/feature.model");
const { createTree } = require("../helpers/util.helper");

//create an item
const createItem = async(data) =>{
    return new Promise(async (resolve,reject) => {
        try {
            const result =  await dbModel.add(data);
            resolve({message:"Feature created successfully",data:result});
        } catch(err) {
            console.log(err);
            reject({message:"Unable to add Feature", "err":{error:err.message}});
        }
    })
}
 //Get an item by an id   
 const getById = async(params) =>{
    return new Promise(async(resolve,reject) => {
        try {
            let result= "";
            if(Object.keys(params).length > 0) {
                result =  await dbModel.get(params.id);
            }
            resolve({message:"Success",data:result});
         } catch(err){
            console.error('Get Error', err);
            reject({message:"Failed", "err":{error:err.message}});
         }
    })
}

//fetch item based on some filters
const search = (params) =>{
    return new Promise( async( resolve,reject)=>{

        try {
            let result = await dbModel.find(params?.filter || {});
            let data = JSON.parse(JSON.stringify(result)); 

            resolve({message:"Filtered successfully",data:data});
        } catch(err){
            console.error('Search Error', err);
            reject({message:"Search failed", "err":{error:err.message}});
        }

    })
}

// update an existing item using id
const updateItem = async(id, data) =>{    
    return new Promise(async(resolve,reject) => {
        try {
            let result = "";
            if(id) {
                result =  await dbModel.update(id, data);
            }
            resolve({message:"Updated Successfully",data:result});
        } catch (err) {
            console.error('Update Error', err);
            reject({message:"Unable to update Feature", "err":{error:err.message}});
        }
    })
}

// delete an item using id
const deleteItem = async(id) =>{
    return new Promise( async(resolve,reject) => {
        try {
            let result = "";
            if(id) {
                result = await dbModel.delete(id);
            }
            resolve({message:"Deleted successfully",data:result});
        } catch (err) {
            reject({message:"Unable to delete feature", "err":{error:err.message}});
        }
    })
}

module.exports = { createItem , getById, search, updateItem, deleteItem }
