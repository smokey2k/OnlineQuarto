const db = require('../model/model-mysql');
const moment = require('moment');
const roomUsers = [];
const games = [];

exports = module.exports = function(io) {
    io.sockets.on('connection', (socket)=> {
        const session = socket.request.session;
        session.socket = socket.id;
        
        socket.on('joinToRoom', ()=> {
            const user = joinUser(session.userID, session.username, session.room, session.socket,1);
            socket.join(session.room);
            // update room info
            if (session.room == 'lobby') {
                io.to('lobby').emit('updateLobby', games);    
            }
            // wellcome current user
            socket.emit('message',formatMessage('System', `${user.name}, wellcome in the ${session.room} !`) );
            // broadcast to users in room
            socket.broadcast.to(session.room).emit('joinedToRoom', formatMessage('System', `${session.username} joined to room: ${session.room} !`) );
        });
        
        socket.on('joinToGame', async function() {
            var sockets = await io.in(session.room).fetchSockets();
            console.log(sockets.length);
            if (sockets.length == 1) {
                socket.join(session.game);    
                // update room info
                //io.to(session.room).emit('updateGameRoom',session.room);
                // wellcome current user
                socket.emit('message',formatMessage('System', `${session.username}, wellcome in the game room: ${session.room}!`) );
                // broadcast to users in room
                socket.broadcast.to(session.game).emit('joinedToGame', formatMessage('System', `${session.username} joined to room: ${session.game} !`) );    
                
                console.log(`games: ${games}`)
                for( var i = 0; i < games.length; i++){ 
                    if ( games[i] === session.game) { 
                        games.splice(i, 1); 
                    }
                }

                io.to('lobby').emit('updateLobby', games);
                console.log(`games: ${games}`)
                //db.query('DELETE FROM games WHERE game = ?', [session.room], (err)=>{
                //    if (err) throw err;
                //    io.to('lobby').emit('deleteGameFromList', `${session.room}`);
                //    
                //    
                //    
                //    // update lobby game list
                //    io.to('lobby').emit('updateLobbyRoom', 'lobby', games);
                //});
            } else {
                socket.join(session.game);    
                // update room info
                //io.to(session.room).emit('updateRoom',session.room);
                // wellcome current user
                socket.emit('message',formatMessage('System', `${session.username}, wellcome in the game room: ${session.game}!`) );
                // broadcast to users in room
                socket.broadcast.to(session.game).emit('joinedToGame', connectUser(session.userID) );    
            }
            
            
        });


        // listen for messages
        socket.on('message', (msg)=>{
            let room = '';
            if (session.route != 'game') {
                room = session.room;
            } else {
                room = session.game;
            }
            io.in(room).emit('message',formatMessage(session.username, msg));
        });

        // listen for createGame
        socket.on('createGame', ()=>{
            db.query(`INSERT INTO games VALUES(null, '${session.userID}','${session.username}', null,null,'${session.userID}-${session.username}')`, (err)=>{
                if (err) throw err;
                db.query("SELECT * FROM games", (err, result, fields)=> {
                    if (err) throw err;
                    result.forEach(e => {
                        games.push(e.game);
                    });
                    const game = `${session.userID}-${session.username}`;
                    io.to('lobby').emit('gameCreated',games,game);
                });
            });
        });

    });
}


async function countClientsInRoom(io,room) {
    return await io.in(room).fetchSockets();
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
    db.query(`UPDATE rooms SET room='${room}', socket='${socketID}' WHERE userID=${userID};`, (err)=>{
        if (err) throw err;
    });
    
    const user = {userID,name,room,socketID,firstTime};
    
    const index = roomUsers.findIndex(object => object.userID === user.userID);
    if (index === -1) {
        roomUsers.push(user);
    } else {
        if (socketID != roomUsers[index].socketID) {
            roomUsers[index].socketID = socketID;
        }
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
