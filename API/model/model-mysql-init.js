require('dotenv').config();
const ansi = require('../tools/ansi');
const mysql = require('mysql');
const util = require('util');
const db = require('./model-mysql');

// db pool for pre init the database
var init = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    multipleStatements: true
});

// connect to mysql database
init.getConnection((err, connection)=>{
    if (err) throw err;
});

// some predefined users for testing purpose
const testUsers = [
    ['s2k','datas2k@gmail.com','d',200,20],
    ['jan','jan@gmail.com','d',100,5],
    ['dan','dan@gmail.com','d',40,3],
    ['cili','cili@gmail.com','d',100,6],
    ['blabla','blabla@csubi.com','d',40,10],
    ['yolo','yolo@gmail.com','d',200,20],
    ['nyuszi','nyuszi@gmail.com','d',100,5],
    ['csöves','csoves@gmail.com','d',40,3],
    ['csubakka','csubakka@gmail.com','d',100,6],
    ['határozott','hatarozott@csubi.com','d',40,10],
    ['jázmin','jazmin@gmail.com','d',200,20],
    ['júliánusz','julianusz@gmail.com','d',100,5],
    ['dandan','dandan@gmail.com','d',40,3],
    ['fred','fred@gmail.com','d',100,6],
    ['0123456789abc','csubi@csubi.com','d',40,10]
]

// the initialisation mysql query message
var initDB = `
USE ${process.env.DBNAME};
CREATE TABLE if not exists users (
    id int AUTO_INCREMENT primary key, 
    username varchar(100),
    email varchar(100),
    password varchar(100),
    score int,
    playedGames int
);
CREATE TABLE if not exists chat (
    id int AUTO_INCREMENT primary key,
    room varchar(100),
    username varchar(100),
    text text,
    date varchar(32)
);

CREATE TABLE if not exists rooms (
    id int AUTO_INCREMENT primary key,
    userID int,
    username varchar(100),
    room varchar(100),
    route varchar(100),
    game varchar(100),
    playerIndex int
);

TRUNCATE TABLE rooms;
`
init.query(initDB, function (err, result) {
    if (err) throw err;
    db.query('SELECT * FROM users WHERE username = ?', ['s2k'], (err, results)=> {    
        if (results == 0) {
            for (let y = 0; y < testUsers.length; y++) {
                db.query(`INSERT IGNORE INTO users (username, email, password, score, playedGames ) VALUES ('${testUsers[y][0]}', '${testUsers[y][1]}', '${testUsers[y][2]}','${testUsers[y][3]}','${testUsers[y][4]}')`, (err)=>{
                    if (err) throw err;
                });    
            }    
        }
    });
    console.log(`MySQL Database: '${process.env.DBNAME} initialised.`);
});
