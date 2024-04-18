import mysql8 from "mysql8";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const db = mysql8.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const register = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    (error, results) => {
      if (error) console.error(error);

      if (results.length > 0)
        return res.render("register", { message: "email already in use" });
      else if (password !== confirmPassword)
        return res.render("register", { message: "passwords don't match" });
    }
  );
  res.send("wahoo");
};

export { register };
