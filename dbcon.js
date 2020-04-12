// dbcon.js
// Created: 4/12/2020
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
});

module.exports.pool = pool;


// Instructions for Local DB connection setup

// Create a file called “.env” in the project root directory
// Insert these fields with the credentials of your local mysql username and password,
//   host should be blank, and db name should be “com_unity”:

// # Database credentials
// USERNAME="root"
// PASSWORD="your_password"
// HOST=""
// DB_NAME="yeti_nutrition"
