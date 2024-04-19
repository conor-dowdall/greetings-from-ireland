import mysql8 from "mysql8";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const db = mysql8.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const isLoggedIn = async (req, res, next) => {
  next();
};

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
            return res.render("register", {
              message: "oh Jaysus, something went wrong - could you try again?",
            });
          } else return res.status("302").render("login", { name, email });
        }
      );
    }
  );
};

export { isLoggedIn, login, register };
