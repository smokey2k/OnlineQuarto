const db = require('./model-mysql');

async function initDB() {
    db.query(`CREATE TABLE if not exists users (
        id int AUTO_INCREMENT primary key, 
        username varchar(100) UNIQUE,
        email  varchar(100),
        password varchar(100),
        status tinyint(1)    
        )`,(err)=>{
            if (err) throw err;
    });
    db.query(`CREATE TABLE if not exists active_users (
        id int AUTO_INCREMENT primary key,
        userID int,
        room varchar(100),
        socket varchar(20)
        )`,(err)=>{
            if (err) throw err;
    });

    db.query(`TRUNCATE TABLE active_users`,(err)=>{
            if (err) throw err;
    });
    var users = {
        's2k': ['datas2k@gmail.com','d',null],
        'jan': ['jan@gmail.com','d',null],
        'dan': ['dan@gmail.com','d',null]
    }

    for (const [key, value] of Object.entries(users)) {
        db.query(`INSERT IGNORE INTO users (username, email, password, status ) VALUES (?, ?, ?,?)`, [ key, value[0], value[1], value[2] ]);
        db.query(`UPDATE users SET status = null WHERE users.username = '${key}'`, (err)=>{ if (err) throw err; });
    }
}