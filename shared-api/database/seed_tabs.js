require('dotenv').config();
const { pool } = require('./../api/utils/dbConnect');

// check if database exists, if not create it
pool.query('CREATE DATABASE IF NOT EXISTS `cross_platform_app`', (error, results, fields) => {
    if (error) {
        console.log('error checking if cross_platform_app database exists:', error.sqlMessage);
        return;
    }
});

// use the database
pool.query('USE cross_platform_app', (error, results, fields) => {
    if (error) {
        console.log('an error occurred trying to use the cross_platform_app database', error);
        return;
    }
});

// build the various tables and their schemas, stole these straight out of phpmyadmin ha
// users
pool.query(
    'CREATE TABLE `save_tabs` (' +
        '`id` int(11) NOT NULL AUTO_INCREMENT,' +
        '`topics` varchar(2083) COLLATE utf8_unicode_ci NOT NULL,' + // this is max url length not related just a number
        '`tabs` text NOT NULL,' +
        '`date_added` datetime NOT NULL,' +
        'PRIMARY KEY (`id`)' +
       ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
    (error, results, fields) => {
        if (error) {
            console.log('error creating table save_tabs:', error.sqlMessage);
            return;
        }
    }
)

pool.end();
