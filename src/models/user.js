const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
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
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, 'spiderman');
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    // console.log('user: ', user);
    // user.email = 11;
    // const userObj = user.toObject();
    // userObj.email = 11;
    // console.log('user_toObject(): ', userObj);
    // console.log('user_toJSON(); ', user.toJSON());

    if (!user) {
        throw new Error('invalid email !');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('invalid password !');
    }

    return user;
}

userSchema.pre('save', async function (next) {
    console.log('It has run before save');

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;