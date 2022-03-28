const ejs = require('ejs');
const db = require('../model/model-mysql');

exports.GET_landing = (req,res)=>{
    //console.log(req.body.nickname);
    //console.log=(req.body.room);

    var userInfo = {
        sessionID: req.session.id,
        userID: req.session.userID,
        name: req.session.username
    };  
    ejs.renderFile('./API/view/landing/main.ejs', {userInfo} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

