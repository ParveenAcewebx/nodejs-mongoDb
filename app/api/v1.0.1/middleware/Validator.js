// Reff: https://dev.to/tayfunakgc/middleware-based-joi-validation-in-expressjs-2po5
const createHttpError = require('http-errors')
//* Include joi to check error type 
const Joi = require('joi')
//* Include all validators
const Validators = require('../validators')

module.exports = function(validator) {
    //! If validator is not exist, throw err
    if(!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`)

    return async function(req, res, next) {
        try {
            // Reff: https://stackoverflow.com/questions/58726874/removing-special-characters-from-hapi-joi-error-messages
            const options = {
                abortEarly:false,
                errors: {
                  wrap: {
                    label: ''
                  }
                }
              };
            const validated = await Validators[validator].validateAsync(req.body, options)
            req.body = validated
            next()
        } catch (err) {
            //* Pass err to next
            //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
            if(err.isJoi){                
                let returnData = {}
                returnData.status = false
                returnData.message = err.details[0].message
                returnData.data = { errors: 
                    err.details.map(i => i.message)
                }
                return res.status(400).json(returnData) 
            } 
            next(createHttpError(500))
        }
    }
}