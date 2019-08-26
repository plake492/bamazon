# Bamazon
![head](Media/node_mysql.png)
### Technologies used 
<hr>

<div>MySQL</div>
<div>Node.js</div>
<div>Inquirer</div>
<div>cTable</div>
<div>SQL (npm package)</div>

<hr>

### How It Works

<hr>

Bamazon is a Node.js app whoch mimics an online store. On startup, the app will direct the user to select from three platforms: 
<ol>Enter as Customer</ol>
<ol>Enter as Manager</ol>
<ol>Enter as Supervisor</ol>

![node](media/b1.png)

Selecting one of these options will bring the user into a new menu.

<br>
<br>
<br>

# Customer Platform

When the user enters the customer platform, the first prompt is asking what department they would like to enter. 
![node](media/b2.png)

Selecting a specific department will run a function that loops through all items inside a department and will then show only the items acossiated with that particular department. As shown here:

![node](media/b5.png)

If the user selects ALL, then every avalible product will be displayed: 

![node](media/b3.png)

Once the user has selected a product, they will be asked to specify a qunatity,
then their total will be displayed to reflect the price of the item. multiplied by the number of units. 

![node](media/b4.png)

If the user qunatity exccedes the avalible stock, the user will be prompted to select a differnt quantity, or shop for differnet items.

![node](media/b6.png)

after selcting an item and a qunatity, the customer can continue to shop for additional items, or they can exit and their total for all items will be diplayed and charged. 

![node](media/b7.png)



<hr>


<br>
<br>
<br>

# Manager Platform

Upon slecting the Manager Platform, the user must enter the admin password. Then they will see a menue asking how they wish to proceed. 

<br>

![node](media/bM1.png)

<br>
 
### Veiw Products For Sale 
<hr>

The first option allows the user to veiw products for sale. They also can select by department, or all. The managers veiw has the addition of showing the current stock of each product:

![node](media/bM2.png)

<br>

### Veiw Low Inventory 

<hr>

The second option allows the manager to view only items that have a stock of 5 or less and will then ask if the manager would like to add to the stock:

![node](media/bM3.png)

<br>

### Add To Inventory 

<hr>

The add to stock option allows th emanager to select a specific item and add to its stock. After doing so, the user will see the previosu stock, the new stock, the cost of restock and the companies overall assets after the purchase:

![node](media/bM4.png)

<br>

### Add New Product 

<hr>

The user can also add a new item. When selecting what department the new item is under, the manager can only choose to place the new item inside an alreadty existing department, only the supervisor can add departments (but onve one is added, it will become avalible to add new items into):

![node](media/bM5.png)

<br>

### Update Product Info

<hr>

Additionally, there as the option to update the Name or Price of any existing item:

![node](media/bM6.png)

![node](media/bM7.png)


