const mysql = require("mysql");


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mydb",
    password: "Dima1604"
  });
  module.exports=connection