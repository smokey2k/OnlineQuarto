require('dotenv').config();
const db = require('../model/model-mysql');
const ejs = require('ejs');

const baseRoom = "lobby";
var errorMsg = "";

exports.GET_root = (req,res)=>{
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

exports.GET_sessionOccupied = (req,res)=>{
    ejs.renderFile('./API/view/login/sessionOccupied.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_login = (req,res)=>{
    const { username, password } = req.body;
    errorMsg = '';
    if (!req.session.userID) {
        if (username && password) {
            db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results)=> {
                if (err) throw err;
                if (results.length > 0) {
                    req.session.userID = results[0].id;
                    req.session.username = results[0].username;
                    db.query('SELECT * FROM rooms WHERE userID = ?', [req.session.userID], (err, results)=> {
                        if (results.length > 0) {
                            req.session.room = results[0].room;
                            req.session.route = results[0].route;
                        } else {
                            req.session.room = baseRoom;
                            req.session.route = baseRoom;
                            db.query(`INSERT INTO rooms VALUES(null, '${req.session.userID}', '${req.session.username}', '${req.session.room}','${req.session.route}',null)`, (err)=>{
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
        } else {
            errorMsg = `Missing Username and/or Password !`;
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

exports.POST_logout = (req,res)=>{
    req.session.destroy( err => {
        if (err) throw err;
        res.clearCookie(process.env.SESSION_NAME);
        res.redirect('/')
    })
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
    if (passwd1 != passwd2) {
        errorMsg = `Passwords are not same !`;
        res.redirect('/register');
    } else {
        db.query(`SELECT id FROM users WHERE email='${email}'`, (err, results)=>{
            if (err) throw err;
            if (results.length > 0)
            {
                errorMsg = `The given E-mail address already registered !`;
                res.redirect('/register');
            }
            else
            {
                db.query(`INSERT INTO users VALUES(null, '${name}', '${email}', '${passwd1}')`, (err)=>{
                    if (err) throw err;
                    if (!req.session.userID) {
                        db.query(`SELECT * FROM users WHERE email='${email}'`, (err, results)=>{
                            req.session.userID = results[0].id;
                            req.session.username = results[0].username;
                            req.session.room = baseRoom;
                            req.session.route = baseRoom;
                            db.query(`INSERT INTO rooms VALUES(null, '${req.session.userID}', '${req.session.username}', '${req.session.room}','${req.session.route}',null)`, (err)=>{
                                if (err) throw err;
                                return res.redirect(`/${req.session.route}`);
                            });
                        });      
                    } else {
                        res.redirect(`/sessionOccupied`);
                    }                    
                });
            }
        });
    }
}

