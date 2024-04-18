CREATE DATABASE IF NOT EXISTS greetings_from_ireland;

USE greetings_from_ireland;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
)