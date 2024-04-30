import mysql from "mysql2";

const mysqlPool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_NAME,
  })
  .promise();

async function mysqlGetSubscriberByEmail(email) {
  const results = await mysqlPool.query(
    `
      SELECT * FROM subscribers 
      WHERE email = ?;
      `,
    [email]
  );

  return results[0][0];
}

async function mysqlAddSubscribeEmail(email) {
  const result = mysqlPool.query(
    `
    INSERT INTO subscribers (email)
    VALUES (?);
    `,
    [email]
  );

  return result;
}

async function mysqlAddUser(name, email, password) {
  const result = await mysqlPool.query(
    `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?);
    `,
    [name, email, password]
  );

  return result;
}

async function mysqlGetUserById(userId) {
  const results = await mysqlPool.query(
    `
    SELECT * FROM users
    WHERE user_id = ?;
    `,
    [userId]
  );

  return results[0][0];
}

async function mysqlGetUserByEmail(email) {
  const results = await mysqlPool.query(
    `
    SELECT * FROM users 
    WHERE email = ?;
    `,
    [email]
  );

  return results[0][0];
}

async function mysqlGetUserProducts(userId) {
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

async function mysqlAddUserProduct(userId, productId) {
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
  mysqlGetSubscriberByEmail,
  mysqlAddSubscribeEmail,
  mysqlAddUser,
  mysqlGetUserById,
  mysqlGetUserByEmail,
  mysqlGetUserProducts,
  mysqlAddUserProduct,
};
