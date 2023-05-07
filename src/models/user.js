const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Given value is not a vaid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        lowercase: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("password can't contain 'password'");
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error("Positive value required for age parameter");
            }
        }
    }
});

module.exports = User;