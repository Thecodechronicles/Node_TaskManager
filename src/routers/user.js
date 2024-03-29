const express = require('express');
const User = require('../models/user');
const HandleForError = require('../utils/error-handle');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        HandleForError(error, res);
    }
});

router.post('/user/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (error) {
        HandleForError(error, res);
    }
});

router.get('/user/logout', auth, async (req, res, next) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();

    } catch (e) {
        res.status(500).send()
    }
});

router.get('/user/logoutall', auth, async (req, res, next) => {

    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();

    } catch (e) {
        res.status(500).send()
    }
});

router.get('/users/me', auth, async (req, res) => {

    res.status(200).send({ user: req.user });
});

router.get('/users/:id', async (req, res) => {
    const _Id = req.params.id;

    try {
        const result = await User.findById(_Id);

        if (!result) {
            return res.status(500).send('Id Not Found !');
        }
        res.send(result);
    } catch (error) {
        HandleForError(error, res);
    }
});

router.patch('/users/:id', async (req, res) => {
    const _Id = req.params.id;
    const updateFeilds = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const IsValidUpdate = updateFeilds.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!IsValidUpdate) {
        return res.status(400).send({ 'invalidFeild(s)': updateFeilds });
    }

    try {
        const user = await User.findById(_Id);

        updateFeilds.forEach((update) => user[update] = req.body[update]);
        const result = await user.save();

        if (!result) {
            return res.status(400).send('Id Not Found !');
        }

        res.status(200).send(result);
    } catch (error) {
        HandleForError(error, res);
    }
});

router.delete('/users/:id', async (req, res) => {
    const _Id = req.params.id;

    try {
        const result = await User.findByIdAndDelete(_Id, { new: true });

        if (!result) {
            return res.status(400).send('Id Not Found !');
        }

        res.status(200).send(result);

    } catch (error) {
        HandleForError(error, res);
    }
});

module.exports = router;

