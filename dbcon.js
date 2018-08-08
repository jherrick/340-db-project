var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_baumanda',
  password        : '9149',
  database        : 'cs340_baumanda'
});

module.exports.pool = pool;
