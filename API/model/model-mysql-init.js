require('dotenv').config();
const ansi = require('../tools/ansi');
const mysql = require('mysql');
const db = require('./model-mysql');
var init = 1;

var init = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    multipleStatements: true
});

init.getConnection((err, connection)=>{
    if (err) throw err;
});

const users = [
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



var initDB = `
CREATE DATABASE IF NOT EXISTS ${process.env.DBNAME};
USE ${process.env.DBNAME};

CREATE TABLE if not exists users (
    id int AUTO_INCREMENT primary key, 
    username varchar(100),
    email varchar(100),
    password varchar(100),
    score int,
    playedGames int
);

CREATE TABLE if not exists highscore (
    id int AUTO_INCREMENT primary key,
    username varchar(100),
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
    playerIndex int,
    socket varchar(20)
);

CREATE TABLE if not exists highscore (
    id int AUTO_INCREMENT primary key,
    playerID int,
    playerName varchar(100),
    score int
);

TRUNCATE TABLE rooms;
`

init.query(initDB, function (err, result) {
    if (err) throw err;
/*
    for (let y = 0; y < users.length; y++) {
        db.query(`INSERT IGNORE INTO users (username, email, password, score, playedGames ) VALUES ('${users[y][0]}', '${users[y][1]}', '${users[y][2]}','${users[y][3]}','${users[y][4]}')`, (err)=>{
            if (err) throw err;
        });    
    }
*/
    console.log(`MySQL Database: '${process.env.DBNAME} initialised.`);
});

