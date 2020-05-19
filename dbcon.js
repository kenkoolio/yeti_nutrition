// dbcon.js
// Created: 4/12/2020
// Author: Huy Nguyen <nguyehu6@oregonstate.edu>
// Description: File to set up node connection to mysql database.

const dotenv = require('dotenv');
var mysql = require('mysql');

dotenv.config();
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DBHOST,
  user            : process.env.USERNAME,
  password        : process.env.PASSWORD,
  database        : process.env.DB_NAME
  // host            : "localhost",
  // user            : "root",
  // password        : "123456",
  // database        : "yeti_eats"
});

module.exports.pool = pool;


// Instructions for Local DB connection setup

// Create a file called “.env” in the project root directory
// Insert these fields with the credentials of your local mysql username and password,
//   host should be blank, and db name should be "yeti_eats":

// # Database credentials
// USERNAME="root"
// PASSWORD="your_password"
// HOST=""
// DB_NAME="yeti_eats"
//
// # other local environment stuff
// PORT=8000
