import dbPool from "./db-pool-controller.mjs";

// use orders.user_id from the orders table to flag whether the
// product was purchased by the current user id
const getProducts = (req, res, next) => {
  if (req.user) {
    try {
      dbPool.query(
        "SELECT products.*, orders.user_id FROM products LEFT JOIN orders ON (orders.product_id=products.product_id AND orders.user_id=?)",
        [req.user.user_id],
        (error, results) => {
          if (error) throw new Error(error);
          if (results?.length) {
            req.products = results;
            return next();
          } else {
            console.error("empty database products query");
            next();
          }
        }
      );
    } catch (error) {
      console.error(error);
      return next();
    }
  } else next();
};

const buyProduct = (req, res, next) => {
  if (req.user) {
    try {
      const userId = req.user.user_id;
      const productId = req.body.productId;
      dbPool.query(
        "INSERT INTO orders VALUES (NULL, ?, ?)",
        [userId, productId],
        (error, results) => {
          if (error) throw new Error(error);
          next();
        }
      );
    } catch (error) {
      console.error(error);
      return next();
    }
  } else next();
};

const subscribeEmail = (req, res) => {
  const email = req.body.email;
  dbPool.query(
    "SELECT email FROM subscribers WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).render("subscribe");
      }

      if (results?.length)
        return res.render("subscribe", {
          message: "That email is already subscribed!",
        });
      else {
        dbPool.query(
          "INSERT INTO subscribers VALUES (NULL, ?)",
          [email],
          (error, results) => {
            if (error) {
              console.error(error);
              return res.status(500).render("subscribe");
            } else
              return res.render("subscribe", {
                email,
              });
          }
        );
      }
    }
  );
};

export { buyProduct, getProducts, subscribeEmail };
