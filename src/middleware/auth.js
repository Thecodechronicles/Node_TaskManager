const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function (req, res, next) {

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'spiderman');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw Error('no user found');
        }

        req.token = token;
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({ error: e.message || 'please authenticate' })
    }
}

module.exports = auth;