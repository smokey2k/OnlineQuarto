const ejs = require('ejs');
const db = require('../model/model-mysql');
const share = require('../tools/share');

exports.GET_game = (req,res)=>{
    set_userGamePath(req,res,'game')
    //const userInfo = getUserInfo(req);
    //if (req.session.game != 'null') {
    //    req.session.route = 'game';
    //    
    //    userInfo.route = req.session.route;
    //    ejs.renderFile('./API/view/landing/game.ejs',{userInfo}, (err, data)=>{
    //        if (err) throw err;
    //        res.send(data);
    //    });    
    //}
}

exports.POST_game = (req,res)=>{
    req.session.room = req.body.gameroom;
    req.session.game = req.body.gameroom;
    res.redirect('/game')
}

exports.GET_lobby = (req,res)=>{
    set_userPath(req,res,'lobby')
}

exports.GET_highscore = (req,res)=>{
    set_userPath(req,res,'highscore')
}

exports.GET_help = (req,res)=>{
    set_userPath(req,res,'help')
}

exports.GET_about = (req,res)=>{
    set_userPath(req,res,'about')
}

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
    return userInfo
} 
