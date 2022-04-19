const session = require('express-session');
const db = require('../model/model-mysql');
const gamesList = [];
const { games,joinRoomUser,playerJoinGame,getCurrentPlayer,gePlayerIndex,
        playerLeaveGame,getGamePlayers,roomHistory,formatTime,formatMessage
    } = require('./rooms');
const { checkFive, proccesWin } = require('./amoba');


exports = module.exports = function(io) {
    io.sockets.on('connection', (socket)=> {
        const session = socket.request.session;
        session.socket = socket.id;
        socket.on('joinToRoom', ()=> {
            roomHistory(session.room,io);
            const user = joinRoomUser(session.userID, session.username, session.room, session.socket,1);
            socket.join(session.room);
            socket.to('lobby').emit('updateLobby', gamesList);
            socket.emit('message',formatMessage('System', `${user.name}, wellcome in the ${session.room} !`) );
            socket.broadcast.to(session.room).emit('joinedToRoom', formatMessage('System', `${session.username} joined to room: ${session.room} !`) );
        });

        socket.on('joinToGame', ()=> {
            var index = games.findIndex(game => game.gamename === `${session.game}`);
            if (games[index].full != 1 && games[index].full != "undefined") {
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
                    socket.to('lobby').emit('updateLobby', gamesList);
                    let rnd = Math.round(Math.random()+1);
                    games[index].currPlayer = rnd;
                    games[index].gameState = true;
                    socket.join(session.game);
                    io.in(session.game).emit('gameStarted',rnd, games[index] );
                    
                }   
            }
            roomHistory(session.game,io);
            socket.join(session.game);
            
            socket.emit('UserIndex', gePlayerIndex(session.userID,session)+1);
            io.in(session.game).emit('updateGameRoom', games[index]);
            db.query(`UPDATE rooms SET room='${session.game}', game='${session.game}' WHERE userID=${session.userID};`, (err)=>{
                if (err) throw err;
            });
            socket.emit('message',formatMessage('System', `${session.username}, wellcome in the game room: ${session.game}!`) );
            io.in(session.game).emit('joinedToGame', formatMessage('System', `${session.username} joined to room: ${session.game} !`) );
        });

        socket.on('logoutFromGame', (id)=>{
            var index = games.findIndex(game => game.gamename === `${session.game}`);
            let userIndex = gePlayerIndex(session.userID,session);
            games[index].gameState = false;
            socket.emit('message',formatMessage('System', `Player: ${session.username}, has left the game !`) );
            results = proccesWin(userIndex,session,1);
            for( var i = 0; i < games.length; i++){ 
                if ( games[i].gamename === session.game ) { 
                    games.splice(i, 1); 
                }
            }
            io.in(session.game).emit('gameAborted');
        });

        socket.on('leaveFromGame', (id)=>{
            var index = games.findIndex(game => game.gamename === `${session.game}`);
            let userIndex = gePlayerIndex(session.userID,session);
            games[index].gameState = false;
            socket.emit('message',formatMessage('System', `Player: ${session.username}, has left the game !`) );
            results = proccesWin(userIndex,session,1);
            for( var i = 0; i < games.length; i++){ 
                if ( games[i].gamename === session.game ) { 
                    games.splice(i, 1); 
                }
            }
            io.in(session.game).emit('gameAborted');
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
            //var game = {};
            var game = {
                gamename: `${session.userID}-${session.username}`,
                player1: [session.username,session.userID],
                player2: ['',-1],
                users: [],
                full: 0,
                currPlayer: 0,
                gameState: false,
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
            gamesList.push(game.gamename);
            socket.to('lobby').emit('gameCreated',gamesList);
        });

        socket.on('putCell', (id)=>{
            var game = games.findIndex(game => game.gamename === `${session.game}`);
            let currUser = gePlayerIndex(session.userID,session)+1;
            games[game].currPlayer = currUser;
            let row = Math.floor(id / 15);
            let col = id % 15;
            games[game].table[row][col] = currUser;
            io.in(session.game).emit('drawCell', id,  currUser );
            let win = checkFive(row, col, currUser,session);
            if (win) {
                let userIndex = gePlayerIndex(session.userID,session);
                let results = proccesWin(userIndex,session,0);
                let gameState = games[game].gameState;
                let playername = getCurrentPlayer(results.winner.id,session).username;
                for( var i = 0; i < games.length; i++){ 
                    if ( games[i].gamename === session.game ) { 
                        games.splice(i, 1); 
                    }
                }
                io.in(session.game).emit('win', playername, gameState);
            }
        })
    });
}



