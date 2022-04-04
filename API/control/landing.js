const ejs = require('ejs');
const db = require('../model/model-mysql');
const share = require('../tools/share');

exports.GET_lobby = (req,res)=>{
    //console.log( share.test());
    //userInfo = getUserInfo(req);
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
    
    var userInfo = {
        sessionID: req.session.id,
        userID: req.session.userID,
        name: req.session.username,
        room: req.session.room
    };
    ejs.renderFile('./API/view/game/game.ejs',{userInfo}, (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_game = (req,res)=>{
    
    req.session.room = req.body.gameroom;
    res.redirect('/game')
}

function getUserInfo(req){
    var userInfo = {
        sessionID: req.session.id,
        userID: req.session.userID,
        name: req.session.username,
        room: req.session.room
    };
    return userInfo
} 
