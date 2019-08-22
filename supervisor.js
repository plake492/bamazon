const supervisor = () => {
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



    let query = "SELECT name, COUNT (products.id) AS num_products FROM products ";
    query += "LEFT JOIN departments ON products.department = departments.name GROUP BY department";




    let query2 = "SELECT product, department, price, stock_quantity, over_head FROM products LEFT JOIN departments ON products.department = departments.name";


    console.log("connected as id " + connection.threadId);
    connection.query(query, function(err, item) {
        if (err) throw err;
        console.table(item);
        connection.end();
    });
}
module.exports = supervisor

