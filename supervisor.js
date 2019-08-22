const inquirer = require('inquirer');
const mysql = require("mysql");
const cTable = require('console.table');
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Calvin16",
  database: "bamazon_db"
});


console.log("connected as id " + connection.threadId);
connection.query("SELECT products.product, departments.name, departments.over_head, products.product_sales FROM departments INNER JOIN products ON departments.name = products.department", 
function(err, item) {
    if (err) throw err;
    console.table(item)
})

