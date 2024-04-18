import "dotenv/config";
import mysql8 from "mysql8";
import { fileURLToPath } from "url";
import path from "path";
import express from "express";

const db = mysql8.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) console.error(error);
  else console.log(`Connected to database:\t${process.env.DB_NAME}`);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port:\t${process.env.SERVER_PORT}`);
});
