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
    's2k': ['datas2k@gmail.com','d'],
    'jan': ['jan@gmail.com','d'],
    'dan': ['dan@gmail.com','d']
}

var initDB = `
CREATE DATABASE IF NOT EXISTS ${process.env.DBNAME};
USE ${process.env.DBNAME};
CREATE TABLE if not exists users (
    id int AUTO_INCREMENT primary key, 
    username varchar(100) UNIQUE,
    email  varchar(100),
    password varchar(100),
    score int
);
CREATE TABLE if not exists rooms (
    id int AUTO_INCREMENT primary key,
    userID int,
    username varchar(100),
    room varchar(100),
    route varchar(100),
    socketID varchar(20)
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
`
init.query(initDB, function (err, result) {
    if (err) throw err;
    const db = require('./model-mysql');
    for (const [key, value] of Object.entries(users)) {
        db.query(`INSERT IGNORE INTO users (username, email, password ) VALUES ('${key}', '${value[0]}', '${value[1]}')`, (err)=>{
            if (err) throw err;
        });
    }
    console.log(`MySQL Database: '${process.env.DBNAME} initialised.`);
 });
