DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
id INTEGER NOT NULL AUTO_INCREMENT,
product varchar(50) NOT NULL,
department varchar(50) NOT NULL,
price INT(10) NOT NULL,
stock_quantity INTEGER(10),
PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, stock_quantity)
VALUES ("ipod", "Electronics", 250, 12),
("Fender Telecaster", "Instruments", 1250, 4),
("Crime and Punishment", "Books", 5.50, 25),
("Chase Bliss - Tonal Recall", "instruments", 450, 3),
("The Silmirillian", "Books", 25, 18);

SELECT * FROM  products;

