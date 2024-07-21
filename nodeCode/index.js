//imports
require("dotenv").config();

const express = require('express');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');


//DB connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error" , (error) => console.log(error));
db.once("open" , () => console.log('connected to the DataBase!'));

//middlewares
//this middleware is use for file uploading using form data
app.use(express.urlencoded({extended :false}));

//use to parse json data in post request
app.use(express.json());

//Session middleware setup
app.use(session({
    secret : "my secret",        // Secret key for signing the session ID
    saveUninitialized : true,   // Save new sessions that are unmodified
    resave : false,            // Do not resave sessions that are unmodified
}));

//this middleware is use for storing session message
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});



app.get("/",(req,res) => {
    res.send("hello world");
});

app.get('/set-message', (req, res) => {
    req.session.message = 'This is a flash message!';
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`server started at port number : ${port}`);
});
