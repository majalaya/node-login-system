const mysql  = require('mysql');
const conn = mysql.createConnection(
{
    host:'localhost', //your db host
    user:'root', //your db user
    password: '', //your db password
    database:'database1' //your db name
});

module.exports = conn;