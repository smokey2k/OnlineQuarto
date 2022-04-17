require('dotenv').config();
const ansi = require('../tools/ansi');

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
    's2k': ['datas2k@gmail.com','d',3123,220],
    'jan': ['jan@gmail.com','d',4234,300],
    'dan': ['dan@gmail.com','d',4234,310],
    'cili': ['cili@gmail.com','d',30,30],
    '0123456789abc': ['csubi@csubi.com','d',550,70]
}

var initDB = `
CREATE DATABASE IF NOT EXISTS ${process.env.DBNAME};
USE ${process.env.DBNAME};
CREATE TABLE if not exists users (
    id int AUTO_INCREMENT primary key, 
    username varchar(100) UNIQUE,
    email  varchar(100),
    password varchar(100),
    score int UNIQUE,
    playedGames int UNIQUE
);
CREATE TABLE if not exists highscore (
    id int AUTO_INCREMENT primary key,
    username varchar(100),
    score int,
    playedGames int,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (score) REFERENCES users(score)
    
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


CREATE TABLE if not exists games (
    id int AUTO_INCREMENT primary key,
    hostID int,
    HostName varchar(100),
    playerID int,
    playerName varchar(100),
    game varchar(100)
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
    const db = require('./model-mysql');
    for (const [key, value] of Object.entries(users)) {
        db.query(`INSERT IGNORE INTO users (username, email, password, score, playedGames ) VALUES ('${key}', '${value[0]}', '${value[1]}','${value[2]}','${value[3]}')`, (err)=>{
            if (err) throw err;
        });
    }
    console.log(`MySQL Database: '${process.env.DBNAME} initialised.`);
 });

 