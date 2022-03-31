const db = require('../model/model-mysql');
const moment = require('moment');
const roomUsers = [];

exports = module.exports = function(io) {
    io.sockets.on('connection', (socket)=> {
        const session = socket.request.session;
        socket.on('joinToRoom', (userInfo)=> {
            const user = joinUser(session.userID, session.username, session.room, socket.id,1);
            socket.join(user.room);
            // update room info
            io.to(user.room).emit('updateRoom',session.room, getRoomUsers(session.room));
            // wellcome current user
            socket.emit('message',formatMessage('System', `${user.name}, wellcome in the ${user.room} !`) );
            // broadcast to users in room
            socket.broadcast.to(user.room).emit('joinedToRoom', connectUser(user.userID) );
        });
        // listen for messages
        socket.on('message', (msg)=>{
            io.in(session.room).emit('message',formatMessage(session.username, msg));
        });
    });
}

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('H:mm')
    }
}

// user join to room
function joinUser(userID,name,room,socketID,firstTime) {
    const user = {userID,name,room,socketID,firstTime};
    const index = roomUsers.findIndex(object => object.userID === user.userID);
    if (index === -1) {
        roomUsers.push(user);
    }
    return user;
}

function connectUser(userID) {
    let msg = '';
    const index = roomUsers.findIndex(object => object.userID === userID);
    if (roomUsers[index].firstTime == 1) {
        roomUsers[index].firstTime = 0;
        //msg = `User ${roomUsers[index].name} joined to the room: ${roomUsers[index].room} !`
        msg = formatMessage('System', `${roomUsers[index].name} joined to room: ${roomUsers[index].room} !`);
    }
    return msg;
}

// get all user from room
function getRoomUsers(room){
    return roomUsers.filter(user =>  user.room === room);
}

// users leave the room
function userLeave(id) {
    const index = roomUsers.findIndex(user => user.id === id);
    if (index !== -1) {
        return roomUsers.splice(index, 1)[0];    
    }
}
