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

    // let query2 = "SELECT department_id, department, SUM(product_sales) FROM products, product_sales, over_head FROM products "
    // query2 += "LEFT JOIN departments ON products.department = departments.name";

    let query3 = "SELECT departments.department_id, departments.name, departments.over_head, SUM(products.product_sales) AS product_sales, (departments.over_head - SUM(products.product_sales)) AS total_profits ";
    query3 += "FROM bamazon_db.departments INNER JOIN products ON departments.name = products.department ";
    query3 += "GROUP BY departments.department_id"

    // let responceArray = [];
    // newResponceArray = ""

    console.log("connected as id " + connection.threadId);
    connection.query(query3, function(err, item) {
        if (err) throw err;
        console.table(item);
        connection.end();

        // for (let i = 0; i < item.length; i++){
        //     responceArray.push(item[i].department)
        //     responceArray.push(item[i].department_id)
        //     let newChoiceArr = new Set(responceArray);
        //     newResponceArray = [...newChoiceArr]
        // }
        // if (err) throw err;
        // console.table(newResponceArray)
        
    });
}
module.exports = supervisor

