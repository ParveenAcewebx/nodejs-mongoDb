const validator = (joiSchema) => {
    return async(req, res, next) => {
        try {
            const options = {
                // allowUnknown: true, // ignore unknown props
                // stripUnknown: false // remove unknown props
                abortEarly:false,
                allowUnknown: true,
                errors: {
                  wrap: {
                    label: ''
                  }
                }
            };
            const body = { ...req.body, ...req.query, ...req.params, ...req.headers }
            const { error, value } = await joiSchema.validate(body, options);
            if (error) {
                let errors = [];
                error.details.forEach((detail) => {
                    let errorObj = {
                        type:detail.path[0],
                        messasage: detail.message,
                    };
                    errors.push(errorObj);
                });    

                let returnData = {
                    status:false,
                    message:error.details[0].message,
                    data:{
                        errors:errors
                    }
                }
                return res.status(400).json(returnData) 
            }
            return next()
        }
        catch (error) { 
            console.log('errorerrorerror',error)
            return res.status(400).json({ message: 'Request Failed', err: error.message , validation:error.validation})
            // return res.promise(Promise.reject({ message: 'Request Failed', err: error }));
         }
    }
}
module.exports = validator
    