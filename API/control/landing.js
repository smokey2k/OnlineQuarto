const ejs = require('ejs');
const db = require('../model/model-mysql');


// game page path
exports.GET_game = (req,res)=>{
    set_userGamePath(req,res,'game')
}

// post game
exports.POST_game = (req,res)=>{
    req.session.room = req.body.gameroom;
    req.session.game = req.body.gameroom;
    res.redirect('/game')
}

// the main lobby path
exports.GET_lobby = (req,res)=>{
    set_userPath(req,res,'lobby')
}

// post lobby
exports.POST_lobby = (req,res)=>{
    req.session.game = 'null';
    res.redirect('/lobby')
}

// highscore path
exports.GET_highscore = (req,res)=>{
    const userInfo = getUserInfo(req);
    req.session.route = 'highscore';
    userInfo.route = req.session.route;
    db.query(`SELECT username , score  , playedGames  FROM users ORDER BY score DESC;`, (err,results)=>{
        if (err) throw err;
        ejs.renderFile(`./API/view/landing/highscore.ejs`, {userInfo,results} , (err, data)=>{
            if (err) throw err;
            res.send(data);
        });
    });
}

// help path
exports.GET_help = (req,res)=>{
    set_userPath(req,res,'help')
}

// about path
exports.GET_about = (req,res)=>{
    set_userPath(req,res,'about')
}

// set the path on GET requests 
function set_userPath(req,res,path) {
    const userInfo = getUserInfo(req);
    req.session.room = path;
    req.session.route = path;
    userInfo.room = path;
    userInfo.route = path;
    db.query(`UPDATE rooms SET room='${path}', route='${path}' WHERE userID=${req.session.userID};`, (err)=>{
        if (err) throw err;
        ejs.renderFile(`./API/view/landing/${path}.ejs`, {userInfo} , (err, data)=>{
            if (err) throw err;
            res.send(data);
        });
    });
}

// set game page path on GET requests
function set_userGamePath(req,res,path) {
    const userInfo = getUserInfo(req);
    if (req.session.game == 'null') {
       path = 'lobby'
    }
    req.session.route = path;
    userInfo.route = req.session.route;
    db.query(`UPDATE rooms SET route='${path}' WHERE userID=${req.session.userID};`, (err)=>{
        if (err) throw err;
        ejs.renderFile(`./API/view/landing/${path}.ejs`, {userInfo} , (err, data)=>{
            if (err) throw err;
            res.send(data);
        });
    });
}

// set user info
function getUserInfo(req){
    var userInfo = {
        sessionID: req.session.id,
        userID: req.session.userID,
        name: req.session.username,
        room: req.session.room,
        route: req.session.route,
        playerIndex: req.session.playerIndex 
        
    };
    if (req.session.game) {
        userInfo.game = req.session.game;
    }
    if (req.session.socket) {
        userInfo.socket = req.session.socket;
    }
    return userInfo
} 
