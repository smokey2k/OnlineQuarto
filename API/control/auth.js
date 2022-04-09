require('dotenv').config();
const db = require('../model/model-mysql');
const ejs = require('ejs');
const { NULL } = require('mysql/lib/protocol/constants/types');

const baseRoom = "lobby";
const baseRoute = "lobby";
var errorMsg = '';

exports.GET_root = (req,res)=>{
    errorMsg = '';
    ejs.renderFile('./API/view/login/root.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}
exports.GET_login = (req,res)=>{
    ejs.renderFile('./API/view/login/login.ejs',{errorMsg} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_login = (req,res)=>{
    const { username, password } = req.body;
    errorMsg = '';
    if (!req.session.userID) {
        if (username && password) {
            db_login(username,password,req,res);
        } else {
            sendError(`Missing Username and/or Password !`,res,'/login');
            res.redirect('/login');
        }
    } else {
        if (username != req.session.username) {
            res.redirect(`/sessionOccupied`);
        } else {
            res.redirect(`/${req.session.route}`);
        }
    }
}


exports.GET_register = (req,res)=>{
    ejs.renderFile('./API/view/login/register.ejs', {errorMsg} , (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_register = (req,res)=>{
    const { name,email,passwd1,passwd2 } = req.body;
    errorMsg = '';
    if (name.length > 12 || name == 'null') {
        sendError('Name is too long or not allowed ! Maximum name lenght is 12 character.',res,'/register');
    } else if (passwd1 != passwd2) {
        sendError('The given passwords are not the same !',res,'/register');
    } else {
        db.query(`SELECT id FROM users WHERE email='${email}'`, (err, results)=>{
            if (err) throw err;
            if (results.length > 0)
            {
                sendError(`The given E-mail address already registered !`,res,'/register');
            }
            else
            {
                db_reggister(name,email,passwd1,req,res);
            }
        });
    }
}

exports.POST_logout = (req,res)=>{
    db.query('DELETE FROM rooms WHERE userID = ?', [req.session.userID], (err)=>{
        if (err) throw err;
    });
    req.session.destroy( err => {
        if (err) throw err;
        res.clearCookie(process.env.SESSION_NAME);
        res.redirect('/')
    })
}

exports.GET_sessionOccupied = (req,res)=>{
    ejs.renderFile('./API/view/login/sessionOccupied.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}


function sendError(msg,res,route) {
    errorMsg = msg;
    res.redirect(route);
}

function db_reggister(name,email,passwd1,req,res) {
    db.query(`INSERT INTO users VALUES(null, '${name}', '${email}', '${passwd1}', 0)`, (err)=>{
        if (err) throw err;
        if (!req.session.userID) {
            db.query(`SELECT * FROM users WHERE email='${email}'`, (err, results)=>{
                req.session.userID = results[0].id;
                req.session.username = results[0].username;
                req.session.room = baseRoom;
                req.session.route = baseRoom;
                req.session.game = 'null';
                db.query(`INSERT INTO rooms VALUES(null,
                    '${req.session.room}','${req.session.userID}', '${req.session.username}',
                    '${req.session.route}','${req.session.game}',
                    null)`, (err)=>{
                    if (err) throw err;
                    return res.redirect(`/${req.session.route}`);
                });
            });      
        } else {
            res.redirect(`/sessionOccupied`);
        }                    
    });
}

function db_login(username, password,req,res) {
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results)=> {
        if (err) throw err;
        if (results.length > 0) {
            req.session.userID = results[0].id;
            req.session.username = results[0].username;
            db.query('SELECT * FROM rooms WHERE userID = ?', [req.session.userID], (err, results)=> {
                if (results.length > 0) {
                    req.session.room = results[0].room;
                    req.session.route = results[0].route;
                    req.session.game = results[0].game;
                } else {
                    req.session.room = baseRoom;
                    req.session.route = baseRoute;
                    req.session.game = 'null';
                    db.query(`INSERT INTO rooms VALUES(null, 
                        '${req.session.room}','${req.session.userID}', '${req.session.username}',
                        '${req.session.route}','${req.session.game}',
                        null
                        )`, (err)=>{
                        if (err) throw err;
                    });
                }
                return res.redirect(`/${req.session.route}`);
            });
        } else {
            errorMsg = `Incorrect Username and/or Password !`;
            res.redirect('/login');
        }			
    });
}
