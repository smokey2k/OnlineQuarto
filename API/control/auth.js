require('dotenv').config();
const db = require('../model/model-mysql');
const ejs = require('ejs');

exports.GET_root = (req,res)=>{
    ejs.renderFile('./API/view/login/root.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}
exports.GET_login = (req,res)=>{
    ejs.renderFile('./API/view/login/login.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_login = (req,res)=>{
    if (!req.session.userID) {
        const { username, password } = req.body;
        if (username && password) {
            db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results)=> {
                if (err) throw err;
                if (results.length > 0) {
                    if (results[0].status) {
                        console.log ('ALREADY LOGGEIN IN !');
                        return;    
                    }
                    req.session.userID = results[0].id;
                    req.session.username = results[0].username;
                    req.session.room = 'lobby';
                    db.query(`UPDATE users SET status = 1 WHERE users.id = '${req.session.userID}'`, (err)=>{
                        if (err) throw err;
                        db.query(`INSERT INTO active_users VALUES(null, '${req.session.userID}', '${req.session.room}',null)`, (err)=>{
                            if (err) throw err;
                            return res.redirect('/landing');    
                        });
                        
                    });
                    
                    
                } else {
                    console.log("Incorrect Username and/or Password !");
                    //passwordError = "Incorrect Username and/or Password !";
                }			
            });
        } else {
            //passwordError = "Please enter Username and Password !";
        }
    }
}

exports.POST_logout = (req,res)=>{
    const userID = req.session.userID;
    db.query(`UPDATE users SET status = null WHERE users.id = '${userID}'`, (err)=>{
        if (err) throw err;
        db.query(`DELETE FROM active_users WHERE active_users.userID = '${userID}'`, (err)=>{
            if (err) throw err;
        });
    });
    req.session.destroy( err => {
        if (err) {
            return res.redirect('/landing')
        }
        res.clearCookie(process.env.SESSION_NAME);
        res.redirect('/')
    })
}

exports.GET_register = (req,res)=>{
    ejs.renderFile('./API/view/login/register.ejs', (err, data)=>{
        if (err) throw err;
        res.send(data);
    });
}

exports.POST_register = (req,res)=>{
    const { name,email,passwd1,passwd2 } = req.body;
    if (passwd1 != passwd2) {
        res.send('A megadott jelszavak nem egyeznek!');
        
    } else {
        db.query(`SELECT id FROM users WHERE email='${email}'`, (err, results)=>{
            if (err) throw err;
            if (results.length > 0)
            {
                res.send('Ez az e-mail cím már regisztrált!');
            }
            else
            {
                db.query(`INSERT INTO users VALUES(null, '${name}', '${email}', '${passwd1}',1)`, (err)=>{
                    if (err) throw err;
                });
                db.query(`SELECT id FROM users WHERE email='${email}'`, (err, results)=>{
                    if (err) throw err;
                    req.session.userID = results[0].id;
                    return res.redirect('landing');
                });
            }
        });
    }
}
