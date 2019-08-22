const customer = require("./customer");
const manager = require("./manager");
const inquirer = require("inquirer");

const password = "coding492"

bamazon = () => {
    inquirer
    .prompt([
        {
            type: "list",
            message: "\n------------------------------------------------------------------------\nWelcome to BAMAZON. How would you like to proceed?\n------------------------------------------------------------------------\n",
            choices: ["Enter as Customer", "Enter Manager Platform"],
            name: "choices"
        }
    ]).then(({choices}) => {
        if (choices === "Enter as Customer") {
            customer();
        } else if (choices === "Enter Manager Platform") {
            inquirer
            .prompt([
                {
                    type: "password",
                    message: "Enter Admin Password",
                    mask: '*',
                    name: "password",
                }
            ])
            .then(({password}) => {
                checkPassword(password)
            })
        }
        function checkPassword (key) {
            if (key === password) {
                manager()
            } else {
                console.log("Invalid password")
                bamazon()
            };
        };
    });
};  
bamazon()



