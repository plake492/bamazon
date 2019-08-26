const managerApp = function(){

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
    let choicesArr = []                 // stores the number of items in bamazon_db
    let departmentArr = ["All"]         // store depeartment names, including an ALL option
    let intoArrayDepartmant = ""        // store only UNIQE department names
    let itemsList = []
    let table = cTable.getTable();
    let itemIDArray = []

    function runManager() {
        connection.connect(function(err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId);
            connection.query("SELECT * FROM departments", function(err, item) {

                for (let i = 0; i < item.length; i++){
                    departmentArr.push(item[i].name)
                    let newChoiceArr = new Set(departmentArr);
                    intoArrayDepartmant = [...newChoiceArr]
                }
                if (err) throw err;
                    
                console.log("\n================================================================================")
                console.log("Hello! Welcome to the Bamazon Manager Platform")
                console.log("================================================================================\n")
                runManagerInside()
            });
        });

        function runManagerInside() {
            inquirer
            .prompt([
                {
                    type: "list",
                    message: "\nWhat would you like to do?",
                    choices: ["Veiw Products for Sale", "Veiw Low Inventory", "Add to Inventory", "Add New Product","Update Product Info"],
                    name: "action"
                }
            ]).then(({action}) => {
                console.log(action)
                switch (action){
                    case "Veiw Products for Sale":
                        veiwProducts()
                        break;
                    case  "Veiw Low Inventory":
                        checkLowInventory()
                        break;
                    case "Add to Inventory":
                        addToInventory()
                        break;
                    case "Add New Product":
                        addProduct()
                        break;
                    case "Update Product Info":
                        updateProductInfo()
                        break;
                }
            });
        }

        // ====================================== DISPLAY PRODUCTS ======================================//
        function veiwProducts() {
            inquirer
            .prompt([
                {
                    type: "list",
                    message: "\nWhat department would you like to veiw",
                    choices: intoArrayDepartmant,
                    name: "department"
                }
            ]).then(({department}) => {
                if (department === "All") {
                    let query = "SELECT * FROM products"
                    let message = "Take a look at what we have avalible"
                    displayProduct(query, "All Departments", message)
                } else {
                    let query = "SELECT * FROM products WHERE department = ?"
                    let message = "Welcome to the " + department + " department.\nTake a look at what we have avalible"
                    displayProduct(query, department, message)
                }
            });
        }

        function displayProduct(query, dep, message) {
            console.log("connected as id " + connection.threadId);
            connection.query(query,[dep], function(err, item) {

                for (let i = 0; i < item.length; i++){
                    choicesArr.push(item[i].id);
                    
                }
        
                console.log("\n================================================================================")
                console.log(message)
                console.log("\n--------------------ITEMS FOR SALE--------------------\n")
                if (err) throw err;
                
                item.forEach(item => {

                    itemsList.push(
                        {
                        "Product ID": item.id,
                        Product: item.product,
                        Price: "$" + item.price,
                        Department: item.department,
                        "Current Stock": item.stock_quantity
                        }
                    )
                    table = cTable.getTable(itemsList);

                })
                console.log(table)
                table = cTable.getTable();
                itemsList =[]
                choicesArr = []
                runAgain()
            });
        }



        function checkLowInventory() {
            console.log("connected as id " + connection.threadId);
            connection.query("SELECT * FROM products", function(err, item) {

        
                console.log("\n================================================================================")
                console.log("\n--------------------LOW INVENTORY--------------------\n")
                if (err) throw err;
                
                item.forEach(item => {

                    if (item.stock_quantity <= 5) {
                    itemsList.push(
                        {
                        "Product ID": item.id,
                        Product: item.product,
                        Price: "$" + item.price,
                        Department: item.department,
                        "Current Stock": item.stock_quantity
                        }
                        )
                    table = cTable.getTable(itemsList);
                    }

                })
                if (itemsList.length != 0) {
                    console.log(table)
                    table = cTable.getTable();
                    itemsList =[]
                    LowInventoryAdd()
                }  else {
                    console.log("\nAll inventory is currently fully stocked\n")
                    table = cTable.getTable();
                    itemsList =[]
                    runAgain()
                }
            });
        }

        // ====================================== ADD TO INVENTORY ======================================//
        function addToInventory () {
            console.log("connected as id " + connection.threadId);
            connection.query("SELECT * FROM products", function(err, item) {
                
                for (let i = 0; i < item.length; i++){
                    choicesArr.push(item[i].id);
                    
                }
                if (err) throw err;
                console.log("\n------------------------------------------ITEMS ------------------------------------------\n")
                item.forEach(item => {
                    itemsList.push(
                        {
                        "Product ID": item.id,
                        Product: item.product,
                        Price: "$" + item.price,
                        Department: item.department,
                        "Current Stock": item.stock_quantity
                        }
                        )
                    table = cTable.getTable(itemsList);
                    itemIDArray.push(item.id)   
                })
                console.log(table)
                addItem() 
                table = cTable.getTable();
                itemsList =[]
                choicesArr = []

                function addItem() {
                    inquirer
                    .prompt([
                        {
                            type: "list",
                            message: "\nSelect and Item",
                            choices: itemIDArray,
                            name: "ID"
                        }
                    ]).then(({ID}) => {
                        console.log("connected as id " + connection.threadId);
                        connection.query("SELECT * FROM products WHERE id = ?",[ID], function(err, item) {
                            console.log("\nYou have selected " + item[0].product + "\nThere are currently " + item[0].stock_quantity + " avalible")
                            if (err) throw err;
                            itemIDArray = []
                            chooseQuantity(ID)
                            
                            function chooseQuantity (x) {
                                inquirer
                                .prompt([
                                    {
                                        type: "input",
                                        message: "\nHow many units would you like to add?\n",
                                        name: "quantity"
                                    }
                                ]).then(({quantity}) => {

                                    restockPrice = item[0].price * quantity
                                    console.log("------------------------------------\nRestock Cost: $" + restockPrice + "\n------------------------------------")
                                    connection.query("SELECT * FROM financial", function(err, assets) {
                                        if (err) throw err;
                                        console.table("Previously avalible funds: $" + assets[0].current_assets +"\n------------------------------------")

                                        let newStock = item[0].stock_quantity + parseInt(quantity)
                                        connection.query("UPDATE products SET ? WHERE ?",  
                                        [
                                            {
                                                stock_quantity: newStock
                                            },
                                            {
                                                id: x
                                            }
                                        ], 
                                        function(err) {
                                            if (err) throw err;

                                            let newProfit = assets[0].current_assets - restockPrice
                                            console.log("\nThere are now " + newStock + " " + item[0].product + " in stock")

                                            connection.query("UPDATE financial SET current_assets = ?", [newProfit], function(err) {
                                                if (err) throw err;
                                                console.log("------------------------------------\nCurrently avalible funds: $" + newProfit +"\n------------------------------------")
                                                runAgain()
                                            });
                                        });
                                    });
                                });
                            };
                        });
                    });
                };
            });
        };

        // ====================================== ADD NEW PRODUCT ======================================//
        function addProduct (){
        
            inquirer
            .prompt([
                {
                    type: "input",
                    message: "\nWhat is the name of the new product\n",
                    name: "name"
                },
                {
                    type: "list",
                    message: "\nWhat is the department of the new product\n",
                    choices: intoArrayDepartmant,
                    name: "department"
                },
                {
                    type: "input",
                    message: "\nWhat is the price of the new product\n",
                    name: "price"
                },
                {
                    type: "input",
                    message: "\nWhat is the staring stock quantity of the new product\n",
                    name: "stock"
                }
            ]).then(({name, department, price, stock}) => {
                
                connection.query("INSERT INTO products (product, department, price, stock_quantity)VALUES(?, ?, ?, ?)", 
                [name, department, price, stock], 
                function(err) {

                    if (err) throw err;
                    newStockPrice = price * stock
                    console.log("------------------------------------\nNew Product Cost: $" + newStockPrice + "\n------------------------------------");

                    connection.query("SELECT * FROM financial", function(err, assets) {
                        if (err) throw err;

                        console.table("Previously avalible funds: $" + assets[0].current_assets +"\n------------------------------------")
                        console.log("\nYou have just added a new item");

                        connection.query("SELECT * FROM products", function(err, item) {
                            if (err) throw err;

                            console.table(item.slice(-1)[0])
                            let newProfit = assets[0].current_assets - newStockPrice;

                            connection.query("UPDATE financial SET current_assets = ?", [newProfit], function(err) {
                                if (err) throw err;

                                    console.log("------------------------------------\nCurrently avalible funds: $" + newProfit +"\n------------------------------------")
                                    runAgain()                
                            });
                        })
                    })
                });
            })
        }

        // ====================================== UPDATE PRODUCT ======================================//
        function updateProductInfo() {
            console.log("connected as id " + connection.threadId);
            connection.query("SELECT * FROM products", function(err, item) {

                for (let i = 0; i < item.length; i++){
                    choicesArr.push(item[i].id);
                
                }
        
                console.log("\n================================================================================")
                if (err) throw err;
                
                item.forEach(item => {

                    itemsList.push(
                        {
                        Quantity: item.id,
                        Product: item.product,
                        Department: item.department,
                        Price: "$" + item.price,
                        "Current Stock": item.stock_quantity
                        }
                        );
                    table = cTable.getTable(itemsList);
                    itemIDArray.push(item.id)

                })
                console.log(table)
                chooseItem()
                function chooseItem() {
                    inquirer
                    .prompt([
                        {
                            type: "list",
                            message: "\nSelect and Item",
                            choices: itemIDArray,
                            name: "ID"
                        }
                    ]).then(({ID}) => {
                        console.log("connected as id " + connection.threadId);
                        connection.query("SELECT * FROM products WHERE id = ?",[ID], function(err, item) {
                            console.log("\nYou have selected " + item[0].product + "\n")
                            if (err) throw err;
                            itemIDArray = []

                            changeSomthing()
                            function changeSomthing (){
                                inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        message: "\nWhat would you like to change?\n",
                                        choices: ["product", "price"],
                                        name: "change"
                                    }, 
                                    {
                                        type: "input",
                                        message: "Input change here: ",
                                        name: "x"
                                    }
                                ]).then(({change, x}) => {
                                    connection.query(`UPDATE products SET ${change} = ? WHERE id = ?`, 
                                    [x, ID], 
                                    function(err) {

                                        if (err) throw err;

                                        console.log("\nProduct " + ID +  " Updated\n " + change + " is now: " + x + "\n");
                                        connection.query("SELECT * FROM products WHERE id = ?", [ID], function(err, item) {
                                            console.table(item[0]);
                                            itemsList = [];
                                            runAgain();
                                        });
                                    });
                                });
                            };
                        });
                    });
                };
            });
        };


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
                    runManagerInside()
                } else {
                    console.log("\n================================================================================")
                    console.log("\n---------------------------------- Goodbye ----------------------------------\n")
                    connection.end();
                    return;
                };
            });
        };
        
        function LowInventoryAdd() {
            inquirer
            .prompt([
                {
                    type: "confirm",
                    message: "\nWould you like to add to inventory?\n",
                    default: "false",
                    name: "again"
                }
            ]).then(({again}) => {
                if (again) {
                    addToInventory()
                } else {
                runAgain()
                };
            });
        };
        
    }

    runManager();
}

module.exports = managerApp