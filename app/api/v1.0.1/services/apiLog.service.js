const apiLogModel = require("../models/apilog.model");
module.exports = {      
    async add(user) { 
        return await apiLogModel.create( user )
    },
    async findById(id) {  
        return await apiLogModel.findById(id);
    }
}
