const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const registerSchema = Schema({
    name: {
        type: String
    },
    email: {
         type: String,
         unique: true,
    },
    phone_number: {
         type: Number,
         unique: true,
         minlength: 10,
         maxlength: 10
    },
    license_number: {
         type: String,
         unique: true,
    },
    car_number: {
         type: String,
         unique: true,
    },
})

const Register = mongoose.model('register', registerSchema)

module.exports = Register