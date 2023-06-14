require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

// connect to mysql, assumes above works eg. mysql is running/credentials exist
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
});

// check if database exists, if not create it
connection.query('CREATE DATABASE IF NOT EXISTS `cross_platform_app`', (error, results, fields) => {
    if (error) {
        console.log('error checking if cross_platform_app database exists:', error.sqlMessage);
        return;
    }
});

// use the database
connection.query('USE cross_platform_app', (error, results, fields) => {
    if (error) {
        console.log('an error occurred trying to use the cross_platform_app database', error);
        return;
    }
});

// build the various tables and their schemas, stole these straight out of phpmyadmin ha
// users
connection.query(
    'CREATE TABLE `canvas_drawings` (' +
        '`id` int(11) NOT NULL AUTO_INCREMENT,' +
        '`topics` varchar(2083) COLLATE utf8_unicode_ci NOT NULL,' + // this is max url length not related just a number
        '`drawing` text NOT NULL,' +
        '`date_added` datetime NOT NULL,' +
        'PRIMARY KEY (`id`)' +
       ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
    (error, results, fields) => {
        if (error) {
            console.log('error creating table canvas_drawings:', error.sqlMessage);
            return;
        }
    }
)

connection.end();