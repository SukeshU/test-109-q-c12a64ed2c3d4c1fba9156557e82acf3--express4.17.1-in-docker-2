const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const registerSchema = Schema({
    name: {
        type: String
    },
    email: {
         type: String
    },
    phone_number: {
         type: Number
    },
    license_number: {
         type: String
    },
    car_number: {
         type: String
    },
})

const Register = mongoose.model('register', registerSchema)

module.exports = Register