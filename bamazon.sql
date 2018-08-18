CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    id AUTO_INCREMENT NOT NULL,
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
SET product = "The North Face Men's Borealis 18 Backpack"
WHERE id = 13;

UPDATE products
SET quantity = 50
WHERE id = 4;

CREATE TABLE departments (
    id AUTO_INCREMENT NOT NULL,
    department_id INT NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES products(id)
);

INSERT INTO departments (department_id, department_name, over_head_costs)
VALUES (1, 'Electronics', 30000),(2, 'Sports & Outdoors', 10000),(3, 'Toys & Games', 6000);

ALTER TABLE products
ADD product_sales DECIMAL(10,2) NOT NULL DEFAULT 0;

ALTER TABLE products
ADD department_id INT NOT NULL, AFTER product;

UPDATE products
SET department_id = 4
WHERE department = 'Clothing';

ALTER TABLE products
DROP product_sales;

ALTER TABLE departments
MODIFY COLUMN department_id INT AUTO_INCREMENT NOT NULL;

UPDATE departments
SET department_id = 1
WHERE id = 1;

SELECT *
FROM departments 
RIGHT JOIN products
ON products.id = departments.department_id;

SELECT department, SUM(product_sales)
FROM products 
GROUP BY products.department;

SELECT ANY_VALUE(department_id), ANY_VALUE(department_name), ANY_VALUE(over_head_costs), SUM(product_sales)
FROM departments
LEFT JOIN products
ON products.id = departments.department_id
GROUP BY department_id;

SELECT ANY_VALUE(departments.department_id), ANY_VALUE(departments.department_name), ANY_VALUE(departments.over_head_costs), SUM(products.product_sales)
FROM products
RIGHT JOIN departments
ON products.id = departments.department_id
GROUP BY department;

SELECT departments.department_id, department_name, over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales)-over_head_costs) AS total_profits
FROM departments
LEFT JOIN products
ON products.department_id = departments.department_id
GROUP BY department_name;