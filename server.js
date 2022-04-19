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

const TWO_HOURS = 1000 * 60 * 60 * 2;
const IN_PROD = process.env.NODE_ENV === "production";
const app = express();
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

app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./assets/public'));
app.use(express.urlencoded({extended:true}));

// visual
app.set('views', './API/view/');
app.set('view engine','ejs');
app.use(logger('dev'));

app.use('/',router);

var httpServer = http.createServer(app).listen(process.env.PORTHTTP,()=>{
    console.log(`=========== ${moment().format('MMMM Do YYYY, h:mm:ss a')} ===========`);
    console.log(`${ansi.bgCyan}${ansi.fgBlack }HTTP Server${ansi.reset} listening on host: ${ansi.fgYellow}${os.hostname()}${ansi.reset}, port ${ansi.fgCyan}${process.env.PORTHTTP}${ansi.reset}`)
});

var io = socket(httpServer);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

SocketIO = require('./API/tools/socketIO')(io);
