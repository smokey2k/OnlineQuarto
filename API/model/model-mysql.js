require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createPool({
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASS,
    database : process.env.DBNAME
});

db.getConnection((err, connection)=>{
    if (err) throw err;
    console.log(`Connected to MySQL database: ${process.env.DBNAME} ! ConnectioID: ${connection.threadId}`);
    
});

module.exports = db;