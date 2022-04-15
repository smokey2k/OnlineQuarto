require('dotenv').config();
const ansi = require('../tools/ansi');

const mysql = require('mysql');

const db = mysql.createPool({
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASS,
    database : process.env.DBNAME
});

db.getConnection((err, connection)=>{
    if (err) throw err;
    console.log(`Connected to ${ansi.bgYellow}${ansi.fgBlack }MySQL database${ansi.reset}: ${ansi.fgYellow}${process.env.DBNAME}${ansi.reset} ! ConnectioID: ${connection.threadId}`);
    
});

module.exports = db;
