const express = require('express');
const Task = require('../models/task');
const HandleForError = require('../utils/error-handle');

// const router = express.Router();
const router = new express.Router();

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        const result = await task.save();
        res.send(result);
    } catch (error) {
        HandleForError(error, res)
    }
});

router.get('/tasks', async (req, res) => {

    try {
        const result = await Task.find();

        if (!result) {
            return res.status(500).send('Not Found !');
        }

        res.send(result);
    } catch (error) {
        HandleForError(error, res);
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _Id = req.params.id;

    try {
        const result = await Task.findById(_Id);

        if (!result) {
            return res.status(500).send('Id Not Found !');
        }

        res.send(result);
    } catch (error) {
        HandleForError(error, res);
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const _Id = req.params.id;
    const allowedUpdates = ['description', 'completed'];
    const updateFeilds = Object.keys(req.body);
    const IsValidUpdate = updateFeilds.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!IsValidUpdate) {
        return res.status(400).send({ "invalidFeild(s)": updateFeilds });
    }
    try {
        const result = await Task.findByIdAndUpdate(_Id, req.body, { new: true, runValidators: true });

        if (!result) {
            return res.status(400).send('Id Not Found !');
        }

        res.status(200).send(result);
    } catch (error) {
        HandleForError(error, res);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const _Id = req.params.id;

    try {
        const result = await Task.findByIdAndDelete(_Id, { new: true });

        if (!result) {
            return res.status(400).send('Id Not Found !');
        }

        res.status(200).send(result);

    } catch (error) {
        HandleForError(error, res);
    }
});

module.exports = router;