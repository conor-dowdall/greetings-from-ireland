CREATE DATABASE IF NOT EXISTS greetings_from_ireland;

USE greetings_from_ireland;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE table subscribers (
    subscriber_id INT AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    PRIMARY KEY (subscriber_id)
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    filename VARCHAR(20) NOT NULL,
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

INSERT INTO products 
VALUES 
(NULL, 'Alright', 'A simple Irish greeting, saying "Alright?"', 0, 'alright.mp3'),
(NULL, 'Top Of The Mornin''', 'An Irish greeting, wishing you a top morning!', 0, 'totm.mp3'),
(NULL, 'Howaya', 'A simple Irish greeting, asking how you are.', 0.5, 'howaya.mp3'),
(NULL, 'Craic', 'An Irish greeting, asking if there''s any craic.', 0.5, 'craic.mp3'),
(NULL, 'Well', 'A simple Irish greeting, saying "Well?"', 0.5, 'well.mp3'),
(NULL, 'Mother and Father', 'An Irish greeting, checking on your mother and father''s health.', 1.0, 'motherFather.mp3'),
(NULL, 'Strange or Startling', 'An Irish greeting, checking how things are with you. ', 1.0, 'strangeStartling.mp3'),
(NULL, 'How Are You?', 'An Irish greeting, asking how you are.', 5.0, 'howAreYou.mp3'),
(NULL, 'Cuttin''', 'An Irish greeting, asking how you are.', 5.0, 'cutting.mp3'),
(NULL, 'Great To See You', 'An Irish greeting, asking how you have been."', 5.0, 'greatToSeeYou.mp3'),
(NULL, 'Blessing', 'A long Irish greeting, giving you a blessing.', 10.0, 'blessing.mp3'),
(NULL, 'Irish Phrase', 'An Irish greeting, in the Irish language, hoping your road will be a successful one!', 10.0, 'irishRoad.mp3');