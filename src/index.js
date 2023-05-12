const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// const RandomFile = require('./utils/randomFile');
// const User = require('./models/user');
// const Task = require('./models/task');
// const HandleForError = require('./utils/error-handle');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// app.use(function (req, res, next) {
//     console.log('Hi Ji !');
//     next();
// });

// // app.use({});

// app.get('/users', async (req, res, next) => {

//     console.log('Greetings !');
//     next('There is an error');
//     console.log('Greetings again !');
// });

// app.get('/users', async (err, req, res, next) => {
//     console.log('error: ', err)
// });


app.listen(port, () => {
    console.log('server started on port', port);
});