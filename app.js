const customer = require("./customer");
const manager = require("./manager");
const supervisor = require("./supervisor");
const inquirer = require("inquirer");

const password = "coding492"

bamazon = () => {
    inquirer
    .prompt([
        {
            type: "list",
            message: "\n------------------------------------------------------------------------\nWelcome to BAMAZON. How would you like to proceed?\n------------------------------------------------------------------------\n",
            choices: ["Enter as Customer", "Enter Manager Platform","Enter Supervisor Platform"],
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
        } else if (choices === "Enter Supervisor Platform") {
            supervisor()
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



