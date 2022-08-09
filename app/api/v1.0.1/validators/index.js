//* validators/index.js
const test = require('./test.validator')
const user = require('./user.validator')
const login = require('./login.validator')

module.exports = {
    test,
    user,
    login
}
