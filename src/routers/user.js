const express = require('express');
const User = require('../models/user');
const HandleForError = require('../utils/error-handle');
// const RandomFile = require('../utils/randomFile');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const result = await user.save();
        res.send(result);
    } catch (error) {
        HandleForError(error, res);
    }
});

router.get('/users', async (req, res) => {

    try {
        const result = await User.find();

        if (!result) {
            return res.status(500).send('Not Found !');
        }
        res.send(result);
    } catch (error) {
        HandleForError(error, res);
    }
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
        const result = await User.findByIdAndUpdate(_Id, req.body, { new: true, runValidators: true });

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

