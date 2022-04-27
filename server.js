// the modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const http = require('http');
const ejs = require('ejs');
const logger = require('morgan');
const os = require('os');
const fs = require('fs');
const moment = require('moment');
const initDB = require('./API/model/model-mysql-init');
const db = require('./API/model/model-mysql');
const router = require('./API/router');
const socket = require('socket.io');
const ansi = require('./API/tools/ansi');

// set up two hour expiry of the cookies
const TWO_HOURS = 1000 * 60 * 60 * 2;
const IN_PROD = process.env.NODE_ENV === "production";
const app = express();
// session middleware
const sessionMiddleware = session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
});

// add the session middleware to application
app.use(sessionMiddleware);


// set the publicly available static path
app.use(express.static('./assets/public'));
// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended:true}));
// set up the visual appereance engine and paths
app.set('views', './API/view/');
app.set('view engine','ejs');
// start the HTTP requests logger on server console
app.use(logger('dev'));

// initialise the router
app.use('/',router);

// start the HTTP server
var httpServer = http.createServer(app).listen(process.env.PORTHTTP,()=>{
    console.log(`=========== ${moment().format('MMMM Do YYYY, h:mm:ss a')} ===========`);
    console.log(`${ansi.bgCyan}${ansi.fgBlack }HTTP Server${ansi.reset} listening on host: ${ansi.fgYellow}${os.hostname()}${ansi.reset}, port ${ansi.fgCyan}${process.env.PORTHTTP}${ansi.reset}`)
});

// set up the Socket.IO middleware in the session
var io = socket(httpServer);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// start the Socket.IO 
SocketIO = require('./API/tools/socketIO')(io);
