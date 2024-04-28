import dbPool from "./db-pool-controller.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { promisify } from "util";

const logout = async (req, res, next) => {
  res.cookie("greetings_token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};

const isLoggedIn = async (req, res, next) => {
  if (req.cookies.greetings_token) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.greetings_token,
        process.env.JWT_SECRET
      );
      dbPool.query(
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (password === "" || email === "")
      return res.status(401).render("login", { message: "c'mon ye eejit" });

    dbPool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).render("login", {
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
  dbPool.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).render("register", {
          message: "oh Jaysus, something went wrong - could you try again?",
        });
      }

      if (results?.length)
        return res.status(401).render("register", {
          name,
          message:
            "oh Jaysus, that email is already in use - would you have another one?",
        });
      else if (password !== confirmPassword)
        return res.status(401).render("register", {
          name,
          email,
          message: "ye eejit - those passwords don't match",
        });

      const saltyHash = await bcrypt.hash(password, 8);
      dbPool.query(
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

export { logout, isLoggedIn, login, register };
