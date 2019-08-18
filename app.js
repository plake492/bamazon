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

let choicesArr = [] // stores the number of items in bamazon_db
let departmentArr = ["all"] // store depeartment names, including an ALL option
let intoArrayDepartmant = "" // store only UNIQE department names
let user_choice_product_id = "" // KEEPS SELECTED ID IF differentQantity FUNCTION IS CALLED
let userCart = []
let userCartTotal = 0

function runBamazon () {

    connection.connect(function(err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        connection.query("SELECT * FROM products", function(err, item) {
            for (let i = 0; i < item.length; i++){
                departmentArr.push(item[i].department)
                let newChoiceArr = new Set(departmentArr);
                intoArrayDepartmant = [...newChoiceArr]
            }
            if (err) throw err;
            
        console.log("\n================================================================================")
        console.log("Hello, welcome to Bamazon")
        console.log("================================================================================\n")
        runBamazonInside()
        });
    });

    function runBamazonInside() {
        inquirer
        .prompt([
            {
                type: "list",
                message: "\nWhat department would you like to veiw",
                choices: intoArrayDepartmant,
                name: "department"
            }
        ]).then(({department}) => {
            if (department === "all") {
                let query = "SELECT * FROM products"
                displayProduct(query, "All Departments")
            } else {
                let query = "SELECT * FROM products WHERE department = ?"
                displayProduct(query, department)
            }
        });
    }


    function displayProduct(query, dep) {
    // ------------------ DISPLAY PRODUCTS ------------------//
        console.log("connected as id " + connection.threadId);
        connection.query(query,[dep], function(err, item) {

            for (let i = 0; i < item.length; i++){
                choicesArr.push(item[i].id);
                
            }
            console.log("\n================================================================================")
            console.log("Welcome to the " + dep + " department.\nTake a look at what we have avalible")
            console.log("\n========================================ITEMS FOR SALE========================================\n")
            if (err) throw err;
            item.forEach(item => {
            console.log("Id: " + item.id + " | " + item.product + " |  Price: $" + item.price + " |  Department: " + item.department)
            })
            console.log("\n================================================================================\n")
            selectProduct(choicesArr)
        });
    }



    function selectProduct(x) {
        inquirer
        .prompt([
            {
                type: "list",
                message: "\nplase select the ID of the product you wish to purchase\n",
                choices: x,
                name: "user_product_id"
            }
        ]).then(({user_product_id}) => {
            user_choice_product_id = user_product_id
            connection.query(
                'SELECT * FROM products WHERE id = ?', [user_product_id],            
                function(err, res) {
                if (err) throw err;
                if (res[0].stock_quantity === 0) {
                    console.log("\nWe are currently sold out of this product\n")
                    choicesArr = []
                    runAgain()
                } else {
                    console.log("\nYou have selected: " + res[0].product + " |  Price: $" + res[0].price)
                    choicesArr = []
                    quantity(user_product_id)
                }
            });
        });
    };

    function quantity(x) {
        inquirer
        .prompt([
            {
                type: "inout",
                message: "\nWhat is the quantity of your order?\n",
                name: "user_quantity",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }
        ]).then(({user_quantity}) => {
            connection.query(
                'SELECT * FROM products WHERE id = ?', [x],            
                function(err, res) {
                if (err) throw err;
                console.log("\n================================================================================")
                console.log("\nCurrent stock: " + res[0].stock_quantity)
                let orderTotal = res[0].price * user_quantity 

                if (user_quantity > res[0].stock_quantity) {
                    console.log("\n================================================================================\n")
                    console.log("\nInsufficient quantity!\n")
                    differntQuantity()
                } else {
                    console.log("\n========================================PRODUCT========================================")
                    console.log("\n Your order total is: $" + orderTotal + "\n")
                    console.log("\n================================================================================")

                    userCart.push(user_quantity + ":" + res[0].product + ":" + orderTotal)
                    userCartTotal += orderTotal

                    console.log("\n========================================SHOPPING CART========================================")
                    console.log("Your shopping cart: " + userCart)
                    console.log("Your current total: "  + userCartTotal)
                    console.log("\n================================================================================")
                    let newStock = res[0].stock_quantity - user_quantity;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
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
                        console.log("\nNew stock: " + newStock)
                        runAgain()
                        }
                    );
                }
            });
        });
    }
    
 function differntQuantity() {
    inquirer
    .prompt([
        {
            type: "confirm",
            message: "\nDo you want to uodate your quantity?\n",
            default: "false",
            name: "responce"
        }
    ]).then(({responce}) => {
        if (responce) {
            quantity(user_choice_product_id)
        } else {
            runAgain();
            return;
            };
        });
    };

    function runAgain() {
        inquirer
        .prompt([
            {
                type: "confirm",
                message: "\nWould you like to look at other products?\n",
                default: "false",
                name: "again"
            }
        ]).then(({again}) => {
            if (again) {
                runBamazonInside()
            } else {
                console.log("Your total is: $" + userCartTotal)
                console.log("\n================================================================================")
                console.log("\n---------------- Goodbye ----------------\n")

                connection.end();
                return;
            };
        });
    };
};

runBamazon()