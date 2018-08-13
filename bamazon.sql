CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    id INT AUTO_INCREMENT NOT NULL,
    product VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product,department,price,quantity)
VALUES ('Xbox One', 'Electronics', 499.99, 25),('Macbook Pro', 'Electronics', 1799.99, 10),('40oz Wide Mouth Hydro Flask', 'Sports & Outdoors', 42.95, 100),('Patagonia Sweater', 'Sports & Outdoors', 99.00, 50),('Sharp 40" TV', 'Electronics', 349.99, 30),('Rubiks Cube', 'Toys & Games', 12.90, 100),('Spider-Man Homecoming POP', 'Toys & Games', 10.52, 40),('Doctor Strange Infinity War POP', 'Toys & Games', 14.16, 35),('Punisher POP', 'Toys & Games', 7.99, 45),('Captain America Infinty War POP', 'Toys & Games', 9.83, 50);

SELECT * 
FROM products;

SELECT id,product,price
FROM products;

UPDATE products
SET product = 'Captain America POP'
WHERE id = 10;

UPDATE products
SET quantity = 50
WHERE id = 4;