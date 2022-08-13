const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    params: {
        type: Object
    },
    ipAddress: {
        type: String,
    },
    response: {
        type: Object
    }
});


const ApiLog = mongoose.model("apilog", apiLogSchema);


module.exports = ApiLog;
