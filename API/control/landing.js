const ejs = require('ejs');
const db = require('../model/model-mysql');
const share = require('../tools/share');

exports.GET_lobby = (req,res)=>{
    const userInfo = getUserInfo(req);
    req.session.room = 'lobby';
    req.session.route = req.session.room;
    userInfo.room = req.session.room;
    userInfo.route = req.session.room;
    ejs.renderFile('./API/view/landing/lobby.ejs', {userInfo} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.GET_game = (req,res)=>{
    const userInfo = getUserInfo(req);
    req.session.route = 'game';    
    userInfo.route = req.session.route;
    ejs.renderFile('./API/view/game/game.ejs',{userInfo}, (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_game = (req,res)=>{
    req.session.room = req.body.gameroom;
    req.session.game = req.body.gameroom;
    res.redirect('/game')
}

exports.GET_highscore = (req,res)=>{
    const userInfo = getUserInfo(req);
    req.session.room = 'highscore';
    req.session.route = req.session.room;
    userInfo.room = req.session.room;
    userInfo.route = req.session.room;
    ejs.renderFile('./API/view/landing/highscore.ejs', {userInfo} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.GET_help = (req,res)=>{
    const userInfo = getUserInfo(req);
    req.session.room = 'help';
    req.session.route = req.session.room;
    userInfo.room = req.session.room;
    userInfo.route = req.session.room;
    ejs.renderFile('./API/view/landing/help.ejs', {userInfo} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.GET_about = (req,res)=>{
    const userInfo = getUserInfo(req);
    req.session.room = 'about';
    req.session.route = req.session.room;
    userInfo.room = req.session.room;
    ejs.renderFile('./API/view/landing/about.ejs', {userInfo} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}


function getUserInfo(req){
    var userInfo = {
        sessionID: req.session.id,
        userID: req.session.userID,
        name: req.session.username,
        room: req.session.room,
        route: req.session.route
    };
    if (req.session.game) {
        userInfo.game = req.session.game;
    }
    if (req.session.socket) {
        userInfo.socket = req.session.socket;
    }

   // db.query(`UPDATE rooms SET room='${userInfo.room}', socket='${socketID}' WHERE userID=${userID};`, (err)=>{
   //     if (err) throw err;
   // });


    return userInfo
} 
