const db = require('../model/model-mysql');
const moment = require('moment');
const roomUsers = [];
const games = [];
const chatHistory = [];


exports = module.exports = function(io) {
    io.sockets.on('connection', (socket)=> {

        const session = socket.request.session;
        session.socket = socket.id;
        
        socket.on('joinToRoom', ()=> {
            roomHistory(session.room,io);
            const user = joinUser(session.userID, session.username, session.room, session.socket,1);
            socket.join(session.room);
            socket.emit('updateLobby', games);
            //socket.to(session.room).emit('updateRoom');
            socket.emit('message',formatMessage('System', `${user.name}, wellcome in the ${session.room} !`) );
            socket.broadcast.to(session.room).emit('joinedToRoom', formatMessage('System', `${session.username} joined to room: ${session.room} !`) );
        });

        socket.on('joinToGame', ()=> {
            roomHistory(session.game,io);
            socket.join(session.game);
            db.query(`UPDATE rooms SET room='${session.game}', game='${session.game}', socket='${socket.id}' WHERE userID=${session.userID};`, (err)=>{
                if (err) throw err;
            });
            socket.emit('message',formatMessage('System', `${session.username}, wellcome in the game room: ${session.game}!`) );            
            socket.broadcast.to(session.game).emit('joinedToRoom', formatMessage('System', `${session.username} joined to room: ${session.game} !`) );
        });

        socket.on('message', (msg)=>{
            let room = '';
            if (session.route != 'game') {
                room = session.room;
            } else {
                room = session.game;
            }
            io.in(room).emit('message',formatMessage(session.username, msg));
            let text = formatMessage(session.username, msg);
            db.query(`INSERT INTO chat VALUES(null, '${room}','${text.username}','${text.text}', '${formatTime()[0]}' )`);
        });

        socket.on('createGame', ()=>{
            db.query(`INSERT INTO games VALUES(null, '${session.userID}','${session.username}', null,null,'${session.userID}-${session.username}')`, (err)=>{
                if (err) throw err;
                db.query("SELECT * FROM games", (err, result, fields)=> {
                    if (err) throw err;
                    result.forEach(e => {
                        games.push(e.game);
                    });
                    const game = `${session.userID}-${session.username}`;
                    socket.to('lobby').emit('gameCreated',games); // game
                });
            });
        });

    });
}

function roomHistory(room,io) {
    chatHistory[room] = [];
    db.query(`SELECT * FROM chat WHERE room='${room}'`)
    .on('result', (data)=>{
        chatHistory[room].push(data);
    })
    .on('end', ()=> {
        io.to(room).emit('chat-history',chatHistory[room]);
    })
}
function formatTime() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let year = date_ob.getFullYear();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let day = ("0" + date_ob.getDate()).slice(-2);
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes()+1;
    let ltime = `${year}:${month}:${day}::${hours}:${minutes}`;
    let stime = `${hours}:${minutes}`;
    return [ltime,stime];
};

function formatMessage(username, text) {
    return {
        username,
        text,
        //time: moment().format('H:mm')
        time: formatTime()[1]
    }
}

function joinPlayer(userID,name,room,game,socketID) {
    db.query(`UPDATE rooms SET room='${game}', game='${game}', socket='${socketID}' WHERE userID=${userID};`, (err)=>{
        if (err) throw err;
    });
}

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
