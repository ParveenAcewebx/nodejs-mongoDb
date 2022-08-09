module.exports = {
    parseJoiErrorRespose(errorObj, res) {
        try{
            const { value, error } = errorObj; 
            const valid = error == null; 
            if (!valid) { 
                let returnData = {}
                returnData.status = false
                returnData.message = error.details[0].message
                returnData.data = { errors: 
                    error.details.map(i => i.message)
                }
                res.status(422).json(returnData) 
            }
            return true
        }
        catch(ex){
            res.status(422).json({error: ex.message}) 
        }
    },
    parseErrorRespose(errorMsg) {
        var returnData = {}
        returnData.status = false
        returnData.message = this.getObjFirstValue(errorMsg)
        returnData.data = { errors: errorMsg }
        return returnData
    },
    parseSuccessRespose(data = '', successMsg = '') {
        var returnData = {}
        returnData.status = true
        returnData.message = successMsg
        if (typeof data == 'string') {
            returnData.data = {}
        } else {
            returnData.data = data
        }
        return returnData
    }
}