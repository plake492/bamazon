const inquirer = require('inquirer');
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Calvin16",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      res.forEach(item => {
        console.log("\nid: " + item.id + " | " + item.product + " |  Price: " + item.price + " |  Department: " + item.department + "\n")
      })
      connection.end();
    });
  }