const ejs = require('ejs');
const db = require('../model/model-mysql');
const share = require('../tools/share');

exports.GET_lobby = (req,res)=>{
    console.log( share.test());

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

