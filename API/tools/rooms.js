const session = require('express-session');
const db = require('../model/model-mysql');
const games = [];
const chatHistory = [];

//
// User management
//
    // User join to chat room
    function joinRoomUser(userID,name,room,socketID,firstTime) {
      //db.query(`UPDATE rooms SET room='${room}', socket='${socketID}' WHERE userID=${userID};`, (err)=>{
      //    if (err) throw err;
      //});
      db.query(`UPDATE rooms SET room='${room}' WHERE userID=${userID};`, (err)=>{
        if (err) throw err;
    });
      const user = {userID,name,room,socketID,firstTime};
      return user;
  }
  // User join to game
  function playerJoinGame(session) {
      var index = games.findIndex(game => game.gamename === `${session.game}`);
      let id = session.userID;
      let username = session.username;
      let room = session.game;
      let user = { id, username, room};
      games[index].users.push(user);
      return user;
  }
  // Get current user
  function getCurrentPlayer(id,session) {
      var game = games.findIndex(game => game.gamename === `${session.game}`);
      return games[game].users.find(user => user.id === id);
  }
  // Get current userindex
  function gePlayerIndex(id,session) { //, index
      var game = games.findIndex(game => game.gamename === `${session.game}`);
      return games[game].users.findIndex(user => user.id === id);
  }
  // User leaves the game
  function playerLeaveGame(id,session) {
      var game = games.findIndex(game => game.gamename === `${session.game}`);
      const index = games[game].users.findIndex(user => user.id === id);
      if (index !== -1) {
        return games[game].users.splice(index, 1)[0];
      }
  }
  // Get game room users
  function getGamePlayers(room,session) {
      var game = games.findIndex(game => game.gamename === `${session.game}`);
      return games[game].users.filter(user => user.room === room);
  }



// Chat to database 
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

// Format time
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

// Format chat message
function formatMessage(username, text) {
  return {
      username,
      text,
      time: formatTime()[1]
  }
}

module.exports = {
  games,
  chatHistory,
  joinRoomUser,
  playerJoinGame,
  getCurrentPlayer,
  gePlayerIndex,
  playerLeaveGame,
  getGamePlayers,
  roomHistory,
  formatTime,
  formatMessage
};