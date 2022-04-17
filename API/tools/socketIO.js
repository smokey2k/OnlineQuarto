const session = require('express-session');
const db = require('../model/model-mysql');
//const roomUsers = [];
//const games = [];
const gamesList = [];
const { games,joinRoomUser,playerJoinGame,getCurrentPlayer,gePlayerIndex,
        playerLeaveGame,getGamePlayers,roomHistory,formatTime,formatMessage
    } = require('./rooms');
const { checkFive } = require('./amoba');


exports = module.exports = function(io) {
    io.sockets.on('connection', (socket)=> {
        const session = socket.request.session;
        session.socket = socket.id;
        socket.on('joinToRoom', ()=> {
            roomHistory(session.room,io);
            const user = joinRoomUser(session.userID, session.username, session.room, session.socket,1);
            socket.join(session.room);
            socket.emit('updateLobby', gamesList);
            //socket.to(session.room).emit('updateRoom');
            socket.emit('message',formatMessage('System', `${user.name}, wellcome in the ${session.room} !`) );
            socket.broadcast.to(session.room).emit('joinedToRoom', formatMessage('System', `${session.username} joined to room: ${session.room} !`) );
        });

        socket.on('joinToGame', ()=> {
            var index = games.findIndex(game => game.gamename === `${session.game}`);
            if (games[index].full != 1) {
                if ( games[index].player1[0] != session.username &&
                    games[index].player1[1] != session.userID &&
                    games[index].player2[0] == '') {
                    playerJoinGame(session);
                    games[index].player2[0] = session.username;
                    games[index].player2[1] = session.userID;
                    games[index].full = 1;
                    for( var i = 0; i < gamesList.length; i++){ 
                        if ( gamesList[i] === session.game ) { 
                            gamesList.splice(i, 1); 
                        }
                    }
                    io.to('lobby').emit('updateLobby', gamesList);
                    let rnd = Math.round(Math.random()+1);
                    games[index].currPlayer = rnd;
                    socket.join(session.game);
                    
                    io.in(session.game).emit('gameStarted',rnd, games[index] );
                    
                }   
            }
            roomHistory(session.game,io);
            
            socket.join(session.game);    
            
            
            socket.emit('UserIndex', gePlayerIndex(session.userID,session)+1);
            
            io.in(session.game).emit('updateGameRoom', games[index]);

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
            var game = {};
            var game = {
                gamename: `${session.userID}-${session.username}`,
                player1: [session.username,session.userID],
                player2: ['',-1],
                users: [],
                full: 0,
                currPlayer: 0,
                table: [
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                  ]
            }
            let id = session.userID;
            let username = session.username;
            let room = `${session.userID}-${session.username}`;
            let user = { id, username, room};
            game.users.push(user);
            games.push(game);
            //console.table(game);
            gamesList.push(game.gamename);
            socket.to('lobby').emit('gameCreated',gamesList);
        });

        socket.on('putCell', (id)=>{
            
            var game = games.findIndex(game => game.gamename === `${session.game}`);
            var table = games[game].table;
            let currUser = gePlayerIndex(session.userID,session)+1;
            
            //table.currPlayer = currUser;
            let row = Math.floor(id / 15);
            let col = id % 15;
            table[row][col] = currUser;
            io.emit('drawCell', id,  currUser );
            
            let win = checkFive(row, col, currUser,session);
            if (win) {
                io.emit('win', getCurrentPlayer(session.userID,session).username);
            }
        })
    });
}



