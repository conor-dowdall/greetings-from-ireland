CREATE DATABASE IF NOT EXISTS greetings_from_ireland;

USE greetings_from_ireland;

DROP VIEW IF EXISTS products_orders;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(5.2) NOT NULL,
    filename VARCHAR(50) NOT NULL,
    PRIMARY KEY (product_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE VIEW products_orders AS
SELECT products.*, orders.user_id
FROM products
    LEFT JOIN orders USING (product_id);