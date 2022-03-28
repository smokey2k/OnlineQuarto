require('dotenv').config();
const express = require('express');
const session = require('express-session');
const router = require('./API/router');
const http = require('http');
const https = require('https');
const ejs = require('ejs');
const logger = require('morgan');
const os = require('os');
const fs = require('fs');
const moment = require('moment');

const db = require('./API/model/model-mysql');
const { initDB } = require('./API/model/model-mysql-init');

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

app.set('views', './API/view/');
app.set('view engine','ejs');
app.use(logger('dev'));

app.use('/',router);

var httpServer = http.createServer(app).listen(process.env.PORTHTTP,()=>{
    console.log(`HTTP Server listening on host: ${os.hostname()}, port ${process.env.PORTHTTP}`)
});

/*
var httpsServer = https.createServer({
    key: fs.readFileSync('./assets/cert/key.pem'),
    cert: fs.readFileSync('./assets/cert/cert.pem')
  }, app ).listen(process.env.PORTHTTPS,()=>{
    console.log(`HTTPS Server listening on host: ${os.hostname()}, port ${process.env.PORTHTTPS}`)
  });
*/

const socket = require('socket.io');

var io = socket(httpServer);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});



io.on('connection',(socket)=>{
    const session = socket.request.session;
    //console.table(session)
    socket.on('join_Lobby', (userInfo)=> {
        const user = joinUser(socket.id, userInfo.name, userInfo.room );
        socket.join(user.room);
        io.to(user.room).emit('connected_Lobby', `User ${user.name} joined to the room: ${user.room} !` )
        socket.userID = session.userID; 
        db.query(`UPDATE active_users SET socket = '${socket.id}' WHERE active_users.userID = '${session.userID}'`, (err)=>{
            if (err) throw err;
        });


        //console.log(socket.userID)
        //this is an ES6 Set of all client ids in the room
        var clients = io.sockets.adapter.rooms.get(user.room);
        //console.table(clients)
        //clients = Array.from(clients);
        //console.table(clients)
        
        //console.log(Array.from(clients))

        //var setToObject = Object.assign({}, ...Array.from(clients, value => ({ [value]: 'not assigned' })));
        
        
        //to get the number of clients in this room
        const numClients = clients ? clients.size : 0;
        //console.log(numClients)
        //to just emit the same event to all members of a room
        //io.to(user.room).emit('usercount', Array.from(clients)); //JSON.stringify(clients)

        for (const clientId of clients ) {

            //this is the socket of each client in the room.
            const clientSocket = io.sockets.sockets.get(clientId);
            console.log(clientSocket.userID)
            //you can do whatever you need with this
            clientSocket.leave('Other Room')
       
       }


    });






//for (const clientId of clients ) {
//
//     //this is the socket of each client in the room.
//     const clientSocket = io.sockets.sockets.get(clientId);
//
//     //you can do whatever you need with this
//     //clientSocket.leave('Other Room')
//
//}



    socket.on("genUsrClient", () => {
        console.log('bbbbbbbbbbbb')
        socket.emit("genUsrServer");
      });


});

const users = [];

function joinUser(id,name,room) {
    const user = {id,name,room};
    users.push(user);
    return user;
}

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('H:mm')
    }
}