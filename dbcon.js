var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_vanruisg',
    password: '1814',
    database: 'cs340_vanruisg'
});
module.exports.pool = pool;
