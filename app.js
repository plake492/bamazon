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
    connection.query("SELECT * FROM products", function(err, item) {
        item.forEach(item => {
          console.log("\nid: " + item.id + " | " + item.product + " |  Price: " + item.price + " |  Department: " + item.department)
        })
        console.log("\n================================================================================\n")
        selectProduct()
      });
  });


function selectProduct() {
    inquirer
    .prompt([
        {
            type: "list",
            message: "\nplase select the ID of the product you wish to purchase",
            choices: [1,2,3,4,5],
            name: "user_product_id"
        }
    ]).then(({user_product_id}) => {
        connection.query(
            'SELECT * FROM products WHERE id = ?', [user_product_id],            
            function(err, res) {
              if (err) throw err;
              console.log("\nYou have selected: " + res[0].product + " |  Price: " + res[0].price)
              quantity(user_product_id)
    });
  });
};

function quantity(x) {
    inquirer
    .prompt([
        {
            type: "inout",
            message: "\nWhat is the quantity of your order?\n",
            name: "user_quantity"
        }
    ]).then(({user_quantity}) => {
        console.log("\n================================================================================\n")
        connection.query(
            'SELECT * FROM products WHERE id = ?', [x],            
            function(err, res) {
              if (err) throw err;
              console.log("\nCurrent stock: " + res[0].stock_quantity)

              if (user_quantity > res[0].stock_quantity) {
                  console.log("\nInsufficient quantity!\n")
                  connection.end();
              } else {
                  console.log("\n Your order total is: " + res[0].price * user_quantity + "\n")
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
                    function(err, res) {
                      if (err) throw err;
                    }
                  );
                  connection.end();
              }
            });
    });
}
  