const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
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
        // lowercase: true, // it was necessary to comment this out because, it will change hashed password(bcypt) into lowercase
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

userSchema.pre('save', async function (next) {
    console.log('It has run before save');

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    // console.log(next.toString());

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;