DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
id INTEGER NOT NULL AUTO_INCREMENT,
product varchar(50) NOT NULL,
department varchar(50) NOT NULL,
price INT(10) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("iPod", "Electronics", 250, 12),
("42' LED Smart TV", "Electronics", 350, 20),
("LIRI-Bot", "Electronics", 25, 1000),
("Drone", "Electronics", 450, 10),
("Crime and Punishment", "Books", 5.50, 25),
("Healing With Whole Foods", "Books", 25, 30),
("Deep Nutritian", "Books", 28, 150),
("Fundamentals of JavaScript","Books", 30, 250),
("The Silmirillian", "Books", 25, 18),
("Analog Delay Pedal", "Instruments", 450, 3),
("Morgan PR 12 Amp", "Instruments", 1700, 2),
("Fender Telecaster", "Instruments", 1250, 5),
("Greensville Acoustic Guitar", "Instruments", 15050, 1),
("Roland Electric Drum Kit", "Instruments", 950, 10),
("Wooden Train Set", "Toys", 12, 55),
("ATAT Lego set", "Toys", 180, 30),
("Nerf Football", "Toys", 8.50, 125),
("Duplo Set - 25 piece", "Toys", 25, 100),
("Tebby Bear", "Toys", 10, 1000);


SELECT * FROM  products;

