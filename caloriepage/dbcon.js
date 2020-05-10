var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'wordpress',
  password        : 'test',
  database        : 'calories',
  dateStrings: true
});

module.exports.pool = pool;

