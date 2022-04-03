const ejs = require('ejs');
const db = require('../model/model-mysql');
const share = require('../tools/share');

exports.GET_lobby = (req,res)=>{
    //console.log( share.test());
    var userInfo = {
        sessionID: req.session.id,
        userID: req.session.userID,
        name: req.session.username,
        room: req.session.room
    };  
    ejs.renderFile('./API/view/landing/lobby.ejs', {userInfo} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.GET_game = (req,res)=>{
    //const { gameroom } = req.body;
    ejs.renderFile('./API/view/game/game.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_game = (req,res)=>{
    //const { gameroom } = req.body;
    const gameroom = req.body.gameroom;
    //console.log(gameroom)
    req.session.room = gameroom;
    console.log(req.session.room);
    console.log(req.session.username);
    res.redirect('/game');
    
}
