import mysql from "mysql2";

const mysqlPool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
  })
  .promise();

async function getSubscriberByEmail(email) {
  const results = await mysqlPool.query(
    `
      SELECT * FROM subscribers 
      WHERE email = ?;
      `,
    [email]
  );

  return results[0][0];
}

async function addSubscribeEmail(email) {
  const result = mysqlPool.query(
    `
    INSERT INTO subscribers (email)
    VALUES (?);
    `,
    [email]
  );

  return result;
}

async function addUser(name, email, password) {
  const result = await mysqlPool.query(
    `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?);
    `,
    [name, email, password]
  );

  return result;
}

async function getUserById(userId) {
  const results = await mysqlPool.query(
    `
    SELECT * FROM users
    WHERE user_id = ?;
    `,
    [userId]
  );

  return results[0][0];
}

async function getUserByEmail(email) {
  const results = await mysqlPool.query(
    `
    SELECT * FROM users 
    WHERE email = ?;
    `,
    [email]
  );

  return results[0][0];
}

async function getUserProducts(userId) {
  const results = await mysqlPool.query(
    `
    SELECT products.*, orders.user_id 
    FROM products 
    LEFT JOIN orders ON 
      (orders.product_id=products.product_id AND 
        orders.user_id=?);
    `,
    [userId]
  );

  return results[0];
}

async function addUserProduct(userId, productId) {
  const result = await mysqlPool.query(
    `
    INSERT INTO orders (user_id, product_id)
    VALUES (?, ?);
    `,
    [userId, productId]
  );

  return result;
}

export {
  getSubscriberByEmail,
  addSubscribeEmail,
  addUser,
  getUserById,
  getUserByEmail,
  getUserProducts,
  addUserProduct,
};
