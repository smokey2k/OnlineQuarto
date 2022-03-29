require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

var init = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    multipleStatements: true
});

init.getConnection((err, connection)=>{
    if (err) throw err;
});

const users = {
    's2k': ['datas2k@gmail.com','d',null],
    'jan': ['jan@gmail.com','d',null],
    'dan': ['dan@gmail.com','d',null]
}

var initDB = `
CREATE DATABASE IF NOT EXISTS ${process.env.DBNAME};
USE ${process.env.DBNAME};
CREATE TABLE if not exists users (
    id int AUTO_INCREMENT primary key, 
    username varchar(100) UNIQUE,
    email  varchar(100),
    password varchar(100),
    status tinyint(1)
);
CREATE TABLE if not exists active_users (
    id int AUTO_INCREMENT primary key,
    userID int,
    room varchar(100),
    socket varchar(20)
);
`
init.query(initDB, function (err, result) {
    if (err) throw err;
    const db = require('./model-mysql');
    for (const [key, value] of Object.entries(users)) {
        db.query(`INSERT IGNORE INTO users (username, email, password, status ) VALUES ('${key}', '${value[0]}', '${value[1]}','${value[2]}')`, (err)=>{
            if (err) throw err;
        });
        db.query(`UPDATE users SET status = null WHERE users.username = '${key}'`, (err)=>{
             if (err) throw err;
        });
    }
    console.log(`MySQL Database: '${process.env.DBNAME} initialised.`);
 });
