import mysql8 from "mysql8";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { promisify } from "util";

// create a database connection
const db = mysql8.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// when a user buys a product, add the purchase to the
// database's orders table
const buyProduct = (req, res, next) => {
  if (req.user) {
    try {
      const userId = req.user.user_id;
      const productId = Number(req.body.productId);
      db.query(
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

// get products from the products table and add them to req
// to be displayed in the profile page
// use orders.user_id from the orders table to flag whether the
// product was purchased by the current user id
const getProducts = (req, res, next) => {
  if (req.user) {
    try {
      db.query(
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

// overwrite the cookie set in the login process
const logout = async (req, res, next) => {
  res.cookie("greetings_token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};

// check if the visitor has a valid login cookie
// and add the relevant user object to req, if they do
const isLoggedIn = async (req, res, next) => {
  if (req.cookies.greetings_token) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.greetings_token,
        process.env.JWT_SECRET
      );
      db.query(
        "SELECT * FROM users WHERE user_id = ?",
        [decoded.userId],
        (error, results) => {
          if (error) throw new Error(error);
          if (results?.length) {
            req.user = results[0];
            return next();
          } else return next();
        }
      );
    } catch (error) {
      console.error(error);
      return next();
    }
  } else next();
};

// validate a user login
// check if the database-and-provided password hashes match
// if so, sign a cookie and add it to res
// then redirect to profile
// or display login page if something went wrong
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (password === "" || email === "")
      return res.status(400).render("login", { message: "c'mon ye eejit" });

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.error(error);
          return res.render("login", {
            message: "oh Jaysus, something went wrong - could you try again?",
          });
        }

        if (
          results?.length &&
          (await bcrypt.compare(password, results[0].password))
        ) {
          const userId = results[0].user_id;
          const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          const cookieOptions = {
            expires: new Date(
              Date.now() + Number(process.env.JWT_COOKIE_EXPIRES)
            ),
            httpOnly: true,
          };

          res.cookie("greetings_token", token, cookieOptions);
          res.redirect("/profile");
        } else
          return res
            .status(401)
            .render("login", { message: "somethin's wrong there now" });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// register a new user
// make sure the email is not already registered in the database
// make sure the two passwords provided match
// salt and hash the password and add the new user to the users table
const register = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.render("register", {
          message: "oh Jaysus, something went wrong - could you try again?",
        });
      }

      if (results?.length)
        return res.render("register", {
          name,
          message:
            "oh Jaysus, that email is already in use - would you have another one?",
        });
      else if (password !== confirmPassword)
        return res.render("register", {
          name,
          email,
          message: "ye eejit - those passwords don't match",
        });

      const saltyHash = await bcrypt.hash(password, 8);
      db.query(
        "INSERT INTO users SET ?",
        { name, email, password: saltyHash },
        (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).render("register", {
              message: "oh Jaysus, something went wrong - could you try again?",
            });
          } else return res.status(302).render("login", { name, email });
        }
      );
    }
  );
};

// subscribe to the website email service
// insert into the subscribers table, if the email is
// not already in there
const subscribeEmail = (req, res) => {
  const email = req.body.email;
  db.query(
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
        db.query(
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

export {
  buyProduct,
  getProducts,
  logout,
  isLoggedIn,
  login,
  register,
  subscribeEmail,
};
