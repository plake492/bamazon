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

    function runSupervisor () {

        console.log("\n================================================================================")
        console.log("Hello! Welcome to the Bamazon Supervisor Platform")
        console.log("================================================================================\n")

        runSupervisorInside()
    }
    function runSupervisorInside() {
        inquirer
        .prompt([
            {
                type: "list",
                message: "\nWhat would you like to do?",
                choices: ["Veiw Department Info", "Create New Department"],
                name: "action"
            }
        ]).then(({action}) => {
            if (action === "Veiw Department Info") {
                return veiwDepartment();
            } else {
                return createDepartment();
            }

        });
    }
    function veiwDepartment() {

        let query = "SELECT departments.department_id, departments.name, SUM(products.num_product_sales) AS num_product_sales, SUM(products.product_sales / products.num_product_sales) AS Avg_sales_price, "
        query += "departments.over_head AS department_over_head, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head) AS total_profits ";
        query += "FROM bamazon_db.departments INNER JOIN products ON departments.name = products.department ";
        query += "GROUP BY departments.department_id"

        console.log("connected as id " + connection.threadId + "\n");
        connection.query(query, function(err, item) {
            if (err) throw err;
            console.table(item);
            runAgain()            
        });
    }

    function createDepartment() {

        inquirer
        .prompt([
            {
                type: "input",
                message: "\nWhat is the name of the new department?\n",
                name: "name"
            },
            {
                type: "input",
                message: "\nWhat is the over head costs?\n",
                name: "overHead"
            }
        ]).then(({name, overHead}) => {
            
            connection.query("INSERT INTO departments (name, over_head) VALUES(?, ?)", 
            [name, overHead], 
            function(err) {
            if (err) throw err;

            connection.query("SELECT * FROM departments", function(err, item) {
                if (err) throw err;

                console.table(item.slice(-1)[0])
                runAgain()
                });
            });
        });
    };

    runSupervisor()

    function runAgain() {
        inquirer
        .prompt([
            {
                type: "confirm",
                message: "\nWould you like to do somthing else?\n",
                default: "false",
                name: "again"
            }
        ]).then(({again}) => {
            if (again) {
                runSupervisorInside()
            } else {
                console.log("\n================================================================================")
                console.log("\n---------------------------------- Goodbye ----------------------------------\n")
                connection.end();
                return;
            };
        });
    };
};
module.exports = supervisor