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
app.use(userRouter);  // app.post() or router.post() both have their post methods defined dynamically i.e post, get, put, patch
// are defined inside an array [post, get, put, patch, ..etc. ] as merely keywords. 'app' has it's property defined by Object.defineProperty()
// dynamically by iterating over each array element. 'router' also has it's properties defined dynamically in it's prototype chain.
// Every get, post method is physically same for app and router each. When a post or get call is made fom app or router, always the call to the router.route.get or router.route.post is made from inside their respective methods( which are physically same for their respective objects ie. app or router) 
// Note: Even when we aren't using router and calling post or get with app.get(), A router object and then a router.route object is made even before a first call of any kind of get or post is made. These router objects are made from inside a lazyRouter() function 
// So, Be it app or router, Both are calling route.get() or route.post() method. So basically, same function is called(route.'method') from inside the post or get of app and router
// It's just that we have to make 'app' aware of 'router' when we are calling post and get with router and that's why we pass router inside app.use()   
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